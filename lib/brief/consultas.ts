import "server-only";
import { createSupabaseServiceRole } from "@/lib/supabase/server";

/**
 * Lectura de las respuestas del formulario para el panel.
 *
 * Entra por service role, igual que las consultas de proyectos: las tablas
 * brief_* tienen RLS y el control de acceso lo hace requireAuth, no la base.
 */

export interface EnvioBrief {
  id: string;
  cliente: string;
  marca: string;
  sector: string;
  contactoNombre: string;
  contactoEmail: string;
  contactoTel: string;
  empresa: string;
  completadoPct: number;
  respondidas: number;
  totalCampos: number;
  estado: string;
  createdAt: string;
}

interface FilaEnvio {
  id: string;
  cliente: string;
  marca: string;
  sector: string;
  contacto_nombre: string;
  contacto_email: string;
  contacto_tel: string;
  empresa: string;
  completado_pct: number;
  respondidas: number;
  total_campos: number;
  estado: string;
  created_at: string;
}

const CAMPOS =
  "id, cliente, marca, sector, contacto_nombre, contacto_email, contacto_tel, empresa, completado_pct, respondidas, total_campos, estado, created_at";

function mapear(fila: FilaEnvio): EnvioBrief {
  return {
    id: fila.id,
    cliente: fila.cliente,
    marca: fila.marca,
    sector: fila.sector,
    contactoNombre: fila.contacto_nombre,
    contactoEmail: fila.contacto_email,
    contactoTel: fila.contacto_tel,
    empresa: fila.empresa,
    completadoPct: fila.completado_pct,
    respondidas: fila.respondidas,
    totalCampos: fila.total_campos,
    estado: fila.estado,
    createdAt: fila.created_at,
  };
}

export async function listarEnvios(limite = 100): Promise<EnvioBrief[]> {
  const supabase = createSupabaseServiceRole();
  const { data, error } = await supabase
    .from("brief_submissions")
    .select(CAMPOS)
    .order("created_at", { ascending: false })
    .limit(limite);

  if (error) {
    console.error("[brief] listarEnvios:", error.message);
    return [];
  }

  return (data as FilaEnvio[] | null ?? []).map(mapear);
}

export async function obtenerEnvio(id: string): Promise<EnvioBrief | null> {
  const supabase = createSupabaseServiceRole();
  const { data, error } = await supabase
    .from("brief_submissions")
    .select(CAMPOS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[brief] obtenerEnvio:", error.message);
    return null;
  }

  return data ? mapear(data as FilaEnvio) : null;
}

/**
 * Respuestas de un envio, indexadas por campo. Las vacias se descartan:
 * el panel las dibuja como "sin responder" a partir del cuestionario.
 */
export async function respuestasDe(id: string): Promise<Map<string, string>> {
  const supabase = createSupabaseServiceRole();
  const { data, error } = await supabase
    .from("brief_answers")
    .select("campo_id, valor")
    .eq("submission_id", id);

  if (error) {
    console.error("[brief] respuestasDe:", error.message);
    return new Map();
  }

  const salida = new Map<string, string>();
  for (const fila of (data ?? []) as { campo_id: string; valor: string }[]) {
    if (fila.valor.trim() !== "") salida.set(fila.campo_id, fila.valor);
  }
  return salida;
}
