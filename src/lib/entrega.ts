// Límites de la entrega del docente.
//
// Sin almacenamiento conectado (modo de prueba) el archivo pasa por la app y
// se guarda en la base de datos: Vercel no deja pasar solicitudes de más de
// unos 4,5 MB, por eso el tope es 4 MB por archivo.
//
// Con Vercel Blob conectado el archivo va directo del navegador al
// almacenamiento y el tope sube a 100 MB por archivo (el plan gratuito
// incluye 1 GB en total).
export const MAX_MB_PRUEBA = 4;
export const MAX_MB_BLOB = 100;
export const MAX_MB_POR_ARCHIVO = MAX_MB_PRUEBA;
export const MAX_BYTES_POR_ARCHIVO = MAX_MB_PRUEBA * 1024 * 1024;
export const MAX_ARCHIVOS = 20;

export function formatTamano(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
