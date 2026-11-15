"use client";

import { useState, useTransition } from "react";
import { agregarArchivo, finalizarEntrega, quitarArchivo } from "./actions";
import {
  MAX_ARCHIVOS,
  MAX_BYTES_POR_ARCHIVO,
  MAX_MB_POR_ARCHIVO,
  formatTamano,
} from "@/lib/entrega";

interface Subido {
  nombre: string;
  bytes: number;
}

export default function EntregaForm({
  token,
  tipoMaterial,
  subidos,
}: {
  token: string;
  tipoMaterial: "apoyo" | "ppt";
  subidos: Subido[];
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [progreso, setProgreso] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);
  const [elegidos, setElegidos] = useState<File[]>([]);

  const etiqueta =
    tipoMaterial === "apoyo"
      ? "Selecciona todos los archivos del material de apoyo"
      : "Selecciona la presentación de la clase (si son varios archivos, elígelos todos)";

  function onElegir(files: FileList | null) {
    setError(null);
    setElegidos(files ? Array.from(files) : []);
  }

  function entregar() {
    setError(null);
    const demasiado = elegidos.find((f) => f.size > MAX_BYTES_POR_ARCHIVO);
    if (demasiado) {
      setError(
        `«${demasiado.name}» es muy grande (máximo ${MAX_MB_POR_ARCHIVO} MB por archivo). Si pesa más, comprímelo o divídelo en partes.`,
      );
      return;
    }
    if (elegidos.length === 0 && subidos.length === 0) {
      setError("Selecciona un archivo antes de enviar.");
      return;
    }
    if (elegidos.length + subidos.length > MAX_ARCHIVOS) {
      setError(`Se pueden entregar hasta ${MAX_ARCHIVOS} archivos por solicitud.`);
      return;
    }

    startTransition(async () => {
      // Un archivo por solicitud: así ninguno choca con el límite de tamaño.
      for (let i = 0; i < elegidos.length; i++) {
        const f = elegidos[i];
        setProgreso(`Subiendo ${i + 1} de ${elegidos.length}: ${f.name}`);
        const datos = new FormData();
        datos.set("archivo", f);
        let res: { error: string | null } | undefined;
        try {
          res = await agregarArchivo(token, datos);
        } catch {
          res = {
            error: `No se pudo subir «${f.name}». Revisa tu conexión y vuelve a intentarlo.`,
          };
        }
        if (res?.error) {
          setProgreso(null);
          setError(res.error);
          return;
        }
      }
      setProgreso("Terminando la entrega…");
      const fin = await finalizarEntrega(token);
      setProgreso(null);
      if (fin?.error) setError(fin.error);
      else setEnviado(true);
    });
  }

  function quitar(nombre: string) {
    setError(null);
    startTransition(async () => {
      const res = await quitarArchivo(token, nombre);
      if (res?.error) setError(res.error);
    });
  }

  if (enviado) {
    return (
      <p className="rounded-adipa-control bg-brand-sky/50 px-4 py-3 text-sm text-brand-navy">
        Recibimos tu material correctamente. ¡Gracias!
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="rounded-adipa-control bg-danger/10 px-3 py-2 text-sm text-ink">
          {error}
        </p>
      )}

      {subidos.length > 0 && (
        <div className="rounded-adipa-control bg-brand-soft px-3 py-2 text-sm">
          <p className="font-medium text-brand-navy">
            Ya subiste estos archivos (falta pulsar «Entregar material»):
          </p>
          <ul className="mt-1 space-y-1">
            {subidos.map((s) => (
              <li key={s.nombre} className="flex items-center justify-between gap-3">
                <span className="text-ink">
                  {s.nombre} <span className="text-subtle">· {formatTamano(s.bytes)}</span>
                </span>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => quitar(s.nombre)}
                  className="text-sm font-medium text-brand underline disabled:opacity-50"
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <label htmlFor="archivos" className="block text-sm font-medium text-ink">
          {etiqueta}
        </label>
        <p className="mt-0.5 text-xs text-subtle">
          Máximo {MAX_MB_POR_ARCHIVO} MB por archivo. Para elegir varios, mantén
          pulsada la tecla Ctrl (o Cmd) al hacer clic.
        </p>
        <input
          id="archivos"
          type="file"
          multiple
          onChange={(e) => onElegir(e.target.files)}
          className="mt-2 block w-full rounded-adipa-control border border-line-strong p-2 text-sm"
        />
      </div>

      {elegidos.length > 0 && (
        <ul className="space-y-1 text-sm text-ink" aria-label="Archivos elegidos">
          {elegidos.map((f) => (
            <li key={f.name + f.size}>
              {f.name} <span className="text-subtle">· {formatTamano(f.size)}</span>
            </li>
          ))}
        </ul>
      )}

      {progreso && (
        <p role="status" className="text-sm text-muted">
          {progreso}
        </p>
      )}

      <button
        type="button"
        onClick={entregar}
        disabled={isPending}
        className="rounded-adipa-control bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand/85 disabled:opacity-50"
      >
        {isPending ? "Enviando..." : "Entregar material"}
      </button>
    </div>
  );
}
