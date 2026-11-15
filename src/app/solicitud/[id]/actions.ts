"use server";

import { revalidatePath } from "next/cache";
import { getSolicitud, updateSolicitud } from "@/lib/store";
import { AL_MATERIAL } from "@/lib/etiqueta";

function revalidar(id: string, linkToken?: string) {
  revalidatePath("/");
  revalidatePath(`/solicitud/${id}`);
  if (linkToken) revalidatePath(`/entrega/${linkToken}`);
}

export async function marcarContactadoWhatsapp(id: string) {
  await updateSolicitud(id, { estado: "contactado_whatsapp" });
  revalidar(id);
}

export async function marcarEscaladoDireccion(id: string) {
  await updateSolicitud(id, { estado: "escalado_direccion" });
  revalidar(id);
}

export async function marcarExcepcion(id: string) {
  await updateSolicitud(id, { estado: "excepcion" });
  revalidar(id);
}

// Autoriza el material recibido. Solo desde "recibido (por revisar)".
export async function autorizarYSubirDrive(id: string, nombreFinal?: string) {
  const solicitud = await getSolicitud(id);
  if (!solicitud) return { error: "No se encontró la solicitud." };

  if (solicitud.estado !== "recibido") {
    return { error: "Solo se puede autorizar un material que ya fue recibido." };
  }

  if (!nombreFinal?.trim()) {
    return {
      error: `Antes de autorizar, ponle el nombre final ${AL_MATERIAL[solicitud.tipoMaterial]} (usa el nombre sugerido o escribe el tuyo).`,
    };
  }

  // Simulado: no se llama a la API real de Google Drive hasta la Fase 3
  // (ver BRIEF.md, "Fases de construcción").
  await updateSolicitud(id, {
    estado: "subido_drive",
    nombreFinal: nombreFinal.trim(),
  });
  revalidar(id, solicitud.linkToken);
  return { error: null };
}

// Rechaza el material recibido: la solicitud vuelve a "pendiente", el
// archivo se descarta y el docente ve el motivo en su link. Avisarle al
// docente lo hace la coordinadora por su vía habitual (ver BRIEF.md).
export async function rechazarMaterial(id: string, motivo: string) {
  const solicitud = await getSolicitud(id);
  if (!solicitud) return { error: "No se encontró la solicitud." };

  if (solicitud.estado !== "recibido") {
    return { error: "Solo se puede rechazar un material que ya fue recibido." };
  }

  const motivoLimpio = motivo.trim();
  if (!motivoLimpio) {
    return { error: "Escribe el motivo del rechazo para que el docente sepa qué corregir." };
  }

  await updateSolicitud(id, {
    estado: "pendiente",
    archivos: undefined,
    nombreFinal: undefined,
    motivoRechazo: motivoLimpio,
    fechaRechazo: new Date().toISOString(),
  });
  revalidar(id, solicitud.linkToken);
  return { error: null };
}
