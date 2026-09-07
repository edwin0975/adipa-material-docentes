// Datos de ejemplo derivados de un calendario académico real de ADIPA
// (Diplomado Salud Mental: Ejercicio Clínico Psicoanalítico), simulando lo
// que vendría de importar la planilla real. Ver BRIEF.md, sección
// "Fuera de alcance": el importador real de planilla no se construye en
// esta versión, así que estos datos vienen precargados.

export interface ClaseSeed {
  modulo: string;
  clase: string;
  nombreClase: string;
  docentes: string[]; // más de un elemento => se genera una solicitud por docente
  fechaClase: string; // ISO date (YYYY-MM-DD)
}

export const PROGRAMA =
  "Diplomado Salud Mental: Ejercicio Clínico Psicoanalítico (México)";

export const CLASES_SEED: ClaseSeed[] = [
  {
    modulo: "Módulo 1",
    clase: "Clase 1",
    nombreClase: "La revolución psicoanalítica",
    docentes: ["Nicolás Santander", "Gonzalo Miranda Hiriart"],
    fechaClase: "2025-06-05",
  },
  {
    modulo: "Módulo 1",
    clase: "Clase 2",
    nombreClase: "Hacia una clínica de las relaciones objetales",
    docentes: ["Andrés Beytia"],
    fechaClase: "2025-06-06",
  },
  {
    modulo: "Módulo 2",
    clase: "Clase 5",
    nombreClase: "¿Qué es un paciente en psicoanálisis?",
    docentes: ["Gonzalo Miranda Hiriart"],
    fechaClase: "2025-07-04",
  },
  {
    modulo: "Módulo 2",
    clase: "Clase 7",
    nombreClase: "La transferencia: obstáculo y aliado del tratamiento",
    docentes: ["Pablo Reyes"],
    fechaClase: "2025-07-18",
  },
  {
    modulo: "Módulo 3",
    clase: "Clase 9",
    nombreClase: "¿Qué es un caso en psicoanálisis?",
    docentes: ["Valentina Correa"],
    fechaClase: "2025-08-01",
  },
  {
    modulo: "Módulo 4",
    clase: "Clase 13",
    nombreClase: "Qué es una neurosis",
    docentes: ["José Cabrera"],
    fechaClase: "2025-08-28",
  },
];
