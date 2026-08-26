# Cómo correr la migración 0006

1. Entrar al panel de Supabase del **sitio** (el de `NEXT_PUBLIC_SUPABASE_URL`),
   no al del brief.
2. Ir a **SQL Editor** y abrir una consulta nueva.
3. Pegar entero el contenido de `supabase/migrations/0006_proyectos_internos.sql`.
4. Correr. Debe terminar sin errores.
5. Verificar con las consultas de abajo.

```sql
select table_name
from information_schema.tables
where table_schema = 'public' and table_name like 'int_%'
order by table_name;
```

Deben salir 9 filas.

```sql
select nombre, orden, es_inicial, es_final
from public.int_kanban_columnas order by orden;
```

Deben salir las 6 columnas, con `Sin tomar` inicial y `Entregado` final.

```sql
select email, role from public.admin_users where role = 'founder';
```

Si Samuel o Alexander no aparecen, es que todavía no entraron nunca por
`/admin/login`. Que entren una vez y volvés a correr solo el último `insert`
del archivo.

## Antes de correr: revisar el CHECK de `role`

`admin_users` es una tabla compartida con otro proyecto. La migracion hace
`drop constraint if exists admin_users_role_check`, que es el nombre que Postgres
le pone a un CHECK de columna sin nombre. Si en la base real la tabla la creo el
otro proyecto con un CHECK nombrado distinto, ese `drop` no borra nada, el nuevo
se agrega igual, y los dos quedan vivos aplicandose en AND: el rol `tester` se
seguiria rechazando.

Corre esto ANTES de la migracion:

```sql
select conname, pg_get_constraintdef(oid)
from pg_constraint
where conrelid = 'public.admin_users'::regclass and contype = 'c';
```

Si aparece algun CHECK sobre `role` con un nombre distinto de
`admin_users_role_check`, dropealo tambien antes de seguir:

```sql
alter table public.admin_users drop constraint <nombre_que_aparecio>;
```

Despues de correr la migracion, verifica que el rol nuevo entra:

```sql
select 'tester'::text in ('founder','manager','coordinator','sales','creative','tester') as ok;
select conname, pg_get_constraintdef(oid)
from pg_constraint
where conrelid = 'public.admin_users'::regclass and contype = 'c';
```

Debe quedar UN solo CHECK sobre `role`, y tiene que incluir `tester`.
