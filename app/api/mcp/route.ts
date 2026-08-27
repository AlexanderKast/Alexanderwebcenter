import { NextResponse, type NextRequest } from "next/server";
import { tokenDeCabecera, usuarioDeToken, type UsuarioMcp } from "@/lib/mcp/auth";
import { HERRAMIENTAS, ejecutar } from "@/lib/mcp/herramientas";

/**
 * El panel, hablado.
 *
 * MCP sobre HTTP es JSON-RPC 2.0: tres metodos (initialize, tools/list,
 * tools/call) y avisos que no esperan respuesta. Escrito a mano y sin el
 * SDK: son cien lineas y evita arrastrar una dependencia con su propio
 * ciclo de versiones dentro de una app de Next.
 *
 * Cada llamada trae la llave personal en Authorization. No hay sesion que
 * mantener: quien sos se resuelve de nuevo en cada mensaje, asi revocar una
 * llave corta el acceso al instante y no cuando se cierre el chat.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const VERSION_PROTOCOLO = "2024-11-05";

interface Peticion {
  jsonrpc?: string;
  id?: string | number | null;
  method?: string;
  params?: Record<string, unknown>;
}

function resultado(id: Peticion["id"], valor: unknown) {
  return NextResponse.json({ jsonrpc: "2.0", id, result: valor });
}

function falla(id: Peticion["id"], codigo: number, mensaje: string, http = 200) {
  return NextResponse.json(
    { jsonrpc: "2.0", id, error: { code: codigo, message: mensaje } },
    { status: http },
  );
}

async function llamarHerramienta(
  id: Peticion["id"],
  params: Record<string, unknown>,
  usuario: UsuarioMcp,
) {
  const nombre = typeof params.name === "string" ? params.name : "";
  const args = (params.arguments ?? {}) as Record<string, unknown>;

  if (!HERRAMIENTAS.some((h) => h.name === nombre)) {
    return falla(id, -32602, `No existe la herramienta "${nombre}".`);
  }

  try {
    const texto = await ejecutar(nombre, args, usuario);
    return resultado(id, { content: [{ type: "text", text: texto }] });
  } catch (e) {
    // isError y no un error de JSON-RPC: el modelo tiene que poder leer que
    // fallo y reintentar, no que se le corte la conexion.
    console.error("[mcp] herramienta", nombre, e);
    return resultado(id, {
      content: [{ type: "text", text: "Algo falló al ejecutar eso en el panel." }],
      isError: true,
    });
  }
}

export async function POST(req: NextRequest) {
  let peticion: Peticion;
  try {
    peticion = (await req.json()) as Peticion;
  } catch {
    return falla(null, -32700, "JSON inválido.", 400);
  }

  const { id = null, method } = peticion;
  const params = peticion.params ?? {};

  // initialize contesta sin llave: el cliente tiene que poder darse la mano
  // y recien ahi mandar credenciales. Nada de lo que devuelve es del panel.
  if (method === "initialize") {
    return resultado(id, {
      protocolVersion: VERSION_PROTOCOLO,
      capabilities: { tools: { listChanged: false } },
      serverInfo: { name: "alexander-panel", version: "1.0.0" },
    });
  }

  // Avisos: no llevan id y no se contestan.
  if (method?.startsWith("notifications/")) {
    return new NextResponse(null, { status: 202 });
  }

  const token = tokenDeCabecera(req.headers.get("authorization"));
  if (!token) {
    return NextResponse.json(
      {
        jsonrpc: "2.0",
        id,
        error: {
          code: -32001,
          message:
            "Falta la llave. Sacá una en el panel, en Sistema → Conectar por MCP.",
        },
      },
      // 401 con WWW-Authenticate: es lo que hace que el cliente muestre
      // "no autorizado" en vez de "el servidor esta roto".
      { status: 401, headers: { "WWW-Authenticate": "Bearer" } },
    );
  }

  const usuario = await usuarioDeToken(token);
  if (!usuario) {
    return NextResponse.json(
      {
        jsonrpc: "2.0",
        id,
        error: {
          code: -32001,
          message: "Esa llave no sirve: está revocada o la cuenta está dada de baja.",
        },
      },
      { status: 401, headers: { "WWW-Authenticate": "Bearer" } },
    );
  }

  switch (method) {
    case "tools/list":
      return resultado(id, { tools: HERRAMIENTAS });

    case "tools/call":
      return llamarHerramienta(id, params, usuario);

    case "ping":
      return resultado(id, {});

    default:
      return falla(id, -32601, `Método no soportado: ${method}`);
  }
}

/**
 * Un GET a mano (o el navegador) tiene que decir algo util. Sin esto se ve
 * un 405 pelado y parece que la URL esta mal.
 */
export function GET() {
  return NextResponse.json({
    servidor: "alexander-panel",
    transporte: "MCP sobre HTTP (JSON-RPC 2.0)",
    autenticacion: "Authorization: Bearer <llave personal>",
    herramientas: HERRAMIENTAS.map((h) => h.name),
    comoConectar: "/admin/mcp",
  });
}
