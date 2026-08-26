"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { puedeEditarProyectos } from "@/lib/proyectos/permisos";
import { sincronizarMovimientos } from "@/lib/proyectos/sincronizar-movimientos";
import { createSupabaseServiceRole } from "@/lib/supabase/server";

export type ResultadoSync =
  | { ok: true; leidos: number; guardados: number; sinProyecto: string[] }
  | { ok: false; error: string };

/**
 * Vuelve a leer la hoja de movimientos del Sheet y deja la base igual.
 *
 * El Sheet sigue siendo donde se anota la plata; esto solo la trae para que
 * el tablero pueda mostrarla sin depender de que Google responda.
 */
export async function sincronizarGastos(): Promise<ResultadoSync> {
  const usuario = await requireAuth();
  if (!puedeEditarProyectos(usuario.role)) {
    return { ok: false, error: "No tenés permiso para esta acción." };
  }

  try {
    const resultado = await sincronizarMovimientos(createSupabaseServiceRole());

    revalidatePath("/admin/proyectos");
    revalidatePath("/admin/finanzas");

    return {
      ok: true,
      leidos: resultado.leidos,
      guardados: resultado.guardados,
      sinProyecto: resultado.sinProyecto,
    };
  } catch (error) {
    const detalle = error instanceof Error ? error.message : "error desconocido";
    console.error("[movimientos] sincronizar:", detalle);
    return { ok: false, error: detalle };
  }
}
