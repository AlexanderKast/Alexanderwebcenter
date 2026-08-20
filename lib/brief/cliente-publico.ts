import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { urlDelBrief, urlDesdeLlave } from '@/lib/supabase/server';

/**
 * Cliente del brief con la llave publica (anon).
 *
 * La anon key esta pensada para viajar al navegador: no es un secreto.
 * Lo que protege los datos son las politicas de la base: anon solo puede
 * INSERTAR en brief_submissions / brief_answers y subir al bucket brief.
 * Leer las respuestas requiere sesion del correo administrador.
 *
 * Se usa asi para que el formulario funcione sin depender de que una
 * variable de entorno este bien configurada en el hosting.
 */
const ANON =
  process.env.BRIEF_SUPABASE_ANON_KEY?.trim() ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjZnVpbWF6dGRzZWtxZ3RyYm1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxOTExMTYsImV4cCI6MjEwMjc2NzExNn0.Wu0237cbVx1_yGKn8Uq_FVhwqej1h6QlkSsr4DbrNOc';

let cliente: SupabaseClient | null = null;

export function supabasePublicoBrief(): SupabaseClient {
  if (cliente) return cliente;

  const url = urlDesdeLlave(ANON) ?? urlDelBrief();
  if (!url) {
    throw new Error('No pude resolver la URL de la base del brief');
  }

  cliente = createClient(url, ANON, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  return cliente;
}
