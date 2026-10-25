"use client";

import { useState, useTransition } from "react";
import { entregarMaterial } from "./actions";

export default function EntregaForm({ token }: { token: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await entregarMaterial(token, formData);
      if (res?.error) setError(res.error);
      else setEnviado(true);
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
    <form action={onSubmit} className="space-y-3">
      {error && (
        <p className="rounded-adipa-control bg-danger/10 px-3 py-2 text-sm text-ink">
          {error}
        </p>
      )}
      <input
        type="file"
        name="archivo"
        className="block w-full rounded-adipa-control border border-line-strong p-2 text-sm"
      />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-adipa-control bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand/85 disabled:opacity-50"
      >
        {isPending ? "Enviando..." : "Entregar material"}
      </button>
    </form>
  );
}
