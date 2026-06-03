-- Migration: Portal de clientes — tableros tipo Notion por cliente
-- Prefijo: portal_* para separar del resto de tablas ac_*
-- Alexander puede ver/editar todo. Clientes solo ven sus propias filas.

-- ============================================================
-- 0. admin_users — tabla compartida con UGC Colombia
--    Creada aquí con IF NOT EXISTS para que la migración sea
--    autónoma. Si ya existe en la DB (caso producción compartida),
--    esta sentencia se omite sin error.
-- ============================================================
create table if not exists public.admin_users (
  id               uuid primary key default gen_random_uuid(),
  auth_user_id     uuid not null references auth.users(id) on delete cascade,
  email            text not null,
  full_name        text,
  role             text not null default 'coordinator'
                     check (role in ('founder','manager','coordinator','sales','creative')),
  is_active        boolean not null default true,
  last_login_at    timestamptz,
  created_at       timestamptz not null default now()
);
create unique index if not exists admin_users_auth_idx on public.admin_users (auth_user_id);

-- ============================================================
-- 1. portal_clients — registro de clientes
-- ============================================================
create table if not exists public.portal_clients (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  slug text not null,
  logo_url text,
  industria text,
  contacto_email text,
  contacto_nombre text,
  notas text,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists portal_clients_slug_unique on public.portal_clients (slug);

-- ============================================================
-- 2. portal_client_users — mapeo de usuarios auth → cliente
-- ============================================================
create table if not exists public.portal_client_users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid not null references public.portal_clients(id) on delete cascade,
  email text not null,
  nombre text,
  rol text not null default 'viewer' check (rol in ('viewer', 'editor')),
  activo boolean not null default true,
  created_at timestamptz not null default now()
);
create unique index if not exists portal_client_users_auth_idx on public.portal_client_users (auth_user_id, client_id);

-- ============================================================
-- 3. portal_campaigns — gestión de campañas publicitarias
-- ============================================================
create table if not exists public.portal_campaigns (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.portal_clients(id) on delete cascade,
  nombre text not null,
  producto text,
  plataforma text[],
  mercados text[],
  estado text default 'Borrador'
    check (estado in ('Borrador','Activa','Pausada','Finalizada')),
  fase_esfera text,
  fecha_inicio date,
  fecha_cierre date,
  landing_url text,
  objetivo_principal text,
  presupuesto numeric(12,2),
  cpc_promedio numeric(10,4),
  ctr numeric(6,4),
  cpa numeric(10,4),
  responsable text,
  checklist jsonb default '{
    "estrategia": [],
    "ejecucion": [],
    "optimizacion": []
  }'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists portal_campaigns_client_idx on public.portal_campaigns (client_id);

-- ============================================================
-- 4. portal_projects — proyectos del cliente
-- ============================================================
create table if not exists public.portal_projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.portal_clients(id) on delete cascade,
  nombre text not null,
  responsable text,
  equipo text,
  estado text default 'Sin empezar'
    check (estado in ('Sin empezar','En curso','Listo','Cancelado')),
  prioridad text default 'Media'
    check (prioridad in ('Alta','Media','Baja')),
  progreso integer default 0 check (progreso >= 0 and progreso <= 100),
  fecha_inicio date,
  fecha_fin date,
  presupuesto numeric(12,2),
  resumen_ia text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists portal_projects_client_idx on public.portal_projects (client_id);

-- ============================================================
-- 5. portal_objectives — seguimiento de objetivos (OKR)
-- ============================================================
create table if not exists public.portal_objectives (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.portal_clients(id) on delete cascade,
  nombre text not null,
  propietario text,
  estado text default 'Sin empezar'
    check (estado in ('Sin empezar','En curso','Listo')),
  fecha_limite date,
  prioridad text default 'Media'
    check (prioridad in ('Alta','Media','Baja')),
  trimestre text,
  equipo text,
  valor_inicial numeric(12,2) default 0,
  valor_final numeric(12,2) default 100,
  progreso integer default 0 check (progreso >= 0 and progreso <= 200),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists portal_objectives_client_idx on public.portal_objectives (client_id);

-- ============================================================
-- 6. portal_events — gestión de eventos
-- ============================================================
create table if not exists public.portal_events (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.portal_clients(id) on delete cascade,
  nombre text not null,
  fecha_evento timestamptz,
  estado text default 'Planificación'
    check (estado in ('Planificación','Inscripción abierta','En curso','Listo','Cancelado')),
  propietario text,
  formato text check (formato in ('Virtual','En persona','Híbrido')),
  categoria text,
  lugar text,
  capacidad integer,
  presupuesto numeric(12,2),
  url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists portal_events_client_idx on public.portal_events (client_id);

-- ============================================================
-- 7. portal_social_posts — planificador de redes sociales
-- ============================================================
create table if not exists public.portal_social_posts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.portal_clients(id) on delete cascade,
  nombre text not null,
  estado text default 'Idea'
    check (estado in ('Idea','En producción','Programado','Publicado','Cancelado')),
  fecha_publicacion date,
  plataforma text[],
  propietario text,
  publico_objetivo text,
  tipo_contenido text[],
  url_publicacion text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists portal_social_posts_client_idx on public.portal_social_posts (client_id);

-- ============================================================
-- 8. portal_editorial — calendario editorial
-- ============================================================
create table if not exists public.portal_editorial (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.portal_clients(id) on delete cascade,
  nombre text not null,
  fecha date,
  formato text,
  plataforma text[],
  estado text default 'Pendiente'
    check (estado in ('Pendiente','En producción','Listo','Publicado')),
  notas text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists portal_editorial_client_idx on public.portal_editorial (client_id);

-- ============================================================
-- 9. portal_ad_accounts — cuentas publicitarias
-- ============================================================
create table if not exists public.portal_ad_accounts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.portal_clients(id) on delete cascade,
  nombre text not null,
  plataforma text,
  account_id text,
  estado text default 'Activa'
    check (estado in ('Activa','Pausada','Suspendida','Cerrada')),
  notas text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists portal_ad_accounts_client_idx on public.portal_ad_accounts (client_id);

-- ============================================================
-- 10. portal_tools — plataformas y herramientas
-- ============================================================
create table if not exists public.portal_tools (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.portal_clients(id) on delete cascade,
  nombre text not null,
  area text,
  estado text default 'Sin Activar'
    check (estado in ('Sin Activar','Activo','Cancelado','Por renovar')),
  fecha_compra date,
  prioridad text check (prioridad in ('Alta','Media','Baja')),
  responsable text,
  resumen_ia text,
  url text,
  usuario text,
  valor numeric(10,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists portal_tools_client_idx on public.portal_tools (client_id);

-- ============================================================
-- RLS — Row Level Security
-- Admin users (en admin_users) ven todo.
-- Client users (en portal_client_users) solo ven su client_id.
-- ============================================================

alter table public.portal_clients enable row level security;
alter table public.portal_client_users enable row level security;
alter table public.portal_campaigns enable row level security;
alter table public.portal_projects enable row level security;
alter table public.portal_objectives enable row level security;
alter table public.portal_events enable row level security;
alter table public.portal_social_posts enable row level security;
alter table public.portal_editorial enable row level security;
alter table public.portal_ad_accounts enable row level security;
alter table public.portal_tools enable row level security;

-- Helper: es admin del sistema
create or replace function public.is_admin_user()
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.admin_users
    where auth_user_id = auth.uid() and is_active = true
  );
$$;

-- Helper: client_id del usuario logueado
create or replace function public.my_client_id()
returns uuid language sql security definer stable as $$
  select client_id from public.portal_client_users
  where auth_user_id = auth.uid() and activo = true
  limit 1;
$$;

-- portal_clients
create policy "admin_all_clients" on public.portal_clients
  for all using (public.is_admin_user());

create policy "client_see_own" on public.portal_clients
  for select using (id = public.my_client_id());

-- portal_client_users
create policy "admin_all_portal_users" on public.portal_client_users
  for all using (public.is_admin_user());

create policy "client_see_own_user" on public.portal_client_users
  for select using (auth_user_id = auth.uid());

-- Macro para tablas con client_id
create policy "admin_all_campaigns" on public.portal_campaigns for all using (public.is_admin_user());
create policy "client_see_campaigns" on public.portal_campaigns for select using (client_id = public.my_client_id());

create policy "admin_all_projects" on public.portal_projects for all using (public.is_admin_user());
create policy "client_see_projects" on public.portal_projects for select using (client_id = public.my_client_id());

create policy "admin_all_objectives" on public.portal_objectives for all using (public.is_admin_user());
create policy "client_see_objectives" on public.portal_objectives for select using (client_id = public.my_client_id());

create policy "admin_all_events" on public.portal_events for all using (public.is_admin_user());
create policy "client_see_events" on public.portal_events for select using (client_id = public.my_client_id());

create policy "admin_all_social" on public.portal_social_posts for all using (public.is_admin_user());
create policy "client_see_social" on public.portal_social_posts for select using (client_id = public.my_client_id());

create policy "admin_all_editorial" on public.portal_editorial for all using (public.is_admin_user());
create policy "client_see_editorial" on public.portal_editorial for select using (client_id = public.my_client_id());

create policy "admin_all_ad_accounts" on public.portal_ad_accounts for all using (public.is_admin_user());
create policy "client_see_ad_accounts" on public.portal_ad_accounts for select using (client_id = public.my_client_id());

create policy "admin_all_tools" on public.portal_tools for all using (public.is_admin_user());
create policy "client_see_tools" on public.portal_tools for select using (client_id = public.my_client_id());
