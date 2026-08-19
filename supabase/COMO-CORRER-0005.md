# Cómo activar el formulario de brief (2 minutos)

El formulario ya está en producción y se puede llenar, pero al enviar
devuelve error: **faltan las tablas en la base de datos**. Esto lo arregla.

---

## Qué base es (y cuál NO)

| | |
|---|---|
| **Base del sitio** | proyecto Supabase `qqkzvbvligymwqqktjsc` |
| **Base de KREOON** | proyecto `kreoon_database` — **no se toca** |

Son proyectos **separados**. La migración corre en la del sitio, que es la
misma donde ya viven `ac_leads`, `admin_users` y `portal_clients`.

---

## Por qué no puede romper nada

El archivo `migrations/0005_brief_submissions.sql` sólo contiene:

- `create table if not exists` — dos tablas nuevas: `brief_submissions` y `brief_answers`
- `create index if not exists`
- `create or replace function` + trigger, ambos con nombre propio (`brief_touch_updated_at`)
- `alter table ... enable row level security` **sobre las dos tablas nuevas únicamente**
- `create policy` sobre esas mismas dos tablas

**No hay ni un `drop table`, ni un `alter` sobre tablas existentes, ni un
`update`, ni un `delete`.** Si algo saliera mal, se deshace con:

```sql
drop table if exists public.brief_answers;
drop table if exists public.brief_submissions;
drop function if exists public.brief_touch_updated_at();
```

---

## Pasos

1. Entrá al SQL Editor de la base del sitio:
   **https://supabase.com/dashboard/project/qqkzvbvligymwqqktjsc/sql/new**

2. Abrí `supabase/migrations/0005_brief_submissions.sql` de este repo,
   copiá **todo** el contenido y pegalo ahí.

3. Botón **Run**. Debería decir *Success. No rows returned*.

4. Comprobá que quedaron creadas:

```sql
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name like 'brief_%';
```

Tiene que devolver `brief_answers` y `brief_submissions`.

---

## Probar que funciona

1. Abrí https://www.alexandercast.online/brief/demo
2. Completá al menos **nombre** y **WhatsApp** (son los dos obligatorios)
3. Enviá
4. Entrá a https://www.alexandercast.online/admin/briefs — tiene que aparecer

Si aparece, el formulario quedó operativo de punta a punta.

---

## Si da error

| Mensaje | Qué pasa |
|---|---|
| `function public.is_admin_user() does not exist` | La migración `0004_portal_clients.sql` no corrió en esta base. Corré esa primero. |
| `permission denied` | Estás en el SQL Editor con un rol sin permisos: entrá como dueño del proyecto. |
| El envío sigue fallando | Mirá los logs del deploy en Vercel: el endpoint deja el detalle con el prefijo `[brief]`. |

---

## Pendiente aparte: rate limit

Los formularios usan un respaldo en memoria porque faltan las variables de
Upstash. Para un límite real compartido entre instancias, agregá en Vercel:

```
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

Se sacan de https://console.upstash.com — el plan gratuito alcanza de sobra.
