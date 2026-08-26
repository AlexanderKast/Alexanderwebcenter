import "server-only";
import { createSupabaseServiceRole } from "@/lib/supabase/server";
import type { EstadoGuion, Guion } from "./tipos";

/**
 * Lectura de la biblioteca de guiones.
 *
 * Entra por service role, igual que el resto de las tablas int_: el permiso
 * lo pone requireAuth, no la base.
 */

interface FilaGuion {
  id: string;
  titulo: string;
  pilar: string;
  plataforma: string;
  formato: string;
  estado: EstadoGuion;
  gancho: string;
  cuerpo: string;
  notas: string;
  link: string;
  created_at: string;
  updated_at: string;
  autor: { full_name: string | null } | null;
}

const CAMPOS =
  "id, titulo, pilar, plataforma, formato, estado, gancho, cuerpo, notas, link, created_at, updated_at, autor:admin_users(full_name)";

function mapear(f: FilaGuion): Guion {
  return {
    id: f.id,
    titulo: f.titulo,
    pilar: f.pilar,
    plataforma: f.plataforma,
    formato: f.formato,
    estado: f.estado,
    gancho: f.gancho,
    cuerpo: f.cuerpo,
    notas: f.notas,
    link: f.link,
    autorNombre: f.autor?.full_name ?? null,
    createdAt: f.created_at,
    updatedAt: f.updated_at,
  };
}

export interface FiltrosGuiones {
  pilar?: string;
  plataforma?: string;
  estado?: string;
}

export async function listarGuiones(filtros: FiltrosGuiones = {}): Promise<Guion[]> {
  const supabase = createSupabaseServiceRole();

  let consulta = supabase
    .from("int_guiones")
    .select(CAMPOS)
    .order("updated_at", { ascending: false })
    .limit(500);

  if (filtros.pilar) consulta = consulta.eq("pilar", filtros.pilar);
  if (filtros.plataforma) consulta = consulta.eq("plataforma", filtros.plataforma);
  if (filtros.estado) consulta = consulta.eq("estado", filtros.estado);

  const { data, error } = await consulta;

  if (error) {
    console.error("[guiones] listar:", error.message);
    return [];
  }

  return ((data as unknown as FilaGuion[] | null) ?? []).map(mapear);
}

export async function obtenerGuion(id: string): Promise<Guion | null> {
  const supabase = createSupabaseServiceRole();
  const { data, error } = await supabase
    .from("int_guiones")
    .select(CAMPOS)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("[guiones] obtener:", error.message);
    return null;
  }

  return mapear(data as unknown as FilaGuion);
}
