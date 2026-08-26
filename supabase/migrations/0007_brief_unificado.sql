-- Migration: el brief vive en la misma base que el resto de la plataforma
--
-- Hasta ahora las respuestas del formulario estaban en un proyecto Supabase
-- aparte (rcfuimaztdsekqgtrbmb) con su propio login en /panel. Dos bases
-- significan dos juegos de llaves, dos sesiones y dos lugares donde se rompe.
--
-- Las tablas brief_* ya existen aca (migracion 0005). Lo que faltaba es el
-- bucket de archivos y dejar claro quien escribe.

-- ============================================================
-- 1. Bucket de archivos del brief (logos, manuales de marca, fotos)
--    Publico: las respuestas guardan la URL directa y el panel la muestra.
--    Los nombres los genera el servidor (uuid), no el visitante.
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit)
values ('brief', 'brief', true, 10485760)
on conflict (id) do update
  set public = true,
      file_size_limit = 10485760;

-- Subir y borrar: solo el servidor (service role, que ignora RLS).
-- La lectura de un bucket publico no pasa por politicas.
drop policy if exists "brief_admin_objetos" on storage.objects;
create policy "brief_admin_objetos" on storage.objects
  for all
  using (bucket_id = 'brief' and public.is_admin_user())
  with check (bucket_id = 'brief' and public.is_admin_user());

-- ============================================================
-- 2. De donde vino cada envio
--    Los envios migrados desde la base vieja quedan marcados, para poder
--    distinguirlos si algo no cuadra.
-- ============================================================
alter table public.brief_submissions
  add column if not exists origen text not null default 'formulario';

comment on column public.brief_submissions.origen is
  'formulario = llego por /brief; migrado = venia del proyecto Supabase viejo del brief';
