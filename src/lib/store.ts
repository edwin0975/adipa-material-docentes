import { randomUUID } from "crypto";
import { CLASES_SEED, PROGRAMA } from "./seed-data";
import type { Estado, Solicitud, TipoMaterial } from "./types";

// Store en memoria del proceso del servidor. Ver BRIEF.md, sección
// "Fuera de alcance": esto es intencional para esta prueba técnica — no
// hay base de datos real, el estado se reinicia si el servidor se
// reinicia o se vuelve a desplegar. Se usa globalThis para sobrevivir al
// hot-reload de `next dev` y a llamadas repetidas dentro de la misma
// instancia de servidor.
declare global {
  var __solicitudesStore: Solicitud[] | undefined;
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

  return {
    id: randomUUID(),
    linkToken: randomUUID(),
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
              ? `presentacion_${docente.toLowerCase().replace(/\s+/g, "_")}.${ext}`
              : `material_apoyo_${c.clase.toLowerCase().replace(/\s+/g, "_")}.${ext}`;
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

function getStore(): Solicitud[] {
  if (!global.__solicitudesStore) {
    global.__solicitudesStore = seedSolicitudes();
  }
  return global.__solicitudesStore;
}

export function listSolicitudes(): Solicitud[] {
  return [...getStore()].sort((a, b) => a.fechaLimite.localeCompare(b.fechaLimite));
}

export function getSolicitud(id: string): Solicitud | undefined {
  return getStore().find((s) => s.id === id);
}

export function getSolicitudByToken(token: string): Solicitud | undefined {
  return getStore().find((s) => s.linkToken === token);
}

export function updateSolicitud(id: string, patch: Partial<Solicitud>): Solicitud | undefined {
  const store = getStore();
  const idx = store.findIndex((s) => s.id === id);
  if (idx === -1) return undefined;
  store[idx] = { ...store[idx], ...patch };
  return store[idx];
}

export function resetStore(): void {
  global.__solicitudesStore = seedSolicitudes();
}
