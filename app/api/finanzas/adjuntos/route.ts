import { randomUUID } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { puedeEditarProyectos } from "@/lib/proyectos/permisos";
import { createSupabaseServiceRole } from "@/lib/supabase/server";

/**
 * Subida de facturas y comprobantes de un movimiento.
 *
 * Va por route handler y no por server action porque son archivos: el
 * formulario manda multipart y el limite de las server actions es chico.
 *
 * El bucket es privado. Nadie llega a una factura por URL: se sirven con
 * enlaces firmados que caducan, generados al abrir el movimiento.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 15 * 1024 * 1024; // 15 MB

/** Lo que llega de una factura: el PDF, la foto del recibo, el XML de la DIAN. */
const TIPOS: Record<string, string> = {
  "application/pdf": "pdf",
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/heic": "heic",
  "text/xml": "xml",
  "application/xml": "xml",
  "application/zip": "zip",
  "application/x-zip-compressed": "zip",
  "text/plain": "txt",
  "text/csv": "csv",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
};

const UUID = /^[0-9a-f-]{36}$/i;

export async function POST(req: NextRequest) {
  const usuario = await getCurrentUser();
  if (!usuario || !puedeEditarProyectos(usuario.role)) {
    return NextResponse.json({ ok: false, error: "Sin permiso." }, { status: 403 });
  }

  let archivo: File | null = null;
  let movimientoId = "";
  try {
    const form = await req.formData();
    const dato = form.get("archivo");
    archivo = dato instanceof File ? dato : null;
    movimientoId = String(form.get("movimientoId") ?? "");
  } catch {
    return NextResponse.json({ ok: false, error: "Envío inválido." }, { status: 400 });
  }

  if (!UUID.test(movimientoId)) {
    return NextResponse.json({ ok: false, error: "Falta el movimiento." }, { status: 400 });
  }
  if (!archivo) {
    return NextResponse.json({ ok: false, error: "No llegó ningún archivo." }, { status: 400 });
  }
  if (archivo.size === 0 || archivo.size > MAX_BYTES) {
    return NextResponse.json(
      { ok: false, error: "El archivo debe pesar menos de 15 MB." },
      { status: 413 },
    );
  }

  const extension = TIPOS[archivo.type];
  if (!extension) {
    return NextResponse.json(
      { ok: false, error: "Formato no admitido. Usá PDF, imagen, XML, ZIP o Excel." },
      { status: 415 },
    );
  }

  const supabase = createSupabaseServiceRole();

  const { data: movimiento } = await supabase
    .from("int_movimientos")
    .select("id")
    .eq("id", movimientoId)
    .maybeSingle();

  if (!movimiento) {
    return NextResponse.json(
      { ok: false, error: "Ese movimiento ya no existe." },
      { status: 404 },
    );
  }

  // La ruta la pone el servidor: el nombre original puede traer acentos,
  // espacios o repetirse. El nombre que se ve se guarda aparte.
  const ruta = `${movimientoId}/${randomUUID()}.${extension}`;

  const { error: errorSubida } = await supabase.storage
    .from("facturas")
    .upload(ruta, await archivo.arrayBuffer(), {
      contentType: archivo.type,
      upsert: false,
    });

  if (errorSubida) {
    console.error("[finanzas/adjuntos]", errorSubida.message);
    return NextResponse.json(
      { ok: false, error: "No pude guardar el archivo." },
      { status: 500 },
    );
  }

  const { data, error } = await supabase
    .from("int_movimiento_adjuntos")
    .insert({
      movimiento_id: movimientoId,
      ruta,
      nombre: archivo.name.slice(0, 200) || `factura.${extension}`,
      tipo_mime: archivo.type,
      tamano: archivo.size,
      subido_por: usuario.id,
    })
    .select("id")
    .single();

  if (error) {
    // Si no quedó registrado, el archivo no debe quedar dando vueltas.
    await supabase.storage.from("facturas").remove([ruta]);
    console.error("[finanzas/adjuntos] registro:", error.message);
    return NextResponse.json(
      { ok: false, error: "No pude registrar el archivo." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, id: data.id as string, nombre: archivo.name });
}
