import { createHash, createHmac } from "crypto";
import { Redis } from "@upstash/redis";
import { CLASES_SEED } from "./seed-data";
import { nombreSugerido } from "./etiqueta";
import { ESTADOS_CERRADOS, type Estado, type Solicitud, type TipoMaterial } from "./types";

// Almacenamiento de las solicitudes.
//
// Preferido: si el proyecto tiene conectada una base de datos Redis en
// Vercel (Storage → Create Database → Upstash for Redis, o el antiguo
// Vercel KV), se usa esa — persiste de verdad entre despliegues y entre
// las distintas instancias del servidor.
//
// Si no hay ninguna conectada (por ejemplo en desarrollo local), se cae a
// un store en memoria del proceso (ver BRIEF.md, "Fuera de alcance"): en
// ese modo el estado puede reiniciarse o no compartirse entre instancias,
// aceptable solo para probar localmente, no en producción.
declare global {
  var __solicitudesStore: Solicitud[] | undefined;
}

const REDIS_KEY = "adipa:material-docentes:solicitudes";

function getRedis(): Redis | null {
  const url =
    process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

function addDays(iso: string, dias: number): string {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + dias);
  return d.toISOString().slice(0, 10);
}

function fakeArchivo(nombreOriginal: string, tipoMime: string, fechaSubida: string) {
  const contenido = Buffer.from(
    `Archivo de ejemplo para la prueba técnica de ADIPA.\nNombre: ${nombreOriginal}\nEsto simula el contenido real entregado por el docente.`,
  ).toString("base64");
  return { nombreOriginal, tipoMime, fechaSubida, contenidoBase64: contenido };
}

// IDs y tokens deterministas (no aleatorios): así, aunque el store en
// memoria se vuelva a sembrar en una instancia distinta del servidor, una
// misma solicitud (clase + docente + tipo) siempre cae en el mismo id y el
// mismo link — evita que los links de entrega dejen de funcionar.
function slug(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // quita tildes tras normalizar
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function idDeterminista(modulo: string, clase: string, docente: string, tipo: TipoMaterial): string {
  return slug(`${modulo}-${clase}-${docente}-${tipo}`);
}

// Link legible: «docente-clase-tipo-código». El nombre ayuda a reconocerlo
// de un vistazo; el código corto al final es lo que lo hace imposible de
// adivinar. Se calcula a partir de la solicitud (no se guarda), así sigue
// igual aunque el servidor se reinicie.
//
// Para que el código no se pueda calcular desde el repositorio público,
// en Vercel se define la variable de entorno LINK_SECRET (cualquier texto
// largo). Sin ella (desarrollo local) se usa un valor por defecto.
function codigoCorto(id: string): string {
  const secreto = process.env.LINK_SECRET ?? "adipa-material-docentes-local";
  const huella = createHmac("sha256", secreto).update(`entrega:${id}`).digest();
  return huella.readBigUInt64BE(0).toString(36).padStart(8, "0").slice(-8);
}

function tokenLegible(s: Pick<Solicitud, "id" | "docente" | "clase" | "tipoMaterial">): string {
  const tipo = s.tipoMaterial === "ppt" ? "presentacion" : "apoyo";
  return `${slug(s.docente)}-${slug(s.clase)}-${tipo}-${codigoCorto(s.id)}`;
}

// Token que se usaba antes de los links legibles. Se sigue aceptando para
// que los links que ya se hayan enviado no dejen de funcionar.
function tokenAnterior(id: string): string {
  return createHash("sha256").update(`entrega:${id}`).digest("hex").slice(0, 32);
}

function crearSolicitud(params: {
  programa: string;
  modulo: string;
  clase: string;
  nombreClase: string;
  docente: string;
  tipoMaterial: TipoMaterial;
  fechaClase: string;
  estadoInicial: Estado;
  archivo?: Solicitud["archivo"];
  nombreFinal?: string;
}): Solicitud {
  const { tipoMaterial, fechaClase } = params;
  const fechaLimite =
    tipoMaterial === "apoyo" ? addDays(fechaClase, -7) : addDays(fechaClase, 1);
  const ventanaInicio = tipoMaterial === "ppt" ? addDays(fechaClase, -2) : undefined;
  const id = idDeterminista(params.modulo, params.clase, params.docente, tipoMaterial);

  return {
    id,
    linkToken: tokenLegible({ id, docente: params.docente, clase: params.clase, tipoMaterial }),
    programa: params.programa,
    modulo: params.modulo,
    clase: params.clase,
    nombreClase: params.nombreClase,
    docente: params.docente,
    tipoMaterial,
    fechaClase,
    ventanaInicio,
    fechaLimite,
    estado: params.estadoInicial,
    nombreFinal: params.nombreFinal,
    archivo: params.archivo,
  };
}

// Guión de estados de ejemplo, en el mismo orden en que se generan las
// solicitudes (clase por clase, docente por docente, apoyo antes que ppt),
// para que el tablero de demo muestre variedad de estados desde el arranque.
const GUION_ESTADOS: Estado[] = [
  "pendiente",
  "pendiente", // Clase 1, docente 1 (apoyo, ppt)
  "contactado_whatsapp",
  "recibido", // Clase 1, docente 2 (apoyo, ppt)
  "subido_drive",
  "subido_drive", // Clase 2 (apoyo, ppt)
  "escalado_direccion",
  "pendiente", // Clase 5 (apoyo, ppt)
  "pendiente",
  "pendiente", // Clase 7 (apoyo, ppt)
  "recibido",
  "contactado_whatsapp", // Clase 9 (apoyo, ppt)
  "excepcion",
  "pendiente", // Clase 13 (apoyo, ppt)
];

function seedSolicitudes(): Solicitud[] {
  const solicitudes: Solicitud[] = [];
  let i = 0;

  for (const c of CLASES_SEED) {
    for (const docente of c.docentes) {
      for (const tipoMaterial of ["apoyo", "ppt"] as TipoMaterial[]) {
        const estadoInicial = GUION_ESTADOS[i] ?? "pendiente";
        i += 1;

        let archivo: Solicitud["archivo"] | undefined;
        let nombreFinal: string | undefined;

        if (estadoInicial === "recibido" || estadoInicial === "subido_drive") {
          const ext = tipoMaterial === "ppt" ? "pptx" : "pdf";
          const nombreOriginal =
            tipoMaterial === "ppt"
              ? `presentacion_${slug(docente)}.${ext}`
              : `material_apoyo_${slug(c.clase)}.${ext}`;
          archivo = fakeArchivo(
            nombreOriginal,
            tipoMaterial === "ppt"
              ? "application/vnd.openxmlformats-officedocument.presentationml.presentation"
              : "application/pdf",
            addDays(c.fechaClase, -3),
          );
          if (estadoInicial === "subido_drive") {
            nombreFinal = nombreSugerido({
              tipoMaterial,
              clase: c.clase,
              nombreClase: c.nombreClase,
              programa: c.programa,
            });
          }
        }

        solicitudes.push(
          crearSolicitud({
            programa: c.programa,
            modulo: c.modulo,
            clase: c.clase,
            nombreClase: c.nombreClase,
            docente,
            tipoMaterial,
            fechaClase: c.fechaClase,
            estadoInicial,
            archivo,
            nombreFinal,
          }),
        );
      }
    }
  }

  return solicitudes;
}

function getMemoryStore(): Solicitud[] {
  if (!global.__solicitudesStore) {
    global.__solicitudesStore = seedSolicitudes();
  }
  return global.__solicitudesStore;
}

async function readAll(): Promise<Solicitud[]> {
  const redis = getRedis();
  if (!redis) return getMemoryStore();

  const guardadas = await redis.get<Solicitud[]>(REDIS_KEY);
  // Las solicitudes guardadas antes de los links legibles traen el token
  // anterior: se recalcula siempre, porque se deriva de la propia solicitud.
  const data = guardadas?.map((s) => ({ ...s, linkToken: tokenLegible(s) }));
  if (data && data.length > 0) {
    // Solo para los datos de ejemplo: si agregamos solicitudes nuevas al
    // seed (ej. un segundo diplomado), se suman a lo ya guardado sin tocar
    // lo existente. Desaparece cuando los datos vengan de monday (Fase 2).
    const ids = new Set(data.map((s) => s.id));
    const faltantes = seedSolicitudes().filter((s) => !ids.has(s.id));
    if (faltantes.length === 0) return data;
    const unido = [...data, ...faltantes];
    await redis.set(REDIS_KEY, unido);
    return unido;
  }

  const seeded = seedSolicitudes();
  await redis.set(REDIS_KEY, seeded);
  return seeded;
}

async function writeAll(lista: Solicitud[]): Promise<void> {
  const redis = getRedis();
  if (!redis) {
    global.__solicitudesStore = lista;
    return;
  }
  await redis.set(REDIS_KEY, lista);
}

// Orden pensado para la urgencia: primero las solicitudes que aún requieren
// acción, con la fecha límite más próxima arriba (las ya vencidas quedan
// primero, porque son las más urgentes); las cerradas van al final.
export async function listSolicitudes(): Promise<Solicitud[]> {
  const all = await readAll();
  const cerrada = (s: Solicitud) => ESTADOS_CERRADOS.includes(s.estado);
  return [...all].sort((a, b) => {
    const ca = cerrada(a) ? 1 : 0;
    const cb = cerrada(b) ? 1 : 0;
    if (ca !== cb) return ca - cb;
    return a.fechaLimite.localeCompare(b.fechaLimite);
  });
}

export async function getSolicitud(id: string): Promise<Solicitud | undefined> {
  const all = await readAll();
  return all.find((s) => s.id === id);
}

export async function getSolicitudByToken(token: string): Promise<Solicitud | undefined> {
  const all = await readAll();
  return all.find((s) => s.linkToken === token || tokenAnterior(s.id) === token);
}

export async function updateSolicitud(
  id: string,
  patch: Partial<Solicitud>,
): Promise<Solicitud | undefined> {
  const all = await readAll();
  const idx = all.findIndex((s) => s.id === id);
  if (idx === -1) return undefined;
  all[idx] = { ...all[idx], ...patch };
  await writeAll(all);
  return all[idx];
}

export async function resetStore(): Promise<void> {
  const redis = getRedis();
  const seeded = seedSolicitudes();
  if (redis) {
    await redis.set(REDIS_KEY, seeded);
  } else {
    global.__solicitudesStore = seeded;
  }
}
