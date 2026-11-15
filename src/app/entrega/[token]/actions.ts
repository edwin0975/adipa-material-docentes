"use server";

import { revalidatePath } from "next/cache";
import { getSolicitudByToken, updateSolicitud } from "@/lib/store";
import { ESTADOS_ENTREGABLES } from "@/lib/types";
import { MAX_ARCHIVOS, MAX_BYTES_POR_ARCHIVO, MAX_MB_POR_ARCHIVO } from "@/lib/entrega";

// La entrega tiene tres pasos, para que cada archivo viaje en su propia
// solicitud (Vercel limita cada una a unos 4,5 MB):
//   1. agregarArchivo: guarda un archivo (puede llamarse varias veces).
//   2. quitarArchivo: el docente saca uno que subió por error.
//   3. finalizarEntrega: recién ahí la solicitud pasa a «Recibido» y la
//      coordinadora la ve para revisar.
// Mientras no se finaliza, lo subido queda como entrega a medias.

function revalidar(id: string, token: string) {
  revalidatePath("/");
  revalidatePath(`/solicitud/${id}`);
  revalidatePath(`/entrega/${token}`);
}

export async function agregarArchivo(token: string, formData: FormData) {
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
  if (file.size > MAX_BYTES_POR_ARCHIVO) {
    return {
      error: `«${file.name}» es muy grande (máximo ${MAX_MB_POR_ARCHIVO} MB por archivo). Si pesa más, comprímelo o divídelo en partes.`,
    };
  }

  const previos = solicitud.archivos ?? [];
  // Si el docente vuelve a subir un archivo con el mismo nombre (por ejemplo
  // al reintentar), reemplaza al anterior en vez de duplicarse.
  const sinRepetido = previos.filter((a) => a.nombreOriginal !== file.name);
  if (sinRepetido.length >= MAX_ARCHIVOS) {
    return { error: `Se pueden entregar hasta ${MAX_ARCHIVOS} archivos por solicitud.` };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  await updateSolicitud(solicitud.id, {
    archivos: [
      ...sinRepetido,
      {
        nombreOriginal: file.name,
        tipoMime: file.type || "application/octet-stream",
        fechaSubida: new Date().toISOString(),
        contenidoBase64: buffer.toString("base64"),
      },
    ],
  });

  revalidar(solicitud.id, token);
  return { error: null };
}

export async function quitarArchivo(token: string, nombreOriginal: string) {
  const solicitud = await getSolicitudByToken(token);
  if (!solicitud) return { error: "No se encontró la solicitud." };
  if (!ESTADOS_ENTREGABLES.includes(solicitud.estado)) {
    return { error: "Esta solicitud ya no admite cambios." };
  }
  await updateSolicitud(solicitud.id, {
    archivos: (solicitud.archivos ?? []).filter((a) => a.nombreOriginal !== nombreOriginal),
  });
  revalidar(solicitud.id, token);
  return { error: null };
}

export async function finalizarEntrega(token: string) {
  const solicitud = await getSolicitudByToken(token);
  if (!solicitud) return { error: "No se encontró la solicitud." };
  if (!ESTADOS_ENTREGABLES.includes(solicitud.estado)) {
    return { error: "Esta solicitud ya no admite nuevas entregas." };
  }
  if (!solicitud.archivos?.length) {
    return { error: "Selecciona al menos un archivo antes de entregar." };
  }

  await updateSolicitud(solicitud.id, {
    estado: "recibido",
    motivoRechazo: undefined,
    fechaRechazo: undefined,
  });
  revalidar(solicitud.id, token);
  return { error: null };
}
