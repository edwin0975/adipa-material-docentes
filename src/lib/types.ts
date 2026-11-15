export type TipoMaterial = "apoyo" | "ppt";

export type Estado =
  | "pendiente"
  | "contactado_whatsapp"
  | "escalado_direccion"
  | "recibido"
  | "subido_drive"
  | "excepcion";

export interface Archivo {
  nombreOriginal: string;
  tipoMime: string;
  fechaSubida: string; // ISO datetime
  // El archivo vive en uno de dos lugares:
  //  - Vercel Blob (cuando el proyecto tiene un almacenamiento conectado):
  //    aquí solo se guarda su ruta y su tamaño.
  //  - Dentro de la base de datos, en base64 (modo de prueba, solo livianos).
  blobPathname?: string;
  bytes?: number;
  contenidoBase64?: string;
}

// Tamaño en bytes de un archivo, esté donde esté guardado.
export function tamanoArchivo(a: Archivo): number {
  return a.bytes ?? Math.floor(((a.contenidoBase64?.length ?? 0) * 3) / 4);
}

export interface Solicitud {
  id: string;
  linkToken: string;
  programa: string;
  modulo: string;
  clase: string; // ej. "Clase 1"
  nombreClase: string; // ej. "La revolución psicoanalítica"
  docente: string;
  tipoMaterial: TipoMaterial;
  fechaClase: string; // ISO date
  ventanaInicio?: string; // ISO date, solo para "ppt"
  fechaLimite: string; // ISO date
  estado: Estado;
  nombreFinal?: string; // etiqueta base del material al autorizarlo (apoyo y ppt)
  // Archivos entregados por el docente. El material de apoyo siempre trae
  // varios y la presentación a veces también. Mientras la solicitud sigue
  // entregable pueden ser una entrega a medias (el docente aún no la termina).
  archivos?: Archivo[];
  // Campo de cuando se entregaba un solo archivo. Los datos guardados antes
  // del cambio lo traen; al leerlos se pasa a `archivos` (ver store.ts).
  archivo?: Archivo;
  // Si la coordinadora rechazó el último archivo entregado: por qué, y
  // cuándo. La solicitud vuelve a "pendiente" y el docente ve el motivo en
  // su link. Se borra apenas el docente entrega de nuevo.
  motivoRechazo?: string;
  fechaRechazo?: string; // ISO datetime
}

// Estados en los que el docente todavía puede entregar (o volver a entregar)
// su material desde el link único.
export const ESTADOS_ENTREGABLES: Estado[] = [
  "pendiente",
  "contactado_whatsapp",
  "escalado_direccion",
];

// Estados que cuentan como solicitud cerrada (ya no requiere acción).
export const ESTADOS_CERRADOS: Estado[] = ["subido_drive", "excepcion"];

export const ESTADO_LABEL: Record<Estado, string> = {
  pendiente: "Pendiente",
  contactado_whatsapp: "Contactado por WhatsApp",
  escalado_direccion: "Escalado a dirección",
  recibido: "Recibido (por revisar)",
  subido_drive: "Subido a Drive",
  excepcion: "Excepción / sin material",
};

export const TIPO_LABEL: Record<TipoMaterial, string> = {
  apoyo: "Material de apoyo",
  ppt: "Presentación de la clase",
};
