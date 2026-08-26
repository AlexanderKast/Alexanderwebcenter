# Panel interno de proyectos y Kanban — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dar a Alexander y Samuel un tablero Kanban interno dentro de `/admin`, alimentado por una base de datos que reemplaza el Portafolio de proyectos del Google Sheet, con roles y un rol de tester de solo lectura.

**Architecture:** Todo vive en la app Next.js que ya existe. Se agregan tablas con prefijo `int_` al Supabase del sitio, se reusa el login y el middleware de `/admin`, y se reusa el componente `components/portal/KanbanBoard.tsx` que ya resuelve el arrastre. Las lecturas van por service role desde server components; las escrituras por server actions que revalidan la ruta.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript 5, Supabase (`@supabase/ssr` + `@supabase/supabase-js`), `@dnd-kit/core`, Tailwind 4, `sonner`, `zod`, `lucide-react`. Se agregan `vitest` y `tsx` como devDependencies.

## Global Constraints

- Base de datos: el Supabase del sitio, o sea `NEXT_PUBLIC_SUPABASE_URL`. **Nunca** el del brief (`BRIEF_SUPABASE_*`).
- Todas las tablas nuevas llevan prefijo `int_`. No se tocan las tablas `portal_`, `ac_` ni `admin_users` salvo el check de `role`.
- No se crea login nuevo. `/admin` ya está protegido por `middleware.ts`.
- Idioma del código y de la UI: español, siguiendo el estilo de `lib/brief` y `lib/portal`.
- No se guardan credenciales ni contraseñas de accesos. Solo URLs y notas.
- Roles válidos tras la migración: `founder`, `manager`, `coordinator`, `sales`, `creative`, `tester`.
- Founders sembrados: `samuecatano@gmail.com` y `jacsolucionesgraficas@gmail.com`.
- Estados comerciales válidos, exactos: `Prospecto`, `Propuesta enviada`, `En curso`, `Pausado`, `Cerrado`, `Perdido`.
- Columnas Kanban sembradas, en orden: `Sin tomar` (inicial), `Iniciado`, `En proceso`, `En revisión`, `Bloqueado`, `Entregado` (final).
- Fuente de importación: Google Sheet `1JgPC6aknBmxLP82I-0F-Xa3I7kep9xxfHT5zh1KYq_Y`, hojas `gid=1785829694` (Configuración) y `gid=1898545934` (Portafolio).
- Antes de dar por cerrada cualquier tarea: `npx tsc --noEmit` y `npm run lint` deben pasar.
- `KanbanBoard.onMoveItem` solo mueve entre columnas. Reordenar tarjetas dentro de una misma columna está fuera de alcance.

---

## File Structure

**Se crean:**

| archivo | responsabilidad |
|---|---|
| `vitest.config.ts` | configuración del runner, alias `@` |
| `supabase/migrations/0006_proyectos_internos.sql` | tablas, checks, RLS, semillas |
| `supabase/COMO-CORRER-0006.md` | instructivo de la migración |
| `lib/proyectos/importar-utils.ts` | funciones puras: parseo CSV, fechas, moneda |
| `lib/proyectos/importar-utils.test.ts` | tests de lo anterior |
| `lib/proyectos/types.ts` | tipos y constantes del dominio |
| `lib/proyectos/permisos.ts` | qué puede hacer cada rol |
| `lib/proyectos/permisos.test.ts` | tests de permisos |
| `lib/proyectos/queries.ts` | lecturas por service role |
| `lib/proyectos/actividad.ts` | escribe `int_proyecto_actividad` |
| `app/actions/proyectos.ts` | acciones sobre proyectos |
| `app/actions/proyectos-detalle.ts` | acciones sobre links, tareas y notas |
| `app/actions/kanban-columnas.ts` | acciones sobre columnas |
| `components/proyectos/mapear.ts` | proyecto → `KanbanItem` |
| `components/proyectos/mapear.test.ts` | tests del mapeo |
| `components/proyectos/TableroInterno.tsx` | cliente; envuelve `KanbanBoard` |
| `components/proyectos/Estadisticas.tsx` | franja de métricas |
| `components/proyectos/Filtros.tsx` | filtros por URL |
| `components/proyectos/DetalleProyecto.tsx` | links, tareas y notas |
| `app/admin/proyectos/page.tsx` | tablero |
| `app/admin/proyectos/[id]/page.tsx` | detalle |
| `app/admin/proyectos/columnas/page.tsx` | editar columnas |
| `app/admin/sociedades/page.tsx` | sociedades, socios y porcentajes |
| `scripts/importar-proyectos.ts` | importación del Sheet |

**Se modifican:**

| archivo | cambio |
|---|---|
| `package.json` | devDependencies `vitest` y `tsx`; scripts `test` e `importar:proyectos` |
| `lib/auth.ts:6` | agregar `"tester"` al tipo `Role` |
| `components/admin/Sidebar.tsx:31-77` | sección nueva "Interno" en el nav |

---

### Task 1: Utilidades de importación y runner de tests

Arranca por acá porque es lógica pura y sin base de datos: se puede probar de verdad y el resto se apoya en ella.

**Files:**
- Create: `vitest.config.ts`
- Create: `lib/proyectos/importar-utils.ts`
- Test: `lib/proyectos/importar-utils.test.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: nada.
- Produces:
  - `parsearCSV(texto: string): string[][]`
  - `normalizarFecha(valor: string | undefined | null): string | null` — devuelve `YYYY-MM-DD` o `null`
  - `limpiarMoneda(valor: string | undefined | null): number | null`
  - `limpiarPorcentaje(valor: string | undefined | null): number | null`
  - `celda(fila: string[], indice: number): string`

- [ ] **Step 1: Instalar el runner**

```bash
npm install -D vitest@^3
```

- [ ] **Step 2: Crear la configuración de vitest**

Crear `vitest.config.ts`:

```ts
import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(process.cwd()) },
  },
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts", "components/**/*.test.ts"],
  },
});
```

- [ ] **Step 3: Agregar el script de test**

En `package.json`, dentro de `"scripts"`, agregar `"test"` después de `"lint"`:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test": "vitest run"
}
```

- [ ] **Step 4: Escribir el test que falla**

Crear `lib/proyectos/importar-utils.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  celda,
  limpiarMoneda,
  limpiarPorcentaje,
  normalizarFecha,
  parsearCSV,
} from "./importar-utils";

describe("parsearCSV", () => {
  it("separa filas y columnas simples", () => {
    expect(parsearCSV("a,b\nc,d")).toEqual([
      ["a", "b"],
      ["c", "d"],
    ]);
  });

  it("respeta las comas dentro de comillas", () => {
    expect(parsearCSV('IA Master Tech,"Alexander, Juan Carmona"')).toEqual([
      ["IA Master Tech", "Alexander, Juan Carmona"],
    ]);
  });

  it("entiende las comillas escapadas", () => {
    expect(parsearCSV('"dijo ""hola""",x')).toEqual([['dijo "hola"', "x"]]);
  });

  it("acepta saltos de linea dentro de comillas", () => {
    expect(parsearCSV('"linea1\nlinea2",b')).toEqual([["linea1\nlinea2", "b"]]);
  });

  it("normaliza CRLF", () => {
    expect(parsearCSV("a,b\r\nc,d")).toEqual([
      ["a", "b"],
      ["c", "d"],
    ]);
  });

  it("devuelve arreglo vacio con texto vacio", () => {
    expect(parsearCSV("")).toEqual([]);
  });
});

describe("normalizarFecha", () => {
  it("convierte D/M/YYYY a ISO", () => {
    expect(normalizarFecha("21/7/2026")).toBe("2026-07-21");
  });

  it("convierte DD/MM/YYYY a ISO", () => {
    expect(normalizarFecha("17/08/2026")).toBe("2026-08-17");
  });

  it("deja pasar una fecha que ya viene ISO", () => {
    expect(normalizarFecha("2026-07-22")).toBe("2026-07-22");
  });

  it("devuelve null con celda vacia", () => {
    expect(normalizarFecha("")).toBeNull();
    expect(normalizarFecha(undefined)).toBeNull();
    expect(normalizarFecha(null)).toBeNull();
  });

  it("devuelve null con basura", () => {
    expect(normalizarFecha("—")).toBeNull();
    expect(normalizarFecha("proximamente")).toBeNull();
  });

  it("devuelve null con una fecha imposible", () => {
    expect(normalizarFecha("32/13/2026")).toBeNull();
  });
});

describe("limpiarMoneda", () => {
  it("quita simbolo y separadores de miles", () => {
    expect(limpiarMoneda("$655,601")).toBe(655601);
  });

  it("entiende decimales", () => {
    expect(limpiarMoneda("238,080.00")).toBe(238080);
  });

  it("lee los parentesis como negativo", () => {
    expect(limpiarMoneda("($58,196)")).toBe(-58196);
  });

  it("devuelve null con guion o vacio", () => {
    expect(limpiarMoneda("-")).toBeNull();
    expect(limpiarMoneda("")).toBeNull();
    expect(limpiarMoneda(undefined)).toBeNull();
  });
});

describe("limpiarPorcentaje", () => {
  it("convierte 33.3% en numero", () => {
    expect(limpiarPorcentaje("33.3%")).toBe(33.3);
  });

  it("acepta el numero sin simbolo", () => {
    expect(limpiarPorcentaje("40")).toBe(40);
  });

  it("devuelve null con vacio", () => {
    expect(limpiarPorcentaje("")).toBeNull();
  });
});

describe("celda", () => {
  it("recorta el contenido", () => {
    expect(celda(["  hola  ", "b"], 0)).toBe("hola");
  });

  it("devuelve cadena vacia si el indice no existe", () => {
    expect(celda(["a"], 5)).toBe("");
  });
});
```

- [ ] **Step 5: Correr el test y verificar que falla**

```bash
npm test
```

Esperado: FAIL con `Failed to resolve import "./importar-utils"`.

- [ ] **Step 6: Escribir la implementación**

Crear `lib/proyectos/importar-utils.ts`:

```ts
/**
 * Utilidades para leer el Google Sheet financiero.
 *
 * El export CSV de Google entrecomilla cualquier celda con comas, comillas o
 * saltos de linea, asi que un split por coma no alcanza.
 */

/** Parser CSV minimo: comillas dobles, comillas escapadas y saltos internos. */
export function parsearCSV(texto: string): string[][] {
  if (!texto) return [];

  const filas: string[][] = [];
  let fila: string[] = [];
  let campo = "";
  let enComillas = false;

  const normalizado = texto.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  for (let i = 0; i < normalizado.length; i++) {
    const c = normalizado[i];

    if (enComillas) {
      if (c === '"') {
        if (normalizado[i + 1] === '"') {
          campo += '"';
          i++;
        } else {
          enComillas = false;
        }
      } else {
        campo += c;
      }
      continue;
    }

    if (c === '"') {
      enComillas = true;
    } else if (c === ",") {
      fila.push(campo);
      campo = "";
    } else if (c === "\n") {
      fila.push(campo);
      filas.push(fila);
      fila = [];
      campo = "";
    } else {
      campo += c;
    }
  }

  if (campo !== "" || fila.length > 0) {
    fila.push(campo);
    filas.push(fila);
  }

  return filas;
}

/** Contenido recortado de una celda, o cadena vacia si no existe. */
export function celda(fila: string[], indice: number): string {
  return (fila[indice] ?? "").trim();
}

/**
 * El Sheet escribe las fechas como 21/7/2026. La base las quiere ISO.
 * Cualquier cosa que no sea una fecha real devuelve null.
 */
export function normalizarFecha(valor: string | undefined | null): string | null {
  const texto = (valor ?? "").trim();
  if (!texto) return null;

  const iso = texto.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) {
    return esFechaReal(Number(iso[1]), Number(iso[2]), Number(iso[3])) ? texto : null;
  }

  const latino = texto.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!latino) return null;

  const dia = Number(latino[1]);
  const mes = Number(latino[2]);
  const anio = Number(latino[3]);
  if (!esFechaReal(anio, mes, dia)) return null;

  return `${anio}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}

function esFechaReal(anio: number, mes: number, dia: number): boolean {
  if (mes < 1 || mes > 12 || dia < 1 || dia > 31) return false;
  const fecha = new Date(Date.UTC(anio, mes - 1, dia));
  return (
    fecha.getUTCFullYear() === anio &&
    fecha.getUTCMonth() === mes - 1 &&
    fecha.getUTCDate() === dia
  );
}

/**
 * Los montos vienen como $655,601 y los negativos entre parentesis, que es
 * como Excel muestra la contabilidad. El guion solo significa "vacio".
 */
export function limpiarMoneda(valor: string | undefined | null): number | null {
  const texto = (valor ?? "").trim();
  if (!texto || texto === "-" || texto === "—") return null;

  const negativo = texto.startsWith("(") && texto.endsWith(")");
  const soloNumero = texto.replace(/[()$\s]/g, "").replace(/,/g, "");
  if (!soloNumero) return null;

  const numero = Number(soloNumero);
  if (!Number.isFinite(numero)) return null;

  return negativo ? -numero : numero;
}

/** 33.3% devuelve 33.3. */
export function limpiarPorcentaje(valor: string | undefined | null): number | null {
  const texto = (valor ?? "").trim().replace("%", "");
  if (!texto) return null;
  const numero = Number(texto);
  return Number.isFinite(numero) ? numero : null;
}
```

- [ ] **Step 7: Correr los tests y verificar que pasan**

```bash
npm test
```

Esperado: PASS, 20 tests.

- [ ] **Step 8: Verificar tipos y lint**

```bash
npx tsc --noEmit && npm run lint
```

Esperado: sin errores.

- [ ] **Step 9: Commit**

```bash
git add vitest.config.ts package.json package-lock.json lib/proyectos/importar-utils.ts lib/proyectos/importar-utils.test.ts
git commit -m "feat(interno): utilidades de importacion del sheet y runner de tests"
```

---

### Task 2: Migración de base de datos

**Files:**
- Create: `supabase/migrations/0006_proyectos_internos.sql`
- Create: `supabase/COMO-CORRER-0006.md`

**Interfaces:**
- Consumes: nada.
- Produces: tablas `int_sociedades`, `int_socios`, `int_sociedad_socios`, `int_kanban_columnas`, `int_proyectos`, `int_proyecto_links`, `int_proyecto_tareas`, `int_proyecto_notas`, `int_proyecto_actividad`. Rol `tester` habilitado en `admin_users`.

- [ ] **Step 1: Escribir la migración**

Crear `supabase/migrations/0006_proyectos_internos.sql`:

```sql
-- ============================================================
-- 0006 — Panel interno: proyectos y tablero Kanban
-- Reemplaza la hoja "Portafolio de proyectos" del Google Sheet.
-- Corre contra la base del sitio, no contra la del brief.
-- ============================================================

-- ------------------------------------------------------------
-- 0. Rol tester en admin_users
-- ------------------------------------------------------------
alter table public.admin_users drop constraint if exists admin_users_role_check;
alter table public.admin_users add constraint admin_users_role_check
  check (role in ('founder','manager','coordinator','sales','creative','tester'));

-- ------------------------------------------------------------
-- 1. Sociedades
-- ------------------------------------------------------------
create table if not exists public.int_sociedades (
  id           uuid primary key default gen_random_uuid(),
  nombre       text not null unique,
  descripcion  text,
  activa       boolean not null default true,
  created_at   timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 2. Socios
-- ------------------------------------------------------------
create table if not exists public.int_socios (
  id             uuid primary key default gen_random_uuid(),
  nombre         text not null unique,
  email          text,
  admin_user_id  uuid references public.admin_users(id) on delete set null,
  activo         boolean not null default true,
  created_at     timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 3. Participacion de cada socio en cada sociedad
-- ------------------------------------------------------------
create table if not exists public.int_sociedad_socios (
  id                uuid primary key default gen_random_uuid(),
  sociedad_id       uuid not null references public.int_sociedades(id) on delete cascade,
  socio_id          uuid not null references public.int_socios(id) on delete cascade,
  pct_participacion numeric(5,2) not null default 0,
  rol_notas         text,
  unique (sociedad_id, socio_id)
);

-- ------------------------------------------------------------
-- 4. Columnas del tablero. Configurables desde el panel.
-- ------------------------------------------------------------
create table if not exists public.int_kanban_columnas (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  orden       integer not null,
  color       text not null default 'bg-white/10 text-white/60',
  es_inicial  boolean not null default false,
  es_final    boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists int_kanban_columnas_orden_idx
  on public.int_kanban_columnas (orden);

-- ------------------------------------------------------------
-- 5. Proyectos
-- ------------------------------------------------------------
create table if not exists public.int_proyectos (
  id                    uuid primary key default gen_random_uuid(),
  sociedad_id           uuid references public.int_sociedades(id) on delete set null,
  nombre                text not null,
  cliente               text,
  responsable_id        uuid references public.admin_users(id) on delete set null,
  estado_comercial      text not null default 'Prospecto'
    check (estado_comercial in
      ('Prospecto','Propuesta enviada','En curso','Pausado','Cerrado','Perdido')),
  columna_id            uuid references public.int_kanban_columnas(id) on delete restrict,
  orden                 integer not null default 0,
  fecha_inicio          date,
  fecha_cierre_est      date,
  ppto_ingresos         numeric(14,2),
  ppto_gastos           numeric(14,2),
  notas                 text,
  es_operacion_general  boolean not null default false,
  archivado             boolean not null default false,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- Bodega de Belleza no tiene sociedad. En un unique normal, NULL nunca choca
-- con NULL, asi que el importador la duplicaria en cada corrida. El coalesce
-- le da una llave estable.
create unique index if not exists int_proyectos_sociedad_nombre_idx
  on public.int_proyectos (
    coalesce(sociedad_id, '00000000-0000-0000-0000-000000000000'::uuid),
    lower(nombre)
  );
create index if not exists int_proyectos_columna_idx
  on public.int_proyectos (columna_id, orden);
create index if not exists int_proyectos_responsable_idx
  on public.int_proyectos (responsable_id);

-- ------------------------------------------------------------
-- 6. Links del proyecto. Solo URLs y notas, nunca credenciales.
-- ------------------------------------------------------------
create table if not exists public.int_proyecto_links (
  id           uuid primary key default gen_random_uuid(),
  proyecto_id  uuid not null references public.int_proyectos(id) on delete cascade,
  tipo         text not null default 'otro'
    check (tipo in ('repo','staging','produccion','drive','figma','otro')),
  label        text not null,
  url          text not null,
  created_at   timestamptz not null default now()
);
create index if not exists int_proyecto_links_proyecto_idx
  on public.int_proyecto_links (proyecto_id);

-- ------------------------------------------------------------
-- 7. Tareas: los cambios que se le hacen a un proyecto
-- ------------------------------------------------------------
create table if not exists public.int_proyecto_tareas (
  id           uuid primary key default gen_random_uuid(),
  proyecto_id  uuid not null references public.int_proyectos(id) on delete cascade,
  titulo       text not null,
  descripcion  text,
  estado       text not null default 'pendiente'
    check (estado in ('pendiente','haciendo','hecha')),
  asignado_a   uuid references public.admin_users(id) on delete set null,
  orden        integer not null default 0,
  created_at   timestamptz not null default now()
);
create index if not exists int_proyecto_tareas_proyecto_idx
  on public.int_proyecto_tareas (proyecto_id, orden);

-- ------------------------------------------------------------
-- 8. Notas y bugs. Por aca reportan los testers.
-- ------------------------------------------------------------
create table if not exists public.int_proyecto_notas (
  id           uuid primary key default gen_random_uuid(),
  proyecto_id  uuid not null references public.int_proyectos(id) on delete cascade,
  autor_id     uuid references public.admin_users(id) on delete set null,
  tipo         text not null default 'nota' check (tipo in ('bug','nota')),
  texto        text not null,
  resuelto     boolean not null default false,
  created_at   timestamptz not null default now()
);
create index if not exists int_proyecto_notas_proyecto_idx
  on public.int_proyecto_notas (proyecto_id, created_at desc);

-- ------------------------------------------------------------
-- 9. Actividad. De aca salen las estadisticas de ciclo.
-- ------------------------------------------------------------
create table if not exists public.int_proyecto_actividad (
  id           uuid primary key default gen_random_uuid(),
  proyecto_id  uuid not null references public.int_proyectos(id) on delete cascade,
  actor_id     uuid references public.admin_users(id) on delete set null,
  accion       text not null,
  detalle      jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now()
);
create index if not exists int_proyecto_actividad_proyecto_idx
  on public.int_proyecto_actividad (proyecto_id, created_at desc);

-- ------------------------------------------------------------
-- 10. RLS. Todo entra por service role desde el servidor, asi que
--     las tablas quedan cerradas para anon y authenticated.
-- ------------------------------------------------------------
alter table public.int_sociedades          enable row level security;
alter table public.int_socios              enable row level security;
alter table public.int_sociedad_socios     enable row level security;
alter table public.int_kanban_columnas     enable row level security;
alter table public.int_proyectos           enable row level security;
alter table public.int_proyecto_links      enable row level security;
alter table public.int_proyecto_tareas     enable row level security;
alter table public.int_proyecto_notas      enable row level security;
alter table public.int_proyecto_actividad  enable row level security;

-- ------------------------------------------------------------
-- 11. Semillas
-- ------------------------------------------------------------
insert into public.int_sociedades (nombre, descripcion, activa) values
  ('EcomNoticias',   'Medio / comunidad ecommerce',    true),
  ('IA Master Tech', 'Desarrollo de software e IA',    true),
  ('Nuskin',         'Negocio Nuskin',                 true),
  ('Compartido',     'Mecanismo contable para gastos repartidos entre sociedades', false)
on conflict (nombre) do nothing;

insert into public.int_kanban_columnas (nombre, orden, color, es_inicial, es_final)
select * from (values
  ('Sin tomar',   1, 'bg-white/10 text-white/60',          true,  false),
  ('Iniciado',    2, 'bg-sky-500/15 text-sky-300',         false, false),
  ('En proceso',  3, 'bg-amber-500/15 text-amber-300',     false, false),
  ('En revisión', 4, 'bg-violet-500/15 text-violet-300',   false, false),
  ('Bloqueado',   5, 'bg-red-500/15 text-red-300',         false, false),
  ('Entregado',   6, 'bg-emerald-500/15 text-emerald-300', false, true)
) as semilla(nombre, orden, color, es_inicial, es_final)
where not exists (select 1 from public.int_kanban_columnas);

-- Founders. Solo entran si ya tienen cuenta en auth.users; si todavia no se
-- registraron, entran solos la primera vez que pasen por /admin/login y ahi
-- hay que volver a correr este insert.
insert into public.admin_users (auth_user_id, email, full_name, role, is_active)
select u.id, u.email, coalesce(u.raw_user_meta_data->>'full_name', u.email), 'founder', true
from auth.users u
where lower(u.email) in ('samuecatano@gmail.com', 'jacsolucionesgraficas@gmail.com')
on conflict (auth_user_id) do update
  set role = 'founder', is_active = true;
```

- [ ] **Step 2: Escribir el instructivo**

Crear `supabase/COMO-CORRER-0006.md`:

````markdown
# Cómo correr la migración 0006

1. Entrar al panel de Supabase del **sitio** (el de `NEXT_PUBLIC_SUPABASE_URL`),
   no al del brief.
2. Ir a **SQL Editor** y abrir una consulta nueva.
3. Pegar entero el contenido de `supabase/migrations/0006_proyectos_internos.sql`.
4. Correr. Debe terminar sin errores.
5. Verificar con las consultas de abajo.

```sql
select table_name
from information_schema.tables
where table_schema = 'public' and table_name like 'int_%'
order by table_name;
```

Deben salir 9 filas.

```sql
select nombre, orden, es_inicial, es_final
from public.int_kanban_columnas order by orden;
```

Deben salir las 6 columnas, con `Sin tomar` inicial y `Entregado` final.

```sql
select email, role from public.admin_users where role = 'founder';
```

Si Samuel o Alexander no aparecen, es que todavía no entraron nunca por
`/admin/login`. Que entren una vez y volvés a correr solo el último `insert`
del archivo.
````

- [ ] **Step 3: Correr la migración**

Seguir `supabase/COMO-CORRER-0006.md`. Es un paso manual en el panel de Supabase.

- [ ] **Step 4: Verificar**

Correr las tres consultas del instructivo.
Esperado: 9 tablas, 6 columnas, y los founders que ya tengan cuenta.

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/0006_proyectos_internos.sql supabase/COMO-CORRER-0006.md
git commit -m "feat(interno): migracion de proyectos, kanban y rol tester"
```

---

### Task 3: Tipos y permisos

**Files:**
- Create: `lib/proyectos/types.ts`
- Create: `lib/proyectos/permisos.ts`
- Test: `lib/proyectos/permisos.test.ts`
- Modify: `lib/auth.ts:6`

**Interfaces:**
- Consumes: `Role` de `@/lib/auth`.
- Produces:
  - `ESTADOS_COMERCIALES`, `EstadoComercial`, `TIPOS_LINK`, `TipoLink`, `ESTADOS_TAREA`, `EstadoTarea`
  - `Sociedad`, `Socio`, `ParticipacionSocio`, `ColumnaKanban`, `Proyecto`, `ProyectoLink`, `ProyectoTarea`, `ProyectoNota`, `EstadisticasTablero`, `FiltrosTablero`
  - `puedeEditarProyectos(rol: Role): boolean`
  - `puedeGestionarConfiguracion(rol: Role): boolean`
  - `puedeInvitar(rol: Role): boolean`
  - `puedeComentar(rol: Role): boolean`

- [ ] **Step 1: Agregar el rol tester al tipo Role**

En `lib/auth.ts`, línea 6, reemplazar:

```ts
export type Role = "founder" | "manager" | "coordinator" | "sales" | "creative";
```

por:

```ts
export type Role =
  | "founder"
  | "manager"
  | "coordinator"
  | "sales"
  | "creative"
  | "tester";
```

- [ ] **Step 2: Escribir el test que falla**

Crear `lib/proyectos/permisos.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import type { Role } from "@/lib/auth";
import {
  puedeComentar,
  puedeEditarProyectos,
  puedeGestionarConfiguracion,
  puedeInvitar,
} from "./permisos";

const TODOS: Role[] = [
  "founder",
  "manager",
  "coordinator",
  "sales",
  "creative",
  "tester",
];

describe("puedeEditarProyectos", () => {
  it("deja a todos menos al tester", () => {
    for (const rol of TODOS) {
      expect(puedeEditarProyectos(rol)).toBe(rol !== "tester");
    }
  });
});

describe("puedeGestionarConfiguracion", () => {
  it("solo founder y manager", () => {
    expect(puedeGestionarConfiguracion("founder")).toBe(true);
    expect(puedeGestionarConfiguracion("manager")).toBe(true);
    expect(puedeGestionarConfiguracion("coordinator")).toBe(false);
    expect(puedeGestionarConfiguracion("creative")).toBe(false);
    expect(puedeGestionarConfiguracion("sales")).toBe(false);
    expect(puedeGestionarConfiguracion("tester")).toBe(false);
  });
});

describe("puedeInvitar", () => {
  it("solo founder", () => {
    for (const rol of TODOS) {
      expect(puedeInvitar(rol)).toBe(rol === "founder");
    }
  });
});

describe("puedeComentar", () => {
  it("todos pueden, incluido el tester", () => {
    for (const rol of TODOS) {
      expect(puedeComentar(rol)).toBe(true);
    }
  });
});
```

- [ ] **Step 3: Correr el test y verificar que falla**

```bash
npm test
```

Esperado: FAIL con `Failed to resolve import "./permisos"`.

- [ ] **Step 4: Escribir los permisos**

Crear `lib/proyectos/permisos.ts`:

```ts
import type { Role } from "@/lib/auth";

/**
 * Quien puede hacer que en el panel interno.
 *
 * El tester es el rol que se le da a alguien de afuera para que mire y
 * reporte: ve el tablero y escribe notas, pero no toca nada mas.
 */

/** Mover tarjetas, crear y editar proyectos, tareas y links. */
export function puedeEditarProyectos(rol: Role): boolean {
  return rol !== "tester";
}

/** Editar columnas del tablero y ver sociedades, socios y porcentajes. */
export function puedeGestionarConfiguracion(rol: Role): boolean {
  return rol === "founder" || rol === "manager";
}

/** Dar de alta gente nueva en el panel. */
export function puedeInvitar(rol: Role): boolean {
  return rol === "founder";
}

/** Dejar notas y reportar bugs. Todos, incluido el tester. */
export function puedeComentar(_rol: Role): boolean {
  return true;
}
```

- [ ] **Step 5: Escribir los tipos**

Crear `lib/proyectos/types.ts`:

```ts
export const ESTADOS_COMERCIALES = [
  "Prospecto",
  "Propuesta enviada",
  "En curso",
  "Pausado",
  "Cerrado",
  "Perdido",
] as const;

export type EstadoComercial = (typeof ESTADOS_COMERCIALES)[number];

export const TIPOS_LINK = [
  "repo",
  "staging",
  "produccion",
  "drive",
  "figma",
  "otro",
] as const;

export type TipoLink = (typeof TIPOS_LINK)[number];

export const ESTADOS_TAREA = ["pendiente", "haciendo", "hecha"] as const;
export type EstadoTarea = (typeof ESTADOS_TAREA)[number];

export interface Sociedad {
  id: string;
  nombre: string;
  descripcion: string | null;
  activa: boolean;
}

export interface Socio {
  id: string;
  nombre: string;
  email: string | null;
  adminUserId: string | null;
  activo: boolean;
}

export interface ParticipacionSocio {
  sociedadId: string;
  sociedadNombre: string;
  socioId: string;
  socioNombre: string;
  pct: number;
  rolNotas: string | null;
}

export interface ColumnaKanban {
  id: string;
  nombre: string;
  orden: number;
  color: string;
  esInicial: boolean;
  esFinal: boolean;
}

export interface Proyecto {
  id: string;
  nombre: string;
  cliente: string | null;
  sociedadId: string | null;
  sociedadNombre: string | null;
  responsableId: string | null;
  responsableNombre: string | null;
  estadoComercial: EstadoComercial;
  columnaId: string | null;
  orden: number;
  fechaInicio: string | null;
  fechaCierreEst: string | null;
  pptoIngresos: number | null;
  pptoGastos: number | null;
  notas: string | null;
  archivado: boolean;
}

export interface ProyectoLink {
  id: string;
  proyectoId: string;
  tipo: TipoLink;
  label: string;
  url: string;
}

export interface ProyectoTarea {
  id: string;
  proyectoId: string;
  titulo: string;
  descripcion: string | null;
  estado: EstadoTarea;
  asignadoA: string | null;
  asignadoNombre: string | null;
  orden: number;
}

export interface ProyectoNota {
  id: string;
  proyectoId: string;
  autorId: string | null;
  autorNombre: string | null;
  tipo: "bug" | "nota";
  texto: string;
  resuelto: boolean;
  createdAt: string;
}

export interface EstadisticasTablero {
  activos: number;
  sinResponsable: number;
  entregadosEsteMes: number;
  porColumna: { columnaId: string; nombre: string; total: number }[];
  porResponsable: { nombre: string; total: number }[];
  diasPromedioCiclo: number | null;
}

export interface FiltrosTablero {
  sociedadId?: string;
  responsableId?: string;
  estadoComercial?: EstadoComercial;
}
```

- [ ] **Step 6: Correr los tests y verificar que pasan**

```bash
npm test
```

Esperado: PASS, 24 tests.

- [ ] **Step 7: Verificar tipos y lint**

```bash
npx tsc --noEmit && npm run lint
```

Esperado: sin errores.

- [ ] **Step 8: Commit**

```bash
git add lib/auth.ts lib/proyectos/types.ts lib/proyectos/permisos.ts lib/proyectos/permisos.test.ts
git commit -m "feat(interno): tipos del dominio, permisos por rol y rol tester"
```

---

### Task 4: Lecturas y actividad

**Files:**
- Create: `lib/proyectos/actividad.ts`
- Create: `lib/proyectos/queries.ts`

**Interfaces:**
- Consumes: `createSupabaseServiceRole` de `@/lib/supabase/server`; los tipos de `@/lib/proyectos/types`.
- Produces:
  - `registrarActividad(params: RegistrarActividadParams): Promise<void>` con `Accion` = `"proyecto_creado" | "proyecto_movido" | "proyecto_editado" | "proyecto_archivado" | "responsable_asignado" | "estado_comercial_cambiado"`
  - `listarColumnas(): Promise<ColumnaKanban[]>`
  - `listarSociedades(): Promise<Sociedad[]>`
  - `listarSocios(): Promise<Socio[]>`
  - `listarParticipaciones(): Promise<ParticipacionSocio[]>`
  - `listarResponsables(): Promise<{ id: string; nombre: string }[]>`
  - `listarProyectos(filtros?: FiltrosTablero): Promise<Proyecto[]>`
  - `obtenerProyecto(id: string): Promise<Proyecto | null>`
  - `listarLinks(proyectoId: string): Promise<ProyectoLink[]>`
  - `listarTareas(proyectoId: string): Promise<ProyectoTarea[]>`
  - `listarNotas(proyectoId: string): Promise<ProyectoNota[]>`
  - `calcularEstadisticas(proyectos: Proyecto[], columnas: ColumnaKanban[]): Promise<EstadisticasTablero>`

- [ ] **Step 1: Escribir el registro de actividad**

Crear `lib/proyectos/actividad.ts`:

```ts
import "server-only";
import { createSupabaseServiceRole } from "@/lib/supabase/server";

export const ACCIONES = [
  "proyecto_creado",
  "proyecto_movido",
  "proyecto_editado",
  "proyecto_archivado",
  "responsable_asignado",
  "estado_comercial_cambiado",
] as const;

export type Accion = (typeof ACCIONES)[number];

export interface RegistrarActividadParams {
  proyectoId: string;
  actorId: string | null;
  accion: Accion;
  detalle?: Record<string, unknown>;
}

/**
 * Deja rastro de lo que pasa con un proyecto. De aca salen las estadisticas
 * de ciclo. Nunca lanza: que falle el log no puede tumbar la accion.
 */
export async function registrarActividad(
  params: RegistrarActividadParams,
): Promise<void> {
  try {
    const supabase = createSupabaseServiceRole();
    const { error } = await supabase.from("int_proyecto_actividad").insert({
      proyecto_id: params.proyectoId,
      actor_id: params.actorId,
      accion: params.accion,
      detalle: params.detalle ?? {},
    });
    if (error) console.error("[int-actividad] insert fallo:", error.message);
  } catch (err) {
    console.error("[int-actividad] excepcion:", err);
  }
}
```

- [ ] **Step 2: Escribir las lecturas**

Crear `lib/proyectos/queries.ts`:

```ts
import "server-only";
import { createSupabaseServiceRole } from "@/lib/supabase/server";
import type {
  ColumnaKanban,
  EstadisticasTablero,
  EstadoComercial,
  EstadoTarea,
  FiltrosTablero,
  ParticipacionSocio,
  Proyecto,
  ProyectoLink,
  ProyectoNota,
  ProyectoTarea,
  Sociedad,
  Socio,
  TipoLink,
} from "./types";

/**
 * Todo entra por service role: las tablas int_ tienen RLS prendido y sin
 * politicas, asi que solo el servidor las ve. El control de acceso lo hace
 * requireAuth mas los permisos por rol, no la base.
 */

export async function listarColumnas(): Promise<ColumnaKanban[]> {
  const supabase = createSupabaseServiceRole();
  const { data, error } = await supabase
    .from("int_kanban_columnas")
    .select("id, nombre, orden, color, es_inicial, es_final")
    .order("orden", { ascending: true });

  if (error) {
    console.error("[int-queries] listarColumnas:", error.message);
    return [];
  }

  return (data ?? []).map((c) => ({
    id: c.id as string,
    nombre: c.nombre as string,
    orden: c.orden as number,
    color: c.color as string,
    esInicial: c.es_inicial as boolean,
    esFinal: c.es_final as boolean,
  }));
}

export async function listarSociedades(): Promise<Sociedad[]> {
  const supabase = createSupabaseServiceRole();
  const { data, error } = await supabase
    .from("int_sociedades")
    .select("id, nombre, descripcion, activa")
    .order("nombre", { ascending: true });

  if (error) {
    console.error("[int-queries] listarSociedades:", error.message);
    return [];
  }

  return (data ?? []).map((s) => ({
    id: s.id as string,
    nombre: s.nombre as string,
    descripcion: s.descripcion as string | null,
    activa: s.activa as boolean,
  }));
}

export async function listarSocios(): Promise<Socio[]> {
  const supabase = createSupabaseServiceRole();
  const { data, error } = await supabase
    .from("int_socios")
    .select("id, nombre, email, admin_user_id, activo")
    .order("nombre", { ascending: true });

  if (error) {
    console.error("[int-queries] listarSocios:", error.message);
    return [];
  }

  return (data ?? []).map((s) => ({
    id: s.id as string,
    nombre: s.nombre as string,
    email: s.email as string | null,
    adminUserId: s.admin_user_id as string | null,
    activo: s.activo as boolean,
  }));
}

export async function listarParticipaciones(): Promise<ParticipacionSocio[]> {
  const supabase = createSupabaseServiceRole();
  const [{ data: filas, error }, sociedades, socios] = await Promise.all([
    supabase
      .from("int_sociedad_socios")
      .select("sociedad_id, socio_id, pct_participacion, rol_notas"),
    listarSociedades(),
    listarSocios(),
  ]);

  if (error) {
    console.error("[int-queries] listarParticipaciones:", error.message);
    return [];
  }

  const nombreSociedad = new Map(sociedades.map((s) => [s.id, s.nombre]));
  const nombreSocio = new Map(socios.map((s) => [s.id, s.nombre]));

  return (filas ?? []).map((f) => ({
    sociedadId: f.sociedad_id as string,
    sociedadNombre: nombreSociedad.get(f.sociedad_id as string) ?? "—",
    socioId: f.socio_id as string,
    socioNombre: nombreSocio.get(f.socio_id as string) ?? "—",
    pct: Number(f.pct_participacion ?? 0),
    rolNotas: f.rol_notas as string | null,
  }));
}

/** Gente del panel que puede aparecer como responsable de un proyecto. */
export async function listarResponsables(): Promise<
  { id: string; nombre: string }[]
> {
  const supabase = createSupabaseServiceRole();
  const { data, error } = await supabase
    .from("admin_users")
    .select("id, full_name, email, role, is_active")
    .eq("is_active", true)
    .neq("role", "tester")
    .order("full_name", { ascending: true });

  if (error) {
    console.error("[int-queries] listarResponsables:", error.message);
    return [];
  }

  return (data ?? []).map((u) => ({
    id: u.id as string,
    nombre: (u.full_name as string | null) ?? (u.email as string),
  }));
}

export async function listarProyectos(
  filtros: FiltrosTablero = {},
): Promise<Proyecto[]> {
  const supabase = createSupabaseServiceRole();

  let consulta = supabase
    .from("int_proyectos")
    .select(
      "id, sociedad_id, nombre, cliente, responsable_id, estado_comercial, columna_id, orden, fecha_inicio, fecha_cierre_est, ppto_ingresos, ppto_gastos, notas, archivado",
    )
    .eq("archivado", false)
    .eq("es_operacion_general", false)
    .order("orden", { ascending: true });

  if (filtros.sociedadId) consulta = consulta.eq("sociedad_id", filtros.sociedadId);
  if (filtros.responsableId)
    consulta = consulta.eq("responsable_id", filtros.responsableId);
  if (filtros.estadoComercial)
    consulta = consulta.eq("estado_comercial", filtros.estadoComercial);

  const [{ data, error }, sociedades, responsables] = await Promise.all([
    consulta,
    listarSociedades(),
    listarResponsables(),
  ]);

  if (error) {
    console.error("[int-queries] listarProyectos:", error.message);
    return [];
  }

  return mapearProyectos(data ?? [], sociedades, responsables);
}

export async function obtenerProyecto(id: string): Promise<Proyecto | null> {
  const supabase = createSupabaseServiceRole();
  const [{ data, error }, sociedades, responsables] = await Promise.all([
    supabase
      .from("int_proyectos")
      .select(
        "id, sociedad_id, nombre, cliente, responsable_id, estado_comercial, columna_id, orden, fecha_inicio, fecha_cierre_est, ppto_ingresos, ppto_gastos, notas, archivado",
      )
      .eq("id", id)
      .maybeSingle(),
    listarSociedades(),
    listarResponsables(),
  ]);

  if (error || !data) {
    if (error) console.error("[int-queries] obtenerProyecto:", error.message);
    return null;
  }

  return mapearProyectos([data], sociedades, responsables)[0] ?? null;
}

type FilaProyecto = Record<string, unknown>;

function mapearProyectos(
  filas: FilaProyecto[],
  sociedades: Sociedad[],
  responsables: { id: string; nombre: string }[],
): Proyecto[] {
  const nombreSociedad = new Map(sociedades.map((s) => [s.id, s.nombre]));
  const nombreResponsable = new Map(responsables.map((r) => [r.id, r.nombre]));

  return filas.map((p) => {
    const sociedadId = (p.sociedad_id as string | null) ?? null;
    const responsableId = (p.responsable_id as string | null) ?? null;

    return {
      id: p.id as string,
      nombre: p.nombre as string,
      cliente: (p.cliente as string | null) ?? null,
      sociedadId,
      sociedadNombre: sociedadId ? (nombreSociedad.get(sociedadId) ?? null) : null,
      responsableId,
      responsableNombre: responsableId
        ? (nombreResponsable.get(responsableId) ?? null)
        : null,
      estadoComercial: p.estado_comercial as EstadoComercial,
      columnaId: (p.columna_id as string | null) ?? null,
      orden: (p.orden as number | null) ?? 0,
      fechaInicio: (p.fecha_inicio as string | null) ?? null,
      fechaCierreEst: (p.fecha_cierre_est as string | null) ?? null,
      pptoIngresos:
        p.ppto_ingresos === null || p.ppto_ingresos === undefined
          ? null
          : Number(p.ppto_ingresos),
      pptoGastos:
        p.ppto_gastos === null || p.ppto_gastos === undefined
          ? null
          : Number(p.ppto_gastos),
      notas: (p.notas as string | null) ?? null,
      archivado: (p.archivado as boolean | null) ?? false,
    };
  });
}

export async function listarLinks(proyectoId: string): Promise<ProyectoLink[]> {
  const supabase = createSupabaseServiceRole();
  const { data, error } = await supabase
    .from("int_proyecto_links")
    .select("id, proyecto_id, tipo, label, url")
    .eq("proyecto_id", proyectoId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[int-queries] listarLinks:", error.message);
    return [];
  }

  return (data ?? []).map((l) => ({
    id: l.id as string,
    proyectoId: l.proyecto_id as string,
    tipo: l.tipo as TipoLink,
    label: l.label as string,
    url: l.url as string,
  }));
}

export async function listarTareas(proyectoId: string): Promise<ProyectoTarea[]> {
  const supabase = createSupabaseServiceRole();
  const [{ data, error }, responsables] = await Promise.all([
    supabase
      .from("int_proyecto_tareas")
      .select("id, proyecto_id, titulo, descripcion, estado, asignado_a, orden")
      .eq("proyecto_id", proyectoId)
      .order("orden", { ascending: true }),
    listarResponsables(),
  ]);

  if (error) {
    console.error("[int-queries] listarTareas:", error.message);
    return [];
  }

  const nombres = new Map(responsables.map((r) => [r.id, r.nombre]));

  return (data ?? []).map((t) => {
    const asignadoA = (t.asignado_a as string | null) ?? null;
    return {
      id: t.id as string,
      proyectoId: t.proyecto_id as string,
      titulo: t.titulo as string,
      descripcion: (t.descripcion as string | null) ?? null,
      estado: t.estado as EstadoTarea,
      asignadoA,
      asignadoNombre: asignadoA ? (nombres.get(asignadoA) ?? null) : null,
      orden: (t.orden as number | null) ?? 0,
    };
  });
}

export async function listarNotas(proyectoId: string): Promise<ProyectoNota[]> {
  const supabase = createSupabaseServiceRole();
  const [{ data, error }, responsables] = await Promise.all([
    supabase
      .from("int_proyecto_notas")
      .select("id, proyecto_id, autor_id, tipo, texto, resuelto, created_at")
      .eq("proyecto_id", proyectoId)
      .order("created_at", { ascending: false }),
    listarResponsables(),
  ]);

  if (error) {
    console.error("[int-queries] listarNotas:", error.message);
    return [];
  }

  const nombres = new Map(responsables.map((r) => [r.id, r.nombre]));

  return (data ?? []).map((n) => {
    const autorId = (n.autor_id as string | null) ?? null;
    return {
      id: n.id as string,
      proyectoId: n.proyecto_id as string,
      autorId,
      autorNombre: autorId ? (nombres.get(autorId) ?? null) : null,
      tipo: n.tipo as "bug" | "nota",
      texto: n.texto as string,
      resuelto: n.resuelto as boolean,
      createdAt: n.created_at as string,
    };
  });
}

/**
 * Metricas del tablero. Los conteos salen de los proyectos que ya se
 * cargaron; solo el ciclo necesita ir a la actividad.
 */
export async function calcularEstadisticas(
  proyectos: Proyecto[],
  columnas: ColumnaKanban[],
): Promise<EstadisticasTablero> {
  const columnaFinal = columnas.find((c) => c.esFinal);

  const porColumna = columnas.map((c) => ({
    columnaId: c.id,
    nombre: c.nombre,
    total: proyectos.filter((p) => p.columnaId === c.id).length,
  }));

  const conteoResponsable = new Map<string, number>();
  for (const p of proyectos) {
    if (!p.responsableNombre) continue;
    conteoResponsable.set(
      p.responsableNombre,
      (conteoResponsable.get(p.responsableNombre) ?? 0) + 1,
    );
  }

  const porResponsable = [...conteoResponsable.entries()]
    .map(([nombre, total]) => ({ nombre, total }))
    .sort((a, b) => b.total - a.total);

  const entregados = columnaFinal
    ? proyectos.filter((p) => p.columnaId === columnaFinal.id)
    : [];

  return {
    activos: proyectos.filter(
      (p) => !columnaFinal || p.columnaId !== columnaFinal.id,
    ).length,
    sinResponsable: proyectos.filter((p) => !p.responsableId).length,
    entregadosEsteMes: await contarEntregadosEsteMes(entregados.map((p) => p.id)),
    porColumna,
    porResponsable,
    diasPromedioCiclo: await calcularDiasPromedioCiclo(columnaFinal?.id ?? null),
  };
}

async function contarEntregadosEsteMes(idsEntregados: string[]): Promise<number> {
  if (idsEntregados.length === 0) return 0;

  const supabase = createSupabaseServiceRole();
  const inicioMes = new Date();
  inicioMes.setUTCDate(1);
  inicioMes.setUTCHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("int_proyecto_actividad")
    .select("proyecto_id")
    .in("proyecto_id", idsEntregados)
    .eq("accion", "proyecto_movido")
    .gte("created_at", inicioMes.toISOString());

  if (error) {
    console.error("[int-queries] contarEntregadosEsteMes:", error.message);
    return 0;
  }

  return new Set((data ?? []).map((f) => f.proyecto_id as string)).size;
}

/**
 * Promedio de dias entre el nacimiento del proyecto y el movimiento que lo
 * dejo en la columna final. Si nadie llego nunca al final, devuelve null.
 */
async function calcularDiasPromedioCiclo(
  columnaFinalId: string | null,
): Promise<number | null> {
  if (!columnaFinalId) return null;

  const supabase = createSupabaseServiceRole();
  const { data, error } = await supabase
    .from("int_proyecto_actividad")
    .select("proyecto_id, created_at, detalle")
    .eq("accion", "proyecto_movido")
    .order("created_at", { ascending: true });

  if (error || !data || data.length === 0) {
    if (error) console.error("[int-queries] diasPromedioCiclo:", error.message);
    return null;
  }

  const llegadaAlFinal = new Map<string, string>();
  for (const fila of data) {
    const detalle = fila.detalle as { hacia?: string } | null;
    if (detalle?.hacia !== columnaFinalId) continue;
    llegadaAlFinal.set(fila.proyecto_id as string, fila.created_at as string);
  }

  if (llegadaAlFinal.size === 0) return null;

  const { data: proyectos, error: errorProyectos } = await supabase
    .from("int_proyectos")
    .select("id, created_at")
    .in("id", [...llegadaAlFinal.keys()]);

  if (errorProyectos || !proyectos) return null;

  const dias: number[] = [];
  for (const p of proyectos) {
    const fin = llegadaAlFinal.get(p.id as string);
    if (!fin) continue;
    const ms =
      new Date(fin).getTime() - new Date(p.created_at as string).getTime();
    if (ms >= 0) dias.push(ms / 86_400_000);
  }

  if (dias.length === 0) return null;

  return Math.round(dias.reduce((a, b) => a + b, 0) / dias.length);
}
```

- [ ] **Step 3: Verificar tipos y lint**

```bash
npx tsc --noEmit && npm run lint
```

Esperado: sin errores.

- [ ] **Step 4: Commit**

```bash
git add lib/proyectos/actividad.ts lib/proyectos/queries.ts
git commit -m "feat(interno): lecturas del panel y registro de actividad"
```

---

### Task 5: Server actions de proyectos

**Files:**
- Create: `app/actions/proyectos.ts`

**Interfaces:**
- Consumes: `requireAuth` de `@/lib/auth`; `puedeEditarProyectos` de `@/lib/proyectos/permisos`; `registrarActividad` de `@/lib/proyectos/actividad`; `createSupabaseServiceRole`.
- Produces:
  - `type ResultadoAccion = { ok: true } | { ok: false; error: string }`
  - `moverProyecto(proyectoId: string, columnaId: string): Promise<ResultadoAccion>`
  - `crearProyecto(formData: FormData): Promise<ResultadoAccion>`
  - `actualizarProyecto(formData: FormData): Promise<ResultadoAccion>`
  - `archivarProyecto(proyectoId: string): Promise<ResultadoAccion>`

- [ ] **Step 1: Escribir las acciones**

Crear `app/actions/proyectos.ts`:

```ts
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAuth } from "@/lib/auth";
import { registrarActividad } from "@/lib/proyectos/actividad";
import { puedeEditarProyectos } from "@/lib/proyectos/permisos";
import { ESTADOS_COMERCIALES } from "@/lib/proyectos/types";
import { createSupabaseServiceRole } from "@/lib/supabase/server";

export type ResultadoAccion = { ok: true } | { ok: false; error: string };

const SIN_PERMISO = "No tenés permiso para esta acción.";

const esquemaProyecto = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio.").max(200),
  cliente: z.string().trim().max(200).optional().or(z.literal("")),
  sociedadId: z.string().uuid().optional().or(z.literal("")),
  responsableId: z.string().uuid().optional().or(z.literal("")),
  estadoComercial: z.enum(ESTADOS_COMERCIALES),
  columnaId: z.string().uuid(),
  fechaInicio: z.string().optional().or(z.literal("")),
  fechaCierreEst: z.string().optional().or(z.literal("")),
  pptoIngresos: z.string().optional().or(z.literal("")),
  pptoGastos: z.string().optional().or(z.literal("")),
  notas: z.string().trim().max(4000).optional().or(z.literal("")),
});

function opcional(valor: string | undefined): string | null {
  const texto = (valor ?? "").trim();
  return texto === "" ? null : texto;
}

function numeroOpcional(valor: string | undefined): number | null {
  const texto = (valor ?? "").trim();
  if (texto === "") return null;
  const numero = Number(texto.replace(/[^\d.-]/g, ""));
  return Number.isFinite(numero) ? numero : null;
}

/**
 * Mueve una tarjeta de columna. El KanbanBoard solo mueve entre columnas,
 * nunca reordena dentro de una, asi que la tarjeta cae al final del destino.
 */
export async function moverProyecto(
  proyectoId: string,
  columnaId: string,
): Promise<ResultadoAccion> {
  const usuario = await requireAuth();
  if (!puedeEditarProyectos(usuario.role)) return { ok: false, error: SIN_PERMISO };

  const supabase = createSupabaseServiceRole();

  const { data: actual, error: errorLectura } = await supabase
    .from("int_proyectos")
    .select("columna_id")
    .eq("id", proyectoId)
    .maybeSingle();

  if (errorLectura || !actual) {
    return { ok: false, error: "No encontré ese proyecto." };
  }

  const { data: ultimos } = await supabase
    .from("int_proyectos")
    .select("orden")
    .eq("columna_id", columnaId)
    .order("orden", { ascending: false })
    .limit(1);

  const nuevoOrden = ((ultimos?.[0]?.orden as number | undefined) ?? 0) + 1;

  const { error } = await supabase
    .from("int_proyectos")
    .update({
      columna_id: columnaId,
      orden: nuevoOrden,
      updated_at: new Date().toISOString(),
    })
    .eq("id", proyectoId);

  if (error) {
    console.error("[proyectos] moverProyecto:", error.message);
    return { ok: false, error: "No pude mover el proyecto." };
  }

  await registrarActividad({
    proyectoId,
    actorId: usuario.id,
    accion: "proyecto_movido",
    detalle: { desde: actual.columna_id, hacia: columnaId },
  });

  revalidatePath("/admin/proyectos");
  return { ok: true };
}

export async function crearProyecto(formData: FormData): Promise<ResultadoAccion> {
  const usuario = await requireAuth();
  if (!puedeEditarProyectos(usuario.role)) return { ok: false, error: SIN_PERMISO };

  const parsed = esquemaProyecto.safeParse({
    nombre: formData.get("nombre") ?? "",
    cliente: formData.get("cliente") ?? "",
    sociedadId: formData.get("sociedadId") ?? "",
    responsableId: formData.get("responsableId") ?? "",
    estadoComercial: formData.get("estadoComercial") ?? "Prospecto",
    columnaId: formData.get("columnaId") ?? "",
    fechaInicio: formData.get("fechaInicio") ?? "",
    fechaCierreEst: formData.get("fechaCierreEst") ?? "",
    pptoIngresos: formData.get("pptoIngresos") ?? "",
    pptoGastos: formData.get("pptoGastos") ?? "",
    notas: formData.get("notas") ?? "",
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const v = parsed.data;
  const supabase = createSupabaseServiceRole();

  const { data, error } = await supabase
    .from("int_proyectos")
    .insert({
      nombre: v.nombre,
      cliente: opcional(v.cliente),
      sociedad_id: opcional(v.sociedadId),
      responsable_id: opcional(v.responsableId),
      estado_comercial: v.estadoComercial,
      columna_id: v.columnaId,
      fecha_inicio: opcional(v.fechaInicio),
      fecha_cierre_est: opcional(v.fechaCierreEst),
      ppto_ingresos: numeroOpcional(v.pptoIngresos),
      ppto_gastos: numeroOpcional(v.pptoGastos),
      notas: opcional(v.notas),
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("[proyectos] crearProyecto:", error?.message);
    if (error?.code === "23505") {
      return { ok: false, error: "Ya existe un proyecto con ese nombre en esa sociedad." };
    }
    return { ok: false, error: "No pude crear el proyecto." };
  }

  await registrarActividad({
    proyectoId: data.id as string,
    actorId: usuario.id,
    accion: "proyecto_creado",
    detalle: { nombre: v.nombre },
  });

  revalidatePath("/admin/proyectos");
  return { ok: true };
}

export async function actualizarProyecto(
  formData: FormData,
): Promise<ResultadoAccion> {
  const usuario = await requireAuth();
  if (!puedeEditarProyectos(usuario.role)) return { ok: false, error: SIN_PERMISO };

  const proyectoId = String(formData.get("proyectoId") ?? "");
  if (!proyectoId) return { ok: false, error: "Falta el proyecto." };

  const parsed = esquemaProyecto.safeParse({
    nombre: formData.get("nombre") ?? "",
    cliente: formData.get("cliente") ?? "",
    sociedadId: formData.get("sociedadId") ?? "",
    responsableId: formData.get("responsableId") ?? "",
    estadoComercial: formData.get("estadoComercial") ?? "Prospecto",
    columnaId: formData.get("columnaId") ?? "",
    fechaInicio: formData.get("fechaInicio") ?? "",
    fechaCierreEst: formData.get("fechaCierreEst") ?? "",
    pptoIngresos: formData.get("pptoIngresos") ?? "",
    pptoGastos: formData.get("pptoGastos") ?? "",
    notas: formData.get("notas") ?? "",
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const v = parsed.data;
  const supabase = createSupabaseServiceRole();

  const { data: antes } = await supabase
    .from("int_proyectos")
    .select("responsable_id, estado_comercial")
    .eq("id", proyectoId)
    .maybeSingle();

  const { error } = await supabase
    .from("int_proyectos")
    .update({
      nombre: v.nombre,
      cliente: opcional(v.cliente),
      sociedad_id: opcional(v.sociedadId),
      responsable_id: opcional(v.responsableId),
      estado_comercial: v.estadoComercial,
      columna_id: v.columnaId,
      fecha_inicio: opcional(v.fechaInicio),
      fecha_cierre_est: opcional(v.fechaCierreEst),
      ppto_ingresos: numeroOpcional(v.pptoIngresos),
      ppto_gastos: numeroOpcional(v.pptoGastos),
      notas: opcional(v.notas),
      updated_at: new Date().toISOString(),
    })
    .eq("id", proyectoId);

  if (error) {
    console.error("[proyectos] actualizarProyecto:", error.message);
    return { ok: false, error: "No pude guardar los cambios." };
  }

  await registrarActividad({
    proyectoId,
    actorId: usuario.id,
    accion: "proyecto_editado",
  });

  const nuevoResponsable = opcional(v.responsableId);
  if (antes && antes.responsable_id !== nuevoResponsable) {
    await registrarActividad({
      proyectoId,
      actorId: usuario.id,
      accion: "responsable_asignado",
      detalle: { desde: antes.responsable_id, hacia: nuevoResponsable },
    });
  }

  if (antes && antes.estado_comercial !== v.estadoComercial) {
    await registrarActividad({
      proyectoId,
      actorId: usuario.id,
      accion: "estado_comercial_cambiado",
      detalle: { desde: antes.estado_comercial, hacia: v.estadoComercial },
    });
  }

  revalidatePath("/admin/proyectos");
  revalidatePath(`/admin/proyectos/${proyectoId}`);
  return { ok: true };
}

export async function archivarProyecto(
  proyectoId: string,
): Promise<ResultadoAccion> {
  const usuario = await requireAuth();
  if (!puedeEditarProyectos(usuario.role)) return { ok: false, error: SIN_PERMISO };

  const supabase = createSupabaseServiceRole();
  const { error } = await supabase
    .from("int_proyectos")
    .update({ archivado: true, updated_at: new Date().toISOString() })
    .eq("id", proyectoId);

  if (error) {
    console.error("[proyectos] archivarProyecto:", error.message);
    return { ok: false, error: "No pude archivar el proyecto." };
  }

  await registrarActividad({
    proyectoId,
    actorId: usuario.id,
    accion: "proyecto_archivado",
  });

  revalidatePath("/admin/proyectos");
  return { ok: true };
}
```

- [ ] **Step 2: Verificar tipos y lint**

```bash
npx tsc --noEmit && npm run lint
```

Esperado: sin errores.

- [ ] **Step 3: Commit**

```bash
git add app/actions/proyectos.ts
git commit -m "feat(interno): server actions de proyectos"
```

---

### Task 6: Mapeo a KanbanItem y tablero

**Files:**
- Create: `components/proyectos/mapear.ts`
- Test: `components/proyectos/mapear.test.ts`
- Create: `components/proyectos/TableroInterno.tsx`
- Create: `app/admin/proyectos/page.tsx`

**Interfaces:**
- Consumes: `KanbanBoard`, `KanbanColumn`, `KanbanItem` de `@/components/portal/KanbanBoard`; `moverProyecto` de `@/app/actions/proyectos`; `listarColumnas`, `listarProyectos`, `listarSociedades`, `listarResponsables`, `calcularEstadisticas` de `@/lib/proyectos/queries`; `Estadisticas` y `Filtros` (tarea 7).
- Produces:
  - `colorEstado(estado: EstadoComercial): string`
  - `proyectoAItem(proyecto: Proyecto): KanbanItem`
  - `armarColumnas(proyectos: Proyecto[], columnas: ColumnaKanban[]): KanbanColumn[]`
  - `TableroInterno({ columnas, proyectos, puedeEditar }: { columnas: ColumnaKanban[]; proyectos: Proyecto[]; puedeEditar: boolean })`

- [ ] **Step 1: Escribir el test que falla**

Crear `components/proyectos/mapear.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import type { ColumnaKanban, Proyecto } from "@/lib/proyectos/types";
import { armarColumnas, colorEstado, proyectoAItem } from "./mapear";

const COLUMNAS: ColumnaKanban[] = [
  { id: "col-1", nombre: "Sin tomar", orden: 1, color: "bg-white/10", esInicial: true, esFinal: false },
  { id: "col-2", nombre: "En proceso", orden: 2, color: "bg-amber-500/15", esInicial: false, esFinal: false },
];

function proyecto(over: Partial<Proyecto> = {}): Proyecto {
  return {
    id: "p-1",
    nombre: "COD Master Pro",
    cliente: "Oswaldo",
    sociedadId: "s-1",
    sociedadNombre: "IA Master Tech",
    responsableId: "u-1",
    responsableNombre: "Samuel Castaño",
    estadoComercial: "En curso",
    columnaId: "col-2",
    orden: 1,
    fechaInicio: "2026-07-21",
    fechaCierreEst: null,
    pptoIngresos: null,
    pptoGastos: null,
    notas: null,
    archivado: false,
    ...over,
  };
}

describe("proyectoAItem", () => {
  it("usa el nombre como titulo y la sociedad como subtitulo", () => {
    const item = proyectoAItem(proyecto());
    expect(item.id).toBe("p-1");
    expect(item.title).toBe("COD Master Pro");
    expect(item.subtitle).toBe("IA Master Tech");
  });

  it("pone el estado comercial en el badge", () => {
    expect(proyectoAItem(proyecto()).badge).toBe("En curso");
  });

  it("dice sin tomar cuando no hay responsable", () => {
    const item = proyectoAItem(proyecto({ responsableId: null, responsableNombre: null }));
    expect(item.meta).toContain("Sin tomar");
  });

  it("muestra el responsable cuando lo hay", () => {
    expect(proyectoAItem(proyecto()).meta).toContain("Samuel Castaño");
  });

  it("muestra el cliente cuando lo hay", () => {
    expect(proyectoAItem(proyecto()).meta).toContain("Oswaldo");
  });

  it("dice sin sociedad cuando no tiene", () => {
    const item = proyectoAItem(proyecto({ sociedadId: null, sociedadNombre: null }));
    expect(item.subtitle).toBe("Sin sociedad");
  });

  it("agrega la fecha de cierre cuando existe", () => {
    const item = proyectoAItem(proyecto({ fechaCierreEst: "2026-12-01" }));
    expect(item.meta).toContain("Cierra 2026-12-01");
  });
});

describe("armarColumnas", () => {
  it("reparte los proyectos por columna", () => {
    const columnas = armarColumnas(
      [proyecto({ id: "a", columnaId: "col-1" }), proyecto({ id: "b", columnaId: "col-2" })],
      COLUMNAS,
    );
    expect(columnas.map((c) => c.items.length)).toEqual([1, 1]);
  });

  it("manda a la columna inicial los proyectos sin columna", () => {
    const columnas = armarColumnas([proyecto({ id: "a", columnaId: null })], COLUMNAS);
    expect(columnas[0].items.map((i) => i.id)).toEqual(["a"]);
  });

  it("respeta el orden de las columnas", () => {
    const columnas = armarColumnas([], COLUMNAS);
    expect(columnas.map((c) => c.label)).toEqual(["Sin tomar", "En proceso"]);
  });

  it("ordena las tarjetas por su campo orden", () => {
    const columnas = armarColumnas(
      [
        proyecto({ id: "b", columnaId: "col-1", orden: 2 }),
        proyecto({ id: "a", columnaId: "col-1", orden: 1 }),
      ],
      COLUMNAS,
    );
    expect(columnas[0].items.map((i) => i.id)).toEqual(["a", "b"]);
  });
});

describe("colorEstado", () => {
  it("da una clase distinta a cada estado", () => {
    expect(colorEstado("En curso")).not.toBe(colorEstado("Perdido"));
  });
});
```

- [ ] **Step 2: Correr el test y verificar que falla**

```bash
npm test
```

Esperado: FAIL con `Failed to resolve import "./mapear"`.

- [ ] **Step 3: Escribir el mapeo**

Crear `components/proyectos/mapear.ts`:

```ts
import type {
  KanbanColumn,
  KanbanItem,
} from "@/components/portal/KanbanBoard";
import type {
  ColumnaKanban,
  EstadoComercial,
  Proyecto,
} from "@/lib/proyectos/types";

/** Color del badge segun el estado comercial del proyecto. */
export function colorEstado(estado: EstadoComercial): string {
  switch (estado) {
    case "En curso":
      return "bg-emerald-500/15 text-emerald-300";
    case "Propuesta enviada":
      return "bg-sky-500/15 text-sky-300";
    case "Prospecto":
      return "bg-white/10 text-white/60";
    case "Pausado":
      return "bg-amber-500/15 text-amber-300";
    case "Cerrado":
      return "bg-violet-500/15 text-violet-300";
    case "Perdido":
      return "bg-red-500/15 text-red-300";
  }
}

/** Un proyecto como lo espera el KanbanBoard que ya existe. */
export function proyectoAItem(proyecto: Proyecto): KanbanItem {
  const meta: string[] = [];

  meta.push(proyecto.responsableNombre ?? "Sin tomar");
  if (proyecto.cliente) meta.push(proyecto.cliente);
  if (proyecto.fechaCierreEst) meta.push(`Cierra ${proyecto.fechaCierreEst}`);

  return {
    id: proyecto.id,
    title: proyecto.nombre,
    subtitle: proyecto.sociedadNombre ?? "Sin sociedad",
    badge: proyecto.estadoComercial,
    badgeColor: colorEstado(proyecto.estadoComercial),
    meta,
  };
}

/**
 * Arma las columnas del tablero. Un proyecto sin columna cae en la inicial,
 * que es el caso de los que se importaron sin estado.
 */
export function armarColumnas(
  proyectos: Proyecto[],
  columnas: ColumnaKanban[],
): KanbanColumn[] {
  const inicial = columnas.find((c) => c.esInicial) ?? columnas[0];

  return columnas.map((columna) => {
    const propios = proyectos
      .filter((p) => (p.columnaId ?? inicial?.id) === columna.id)
      .sort((a, b) => a.orden - b.orden);

    return {
      id: columna.id,
      label: columna.nombre,
      color: columna.color,
      items: propios.map(proyectoAItem),
    };
  });
}
```

- [ ] **Step 4: Correr los tests y verificar que pasan**

```bash
npm test
```

Esperado: PASS, 36 tests.

- [ ] **Step 5: Escribir el componente cliente del tablero**

Crear `components/proyectos/TableroInterno.tsx`:

```tsx
"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { moverProyecto } from "@/app/actions/proyectos";
import { KanbanBoard } from "@/components/portal/KanbanBoard";
import type { ColumnaKanban, Proyecto } from "@/lib/proyectos/types";
import { armarColumnas } from "./mapear";

interface Props {
  columnas: ColumnaKanban[];
  proyectos: Proyecto[];
  puedeEditar: boolean;
}

/**
 * Envuelve el KanbanBoard del portal. El componente ya resuelve el arrastre;
 * aca solo se traducen proyectos a tarjetas y se guarda el movimiento.
 *
 * El estado local hace que la tarjeta se quede donde la soltaron mientras el
 * servidor confirma. Si falla, se vuelve atras y sale un toast.
 */
export function TableroInterno({ columnas, proyectos, puedeEditar }: Props) {
  const router = useRouter();
  const [locales, setLocales] = useState<Proyecto[]>(proyectos);

  const columnasKanban = useMemo(
    () => armarColumnas(locales, columnas),
    [locales, columnas],
  );

  async function alMover(proyectoId: string, columnaId: string) {
    const previos = locales;

    setLocales((actuales) =>
      actuales.map((p) => (p.id === proyectoId ? { ...p, columnaId } : p)),
    );

    const resultado = await moverProyecto(proyectoId, columnaId);

    if (!resultado.ok) {
      setLocales(previos);
      toast.error(resultado.error);
      return;
    }

    const destino = columnas.find((c) => c.id === columnaId);
    toast.success(`Movido a ${destino?.nombre ?? "otra columna"}`);
    router.refresh();
  }

  if (columnas.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-white/10 p-8 text-center text-sm text-white/50">
        Todavía no hay columnas. Creá al menos una en Configurar columnas.
      </p>
    );
  }

  return (
    <KanbanBoard
      columns={columnasKanban}
      onMoveItem={alMover}
      canEdit={puedeEditar}
      onCardClick={(id) => router.push(`/admin/proyectos/${id}`)}
    />
  );
}
```

- [ ] **Step 6: Escribir la página del tablero**

Crear `app/admin/proyectos/page.tsx`:

```tsx
import Link from "next/link";
import { Settings2 } from "lucide-react";
import { Estadisticas } from "@/components/proyectos/Estadisticas";
import { Filtros } from "@/components/proyectos/Filtros";
import { TableroInterno } from "@/components/proyectos/TableroInterno";
import { requireAuth } from "@/lib/auth";
import {
  puedeEditarProyectos,
  puedeGestionarConfiguracion,
} from "@/lib/proyectos/permisos";
import {
  calcularEstadisticas,
  listarColumnas,
  listarProyectos,
  listarResponsables,
  listarSociedades,
} from "@/lib/proyectos/queries";
import { ESTADOS_COMERCIALES, type EstadoComercial } from "@/lib/proyectos/types";

export const metadata = { title: "Proyectos internos · Admin" };

interface Props {
  searchParams: Promise<{
    sociedad?: string;
    responsable?: string;
    estado?: string;
  }>;
}

export default async function ProyectosPage({ searchParams }: Props) {
  const usuario = await requireAuth();
  const params = await searchParams;

  const estado = ESTADOS_COMERCIALES.includes(params.estado as EstadoComercial)
    ? (params.estado as EstadoComercial)
    : undefined;

  const [columnas, proyectos, sociedades, responsables] = await Promise.all([
    listarColumnas(),
    listarProyectos({
      sociedadId: params.sociedad || undefined,
      responsableId: params.responsable || undefined,
      estadoComercial: estado,
    }),
    listarSociedades(),
    listarResponsables(),
  ]);

  const estadisticas = await calcularEstadisticas(proyectos, columnas);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Proyectos internos</h1>
          <p className="text-sm text-white/50">
            {usuario.role === "tester"
              ? "Estás en modo lectura. Podés reportar bugs desde cada proyecto."
              : "Arrastrá una tarjeta para cambiarle el estado de trabajo."}
          </p>
        </div>

        {puedeGestionarConfiguracion(usuario.role) && (
          <Link
            href="/admin/proyectos/columnas"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-white/70 transition-colors hover:border-white/20 hover:text-white"
          >
            <Settings2 className="h-4 w-4" />
            Configurar columnas
          </Link>
        )}
      </header>

      <Estadisticas datos={estadisticas} />

      <Filtros
        sociedades={sociedades}
        responsables={responsables}
        seleccion={{
          sociedad: params.sociedad ?? "",
          responsable: params.responsable ?? "",
          estado: estado ?? "",
        }}
      />

      <TableroInterno
        columnas={columnas}
        proyectos={proyectos}
        puedeEditar={puedeEditarProyectos(usuario.role)}
      />
    </div>
  );
}
```

- [ ] **Step 7: Commit**

`Estadisticas` y `Filtros` llegan en la tarea 7, así que acá el build todavía no compila. Se commitea igual porque el mapeo, que es lo que se probó, está verde.

```bash
git add components/proyectos/mapear.ts components/proyectos/mapear.test.ts components/proyectos/TableroInterno.tsx app/admin/proyectos/page.tsx
git commit -m "feat(interno): tablero kanban reusando el KanbanBoard del portal"
```

---

### Task 7: Estadísticas y filtros

**Files:**
- Create: `components/proyectos/Estadisticas.tsx`
- Create: `components/proyectos/Filtros.tsx`

**Interfaces:**
- Consumes: `EstadisticasTablero`, `Sociedad`, `ESTADOS_COMERCIALES` de `@/lib/proyectos/types`.
- Produces:
  - `Estadisticas({ datos }: { datos: EstadisticasTablero })`
  - `Filtros({ sociedades, responsables, seleccion }: { sociedades: Sociedad[]; responsables: { id: string; nombre: string }[]; seleccion: { sociedad: string; responsable: string; estado: string } })`

- [ ] **Step 1: Escribir las estadísticas**

Crear `components/proyectos/Estadisticas.tsx`:

```tsx
import type { EstadisticasTablero } from "@/lib/proyectos/types";

function Tarjeta({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-white/40">{etiqueta}</p>
      <p className="mt-1 text-2xl font-semibold text-white">{valor}</p>
    </div>
  );
}

export function Estadisticas({ datos }: { datos: EstadisticasTablero }) {
  return (
    <section className="space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Tarjeta etiqueta="Activos" valor={String(datos.activos)} />
        <Tarjeta etiqueta="Sin tomar" valor={String(datos.sinResponsable)} />
        <Tarjeta
          etiqueta="Entregados este mes"
          valor={String(datos.entregadosEsteMes)}
        />
        <Tarjeta
          etiqueta="Días promedio"
          valor={datos.diasPromedioCiclo === null ? "—" : String(datos.diasPromedioCiclo)}
        />
      </div>

      {datos.porResponsable.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {datos.porResponsable.map((r) => (
            <span
              key={r.nombre}
              className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60"
            >
              {r.nombre}: {r.total}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
```

- [ ] **Step 2: Escribir los filtros**

Crear `components/proyectos/Filtros.tsx`:

```tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ESTADOS_COMERCIALES, type Sociedad } from "@/lib/proyectos/types";

interface Props {
  sociedades: Sociedad[];
  responsables: { id: string; nombre: string }[];
  seleccion: { sociedad: string; responsable: string; estado: string };
}

const CLASES_SELECT =
  "rounded-lg border border-white/10 bg-[#141414] px-3 py-2 text-sm text-white/80 focus:border-[#D4AF37]/40 focus:outline-none";

/**
 * Los filtros viven en la URL para que una vista se pueda compartir por chat.
 */
export function Filtros({ sociedades, responsables, seleccion }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function cambiar(clave: string, valor: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (valor) params.set(clave, valor);
    else params.delete(clave);
    router.push(`${pathname}?${params.toString()}`);
  }

  const hayFiltro = Boolean(
    seleccion.sociedad || seleccion.responsable || seleccion.estado,
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        aria-label="Filtrar por sociedad"
        className={CLASES_SELECT}
        value={seleccion.sociedad}
        onChange={(e) => cambiar("sociedad", e.target.value)}
      >
        <option value="">Todas las sociedades</option>
        {sociedades.map((s) => (
          <option key={s.id} value={s.id}>
            {s.nombre}
          </option>
        ))}
      </select>

      <select
        aria-label="Filtrar por responsable"
        className={CLASES_SELECT}
        value={seleccion.responsable}
        onChange={(e) => cambiar("responsable", e.target.value)}
      >
        <option value="">Todos los responsables</option>
        {responsables.map((r) => (
          <option key={r.id} value={r.id}>
            {r.nombre}
          </option>
        ))}
      </select>

      <select
        aria-label="Filtrar por estado comercial"
        className={CLASES_SELECT}
        value={seleccion.estado}
        onChange={(e) => cambiar("estado", e.target.value)}
      >
        <option value="">Todos los estados</option>
        {ESTADOS_COMERCIALES.map((e) => (
          <option key={e} value={e}>
            {e}
          </option>
        ))}
      </select>

      {hayFiltro && (
        <button
          type="button"
          onClick={() => router.push(pathname)}
          className="rounded-lg px-3 py-2 text-sm text-white/50 transition-colors hover:text-white"
        >
          Limpiar
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Verificar que compila**

```bash
npx tsc --noEmit && npm run lint && npm run build
```

Esperado: build exitoso. `/admin/proyectos` aparece en la lista de rutas.

- [ ] **Step 4: Verificar a mano**

Levantar `npm run dev`, entrar a `/admin/proyectos` con una cuenta founder.
Esperado: se ven las 6 columnas vacías, la franja de estadísticas en cero y los tres filtros.

- [ ] **Step 5: Commit**

```bash
git add components/proyectos/Estadisticas.tsx components/proyectos/Filtros.tsx
git commit -m "feat(interno): estadisticas y filtros del tablero"
```

---

### Task 8: Acciones y vista de detalle

**Files:**
- Create: `app/actions/proyectos-detalle.ts`
- Create: `components/proyectos/DetalleProyecto.tsx`
- Create: `app/admin/proyectos/[id]/page.tsx`

**Interfaces:**
- Consumes: `ResultadoAccion` de `@/app/actions/proyectos`; `listarLinks`, `listarTareas`, `listarNotas`, `listarResponsables`, `obtenerProyecto` de `@/lib/proyectos/queries`; `colorEstado` de `@/components/proyectos/mapear`.
- Produces:
  - `crearLink(formData: FormData): Promise<ResultadoAccion>`
  - `borrarLink(linkId: string, proyectoId: string): Promise<ResultadoAccion>`
  - `crearTarea(formData: FormData): Promise<ResultadoAccion>`
  - `cambiarEstadoTarea(tareaId: string, proyectoId: string, estado: EstadoTarea): Promise<ResultadoAccion>`
  - `crearNota(formData: FormData): Promise<ResultadoAccion>`
  - `alternarNota(notaId: string, proyectoId: string, resuelto: boolean): Promise<ResultadoAccion>`

- [ ] **Step 1: Escribir las acciones de detalle**

Crear `app/actions/proyectos-detalle.ts`:

```ts
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { ResultadoAccion } from "@/app/actions/proyectos";
import { requireAuth } from "@/lib/auth";
import { puedeEditarProyectos } from "@/lib/proyectos/permisos";
import { ESTADOS_TAREA, TIPOS_LINK, type EstadoTarea } from "@/lib/proyectos/types";
import { createSupabaseServiceRole } from "@/lib/supabase/server";

const SIN_PERMISO = "No tenés permiso para esta acción.";

function revalidar(proyectoId: string) {
  revalidatePath(`/admin/proyectos/${proyectoId}`);
}

const esquemaLink = z.object({
  proyectoId: z.string().uuid(),
  tipo: z.enum(TIPOS_LINK),
  label: z.string().trim().min(1, "Poné un nombre al link.").max(120),
  url: z.string().trim().url("La URL no es válida."),
});

export async function crearLink(formData: FormData): Promise<ResultadoAccion> {
  const usuario = await requireAuth();
  if (!puedeEditarProyectos(usuario.role)) return { ok: false, error: SIN_PERMISO };

  const parsed = esquemaLink.safeParse({
    proyectoId: formData.get("proyectoId") ?? "",
    tipo: formData.get("tipo") ?? "otro",
    label: formData.get("label") ?? "",
    url: formData.get("url") ?? "",
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const supabase = createSupabaseServiceRole();
  const { error } = await supabase.from("int_proyecto_links").insert({
    proyecto_id: parsed.data.proyectoId,
    tipo: parsed.data.tipo,
    label: parsed.data.label,
    url: parsed.data.url,
  });

  if (error) {
    console.error("[detalle] crearLink:", error.message);
    return { ok: false, error: "No pude guardar el link." };
  }

  revalidar(parsed.data.proyectoId);
  return { ok: true };
}

export async function borrarLink(
  linkId: string,
  proyectoId: string,
): Promise<ResultadoAccion> {
  const usuario = await requireAuth();
  if (!puedeEditarProyectos(usuario.role)) return { ok: false, error: SIN_PERMISO };

  const supabase = createSupabaseServiceRole();
  const { error } = await supabase.from("int_proyecto_links").delete().eq("id", linkId);

  if (error) {
    console.error("[detalle] borrarLink:", error.message);
    return { ok: false, error: "No pude borrar el link." };
  }

  revalidar(proyectoId);
  return { ok: true };
}

const esquemaTarea = z.object({
  proyectoId: z.string().uuid(),
  titulo: z.string().trim().min(1, "Escribí qué hay que hacer.").max(200),
  descripcion: z.string().trim().max(2000).optional().or(z.literal("")),
  asignadoA: z.string().uuid().optional().or(z.literal("")),
});

export async function crearTarea(formData: FormData): Promise<ResultadoAccion> {
  const usuario = await requireAuth();
  if (!puedeEditarProyectos(usuario.role)) return { ok: false, error: SIN_PERMISO };

  const parsed = esquemaTarea.safeParse({
    proyectoId: formData.get("proyectoId") ?? "",
    titulo: formData.get("titulo") ?? "",
    descripcion: formData.get("descripcion") ?? "",
    asignadoA: formData.get("asignadoA") ?? "",
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const supabase = createSupabaseServiceRole();

  const { data: ultimas } = await supabase
    .from("int_proyecto_tareas")
    .select("orden")
    .eq("proyecto_id", parsed.data.proyectoId)
    .order("orden", { ascending: false })
    .limit(1);

  const { error } = await supabase.from("int_proyecto_tareas").insert({
    proyecto_id: parsed.data.proyectoId,
    titulo: parsed.data.titulo,
    descripcion: parsed.data.descripcion || null,
    asignado_a: parsed.data.asignadoA || null,
    orden: ((ultimas?.[0]?.orden as number | undefined) ?? 0) + 1,
  });

  if (error) {
    console.error("[detalle] crearTarea:", error.message);
    return { ok: false, error: "No pude crear la tarea." };
  }

  revalidar(parsed.data.proyectoId);
  return { ok: true };
}

export async function cambiarEstadoTarea(
  tareaId: string,
  proyectoId: string,
  estado: EstadoTarea,
): Promise<ResultadoAccion> {
  const usuario = await requireAuth();
  if (!puedeEditarProyectos(usuario.role)) return { ok: false, error: SIN_PERMISO };
  if (!ESTADOS_TAREA.includes(estado)) return { ok: false, error: "Estado inválido." };

  const supabase = createSupabaseServiceRole();
  const { error } = await supabase
    .from("int_proyecto_tareas")
    .update({ estado })
    .eq("id", tareaId);

  if (error) {
    console.error("[detalle] cambiarEstadoTarea:", error.message);
    return { ok: false, error: "No pude actualizar la tarea." };
  }

  revalidar(proyectoId);
  return { ok: true };
}

const esquemaNota = z.object({
  proyectoId: z.string().uuid(),
  tipo: z.enum(["bug", "nota"]),
  texto: z.string().trim().min(1, "Escribí algo.").max(4000),
});

/** Lo único que un tester puede escribir. */
export async function crearNota(formData: FormData): Promise<ResultadoAccion> {
  const usuario = await requireAuth();

  const parsed = esquemaNota.safeParse({
    proyectoId: formData.get("proyectoId") ?? "",
    tipo: formData.get("tipo") ?? "nota",
    texto: formData.get("texto") ?? "",
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const supabase = createSupabaseServiceRole();
  const { error } = await supabase.from("int_proyecto_notas").insert({
    proyecto_id: parsed.data.proyectoId,
    autor_id: usuario.id,
    tipo: parsed.data.tipo,
    texto: parsed.data.texto,
  });

  if (error) {
    console.error("[detalle] crearNota:", error.message);
    return { ok: false, error: "No pude guardar la nota." };
  }

  revalidar(parsed.data.proyectoId);
  return { ok: true };
}

export async function alternarNota(
  notaId: string,
  proyectoId: string,
  resuelto: boolean,
): Promise<ResultadoAccion> {
  const usuario = await requireAuth();
  if (!puedeEditarProyectos(usuario.role)) return { ok: false, error: SIN_PERMISO };

  const supabase = createSupabaseServiceRole();
  const { error } = await supabase
    .from("int_proyecto_notas")
    .update({ resuelto })
    .eq("id", notaId);

  if (error) {
    console.error("[detalle] alternarNota:", error.message);
    return { ok: false, error: "No pude actualizar la nota." };
  }

  revalidar(proyectoId);
  return { ok: true };
}
```

- [ ] **Step 2: Escribir el componente de detalle**

Crear `components/proyectos/DetalleProyecto.tsx`:

```tsx
"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Bug, ExternalLink, StickyNote, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { ResultadoAccion } from "@/app/actions/proyectos";
import {
  alternarNota,
  borrarLink,
  cambiarEstadoTarea,
  crearLink,
  crearNota,
  crearTarea,
} from "@/app/actions/proyectos-detalle";
import type {
  EstadoTarea,
  ProyectoLink,
  ProyectoNota,
  ProyectoTarea,
} from "@/lib/proyectos/types";
import { ESTADOS_TAREA, TIPOS_LINK } from "@/lib/proyectos/types";

interface Props {
  proyectoId: string;
  links: ProyectoLink[];
  tareas: ProyectoTarea[];
  notas: ProyectoNota[];
  responsables: { id: string; nombre: string }[];
  puedeEditar: boolean;
}

const INPUT =
  "w-full rounded-lg border border-white/10 bg-[#141414] px-3 py-2 text-sm text-white/80 placeholder:text-white/30 focus:border-[#D4AF37]/40 focus:outline-none";
const BOTON =
  "rounded-lg bg-[#D4AF37] px-3 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-50";

export function DetalleProyecto({
  proyectoId,
  links,
  tareas,
  notas,
  responsables,
  puedeEditar,
}: Props) {
  const router = useRouter();
  const [pendiente, empezar] = useTransition();

  function ejecutar(accion: () => Promise<ResultadoAccion>) {
    empezar(async () => {
      const r = await accion();
      if (!r.ok) {
        toast.error(r.error);
        return;
      }
      router.refresh();
    });
  }

  function enviar(
    evento: React.FormEvent<HTMLFormElement>,
    accion: (fd: FormData) => Promise<ResultadoAccion>,
  ) {
    evento.preventDefault();
    const form = evento.currentTarget;
    const datos = new FormData(form);
    empezar(async () => {
      const r = await accion(datos);
      if (!r.ok) {
        toast.error(r.error);
        return;
      }
      form.reset();
      router.refresh();
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ── Links ────────────────────────────────────────────────── */}
      <section className="space-y-3 rounded-xl border border-white/10 p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-white/50">
          Accesos y links
        </h2>

        {links.length === 0 && (
          <p className="text-sm text-white/40">Todavía no hay links.</p>
        )}

        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.id} className="flex items-center gap-2">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center gap-2 text-sm text-white/80 hover:text-[#D4AF37]"
              >
                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{link.label}</span>
                <span className="shrink-0 rounded-full bg-white/8 px-2 py-0.5 text-[10px] text-white/40">
                  {link.tipo}
                </span>
              </a>
              {puedeEditar && (
                <button
                  type="button"
                  aria-label={`Borrar ${link.label}`}
                  disabled={pendiente}
                  onClick={() => ejecutar(() => borrarLink(link.id, proyectoId))}
                  className="text-white/30 transition-colors hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </li>
          ))}
        </ul>

        {puedeEditar && (
          <form onSubmit={(e) => enviar(e, crearLink)} className="space-y-2 pt-2">
            <input type="hidden" name="proyectoId" value={proyectoId} />
            <input name="label" className={INPUT} placeholder="Nombre del link" required />
            <input name="url" type="url" className={INPUT} placeholder="https://..." required />
            <div className="flex gap-2">
              <select name="tipo" className={INPUT} defaultValue="otro">
                {TIPOS_LINK.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <button type="submit" className={BOTON} disabled={pendiente}>
                Agregar
              </button>
            </div>
          </form>
        )}
      </section>

      {/* ── Tareas ───────────────────────────────────────────────── */}
      <section className="space-y-3 rounded-xl border border-white/10 p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-white/50">
          Cambios y tareas
        </h2>

        {tareas.length === 0 && (
          <p className="text-sm text-white/40">Todavía no hay tareas.</p>
        )}

        <ul className="space-y-2">
          {tareas.map((tarea) => (
            <li
              key={tarea.id}
              className="flex items-center justify-between gap-3 rounded-lg bg-white/[0.02] px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-sm text-white/80">{tarea.titulo}</p>
                {tarea.asignadoNombre && (
                  <p className="text-xs text-white/40">{tarea.asignadoNombre}</p>
                )}
              </div>
              <select
                aria-label={`Estado de ${tarea.titulo}`}
                className="shrink-0 rounded-lg border border-white/10 bg-[#141414] px-2 py-1 text-xs text-white/70"
                value={tarea.estado}
                disabled={!puedeEditar || pendiente}
                onChange={(e) =>
                  ejecutar(() =>
                    cambiarEstadoTarea(
                      tarea.id,
                      proyectoId,
                      e.target.value as EstadoTarea,
                    ),
                  )
                }
              >
                {ESTADOS_TAREA.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </li>
          ))}
        </ul>

        {puedeEditar && (
          <form onSubmit={(e) => enviar(e, crearTarea)} className="space-y-2 pt-2">
            <input type="hidden" name="proyectoId" value={proyectoId} />
            <input name="titulo" className={INPUT} placeholder="Qué hay que hacer" required />
            <div className="flex gap-2">
              <select name="asignadoA" className={INPUT} defaultValue="">
                <option value="">Sin asignar</option>
                {responsables.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nombre}
                  </option>
                ))}
              </select>
              <button type="submit" className={BOTON} disabled={pendiente}>
                Agregar
              </button>
            </div>
          </form>
        )}
      </section>

      {/* ── Notas y bugs ─────────────────────────────────────────── */}
      <section className="space-y-3 rounded-xl border border-white/10 p-4 lg:col-span-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-white/50">
          Notas y bugs
        </h2>

        {notas.length === 0 && (
          <p className="text-sm text-white/40">Todavía no hay reportes.</p>
        )}

        <ul className="space-y-2">
          {notas.map((nota) => (
            <li
              key={nota.id}
              className={`flex items-start gap-3 rounded-lg px-3 py-2 ${
                nota.resuelto ? "bg-white/[0.02] opacity-50" : "bg-white/[0.04]"
              }`}
            >
              {nota.tipo === "bug" ? (
                <Bug className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              ) : (
                <StickyNote className="mt-0.5 h-4 w-4 shrink-0 text-white/40" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm text-white/80">{nota.texto}</p>
                <p className="text-xs text-white/35">
                  {nota.autorNombre ?? "—"} · {nota.createdAt.slice(0, 10)}
                </p>
              </div>
              {puedeEditar && (
                <button
                  type="button"
                  disabled={pendiente}
                  onClick={() =>
                    ejecutar(() => alternarNota(nota.id, proyectoId, !nota.resuelto))
                  }
                  className="shrink-0 text-xs text-white/40 transition-colors hover:text-white"
                >
                  {nota.resuelto ? "Reabrir" : "Resolver"}
                </button>
              )}
            </li>
          ))}
        </ul>

        <form onSubmit={(e) => enviar(e, crearNota)} className="space-y-2 pt-2">
          <input type="hidden" name="proyectoId" value={proyectoId} />
          <textarea
            name="texto"
            className={INPUT}
            rows={2}
            placeholder="Contá qué viste"
            required
          />
          <div className="flex gap-2">
            <select name="tipo" className={INPUT} defaultValue="nota">
              <option value="nota">Nota</option>
              <option value="bug">Bug</option>
            </select>
            <button type="submit" className={BOTON} disabled={pendiente}>
              Reportar
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
```

- [ ] **Step 3: Escribir la página de detalle**

Crear `app/admin/proyectos/[id]/page.tsx`:

```tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { DetalleProyecto } from "@/components/proyectos/DetalleProyecto";
import { colorEstado } from "@/components/proyectos/mapear";
import { requireAuth } from "@/lib/auth";
import { puedeEditarProyectos } from "@/lib/proyectos/permisos";
import {
  listarLinks,
  listarNotas,
  listarResponsables,
  listarTareas,
  obtenerProyecto,
} from "@/lib/proyectos/queries";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProyectoPage({ params }: Props) {
  const usuario = await requireAuth();
  const { id } = await params;

  const proyecto = await obtenerProyecto(id);
  if (!proyecto) notFound();

  const [links, tareas, notas, responsables] = await Promise.all([
    listarLinks(id),
    listarTareas(id),
    listarNotas(id),
    listarResponsables(),
  ]);

  return (
    <div className="space-y-6">
      <Link
        href="/admin/proyectos"
        className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al tablero
      </Link>

      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold text-white">{proyecto.nombre}</h1>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs ${colorEstado(proyecto.estadoComercial)}`}
          >
            {proyecto.estadoComercial}
          </span>
        </div>
        <p className="text-sm text-white/50">
          {proyecto.sociedadNombre ?? "Sin sociedad"}
          {proyecto.cliente ? ` · ${proyecto.cliente}` : ""}
          {" · "}
          {proyecto.responsableNombre ?? "Sin tomar"}
        </p>
        {proyecto.notas && (
          <p className="max-w-2xl text-sm text-white/60">{proyecto.notas}</p>
        )}
      </header>

      <DetalleProyecto
        proyectoId={proyecto.id}
        links={links}
        tareas={tareas}
        notas={notas}
        responsables={responsables}
        puedeEditar={puedeEditarProyectos(usuario.role)}
      />
    </div>
  );
}
```

- [ ] **Step 4: Verificar que compila**

```bash
npx tsc --noEmit && npm run lint && npm run build
```

Esperado: build exitoso.

- [ ] **Step 5: Commit**

```bash
git add app/actions/proyectos-detalle.ts components/proyectos/DetalleProyecto.tsx "app/admin/proyectos/[id]/page.tsx"
git commit -m "feat(interno): detalle de proyecto con links, tareas y notas"
```

---

### Task 9: Columnas configurables

**Files:**
- Create: `app/actions/kanban-columnas.ts`
- Create: `app/admin/proyectos/columnas/page.tsx`

**Interfaces:**
- Consumes: `ResultadoAccion` de `@/app/actions/proyectos`; `puedeGestionarConfiguracion`; `listarColumnas`.
- Produces:
  - `crearColumna(formData: FormData): Promise<ResultadoAccion>`
  - `renombrarColumna(formData: FormData): Promise<ResultadoAccion>`
  - `borrarColumna(columnaId: string): Promise<ResultadoAccion>`
  - `moverColumna(columnaId: string, direccion: "arriba" | "abajo"): Promise<ResultadoAccion>`

- [ ] **Step 1: Escribir las acciones de columnas**

Crear `app/actions/kanban-columnas.ts`:

```ts
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { ResultadoAccion } from "@/app/actions/proyectos";
import { requireAuth } from "@/lib/auth";
import { puedeGestionarConfiguracion } from "@/lib/proyectos/permisos";
import { createSupabaseServiceRole } from "@/lib/supabase/server";

const SIN_PERMISO = "Solo los founders y managers pueden tocar las columnas.";

function revalidar() {
  revalidatePath("/admin/proyectos");
  revalidatePath("/admin/proyectos/columnas");
}

const esquemaColumna = z.object({
  nombre: z.string().trim().min(1, "Poné un nombre.").max(60),
  color: z.string().trim().max(120),
});

export async function crearColumna(formData: FormData): Promise<ResultadoAccion> {
  const usuario = await requireAuth();
  if (!puedeGestionarConfiguracion(usuario.role))
    return { ok: false, error: SIN_PERMISO };

  const parsed = esquemaColumna.safeParse({
    nombre: formData.get("nombre") ?? "",
    color: formData.get("color") ?? "bg-white/10 text-white/60",
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const supabase = createSupabaseServiceRole();

  const { data: ultimas } = await supabase
    .from("int_kanban_columnas")
    .select("orden")
    .order("orden", { ascending: false })
    .limit(1);

  const { error } = await supabase.from("int_kanban_columnas").insert({
    nombre: parsed.data.nombre,
    color: parsed.data.color || "bg-white/10 text-white/60",
    orden: ((ultimas?.[0]?.orden as number | undefined) ?? 0) + 1,
  });

  if (error) {
    console.error("[columnas] crearColumna:", error.message);
    return { ok: false, error: "No pude crear la columna." };
  }

  revalidar();
  return { ok: true };
}

export async function renombrarColumna(
  formData: FormData,
): Promise<ResultadoAccion> {
  const usuario = await requireAuth();
  if (!puedeGestionarConfiguracion(usuario.role))
    return { ok: false, error: SIN_PERMISO };

  const columnaId = String(formData.get("columnaId") ?? "");
  if (!columnaId) return { ok: false, error: "Falta la columna." };

  const parsed = esquemaColumna.safeParse({
    nombre: formData.get("nombre") ?? "",
    color: formData.get("color") ?? "",
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const supabase = createSupabaseServiceRole();
  const { error } = await supabase
    .from("int_kanban_columnas")
    .update({ nombre: parsed.data.nombre, color: parsed.data.color })
    .eq("id", columnaId);

  if (error) {
    console.error("[columnas] renombrarColumna:", error.message);
    return { ok: false, error: "No pude renombrar la columna." };
  }

  revalidar();
  return { ok: true };
}

/**
 * Una columna con proyectos adentro no se borra: primero hay que moverlos.
 * Tampoco se puede quedar el tablero sin columna inicial ni sin final.
 */
export async function borrarColumna(columnaId: string): Promise<ResultadoAccion> {
  const usuario = await requireAuth();
  if (!puedeGestionarConfiguracion(usuario.role))
    return { ok: false, error: SIN_PERMISO };

  const supabase = createSupabaseServiceRole();

  const { count } = await supabase
    .from("int_proyectos")
    .select("id", { count: "exact", head: true })
    .eq("columna_id", columnaId);

  if ((count ?? 0) > 0) {
    return {
      ok: false,
      error: `Esa columna tiene ${count} proyecto(s). Movelos antes de borrarla.`,
    };
  }

  const { data: columnas } = await supabase
    .from("int_kanban_columnas")
    .select("id, es_inicial, es_final");

  const objetivo = columnas?.find((c) => c.id === columnaId);
  if (!objetivo) return { ok: false, error: "No encontré esa columna." };

  if (objetivo.es_inicial && (columnas ?? []).filter((c) => c.es_inicial).length <= 1) {
    return { ok: false, error: "Tiene que quedar al menos una columna inicial." };
  }

  if (objetivo.es_final && (columnas ?? []).filter((c) => c.es_final).length <= 1) {
    return { ok: false, error: "Tiene que quedar al menos una columna final." };
  }

  const { error } = await supabase
    .from("int_kanban_columnas")
    .delete()
    .eq("id", columnaId);

  if (error) {
    console.error("[columnas] borrarColumna:", error.message);
    return { ok: false, error: "No pude borrar la columna." };
  }

  revalidar();
  return { ok: true };
}

export async function moverColumna(
  columnaId: string,
  direccion: "arriba" | "abajo",
): Promise<ResultadoAccion> {
  const usuario = await requireAuth();
  if (!puedeGestionarConfiguracion(usuario.role))
    return { ok: false, error: SIN_PERMISO };

  const supabase = createSupabaseServiceRole();
  const { data: columnas } = await supabase
    .from("int_kanban_columnas")
    .select("id, orden")
    .order("orden", { ascending: true });

  if (!columnas) return { ok: false, error: "No pude leer las columnas." };

  const indice = columnas.findIndex((c) => c.id === columnaId);
  const vecino = direccion === "arriba" ? indice - 1 : indice + 1;

  if (indice === -1 || vecino < 0 || vecino >= columnas.length) {
    return { ok: false, error: "Esa columna ya está en el borde." };
  }

  const a = columnas[indice];
  const b = columnas[vecino];

  const { error } = await supabase.from("int_kanban_columnas").upsert([
    { id: a.id, orden: b.orden },
    { id: b.id, orden: a.orden },
  ]);

  if (error) {
    console.error("[columnas] moverColumna:", error.message);
    return { ok: false, error: "No pude reordenar." };
  }

  revalidar();
  return { ok: true };
}
```

- [ ] **Step 2: Escribir la página de columnas**

Los formularios llaman directo a las acciones. Como un `<form action={...}>` de
Next espera una función que devuelva `void | Promise<void>`, se usan envoltorios
locales que descartan el resultado. Los errores se ven en el log del servidor;
esta pantalla la usan solo founders y managers.

Crear `app/admin/proyectos/columnas/page.tsx`:

```tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  borrarColumna,
  crearColumna,
  moverColumna,
  renombrarColumna,
} from "@/app/actions/kanban-columnas";
import { requireAuth } from "@/lib/auth";
import { puedeGestionarConfiguracion } from "@/lib/proyectos/permisos";
import { listarColumnas } from "@/lib/proyectos/queries";

export const metadata = { title: "Columnas del tablero · Admin" };

const INPUT =
  "rounded-lg border border-white/10 bg-[#141414] px-3 py-2 text-sm text-white/80 focus:border-[#D4AF37]/40 focus:outline-none";

async function accionCrear(formData: FormData) {
  "use server";
  await crearColumna(formData);
}

async function accionRenombrar(formData: FormData) {
  "use server";
  await renombrarColumna(formData);
}

async function accionBorrar(formData: FormData) {
  "use server";
  await borrarColumna(String(formData.get("columnaId") ?? ""));
}

async function accionMover(formData: FormData) {
  "use server";
  await moverColumna(
    String(formData.get("columnaId") ?? ""),
    formData.get("direccion") === "arriba" ? "arriba" : "abajo",
  );
}

export default async function ColumnasPage() {
  const usuario = await requireAuth();
  if (!puedeGestionarConfiguracion(usuario.role)) redirect("/admin/proyectos");

  const columnas = await listarColumnas();

  return (
    <div className="max-w-3xl space-y-6">
      <Link
        href="/admin/proyectos"
        className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al tablero
      </Link>

      <header>
        <h1 className="text-2xl font-semibold text-white">Columnas del tablero</h1>
        <p className="text-sm text-white/50">
          Estas son las etapas por las que pasa un proyecto. Una columna con
          proyectos adentro no se puede borrar.
        </p>
      </header>

      <ul className="space-y-2">
        {columnas.map((columna) => (
          <li
            key={columna.id}
            className="flex flex-wrap items-center gap-2 rounded-xl border border-white/10 p-3"
          >
            <form action={accionRenombrar} className="flex flex-1 flex-wrap gap-2">
              <input type="hidden" name="columnaId" value={columna.id} />
              <input
                name="nombre"
                defaultValue={columna.nombre}
                aria-label={`Nombre de ${columna.nombre}`}
                className={`${INPUT} flex-1`}
              />
              <input
                name="color"
                defaultValue={columna.color}
                aria-label={`Color de ${columna.nombre}`}
                className={`${INPUT} flex-1`}
              />
              <button
                type="submit"
                className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white/70 hover:text-white"
              >
                Guardar
              </button>
            </form>

            <form action={accionMover}>
              <input type="hidden" name="columnaId" value={columna.id} />
              <input type="hidden" name="direccion" value="arriba" />
              <button type="submit" aria-label={`Subir ${columna.nombre}`} className="px-2 text-white/40 hover:text-white">
                ↑
              </button>
            </form>

            <form action={accionMover}>
              <input type="hidden" name="columnaId" value={columna.id} />
              <input type="hidden" name="direccion" value="abajo" />
              <button type="submit" aria-label={`Bajar ${columna.nombre}`} className="px-2 text-white/40 hover:text-white">
                ↓
              </button>
            </form>

            <form action={accionBorrar}>
              <input type="hidden" name="columnaId" value={columna.id} />
              <button
                type="submit"
                className="px-2 text-sm text-white/40 hover:text-red-400"
              >
                Borrar
              </button>
            </form>

            {columna.esInicial && (
              <span className="rounded-full bg-white/8 px-2 py-0.5 text-[10px] text-white/40">
                inicial
              </span>
            )}
            {columna.esFinal && (
              <span className="rounded-full bg-white/8 px-2 py-0.5 text-[10px] text-white/40">
                final
              </span>
            )}
          </li>
        ))}
      </ul>

      <form
        action={accionCrear}
        className="flex flex-wrap gap-2 rounded-xl border border-dashed border-white/10 p-3"
      >
        <input name="nombre" placeholder="Columna nueva" className={`${INPUT} flex-1`} required />
        <input
          name="color"
          placeholder="bg-white/10 text-white/60"
          defaultValue="bg-white/10 text-white/60"
          className={`${INPUT} flex-1`}
        />
        <button
          type="submit"
          className="rounded-lg bg-[#D4AF37] px-3 py-2 text-sm font-medium text-black hover:opacity-90"
        >
          Crear
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 3: Verificar que compila**

```bash
npx tsc --noEmit && npm run lint && npm run build
```

Esperado: build exitoso.

- [ ] **Step 4: Verificar a mano**

Con `npm run dev` y una cuenta founder, entrar a `/admin/proyectos/columnas`.
- Crear una columna "Prueba". Esperado: aparece al final.
- Subirla y bajarla. Esperado: cambia de posición.
- Borrarla. Esperado: desaparece.
- Intentar borrar "Sin tomar". Esperado: no se borra; en la consola del servidor
  aparece que tiene que quedar al menos una columna inicial.

- [ ] **Step 5: Commit**

```bash
git add app/actions/kanban-columnas.ts app/admin/proyectos/columnas/page.tsx
git commit -m "feat(interno): columnas del tablero configurables"
```

---

### Task 10: Sociedades y socios

**Files:**
- Create: `app/admin/sociedades/page.tsx`

**Interfaces:**
- Consumes: `listarSociedades`, `listarParticipaciones` de `@/lib/proyectos/queries`; `puedeGestionarConfiguracion`.
- Produces: nada que consuman otras tareas.

- [ ] **Step 1: Escribir la página**

Es una vista de solo lectura. Los porcentajes se editan en el Sheet y bajan con el importador; hacerlos editables acá sería tener dos fuentes de verdad mientras la contabilidad siga en el Sheet.

Crear `app/admin/sociedades/page.tsx`:

```tsx
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { puedeGestionarConfiguracion } from "@/lib/proyectos/permisos";
import {
  listarParticipaciones,
  listarSociedades,
} from "@/lib/proyectos/queries";

export const metadata = { title: "Sociedades · Admin" };

export default async function SociedadesPage() {
  const usuario = await requireAuth();
  if (!puedeGestionarConfiguracion(usuario.role)) redirect("/admin/proyectos");

  const [sociedades, participaciones] = await Promise.all([
    listarSociedades(),
    listarParticipaciones(),
  ]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-white">Sociedades y socios</h1>
        <p className="text-sm text-white/50">
          La fuente de verdad de los porcentajes sigue siendo el Google Sheet.
          Acá se ven como quedaron después de la última importación.
        </p>
      </header>

      <div className="space-y-4">
        {sociedades.map((sociedad) => {
          const suyos = participaciones.filter((p) => p.sociedadId === sociedad.id);
          const suma = suyos.reduce((total, p) => total + p.pct, 0);

          return (
            <section
              key={sociedad.id}
              className="rounded-xl border border-white/10 p-4"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-lg font-medium text-white">
                  {sociedad.nombre}
                  {!sociedad.activa && (
                    <span className="ml-2 rounded-full bg-white/8 px-2 py-0.5 text-[10px] text-white/40">
                      contable
                    </span>
                  )}
                </h2>
                {suyos.length > 0 && (
                  <span
                    className={`text-xs ${
                      Math.round(suma) === 100 ? "text-emerald-300" : "text-amber-300"
                    }`}
                  >
                    Suma {suma.toFixed(1)}%
                  </span>
                )}
              </div>

              {sociedad.descripcion && (
                <p className="mt-1 text-sm text-white/50">{sociedad.descripcion}</p>
              )}

              {suyos.length === 0 ? (
                <p className="mt-3 text-sm text-white/40">Sin socios cargados.</p>
              ) : (
                <ul className="mt-3 space-y-1">
                  {suyos.map((p) => (
                    <li
                      key={`${p.sociedadId}-${p.socioId}`}
                      className="flex items-baseline justify-between gap-3 text-sm"
                    >
                      <span className="text-white/80">{p.socioNombre}</span>
                      <span className="flex-1 border-b border-dashed border-white/10" />
                      <span className="text-white/60">{p.pct.toFixed(1)}%</span>
                      {p.rolNotas && (
                        <span className="max-w-xs truncate text-xs text-white/35">
                          {p.rolNotas}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verificar que compila**

```bash
npx tsc --noEmit && npm run lint && npm run build
```

Esperado: build exitoso.

- [ ] **Step 3: Commit**

```bash
git add app/admin/sociedades/page.tsx
git commit -m "feat(interno): vista de sociedades, socios y participaciones"
```

---

### Task 11: Importador del Google Sheet

**Files:**
- Create: `scripts/importar-proyectos.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: `parsearCSV`, `celda`, `normalizarFecha`, `limpiarPorcentaje` de `lib/proyectos/importar-utils`.
- Produces: nada. Es un ejecutable de una sola corrida.

- [ ] **Step 1: Instalar el runner de TypeScript**

```bash
npm install -D tsx@^4
```

- [ ] **Step 2: Agregar el script**

En `package.json`, dentro de `"scripts"`, agregar después de `"test"`:

```json
"importar:proyectos": "tsx --env-file=.env.local scripts/importar-proyectos.ts"
```

- [ ] **Step 3: Escribir el importador**

El upsert de proyectos no usa `onConflict` porque el índice único de la
migración es de expresión (`coalesce(...)`, `lower(nombre)`) y PostgREST no
puede apuntarle. En su lugar se consulta primero y se hace `update` o `insert`.

Crear `scripts/importar-proyectos.ts`:

```ts
/**
 * Importa el Google Sheet financiero a la base.
 *
 * Se corre una sola vez, pero es idempotente: busca antes de insertar, asi
 * que correrlo dos veces no duplica nada.
 *
 *   npm run importar:proyectos
 */

import { createClient } from "@supabase/supabase-js";
import {
  celda,
  limpiarPorcentaje,
  normalizarFecha,
  parsearCSV,
} from "../lib/proyectos/importar-utils";

const SHEET_ID = "1JgPC6aknBmxLP82I-0F-Xa3I7kep9xxfHT5zh1KYq_Y";
const GID_CONFIG = "1785829694";
const GID_PORTAFOLIO = "1898545934";

// Columnas de la hoja Portafolio, contando desde cero.
const COL_SOCIEDAD = 0;
const COL_PROYECTO = 1;
const COL_CLIENTE = 2;
const COL_RESPONSABLE = 3;
const COL_ESTADO = 4;
const COL_FECHA_INICIO = 5;
const COL_FECHA_CIERRE = 6;
const COL_NOTAS = 15;

const ESTADOS_VALIDOS = new Set([
  "Prospecto",
  "Propuesta enviada",
  "En curso",
  "Pausado",
  "Cerrado",
  "Perdido",
]);

function cliente() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY. Revisá .env.local",
    );
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function bajarHoja(gid: string): Promise<string[][]> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${gid}`;
  const respuesta = await fetch(url);
  if (!respuesta.ok) {
    throw new Error(`No pude bajar la hoja ${gid}: HTTP ${respuesta.status}`);
  }
  return parsearCSV(await respuesta.text());
}

/**
 * Config trae dos bloques en la misma hoja. El de participaciones arranca
 * despues de la fila que dice "Participación por socio" y se corta en la
 * primera fila sin sociedad o en el bloque de control de sumas.
 */
function leerParticipaciones(
  filas: string[][],
): { sociedad: string; socio: string; pct: number; notas: string }[] {
  const inicio = filas.findIndex((f) =>
    celda(f, 0).toLowerCase().startsWith("participación por socio"),
  );
  if (inicio === -1) return [];

  const salida: { sociedad: string; socio: string; pct: number; notas: string }[] = [];

  // inicio + 1 es el encabezado; los datos arrancan en inicio + 2.
  for (let i = inicio + 2; i < filas.length; i++) {
    const sociedad = celda(filas[i], 0);
    const socio = celda(filas[i], 1);
    if (!sociedad || !socio) break;
    if (sociedad.toLowerCase().startsWith("control suma")) break;

    salida.push({
      sociedad,
      socio,
      pct: limpiarPorcentaje(celda(filas[i], 2)) ?? 0,
      notas: celda(filas[i], 3),
    });
  }

  return salida;
}

async function main() {
  const supabase = cliente();
  const resumen = { sociedades: 0, socios: 0, participaciones: 0, proyectos: 0 };
  const avisos: string[] = [];

  console.log("Bajando el Sheet…");
  const [config, portafolio] = await Promise.all([
    bajarHoja(GID_CONFIG),
    bajarHoja(GID_PORTAFOLIO),
  ]);

  // ── Sociedades ────────────────────────────────────────────────
  const participaciones = leerParticipaciones(config);
  const nombresSociedad = [...new Set(participaciones.map((p) => p.sociedad))];

  for (const nombre of nombresSociedad) {
    const { error } = await supabase
      .from("int_sociedades")
      .upsert({ nombre }, { onConflict: "nombre" });
    if (error) avisos.push(`sociedad ${nombre}: ${error.message}`);
    else resumen.sociedades++;
  }

  const { data: sociedades } = await supabase
    .from("int_sociedades")
    .select("id, nombre");
  const idSociedad = new Map(
    (sociedades ?? []).map((s) => [s.nombre as string, s.id as string]),
  );

  // ── Socios ────────────────────────────────────────────────────
  const nombresSocio = [...new Set(participaciones.map((p) => p.socio))];

  for (const nombre of nombresSocio) {
    const { error } = await supabase
      .from("int_socios")
      .upsert({ nombre }, { onConflict: "nombre" });
    if (error) avisos.push(`socio ${nombre}: ${error.message}`);
    else resumen.socios++;
  }

  const { data: socios } = await supabase.from("int_socios").select("id, nombre");
  const idSocio = new Map(
    (socios ?? []).map((s) => [s.nombre as string, s.id as string]),
  );

  // ── Participaciones ───────────────────────────────────────────
  for (const p of participaciones) {
    const sociedadId = idSociedad.get(p.sociedad);
    const socioId = idSocio.get(p.socio);
    if (!sociedadId || !socioId) {
      avisos.push(`participación sin mapear: ${p.sociedad} / ${p.socio}`);
      continue;
    }

    const { error } = await supabase.from("int_sociedad_socios").upsert(
      {
        sociedad_id: sociedadId,
        socio_id: socioId,
        pct_participacion: p.pct,
        rol_notas: p.notas || null,
      },
      { onConflict: "sociedad_id,socio_id" },
    );

    if (error) avisos.push(`participación ${p.sociedad}/${p.socio}: ${error.message}`);
    else resumen.participaciones++;
  }

  // ── Responsables: nombre del Sheet → admin_users ──────────────
  const { data: admins } = await supabase
    .from("admin_users")
    .select("id, full_name, email");

  const idAdminPorNombre = new Map<string, string>();
  for (const a of admins ?? []) {
    const nombre = ((a.full_name as string | null) ?? "").trim().toLowerCase();
    if (nombre) idAdminPorNombre.set(nombre, a.id as string);
    const email = ((a.email as string | null) ?? "").trim().toLowerCase();
    if (email) idAdminPorNombre.set(email, a.id as string);
  }

  // ── Columna inicial del tablero ───────────────────────────────
  const { data: columnas } = await supabase
    .from("int_kanban_columnas")
    .select("id, es_inicial, orden")
    .order("orden", { ascending: true });

  const columnaInicial =
    (columnas ?? []).find((c) => c.es_inicial)?.id ?? columnas?.[0]?.id;

  if (!columnaInicial) {
    throw new Error("No hay columnas en el tablero. Corré la migración 0006 primero.");
  }

  // ── Proyectos ─────────────────────────────────────────────────
  // La fila 4 del Sheet (indice 3) es el encabezado; los datos van desde el 4.
  for (let i = 4; i < portafolio.length; i++) {
    const fila = portafolio[i];
    const nombre = celda(fila, COL_PROYECTO);
    if (!nombre) continue;

    const nombreSociedad = celda(fila, COL_SOCIEDAD);
    const sociedadId = nombreSociedad ? (idSociedad.get(nombreSociedad) ?? null) : null;
    if (nombreSociedad && !sociedadId) {
      avisos.push(`proyecto "${nombre}": sociedad "${nombreSociedad}" no existe`);
    }

    const nombreResponsable = celda(fila, COL_RESPONSABLE);
    const responsableId = nombreResponsable
      ? (idAdminPorNombre.get(nombreResponsable.toLowerCase()) ?? null)
      : null;
    if (nombreResponsable && !responsableId) {
      avisos.push(
        `proyecto "${nombre}": "${nombreResponsable}" todavía no tiene cuenta en el panel`,
      );
    }

    const estadoCrudo = celda(fila, COL_ESTADO);
    const nombreCliente = celda(fila, COL_CLIENTE);

    const datos = {
      sociedad_id: sociedadId,
      nombre,
      cliente: nombreCliente && nombreCliente !== "—" ? nombreCliente : null,
      responsable_id: responsableId,
      estado_comercial: ESTADOS_VALIDOS.has(estadoCrudo) ? estadoCrudo : "Prospecto",
      fecha_inicio: normalizarFecha(celda(fila, COL_FECHA_INICIO)),
      fecha_cierre_est: normalizarFecha(celda(fila, COL_FECHA_CIERRE)),
      notas: celda(fila, COL_NOTAS) || null,
      es_operacion_general: nombre.toLowerCase() === "operación general",
    };

    // Idempotencia: buscar antes de insertar. El indice unico usa una
    // expresion y PostgREST no le puede apuntar con onConflict.
    let consulta = supabase.from("int_proyectos").select("id").eq("nombre", nombre);
    consulta = sociedadId
      ? consulta.eq("sociedad_id", sociedadId)
      : consulta.is("sociedad_id", null);

    const { data: existente } = await consulta.maybeSingle();

    const { error } = existente
      ? await supabase
          .from("int_proyectos")
          .update({ ...datos, updated_at: new Date().toISOString() })
          .eq("id", existente.id as string)
      : await supabase
          .from("int_proyectos")
          .insert({ ...datos, columna_id: columnaInicial });

    if (error) avisos.push(`proyecto "${nombre}": ${error.message}`);
    else resumen.proyectos++;
  }

  console.log("\nListo:");
  console.log(`  sociedades      ${resumen.sociedades}`);
  console.log(`  socios          ${resumen.socios}`);
  console.log(`  participaciones ${resumen.participaciones}`);
  console.log(`  proyectos       ${resumen.proyectos}`);

  if (avisos.length > 0) {
    console.log(`\nAvisos (${avisos.length}):`);
    for (const aviso of avisos) console.log(`  · ${aviso}`);
  }

  // Los presupuestos y montos reales del Sheet son formulas que dependen de
  // la hoja de Movimientos. Eso entra en la fase 2.
  console.log("\nOjo: presupuestos e importes reales no se importan. Eso es fase 2.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 4: Correr el importador**

```bash
npm run importar:proyectos
```

Esperado: imprime 3 sociedades, 6 socios, 10 participaciones y 12 proyectos.
Los avisos esperados son los responsables que todavía no tienen cuenta en el
panel, y la sociedad vacía de *Bodega de Belleza* y *Agente de videos Estefix*.

- [ ] **Step 5: Verificar en la base**

```sql
select p.nombre, s.nombre as sociedad, p.estado_comercial, p.es_operacion_general
from public.int_proyectos p
left join public.int_sociedades s on s.id = p.sociedad_id
order by p.nombre;
```

Esperado: 12 filas, 4 con `es_operacion_general = true`.

```sql
select count(*) from public.int_proyectos;
```

Correr `npm run importar:proyectos` otra vez y volver a contar.
Esperado: sigue en 12.

- [ ] **Step 6: Verificar el tablero**

Entrar a `/admin/proyectos`.
Esperado: 8 tarjetas en "Sin tomar" (las 4 de operación general no salen).
*Bodega de Belleza* y *Agente de videos Estefix* muestran "Sin sociedad" y "Sin tomar".

- [ ] **Step 7: Commit**

```bash
git add scripts/importar-proyectos.ts package.json package-lock.json
git commit -m "feat(interno): importador del google sheet a la base"
```

---

### Task 12: Navegación y cierre

**Files:**
- Modify: `components/admin/Sidebar.tsx:5-24` (imports), `:31-77` (arreglo `sections`), y el cuerpo de `AdminSidebar`

**Interfaces:**
- Consumes: `AdminUser` de `@/lib/auth`; `puedeGestionarConfiguracion` de `@/lib/proyectos/permisos`.
- Produces: nada.

- [ ] **Step 1: Agregar los iconos y el import de permisos**

En `components/admin/Sidebar.tsx`, agregar `KanbanSquare` y `Handshake` a la lista de iconos que se importa de `lucide-react` (el bloque que arranca en la línea 5), y agregar este import junto a los otros de `@/lib`:

```tsx
import { puedeGestionarConfiguracion } from "@/lib/proyectos/permisos";
```

- [ ] **Step 2: Agregar la sección al nav**

En el arreglo `sections`, insertar este bloque justo después del de `"Operación"`:

```tsx
  {
    label: "Interno",
    items: [
      { label: "Proyectos", href: "/admin/proyectos", icon: KanbanSquare },
      { label: "Sociedades", href: "/admin/sociedades", icon: Handshake },
    ],
  },
```

- [ ] **Step 3: Ocultar Sociedades a quien no la puede abrir**

`/admin/sociedades` redirige si el rol no alcanza, así que mostrarle el link a
todos sería dejar un link muerto. Dentro de `AdminSidebar`, después de la línea
`const pathname = usePathname();`, agregar:

```tsx
  const visibles = sections
    .map((seccion) => ({
      ...seccion,
      items: seccion.items.filter((item) =>
        item.href === "/admin/sociedades"
          ? puedeGestionarConfiguracion(user.role)
          : true,
      ),
    }))
    .filter((seccion) => seccion.items.length > 0);
```

Después, en el JSX, cambiar el recorrido de `sections` por `visibles`.

- [ ] **Step 4: Verificar todo**

```bash
npm test && npx tsc --noEmit && npm run lint && npm run build
```

Esperado: 36 tests en verde, sin errores de tipos ni de lint, build exitoso.

- [ ] **Step 5: Verificación manual final**

Con `npm run dev`:

1. Entrar como founder. Esperado: en el sidebar aparecen "Proyectos" y "Sociedades".
2. Arrastrar una tarjeta de "Sin tomar" a "En proceso". Esperado: toast "Movido a
   En proceso" y la tarjeta se queda ahí al recargar.
3. Abrir una tarjeta. Agregar un link, una tarea y un bug. Esperado: los tres aparecen.
4. Filtrar por sociedad "IA Master Tech". Esperado: la URL lleva `?sociedad=…` y
   el tablero se recorta.
5. Cambiarle el rol a una cuenta de prueba a `tester` en Supabase y entrar con ella.
   Esperado: se ve el tablero, no se puede arrastrar, no aparece "Sociedades" ni
   "Configurar columnas", y el formulario de notas sí funciona.
6. Achicar la ventana a ancho de teléfono. Esperado: el tablero hace scroll
   horizontal sin romper la página.

Comprobar en la base que quedó registro del arrastre:

```sql
select accion, detalle, created_at
from public.int_proyecto_actividad
order by created_at desc limit 5;
```

Esperado: una fila `proyecto_movido` con `desde` y `hacia`.

- [ ] **Step 6: Commit**

```bash
git add components/admin/Sidebar.tsx
git commit -m "feat(interno): entrada al panel interno en la navegacion"
```

---

## Notas de cierre

**Lo que queda explícitamente afuera de esta fase:**

- Reordenar tarjetas dentro de una misma columna. `KanbanBoard.onMoveItem` solo
  informa cambios de columna. Si hace falta, se extiende el componente del portal
  y el portal de clientes se beneficia igual.
- Presupuestos e importes reales por proyecto. Son fórmulas del Sheet que dependen
  de la hoja de Movimientos.
- Todo lo financiero: movimientos, TRM, reparto de gastos compartidos, aportes de
  socios y los cinco dashboards.
- Editar sociedades y porcentajes desde el panel. Mientras la contabilidad viva en
  el Sheet, tener dos lugares donde tocar los porcentajes es pedir problemas.
