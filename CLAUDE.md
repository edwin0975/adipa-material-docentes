@AGENTS.md

# Proyecto: Solicitud de material a docentes (ADIPA)

Prueba técnica de Claude Code para ADIPA. El flujo real y las reglas de negocio
están definidos en `BRIEF.md` — esa es la fuente de verdad para qué construir.
No agregues funcionalidad que no esté en el brief; lo que no está ahí va en su
sección "Fuera de alcance".

## Stack (ya definido, no hay que decidirlo)

- Next.js (App Router) + TypeScript
- Tailwind CSS para estilos
- Sin base de datos externa: el estado (solicitudes de material, sus archivos
  y su estado) vive en un store en memoria del servidor, sembrado al arrancar
  con datos de ejemplo (ver `BRIEF.md`). Esto es intencional para esta prueba:
  se reinicia si el servidor se reinicia, y no persiste entre despliegues.
  No implementar una base de datos real — eso queda fuera de alcance.
- Sin autenticación de usuarios (ni para la coordinadora ni para los
  docentes): el acceso del docente es vía un link único no adivinable
  (UUID) por solicitud, sin login.
- Despliegue: Vercel (preview).

## Cómo trabajar en este repo

1. Lee `BRIEF.md` completo antes de tocar código.
2. Construye siguiendo exactamente las pantallas y reglas del brief.
3. Si algo no calza con el brief al probar la app, se corrige citando el
   brief, no improvisando una solución distinta.
4. Cualquier cosa que parezca una buena idea pero no esté en el brief va a
   la sección "Fuera de alcance" del brief, no al código.
