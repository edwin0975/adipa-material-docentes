import Link from "next/link";
import { listSolicitudes } from "@/lib/store";
import { ESTADO_LABEL, TIPO_LABEL, type Estado, type TipoMaterial } from "@/lib/types";
import { ESTADO_BADGE, formatFecha } from "@/lib/format";

const ESTADOS_ORDEN: Estado[] = [
  "pendiente",
  "contactado_whatsapp",
  "escalado_direccion",
  "recibido",
  "subido_drive",
  "excepcion",
];

function buildHref(estado?: string, tipo?: string) {
  const params = new URLSearchParams();
  if (estado) params.set("estado", estado);
  if (tipo) params.set("tipo", tipo);
  const qs = params.toString();
  return qs ? `/?${qs}` : "/";
}

export default async function TableroPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string; tipo?: string }>;
}) {
  const { estado, tipo } = await searchParams;
  const todas = listSolicitudes();
  const solicitudes = todas.filter((s) => {
    if (estado && s.estado !== estado) return false;
    if (tipo && s.tipoMaterial !== tipo) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          Tablero de seguimiento
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Solicitudes de material a docentes para clases de diplomados.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-slate-400">Estado:</span>
        <Link
          href={buildHref(undefined, tipo)}
          className={`rounded-full border px-3 py-1 ${
            !estado
              ? "border-slate-900 bg-slate-900 text-white"
              : "border-slate-200 text-slate-600 hover:border-slate-300"
          }`}
        >
          Todos
        </Link>
        {ESTADOS_ORDEN.map((e) => (
          <Link
            key={e}
            href={buildHref(e, tipo)}
            className={`rounded-full border px-3 py-1 ${
              estado === e
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            {ESTADO_LABEL[e]}
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-slate-400">Tipo:</span>
        {(["apoyo", "ppt"] as TipoMaterial[]).map((t) => (
          <Link
            key={t}
            href={buildHref(estado, tipo === t ? undefined : t)}
            className={`rounded-full border px-3 py-1 ${
              tipo === t
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            {TIPO_LABEL[t]}
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full min-w-[840px] divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="whitespace-nowrap px-4 py-3">Docente</th>
              <th className="px-4 py-3">Clase</th>
              <th className="whitespace-nowrap px-4 py-3">Tipo</th>
              <th className="whitespace-nowrap px-4 py-3">Fecha clase</th>
              <th className="whitespace-nowrap px-4 py-3">Fecha límite</th>
              <th className="whitespace-nowrap px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {solicitudes.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50">
                <td className="whitespace-nowrap px-4 py-3">
                  <Link
                    href={`/solicitud/${s.id}`}
                    className="font-medium text-slate-900 hover:underline"
                  >
                    {s.docente}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  <div>{s.nombreClase}</div>
                  <div className="text-xs whitespace-nowrap text-slate-400">
                    {s.modulo} · {s.clase}
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                  {TIPO_LABEL[s.tipoMaterial]}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                  {formatFecha(s.fechaClase)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                  {formatFecha(s.fechaLimite)}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span
                    className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${ESTADO_BADGE[s.estado]}`}
                  >
                    {ESTADO_LABEL[s.estado]}
                  </span>
                </td>
              </tr>
            ))}
            {solicitudes.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                  No hay solicitudes con ese filtro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
