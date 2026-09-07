"use server";

import { revalidatePath } from "next/cache";
import { getSolicitud, updateSolicitud } from "@/lib/store";

function revalidar(id: string) {
  revalidatePath("/");
  revalidatePath(`/solicitud/${id}`);
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

export async function marcarListoYSubirDrive(id: string, nombreFinal?: string) {
  const solicitud = await getSolicitud(id);
  if (!solicitud) return { error: "No se encontró la solicitud." };

  if (solicitud.tipoMaterial === "ppt" && !nombreFinal?.trim()) {
    return {
      error:
        "Antes de marcar como listo, ponle el nombre final al PPT (convención: Clase - Nombre de la clase - Programa).",
    };
  }

  // Simulado: no se llama a la API real de Google Drive en esta versión
  // (ver BRIEF.md, "Fuera de alcance").
  await updateSolicitud(id, {
    estado: "subido_drive",
    nombreFinal: solicitud.tipoMaterial === "ppt" ? nombreFinal?.trim() : solicitud.nombreFinal,
  });
  revalidar(id);
  return { error: null };
}
