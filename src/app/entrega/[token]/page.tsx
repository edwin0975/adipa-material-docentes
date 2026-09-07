import { notFound } from "next/navigation";
import { getSolicitudByToken } from "@/lib/store";
import { TIPO_LABEL } from "@/lib/types";
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

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">
          Entrega de material
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Hola {solicitud.docente}, esto es lo que te estamos pidiendo para tu
          clase:
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm">
        <dl className="space-y-2">
          <div className="flex justify-between gap-4">
            <dt className="text-slate-400">Programa</dt>
            <dd className="text-right font-medium text-slate-900">
              {solicitud.programa}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-400">Clase</dt>
            <dd className="text-right font-medium text-slate-900">
              {solicitud.modulo} · {solicitud.clase} — {solicitud.nombreClase}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-400">Material solicitado</dt>
            <dd className="font-medium text-slate-900">
              {TIPO_LABEL[solicitud.tipoMaterial]}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
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
          Sube tu archivo
        </h2>
        <div className="mt-3">
          <EntregaForm token={token} />
        </div>
      </div>
    </div>
  );
}
