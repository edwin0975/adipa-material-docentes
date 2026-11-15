import type { Solicitud } from "./types";

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
