"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAuth } from "@/lib/auth";
import { registrarActividad } from "@/lib/proyectos/actividad";
import { puedeEditarProyectos } from "@/lib/proyectos/permisos";
import { ESTADOS_COMERCIALES } from "@/lib/proyectos/types";
import { createSupabaseServiceRole } from "@/lib/supabase/server";

export type ResultadoAccion = { ok: true } | { ok: false; error: string };

const SIN_PERMISO = "No tenés permiso para esta acción.";

const esquemaProyecto = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio.").max(200),
  cliente: z.string().trim().max(200).optional().or(z.literal("")),
  sociedadId: z.string().uuid().optional().or(z.literal("")),
  responsableId: z.string().uuid().optional().or(z.literal("")),
  estadoComercial: z.enum(ESTADOS_COMERCIALES),
  columnaId: z.string().uuid(),
  fechaInicio: z.string().optional().or(z.literal("")),
  fechaCierreEst: z.string().optional().or(z.literal("")),
  pptoIngresos: z.string().optional().or(z.literal("")),
  pptoGastos: z.string().optional().or(z.literal("")),
  notas: z.string().trim().max(4000).optional().or(z.literal("")),
});

function opcional(valor: string | undefined): string | null {
  const texto = (valor ?? "").trim();
  return texto === "" ? null : texto;
}

function numeroOpcional(valor: string | undefined): number | null {
  const texto = (valor ?? "").trim();
  if (texto === "") return null;
  const numero = Number(texto.replace(/[^\d.-]/g, ""));
  return Number.isFinite(numero) ? numero : null;
}

/**
 * Mueve una tarjeta de columna. El KanbanBoard solo mueve entre columnas,
 * nunca reordena dentro de una, asi que la tarjeta cae al final del destino.
 */
export async function moverProyecto(
  proyectoId: string,
  columnaId: string,
): Promise<ResultadoAccion> {
  const usuario = await requireAuth();
  if (!puedeEditarProyectos(usuario.role)) return { ok: false, error: SIN_PERMISO };

  const supabase = createSupabaseServiceRole();

  const { data: actual, error: errorLectura } = await supabase
    .from("int_proyectos")
    .select("columna_id")
    .eq("id", proyectoId)
    .maybeSingle();

  if (errorLectura || !actual) {
    return { ok: false, error: "No encontré ese proyecto." };
  }

  const { data: ultimos } = await supabase
    .from("int_proyectos")
    .select("orden")
    .eq("columna_id", columnaId)
    .order("orden", { ascending: false })
    .limit(1);

  const nuevoOrden = ((ultimos?.[0]?.orden as number | undefined) ?? 0) + 1;

  const { error } = await supabase
    .from("int_proyectos")
    .update({
      columna_id: columnaId,
      orden: nuevoOrden,
      updated_at: new Date().toISOString(),
    })
    .eq("id", proyectoId);

  if (error) {
    console.error("[proyectos] moverProyecto:", error.message);
    return { ok: false, error: "No pude mover el proyecto." };
  }

  await registrarActividad({
    proyectoId,
    actorId: usuario.id,
    accion: "proyecto_movido",
    detalle: { desde: actual.columna_id, hacia: columnaId },
  });

  revalidatePath("/admin/proyectos");
  return { ok: true };
}

export async function crearProyecto(formData: FormData): Promise<ResultadoAccion> {
  const usuario = await requireAuth();
  if (!puedeEditarProyectos(usuario.role)) return { ok: false, error: SIN_PERMISO };

  const parsed = esquemaProyecto.safeParse({
    nombre: formData.get("nombre") ?? "",
    cliente: formData.get("cliente") ?? "",
    sociedadId: formData.get("sociedadId") ?? "",
    responsableId: formData.get("responsableId") ?? "",
    estadoComercial: formData.get("estadoComercial") ?? "Prospecto",
    columnaId: formData.get("columnaId") ?? "",
    fechaInicio: formData.get("fechaInicio") ?? "",
    fechaCierreEst: formData.get("fechaCierreEst") ?? "",
    pptoIngresos: formData.get("pptoIngresos") ?? "",
    pptoGastos: formData.get("pptoGastos") ?? "",
    notas: formData.get("notas") ?? "",
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const v = parsed.data;
  const supabase = createSupabaseServiceRole();

  const { data, error } = await supabase
    .from("int_proyectos")
    .insert({
      nombre: v.nombre,
      cliente: opcional(v.cliente),
      sociedad_id: opcional(v.sociedadId),
      responsable_id: opcional(v.responsableId),
      estado_comercial: v.estadoComercial,
      columna_id: v.columnaId,
      fecha_inicio: opcional(v.fechaInicio),
      fecha_cierre_est: opcional(v.fechaCierreEst),
      ppto_ingresos: numeroOpcional(v.pptoIngresos),
      ppto_gastos: numeroOpcional(v.pptoGastos),
      notas: opcional(v.notas),
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("[proyectos] crearProyecto:", error?.message);
    if (error?.code === "23505") {
      return { ok: false, error: "Ya existe un proyecto con ese nombre en esa sociedad." };
    }
    return { ok: false, error: "No pude crear el proyecto." };
  }

  await registrarActividad({
    proyectoId: data.id as string,
    actorId: usuario.id,
    accion: "proyecto_creado",
    detalle: { nombre: v.nombre },
  });

  revalidatePath("/admin/proyectos");
  return { ok: true };
}

export async function actualizarProyecto(
  formData: FormData,
): Promise<ResultadoAccion> {
  const usuario = await requireAuth();
  if (!puedeEditarProyectos(usuario.role)) return { ok: false, error: SIN_PERMISO };

  const proyectoId = String(formData.get("proyectoId") ?? "");
  if (!proyectoId) return { ok: false, error: "Falta el proyecto." };

  const parsed = esquemaProyecto.safeParse({
    nombre: formData.get("nombre") ?? "",
    cliente: formData.get("cliente") ?? "",
    sociedadId: formData.get("sociedadId") ?? "",
    responsableId: formData.get("responsableId") ?? "",
    estadoComercial: formData.get("estadoComercial") ?? "Prospecto",
    columnaId: formData.get("columnaId") ?? "",
    fechaInicio: formData.get("fechaInicio") ?? "",
    fechaCierreEst: formData.get("fechaCierreEst") ?? "",
    pptoIngresos: formData.get("pptoIngresos") ?? "",
    pptoGastos: formData.get("pptoGastos") ?? "",
    notas: formData.get("notas") ?? "",
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const v = parsed.data;
  const supabase = createSupabaseServiceRole();

  const { data: antes } = await supabase
    .from("int_proyectos")
    .select("responsable_id, estado_comercial")
    .eq("id", proyectoId)
    .maybeSingle();

  const { error } = await supabase
    .from("int_proyectos")
    .update({
      nombre: v.nombre,
      cliente: opcional(v.cliente),
      sociedad_id: opcional(v.sociedadId),
      responsable_id: opcional(v.responsableId),
      estado_comercial: v.estadoComercial,
      columna_id: v.columnaId,
      fecha_inicio: opcional(v.fechaInicio),
      fecha_cierre_est: opcional(v.fechaCierreEst),
      ppto_ingresos: numeroOpcional(v.pptoIngresos),
      ppto_gastos: numeroOpcional(v.pptoGastos),
      notas: opcional(v.notas),
      updated_at: new Date().toISOString(),
    })
    .eq("id", proyectoId);

  if (error) {
    console.error("[proyectos] actualizarProyecto:", error.message);
    return { ok: false, error: "No pude guardar los cambios." };
  }

  await registrarActividad({
    proyectoId,
    actorId: usuario.id,
    accion: "proyecto_editado",
  });

  const nuevoResponsable = opcional(v.responsableId);
  if (antes && antes.responsable_id !== nuevoResponsable) {
    await registrarActividad({
      proyectoId,
      actorId: usuario.id,
      accion: "responsable_asignado",
      detalle: { desde: antes.responsable_id, hacia: nuevoResponsable },
    });
  }

  if (antes && antes.estado_comercial !== v.estadoComercial) {
    await registrarActividad({
      proyectoId,
      actorId: usuario.id,
      accion: "estado_comercial_cambiado",
      detalle: { desde: antes.estado_comercial, hacia: v.estadoComercial },
    });
  }

  revalidatePath("/admin/proyectos");
  revalidatePath(`/admin/proyectos/${proyectoId}`);
  return { ok: true };
}

export async function archivarProyecto(
  proyectoId: string,
): Promise<ResultadoAccion> {
  const usuario = await requireAuth();
  if (!puedeEditarProyectos(usuario.role)) return { ok: false, error: SIN_PERMISO };

  const supabase = createSupabaseServiceRole();
  const { error } = await supabase
    .from("int_proyectos")
    .update({ archivado: true, updated_at: new Date().toISOString() })
    .eq("id", proyectoId);

  if (error) {
    console.error("[proyectos] archivarProyecto:", error.message);
    return { ok: false, error: "No pude archivar el proyecto." };
  }

  await registrarActividad({
    proyectoId,
    actorId: usuario.id,
    accion: "proyecto_archivado",
  });

  revalidatePath("/admin/proyectos");
  return { ok: true };
}
