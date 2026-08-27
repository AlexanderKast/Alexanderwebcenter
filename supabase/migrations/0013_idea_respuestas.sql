-- Migration: contestarle por Telegram a quien mando la idea
--
-- La bandeja era de una sola via: la idea entraba y quien la mando no se
-- enteraba de nada. Sin respuesta, o deja de mandar ideas, o vuelve a
-- preguntar por fuera — y las dos cosas rompen el sentido del bot.
--
-- Ahora, al aprobar o descartar, se le puede mandar un mensaje: por que si,
-- por que no, o que le falta a la idea para servir.

create table if not exists public.int_idea_respuestas (
  id             uuid primary key default gen_random_uuid(),

  idea_id        uuid not null references public.int_ideas(id) on delete cascade,

  -- Quien contesto. Se muestra en el mensaje: una respuesta anonima sobre
  -- una idea propia se lee como un sistema, no como alguien del equipo.
  admin_user_id  uuid references public.admin_users(id) on delete set null,
  admin_nombre   text not null default '',

  texto          text not null,

  -- En que quedo la idea cuando se mando. Sirve para leer el hilo despues:
  -- el mismo texto significa otra cosa si se aprobo o si se descarto.
  estado_al_responder text not null default '',

  -- Un mensaje que Telegram no acepto (bloqueo el bot, borro el chat) tiene
  -- que quedar marcado, no desaparecer: si no, se cree que se aviso.
  entregado      boolean not null default false,
  error          text not null default '',

  created_at     timestamptz not null default now()
);

create index if not exists int_idea_respuestas_idea_idx
  on public.int_idea_respuestas (idea_id, created_at desc);

-- Como el resto de las tablas int_: RLS prendido y sin politicas. Solo el
-- servidor las ve; el permiso lo da requireAuth.
alter table public.int_idea_respuestas enable row level security;

comment on table public.int_idea_respuestas is
  'Mensajes que el equipo le mando por Telegram a quien propuso una idea.';
