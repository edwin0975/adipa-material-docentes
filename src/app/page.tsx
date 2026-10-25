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

type Filtros = { estado?: string; tipo?: string; programa?: string };

function buildHref({ estado, tipo, programa }: Filtros) {
  const params = new URLSearchParams();
  if (estado) params.set("estado", estado);
  if (tipo) params.set("tipo", tipo);
  if (programa) params.set("programa", programa);
  const qs = params.toString();
  return qs ? `/?${qs}` : "/";
}

export default async function TableroPage({
  searchParams,
}: {
  searchParams: Promise<Filtros>;
}) {
  const { estado, tipo, programa } = await searchParams;
  const todas = await listSolicitudes();

  const programas = [...new Set(todas.map((s) => s.programa))].sort((a, b) =>
    a.localeCompare(b, "es"),
  );

  // Cuántas hay por revisar dentro del diplomado elegido (o en todos).
  const porRevisar = todas.filter(
    (s) => s.estado === "recibido" && (!programa || s.programa === programa),
  ).length;

  const solicitudes = todas.filter((s) => {
    if (estado && s.estado !== estado) return false;
    if (tipo && s.tipoMaterial !== tipo) return false;
    if (programa && s.programa !== programa) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-brand-navy">
          Tablero de seguimiento
        </h1>
        <p className="mt-1 text-sm text-muted">
          Solicitudes de material a docentes para clases de diplomados. Las que
          aún requieren acción aparecen primero, con la fecha límite más
          próxima arriba.
        </p>
      </div>

      {porRevisar > 0 && (
        <Link
          href={buildHref({ estado: "recibido", tipo, programa })}
          className="flex items-center justify-between gap-3 rounded-adipa-card border border-brand/30 bg-brand-lavender/50 px-3 py-3 text-sm text-brand-navy hover:bg-brand-lavender"
        >
          <span>
            <span className="font-semibold">
              {porRevisar} {porRevisar === 1 ? "material" : "materiales"} por
              revisar
            </span>{" "}
            — los docentes ya entregaron y esperan tu autorización.
          </span>
          <span className="whitespace-nowrap font-medium">Ver →</span>
        </Link>
      )}

      <form method="get" action="/" className="flex flex-wrap items-center gap-2 text-sm">
        <label htmlFor="programa" className="text-subtle">
          Diplomado:
        </label>
        <select
          id="programa"
          name="programa"
          defaultValue={programa ?? ""}
          className="max-w-full rounded-adipa-control border border-line-strong bg-white px-3 py-1.5 text-ink"
        >
          <option value="">Todos los diplomados</option>
          {programas.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        {estado && <input type="hidden" name="estado" value={estado} />}
        {tipo && <input type="hidden" name="tipo" value={tipo} />}
        <button
          type="submit"
          className="rounded-adipa-control border border-line-strong px-3 py-1.5 font-medium text-ink hover:bg-brand-soft"
        >
          Filtrar
        </button>
      </form>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-subtle">Estado:</span>
        <Link
          href={buildHref({ tipo, programa })}
          className={`rounded-full border px-3 py-1 ${
            !estado
              ? "border-brand bg-brand text-white"
              : "border-line text-ink hover:border-line-strong"
          }`}
        >
          Todos
        </Link>
        {ESTADOS_ORDEN.map((e) => (
          <Link
            key={e}
            href={buildHref({ estado: e, tipo, programa })}
            className={`rounded-full border px-3 py-1 ${
              estado === e
                ? "border-brand bg-brand text-white"
                : "border-line text-ink hover:border-line-strong"
            }`}
          >
            {ESTADO_LABEL[e]}
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-subtle">Tipo:</span>
        {(["apoyo", "ppt"] as TipoMaterial[]).map((t) => (
          <Link
            key={t}
            href={buildHref({ estado, tipo: tipo === t ? undefined : t, programa })}
            className={`rounded-full border px-3 py-1 ${
              tipo === t
                ? "border-brand bg-brand text-white"
                : "border-line text-ink hover:border-line-strong"
            }`}
          >
            {TIPO_LABEL[t]}
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto adipa-card">
        <table className="w-full min-w-[880px] divide-y divide-line text-sm">
          <thead className="bg-brand-soft text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="whitespace-nowrap px-3 py-3">Docente</th>
              <th className="px-3 py-3">Clase</th>
              <th className="px-3 py-3">Tipo</th>
              <th className="whitespace-nowrap px-3 py-3">Fecha clase</th>
              <th className="whitespace-nowrap px-3 py-3">Fecha límite</th>
              <th className="whitespace-nowrap px-3 py-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {solicitudes.map((s) => (
              <tr
                key={s.id}
                className={
                  s.estado === "recibido"
                    ? "bg-brand-lavender/30 hover:bg-brand-lavender/50"
                    : "hover:bg-brand-soft"
                }
              >
                <td className="whitespace-nowrap px-3 py-3">
                  <Link
                    href={`/solicitud/${s.id}`}
                    className="font-medium text-brand-navy hover:underline"
                  >
                    {s.docente}
                  </Link>
                </td>
                <td className="px-3 py-3 text-ink">
                  <div>{s.nombreClase}</div>
                  <div className="text-xs text-subtle">
                    {s.modulo} · {s.clase}
                  </div>
                  <div className="max-w-[14rem] truncate text-xs text-subtle">
                    {s.programa}
                  </div>
                </td>
                <td className="px-3 py-3 text-ink">
                  {TIPO_LABEL[s.tipoMaterial]}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-ink">
                  {formatFecha(s.fechaClase)}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-ink">
                  {formatFecha(s.fechaLimite)}
                </td>
                <td className="whitespace-nowrap px-3 py-3">
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
                <td colSpan={6} className="px-4 py-8 text-center text-subtle">
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
