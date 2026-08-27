-- Migration: el MCP pregunta antes de publicar, y se le ve la mano en vivo
--
-- Dos cosas que faltaban para poder usar el MCP de verdad:
--
-- 1. No todo lo que se trabaja con Claude es de la empresa. Hay proyectos
--    personales y proyectos internos que no van a la plataforma. Asi que
--    ahora hay una sesion por llave: hasta que alguien no confirma "si, esto
--    es de trabajo", el MCP no escribe una sola linea en el panel.
--
-- 2. Si Claude mueve una tarjeta mientras otra persona esta mirando el
--    tablero, esa persona tiene que ver que se esta moviendo y quien la
--    movio. Sin esto las cosas cambian solas delante de los ojos.

create table if not exists public.int_mcp_sesiones (
  id            uuid primary key default gen_random_uuid(),

  token_id      uuid not null references public.int_mcp_tokens(id) on delete cascade,

  -- Como se llama el proyecto del lado del que habla: la carpeta, el repo,
  -- lo que sea. Sirve para que la respuesta diga de que estamos hablando.
  workspace     text not null default '',

  -- La respuesta a la pregunta. false = proyecto personal o interno: se
  -- puede leer el panel, pero no se publica nada en el.
  es_trabajo    boolean not null,

  -- Con que proyecto del panel se corresponde, si es que se sabe.
  proyecto_id   uuid references public.int_proyectos(id) on delete set null,

  -- La confirmacion no es para siempre: manana el mismo portatil puede
  -- estar en otra cosa.
  expira_at     timestamptz not null default now() + interval '8 hours',
  created_at    timestamptz not null default now()
);

-- Solo interesa la ultima sesion viva de cada llave.
create index if not exists int_mcp_sesiones_token_idx
  on public.int_mcp_sesiones (token_id, created_at desc);

create table if not exists public.int_mcp_actividad (
  id             uuid primary key default gen_random_uuid(),

  token_id       uuid references public.int_mcp_tokens(id) on delete set null,
  admin_user_id  uuid references public.admin_users(id) on delete set null,
  admin_nombre   text not null default '',

  herramienta    text not null default '',

  -- Escrito para leerse de un vistazo: "Moviendo «Kreoon» a Produccion".
  descripcion    text not null default '',

  -- Para poder pintar el cartel sobre la tarjeta exacta y no solo arriba.
  recurso_tipo   text not null default '',
  recurso_id     text not null default '',

  estado         text not null default 'trabajando'
                 check (estado in ('trabajando', 'listo', 'error')),

  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- El panel pregunta siempre lo mismo: que paso en el ultimo minuto.
create index if not exists int_mcp_actividad_reciente_idx
  on public.int_mcp_actividad (updated_at desc);

alter table public.int_mcp_sesiones  enable row level security;
alter table public.int_mcp_actividad enable row level security;

comment on table public.int_mcp_sesiones is
  'Una por llave y por rato: si el proyecto desde el que hablan es de trabajo. Sin un si, el MCP no escribe.';
comment on table public.int_mcp_actividad is
  'El pulso del MCP: que esta tocando Claude ahora mismo, para que el panel lo muestre en vivo.';
