// Datos de ejemplo. El primer diplomado deriva de un calendario académico
// real de ADIPA (Diplomado Salud Mental: Ejercicio Clínico Psicoanalítico),
// simulando lo que vendría de importar la planilla real. El segundo es
// inventado a partir del nombre de un diplomado que aparece en monday, solo
// para poder probar el filtro por diplomado del tablero.
//
// Ver BRIEF.md: en la Fase 2 estos datos se reemplazan por la lectura de la
// tabla madre de monday.

export interface ClaseSeed {
  programa: string; // diplomado al que pertenece la clase
  modulo: string;
  clase: string;
  nombreClase: string;
  docentes: string[]; // más de un elemento => se genera una solicitud por docente
  fechaClase: string; // ISO date (YYYY-MM-DD)
}

export const PROGRAMA =
  "Diplomado Salud Mental: Ejercicio Clínico Psicoanalítico (México)";

export const PROGRAMA_2 =
  "Diplomado en Enfoque de Derechos y Protección de Niños, Niñas y Adolescentes";

export const CLASES_SEED: ClaseSeed[] = [
  {
    programa: PROGRAMA,
    modulo: "Módulo 1",
    clase: "Clase 1",
    nombreClase: "La revolución psicoanalítica",
    docentes: ["Nicolás Santander", "Gonzalo Miranda Hiriart"],
    fechaClase: "2025-06-05",
  },
  {
    programa: PROGRAMA,
    modulo: "Módulo 1",
    clase: "Clase 2",
    nombreClase: "Hacia una clínica de las relaciones objetales",
    docentes: ["Andrés Beytia"],
    fechaClase: "2025-06-06",
  },
  {
    programa: PROGRAMA,
    modulo: "Módulo 2",
    clase: "Clase 5",
    nombreClase: "¿Qué es un paciente en psicoanálisis?",
    docentes: ["Gonzalo Miranda Hiriart"],
    fechaClase: "2025-07-04",
  },
  {
    programa: PROGRAMA,
    modulo: "Módulo 2",
    clase: "Clase 7",
    nombreClase: "La transferencia: obstáculo y aliado del tratamiento",
    docentes: ["Pablo Reyes"],
    fechaClase: "2025-07-18",
  },
  {
    programa: PROGRAMA,
    modulo: "Módulo 3",
    clase: "Clase 9",
    nombreClase: "¿Qué es un caso en psicoanálisis?",
    docentes: ["Valentina Correa"],
    fechaClase: "2025-08-01",
  },
  {
    programa: PROGRAMA,
    modulo: "Módulo 4",
    clase: "Clase 13",
    nombreClase: "Qué es una neurosis",
    docentes: ["José Cabrera"],
    fechaClase: "2025-08-28",
  },
  // Segundo diplomado (datos inventados, solo para probar el filtro).
  {
    programa: PROGRAMA_2,
    modulo: "Módulo 1",
    clase: "Clase 1",
    nombreClase: "Fundamentos del enfoque de derechos",
    docentes: ["Camila Fuentes"],
    fechaClase: "2025-09-12",
  },
  {
    programa: PROGRAMA_2,
    modulo: "Módulo 1",
    clase: "Clase 2",
    nombreClase: "Sistemas de protección de la infancia",
    docentes: ["Rodrigo Salinas"],
    fechaClase: "2025-09-19",
  },
];
