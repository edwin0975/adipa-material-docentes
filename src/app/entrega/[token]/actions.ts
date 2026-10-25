"use server";

import { revalidatePath } from "next/cache";
import { getSolicitudByToken, updateSolicitud } from "@/lib/store";
import { ESTADOS_ENTREGABLES } from "@/lib/types";

const MAX_BYTES = 15 * 1024 * 1024; // 15 MB, suficiente para esta prueba

export async function entregarMaterial(token: string, formData: FormData) {
  const solicitud = await getSolicitudByToken(token);
  if (!solicitud) return { error: "No se encontró la solicitud." };

  // Una vez entregado, el material queda en revisión; solo vuelve a
  // abrirse si la coordinadora lo rechaza. Evita que se pise un archivo ya
  // revisado o aprobado.
  if (!ESTADOS_ENTREGABLES.includes(solicitud.estado)) {
    return { error: "Esta solicitud ya no admite nuevas entregas." };
  }

  const file = formData.get("archivo");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Selecciona un archivo antes de enviar." };
  }
  if (file.size > MAX_BYTES) {
    return { error: "El archivo es muy grande (máximo 15 MB)." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  await updateSolicitud(solicitud.id, {
    estado: "recibido",
    motivoRechazo: undefined,
    fechaRechazo: undefined,
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
