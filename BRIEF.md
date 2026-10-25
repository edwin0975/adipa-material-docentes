# Brief · Solicitud de material a los docentes

Versión 7 · propuesta para aprobación de ADIPA · Edwin (Operaciones)

## Resumen

Se propone un tablero único para solicitar, recibir, revisar y autorizar el material de cada clase, que reemplace el seguimiento manual. La propuesta se divide en 5 fases: revisión del material, lectura de las clases desde monday, y envío a Drive, Moodle y monday a medida que haya accesos. Cada fase se construye solo con la aprobación de ADIPA.

## Objetivos y alcance

El objetivo general es que cada material pedido a un docente quede entregado, revisado, respaldado y publicado en el aula sin depender de la memoria ni del correo de una sola persona.

Objetivos específicos:

- Tener un único tablero con el estado del material de cada clase.
- Revisar antes de publicar: Coordinación autoriza o rechaza lo que sube el docente.
- Leer clases y fechas directo de monday, para que las reprogramaciones se reflejen sin trabajo manual.
- Guardar un respaldo ordenado en Drive y publicar el material en Moodle.
- Marcar el avance en monday sin hacerlo a mano.

El alcance son las 5 fases de la tabla de abajo, para los diplomados activos y por activarse. Lo que no entra en esta versión está en la sección Fuera de alcance.

## Problema que resuelve

Hoy pedir el material a cada docente es un proceso manual: vive en la memoria y en el correo de la coordinadora. Depende de que alguien recuerde qué clase viene, a quién escribirle y si ya respondió.

Si la coordinadora no está, el proceso se cae: no queda registro de quién entregó, qué falta ni qué se subió al aula. Además, nada impide que un docente suba un archivo equivocado sin que nadie lo note antes de que llegue al aula.

## Usuarios y roles

| Rol | Qué hace en el flujo |
| --- | --- |
| Coordinación (Operaciones) | Usa el tablero, solicita el material, revisa lo entregado y lo autoriza o rechaza. |
| Docente | Recibe un link único por solicitud y sube su archivo, sin login. |
| Dirección | Interviene cuando el docente no responde y la solicitud se escala. |
| Monitor | Acompaña al docente en Zoom; usa la presentación de respaldo de la tabla «Sesión de monitores en vivo». |
| Sistemas | monday (tabla Gestión Académica, que reúne las tablas madre, y tabla de monitores), Google Drive (respaldo), Moodle (aula) y correo corporativo. |

## Fases de construcción

La Fase 1 no necesita accesos externos; las Fases 2 a 5 avanzan a medida que la empresa entregue cada acceso.

| # | Fase | Qué incluye | Depende de |
| --- | --- | --- | --- |
| 1 | Tablero y revisión | Tablero, detalle, formulario del docente, indicador de materiales por revisar, autorizar o rechazar con motivo, filtro por diplomado, orden por fecha límite, link con el nombre del docente y de la clase, mensaje listo para enviar, etiqueta de nombre para el material de apoyo y diseño según el de ADIPA. | Nada externo |
| 2 | Lectura de monday | Leer las clases de los próximos 15 días desde la tabla «Gestión Académica» de monday, que reúne todas las tablas madre, para que reprogramaciones y cambios de fecha se reflejen en tiempo real, y escribir en esa tabla el link de cada clase para el correo automático. | Acceso de lectura y edición a monday |
| 3 | Drive | Al autorizar, guardar el archivo en Drive en su carpeta y marcar «Subido al Drive» en monday. | Cuenta de Operaciones con Drive |
| 4 | Moodle | Subir el material al aula del módulo y marcar «Abierto en Aula» en monday. | Token de servicio web de Moodle |
| 5 | PPT a monitores | Subir la presentación a la tabla «Sesión de monitores en vivo», por clase y antes de que empiece. | Acceso de edición a monday |

## Estado actual de ejecución

La fase actual es la 1. Las demás esperan la aprobación del brief y los accesos de cada sistema.

| Fase | Estado | Avance | Qué falta |
| --- | --- | --- | --- |
| 1 · Tablero y revisión | En ejecución | Construida y probada en un entorno local con 8 clases de 2 diplomados; diseño y textos de ADIPA ya aplicados. | Link con nombre y mensaje listo, etiqueta del material de apoyo, publicarla y validarla en producción. |
| 2 · Lectura de monday | No iniciada | Sin avance. | Acceso de lectura y edición a la tabla Gestión Académica. |
| 3 · Drive | No iniciada | Sin avance; hoy el Drive es simulado. | Cuenta de Operaciones con Drive. |
| 4 · Moodle | No iniciada | Sin avance. | Token de servicio web de Moodle. |
| 5 · PPT a monitores | No iniciada | Sin avance. | Acceso de edición a monday. |

## Plazos estimados

Las fechas suponen que el trabajo real empieza después del 12 de noviembre, con el brief ya aprobado, y que se trabaja un domingo por semana, desde el 15 de noviembre. Cada domingo se hace un paso pequeño. Si un acceso llega tarde, la fase se corre al siguiente domingo.

| Fase | Domingos de trabajo | Acceso necesario antes del | Termina el domingo |
| --- | --- | --- | --- |
| 1 · Tablero y revisión | 3 | Aprobación del brief | 29 nov 2026 |
| 2 · Lectura de monday | 2 | 6 dic 2026 (lectura y edición de Gestión Académica, y ser administrador del tablero) | 13 dic 2026 |
| 3 · Drive | 3 | 20 dic 2026 (Drive de Operaciones y edición de Gestión Académica) | 3 ene 2027 |
| 4 · Aula (Moodle) | 3 | 10 ene 2027 (token del servicio web) | 24 ene 2027 |
| 5 · PPT a monitores | 2 | 31 ene 2027 (edición de la tabla de monitores) | 7 feb 2027 |
| Cierre | 1 | Todas las fases validadas | 14 feb 2027 |

La Fase 4 es la más incierta, porque depende de quién pueda generar el token en Moodle.

## Cronograma

Con un domingo de trabajo por semana desde el 15 de noviembre de 2026, el proyecto cierra el 14 de febrero de 2027. En el brief vivo (Claude Docs) y en el PDF el cronograma es un diagrama de Gantt; aquí va su equivalente en texto.

| Domingo | Fase en trabajo |
| --- | --- |
| 15, 22 y 29 nov | Fase 1 · Tablero y revisión |
| 6 y 13 dic | Fase 2 · Lectura de monday |
| 20 y 27 dic, 3 ene | Fase 3 · Drive |
| 10, 17 y 24 ene | Fase 4 · Aula (Moodle) |
| 31 ene y 7 feb | Fase 5 · PPT a monitores |
| 14 feb | Cierre y validación |

Cada fila es una semana y el trabajo se hace el domingo de esa semana, con un paso pequeño por domingo. Las fases esperan su acceso: si llega tarde, la fase pasa al siguiente domingo. Si el brief se aprueba después del 12 de noviembre, todas las fechas se corren las mismas semanas.

## Seguimiento del proyecto

Se propone un reporte semanal corto, con la misma estructura cada vez, para que cualquiera vea el avance sin preguntar.

| Qué se reporta | Detalle | Fuente |
| --- | --- | --- |
| Fase actual y estado | Fase en curso y estado de cada una (no iniciada, en ejecución, bloqueada, completada). | Tabla de estado de este brief |
| Hitos de la semana | Qué se terminó y qué se hizo avanzar. | Responsable del proyecto |
| Bloqueos y accesos | Accesos pedidos, quién debe entregarlos y desde cuándo están pendientes. | Tabla de accesos |
| Fechas | Fecha objetivo de cada fase frente a la estimada. | Tabla de plazos |
| Uso de la app | Solicitudes por estado (pendiente, recibido, autorizado, rechazado, excepción), y entregas fuera de plazo. | Tablero de la app |
| Decisiones pendientes | Lo que se necesita que ADIPA resuelva. | Lista de dudas de este brief |

Responsable del proyecto, frecuencia y día del reporte quedan por confirmar.

## Flujo y pantallas

El material pasa por una sola puerta de control: Coordinación lo revisa y, solo si corresponde, sigue a Drive, Moodle y monday. Si se rechaza, la solicitud vuelve a Pendiente y el docente ve el motivo en su mismo link para subirlo de nuevo. (El diagrama del flujo está en el brief vivo y en el PDF.)

La propuesta incluye tres pantallas:

- **Tablero:** todas las solicitudes con su estado; las abiertas van primero por fecha límite, hay filtros por estado, tipo y diplomado, y un aviso con los materiales por revisar.
- **Detalle de la solicitud:** datos de la clase, archivo entregado, motivo del último rechazo y las acciones de Coordinación (contactar, escalar, autorizar, rechazar).
- **Link del docente:** formulario sin login con lo que se pide, el plazo y, si corresponde, el motivo del rechazo anterior.

## Envío del link al docente

Cada solicitud (una clase y un tipo de material) tiene su propio link, sin login y imposible de adivinar. Hay dos formas de hacerlo llegar al docente: se va por la opción B, y la opción A queda como respaldo para recordatorios y reenvíos.

**Opción A · Coordinación envía el link** (respaldo; no necesita accesos nuevos)

1. Coordinación abre la solicitud en el tablero.
2. La app muestra un mensaje listo para copiar, con el nombre del docente, la clase, el material pedido, el plazo y el link.
3. Coordinación lo envía desde el correo corporativo, o por WhatsApp si el docente no responde.
4. Coordinación marca la solicitud como contactada y la app la sigue por fecha límite.

El link lleva el nombre del docente, la clase y el tipo de material, y termina en un código corto que es lo que lo hace imposible de adivinar. Por ejemplo: `/entrega/camila-fuentes-clase-1-ppt-x7k2m9`. Si ADIPA prefiere un dominio propio para estos links, lo define el equipo de TI.

**Opción B · Correo automático de monday** (elegida)

La tabla Gestión Académica ya envía al docente, por clase, un correo con una semana de anticipación, desde una automatización con Gmail. En esta opción la app escribe el link de cada clase en esa tabla y la automatización existente lo incluye en ese correo, así el docente lo recibe sin que nadie lo envíe a mano.

- La app escribe dos links por clase, uno para el material de apoyo y otro para la presentación, en columnas nuevas del elemento de la clase. Los escribe apenas la clase entra en la ventana de 15 días, para que estén listos antes de que salga el correo.
- La automatización se edita para insertar esas columnas en el texto del correo. monday muestra la URL completa, por eso conviene el link legible con el nombre del docente y de la clase.
- Hace falta ser administrador del tablero para crear las columnas y editar la automatización, además del acceso de edición ya pedido.
- Coordinación conserva el mensaje listo para recordatorios y para pedir de nuevo un material rechazado.

## Diseño y formato de la app

La app sigue el manual de marca de ADIPA (DESIGN.md) y el estilo comunicativo (estilo-comunicativo.md), entregados en la reunión. Ya está aplicado en el tablero, el detalle de la solicitud y la página del docente. Estos dos archivos no se guardan en este repositorio porque es público.

**Diseño**

- Colores: morado #704EFD como principal, celeste #2CB7FF de apoyo, fondo #F3F4FF y texto en azul marino #091E42. El color fuerte se reserva para lo que requiere acción (material por revisar) y para lo ya cerrado; el amarillo activo solo marca la escalación.
- Tipografía: Poppins, de regular a bold; nunca extra bold.
- Cards con borde sutil y radio de 8 px, sin patrones detrás de tablas ni formularios.
- Logo: no se reconstruye. Falta el archivo oficial para ponerlo en el encabezado.

**Textos**

- Se usa el glosario de ADIPA: «docente», «aula», «presentación de la clase» en lugar de «PPT» y «material de apoyo».
- Tono formal y cercano en la página del docente, como en los correos de aula.

Por validar con el equipo de diseño: el color de error y los grises de texto no tienen equivalente en la paleta oficial (DESIGN.md, sección 15.5); la app usa los que trae el propio archivo hasta que se confirmen.

## Reglas de negocio

- **Material de apoyo:** el docente debe entregarlo 7 días antes de la clase.
- **PPT:** se entrega desde 2 días antes hasta 1 día después de la clase. Se acepta después de la clase para todos los diplomados.
- **Revisión obligatoria:** nada llega a Drive sin que Coordinación lo autorice. El indicador del tablero avisa cuántos materiales esperan revisión.
- **Rechazo:** si el archivo no corresponde, se rechaza con un motivo escrito; la solicitud vuelve a «Pendiente» y el docente ve el motivo en su link para subirlo de nuevo.
- **Nombre final:** al autorizar la presentación o el material de apoyo se les pone una etiqueta con el nombre de la clase: «Clase N - Nombre de la clase - Diplomado» para la presentación y «Material - Clase N - Nombre de la clase - Diplomado» para el apoyo (formato por confirmar).
- **Destinos:** lo autorizado va a Drive (respaldo) y después a Moodle; la presentación también va, de inmediato y sin avisar al monitor, a la tabla «Sesión de monitores en vivo», hasta la hora de inicio de la clase.
- **Marcas en monday:** «Subido al Drive» y «Abierto en Aula» se marcan por separado para el material y la presentación de cada clase; hoy se hacen a mano.
- **Cambio de mes:** si una clase cambia de mes, se mueve de carpeta; es muy poco probable, pero ya ocurrió una vez en 5 años.
- **Ventana de clases:** la app muestra solo las clases de los próximos 15 días de la tabla Gestión Académica; las que pasan salen solas, así que lo atrasado se verifica a mano.
- **Orden por urgencia:** las solicitudes abiertas se ordenan por fecha límite. En la realidad pueden manejarse unos 50 diplomados activos en simultáneo cada semana, con clases en distintos módulos; sin ese filtro y ese orden el tablero se volvería inmanejable.

## Estructura de carpetas en Drive y Moodle

Drive es solo respaldo y sigue la misma lógica que el aula, con año y mes de inicio del diplomado arriba. Dentro de cada módulo hay dos carpetas: el material va separado por clase (puede haber muchas clases en un módulo) y las presentaciones van juntas, porque su nombre ya indica la clase.

**Drive**

```
Año
  Mes de inicio del diplomado
    Diplomado
      Módulo
        Material
          Clase 1
          Clase 2
        PPT
          Clase 1 - Nombre de la clase - Diplomado.pptx
```

**Moodle** (sin año ni mes)

```
Diplomado
  Módulo
    Material
      Clase 1
      Clase 2
    PPT
      Clase 1 - Nombre de la clase - Diplomado.pptx
```

## Accesos que se necesitan

Edwin tiene acceso de administrador en las tres plataformas; lo que falta es formalizarlo con la autorización de ADIPA y, en el caso de la app, usar una cuenta de Operaciones.

| Sistema | Para qué | Acceso necesario | Fase |
| --- | --- | --- | --- |
| monday | Leer las clases de los próximos 15 días; marcar estados; subir la presentación a monitores | Lectura y edición de la tabla Gestión Académica; edición de la tabla de monitores. Para la opción B del envío del link: ser administrador del tablero, para crear columnas de link y editar la automatización del correo | 2 y 5 |
| Google Drive | Guardar el respaldo ordenado | Drive de la cuenta de Operaciones | 3 |
| Moodle | Subir el material al aula | Token de servicio web (requiere administrador del sitio) | 4 |

No hace falta pedir permisos sobre cada tabla madre: la tabla Gestión Académica ya las reúne. Las claves se guardan solo como variables de entorno en Vercel; nunca en el repositorio ni en conversaciones.

**Publicación de cambios:** para que Claude suba los ajustes de la Fase 1 directo a GitHub, sin que Edwin tenga que hacerlo a mano, hay que conectar GitHub a la herramienta y autorizar solo el repositorio del proyecto. Vercel publica solo después de cada cambio. Se propone que los cambios lleguen primero a una rama de revisión, con una vista previa, y que una persona de ADIPA los apruebe antes de pasar a la versión principal.

## Fuera de alcance

- Evaluación de fin de módulo: si el docente acepta que la saque la IA no entrega nada; si no, entrega 5 preguntas por clase. Sigue en definición.
- Envío automático del mensaje al docente desde la app: en esta versión Coordinación lo envía con el mensaje que la app deja listo.
- Aviso al monitor cuando se sube una presentación.
- Mover carpetas automáticamente si una clase cambia de mes.
- Escribir en monday valores distintos de los estados de material y presentación.

## Dudas pendientes y decisiones para la reunión

- [ ] ¿Quién es administrador del sitio de Moodle para generar el token del servicio web? Se necesita en la Fase 4.
- [ ] Autorización formal de ADIPA para usar monday, Drive y Moodle desde la app con la cuenta de Operaciones.
- [ ] Confirmar el orden de las fases 2 a 5 según qué acceso llegue primero.
- [ ] Definir con la dirección académica la evaluación de fin de módulo (IA o 5 preguntas por clase).
- [ ] Acordar con quién más se trabajará el proyecto y cómo se comparte el repositorio.
- [ ] Fijar la fecha objetivo de cada fase y quién es el responsable del seguimiento semanal.
- [x] Decidido: se va por la opción B (correo automático de monday con el link); la opción A queda como respaldo.
- [ ] Definir si los links usan un dominio de ADIPA o se mantiene el actual.
- [ ] Confirmar el formato de la etiqueta del material de apoyo y si puede haber más de un archivo por clase.
- [ ] Para la opción B: el correo sale de una automatización con Gmail (confirmado); falta saber quién puede crear las columnas, editar la automatización y administrar la conexión de Gmail.
- [ ] Autorizar la conexión con GitHub solo para el repositorio del proyecto y definir quién aprueba el paso de los cambios a la versión principal.
- [ ] Entregar el archivo oficial del logo de ADIPA y confirmar los colores de error y de texto con el equipo de diseño.

## Próximos pasos

1. Aprobar el alcance y el orden de las fases.
2. Entregar los accesos que cada fase necesita (monday, Drive y Moodle).
3. Resolver quién genera el token de Moodle para la Fase 4.

## Datos de ejemplo

Mientras no llegue la Fase 2, la app arranca con solicitudes de muestra de dos
diplomados: uno derivado de un calendario académico real de ADIPA y otro
inventado, solo para poder probar el filtro por diplomado.


## Nota de la Etapa 3 (encontrado al probar en Vercel)

Al desplegar y probar el link de entrega desde el tablero, los links
fallaban casi siempre ("no encontramos esta página"). La causa: Vercel
puede atender cada solicitud desde una instancia de servidor distinta, y
cada instancia tenía su propia copia de los datos en memoria con ids y
links generados al azar — no coincidían entre sí. Se corrigió de dos
formas: (1) ids y links ahora son deterministas (se calculan a partir de
clase + docente + tipo de material, no al azar), y (2) se agregó soporte
para guardar el estado en una base de datos Redis real (Upstash o Vercel
KV) cuando el proyecto tiene una conectada, en vez de depender solo de la
memoria del servidor.

Con la base de datos Redis ya conectada en Vercel, apareció un segundo
problema al probar la entrega de un archivo real: el formulario del
docente fallaba con un error de servidor al subir archivos de más de 1 MB
(un PPT o PDF real típicamente pesa más que eso). La causa: Next.js limita
por defecto a 1 MB el tamaño del envío de un Server Action, un límite
aparte del que ya validaba el propio código de la app (15 MB, ver
"Formulario de entrega" arriba). Se corrigió configurando ese límite en
`next.config.ts` (`experimental.serverActions.bodySizeLimit: "16mb"`), y
se verificó subiendo un archivo real de varios MB desde el link de
entrega en producción, con resultado correcto.

## Retrospectiva

**1. ¿Qué pregunta de Claude te hizo dar cuenta de algo que no tenías claro del flujo?**

La pregunta sobre cómo y cuándo queda registrado el contacto por WhatsApp
al docente. No lo tenía bien definido en el flujo: en la práctica lo hago
de forma manual y no había pensado en que ese paso necesitaba quedar
registrado como un estado propio dentro del proceso.

**2. ¿Qué diferencia hubo entre tu mapa inicial y lo que terminaste construyendo?**

Sí hay diferencia: el proceso construido queda más directo y ya no se
pierde registro de la información — antes ese seguimiento vivía en la
memoria y en la bandeja de correo de la coordinadora, y ahora queda
todo trazado en un solo lugar.

**3. Si tuvieras que hacer este flujo de verdad para ADIPA, ¿cuál sería el primer riesgo o pieza faltante?**

Falta poder filtrar por diplomado y ordenar por la fecha límite más
próxima, para ir registrando primero las actividades más urgentes.
Esto es clave porque en la realidad se pueden estar manejando unos 50
diplomados activos en simultáneo cada semana, con clases en distintos
módulos — sin ese filtro y ese orden por urgencia, el tablero se volvería
inmanejable a ese volumen.
