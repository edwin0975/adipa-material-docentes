"use client";

import { useState, useTransition } from "react";
import type { Solicitud } from "@/lib/types";
import {
  marcarContactadoWhatsapp,
  marcarEscaladoDireccion,
  marcarExcepcion,
  autorizarYSubirDrive,
  rechazarMaterial,
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
  const base = "rounded-adipa-control px-3 py-2 text-sm font-medium disabled:opacity-50";
  const styles = {
    default: "border border-line-strong text-ink hover:bg-brand-soft",
    primary: "bg-brand text-white hover:bg-brand/85",
    danger: "border border-danger text-ink hover:bg-danger/10",
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
  const [rechazando, setRechazando] = useState(false);
  const [motivo, setMotivo] = useState("");

  const { estado, tipoMaterial, id } = solicitud;

  function ejecutar(fn: () => Promise<void>) {
    setError(null);
    startTransition(async () => {
      await fn();
    });
  }

  if (estado === "subido_drive") {
    return (
      <p className="rounded-adipa-control bg-brand-sky/50 px-3 py-2 text-sm text-brand-navy">
        Proceso completado: este material ya quedó marcado como subido a Drive.
      </p>
    );
  }

  if (estado === "excepcion") {
    return (
      <p className="rounded-adipa-control bg-danger/10 px-3 py-2 text-sm text-ink">
        Esta solicitud quedó registrada como excepción: la clase se dictó sin
        este material.
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
        <div className="space-y-4">
          {tipoMaterial === "ppt" && (
            <div>
              <label className="block text-sm font-medium text-ink">
                Nombre final de la presentación{" "}
                <span className="font-normal text-subtle">
                  (convención: Clase - Nombre de la clase - Programa)
                </span>
              </label>
              <input
                type="text"
                value={nombreFinal}
                onChange={(e) => setNombreFinal(e.target.value)}
                placeholder={`${solicitud.clase} - ${solicitud.nombreClase} - ${solicitud.programa}`}
                className="mt-1 w-full rounded-adipa-control border border-line-strong px-3 py-2 text-sm"
              />
            </div>
          )}

          {!rechazando && (
            <div className="flex flex-wrap gap-2">
              <Boton
                variant="primary"
                disabled={isPending}
                onClick={() =>
                  ejecutar(async () => {
                    const res = await autorizarYSubirDrive(id, nombreFinal);
                    if (res?.error) setError(res.error);
                  })
                }
              >
                Autorizar y subir a Drive
              </Boton>
              <Boton
                variant="danger"
                disabled={isPending}
                onClick={() => {
                  setError(null);
                  setRechazando(true);
                }}
              >
                Rechazar y pedir de nuevo
              </Boton>
            </div>
          )}

          {rechazando && (
            <div className="space-y-2 rounded-adipa-control border border-danger/30 bg-danger/5 p-3">
              <label className="block text-sm font-medium text-ink">
                Motivo del rechazo{" "}
                <span className="font-normal text-subtle">
                  (el docente lo verá en su link; avísale tú por tu vía de
                  siempre)
                </span>
              </label>
              <textarea
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                rows={3}
                placeholder="Ej.: Este archivo es de otra clase, sube el de esta."
                className="w-full rounded-adipa-control border border-line-strong px-3 py-2 text-sm"
              />
              <div className="flex flex-wrap gap-2">
                <Boton
                  variant="danger"
                  disabled={isPending}
                  onClick={() =>
                    ejecutar(async () => {
                      const res = await rechazarMaterial(id, motivo);
                      if (res?.error) setError(res.error);
                      else {
                        setRechazando(false);
                        setMotivo("");
                      }
                    })
                  }
                >
                  Confirmar rechazo
                </Boton>
                <Boton
                  disabled={isPending}
                  onClick={() => {
                    setError(null);
                    setRechazando(false);
                  }}
                >
                  Cancelar
                </Boton>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
