-- Migration: llaves para conectar el panel por MCP
--
-- El MCP deja operar el panel desde un chat: leer la bandeja de ideas,
-- mover un proyecto, dejar una nota de en que vamos. Es la misma puerta que
-- el panel, sin navegador adelante — asi que necesita la misma cuenta.
--
-- Cada persona saca su propia llave. No es un detalle de seguridad nada mas:
-- lo que se pidio es que quede escrito QUIEN hizo cada cosa, y con una llave
-- compartida toda nota queda firmada por el equipo entero, que es igual a
-- que no quede firmada por nadie.

create table if not exists public.int_mcp_tokens (
  id             uuid primary key default gen_random_uuid(),

  admin_user_id  uuid not null references public.admin_users(id) on delete cascade,

  -- Para reconocerla en la lista: "mi portatil", "la del estudio".
  nombre         text not null default '',

  -- Solo el hash. Si esta tabla se filtra, no se puede entrar con nada de
  -- lo que hay adentro; la llave se muestra una sola vez al crearla.
  token_hash     text not null unique,

  -- Los primeros caracteres, para poder decir cual revocar sin tener la
  -- llave entera delante.
  pista          text not null default '',

  ultimo_uso_at  timestamptz,
  activo         boolean not null default true,
  created_at     timestamptz not null default now()
);

create index if not exists int_mcp_tokens_usuario_idx
  on public.int_mcp_tokens (admin_user_id);

-- El login del MCP es un select por esta columna en cada llamada.
create index if not exists int_mcp_tokens_hash_idx
  on public.int_mcp_tokens (token_hash);

-- Como el resto de las tablas int_: RLS prendido y sin politicas. Solo el
-- servidor las ve.
alter table public.int_mcp_tokens enable row level security;

comment on table public.int_mcp_tokens is
  'Llaves personales para entrar al panel por MCP. Guarda el hash, nunca la llave.';
