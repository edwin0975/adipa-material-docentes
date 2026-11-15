"use client";

import { useEffect, useState } from "react";
import type { Solicitud } from "@/lib/types";
import { mensajeParaDocente } from "@/lib/mensaje";

function BotonCopiar({ texto, etiqueta }: { texto: string; etiqueta: string }) {
  const [copiado, setCopiado] = useState(false);
  const [fallo, setFallo] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto);
      setFallo(false);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      setFallo(true);
    }
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={copiar}
        className="rounded-adipa-control border border-line-strong px-3 py-1.5 text-sm font-medium text-ink hover:bg-brand-soft"
      >
        {copiado ? "Copiado" : etiqueta}
      </button>
      {fallo && (
        <span className="text-xs text-muted">
          No se pudo copiar solo: selecciona el texto y cópialo con Ctrl + C.
        </span>
      )}
    </span>
  );
}

export default function EnlaceYMensaje({ solicitud }: { solicitud: Solicitud }) {
  // El link completo necesita la dirección de la app, que solo se conoce
  // en el navegador.
  const [origen, setOrigen] = useState("");
  useEffect(() => setOrigen(window.location.origin), []);

  const rutaLink = `/entrega/${solicitud.linkToken}`;
  const link = `${origen}${rutaLink}`;
  const mensaje = mensajeParaDocente(solicitud, origen);

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-medium text-ink">Link del docente</h3>
        <p className="mt-1 text-sm text-muted">
          Este es el link que recibe el docente para entregar su material.
          Puedes abrirlo para ver lo que ve el docente.
        </p>
        <p className="mt-2 break-all text-sm font-medium text-brand-navy">
          <a href={rutaLink} className="underline">
            {link}
          </a>
        </p>
        <div className="mt-2">
          <BotonCopiar texto={link} etiqueta="Copiar link" />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-ink">Mensaje listo para enviar</h3>
        <p className="mt-1 text-sm text-muted">
          Cópialo y envíalo desde el correo corporativo, o por WhatsApp si el
          docente no responde.
        </p>
        <textarea
          readOnly
          value={mensaje}
          rows={14}
          aria-label="Mensaje para el docente"
          className="mt-2 w-full rounded-adipa-control border border-line-strong bg-white px-3 py-2 text-sm text-ink"
        />
        <div className="mt-2">
          <BotonCopiar texto={mensaje} etiqueta="Copiar mensaje" />
        </div>
      </div>
    </div>
  );
}
