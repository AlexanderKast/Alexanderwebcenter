-- Bucket privado para lead magnets. Entrega solo via signed URLs desde el servidor.

insert into storage.buckets (id, name, public)
values ('lead-magnets', 'lead-magnets', false)
on conflict (id) do nothing;

-- Sin policies publicas. Solo service_role puede leer/escribir.
-- Signed URLs se generan desde Server Actions con expiracion de 7 dias.
