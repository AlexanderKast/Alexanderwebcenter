import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { actividadViva } from "@/lib/mcp/sesion";

/**
 * Lo que el panel pregunta cada pocos segundos: que esta tocando el MCP
 * ahora mismo.
 *
 * Es un endpoint aparte y no un server action porque lo llama un poll: un
 * action revalida el arbol de React en cada vuelta y eso, cada tres
 * segundos, es re-renderizar el panel entero para mostrar un cartel.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const usuario = await getCurrentUser();
  if (!usuario) return NextResponse.json({ actividad: [] }, { status: 401 });

  const actividad = await actividadViva();

  return NextResponse.json(
    { actividad },
    { headers: { "cache-control": "no-store" } },
  );
}
