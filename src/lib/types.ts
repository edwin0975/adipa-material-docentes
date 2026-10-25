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
  contenidoBase64: string;
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
  nombreFinal?: string; // solo relevante/editable para "ppt"
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
