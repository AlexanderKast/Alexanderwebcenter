# Supabase — alexandercast.com

Esquema para capturar leads del sitio personal.

## Tablas

- `subscribers` — suscriptores a la newsletter "Dios, Estrategia e IA". Double opt-in via `confirmation_token`.
- `leads` — descargas de lead magnets (PDF/Notion). Entrega con signed URL.
- `consultations` — solicitudes de llamada de consultoria (Strategy Intensive, Mentoring, Workshop).
- `contacts` — formulario de contacto general.

## Storage

- `lead-magnets` — bucket privado para PDFs. Signed URLs se generan desde Server Actions.

## Cómo aplicar

```bash
# Opcional: usando Supabase CLI linked al proyecto
supabase db push

# O manualmente via SQL Editor del dashboard:
# 1) Copiar 0001_initial_schema.sql → Run
# 2) Copiar 0002_lead_magnets_storage.sql → Run
# 3) Subir los 3 PDFs al bucket `lead-magnets` con los slugs:
#    - el-sistema-dei.pdf
#    - canvas-marca-personal.pdf
#    - 10-prompts-ia-estrategas.pdf
```

## Seguridad

Todas las tablas tienen RLS habilitado **sin policies publicas**. Solo el
`service_role` (usado desde Server Actions del servidor Next.js) puede leer
y escribir. Nunca exponer `SUPABASE_SERVICE_ROLE_KEY` al cliente.

## Variables requeridas

```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```
