-- alexandercast.com — schema inicial
-- Objetivo: capturar leads del sitio personal (newsletter, lead magnets, consultas, contacto)
-- Todo el acceso es solo server-side via service_role. Sin lectura desde el cliente.

create extension if not exists "pgcrypto";

-- =========================================================================
-- SUBSCRIBERS (newsletter Dios, Estrategia e IA)
-- =========================================================================
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text,
  pilar_interest text check (
    pilar_interest in ('dios', 'estrategia', 'ia', 'proceso', 'vida-real') or pilar_interest is null
  ),
  locale text default 'es-CO',
  ip_country text,
  confirmation_token uuid default gen_random_uuid(),
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  resend_contact_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists subscribers_email_unique on public.subscribers (lower(email));
create index if not exists subscribers_confirmed_idx on public.subscribers (confirmed_at)
  where confirmed_at is not null;

-- =========================================================================
-- LEADS (descargas de lead magnets)
-- =========================================================================
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  nombre text,
  lead_magnet_slug text not null,
  delivered_at timestamptz,
  delivery_url_expires_at timestamptz,
  source text,
  ip_country text,
  created_at timestamptz not null default now()
);

create index if not exists leads_email_idx on public.leads (lower(email));
create index if not exists leads_magnet_idx on public.leads (lead_magnet_slug);

-- =========================================================================
-- CONSULTATIONS (solicitudes de llamada de consultoria)
-- =========================================================================
create table if not exists public.consultations (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  nombre text not null,
  empresa text,
  mensaje text,
  tipo_servicio text check (
    tipo_servicio in ('strategy-intensive', 'mentoring', 'workshop', 'otros')
    or tipo_servicio is null
  ),
  budget_range text,
  cal_booking_id text,
  scheduled_for timestamptz,
  status text not null default 'nuevo' check (
    status in ('nuevo', 'contactado', 'agendado', 'cerrado', 'descartado')
  ),
  created_at timestamptz not null default now()
);

create index if not exists consultations_status_idx on public.consultations (status);
create index if not exists consultations_created_idx on public.consultations (created_at desc);

-- =========================================================================
-- CONTACTS (formulario de contacto general)
-- =========================================================================
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  nombre text not null,
  asunto text,
  mensaje text not null,
  origen text,
  ip_country text,
  leido_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists contacts_created_idx on public.contacts (created_at desc);

-- =========================================================================
-- RLS: todo cerrado. Solo service_role escribe/lee via Server Actions.
-- =========================================================================
alter table public.subscribers enable row level security;
alter table public.leads        enable row level security;
alter table public.consultations enable row level security;
alter table public.contacts     enable row level security;

-- No se crean policies para anon/authenticated: RLS bloquea todo acceso.
-- service_role bypassea RLS de forma implícita.

-- =========================================================================
-- updated_at trigger helper
-- =========================================================================
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at on public.subscribers;
create trigger set_updated_at
  before update on public.subscribers
  for each row execute function public.handle_updated_at();
