-- Migration: bandeja de ideas, alimentada por un bot de Telegram
--
-- Una idea buena aparece manejando, grabando o a mitad de otra cosa: para
-- cuando hay un teclado adelante ya se perdio. El bot resuelve eso: se manda
-- una nota de voz y la idea queda escrita, titulada y guardada.
--
-- La idea entra a una bandeja global. Ligarla a un proyecto se hace despues,
-- desde el panel: preguntarle el proyecto a alguien que solo queria soltar
-- la idea es justo la friccion que se estaba tratando de sacar.

-- ============================================================
-- 1. int_telegram_codigos — quien puede usar el bot
-- ============================================================
-- El bot es abierto a internet: cualquiera puede escribirle. Sin esta puerta,
-- un desconocido gasta transcripcion y llena la bandeja. El codigo se genera
-- en el panel y se pasa por fuera; recien despues de canjearlo el bot escucha.
create table if not exists public.int_telegram_codigos (
  id             uuid primary key default gen_random_uuid(),

  codigo         text not null unique,

  -- Con quien queda ligado el que lo canjee. Si es null, la idea entra igual
  -- pero firmada solo con el nombre de Telegram: alguien de afuera del panel.
  admin_user_id  uuid references public.admin_users(id) on delete set null,

  -- Para que sirva de recordatorio de a quien se le dio el codigo.
  nota           text not null default '',

  usos_max       integer not null default 1 check (usos_max > 0),
  usos           integer not null default 0,
  expira_at      timestamptz,

  activo         boolean not null default true,
  creado_por     uuid references public.admin_users(id) on delete set null,
  created_at     timestamptz not null default now()
);

create index if not exists int_telegram_codigos_activo_idx
  on public.int_telegram_codigos (activo);

alter table public.int_telegram_codigos enable row level security;

-- ============================================================
-- 2. int_telegram_usuarios — quien ya canjeo un codigo
-- ============================================================
create table if not exists public.int_telegram_usuarios (
  -- El chat_id de Telegram es la identidad: es lo unico que llega en cada
  -- update y no cambia aunque la persona se renombre.
  chat_id        bigint primary key,

  admin_user_id  uuid references public.admin_users(id) on delete set null,

  -- Como se llama en Telegram. Se guarda aparte del admin_user porque quien
  -- manda puede no tener cuenta en el panel, y aun asi la idea tiene que
  -- quedar firmada con un nombre.
  nombre         text not null default '',
  username       text not null default '',

  codigo_usado   text not null default '',
  activo         boolean not null default true,
  ultima_idea_at timestamptz,
  created_at     timestamptz not null default now()
);

create index if not exists int_telegram_usuarios_admin_idx
  on public.int_telegram_usuarios (admin_user_id);

alter table public.int_telegram_usuarios enable row level security;

-- ============================================================
-- 3. int_ideas — la bandeja
-- ============================================================
create table if not exists public.int_ideas (
  id             uuid primary key default gen_random_uuid(),

  titulo         text not null default '',
  resumen        text not null default '',

  -- El texto crudo se guarda siempre, aparte del resumen: si la IA entendio
  -- mal, la idea original tiene que seguir estando.
  transcripcion  text not null default '',

  tags           text[] not null default '{}',

  estado         text not null default 'nueva'
                   check (estado in ('nueva', 'en_revision', 'aprobada', 'descartada', 'convertida')),

  origen         text not null default 'telegram'
                   check (origen in ('telegram', 'panel')),

  -- Ligar a un proyecto es opcional y posterior. La idea vale igual suelta.
  proyecto_id    uuid references public.int_proyectos(id) on delete set null,

  -- El audio original en el bucket privado. Vacio si se escribio a mano.
  audio_path     text not null default '',
  audio_seg      integer not null default 0,

  -- Autor: el del panel si lo tiene, y siempre el nombre visible. Una idea
  -- de alguien sin cuenta igual queda con nombre y no aparece huerfana.
  autor_id       uuid references public.admin_users(id) on delete set null,
  autor_nombre   text not null default '',
  telegram_chat_id bigint,

  -- Que anoto quien la reviso en el panel.
  notas          text not null default '',

  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists int_ideas_estado_idx on public.int_ideas (estado);
create index if not exists int_ideas_creado_idx on public.int_ideas (created_at desc);
create index if not exists int_ideas_proyecto_idx on public.int_ideas (proyecto_id);

-- Como el resto de las tablas int_: RLS prendido y sin politicas. Solo el
-- servidor las ve; el permiso lo da requireAuth.
alter table public.int_ideas enable row level security;

comment on table public.int_ideas is
  'Bandeja de ideas. Entran por el bot de Telegram (nota de voz transcrita) o escritas en el panel.';

-- ============================================================
-- 4. Bucket ideas-audio
-- ============================================================
-- Privado: una nota de voz es la voz de alguien hablando suelto. Se sirve
-- con enlaces firmados que caducan, igual que las facturas.
insert into storage.buckets (id, name, public, file_size_limit)
values ('ideas-audio', 'ideas-audio', false, 26214400)
on conflict (id) do update
  set public = false,
      file_size_limit = 26214400;
