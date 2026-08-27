import "server-only";
import { createSupabaseServiceRole } from "@/lib/supabase/server";
import { nombreDe, type UsuarioMcp } from "./auth";

/**
 * La pregunta de la puerta y el pulso de lo que se esta haciendo.
 *
 * La pregunta: no todo lo que se abre con Claude es de la empresa. Hay
 * proyectos personales y hay cosas internas que no se publican. Entonces el
 * MCP arranca mudo para escribir: hasta que no hay un "si, esto es de
 * trabajo" guardado, cualquier herramienta que toque el panel contesta que
 * primero hay que confirmarlo. Leer si se puede: mirar el tablero desde un
 * proyecto personal no ensucia nada.
 *
 * El pulso: cada cosa que el MCP hace queda anotada mientras pasa, para que
 * quien tenga el panel abierto la vea aparecer en vivo y sepa que no se
 * movio sola.
 */

const HORAS_DE_SESION = 8;

export interface SesionMcp {
  id: string;
  workspace: string;
  esTrabajo: boolean;
  expiraAt: string;
}

/** La ultima sesion viva de esta llave, si la hay. */
export async function sesionActiva(tokenId: string): Promise<SesionMcp | null> {
  const supabase = createSupabaseServiceRole();

  const { data, error } = await supabase
    .from("int_mcp_sesiones")
    .select("id, workspace, es_trabajo, expira_at")
    .eq("token_id", tokenId)
    .gt("expira_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id as string,
    workspace: (data.workspace as string) ?? "",
    esTrabajo: Boolean(data.es_trabajo),
    expiraAt: data.expira_at as string,
  };
}

/**
 * Guarda la respuesta. Se puede volver a llamar: si el proyecto cambia a
 * mitad de la tarde, la ultima respuesta manda.
 */
export async function abrirSesion(
  usuario: UsuarioMcp,
  workspace: string,
  esTrabajo: boolean,
): Promise<SesionMcp | null> {
  const supabase = createSupabaseServiceRole();
  const expira = new Date(Date.now() + HORAS_DE_SESION * 3600_000).toISOString();

  const { data, error } = await supabase
    .from("int_mcp_sesiones")
    .insert({
      token_id: usuario.tokenId,
      workspace: workspace.slice(0, 200),
      es_trabajo: esTrabajo,
      expira_at: expira,
    })
    .select("id, workspace, es_trabajo, expira_at")
    .single();

  if (error || !data) {
    console.error("[mcp] abrir_sesion:", error?.message);
    return null;
  }

  return {
    id: data.id as string,
    workspace: (data.workspace as string) ?? "",
    esTrabajo: Boolean(data.es_trabajo),
    expiraAt: data.expira_at as string,
  };
}

/** Lo que contesta una herramienta de escritura cuando falta la respuesta. */
export function motivoDelBloqueo(sesion: SesionMcp | null): string | null {
  if (!sesion) {
    return [
      "Antes de escribir algo en la plataforma tengo que saber de dónde vengo.",
      "",
      "Preguntale al usuario: ¿este proyecto es de trabajo, de los que van al panel?",
      "Con la respuesta llamá a `abrir_sesion` (workspace = el nombre de la carpeta o del repo,",
      "es_de_trabajo = true o false). Si dice que no, no publico nada y no hay que insistir.",
    ].join("\n");
  }

  if (!sesion.esTrabajo) {
    return `"${sesion.workspace || "Este proyecto"}" quedó marcado como proyecto que no es de trabajo, así que no lo publico en la plataforma. Si me equivoqué, volvé a llamar a \`abrir_sesion\` con es_de_trabajo=true.`;
  }

  return null;
}

/**
 * Anota que el MCP esta haciendo algo. Devuelve el id para poder cerrarlo
 * despues con como salio.
 *
 * No se espera a que termine: el cartelito del panel no puede frenar la
 * herramienta que lo genera.
 */
export async function registrarActividad(
  usuario: UsuarioMcp,
  herramienta: string,
  descripcion: string,
  recurso?: { tipo: string; id: string },
): Promise<string | null> {
  const supabase = createSupabaseServiceRole();

  const { data, error } = await supabase
    .from("int_mcp_actividad")
    .insert({
      token_id: usuario.tokenId,
      admin_user_id: usuario.id,
      admin_nombre: nombreDe(usuario),
      herramienta,
      descripcion: descripcion.slice(0, 300),
      recurso_tipo: recurso?.tipo ?? "",
      recurso_id: recurso?.id ?? "",
      estado: "trabajando",
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("[mcp] actividad:", error?.message);
    return null;
  }

  return data.id as string;
}

export async function cerrarActividad(
  id: string | null,
  estado: "listo" | "error",
  descripcion?: string,
  recurso?: { tipo: string; id: string },
): Promise<void> {
  if (!id) return;
  const supabase = createSupabaseServiceRole();

  const cambios: Record<string, unknown> = {
    estado,
    updated_at: new Date().toISOString(),
  };
  if (descripcion) cambios.descripcion = descripcion.slice(0, 300);
  // Recien al terminar se sabe a que fila del panel le pego: los nombres
  // que llegan hablando ("moveme Kreoon") se resuelven adentro.
  if (recurso) {
    cambios.recurso_tipo = recurso.tipo;
    cambios.recurso_id = recurso.id;
  }

  const { error } = await supabase
    .from("int_mcp_actividad")
    .update(cambios)
    .eq("id", id);

  if (error) console.error("[mcp] cerrar actividad:", error.message);
}

/**
 * Borra el aviso.
 *
 * Se usa cuando la herramienta no llego a cambiar nada: pidieron mover a
 * una columna que no existe, el nombre del proyecto era ambiguo, faltaba un
 * dato. Eso es una conversacion entre el modelo y quien le habla, no algo
 * que el resto del equipo tenga que ver aparecer en su pantalla.
 */
export async function descartarActividad(id: string | null): Promise<void> {
  if (!id) return;
  const supabase = createSupabaseServiceRole();
  const { error } = await supabase.from("int_mcp_actividad").delete().eq("id", id);
  if (error) console.error("[mcp] descartar actividad:", error.message);
}

export interface ActividadViva {
  id: string;
  quien: string;
  herramienta: string;
  descripcion: string;
  recursoTipo: string;
  recursoId: string;
  estado: "trabajando" | "listo" | "error";
  updatedAt: string;
}

/**
 * Lo que hay que mostrar ahora mismo.
 *
 * Ventana corta a proposito: esto no es el historial, es "esta pasando".
 * Lo que ya termino se muestra unos segundos para que se alcance a leer y
 * despues se va solo.
 */
export async function actividadViva(segundos = 20): Promise<ActividadViva[]> {
  const supabase = createSupabaseServiceRole();
  const desde = new Date(Date.now() - segundos * 1000).toISOString();

  const { data, error } = await supabase
    .from("int_mcp_actividad")
    .select(
      "id, admin_nombre, herramienta, descripcion, recurso_tipo, recurso_id, estado, updated_at",
    )
    .gt("updated_at", desde)
    .order("updated_at", { ascending: false })
    .limit(10);

  if (error || !data) return [];

  return data.map((a) => ({
    id: a.id as string,
    quien: (a.admin_nombre as string) || "alguien",
    herramienta: (a.herramienta as string) ?? "",
    descripcion: (a.descripcion as string) ?? "",
    recursoTipo: (a.recurso_tipo as string) ?? "",
    recursoId: (a.recurso_id as string) ?? "",
    estado: a.estado as ActividadViva["estado"],
    updatedAt: a.updated_at as string,
  }));
}
