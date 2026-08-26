-- Migration: el menu del panel se configura desde el panel
--
-- El menu vivia en components/admin/nav-items.ts. Sacar una entrada que no
-- se usa, o agregar un acceso propio, era pedir un cambio de codigo y un
-- deploy. Ahora el codigo sigue siendo el catalogo por defecto y esta tabla
-- guarda solo lo que se cambio encima.
--
-- Se guardan diferencias, no el menu entero: asi una entrada nueva del
-- codigo aparece sola, sin tener que resembrar nada.

create table if not exists public.int_menu_items (
  id             uuid primary key default gen_random_uuid(),

  -- La ruta identifica la entrada. Para las del catalogo es la que ya
  -- existe; para una agregada a mano, la que se escribio.
  href           text not null unique,

  -- Todo lo que sea null hereda del catalogo. Una entrada agregada a mano
  -- los trae siempre, porque no hay catalogo del que heredar.
  label          text,
  seccion        text,
  icono          text,
  orden          integer,

  visible        boolean not null default true,
  personalizado  boolean not null default false,

  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists int_menu_items_seccion_idx on public.int_menu_items (seccion);

alter table public.int_menu_items enable row level security;

comment on table public.int_menu_items is
  'Cambios sobre el menu del panel: que se ve, en que orden y los accesos agregados a mano. Lo que no esta aca sale del catalogo en components/admin/nav-items.ts.';
