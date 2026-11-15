import type { Archivo, Solicitud } from "./types";

// Nombre final que recibe el material al autorizarlo (BRIEF.md, regla
// «Nombre final»). Formato por confirmar con ADIPA:
//   presentación → «Clase N - Nombre de la clase - Diplomado»
//   material de apoyo → «Material - Clase N - Nombre de la clase - Diplomado»
export function nombreSugerido(
  s: Pick<Solicitud, "tipoMaterial" | "clase" | "nombreClase" | "programa">,
): string {
  const base = `${s.clase} - ${s.nombreClase} - ${s.programa}`;
  return s.tipoMaterial === "apoyo" ? `Material - ${base}` : base;
}

export const NOMBRE_DEL_MATERIAL = {
  apoyo: "el material de apoyo",
  ppt: "la presentación de la clase",
} as const;

// Mismas frases con la preposición ya contraída, para que el texto salga
// bien escrito: «del material de apoyo», «al material de apoyo».
export const DEL_MATERIAL = {
  apoyo: "del material de apoyo",
  ppt: "de la presentación de la clase",
} as const;

export const AL_MATERIAL = {
  apoyo: "al material de apoyo",
  ppt: "a la presentación de la clase",
} as const;

function extension(nombre: string): string {
  const i = nombre.lastIndexOf(".");
  return i > 0 && nombre.length - i <= 8 ? nombre.slice(i) : "";
}

// Nombres con que queda cada archivo al autorizar: el nombre final base,
// con número cuando hay más de un archivo — «… (1).pdf», «… (2).pdf» — y la
// extensión de cada archivo original.
export function nombresFinales(
  base: string,
  archivos: Pick<Archivo, "nombreOriginal">[],
): string[] {
  const limpio = base.trim();
  return archivos.map((a, i) => {
    const num = archivos.length > 1 ? ` (${i + 1})` : "";
    return `${limpio}${num}${extension(a.nombreOriginal)}`;
  });
}
