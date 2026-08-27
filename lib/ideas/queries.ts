import "server-only";
import { createSupabaseServiceRole } from "@/lib/supabase/server";
import type { EstadoIdea, Idea, OrigenIdea } from "./tipos";

/**
 * Lectura de la bandeja de ideas.
 *
 * Entra por service role, igual que el resto de las tablas int_: el permiso
 * lo pone requireAuth, no la base.
 */

interface FilaIdea {
  id: string;
  titulo: string;
  resumen: string;
  transcripcion: string;
  tags: string[] | null;
  estado: EstadoIdea;
  origen: OrigenIdea;
  proyecto_id: string | null;
  audio_path: string;
  audio_seg: number;
  autor_id: string | null;
  autor_nombre: string;
  notas: string;
  created_at: string;
  updated_at: string;
  proyecto: { nombre: string | null } | null;
}

const CAMPOS =
  "id, titulo, resumen, transcripcion, tags, estado, origen, proyecto_id, audio_path, audio_seg, autor_id, autor_nombre, notas, created_at, updated_at, proyecto:int_proyectos(nombre)";

function mapear(f: FilaIdea): Idea {
  return {
    id: f.id,
    titulo: f.titulo,
    resumen: f.resumen,
    transcripcion: f.transcripcion,
    tags: f.tags ?? [],
    estado: f.estado,
    origen: f.origen,
    proyectoId: f.proyecto_id,
    proyectoNombre: f.proyecto?.nombre ?? null,
    audioPath: f.audio_path,
    audioSeg: f.audio_seg,
    autorId: f.autor_id,
    autorNombre: f.autor_nombre,
    notas: f.notas,
    createdAt: f.created_at,
    updatedAt: f.updated_at,
  };
}

export interface FiltrosIdeas {
  estado?: string;
  origen?: string;
  proyectoId?: string;
}

export async function listarIdeas(filtros: FiltrosIdeas = {}): Promise<Idea[]> {
  const supabase = createSupabaseServiceRole();

  let consulta = supabase
    .from("int_ideas")
    .select(CAMPOS)
    // Por fecha de entrada, no de edicion: una bandeja se lee por lo que
    // acaba de caer, no por lo que alguien toco al pasar.
    .order("created_at", { ascending: false })
    .limit(500);

  if (filtros.estado) consulta = consulta.eq("estado", filtros.estado);
  if (filtros.origen) consulta = consulta.eq("origen", filtros.origen);
  if (filtros.proyectoId) consulta = consulta.eq("proyecto_id", filtros.proyectoId);

  const { data, error } = await consulta;

  if (error) {
    console.error("[ideas] listar:", error.message);
    return [];
  }

  return ((data as unknown as FilaIdea[] | null) ?? []).map(mapear);
}

export async function obtenerIdea(id: string): Promise<Idea | null> {
  const supabase = createSupabaseServiceRole();
  const { data, error } = await supabase
    .from("int_ideas")
    .select(CAMPOS)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("[ideas] obtener:", error.message);
    return null;
  }

  return mapear(data as unknown as FilaIdea);
}

/**
 * Enlace firmado al audio original. El bucket es privado: nadie llega a una
 * nota de voz por URL. Caduca en una hora, que es todo lo que dura abrir la
 * idea y escucharla.
 */
export async function enlaceAudio(audioPath: string): Promise<string | null> {
  if (!audioPath) return null;

  const { data, error } = await createSupabaseServiceRole()
    .storage.from("ideas-audio")
    .createSignedUrl(audioPath, 60 * 60);

  if (error || !data) {
    if (error) console.error("[ideas] enlace audio:", error.message);
    return null;
  }

  return data.signedUrl;
}

export interface RespuestaIdea {
  id: string;
  texto: string;
  adminNombre: string;
  estadoAlResponder: string;
  entregado: boolean;
  error: string;
  createdAt: string;
}

/** Lo que ya se le contestó a quien mandó la idea, de lo viejo a lo nuevo. */
export async function listarRespuestas(ideaId: string): Promise<RespuestaIdea[]> {
  const { data, error } = await createSupabaseServiceRole()
    .from("int_idea_respuestas")
    .select("id, texto, admin_nombre, estado_al_responder, entregado, error, created_at")
    .eq("idea_id", ideaId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[ideas] listar respuestas:", error.message);
    return [];
  }

  return (data ?? []).map((f) => ({
    id: f.id as string,
    texto: f.texto as string,
    adminNombre: f.admin_nombre as string,
    estadoAlResponder: f.estado_al_responder as string,
    entregado: f.entregado as boolean,
    error: f.error as string,
    createdAt: f.created_at as string,
  }));
}

/**
 * A donde contestarle. Es null si la idea se escribió en el panel: no hay
 * ningún chat de Telegram al otro lado.
 */
export async function chatDeIdea(ideaId: string): Promise<number | null> {
  const { data } = await createSupabaseServiceRole()
    .from("int_ideas")
    .select("telegram_chat_id")
    .eq("id", ideaId)
    .maybeSingle();

  return (data?.telegram_chat_id as number | null) ?? null;
}

export interface CodigoInvitacion {
  id: string;
  codigo: string;
  nota: string;
  usos: number;
  usosMax: number;
  expiraAt: string | null;
  activo: boolean;
  createdAt: string;
  asignadoA: string | null;
}

interface FilaCodigo {
  id: string;
  codigo: string;
  nota: string;
  usos: number;
  usos_max: number;
  expira_at: string | null;
  activo: boolean;
  created_at: string;
  asignado: { full_name: string | null } | null;
}

export async function listarCodigos(): Promise<CodigoInvitacion[]> {
  const { data, error } = await createSupabaseServiceRole()
    .from("int_telegram_codigos")
    .select(
      "id, codigo, nota, usos, usos_max, expira_at, activo, created_at, asignado:admin_users!int_telegram_codigos_admin_user_id_fkey(full_name)",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("[ideas] listar codigos:", error.message);
    return [];
  }

  return ((data as unknown as FilaCodigo[] | null) ?? []).map((f) => ({
    id: f.id,
    codigo: f.codigo,
    nota: f.nota,
    usos: f.usos,
    usosMax: f.usos_max,
    expiraAt: f.expira_at,
    activo: f.activo,
    createdAt: f.created_at,
    asignadoA: f.asignado?.full_name ?? null,
  }));
}
