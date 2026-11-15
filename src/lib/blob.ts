import { del } from "@vercel/blob";
import type { Archivo } from "./types";

// ¿El proyecto tiene un almacenamiento de Vercel Blob conectado? Vercel agrega
// la variable BLOB_READ_WRITE_TOKEN al crear el almacenamiento (ver BRIEF.md).
// Sin ella la app usa el modo de prueba: archivos livianos en la base de datos.
export function blobDisponible(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

// Borra del almacenamiento los archivos que ya no se necesitan (el docente
// quitó uno, reemplazó otro o la coordinadora rechazó la entrega). Si falla no
// se interrumpe nada: un archivo suelto en el almacenamiento no afecta a nadie.
export async function borrarDeBlob(archivos: Archivo[] | undefined): Promise<void> {
  const rutas = (archivos ?? []).flatMap((a) => (a.blobPathname ? [a.blobPathname] : []));
  if (rutas.length === 0 || !blobDisponible()) return;
  try {
    await del(rutas);
  } catch (e) {
    console.error("No se pudo borrar del almacenamiento:", e);
  }
}
