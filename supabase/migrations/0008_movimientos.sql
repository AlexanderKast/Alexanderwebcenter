-- Migration: los gastos e ingresos de cada proyecto
--
-- La hoja "Libro de movimientos" del Sheet financiero es donde se anota cada
-- gasto y cada cobro. El tablero mostraba proyectos sin plata: se veia que
-- existian, no lo que costaban.
--
-- Esta tabla es una copia de esa hoja, no una segunda contabilidad: el Sheet
-- sigue siendo la fuente y el importador la vuelve a dejar igual cada vez.

-- ============================================================
-- 1. int_movimientos
-- ============================================================
create table if not exists public.int_movimientos (
  id               uuid primary key default gen_random_uuid(),

  -- Los ids son la union con el tablero; los nombres son lo que dijo el
  -- Sheet. Se guardan los dos: si una fila nombra un proyecto que todavia
  -- no existe, el movimiento entra igual y queda visible el porque.
  sociedad_id      uuid references public.int_sociedades(id) on delete set null,
  proyecto_id      uuid references public.int_proyectos(id) on delete set null,
  sociedad_nombre  text not null default '',
  proyecto_nombre  text not null default '',

  fecha            date,
  mes              text not null default '',
  tipo             text not null check (tipo in ('Ingreso', 'Egreso')),
  categoria        text not null default '',
  descripcion      text not null default '',

  moneda           text not null default 'COP',
  monto            numeric(16, 2),
  trm              numeric(16, 4),
  monto_cop        numeric(16, 2) not null default 0,

  -- Reparto de los gastos compartidos entre sociedades (columnas
  -- "Asignado ..." del Sheet). Solo vienen cuando Sociedad = Compartido.
  asignado_ecomnoticias numeric(16, 2) not null default 0,
  asignado_ia_master    numeric(16, 2) not null default 0,
  asignado_nuskin       numeric(16, 2) not null default 0,

  pagado_por       text not null default '',
  medio_pago       text not null default '',
  estado           text not null default '',
  nota             text not null default '',

  -- Idempotencia: la fila del Sheet no tiene id propio, asi que la huella
  -- se arma con lo que la identifica. Reimportar actualiza, no duplica.
  huella           text not null unique,

  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists int_movimientos_proyecto_idx on public.int_movimientos (proyecto_id);
create index if not exists int_movimientos_sociedad_idx on public.int_movimientos (sociedad_id);
create index if not exists int_movimientos_fecha_idx on public.int_movimientos (fecha desc);

-- Igual que el resto de las tablas int_: RLS prendido y sin politicas.
-- Solo el servidor (service role) las lee; el permiso lo da requireAuth.
alter table public.int_movimientos enable row level security;

-- ============================================================
-- 2. Vista de finanzas por proyecto
--    Suma lo que ya esta anotado. Se consulta como una tabla mas.
-- ============================================================
create or replace view public.int_proyecto_finanzas
with (security_invoker = on) as
select
  p.id as proyecto_id,
  coalesce(sum(m.monto_cop) filter (where m.tipo = 'Ingreso'), 0) as ingresos,
  coalesce(sum(m.monto_cop) filter (where m.tipo = 'Egreso'), 0) as egresos,
  coalesce(sum(m.monto_cop) filter (where m.tipo = 'Ingreso'), 0)
    - coalesce(sum(m.monto_cop) filter (where m.tipo = 'Egreso'), 0) as utilidad,
  count(m.id) as movimientos,
  max(m.fecha) as ultimo_movimiento
from public.int_proyectos p
left join public.int_movimientos m on m.proyecto_id = p.id
group by p.id;

comment on view public.int_proyecto_finanzas is
  'Ingresos, egresos y utilidad en COP por proyecto, sumados de int_movimientos.';
