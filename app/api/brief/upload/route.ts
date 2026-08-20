import { NextResponse, type NextRequest } from 'next/server';
import { supabasePublicoBrief } from '@/lib/brief/cliente-publico';
import { formLimiter } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

/** Lo que tiene sentido para un logo, una paleta o una ficha de marca. */
const TIPOS: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
  'image/gif': 'gif',
  'application/pdf': 'pdf',
  'application/zip': 'zip',
  'application/x-zip-compressed': 'zip',
  'application/postscript': 'ai',
};

/** Mismo origen: el formulario es la unica pagina que sube archivos. */
function mismoOrigen(req: NextRequest): boolean {
  const host = req.headers.get('host');
  const origen = req.headers.get('origin') ?? req.headers.get('referer');
  if (!origen || !host) return true;
  try {
    return new URL(origen).host.toLowerCase() === host.toLowerCase();
  } catch {
    return false;
  }
}

function ipDe(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    '0.0.0.0'
  );
}

export async function POST(req: NextRequest) {
  if (!mismoOrigen(req)) {
    return NextResponse.json({ ok: false, error: 'Origen no permitido.' }, { status: 403 });
  }

  const limite = await formLimiter(`brief-upload:${ipDe(req)}`);
  if (!limite.success) {
    return NextResponse.json(
      { ok: false, error: 'Demasiadas subidas seguidas. Probá en un rato.' },
      { status: 429 },
    );
  }

  let archivo: File | null = null;
  try {
    const form = await req.formData();
    const dato = form.get('archivo');
    archivo = dato instanceof File ? dato : null;
  } catch {
    return NextResponse.json({ ok: false, error: 'Envío inválido.' }, { status: 400 });
  }

  if (!archivo) {
    return NextResponse.json({ ok: false, error: 'No llegó ningún archivo.' }, { status: 400 });
  }
  if (archivo.size === 0 || archivo.size > MAX_BYTES) {
    return NextResponse.json(
      { ok: false, error: 'El archivo debe pesar menos de 10 MB.' },
      { status: 413 },
    );
  }

  const extension = TIPOS[archivo.type];
  if (!extension) {
    return NextResponse.json(
      { ok: false, error: 'Formato no admitido. Usá PNG, JPG, WEBP, SVG, PDF, AI o ZIP.' },
      { status: 415 },
    );
  }

  // El nombre lo pone el servidor: el del visitante no se usa para la ruta.
  const nombre = `${crypto.randomUUID()}.${extension}`;
  const ruta = `${new Date().toISOString().slice(0, 7)}/${nombre}`;

  try {
    const supabase = supabasePublicoBrief();
    const { error } = await supabase.storage
      .from('brief')
      .upload(ruta, await archivo.arrayBuffer(), {
        contentType: archivo.type,
        upsert: false,
      });

    if (error) {
      console.error('[brief/upload]', error.message);
      return NextResponse.json(
        { ok: false, error: 'No pudimos guardar el archivo. Probá de nuevo.' },
        { status: 500 },
      );
    }

    const { data } = supabase.storage.from('brief').getPublicUrl(ruta);
    return NextResponse.json({ ok: true, url: data.publicUrl, nombre: archivo.name });
  } catch (e) {
    console.error('[brief/upload]', e);
    return NextResponse.json(
      { ok: false, error: 'No pudimos guardar el archivo. Probá de nuevo.' },
      { status: 500 },
    );
  }
}
