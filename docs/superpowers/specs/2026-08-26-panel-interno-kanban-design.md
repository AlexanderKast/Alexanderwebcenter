# Panel interno: proyectos y tablero Kanban

Fecha: 2026-08-26
Estado: diseño aprobado, pendiente de plan de implementación
Alcance: fase 1

## Problema

Alexander y Samuel llevan el control de sus proyectos internos en un Google Sheet
financiero de 11 hojas. El Sheet sirve para la plata, pero no sirve para saber
quién está trabajando en qué: hay proyectos sin responsable y sin estado, no hay
forma de ver el avance, y no se le puede dar acceso a un colaborador o a un tester
sin darle también las finanzas.

Hace falta un tablero interno dentro de la plataforma que ya existe, con login,
donde se vea el estado real de cada proyecto y quién lo tiene.

## Alcance

### Entra en fase 1

- Sociedades, socios y su porcentaje de participación
- Proyectos con sus dos estados: comercial y de trabajo
- Tablero Kanban con columnas configurables
- Links, tareas y comentarios por proyecto
- Roles y accesos, incluido un rol de tester
- Importación del Sheet actual, una sola vez

### No entra en fase 1

- Movimientos de ingresos y egresos
- TRM y conversión de USD a COP
- Reparto de gastos compartidos entre sociedades
- Aportes, préstamos y retiros de socios
- Los cinco dashboards financieros

La plata sigue viviendo en el Sheet hasta la fase 2.

## Fuente de datos

Google Sheet `1JgPC6aknBmxLP82I-0F-Xa3I7kep9xxfHT5zh1KYq_Y`.

De sus 11 hojas, la fase 1 usa dos.

**Configuración** (`gid=1785829694`) aporta:

- Cuatro sociedades: EcomNoticias, IA Master Tech, Nuskin y Compartido
- Seis socios: Alexander, Juan Carmona, Samuel Castaño, Lucía, Sara y Diana Mile
- La participación por sociedad, que suma 100% en las tres sociedades reales
- La lista de estados de proyecto

**Portafolio de proyectos** (`gid=1898545934`) aporta 12 filas: cuatro de
"Operación general", una por sociedad, que son contenedores de gastos y no
proyectos reales; y ocho proyectos de verdad.

Las hojas de dashboard son fórmulas. No se importan: se recalculan.

## Los dos ejes de estado

El Sheet ya trae un campo `Estado proyecto` con los valores Prospecto, Propuesta
enviada, En curso, Pausado, Cerrado y Perdido. Eso describe la relación comercial
con el cliente.

Lo que hace falta para el tablero es otra cosa: si alguien lo tomó, si arrancó, si
está en revisión. Hoy en el Sheet eso se ve solo por ausencia — *Bodega de Belleza*
y *Agente de videos Estefix* no tienen responsable ni estado.

Se guardan los dos ejes por separado:

- `estado_comercial` conserva los valores del Sheet y se muestra como badge
- `columna_id` apunta a una columna del tablero y define dónde cae la tarjeta

Un proyecto sin responsable arranca en la primera columna.

## Modelo de datos

Migración `supabase/migrations/0006_proyectos_internos.sql`, contra el Supabase del
sitio (`NEXT_PUBLIC_SUPABASE_URL`), no contra el del brief.

Las tablas nuevas se llaman con el prefijo `int_` para no chocar con las `portal_`
que ya existen y que sirven a los clientes.

### int_sociedades

`id`, `nombre` único, `descripcion`, `activa`, `created_at`.

Semilla: las cuatro del Sheet. `Compartido` queda con `activa = false` porque es un
mecanismo contable, no una sociedad.

### int_socios

`id`, `nombre`, `email`, `admin_user_id` nullable con FK a `admin_users`, `activo`.

El `admin_user_id` conecta un socio con su cuenta cuando la tiene. Lucía, Sara y
Diana Mile no tienen cuenta y se quedan en null.

### int_sociedad_socios

`id`, `sociedad_id`, `socio_id`, `pct_participacion` numeric(5,2), `rol_notas`.
Único por (`sociedad_id`, `socio_id`).

### int_kanban_columnas

`id`, `nombre`, `orden` int, `color` text, `es_inicial` bool, `es_final` bool,
`created_at`.

Las columnas se editan desde el panel. Semilla: Sin tomar, que es la inicial;
Iniciado; En proceso; En revisión; Bloqueado; y Entregado, que es la final.

Borrar una columna con proyectos adentro se rechaza: primero hay que moverlos.
Siempre debe quedar al menos una columna inicial y una final.

### int_proyectos

`id`, `sociedad_id` nullable, `nombre`, `cliente`, `responsable_id` nullable con FK
a `admin_users`, `estado_comercial`, `columna_id` FK a `int_kanban_columnas`,
`orden` int, `fecha_inicio` date, `fecha_cierre_est` date, `ppto_ingresos`
numeric(14,2), `ppto_gastos` numeric(14,2), `notas`, `es_operacion_general` bool,
`archivado` bool, `created_at`, `updated_at`.

`estado_comercial` lleva un check con los seis valores del Sheet.

`es_operacion_general` marca las cuatro filas contenedoras. No aparecen en el
tablero; existen para que la fase 2 tenga dónde colgar los gastos sin proyecto.

`orden` es la posición dentro de su columna y se recalcula al soltar una tarjeta.

Único por (`sociedad_id`, `nombre`), que es lo que hace idempotente al importador.

### int_proyecto_links

`id`, `proyecto_id`, `tipo` con check en repo, staging, produccion, drive, figma y
otro; `label`, `url`, `created_at`.

Solo links y notas. No se guardan credenciales.

### int_proyecto_tareas

`id`, `proyecto_id`, `titulo`, `descripcion`, `estado` con check en pendiente,
haciendo y hecha; `asignado_a` nullable, `orden`, `created_at`.

Son los cambios que se le hacen a un proyecto.

### int_proyecto_notas

`id`, `proyecto_id`, `autor_id`, `tipo` con check en bug o nota, `texto`,
`resuelto` bool, `created_at`.

Por acá reportan los testers.

### int_proyecto_actividad

`id`, `proyecto_id`, `actor_id`, `accion`, `detalle` jsonb, `created_at`.

Registra movimientos de columna, cambios de responsable y cambios de estado
comercial. De acá salen las estadísticas de ciclo. Sigue el patrón que ya usa
`lib/admin/activity-logger.ts`.

## Permisos

`admin_users` ya tiene los roles founder, manager, coordinator, sales y creative.
La migración extiende ese check para agregar `tester`.

| rol | tablero | editar proyecto | columnas y socios | invitar |
|---|---|---|---|---|
| founder | sí | sí | sí | sí |
| manager | sí | sí | sí | no |
| coordinator, creative, sales | sí | sí | no | no |
| tester | solo lectura | no | no | no |

El tester puede crear `int_proyecto_notas` y nada más.

Semilla de founders: `samuecatano@gmail.com` y `jacsolucionesgraficas@gmail.com`.
La migración los inserta en `admin_users` solo si ya existen en `auth.users`. Si no
existen, quedan pendientes de que cada uno entre una vez por `/admin/login`.

RLS activo en todas las tablas nuevas. Las lecturas van por service role desde
server components, igual que el resto del panel.

## Rutas y componentes

Todo cuelga de `/admin`, que ya está protegido por `middleware.ts`. No se agrega
login nuevo: el que existe hoy es el que se usa.

```
app/admin/proyectos/page.tsx           tablero
app/admin/proyectos/[id]/page.tsx      detalle
app/admin/proyectos/columnas/page.tsx  editar columnas (founder y manager)
app/admin/sociedades/page.tsx          sociedades, socios y porcentajes
app/actions/proyectos.ts               server actions
lib/proyectos/queries.ts               lecturas
lib/proyectos/types.ts                 tipos
components/proyectos/TableroInterno.tsx  cliente, envuelve KanbanBoard
components/proyectos/Estadisticas.tsx
components/proyectos/Filtros.tsx
components/proyectos/DetalleProyecto.tsx
```

Fuera de `TableroInterno`, todo es server component.

### Se reusa el KanbanBoard que ya existe

`components/portal/KanbanBoard.tsx` ya resuelve el arrastre con `@dnd-kit` y es
genérico: recibe `columns`, `onMoveItem`, `canEdit` y `onCardClick`, y su
`KanbanItem` ya trae `title`, `subtitle`, `badge`, `badgeColor`, `progress`,
`priority` y `meta`.

No se escribe un tablero nuevo. `TableroInterno` mapea proyectos a `KanbanItem` y
le pasa el `onMoveItem`. Si en el camino aparece algo que el componente no cubre,
se extiende ahí y el portal se beneficia igual.

## El tablero

Al soltar una tarjeta, un server action actualiza `columna_id` y `orden`, y escribe
en `int_proyecto_actividad`.

La tarjeta muestra el nombre del proyecto, la sociedad, el cliente, el responsable o
"sin tomar" cuando no lo tiene, la fecha de cierre estimada y el badge de estado
comercial.

Filtros por sociedad, responsable y estado comercial, guardados en la URL para poder
compartir una vista.

Los proyectos archivados y los de operación general no salen.

`canEdit` es false para el rol tester, que es justo lo que el componente ya soporta.

## Estadísticas

Una franja de tarjetas arriba del tablero, calculada del lado del servidor:

- Proyectos activos
- Cuántos hay por columna
- Cuántos sin responsable
- Cuántos por responsable
- Entregados este mes
- Promedio de días entre la columna inicial y la final, sacado de la actividad

## Importación

Script `scripts/importar-proyectos.ts`, se corre una vez con `SUPABASE_SERVICE_ROLE_KEY`.

Baja cada hoja por su export CSV, siembra sociedades, socios y participaciones desde
Configuración, y los 12 proyectos desde Portafolio.

El responsable se mapea por nombre contra `int_socios` y de ahí a `admin_users`. Los
proyectos sin estado caen en la columna inicial con `estado_comercial = 'Prospecto'`.

Las fechas del Sheet vienen como `21/7/2026`, o sea `D/M/YYYY`, y se normalizan a
ISO `YYYY-MM-DD` antes de insertar. Una fecha vacía queda en null.

Es idempotente: hace upsert por `nombre` en sociedades y socios, y por
(`sociedad_id`, `nombre`) en proyectos. Correrlo dos veces no duplica nada.

Al terminar imprime un resumen de lo insertado y de lo que no pudo mapear.

## Errores y casos borde

- Proyecto sin sociedad, como *Bodega de Belleza*: `sociedad_id` queda null y la
  tarjeta muestra "sin asignar"
- Responsable que no existe en `admin_users`: queda null y el proyecto cae en la
  columna inicial
- Dos personas arrastran la misma tarjeta: gana la última escritura y la actividad
  registra los dos movimientos
- Borrar una columna con proyectos adentro: se rechaza con mensaje
- Borrar la única columna inicial o la única final: se rechaza
- Falla el drag: la tarjeta vuelve a su lugar y sale un toast con `sonner`, que ya
  está en el proyecto

## Pruebas

- La migración corre limpia sobre la base actual
- El script de importación es idempotente
- Un tester no puede mover tarjetas ni editar proyectos
- Un coordinator no ve las rutas de columnas ni de sociedades
- Mover una tarjeta escribe en `int_proyecto_actividad`
- Los porcentajes de cada sociedad suman 100
- El tablero se puede usar en móvil

## Fase 2

Movimientos, TRM, reparto de gastos compartidos, aportes de socios y los dashboards.
Todo cuelga de `int_proyectos.id` y de `int_sociedades.id`, que esta fase deja listos.
