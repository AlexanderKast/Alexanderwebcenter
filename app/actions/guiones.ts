"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { esquemaGuion, type DatosGuion } from "@/lib/guiones/tipos";
import { puedeEditarProyectos } from "@/lib/proyectos/permisos";
import { createSupabaseServiceRole } from "@/lib/supabase/server";

/**
 * Alta, edicion y borrado de guiones.
 *
 * El tester puede leer la biblioteca pero no escribirla, igual que en
 * proyectos: es alguien de afuera mirando.
 */

export type ResultadoGuion = { ok: true; id: string } | { ok: false; error: string };
export type ResultadoBorrado = { ok: true } | { ok: false; error: string };

const SIN_PERMISO = "No tenés permiso para esta acción.";

function refrescar(id?: string) {
  revalidatePath("/admin/guiones");
  if (id) revalidatePath(`/admin/guiones/${id}`);
}

export async function crearGuion(datos: DatosGuion): Promise<ResultadoGuion> {
  const usuario = await requireAuth();
  if (!puedeEditarProyectos(usuario.role)) return { ok: false, error: SIN_PERMISO };

  const parseado = esquemaGuion.safeParse(datos);
  if (!parseado.success) {
    return { ok: false, error: parseado.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const { data, error } = await createSupabaseServiceRole()
    .from("int_guiones")
    .insert({ ...parseado.data, autor_id: usuario.id })
    .select("id")
    .single();

  if (error) {
    console.error("[guiones] crear:", error.message);
    return { ok: false, error: "No pude guardar el guión." };
  }

  refrescar();
  return { ok: true, id: data.id as string };
}

export async function actualizarGuion(
  id: string,
  datos: DatosGuion,
): Promise<ResultadoGuion> {
  const usuario = await requireAuth();
  if (!puedeEditarProyectos(usuario.role)) return { ok: false, error: SIN_PERMISO };

  const parseado = esquemaGuion.safeParse(datos);
  if (!parseado.success) {
    return { ok: false, error: parseado.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const { error } = await createSupabaseServiceRole()
    .from("int_guiones")
    .update({ ...parseado.data, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("[guiones] actualizar:", error.message);
    return { ok: false, error: "No pude guardar los cambios." };
  }

  refrescar(id);
  return { ok: true, id };
}

export async function eliminarGuion(id: string): Promise<ResultadoBorrado> {
  const usuario = await requireAuth();
  if (!puedeEditarProyectos(usuario.role)) return { ok: false, error: SIN_PERMISO };

  const { error } = await createSupabaseServiceRole()
    .from("int_guiones")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[guiones] eliminar:", error.message);
    return { ok: false, error: "No pude borrar el guión." };
  }

  refrescar();
  return { ok: true };
}
