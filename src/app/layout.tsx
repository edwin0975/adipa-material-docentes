import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Material de docentes · ADIPA",
  description:
    "Seguimiento de solicitudes de material a docentes para clases de diplomados.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-3 sm:px-6">
            <Link href="/" className="text-sm font-semibold tracking-tight text-slate-900">
              ADIPA <span className="font-normal text-slate-400">·</span> Material de
              docentes
            </Link>
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6">
          {children}
        </main>
        <footer className="border-t border-slate-200 py-4 text-center text-xs text-slate-400">
          Prueba técnica Claude Code · ADIPA
        </footer>
      </body>
    </html>
  );
}
