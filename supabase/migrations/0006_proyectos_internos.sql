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
