import { getSolicitud } from "@/lib/store";

// Descarga un archivo de la solicitud. `?n=` es la posición del archivo en
// la lista (0 por defecto), porque una solicitud puede traer varios.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const solicitud = await getSolicitud(id);
  const n = Number(new URL(request.url).searchParams.get("n") ?? "0");
  const archivo = Number.isInteger(n) ? solicitud?.archivos?.[n] : undefined;

  if (!archivo) {
    return new Response("Archivo no encontrado", { status: 404 });
  }

  const buffer = Buffer.from(archivo.contenidoBase64, "base64");
  const nombre = archivo.nombreOriginal.replace(/["\\\r\n]/g, "_");
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": archivo.tipoMime,
      "Content-Disposition": `attachment; filename="${nombre}"; filename*=UTF-8''${encodeURIComponent(archivo.nombreOriginal)}`,
    },
  });
}
