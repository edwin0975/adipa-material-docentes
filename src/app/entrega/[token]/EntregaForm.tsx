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
      <p className="rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
        ¡Listo! Tu material fue recibido correctamente.
      </p>
    );
  }

  return (
    <form action={onSubmit} className="space-y-3">
      {error && (
        <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-800">
          {error}
        </p>
      )}
      <input
        type="file"
        name="archivo"
        className="block w-full rounded-md border border-slate-300 p-2 text-sm"
      />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {isPending ? "Enviando..." : "Entregar material"}
      </button>
    </form>
  );
}
