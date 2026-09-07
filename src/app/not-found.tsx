import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md space-y-3 py-16 text-center">
      <h1 className="text-lg font-semibold text-slate-900">
        No encontramos esta página
      </h1>
      <p className="text-sm text-slate-500">
        El link no corresponde a ninguna solicitud de material, o ya no está
        disponible.
      </p>
      <Link
        href="/"
        className="inline-block rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        Ir al tablero
      </Link>
    </div>
  );
}
