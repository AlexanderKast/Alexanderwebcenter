"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import {
  esquemaIdea,
  generarCodigo,
  ESTADOS_IDEA,
  type DatosIdea,
  type EstadoIdea,
} from "@/lib/ideas/tipos";
import { puedeEditarProyectos, puedeInvitar } from "@/lib/proyectos/permisos";
import { createSupabaseServiceRole } from "@/lib/supabase/server";
import { enviarMensaje, escapar } from "@/lib/telegram/api";

/**
 * Lo que se hace con una idea desde el panel: revisarla, ligarla a un
 * proyecto, descartarla. Y los codigos que dejan usar el bot.
 *
 * El tester puede leer la bandeja pero no tocarla, igual que en proyectos.
 */

export type ResultadoIdea = { ok: true; id: string } | { ok: false; error: string };
export type ResultadoBorrado = { ok: true } | { ok: false; error: string };
export type ResultadoCodigo =
  | { ok: true; codigo: string }
  | { ok: false; error: string };

const SIN_PERMISO = "No tenés permiso para esta acción.";

function refrescar(id?: string) {
  revalidatePath("/admin/ideas");
  if (id) revalidatePath(`/admin/ideas/${id}`);
}

export async function crearIdea(datos: DatosIdea): Promise<ResultadoIdea> {
  const usuario = await requireAuth();
  if (!puedeEditarProyectos(usuario.role)) return { ok: false, error: SIN_PERMISO };

  const parseado = esquemaIdea.safeParse(datos);
  if (!parseado.success) {
    return { ok: false, error: parseado.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const { proyectoId, ...resto } = parseado.data;
  const { data, error } = await createSupabaseServiceRole()
    .from("int_ideas")
    .insert({
      ...resto,
      proyecto_id: proyectoId,
      origen: "panel",
      autor_id: usuario.id,
      autor_nombre: usuario.fullName ?? usuario.email,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[ideas] crear:", error.message);
    return { ok: false, error: "No pude guardar la idea." };
  }

  refrescar();
  return { ok: true, id: data.id as string };
}

export async function actualizarIdea(
  id: string,
  datos: DatosIdea,
): Promise<ResultadoIdea> {
  const usuario = await requireAuth();
  if (!puedeEditarProyectos(usuario.role)) return { ok: false, error: SIN_PERMISO };

  const parseado = esquemaIdea.safeParse(datos);
  if (!parseado.success) {
    return { ok: false, error: parseado.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const { proyectoId, ...resto } = parseado.data;
  const { error } = await createSupabaseServiceRole()
    .from("int_ideas")
    .update({
      ...resto,
      proyecto_id: proyectoId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("[ideas] actualizar:", error.message);
    return { ok: false, error: "No pude guardar los cambios." };
  }

  refrescar(id);
  return { ok: true, id };
}

/**
 * Cambiar solo el estado, sin abrir la idea. Es el gesto mas frecuente:
 * pasar por la bandeja marcando que sirve y que no.
 */
export async function cambiarEstadoIdea(
  id: string,
  estado: EstadoIdea,
): Promise<ResultadoIdea> {
  const usuario = await requireAuth();
  if (!puedeEditarProyectos(usuario.role)) return { ok: false, error: SIN_PERMISO };

  if (!ESTADOS_IDEA.includes(estado)) {
    return { ok: false, error: "Ese estado no existe." };
  }

  const { error } = await createSupabaseServiceRole()
    .from("int_ideas")
    .update({ estado, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("[ideas] estado:", error.message);
    return { ok: false, error: "No pude cambiar el estado." };
  }

  refrescar(id);
  return { ok: true, id };
}

export async function eliminarIdea(id: string): Promise<ResultadoBorrado> {
  const usuario = await requireAuth();
  if (!puedeEditarProyectos(usuario.role)) return { ok: false, error: SIN_PERMISO };

  const supabase = createSupabaseServiceRole();

  // El audio se borra antes que la fila: si se borra primero la idea, la
  // ruta se pierde y el archivo queda ocupando el bucket para siempre.
  const { data } = await supabase
    .from("int_ideas")
    .select("audio_path")
    .eq("id", id)
    .maybeSingle();

  const ruta = (data?.audio_path as string | undefined) ?? "";
  if (ruta) {
    const { error } = await supabase.storage.from("ideas-audio").remove([ruta]);
    if (error) console.error("[ideas] borrar audio:", error.message);
  }

  const { error } = await supabase.from("int_ideas").delete().eq("id", id);

  if (error) {
    console.error("[ideas] eliminar:", error.message);
    return { ok: false, error: "No pude borrar la idea." };
  }

  refrescar();
  return { ok: true };
}

/**
 * Resolver una idea: dejarla en un estado y, si vino por el bot, avisarle a
 * quien la mando.
 *
 * El mensaje es opcional pero es el punto: una idea que se descarta sin una
 * palabra es alguien que deja de mandar ideas. El estado se guarda aunque
 * el aviso falle — que Telegram rechace el mensaje no puede hacer que la
 * decision se pierda.
 */
export async function resolverIdea(
  id: string,
  estado: EstadoIdea,
  mensaje: string,
): Promise<{ ok: true; aviso: "enviado" | "sin_chat" | "falló" } | { ok: false; error: string }> {
  const usuario = await requireAuth();
  if (!puedeEditarProyectos(usuario.role)) return { ok: false, error: SIN_PERMISO };

  if (!ESTADOS_IDEA.includes(estado)) {
    return { ok: false, error: "Ese estado no existe." };
  }

  const texto = mensaje.trim().slice(0, 2000);
  const supabase = createSupabaseServiceRole();

  const { data: idea, error: errorIdea } = await supabase
    .from("int_ideas")
    .select("id, titulo, telegram_chat_id")
    .eq("id", id)
    .maybeSingle();

  if (errorIdea || !idea) return { ok: false, error: "No encontré esa idea." };

  const { error } = await supabase
    .from("int_ideas")
    .update({ estado, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("[ideas] resolver:", error.message);
    return { ok: false, error: "No pude guardar el estado." };
  }

  refrescar(id);

  if (!texto) return { ok: true, aviso: "sin_chat" };

  const chatId = idea.telegram_chat_id as number | null;
  const quien = usuario.fullName ?? usuario.email;

  if (!chatId) {
    // Idea escrita en el panel: el mensaje queda igual como registro de la
    // decision, pero no hay a quien mandarselo.
    await supabase.from("int_idea_respuestas").insert({
      idea_id: id,
      admin_user_id: usuario.id,
      admin_nombre: quien,
      texto,
      estado_al_responder: estado,
      entregado: false,
      error: "La idea no vino de Telegram.",
    });
    return { ok: true, aviso: "sin_chat" };
  }

  const encabezado =
    estado === "aprobada"
      ? "✅ Aprobaron tu idea"
      : estado === "descartada"
        ? "❌ Descartaron tu idea"
        : "💬 Sobre tu idea";

  const entregado = await enviarMensaje(
    chatId,
    [
      `${encabezado}: <b>${escapar(idea.titulo as string)}</b>`,
      "",
      escapar(texto),
      "",
      `— ${escapar(quien)}`,
    ].join("\n"),
  );

  await supabase.from("int_idea_respuestas").insert({
    idea_id: id,
    admin_user_id: usuario.id,
    admin_nombre: quien,
    texto,
    estado_al_responder: estado,
    entregado,
    error: entregado ? "" : "Telegram no aceptó el mensaje.",
  });

  return { ok: true, aviso: entregado ? "enviado" : "falló" };
}

/**
 * Codigo de invitacion al bot. Lo genera el servidor: un codigo elegido a
 * mano termina siendo el nombre de alguien y se adivina.
 */
export async function crearCodigoBot(
  nota: string,
  adminUserId: string | null,
  usosMax: number,
): Promise<ResultadoCodigo> {
  const usuario = await requireAuth();
  if (!puedeInvitar(usuario.role)) return { ok: false, error: SIN_PERMISO };

  const usos = Number.isFinite(usosMax) ? Math.min(Math.max(1, usosMax), 50) : 1;
  const codigo = generarCodigo();

  const { error } = await createSupabaseServiceRole()
    .from("int_telegram_codigos")
    .insert({
      codigo,
      nota: nota.trim().slice(0, 200),
      admin_user_id: adminUserId,
      usos_max: usos,
      creado_por: usuario.id,
    });

  if (error) {
    console.error("[ideas] crear codigo:", error.message);
    return { ok: false, error: "No pude crear el código." };
  }

  revalidatePath("/admin/ideas/acceso");
  return { ok: true, codigo };
}

/** Apagar un codigo que ya no debe servir, sin borrar el rastro de quien lo dio. */
export async function desactivarCodigoBot(id: string): Promise<ResultadoBorrado> {
  const usuario = await requireAuth();
  if (!puedeInvitar(usuario.role)) return { ok: false, error: SIN_PERMISO };

  const { error } = await createSupabaseServiceRole()
    .from("int_telegram_codigos")
    .update({ activo: false })
    .eq("id", id);

  if (error) {
    console.error("[ideas] desactivar codigo:", error.message);
    return { ok: false, error: "No pude desactivar el código." };
  }

  revalidatePath("/admin/ideas/acceso");
  return { ok: true };
}
