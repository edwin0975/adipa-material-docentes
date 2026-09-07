import { getSolicitud } from "@/lib/store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const solicitud = await getSolicitud(id);

  if (!solicitud?.archivo) {
    return new Response("Archivo no encontrado", { status: 404 });
  }

  const buffer = Buffer.from(solicitud.archivo.contenidoBase64, "base64");
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": solicitud.archivo.tipoMime,
      "Content-Disposition": `attachment; filename="${solicitud.archivo.nombreOriginal}"`,
    },
  });
}
