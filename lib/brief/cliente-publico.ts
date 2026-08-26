import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createSupabaseServiceRole } from '@/lib/supabase/server';

/**
 * Cliente con el que el formulario publico guarda lo que recibe.
 *
 * Escribe con service role desde el route handler, nunca desde el navegador:
 * las tablas brief_* tienen RLS y solo un admin con sesion las lee. El
 * visitante no necesita cuenta ni ve nada de lo que ya se envio.
 *
 * Antes esto vivia en un proyecto Supabase aparte con su propia llave anon.
 * Ahora es la misma base que el resto de la plataforma: un solo juego de
 * llaves y las respuestas se ven en /admin/briefs.
 */
export function supabaseBrief(): SupabaseClient {
  return createSupabaseServiceRole();
}
