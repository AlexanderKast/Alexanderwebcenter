"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import {
  armarFilaMovimiento,
  esquemaMovimiento,
  type DatosMovimiento,
} from "@/lib/proyectos/movimiento-form";
import { puedeEditarProyectos } from "@/lib/proyectos/permisos";
import { sincronizarMovimientos } from "@/lib/proyectos/sincronizar-movimientos";
import { createSupabaseServiceRole } from "@/lib/supabase/server";

export type ResultadoSync =
  | { ok: true; leidos: number; guardados: number; sinProyecto: string[] }
  | { ok: false; error: string };

export type ResultadoMovimiento =
  | { ok: true; id: string }
  | { ok: false; error: string };

export type ResultadoSimple = { ok: true } | { ok: false; error: string };

const SIN_PERMISO = "No tenés permiso para esta acción.";

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

/* ────────────────────────────────────────────────────────────
   Carga manual

   Lo que se carga acá queda con origen "panel" y una huella propia
   (panel:<uuid>), que nunca choca con una fila del Sheet. Así el
   importador puede correr las veces que quiera sin pisarlo.
   ──────────────────────────────────────────────────────────── */

function refrescar() {
  revalidatePath("/admin/finanzas");
  revalidatePath("/admin/proyectos");
}

/** Los nombres se guardan al lado de los ids porque el resumen agrupa por nombre. */
async function nombresDe(sociedadId: string, proyectoId: string) {
  const supabase = createSupabaseServiceRole();

  const [sociedad, proyecto] = await Promise.all([
    sociedadId
      ? supabase.from("int_sociedades").select("nombre").eq("id", sociedadId).maybeSingle()
      : Promise.resolve({ data: null }),
    proyectoId
      ? supabase.from("int_proyectos").select("nombre").eq("id", proyectoId).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  return {
    sociedadNombre: ((sociedad.data?.nombre as string) ?? "").trim(),
    proyectoNombre: ((proyecto.data?.nombre as string) ?? "").trim(),
  };
}

/** Una fila que vino del Sheet no se toca acá: el próximo sync la devuelve. */
async function exigirDelPanel(id: string): Promise<string | null> {
  const { data } = await createSupabaseServiceRole()
    .from("int_movimientos")
    .select("origen")
    .eq("id", id)
    .maybeSingle();

  if (!data) return "Ese movimiento ya no existe.";
  if (data.origen !== "panel") {
    return "Ese movimiento viene del Sheet. Corregilo allá y sincronizá.";
  }
  return null;
}

export async function crearMovimiento(
  datos: DatosMovimiento,
): Promise<ResultadoMovimiento> {
  const usuario = await requireAuth();
  if (!puedeEditarProyectos(usuario.role)) return { ok: false, error: SIN_PERMISO };

  const parseado = esquemaMovimiento.safeParse(datos);
  if (!parseado.success) {
    return { ok: false, error: parseado.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const armado = armarFilaMovimiento(
    parseado.data,
    await nombresDe(parseado.data.sociedadId, parseado.data.proyectoId),
  );
  if ("error" in armado) return { ok: false, error: armado.error };

  const { data, error } = await createSupabaseServiceRole()
    .from("int_movimientos")
    .insert({
      ...armado.fila,
      huella: `panel:${randomUUID()}`,
      creado_por: usuario.id,
      updated_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) {
    console.error("[movimientos] crear:", error.message);
    return { ok: false, error: "No pude guardar el movimiento." };
  }

  refrescar();
  return { ok: true, id: data.id as string };
}

export async function actualizarMovimiento(
  id: string,
  datos: DatosMovimiento,
): Promise<ResultadoMovimiento> {
  const usuario = await requireAuth();
  if (!puedeEditarProyectos(usuario.role)) return { ok: false, error: SIN_PERMISO };

  const parseado = esquemaMovimiento.safeParse(datos);
  if (!parseado.success) {
    return { ok: false, error: parseado.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const impedimento = await exigirDelPanel(id);
  if (impedimento) return { ok: false, error: impedimento };

  const armado = armarFilaMovimiento(
    parseado.data,
    await nombresDe(parseado.data.sociedadId, parseado.data.proyectoId),
  );
  if ("error" in armado) return { ok: false, error: armado.error };

  const { error } = await createSupabaseServiceRole()
    .from("int_movimientos")
    .update({ ...armado.fila, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("[movimientos] actualizar:", error.message);
    return { ok: false, error: "No pude guardar los cambios." };
  }

  refrescar();
  revalidatePath(`/admin/finanzas/${id}`);
  return { ok: true, id };
}

export async function eliminarMovimiento(id: string): Promise<ResultadoSimple> {
  const usuario = await requireAuth();
  if (!puedeEditarProyectos(usuario.role)) return { ok: false, error: SIN_PERMISO };

  const impedimento = await exigirDelPanel(id);
  if (impedimento) return { ok: false, error: impedimento };

  const supabase = createSupabaseServiceRole();

  // Las facturas se van con el movimiento. Primero los archivos: el borrado
  // en cascada de la tabla dejaría el bucket lleno de huérfanos.
  const { data: adjuntos } = await supabase
    .from("int_movimiento_adjuntos")
    .select("ruta")
    .eq("movimiento_id", id);

  const rutas = (adjuntos ?? []).map((a) => a.ruta as string);
  if (rutas.length > 0) {
    const { error } = await supabase.storage.from("facturas").remove(rutas);
    if (error) console.error("[movimientos] borrar facturas:", error.message);
  }

  const { error } = await supabase.from("int_movimientos").delete().eq("id", id);
  if (error) {
    console.error("[movimientos] eliminar:", error.message);
    return { ok: false, error: "No pude borrar el movimiento." };
  }

  refrescar();
  return { ok: true };
}

export async function eliminarAdjunto(adjuntoId: string): Promise<ResultadoSimple> {
  const usuario = await requireAuth();
  if (!puedeEditarProyectos(usuario.role)) return { ok: false, error: SIN_PERMISO };

  const supabase = createSupabaseServiceRole();

  const { data: adjunto } = await supabase
    .from("int_movimiento_adjuntos")
    .select("ruta, movimiento_id")
    .eq("id", adjuntoId)
    .maybeSingle();

  if (!adjunto) return { ok: false, error: "Esa factura ya no está." };

  const { error: errorArchivo } = await supabase.storage
    .from("facturas")
    .remove([adjunto.ruta as string]);
  if (errorArchivo) console.error("[movimientos] borrar factura:", errorArchivo.message);

  const { error } = await supabase
    .from("int_movimiento_adjuntos")
    .delete()
    .eq("id", adjuntoId);

  if (error) {
    console.error("[movimientos] eliminar adjunto:", error.message);
    return { ok: false, error: "No pude borrar la factura." };
  }

  revalidatePath(`/admin/finanzas/${adjunto.movimiento_id as string}`);
  return { ok: true };
}
