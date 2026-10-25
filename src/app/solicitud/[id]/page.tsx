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
        <Link href="/" className="text-sm text-muted hover:underline">
          ← Volver al tablero
        </Link>
      </div>

      <div className="adipa-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-brand-navy">
              {solicitud.nombreClase}
            </h1>
            <p className="text-sm text-muted">
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
            <dt className="text-subtle">Docente</dt>
            <dd className="font-medium text-brand-navy">{solicitud.docente}</dd>
          </div>
          <div>
            <dt className="text-subtle">Tipo de material</dt>
            <dd className="font-medium text-brand-navy">
              {TIPO_LABEL[solicitud.tipoMaterial]}
            </dd>
          </div>
          <div>
            <dt className="text-subtle">Fecha de la clase</dt>
            <dd className="font-medium text-brand-navy">
              {formatFecha(solicitud.fechaClase)}
            </dd>
          </div>
          <div>
            <dt className="text-subtle">
              {solicitud.tipoMaterial === "ppt" ? "Ventana de entrega" : "Fecha límite"}
            </dt>
            <dd className="font-medium text-brand-navy">
              {solicitud.tipoMaterial === "ppt" && solicitud.ventanaInicio
                ? `${formatFecha(solicitud.ventanaInicio)} — ${formatFecha(solicitud.fechaLimite)}`
                : formatFecha(solicitud.fechaLimite)}
            </dd>
          </div>
        </dl>
      </div>

      <div className="adipa-card p-6">
        <h2 className="text-sm font-semibold text-brand-navy">
          Material entregado
        </h2>
        {solicitud.archivo ? (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-adipa-control bg-brand-soft px-4 py-3 text-sm">
            <div>
              <p className="font-medium text-brand-navy">
                {solicitud.archivo.nombreOriginal}
              </p>
              <p className="text-subtle">
                Entregado el {formatFechaHora(solicitud.archivo.fechaSubida)}
              </p>
            </div>
            <a
              href={`/api/archivo/${solicitud.id}`}
              className="rounded-adipa-control border border-line-strong px-3 py-1.5 font-medium text-ink hover:bg-white"
            >
              Descargar
            </a>
          </div>
        ) : (
          <p className="mt-2 text-sm text-subtle">
            Aún no hay ningún archivo entregado por el docente.
          </p>
        )}
        {solicitud.motivoRechazo && !solicitud.archivo && (
          <p className="mt-3 rounded-adipa-control bg-danger/10 px-3 py-2 text-sm text-ink">
            <span className="font-medium">Último archivo rechazado</span>
            {solicitud.fechaRechazo
              ? ` el ${formatFechaHora(solicitud.fechaRechazo)}`
              : ""}
            : {solicitud.motivoRechazo}
          </p>
        )}
      </div>

      <div className="adipa-card p-6">
        <h2 className="text-sm font-semibold text-brand-navy">Acciones</h2>
        <div className="mt-3">
          <AccionesSolicitud solicitud={solicitud} />
        </div>
      </div>

      <div className="rounded-adipa-card border border-dashed border-line-strong bg-white p-6">
        <h2 className="text-sm font-semibold text-brand-navy">
          Link de entrega del docente
        </h2>
        <p className="mt-1 text-sm text-muted">
          Este es el link que recibe el docente para entregar su material.
          Puedes abrirlo para ver lo que ve el docente.
        </p>
        <p className="mt-3">
          <Link
            href={linkDocente}
            className="break-all text-sm font-medium text-brand-navy underline"
          >
            {linkDocente}
          </Link>
        </p>
      </div>
    </div>
  );
}
