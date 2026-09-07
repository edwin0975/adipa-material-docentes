"use server";

import { revalidatePath } from "next/cache";
import { getSolicitudByToken, updateSolicitud } from "@/lib/store";

const MAX_BYTES = 15 * 1024 * 1024; // 15 MB, suficiente para esta prueba

export async function entregarMaterial(token: string, formData: FormData) {
  const solicitud = getSolicitudByToken(token);
  if (!solicitud) return { error: "No se encontró la solicitud." };

  const file = formData.get("archivo");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Selecciona un archivo antes de enviar." };
  }
  if (file.size > MAX_BYTES) {
    return { error: "El archivo es muy grande (máximo 15 MB para esta prueba)." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  updateSolicitud(solicitud.id, {
    estado: "recibido",
    archivo: {
      nombreOriginal: file.name,
      tipoMime: file.type || "application/octet-stream",
      fechaSubida: new Date().toISOString(),
      contenidoBase64: buffer.toString("base64"),
    },
  });

  revalidatePath("/");
  revalidatePath(`/solicitud/${solicitud.id}`);
  revalidatePath(`/entrega/${token}`);
  return { error: null };
}
