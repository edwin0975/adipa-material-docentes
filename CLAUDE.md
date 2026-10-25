@AGENTS.md

# Proyecto: Solicitud de material a docentes (ADIPA)

Prueba técnica de Claude Code para ADIPA. El flujo real y las reglas de negocio
están definidos en `BRIEF.md` — esa es la fuente de verdad para qué construir.
No agregues funcionalidad que no esté en el brief; lo que no está ahí va en su
sección "Fuera de alcance".

## Stack (ya definido, no hay que decidirlo)

- Next.js (App Router) + TypeScript
- Tailwind CSS para estilos
- Persistencia: el estado (solicitudes de material, sus archivos y su estado)
  se guarda en Redis (Upstash / Vercel KV) cuando el proyecto tiene una base
  conectada — ver `src/lib/store.ts` y la nota de la Etapa 3 en `BRIEF.md`.
  Si no hay ninguna conectada (ej. en desarrollo local), cae a un store en
  memoria del servidor, sembrado al arrancar con datos de ejemplo; en ese modo
  el estado se reinicia con el servidor. No se implementa una base de datos
  relacional "de verdad" (sin modelado, migraciones ni backups) — eso queda
  fuera de alcance, ver `BRIEF.md`.
- Integraciones externas (monday, Google Drive, Moodle): son las Fases 2 a 5
  del brief y se construyen a medida que haya acceso. Sus claves van solo en
  variables de entorno de Vercel, nunca en el repositorio ni en el chat.
- Sin autenticación de usuarios (ni para la coordinadora ni para los
  docentes): el acceso del docente es vía un link único no adivinable
  (UUID) por solicitud, sin login.
- Despliegue: Vercel (preview).
- Diseño: la app sigue el manual de marca de ADIPA (`DESIGN.md`, que ADIPA
  entrega aparte y no vive en este repositorio, que es público). Los tokens
  están en `src/app/globals.css` (colores, radios, card `.adipa-card`) y la
  tipografía es Poppins (`@fontsource/poppins`, pesos 400 a 700, nunca Extra
  Bold). No se reconstruye el logo: cuando ADIPA entregue el archivo oficial,
  se reemplaza el texto del encabezado en `src/app/layout.tsx`.
- Textos: se usa el glosario de `estilo-comunicativo.md` (también fuera del
  repo): "docente", "aula" (no "Moodle" de cara al usuario), "presentación de
  la clase" (no "PPT"), "material de apoyo". Tono formal y cercano.

## Cómo trabajar en este repo

1. Lee `BRIEF.md` completo antes de tocar código.
2. Construye siguiendo exactamente las pantallas y reglas del brief.
3. Si algo no calza con el brief al probar la app, se corrige citando el
   brief, no improvisando una solución distinta.
4. Cualquier cosa que parezca una buena idea pero no esté en el brief va a
   la sección "Fuera de alcance" del brief, no al código.
