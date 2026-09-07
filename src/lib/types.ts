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
}

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
  ppt: "PPT",
};
