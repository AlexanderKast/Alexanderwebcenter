"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { ResultadoAccion } from "@/app/actions/proyectos";
import { requireAuth } from "@/lib/auth";
import { puedeGestionarConfiguracion } from "@/lib/proyectos/permisos";
import { createSupabaseServiceRole } from "@/lib/supabase/server";

const SIN_PERMISO = "Solo los founders y managers pueden tocar las columnas.";

function revalidar() {
  revalidatePath("/admin/proyectos");
  revalidatePath("/admin/proyectos/columnas");
}

const esquemaColumna = z.object({
  nombre: z.string().trim().min(1, "Poné un nombre.").max(60),
  color: z.string().trim().max(120),
});

export async function crearColumna(formData: FormData): Promise<ResultadoAccion> {
  const usuario = await requireAuth();
  if (!puedeGestionarConfiguracion(usuario.role))
    return { ok: false, error: SIN_PERMISO };

  const parsed = esquemaColumna.safeParse({
    nombre: formData.get("nombre") ?? "",
    color: formData.get("color") ?? "bg-white/10 text-white/60",
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const supabase = createSupabaseServiceRole();

  const { data: ultimas } = await supabase
    .from("int_kanban_columnas")
    .select("orden")
    .order("orden", { ascending: false })
    .limit(1);

  const { error } = await supabase.from("int_kanban_columnas").insert({
    nombre: parsed.data.nombre,
    color: parsed.data.color || "bg-white/10 text-white/60",
    orden: ((ultimas?.[0]?.orden as number | undefined) ?? 0) + 1,
  });

  if (error) {
    console.error("[columnas] crearColumna:", error.message);
    return { ok: false, error: "No pude crear la columna." };
  }

  revalidar();
  return { ok: true };
}

export async function renombrarColumna(
  formData: FormData,
): Promise<ResultadoAccion> {
  const usuario = await requireAuth();
  if (!puedeGestionarConfiguracion(usuario.role))
    return { ok: false, error: SIN_PERMISO };

  const columnaId = String(formData.get("columnaId") ?? "");
  if (!columnaId) return { ok: false, error: "Falta la columna." };

  const parsed = esquemaColumna.safeParse({
    nombre: formData.get("nombre") ?? "",
    color: formData.get("color") ?? "",
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const supabase = createSupabaseServiceRole();
  const { error } = await supabase
    .from("int_kanban_columnas")
    .update({ nombre: parsed.data.nombre, color: parsed.data.color })
    .eq("id", columnaId);

  if (error) {
    console.error("[columnas] renombrarColumna:", error.message);
    return { ok: false, error: "No pude renombrar la columna." };
  }

  revalidar();
  return { ok: true };
}

/**
 * Una columna con proyectos adentro no se borra: primero hay que moverlos.
 * Tampoco se puede quedar el tablero sin columna inicial ni sin final.
 */
export async function borrarColumna(columnaId: string): Promise<ResultadoAccion> {
  const usuario = await requireAuth();
  if (!puedeGestionarConfiguracion(usuario.role))
    return { ok: false, error: SIN_PERMISO };

  const supabase = createSupabaseServiceRole();

  const { count } = await supabase
    .from("int_proyectos")
    .select("id", { count: "exact", head: true })
    .eq("columna_id", columnaId);

  if ((count ?? 0) > 0) {
    return {
      ok: false,
      error: `Esa columna tiene ${count} proyecto(s). Movelos antes de borrarla.`,
    };
  }

  const { data: columnas } = await supabase
    .from("int_kanban_columnas")
    .select("id, es_inicial, es_final");

  const objetivo = columnas?.find((c) => c.id === columnaId);
  if (!objetivo) return { ok: false, error: "No encontré esa columna." };

  if (objetivo.es_inicial && (columnas ?? []).filter((c) => c.es_inicial).length <= 1) {
    return { ok: false, error: "Tiene que quedar al menos una columna inicial." };
  }

  if (objetivo.es_final && (columnas ?? []).filter((c) => c.es_final).length <= 1) {
    return { ok: false, error: "Tiene que quedar al menos una columna final." };
  }

  const { error } = await supabase
    .from("int_kanban_columnas")
    .delete()
    .eq("id", columnaId);

  if (error) {
    console.error("[columnas] borrarColumna:", error.message);
    return { ok: false, error: "No pude borrar la columna." };
  }

  revalidar();
  return { ok: true };
}

export async function moverColumna(
  columnaId: string,
  direccion: "arriba" | "abajo",
): Promise<ResultadoAccion> {
  const usuario = await requireAuth();
  if (!puedeGestionarConfiguracion(usuario.role))
    return { ok: false, error: SIN_PERMISO };

  const supabase = createSupabaseServiceRole();
  const { data: columnas } = await supabase
    .from("int_kanban_columnas")
    .select("id, orden")
    .order("orden", { ascending: true });

  if (!columnas) return { ok: false, error: "No pude leer las columnas." };

  const indice = columnas.findIndex((c) => c.id === columnaId);
  const vecino = direccion === "arriba" ? indice - 1 : indice + 1;

  if (indice === -1 || vecino < 0 || vecino >= columnas.length) {
    return { ok: false, error: "Esa columna ya está en el borde." };
  }

  const a = columnas[indice];
  const b = columnas[vecino];

  const { error } = await supabase.from("int_kanban_columnas").upsert([
    { id: a.id, orden: b.orden },
    { id: b.id, orden: a.orden },
  ]);

  if (error) {
    console.error("[columnas] moverColumna:", error.message);
    return { ok: false, error: "No pude reordenar." };
  }

  revalidar();
  return { ok: true };
}
