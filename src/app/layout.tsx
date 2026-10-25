import type { Metadata } from "next";
import Link from "next/link";
// Poppins es la tipografía principal de ADIPA. Se sirve desde el propio sitio
// (paquete @fontsource/poppins). Peso máximo en producto digital: Bold (700);
// no se usa Extra Bold (DESIGN.md §11.2).
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Material de docentes · ADIPA",
  description:
    "Seguimiento de solicitudes de material a docentes para clases de diplomados.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-brand-soft text-ink">
        <header className="border-b border-line bg-white">
          {/* Pendiente: reemplazar este texto por el logo oficial de ADIPA (archivo
              original, con su área de seguridad). No se reconstruye el logo. */}
          <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
            <Link href="/" className="text-sm font-semibold tracking-tight text-brand">
              ADIPA <span className="font-normal text-subtle">·</span>{" "}
              <span className="text-brand-navy">Material de docentes</span>
            </Link>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
          {children}
        </main>
        <footer className="border-t border-line py-4 text-center text-xs text-subtle">
          Equipo Adipa · Gestión académica
        </footer>
      </body>
    </html>
  );
}
