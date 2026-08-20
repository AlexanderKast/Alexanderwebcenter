import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { urlDelBrief as urlBase, urlDesdeLlave } from '@/lib/supabase/server';

/**
 * Sesion del panel del brief. Corre contra el proyecto Supabase del
 * brief, no contra la base del sitio: son cuentas distintas.
 *
 * La anon key es publica por diseño (viaja al navegador en cualquier app
 * Supabase); lo que nunca sale del servidor es la service role.
 */
const ANON =
  process.env.BRIEF_SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjZnVpbWF6dGRzZWtxZ3RyYm1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxOTExMTYsImV4cCI6MjEwMjc2NzExNn0.Wu0237cbVx1_yGKn8Uq_FVhwqej1h6QlkSsr4DbrNOc';

function urlDelBrief(): string {
  return urlBase() ?? urlDesdeLlave(ANON) ?? 'https://rcfuimaztdsekqgtrbmb.supabase.co';
}

/** Quien puede entrar al panel. Coma separa varios correos. */
export function correosPermitidos(): string[] {
  return (process.env.BRIEF_ADMIN_EMAILS ?? 'iamasterstech@gmail.com')
    .split(',')
    .map((c) => c.trim().toLowerCase())
    .filter(Boolean);
}

export async function clientePanel() {
  const almacen = await cookies();
  return createServerClient(urlDelBrief(), ANON, {
    cookies: {
      getAll() {
        return almacen.getAll();
      },
      setAll(aGuardar) {
        try {
          aGuardar.forEach(({ name, value, options }) => almacen.set(name, value, options));
        } catch {
          // Server Component: la cookie la escribe el server action.
        }
      },
    },
  });
}

export interface UsuarioPanel {
  id: string;
  email: string;
}

/** Usuario con permiso, o null. */
export async function usuarioPanel(): Promise<UsuarioPanel | null> {
  const supabase = await clientePanel();
  const { data, error } = await supabase.auth.getUser();
  const correo = data.user?.email?.toLowerCase();
  if (error || !data.user || !correo) return null;
  if (!correosPermitidos().includes(correo)) return null;
  return { id: data.user.id, email: correo };
}
