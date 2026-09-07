import { createHash } from "crypto";
import { Redis } from "@upstash/redis";
import { CLASES_SEED, PROGRAMA } from "./seed-data";
import type { Estado, Solicitud, TipoMaterial } from "./types";

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

function tokenDeterminista(id: string): string {
  // No es criptográficamente secreto (esto es una prueba técnica), pero
  // no es adivinable a simple vista y es estable entre reinicios.
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
    linkToken: tokenDeterminista(id),
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
          if (tipoMaterial === "ppt" && estadoInicial === "subido_drive") {
            nombreFinal = `${c.clase} - ${c.nombreClase} - ${PROGRAMA}`;
          }
        }

        solicitudes.push(
          crearSolicitud({
            programa: PROGRAMA,
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

  const data = await redis.get<Solicitud[]>(REDIS_KEY);
  if (data && data.length > 0) return data;

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

export async function listSolicitudes(): Promise<Solicitud[]> {
  const all = await readAll();
  return [...all].sort((a, b) => a.fechaLimite.localeCompare(b.fechaLimite));
}

export async function getSolicitud(id: string): Promise<Solicitud | undefined> {
  const all = await readAll();
  return all.find((s) => s.id === id);
}

export async function getSolicitudByToken(token: string): Promise<Solicitud | undefined> {
  const all = await readAll();
  return all.find((s) => s.linkToken === token);
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
