import { notFound } from "next/navigation";
import { getSolicitudByToken } from "@/lib/store";
import { ESTADOS_ENTREGABLES, TIPO_LABEL } from "@/lib/types";
import { formatFecha } from "@/lib/format";
import EntregaForm from "./EntregaForm";

export default async function EntregaPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const solicitud = await getSolicitudByToken(token);
  if (!solicitud) notFound();

  const puedeEntregar = ESTADOS_ENTREGABLES.includes(solicitud.estado);

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-brand-navy">
          Entrega de material
        </h1>
        <p className="mt-1 text-sm text-muted">
          Junto con saludar, {solicitud.docente}, te compartimos lo que
          necesitamos para tu clase:
        </p>
      </div>

      <div className="adipa-card p-6 text-sm">
        <dl className="space-y-2">
          <div className="flex justify-between gap-4">
            <dt className="text-subtle">Programa</dt>
            <dd className="text-right font-medium text-brand-navy">
              {solicitud.programa}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-subtle">Clase</dt>
            <dd className="text-right font-medium text-brand-navy">
              {solicitud.modulo} · {solicitud.clase} — {solicitud.nombreClase}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-subtle">Material solicitado</dt>
            <dd className="font-medium text-brand-navy">
              {TIPO_LABEL[solicitud.tipoMaterial]}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
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

      {solicitud.motivoRechazo && puedeEntregar && (
        <div className="rounded-adipa-card border border-danger/30 bg-danger/10 p-4 text-sm text-ink">
          <p className="font-medium">
            Tu entrega anterior no pudo ser aceptada. Te pedimos subirla de nuevo.
          </p>
          <p className="mt-1">Motivo: {solicitud.motivoRechazo}</p>
        </div>
      )}

      <div className="adipa-card p-6">
        <h2 className="text-sm font-semibold text-brand-navy">
          Sube tu archivo
        </h2>
        <div className="mt-3">
          {puedeEntregar ? (
            <EntregaForm token={token} />
          ) : solicitud.estado === "recibido" ? (
            <p className="rounded-adipa-control bg-brand-sky/50 px-4 py-3 text-sm text-brand-navy">
              Recibimos tu material y está en revisión. ¡Gracias!
            </p>
          ) : solicitud.estado === "subido_drive" ? (
            <p className="rounded-adipa-control bg-brand-sky/50 px-4 py-3 text-sm text-brand-navy">
              Tu material fue recibido y aprobado. No necesitas hacer nada más.
              ¡Gracias!
            </p>
          ) : (
            <p className="rounded-adipa-control bg-brand-soft px-4 py-3 text-sm text-ink">
              Esta solicitud ya fue cerrada y no admite nuevas entregas.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
