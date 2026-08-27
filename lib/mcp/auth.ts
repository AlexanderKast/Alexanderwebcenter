import "server-only";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import type { Role } from "@/lib/auth";
import { createSupabaseServiceRole } from "@/lib/supabase/server";

/**
 * Login del MCP.
 *
 * El panel entra por cookie de sesion; el MCP no tiene navegador, asi que
 * entra por una llave personal en la cabecera Authorization. Es la misma
 * cuenta y el mismo rol: lo que alguien no puede hacer en el panel, tampoco
 * lo puede hacer desde un chat.
 */

const PREFIJO = "acmcp_";

export interface UsuarioMcp {
  id: string;
  email: string;
  fullName: string | null;
  role: Role;
  tokenId: string;
}

/** Llave nueva. Se devuelve en claro una sola vez: despues solo vive el hash. */
export function generarToken(): { token: string; hash: string; pista: string } {
  const token = PREFIJO + randomBytes(32).toString("base64url");
  return {
    token,
    hash: hashear(token),
    pista: token.slice(0, PREFIJO.length + 6),
  };
}

export function hashear(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** El token de la cabecera, venga como Bearer o pelado. */
export function tokenDeCabecera(cabecera: string | null): string | null {
  if (!cabecera) return null;
  const valor = cabecera.startsWith("Bearer ") ? cabecera.slice(7) : cabecera;
  const limpio = valor.trim();
  return limpio.startsWith(PREFIJO) ? limpio : null;
}

/**
 * Quien es el dueño de esta llave, o null.
 *
 * La comparacion final es en tiempo constante. El select ya busca por hash,
 * asi que en la practica alcanza, pero la igualdad de un secreto no se
 * escribe con === aunque no se pueda explotar hoy.
 */
export async function usuarioDeToken(token: string): Promise<UsuarioMcp | null> {
  const hash = hashear(token);
  const supabase = createSupabaseServiceRole();

  const { data, error } = await supabase
    .from("int_mcp_tokens")
    .select(
      "id, token_hash, activo, usuario:admin_users!int_mcp_tokens_admin_user_id_fkey(id, email, full_name, role, is_active)",
    )
    .eq("token_hash", hash)
    .maybeSingle();

  if (error || !data || !data.activo) return null;

  const guardado = Buffer.from(data.token_hash as string);
  const recibido = Buffer.from(hash);
  if (guardado.length !== recibido.length || !timingSafeEqual(guardado, recibido)) {
    return null;
  }

  const usuario = data.usuario as unknown as {
    id: string;
    email: string;
    full_name: string | null;
    role: Role;
    is_active: boolean;
  } | null;

  // Dar de baja a alguien en el panel tiene que apagarle el MCP tambien, sin
  // acordarse de revocar la llave a mano.
  if (!usuario || !usuario.is_active) return null;

  // No se espera: que quede el registro de uso no puede frenar la llamada.
  void supabase
    .from("int_mcp_tokens")
    .update({ ultimo_uso_at: new Date().toISOString() })
    .eq("id", data.id)
    .then(({ error: e }) => {
      if (e) console.error("[mcp] ultimo uso:", e.message);
    });

  return {
    id: usuario.id,
    email: usuario.email,
    fullName: usuario.full_name,
    role: usuario.role,
    tokenId: data.id as string,
  };
}

/** Como se firma lo que haga esta persona desde el chat. */
export function nombreDe(usuario: UsuarioMcp): string {
  return usuario.fullName ?? usuario.email;
}
