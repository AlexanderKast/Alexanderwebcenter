import "server-only";
import { listarGuiones } from "@/lib/guiones/queries";
import { listarIdeas } from "@/lib/ideas/queries";
import { listarFinanzas, listarMovimientos } from "@/lib/proyectos/finanzas";
import {
  puedeEditarProyectos,
  puedeGestionarConfiguracion,
} from "@/lib/proyectos/permisos";
import { listarColumnas, listarProyectos } from "@/lib/proyectos/queries";
import { createSupabaseServiceRole } from "@/lib/supabase/server";
import { enviarMensaje, escapar } from "@/lib/telegram/api";
import { nombreDe, type UsuarioMcp } from "./auth";
import {
  abrirSesion,
  cerrarActividad,
  descartarActividad,
  motivoDelBloqueo,
  registrarActividad,
  sesionActiva,
} from "./sesion";

/**
 * Lo que se puede hacer con el panel desde un chat.
 *
 * Dos reglas para todo lo de aca:
 *
 * 1. El permiso es el del rol, igual que en el panel. El MCP no es una
 *    puerta de atras: si un tester no mueve tarjetas con el mouse, tampoco
 *    las mueve hablando.
 * 2. Todo lo que escribe queda firmado con la persona del token. Ese era el
 *    punto de que cada uno tenga la suya.
 *
 * Escribir plata no esta: un movimiento mal cargado desde un chat es un
 * error caro y silencioso. Finanzas es solo lectura.
 */

const SIN_PERMISO = "No tenés permiso para esto en el panel, así que tampoco por acá.";

export interface Herramienta {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

/** Los proyectos y columnas se nombran hablando, no por uuid. */
async function buscarProyecto(entrada: string) {
  const proyectos = await listarProyectos();
  const buscado = entrada.trim().toLowerCase();

  const exacto = proyectos.find(
    (p) => p.id === entrada || p.nombre.toLowerCase() === buscado,
  );
  if (exacto) return { proyecto: exacto, ambiguos: [] as string[] };

  const parciales = proyectos.filter((p) => p.nombre.toLowerCase().includes(buscado));
  if (parciales.length === 1) return { proyecto: parciales[0]!, ambiguos: [] };

  return { proyecto: null, ambiguos: parciales.map((p) => p.nombre) };
}

function pesos(valor: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(valor);
}

export const HERRAMIENTAS: Herramienta[] = [
  {
    name: "abrir_sesion",
    description:
      "OBLIGATORIA ANTES DE ESCRIBIR NADA. Al empezar a trabajar, preguntale al usuario si el proyecto que tenés abierto es un proyecto de trabajo (de los que van al panel de la empresa) o algo personal o interno, y guardá la respuesta acá. Si es_de_trabajo es false, no vuelvas a ofrecer publicar nada en la plataforma. Para leer no hace falta.",
    inputSchema: {
      type: "object",
      properties: {
        workspace: {
          type: "string",
          description: "El nombre de la carpeta o del repo que está abierto.",
        },
        es_de_trabajo: {
          type: "boolean",
          description: "Lo que contestó el usuario. Sin inventar: hay que preguntarlo.",
        },
      },
      required: ["workspace", "es_de_trabajo"],
    },
  },
  {
    name: "listar_ideas",
    description:
      "La bandeja de ideas del panel: lo que el equipo mandó por nota de voz al bot de Telegram (ya transcrito) o escribió a mano. Filtrable por estado.",
    inputSchema: {
      type: "object",
      properties: {
        estado: {
          type: "string",
          enum: ["nueva", "en_revision", "aprobada", "descartada", "convertida"],
          description: "Solo las que estén en este estado.",
        },
        limite: { type: "number", description: "Cuántas traer. Por defecto 30." },
      },
    },
  },
  {
    name: "crear_idea",
    description:
      "Guarda una idea nueva en la bandeja. Sirve para dejar apuntada una idea que salió hablando, sin abrir el panel. Queda firmada con tu nombre.",
    inputSchema: {
      type: "object",
      properties: {
        titulo: { type: "string", description: "Corto y concreto. Obligatorio." },
        resumen: { type: "string", description: "El fondo de la idea, 1 a 3 frases." },
        detalle: { type: "string", description: "Todo lo demás, tal cual se dijo." },
        tags: { type: "array", items: { type: "string" }, description: "Hasta 5." },
      },
      required: ["titulo"],
    },
  },
  {
    name: "responder_idea",
    description:
      "Aprueba o descarta una idea y, si vino por Telegram, le manda el mensaje a quien la propuso. Usalo para explicar por qué sí, por qué no o qué le falta.",
    inputSchema: {
      type: "object",
      properties: {
        idea_id: { type: "string", description: "El id de la idea." },
        estado: {
          type: "string",
          enum: ["aprobada", "descartada", "en_revision"],
          description: "En qué queda. Con en_revision solo se manda el mensaje.",
        },
        mensaje: { type: "string", description: "Lo que le llega al autor." },
      },
      required: ["idea_id", "estado"],
    },
  },
  {
    name: "listar_proyectos",
    description:
      "Los proyectos internos con su columna del tablero, responsable, cliente y presupuesto.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "mover_proyecto",
    description:
      "Cambia un proyecto de columna en el tablero. El proyecto y la columna se pueden nombrar por su nombre, no hace falta el id.",
    inputSchema: {
      type: "object",
      properties: {
        proyecto: { type: "string", description: "Nombre o id del proyecto." },
        columna: { type: "string", description: "Nombre de la columna destino." },
      },
      required: ["proyecto", "columna"],
    },
  },
  {
    name: "crear_nota_proyecto",
    description:
      "Deja una nota en un proyecto: en qué vamos, qué se hizo, qué falta, qué se pusheó. Queda firmada con tu nombre y con la fecha.",
    inputSchema: {
      type: "object",
      properties: {
        proyecto: { type: "string", description: "Nombre o id del proyecto." },
        texto: { type: "string", description: "La nota." },
        tipo: {
          type: "string",
          enum: ["nota", "bug"],
          description: "Por defecto nota.",
        },
      },
      required: ["proyecto", "texto"],
    },
  },
  {
    name: "listar_movimientos",
    description:
      "Movimientos de plata: ingresos y egresos con sociedad, proyecto, categoría y monto en COP. Solo lectura.",
    inputSchema: {
      type: "object",
      properties: {
        limite: { type: "number", description: "Cuántos traer. Por defecto 50." },
      },
    },
  },
  {
    name: "resumen_proyecto",
    description:
      "Todo lo de un proyecto junto: datos, columna, plata (presupuesto vs. real) y las últimas notas.",
    inputSchema: {
      type: "object",
      properties: {
        proyecto: { type: "string", description: "Nombre o id del proyecto." },
      },
      required: ["proyecto"],
    },
  },
  {
    name: "listar_guiones",
    description: "La biblioteca de guiones, con su pilar, plataforma y estado.",
    inputSchema: {
      type: "object",
      properties: {
        estado: {
          type: "string",
          description: "idea, escribiendo, listo, grabado, publicado.",
        },
        pilar: { type: "string", description: "Dios, Estrategia, IA, Proceso, Vida Real." },
      },
    },
  },
  {
    name: "crear_guion",
    description:
      "Crea un guión en la biblioteca. Con el título alcanza; el resto se completa después en el panel.",
    inputSchema: {
      type: "object",
      properties: {
        titulo: { type: "string" },
        pilar: { type: "string" },
        plataforma: { type: "string" },
        formato: { type: "string" },
        gancho: {
          type: "string",
          description: "La primera línea, la que frena el scroll.",
        },
        cuerpo: { type: "string" },
      },
      required: ["titulo"],
    },
  },
];

type Args = Record<string, unknown>;

const cadena = (v: unknown): string => (typeof v === "string" ? v.trim() : "");
const numero = (v: unknown, porDefecto: number): number =>
  typeof v === "number" && Number.isFinite(v) ? v : porDefecto;

/**
 * Corre una herramienta y devuelve el texto que ve el modelo.
 *
 * Devuelve texto y no JSON crudo a proposito: lo que sale de aca se lee en
 * una conversacion, y un volcado de uuids no le sirve a nadie.
 */
/**
 * Lo que devuelve una herramienta que si llego a cambiar algo.
 *
 * Hace falta distinguirlo: pedir mover a una columna que no existe tambien
 * "termina bien" desde el punto de vista del programa, pero no cambio nada,
 * y no tiene por que aparecerle en la pantalla al resto del equipo.
 */
interface Cambio {
  texto: string;
  recurso?: { tipo: string; id: string };
}

const cambio = (texto: string, recurso?: Cambio["recurso"]): Cambio => ({
  texto,
  recurso,
});

async function correr(
  nombre: string,
  args: Args,
  usuario: UsuarioMcp,
): Promise<string | Cambio> {
  const puedeEscribir = puedeEditarProyectos(usuario.role);
  const supabase = createSupabaseServiceRole();

  switch (nombre) {
    case "listar_ideas": {
      const ideas = await listarIdeas({ estado: cadena(args.estado) || undefined });
      const corte = ideas.slice(0, numero(args.limite, 30));
      if (corte.length === 0) return "No hay ideas con ese filtro.";

      return corte
        .map((i) =>
          [
            `[${i.estado}] ${i.titulo}`,
            `  id: ${i.id}`,
            `  de: ${i.autorNombre || "—"} · ${i.createdAt.slice(0, 10)}${i.proyectoNombre ? ` · ${i.proyectoNombre}` : ""}`,
            i.resumen ? `  ${i.resumen}` : null,
            i.tags.length ? `  tags: ${i.tags.join(", ")}` : null,
          ]
            .filter(Boolean)
            .join("\n"),
        )
        .join("\n\n");
    }

    case "crear_idea": {
      if (!puedeEscribir) return SIN_PERMISO;
      const titulo = cadena(args.titulo);
      if (!titulo) return "Falta el título.";

      const tags = Array.isArray(args.tags)
        ? args.tags.filter((t): t is string => typeof t === "string").slice(0, 5)
        : [];

      const { data, error } = await supabase
        .from("int_ideas")
        .insert({
          titulo: titulo.slice(0, 200),
          resumen: cadena(args.resumen).slice(0, 2000),
          transcripcion: cadena(args.detalle).slice(0, 50000),
          tags,
          origen: "panel",
          autor_id: usuario.id,
          autor_nombre: nombreDe(usuario),
        })
        .select("id")
        .single();

      if (error) {
        console.error("[mcp] crear_idea:", error.message);
        return "No pude guardar la idea.";
      }

      return cambio(`Idea guardada: "${titulo}" (id ${data.id}).`, {
        tipo: "idea",
        id: data.id as string,
      });
    }

    case "responder_idea": {
      if (!puedeEscribir) return SIN_PERMISO;
      const id = cadena(args.idea_id);
      const estado = cadena(args.estado);
      const mensaje = cadena(args.mensaje).slice(0, 2000);

      if (!["aprobada", "descartada", "en_revision"].includes(estado)) {
        return "El estado tiene que ser aprobada, descartada o en_revision.";
      }

      const { data: idea } = await supabase
        .from("int_ideas")
        .select("id, titulo, telegram_chat_id")
        .eq("id", id)
        .maybeSingle();

      if (!idea) return "No encontré esa idea.";

      await supabase
        .from("int_ideas")
        .update({ estado, updated_at: new Date().toISOString() })
        .eq("id", id);

      const titulo = idea.titulo as string;
      if (!mensaje) {
        return cambio(`Idea "${titulo}" marcada como ${estado}. Sin mensaje al autor.`, {
          tipo: "idea",
          id,
        });
      }

      const chatId = idea.telegram_chat_id as number | null;
      const quien = nombreDe(usuario);
      let entregado = false;

      if (chatId) {
        const encabezado =
          estado === "aprobada"
            ? "✅ Aprobaron tu idea"
            : estado === "descartada"
              ? "❌ Descartaron tu idea"
              : "💬 Sobre tu idea";

        entregado = await enviarMensaje(
          chatId,
          `${encabezado}: <b>${escapar(titulo)}</b>\n\n${escapar(mensaje)}\n\n— ${escapar(quien)}`,
        );
      }

      await supabase.from("int_idea_respuestas").insert({
        idea_id: id,
        admin_user_id: usuario.id,
        admin_nombre: quien,
        texto: mensaje,
        estado_al_responder: estado,
        entregado,
        error: chatId
          ? entregado
            ? ""
            : "Telegram no aceptó el mensaje."
          : "La idea no vino de Telegram.",
      });

      if (!chatId) {
        return cambio(
          `Idea "${titulo}" marcada como ${estado}. Se escribió en el panel, así que no hay Telegram al que avisarle; el mensaje quedó registrado.`,
          { tipo: "idea", id },
        );
      }
      return cambio(
        entregado
          ? `Idea "${titulo}" marcada como ${estado} y avisada por Telegram.`
          : `Idea "${titulo}" marcada como ${estado}, pero Telegram no aceptó el mensaje.`,
        { tipo: "idea", id },
      );
    }

    case "listar_proyectos": {
      const [proyectos, columnas] = await Promise.all([
        listarProyectos(),
        listarColumnas(),
      ]);
      if (proyectos.length === 0) return "No hay proyectos.";

      const nombreColumna = new Map(columnas.map((c) => [c.id, c.nombre]));

      return proyectos
        .map((p) =>
          [
            p.nombre,
            `  id: ${p.id}`,
            `  columna: ${p.columnaId ? (nombreColumna.get(p.columnaId) ?? "—") : "—"} · ${p.estadoComercial}`,
            `  responsable: ${p.responsableNombre ?? "sin tomar"}${p.cliente ? ` · cliente: ${p.cliente}` : ""}${p.sociedadNombre ? ` · ${p.sociedadNombre}` : ""}`,
          ].join("\n"),
        )
        .join("\n\n");
    }

    case "mover_proyecto": {
      if (!puedeEscribir) return SIN_PERMISO;

      const { proyecto, ambiguos } = await buscarProyecto(cadena(args.proyecto));
      if (!proyecto) {
        return ambiguos.length
          ? `Hay varios que coinciden: ${ambiguos.join(", ")}. Decime cuál.`
          : "No encontré ese proyecto.";
      }

      const columnas = await listarColumnas();
      const pedida = cadena(args.columna);
      const columna = columnas.find(
        (c) => c.nombre.toLowerCase() === pedida.toLowerCase() || c.id === pedida,
      );

      if (!columna) {
        return `Esa columna no existe. Las que hay: ${columnas.map((c) => c.nombre).join(", ")}.`;
      }

      const { error } = await supabase
        .from("int_proyectos")
        .update({ columna_id: columna.id })
        .eq("id", proyecto.id);

      if (error) {
        console.error("[mcp] mover_proyecto:", error.message);
        return "No pude mover el proyecto.";
      }

      // Queda escrito quien lo movio: el tablero solo muestra donde esta,
      // no como llego ahi.
      await supabase.from("int_proyecto_notas").insert({
        proyecto_id: proyecto.id,
        autor_id: usuario.id,
        tipo: "nota",
        texto: `Movido a "${columna.nombre}".`,
      });

      return cambio(`"${proyecto.nombre}" quedó en ${columna.nombre}.`, {
        tipo: "proyecto",
        id: proyecto.id,
      });
    }

    case "crear_nota_proyecto": {
      if (!puedeEscribir) return SIN_PERMISO;

      const cuerpo = cadena(args.texto);
      if (!cuerpo) return "Falta el texto de la nota.";

      const { proyecto, ambiguos } = await buscarProyecto(cadena(args.proyecto));
      if (!proyecto) {
        return ambiguos.length
          ? `Hay varios que coinciden: ${ambiguos.join(", ")}. Decime cuál.`
          : "No encontré ese proyecto.";
      }

      const tipo = cadena(args.tipo) === "bug" ? "bug" : "nota";

      const { error } = await supabase.from("int_proyecto_notas").insert({
        proyecto_id: proyecto.id,
        autor_id: usuario.id,
        tipo,
        texto: cuerpo.slice(0, 4000),
      });

      if (error) {
        console.error("[mcp] crear_nota:", error.message);
        return "No pude guardar la nota.";
      }

      return cambio(
        `Nota guardada en "${proyecto.nombre}", firmada por ${nombreDe(usuario)}.`,
        { tipo: "proyecto", id: proyecto.id },
      );
    }

    case "listar_movimientos": {
      // La plata la ven los mismos que la ven en el panel.
      if (!puedeGestionarConfiguracion(usuario.role)) return SIN_PERMISO;

      const movimientos = await listarMovimientos(numero(args.limite, 50));
      if (movimientos.length === 0) return "No hay movimientos.";

      return movimientos
        .map((m) =>
          [
            `${m.fecha?.slice(0, 10) ?? "sin fecha"} · ${m.tipo} · ${pesos(m.montoCop)}`,
            `  ${m.descripcion || m.categoria}`,
            `  ${m.sociedadNombre}${m.proyectoNombre ? ` · ${m.proyectoNombre}` : ""} · ${m.estado}`,
          ].join("\n"),
        )
        .join("\n\n");
    }

    case "resumen_proyecto": {
      const { proyecto, ambiguos } = await buscarProyecto(cadena(args.proyecto));
      if (!proyecto) {
        return ambiguos.length
          ? `Hay varios que coinciden: ${ambiguos.join(", ")}. Decime cuál.`
          : "No encontré ese proyecto.";
      }

      const [columnas, finanzas, notas] = await Promise.all([
        listarColumnas(),
        listarFinanzas(),
        supabase
          .from("int_proyecto_notas")
          .select("texto, tipo, created_at, autor:admin_users(full_name)")
          .eq("proyecto_id", proyecto.id)
          .order("created_at", { ascending: false })
          .limit(10),
      ]);

      const columna = proyecto.columnaId
        ? (columnas.find((c) => c.id === proyecto.columnaId)?.nombre ?? "—")
        : "—";

      const plata = finanzas.get(proyecto.id);

      const filas = (notas.data ?? []) as unknown as {
        texto: string;
        tipo: string;
        created_at: string;
        autor: { full_name: string | null } | null;
      }[];

      const hilo = filas.length
        ? filas
            .map(
              (n) =>
                `  · [${n.tipo}] ${n.texto} — ${n.autor?.full_name ?? "?"}, ${n.created_at.slice(0, 10)}`,
            )
            .join("\n")
        : "  · sin notas";

      return [
        proyecto.nombre,
        `id: ${proyecto.id}`,
        `columna: ${columna} · ${proyecto.estadoComercial}`,
        `responsable: ${proyecto.responsableNombre ?? "sin tomar"}`,
        proyecto.cliente ? `cliente: ${proyecto.cliente}` : null,
        proyecto.sociedadNombre ? `sociedad: ${proyecto.sociedadNombre}` : null,
        `presupuesto: ingresos ${pesos(proyecto.pptoIngresos ?? 0)} · gastos ${pesos(proyecto.pptoGastos ?? 0)}`,
        plata
          ? `real: ingresos ${pesos(plata.ingresos)} · egresos ${pesos(plata.egresos)} · utilidad ${pesos(plata.utilidad)} (${plata.movimientos} movimientos)`
          : null,
        "últimas notas:",
        hilo,
      ]
        .filter(Boolean)
        .join("\n");
    }

    case "listar_guiones": {
      const guiones = await listarGuiones({
        estado: cadena(args.estado) || undefined,
        pilar: cadena(args.pilar) || undefined,
      });
      if (guiones.length === 0) return "No hay guiones con ese filtro.";

      return guiones
        .slice(0, 50)
        .map((g) =>
          [
            `[${g.estado}] ${g.titulo}`,
            `  id: ${g.id}`,
            `  ${g.pilar || "sin pilar"} · ${g.plataforma || "—"} · ${g.formato || "—"}`,
            g.gancho ? `  gancho: ${g.gancho}` : null,
          ]
            .filter(Boolean)
            .join("\n"),
        )
        .join("\n\n");
    }

    case "crear_guion": {
      if (!puedeEscribir) return SIN_PERMISO;
      const titulo = cadena(args.titulo);
      if (!titulo) return "Falta el título.";

      const { data, error } = await supabase
        .from("int_guiones")
        .insert({
          titulo: titulo.slice(0, 200),
          pilar: cadena(args.pilar).slice(0, 40),
          plataforma: cadena(args.plataforma).slice(0, 40),
          formato: cadena(args.formato).slice(0, 40),
          gancho: cadena(args.gancho).slice(0, 500),
          cuerpo: cadena(args.cuerpo).slice(0, 20000),
          autor_id: usuario.id,
        })
        .select("id")
        .single();

      if (error) {
        console.error("[mcp] crear_guion:", error.message);
        return "No pude guardar el guión.";
      }

      return cambio(`Guión creado: "${titulo}" (id ${data.id}).`, {
        tipo: "guion",
        id: data.id as string,
      });
    }

    default:
      return `No conozco la herramienta "${nombre}".`;
  }
}

/** Como se cuenta en el panel lo que esta pasando, mientras pasa. */
function descripcionDe(nombre: string, args: Args): string {
  const a = (k: string) => cadena(args[k]);

  switch (nombre) {
    case "crear_idea":
      return `Guardando la idea «${a("titulo")}»`;
    case "responder_idea":
      return `Respondiendo una idea (${a("estado")})`;
    case "mover_proyecto":
      return `Moviendo «${a("proyecto")}» a ${a("columna")}`;
    case "crear_nota_proyecto":
      return `Escribiendo una nota en «${a("proyecto")}»`;
    case "crear_guion":
      return `Creando el guión «${a("titulo")}»`;
    default:
      return nombre;
  }
}

/**
 * Sobre que fila del panel va a caer esto, si se puede saber de antemano.
 *
 * Los nombres llegan hablando ("moveme Orgullosamente Paisa"), asi que hay
 * que resolverlos contra el tablero. Cuesta una consulta; el precio de no
 * hacerlo es que la tarjeta se ilumina tarde.
 */
async function recursoDe(
  nombre: string,
  args: Args,
): Promise<{ tipo: string; id: string } | undefined> {
  if (nombre !== "mover_proyecto" && nombre !== "crear_nota_proyecto") return;

  const { proyecto } = await buscarProyecto(cadena(args.proyecto));
  return proyecto ? { tipo: "proyecto", id: proyecto.id } : undefined;
}

/** Las que dejan huella en el panel. Las demas solo miran. */
const ESCRIBEN = new Set([
  "crear_idea",
  "responder_idea",
  "mover_proyecto",
  "crear_nota_proyecto",
  "crear_guion",
]);

/**
 * La puerta.
 *
 * Todo lo que escribe pasa por dos cosas antes de tocar la base: que alguien
 * haya dicho que este proyecto es de trabajo, y que quede anotado en vivo
 * que se esta haciendo. Lo que solo lee entra derecho.
 */
export async function ejecutar(
  nombre: string,
  args: Args,
  usuario: UsuarioMcp,
): Promise<string> {
  if (nombre === "abrir_sesion") {
    const workspace = cadena(args.workspace);
    const esTrabajo = args.es_de_trabajo === true;

    if (typeof args.es_de_trabajo !== "boolean") {
      return "Falta es_de_trabajo. Preguntale al usuario si este proyecto es de trabajo antes de contestar por él.";
    }

    const sesion = await abrirSesion(usuario, workspace, esTrabajo);
    if (!sesion) return "No pude guardar la respuesta. Probá de nuevo.";

    const nombreWs = workspace || "este proyecto";
    return esTrabajo
      ? `Listo: «${nombreWs}» es de trabajo, así que puedo escribir en el panel durante las próximas 8 horas. Todo lo que haga queda firmado por ${nombreDe(usuario)}.`
      : `Anotado: «${nombreWs}» no es de trabajo. No voy a publicar nada en la plataforma. Puedo seguir leyendo el panel si hace falta consultar algo.`;
  }

  if (!ESCRIBEN.has(nombre)) {
    const salida = await correr(nombre, args, usuario);
    return typeof salida === "string" ? salida : salida.texto;
  }

  const bloqueo = motivoDelBloqueo(await sesionActiva(usuario.tokenId));
  if (bloqueo) return bloqueo;

  // Se resuelve el proyecto antes de empezar y no al terminar: si la
  // tarjeta se ilumina recien cuando ya se movio, el que estaba mirando ve
  // el salto y despues el aviso, que es el orden al reves.
  const recurso = await recursoDe(nombre, args);

  const actividad = await registrarActividad(
    usuario,
    nombre,
    descripcionDe(nombre, args),
    recurso,
  );

  try {
    const salida = await correr(nombre, args, usuario);

    // Un string es una herramienta que contesto sin tocar nada: faltaba un
    // dato, el nombre era ambiguo, no habia permiso. Eso se habla con quien
    // pregunto, no se le muestra al equipo entero en la pantalla.
    if (typeof salida === "string") {
      await descartarActividad(actividad);
      return salida;
    }

    await cerrarActividad(actividad, "listo", salida.texto, salida.recurso);
    return salida.texto;
  } catch (e) {
    await cerrarActividad(actividad, "error");
    throw e;
  }
}
