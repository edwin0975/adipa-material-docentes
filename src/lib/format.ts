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
// tablero y en el detalle de forma consistente. Solo paleta oficial de ADIPA
// (DESIGN.md): el color fuerte queda para lo que requiere acción (por
// revisar) y lo ya cerrado; el amarillo activo solo marca la escalación.
export const ESTADO_BADGE: Record<Estado, string> = {
  pendiente: "bg-brand-soft text-brand-navy border-line-strong",
  contactado_whatsapp: "bg-brand-sky text-brand-navy border-brand-secondary/40",
  escalado_direccion: "bg-accent-yellow/30 text-brand-navy border-accent-yellow",
  recibido: "bg-brand text-white border-brand",
  subido_drive: "bg-brand-navy text-white border-brand-navy",
  excepcion: "bg-white text-muted border-line-strong",
};
