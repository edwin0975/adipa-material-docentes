// Límites de la entrega del docente. Vercel no deja pasar solicitudes de más
// de unos 4,5 MB, y cada archivo viaja en la suya (ver entrega/[token]/actions.ts),
// por eso el tope por archivo es 4 MB.
export const MAX_MB_POR_ARCHIVO = 4;
export const MAX_BYTES_POR_ARCHIVO = MAX_MB_POR_ARCHIVO * 1024 * 1024;
export const MAX_ARCHIVOS = 20;

export function formatTamano(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
