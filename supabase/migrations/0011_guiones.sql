-- Migration: biblioteca de guiones de verdad
--
-- /admin/guiones era un indice escrito en el codigo que apuntaba a archivos
-- en H:/Mi unidad/. Numeros fijos, links a una carpeta que solo existe en
-- una maquina: se veia lleno sin tener nada adentro.
--
-- Ahora los guiones se escriben en el panel y viven aca.

create table if not exists public.int_guiones (
  id          uuid primary key default gen_random_uuid(),

  titulo      text not null,
  pilar       text not null default '',
  plataforma  text not null default '',
  formato     text not null default '',

  estado      text not null default 'idea'
                check (estado in ('idea', 'escribiendo', 'listo', 'grabado', 'publicado')),

  -- El gancho va aparte del cuerpo: es lo unico que decide si alguien
  -- se queda, y asi se puede ver la lista entera de ganchos de un vistazo.
  gancho      text not null default '',
  cuerpo      text not null default '',
  notas       text not null default '',

  -- Donde quedo publicado, o el archivo original si venia de otro lado.
  link        text not null default '',

  autor_id    uuid references public.admin_users(id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists int_guiones_estado_idx on public.int_guiones (estado);
create index if not exists int_guiones_pilar_idx on public.int_guiones (pilar);
create index if not exists int_guiones_creado_idx on public.int_guiones (created_at desc);

-- Como el resto de las tablas int_: RLS prendido y sin politicas. Solo el
-- servidor las ve; el permiso lo da requireAuth.
alter table public.int_guiones enable row level security;
