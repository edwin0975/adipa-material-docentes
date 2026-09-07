"use client";

import { useState, useTransition } from "react";
import type { Solicitud } from "@/lib/types";
import {
  marcarContactadoWhatsapp,
  marcarEscaladoDireccion,
  marcarExcepcion,
  marcarListoYSubirDrive,
} from "./actions";

function Boton({
  children,
  onClick,
  variant = "default",
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "primary" | "danger";
  disabled?: boolean;
}) {
  const base = "rounded-md px-3 py-2 text-sm font-medium disabled:opacity-50";
  const styles = {
    default: "border border-slate-300 text-slate-700 hover:bg-slate-50",
    primary: "bg-slate-900 text-white hover:bg-slate-800",
    danger: "border border-rose-300 text-rose-700 hover:bg-rose-50",
  } as const;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles[variant]}`}
    >
      {children}
    </button>
  );
}

export default function AccionesSolicitud({ solicitud }: { solicitud: Solicitud }) {
  const [isPending, startTransition] = useTransition();
  const [nombreFinal, setNombreFinal] = useState(solicitud.nombreFinal ?? "");
  const [error, setError] = useState<string | null>(null);

  const { estado, tipoMaterial, id } = solicitud;

  function ejecutar(fn: () => Promise<void>) {
    setError(null);
    startTransition(async () => {
      await fn();
    });
  }

  if (estado === "subido_drive") {
    return (
      <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
        Proceso completado: este material ya quedó marcado como subido a Drive.
      </p>
    );
  }

  if (estado === "excepcion") {
    return (
      <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-800">
        Esta solicitud quedó registrada como excepción: la clase se dictó sin
        este material.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-800">
          {error}
        </p>
      )}

      {estado === "pendiente" && (
        <Boton
          disabled={isPending}
          onClick={() => ejecutar(() => marcarContactadoWhatsapp(id))}
        >
          Marcar contactado por WhatsApp
        </Boton>
      )}

      {estado === "contactado_whatsapp" && (
        <Boton
          disabled={isPending}
          onClick={() => ejecutar(() => marcarEscaladoDireccion(id))}
        >
          Marcar escalado a dirección
        </Boton>
      )}

      {estado === "escalado_direccion" && (
        <Boton
          variant="danger"
          disabled={isPending}
          onClick={() => ejecutar(() => marcarExcepcion(id))}
        >
          Marcar como excepción / sin material
        </Boton>
      )}

      {estado === "recibido" && (
        <div className="space-y-3">
          {tipoMaterial === "ppt" && (
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Nombre final del PPT{" "}
                <span className="font-normal text-slate-400">
                  (convención: Clase - Nombre de la clase - Programa)
                </span>
              </label>
              <input
                type="text"
                value={nombreFinal}
                onChange={(e) => setNombreFinal(e.target.value)}
                placeholder={`${solicitud.clase} - ${solicitud.nombreClase} - ${solicitud.programa}`}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
          )}
          <Boton
            variant="primary"
            disabled={isPending}
            onClick={() =>
              ejecutar(async () => {
                const res = await marcarListoYSubirDrive(id, nombreFinal);
                if (res?.error) setError(res.error);
              })
            }
          >
            Marcar como listo / subir a Drive
          </Boton>
        </div>
      )}
    </div>
  );
}
