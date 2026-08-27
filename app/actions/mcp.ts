"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { generarToken } from "@/lib/mcp/auth";
import { createSupabaseServiceRole } from "@/lib/supabase/server";

/**
 * Las llaves del MCP.
 *
 * Cada uno maneja las suyas y nada mas: ni siquiera un founder ve la llave
 * de otro. Lo unico que se puede hacer con la ajena es que el panel le de
 * de baja la cuenta, que ya la apaga.
 */

export type ResultadoLlave =
  | { ok: true; token: string }
  | { ok: false; error: string };

export type ResultadoSimple = { ok: true } | { ok: false; error: string };

export async function crearLlaveMcp(nombre: string): Promise<ResultadoLlave> {
  const usuario = await requireAuth();
  const supabase = createSupabaseServiceRole();

  const { data: activas } = await supabase
    .from("int_mcp_tokens")
    .select("id")
    .eq("admin_user_id", usuario.id)
    .eq("activo", true);

  // Un tope bajo a proposito: mas de un puñado de llaves vivas por persona
  // no es un caso real, es una que se fue de las manos.
  if ((activas?.length ?? 0) >= 10) {
    return { ok: false, error: "Ya tenés 10 llaves activas. Revocá alguna primero." };
  }

  const { token, hash, pista } = generarToken();

  const { error } = await supabase.from("int_mcp_tokens").insert({
    admin_user_id: usuario.id,
    nombre: nombre.trim().slice(0, 80) || "Sin nombre",
    token_hash: hash,
    pista,
  });

  if (error) {
    console.error("[mcp] crear llave:", error.message);
    return { ok: false, error: "No pude crear la llave." };
  }

  revalidatePath("/admin/mcp");

  // La unica vez que la llave sale en claro. Despues solo queda el hash.
  return { ok: true, token };
}

export async function revocarLlaveMcp(id: string): Promise<ResultadoSimple> {
  const usuario = await requireAuth();

  const { error } = await createSupabaseServiceRole()
    .from("int_mcp_tokens")
    .update({ activo: false })
    .eq("id", id)
    // Que sea propia: sin esto, con el id de otro se le apaga la llave.
    .eq("admin_user_id", usuario.id);

  if (error) {
    console.error("[mcp] revocar llave:", error.message);
    return { ok: false, error: "No pude revocar la llave." };
  }

  revalidatePath("/admin/mcp");
  return { ok: true };
}
