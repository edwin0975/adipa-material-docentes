import { formatFechaLarga } from "./format";
import { NOMBRE_DEL_MATERIAL } from "./etiqueta";
import type { Solicitud } from "./types";

// Mensaje listo para copiar y enviar al docente (BRIEF.md, «Envío del link
// al docente»). Tono formal y cercano, con el glosario de ADIPA
// (estilo-comunicativo.md): «docente», «presentación de la clase»,
// «material de apoyo».
export function mensajeParaDocente(s: Solicitud, urlBase: string): string {
  const material = NOMBRE_DEL_MATERIAL[s.tipoMaterial];
  const plazo =
    s.tipoMaterial === "ppt" && s.ventanaInicio
      ? `Puedes entregarla entre el ${formatFechaLarga(s.ventanaInicio)} y el ${formatFechaLarga(s.fechaLimite)}.`
      : `Te pedimos entregarlo a más tardar el ${formatFechaLarga(s.fechaLimite)}.`;
  const link = `${urlBase}/entrega/${s.linkToken}`;

  return [
    `Junto con saludar, ${s.docente}, te escribimos desde Gestión académica de Adipa.`,
    "",
    `Para tu clase «${s.nombreClase}» (${s.modulo} · ${s.clase}) del ${s.programa}, que se dicta el ${formatFechaLarga(s.fechaClase)}, necesitamos que nos compartas ${material}.`,
    "",
    plazo,
    "",
    "Puedes subir el archivo, sin iniciar sesión, desde este link:",
    link,
    "",
    "Muchas gracias por tu apoyo.",
    "Equipo Adipa · Gestión académica",
  ].join("\n");
}
