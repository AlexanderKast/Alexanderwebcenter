-- Migration: Tablas del sitio alexandercast.com con prefijo `ac_*`
-- Project: DB compartida con UGC Colombia (domxgsrajwyuaffiqbtr)
-- Autor:   Alexander Cast
--
-- Las tablas tienen prefijo ac_ para convivir con las de UGC Colombia.
-- Reutilizamos admin_users / admin_activity / invitations existentes.

-- ============================================================
-- 1. ac_subscribers — newsletter "Dios, Estrategia e IA"
-- ============================================================
create table if not exists public.ac_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text,
  pilar_interest text check (
    pilar_interest in ('dios', 'estrategia', 'ia', 'proceso', 'vida-real')
    or pilar_interest is null
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
create unique index if not exists ac_subscribers_email_unique on public.ac_subscribers (lower(email));
create index if not exists ac_subscribers_confirmed_idx on public.ac_subscribers (confirmed_at) where confirmed_at is not null;

-- ============================================================
-- 2. ac_leads — descargas de lead magnets
-- ============================================================
create table if not exists public.ac_leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  nombre text,
  lead_magnet_slug text not null,
  delivered_at timestamptz,
  delivery_url_expires_at timestamptz,
  source text,
  ip_country text,
  stage text not null default 'nuevo'
    check (stage in ('nuevo','contactado','nutriendo','calificado','convertido','descartado')),
  temperature text default 'warm' check (temperature in ('hot','warm','cold')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists ac_leads_email_idx on public.ac_leads (lower(email));
create index if not exists ac_leads_magnet_idx on public.ac_leads (lead_magnet_slug);
create index if not exists ac_leads_stage_idx on public.ac_leads (stage);

-- ============================================================
-- 3. ac_consultations — solicitudes de llamada
-- ============================================================
create table if not exists public.ac_consultations (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  nombre text not null,
  empresa text,
  mensaje text,
  tipo_servicio text check (
    tipo_servicio in ('diagnostico-express','mentoring','workshop','otros')
    or tipo_servicio is null
  ),
  budget_range text,
  cal_booking_id text,
  scheduled_for timestamptz,
  status text not null default 'nuevo'
    check (status in ('nuevo','contactado','agendado','cerrado','descartado')),
  assigned_to uuid references public.admin_users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists ac_consultations_status_idx on public.ac_consultations (status);
create index if not exists ac_consultations_created_idx on public.ac_consultations (created_at desc);

-- ============================================================
-- 4. ac_contacts — formulario general
-- ============================================================
create table if not exists public.ac_contacts (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  nombre text not null,
  asunto text,
  mensaje text not null,
  origen text,
  ip_country text,
  leido_at timestamptz,
  leido_by uuid references public.admin_users(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists ac_contacts_created_idx on public.ac_contacts (created_at desc);

-- ============================================================
-- 5. Trigger updated_at
-- ============================================================
create or replace function public.ac_handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists ac_subscribers_updated_at on public.ac_subscribers;
create trigger ac_subscribers_updated_at before update on public.ac_subscribers
  for each row execute function public.ac_handle_updated_at();

drop trigger if exists ac_leads_updated_at on public.ac_leads;
create trigger ac_leads_updated_at before update on public.ac_leads
  for each row execute function public.ac_handle_updated_at();

drop trigger if exists ac_consultations_updated_at on public.ac_consultations;
create trigger ac_consultations_updated_at before update on public.ac_consultations
  for each row execute function public.ac_handle_updated_at();

-- ============================================================
-- 6. RLS — solo service_role + admin_users
-- ============================================================
alter table public.ac_subscribers   enable row level security;
alter table public.ac_leads         enable row level security;
alter table public.ac_consultations enable row level security;
alter table public.ac_contacts      enable row level security;

-- admin_users autenticados pueden leer todo de ac_*
do $$ begin
  if not exists (select 1 from pg_policies where tablename='ac_subscribers' and policyname='admin reads ac_subscribers') then
    create policy "admin reads ac_subscribers" on public.ac_subscribers for select to authenticated
      using (exists (select 1 from public.admin_users where auth_user_id = auth.uid() and is_active));
  end if;
  if not exists (select 1 from pg_policies where tablename='ac_leads' and policyname='admin reads ac_leads') then
    create policy "admin reads ac_leads" on public.ac_leads for select to authenticated
      using (exists (select 1 from public.admin_users where auth_user_id = auth.uid() and is_active));
  end if;
  if not exists (select 1 from pg_policies where tablename='ac_consultations' and policyname='admin reads ac_consultations') then
    create policy "admin reads ac_consultations" on public.ac_consultations for select to authenticated
      using (exists (select 1 from public.admin_users where auth_user_id = auth.uid() and is_active));
  end if;
  if not exists (select 1 from pg_policies where tablename='ac_contacts' and policyname='admin reads ac_contacts') then
    create policy "admin reads ac_contacts" on public.ac_contacts for select to authenticated
      using (exists (select 1 from public.admin_users where auth_user_id = auth.uid() and is_active));
  end if;
end $$;

-- managers+ pueden actualizar ac_leads, ac_consultations, ac_contacts
do $$ begin
  if not exists (select 1 from pg_policies where tablename='ac_leads' and policyname='managers update ac_leads') then
    create policy "managers update ac_leads" on public.ac_leads for update to authenticated
      using (exists (select 1 from public.admin_users where auth_user_id = auth.uid() and role in ('founder','manager','coordinator','sales') and is_active));
  end if;
  if not exists (select 1 from pg_policies where tablename='ac_consultations' and policyname='managers update ac_consultations') then
    create policy "managers update ac_consultations" on public.ac_consultations for update to authenticated
      using (exists (select 1 from public.admin_users where auth_user_id = auth.uid() and role in ('founder','manager','coordinator','sales') and is_active));
  end if;
  if not exists (select 1 from pg_policies where tablename='ac_contacts' and policyname='managers update ac_contacts') then
    create policy "managers update ac_contacts" on public.ac_contacts for update to authenticated
      using (exists (select 1 from public.admin_users where auth_user_id = auth.uid() and role in ('founder','manager','coordinator','sales') and is_active));
  end if;
end $$;

-- service_role full access
do $$ begin
  if not exists (select 1 from pg_policies where tablename='ac_subscribers' and policyname='service role full access on ac_subscribers') then
    create policy "service role full access on ac_subscribers" on public.ac_subscribers for all using (auth.role() = 'service_role');
  end if;
  if not exists (select 1 from pg_policies where tablename='ac_leads' and policyname='service role full access on ac_leads') then
    create policy "service role full access on ac_leads" on public.ac_leads for all using (auth.role() = 'service_role');
  end if;
  if not exists (select 1 from pg_policies where tablename='ac_consultations' and policyname='service role full access on ac_consultations') then
    create policy "service role full access on ac_consultations" on public.ac_consultations for all using (auth.role() = 'service_role');
  end if;
  if not exists (select 1 from pg_policies where tablename='ac_contacts' and policyname='service role full access on ac_contacts') then
    create policy "service role full access on ac_contacts" on public.ac_contacts for all using (auth.role() = 'service_role');
  end if;
end $$;

-- ============================================================
-- 7. Bucket lead-magnets (si no existe)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('ac-lead-magnets', 'ac-lead-magnets', false)
on conflict (id) do nothing;
