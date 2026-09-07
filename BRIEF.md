# Brief · Solicitud de material a los docentes

## Problema que resuelve

Para cada clase programada de un diplomado, la coordinación académica debe
conseguir a tiempo dos materiales de cada docente: el material de apoyo (una
semana antes de la clase) y la presentación/PPT (entre dos días antes y un
día después de la clase). Hoy el seguimiento es manual: un correo automático
corporativo avisa al docente, y si no responde, la coordinadora lo contacta
por correo o WhatsApp para recordarle, y si aun así no entrega, escala a la
dirección del programa. Una vez recibido, el material se sube a una carpeta
de Drive (organizada por programa → módulo → tipo de material) y luego a
Moodle. No hay hoy una vista única de qué está pendiente, contactado,
escalado o listo por clase y por docente — vive en la memoria y bandeja de
correo de la coordinadora.

Esta app resuelve dos partes de ese proceso: (1) darle a la coordinadora un
tablero de seguimiento del estado de cada solicitud de material, y (2)
darle al docente un lugar simple, sin cuenta ni contraseña, para entregar su
material cuando le corresponde.

## Usuario principal y roles

- **Coordinación académica (usuaria principal, ej. Edwin):** ve el tablero
  de todas las solicitudes, actualiza manualmente el estado cuando contacta
  por WhatsApp o escala a dirección, revisa el material recibido, ajusta el
  nombre del PPT y marca la solicitud como lista (lo que dispara la subida
  simulada a Drive).
- **Docente:** recibe (fuera de esta app) un correo automático corporativo
  con un link único a su formulario de entrega; abre el link, sube su
  archivo, sin necesidad de crear cuenta.
- **Dirección del programa:** rol de escalamiento fuera de la app — la
  coordinadora la contacta manualmente cuando ni el correo ni el WhatsApp
  funcionaron; se asume que la dirección consigue el material.
- **Sistema de correo automático corporativo (existente, fuera de esta
  app):** dispara el primer aviso al docente con el link de entrega, según
  la fecha de la clase.

## Pantallas / piezas (lista, en orden del journey)

1. **Tablero de seguimiento** (vista de la coordinadora, pantalla principal
   al entrar a la app): lista todas las solicitudes de material — una fila
   por combinación de clase + tipo de material — con su estado actual y
   filtro/orden por programa, módulo, docente o estado.
2. **Detalle de solicitud** (vista de la coordinadora, se abre desde una fila
   del tablero): muestra los datos de la clase, el archivo entregado por el
   docente (si ya llegó), un campo de nombre final editable (solo para PPT),
   los botones para avanzar el estado ("Marcar contactado por WhatsApp",
   "Marcar escalado a dirección", "Marcar como listo / subir a Drive",
   "Marcar como excepción / sin material").
3. **Formulario de entrega** (vista del docente, accedida solo vía su link
   único, sin login): muestra en solo lectura qué se le pide y para cuándo,
   un campo para subir su archivo, y una confirmación de envío.
   Si una clase tiene más de un docente asociado, cada uno tiene su propio
   link y su propia solicitud independiente (no comparten formulario ni
   estado).
4. **Datos de ejemplo (seed):** la app arranca con solicitudes de muestra
   generadas a partir de un calendario académico real de ejemplo (columnas:
   módulo/clase, docente, fecha de la clase), simulando lo que vendría de
   importar la planilla real de ADIPA.

## Datos por pantalla (qué entra, qué sale)

**Tablero de seguimiento**
- Entra: la lista completa de solicitudes en memoria (programa, módulo/clase,
  docente, tipo de material, fecha de la clase, fecha límite calculada,
  estado).
- Sale: selección de una fila → navega al Detalle de solicitud.

**Detalle de solicitud**
- Entra: los datos de la solicitud seleccionada, incluyendo el archivo
  subido por el docente (nombre, tipo, fecha/hora de subida) si existe.
- Sale: actualización de estado (contactado por WhatsApp / escalado a
  dirección / listo / excepción-sin material), y para PPT el nombre final
  editado antes de marcar como listo.

**Formulario de entrega (docente)**
- Entra: identificador de la solicitud (desde el link único); en solo
  lectura: programa, módulo/clase, tipo de material, fecha límite.
- Sale: el archivo subido por el docente → actualiza el estado de esa
  solicitud a "Recibido" y queda disponible en el Detalle de solicitud de
  la coordinadora.

## Reglas de negocio (los "si... entonces...")

- Si el tipo de material es "material de apoyo", entonces su fecha límite
  de solicitud es 7 días antes de la fecha de la clase.
- Si el tipo de material es "PPT", entonces su ventana de solicitud va desde
  2 días antes de la clase hasta 1 día después de la clase.
- Si el docente no ha entregado y no ha pasado la fecha límite, entonces el
  estado se muestra como "Pendiente" (aún dentro del plazo del correo
  automático corporativo, fuera de esta app).
- Si el docente no entrega y la coordinadora decide contactarlo, entonces
  ella marca manualmente el estado como "Contactado por WhatsApp" (la app no
  envía el WhatsApp).
- Si tras el contacto por WhatsApp el docente sigue sin entregar, entonces
  la coordinadora marca el estado como "Escalado a dirección" (la app no
  contacta a la dirección, eso lo hace ella misma fuera de la app).
- Si tras escalar a dirección el material sigue sin llegar, entonces la
  coordinadora puede marcar la solicitud como "Excepción / sin material" —
  la clase queda registrada como dictada sin ese material, en vez de
  forzarla a un estado de "listo" que no corresponde.
- Si una clase tiene más de un docente asociado, entonces se genera una
  solicitud de material independiente por cada docente (mismo tipo de
  material y mismo plazo, pero seguimiento y estado separados uno del
  otro).
- Si el tipo de material es "material de apoyo", entonces no se modifica —
  se marca como listo tal como se recibió.
- Si el tipo de material es "PPT", entonces antes de marcar como listo debe
  tener un nombre final siguiendo la convención Clase - Nombre de la clase -
  Programa (editable por la coordinadora, no se genera solo).
- Si la coordinadora marca una solicitud como "Lista", entonces la app
  simula la subida a Google Drive (cambia el estado a "Subido a Drive"); no
  se llama a ninguna API real de Google en esta versión.
- La subida a Moodle no ocurre dentro de la app en ningún caso — es un paso
  manual posterior de la coordinadora, fuera de esta versión.

## Fuera de alcance (qué NO se construye en esta versión)

- El cuestionario de evaluación post-clase (el tercer tipo de material) —
  se descarta explícitamente para esta versión; solo se manejan material de
  apoyo y PPT.
- El envío del correo automático inicial al docente — sigue a cargo del
  sistema corporativo existente de ADIPA; esta app no envía ese primer
  correo.
- El envío del recordatorio por WhatsApp — la coordinadora lo sigue
  escribiendo y enviando ella misma desde su teléfono; la app solo registra
  que ya lo hizo.
- Integración real con Google Drive — la subida se simula (se marca el
  estado como "Subido a Drive"); no hay credenciales ni llamadas a la API
  real de Drive en esta versión.
- Integración con Moodle — la carga final al aula virtual sigue siendo un
  paso manual de la coordinadora fuera de la app.
- Importador real de planilla (Excel/Google Sheets) — la app arranca con
  datos de ejemplo ya cargados; no hay una pantalla para subir un archivo
  de calendario académico y generar solicitudes automáticamente a partir de
  él.
- Cuentas o login para docentes — el acceso es solo vía link único no
  adivinable por solicitud, sin contraseña ni registro.
- Persistencia en una base de datos "de verdad" con modelado relacional,
  migraciones, backups, etc. — se usa Redis (Upstash/Vercel KV) como una
  única lista guardada bajo una llave, suficiente para este volumen de
  datos. Si no hay ninguna base conectada, la app cae
