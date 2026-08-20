import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/** Cliente server con cookie session (auth.getUser). */
export async function createSupabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: { name: string; value: string; options: CookieOptions }[],
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Component — ignore
          }
        },
      },
    },
  );
}

/** Service role: bypass RLS. Server-only. */
export function createSupabaseServiceRole(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

/**
 * Base del brief. Vive en su propio proyecto Supabase: si estan
 * BRIEF_SUPABASE_URL y BRIEF_SUPABASE_SERVICE_ROLE_KEY se usan esas;
 * si no, cae en la base del sitio.
 */
/**
 * Saca la URL del proyecto del propio token: el JWT de Supabase trae el
 * ref en su payload. Asi alcanza con configurar la llave.
 */
export function urlDesdeLlave(key: string | undefined): string | null {
  if (!key) return null;
  try {
    const carga = key.trim().split(".")[1];
    if (!carga) return null;
    const json = JSON.parse(Buffer.from(carga, "base64").toString("utf8")) as { ref?: string };
    return json.ref ? `https://${json.ref}.supabase.co` : null;
  } catch {
    return null;
  }
}

/**
 * Una variable mal pegada (sin https://, con espacios, a medias) no debe
 * tumbar la pagina: si no es una URL http(s) de verdad, se ignora.
 */
export function urlValida(valor: string | undefined): string | null {
  if (!valor) return null;
  const limpio = valor.trim().replace(/\/+$/, "");
  try {
    const url = new URL(limpio);
    return url.protocol === "https:" || url.protocol === "http:" ? url.origin : null;
  } catch {
    return null;
  }
}

/**
 * URL del proyecto del brief. Primero la llave: el ref del JWT es la
 * unica fuente que no se puede escribir mal. La variable queda de respaldo.
 */
export function urlDelBrief(): string | null {
  return (
    urlDesdeLlave(process.env.BRIEF_SUPABASE_SERVICE_ROLE_KEY) ??
    urlValida(process.env.BRIEF_SUPABASE_URL) ??
    urlValida(process.env.NEXT_PUBLIC_SUPABASE_URL) ??
    urlValida(process.env.SUPABASE_URL)
  );
}

/** Solo el host, para poder registrarlo en los logs sin filtrar la llave. */
export function hostDelBrief(): string {
  const url = urlDelBrief();
  if (!url) return "(sin url)";
  try {
    return new URL(url).host;
  } catch {
    return "(url invalida)";
  }
}

export function createSupabaseBrief(): SupabaseClient {
  const key = (
    process.env.BRIEF_SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  )?.trim();
  if (!key) {
    throw new Error("Falta BRIEF_SUPABASE_SERVICE_ROLE_KEY");
  }

  const url = urlDelBrief();
  if (!url) {
    throw new Error("No pude resolver la URL de la base del brief");
  }
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

/** Alias legado (server actions existentes). */
export function getSupabaseServerClient(): SupabaseClient {
  return createSupabaseServiceRole();
}
