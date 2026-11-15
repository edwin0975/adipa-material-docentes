import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getSolicitudByToken } from "@/lib/store";
import { ESTADOS_ENTREGABLES } from "@/lib/types";
import { blobDisponible } from "@/lib/blob";
import { MAX_MB_BLOB } from "@/lib/entrega";

// Da permiso para subir un archivo directo del navegador del docente a Vercel
// Blob, sin pasar por la app (así no choca con el tope de 4,5 MB de Vercel).
//
// El permiso solo se entrega si el link del docente es válido y su solicitud
// todavía admite entregas, y solo para una ruta que empiece con su propio
// link: «entrega/<link>/<archivo>». El archivo no es público: se lee desde la
// app (api/archivo/[id]), que es la única que lo entrega.
export async function POST(request: Request): Promise<NextResponse> {
  if (!blobDisponible()) {
    return NextResponse.json({ error: "Almacenamiento no disponible." }, { status: 503 });
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const respuesta = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const token = clientPayload ?? "";
        const solicitud = token ? await getSolicitudByToken(token) : undefined;
        if (!solicitud || !ESTADOS_ENTREGABLES.includes(solicitud.estado)) {
          throw new Error("Este link no admite entregas.");
        }
        const prefijo = `entrega/${token}/`;
        if (
          !pathname.startsWith(prefijo) ||
          pathname.length > 600 ||
          pathname.slice(prefijo.length).includes("/") ||
          pathname.includes("..")
        ) {
          throw new Error("Ruta de archivo no válida.");
        }
        return {
          maximumSizeInBytes: MAX_MB_BLOB * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(respuesta);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
