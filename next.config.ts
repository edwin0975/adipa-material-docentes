import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // El formulario de entrega del docente valida hasta 15 MB por archivo
      // (ver src/app/entrega/[token]/actions.ts). Next.js limita por
      // defecto el cuerpo de un Server Action a 1 MB; sin este ajuste,
      // cualquier archivo real (PPT, PDF) supera ese límite antes de que
      // el código llegue a validarlo, y falla con un error 500 genérico.
      bodySizeLimit: "16mb",
    },
  },
};

export default nextConfig;
