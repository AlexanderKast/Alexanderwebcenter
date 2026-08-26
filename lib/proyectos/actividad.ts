import "server-only";
import { createSupabaseServiceRole } from "@/lib/supabase/server";

export const ACCIONES = [
  "proyecto_creado",
  "proyecto_movido",
  "proyecto_editado",
  "proyecto_archivado",
  "responsable_asignado",
  "estado_comercial_cambiado",
] as const;

export type Accion = (typeof ACCIONES)[number];

export interface RegistrarActividadParams {
  proyectoId: string;
  actorId: string | null;
  accion: Accion;
  detalle?: Record<string, unknown>;
}

/**
 * Deja rastro de lo que pasa con un proyecto. De aca salen las estadisticas
 * de ciclo. Nunca lanza: que falle el log no puede tumbar la accion.
 */
export async function registrarActividad(
  params: RegistrarActividadParams,
): Promise<void> {
  try {
    const supabase = createSupabaseServiceRole();
    const { error } = await supabase.from("int_proyecto_actividad").insert({
      proyecto_id: params.proyectoId,
      actor_id: params.actorId,
      accion: params.accion,
      detalle: params.detalle ?? {},
    });
    if (error) console.error("[int-actividad] insert fallo:", error.message);
  } catch (err) {
    console.error("[int-actividad] excepcion:", err);
  }
}
