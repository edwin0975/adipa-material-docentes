import type { Estado } from "./types";

export function formatFecha(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  return d.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatFechaHora(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Clases Tailwind por estado, para pintar la insignia (badge) en el
// tablero y en el detalle de forma consistente.
export const ESTADO_BADGE: Record<Estado, string> = {
  pendiente: "bg-amber-100 text-amber-800 border-amber-200",
  contactado_whatsapp: "bg-sky-100 text-sky-800 border-sky-200",
  escalado_direccion: "bg-orange-100 text-orange-800 border-orange-200",
  recibido: "bg-violet-100 text-violet-800 border-violet-200",
  subido_drive: "bg-emerald-100 text-emerald-800 border-emerald-200",
  excepcion: "bg-rose-100 text-rose-800 border-rose-200",
};
