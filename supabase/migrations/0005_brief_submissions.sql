-- Migration: Brief de marca / tienda — respuestas del cuestionario publico
-- Prefijo: brief_* para separar de ac_* (sitio) y portal_* (portal de clientes).
--
-- Modelo: una fila por envio en brief_submissions + una fila por respuesta
-- en brief_answers. El JSON completo queda en payload por si el cuestionario
-- cambia y hay que reconstruir un envio viejo.
--
-- RLS: nadie escribe ni lee desde el navegador. El endpoint publico usa la
-- service role key (que ignora RLS) despues de validar en el servidor.

-- ============================================================
-- 1. brief_submissions — cabecera del envio
-- ============================================================
create table if not exists public.brief_submissions (
  id               uuid primary key default gen_random_uuid(),
  cliente          text not null,
  marca            text not null,
  sector           text not null default '',
  contacto_nombre  text not null default '',
  contacto_email   text not null default '',
  contacto_tel     text not null default '',
  empresa          text not null default '',
  completado_pct   smallint not null default 0 check (completado_pct between 0 and 100),
  respondidas      smallint not null default 0,
  total_campos     smallint not null default 0,
  estado           text not null default 'nuevo'
                     check (estado in ('nuevo', 'leido', 'en_proceso', 'archivado')),
  notas            text,
  payload          jsonb not null default '{}'::jsonb,
  -- La IP se guarda hasheada (HMAC en el servidor): sirve para limites
  -- y auditoria sin almacenar el dato personal en claro.
  ip_hash          text not null default '',
  user_agent       text not null default '',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists brief_submissions_created_idx on public.brief_submissions (created_at desc);
create index if not exists brief_submissions_estado_idx on public.brief_submissions (estado);
create index if not exists brief_submissions_cliente_idx on public.brief_submissions (cliente);

-- ============================================================
-- 2. brief_answers — una fila por pregunta respondida
--    Permite buscar por respuesta sin abrir el JSON.
-- ============================================================
create table if not exists public.brief_answers (
  id            uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.brief_submissions(id) on delete cascade,
  campo_id      text not null,
  valor         text not null default ''
);

create index if not exists brief_answers_submission_idx on public.brief_answers (submission_id);
create index if not exists brief_answers_campo_idx on public.brief_answers (campo_id);
create unique index if not exists brief_answers_unico_idx on public.brief_answers (submission_id, campo_id);

-- ============================================================
-- 3. updated_at automatico
-- ============================================================
create or replace function public.brief_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists brief_submissions_touch on public.brief_submissions;
create trigger brief_submissions_touch
  before update on public.brief_submissions
  for each row execute function public.brief_touch_updated_at();

-- ============================================================
-- 4. RLS — cerrado por defecto
--    Solo los admins activos leen/escriben con la sesion del panel.
--    El formulario publico inserta via service role desde el route handler.
--    is_admin_user() viene de 0004_portal_clients.sql
-- ============================================================
alter table public.brief_submissions enable row level security;
alter table public.brief_answers enable row level security;

drop policy if exists "admin_all_brief_submissions" on public.brief_submissions;
create policy "admin_all_brief_submissions" on public.brief_submissions
  for all using (public.is_admin_user());

drop policy if exists "admin_all_brief_answers" on public.brief_answers;
create policy "admin_all_brief_answers" on public.brief_answers
  for all using (public.is_admin_user());
