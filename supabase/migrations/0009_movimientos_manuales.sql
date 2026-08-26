-- Migration: cargar gastos e ingresos desde el panel, con sus facturas
--
-- Hasta ahora los movimientos solo entraban por el importador del Sheet.
-- Para anotar un gasto habia que abrir Google, y la factura quedaba suelta
-- en un correo o en el celular.
--
-- Ahora conviven dos origenes:
--   sheet -> lo trae el importador y lo vuelve a dejar igual en cada sync
--   panel -> lo carga una persona aca; el importador nunca lo toca
-- Por eso el origen es una columna y no una suposicion.

-- ============================================================
-- 1. De donde salio el movimiento
-- ============================================================
alter table public.int_movimientos
  add column if not exists origen text not null default 'sheet',
  add column if not exists creado_por uuid references public.admin_users(id) on delete set null;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'int_movimientos_origen_check'
  ) then
    alter table public.int_movimientos
      add constraint int_movimientos_origen_check check (origen in ('sheet', 'panel'));
  end if;
end $$;

create index if not exists int_movimientos_origen_idx on public.int_movimientos (origen);

comment on column public.int_movimientos.origen is
  'sheet = lo trae el importador del Google Sheet; panel = lo cargo alguien desde /admin/finanzas';
comment on column public.int_movimientos.huella is
  'Identifica la fila del Sheet para poder reimportar sin duplicar. Los movimientos del panel llevan panel:<uuid>, que nunca choca con una fila del Sheet.';

-- ============================================================
-- 2. Facturas y comprobantes
--    Un movimiento puede tener varios: la factura, el soporte de pago,
--    el XML de la factura electronica.
-- ============================================================
create table if not exists public.int_movimiento_adjuntos (
  id             uuid primary key default gen_random_uuid(),
  movimiento_id  uuid not null references public.int_movimientos(id) on delete cascade,

  -- ruta dentro del bucket privado; el nombre visible es aparte porque el
  -- del archivo original no sirve como ruta (acentos, espacios, repetidos).
  ruta           text not null unique,
  nombre         text not null,
  tipo_mime      text not null default '',
  tamano         integer not null default 0,

  subido_por     uuid references public.admin_users(id) on delete set null,
  created_at     timestamptz not null default now()
);

create index if not exists int_movimiento_adjuntos_mov_idx
  on public.int_movimiento_adjuntos (movimiento_id);

alter table public.int_movimiento_adjuntos enable row level security;

-- ============================================================
-- 3. Bucket de facturas
--    Privado: una factura tiene datos de terceros y montos. Se sirve con
--    enlaces firmados que caducan, no con URL publica como el brief.
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit)
values ('facturas', 'facturas', false, 15728640)
on conflict (id) do update
  set public = false,
      file_size_limit = 15728640;
