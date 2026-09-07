import Link from "next/link";
import { notFound } from "next/navigation";
import { getSolicitud } from "@/lib/store";
import { ESTADO_LABEL, TIPO_LABEL } from "@/lib/types";
import { ESTADO_BADGE, formatFecha, formatFechaHora } from "@/lib/format";
import AccionesSolicitud from "./AccionesSolicitud";

export default async function DetalleSolicitudPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const solicitud = await getSolicitud(id);
  if (!solicitud) notFound();

  const linkDocente = `/entrega/${solicitud.linkToken}`;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/" className="text-sm text-slate-500 hover:underline">
          ← Volver al tablero
        </Link>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              {solicitud.nombreClase}
            </h1>
            <p className="text-sm text-slate-500">
              {solicitud.programa} · {solicitud.modulo} · {solicitud.clase}
            </p>
          </div>
          <span
            className={`inline-block rounded-full border px-2.5 py-1 text-xs font-medium ${ESTADO_BADGE[solicitud.estado]}`}
          >
            {ESTADO_LABEL[solicitud.estado]}
          </span>
        </div>

        <dl className="mt-6 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-400">Docente</dt>
            <dd className="font-medium text-slate-900">{solicitud.docente}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Tipo de material</dt>
            <dd className="font-medium text-slate-900">
              {TIPO_LABEL[solicitud.tipoMaterial]}
            </dd>
          </div>
          <div>
            <dt className="text-slate-400">Fecha de la clase</dt>
            <dd className="font-medium text-slate-900">
              {formatFecha(solicitud.fechaClase)}
            </dd>
          </div>
          <div>
            <dt className="text-slate-400">
              {solicitud.tipoMaterial === "ppt" ? "Ventana de entrega" : "Fecha límite"}
            </dt>
            <dd className="font-medium text-slate-900">
              {solicitud.tipoMaterial === "ppt" && solicitud.ventanaInicio
                ? `${formatFecha(solicitud.ventanaInicio)} — ${formatFecha(solicitud.fechaLimite)}`
                : formatFecha(solicitud.fechaLimite)}
            </dd>
          </div>
        </dl>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-slate-900">
          Material entregado
        </h2>
        {solicitud.archivo ? (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-md bg-slate-50 px-4 py-3 text-sm">
            <div>
              <p className="font-medium text-slate-900">
                {solicitud.archivo.nombreOriginal}
              </p>
              <p className="text-slate-400">
                Entregado el {formatFechaHora(solicitud.archivo.fechaSubida)}
              </p>
            </div>
            <a
              href={`/api/archivo/${solicitud.id}`}
              className="rounded-md border border-slate-300 px-3 py-1.5 font-medium text-slate-700 hover:bg-white"
            >
              Descargar
            </a>
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate-400">
            Aún no hay ningún archivo entregado por el docente.
          </p>
        )}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-slate-900">Acciones</h2>
        <div className="mt-3">
          <AccionesSolicitud solicitud={solicitud} />
        </div>
      </div>

      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6">
        <h2 className="text-sm font-semibold text-slate-900">
          Link de entrega del docente
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          En producción este link lo recibe el docente por el correo
          automático corporativo. Para probar la app, ábrelo tú (o cópialo en
          otro dispositivo) y entrégalo como si fueras el docente.
        </p>
        <p className="mt-3">
          <Link
            href={linkDocente}
            className="break-all text-sm font-medium text-slate-900 underline"
          >
            {linkDocente}
          </Link>
        </p>
      </div>
    </div>
  );
}
