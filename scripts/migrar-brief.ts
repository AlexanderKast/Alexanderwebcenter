/**
 * Trae las respuestas del formulario desde el proyecto Supabase viejo del
 * brief a la base de la plataforma, para que se vean dentro de /admin.
 *
 * Copia cabeceras, respuestas y archivos, y reescribe las URLs de los
 * archivos para que apunten al bucket nuevo. Es idempotente: los envios se
 * insertan con su mismo id, asi que correrlo dos veces no duplica nada.
 *
 *   npm run migrar:brief
 *
 * La base vieja no se toca: si algo sale mal, sigue estando ahi entera.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "brief";

function clienteDestino(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY. Revisá .env.local",
    );
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function clienteOrigen(): { supabase: SupabaseClient; url: string } {
  const key = process.env.BRIEF_SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.BRIEF_SUPABASE_URL ?? urlDesdeLlave(key);
  if (!url || !key) {
    throw new Error(
      "Faltan BRIEF_SUPABASE_URL o BRIEF_SUPABASE_SERVICE_ROLE_KEY. Revisá .env.local",
    );
  }
  return {
    url,
    supabase: createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    }),
  };
}

/** El JWT de Supabase trae el ref del proyecto en su payload. */
function urlDesdeLlave(key: string | undefined): string | null {
  if (!key) return null;
  try {
    const carga = key.trim().split(".")[1];
    if (!carga) return null;
    const json = JSON.parse(Buffer.from(carga, "base64").toString("utf8")) as {
      ref?: string;
    };
    return json.ref ? `https://${json.ref}.supabase.co` : null;
  } catch {
    return null;
  }
}

/** Lista todos los archivos del bucket, entrando en cada carpeta. */
async function listarArchivos(
  supabase: SupabaseClient,
  prefijo = "",
): Promise<string[]> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list(prefijo, { limit: 1000 });

  if (error) throw new Error(`No pude listar ${prefijo || "/"}: ${error.message}`);

  const salida: string[] = [];
  for (const item of data ?? []) {
    const ruta = prefijo ? `${prefijo}/${item.name}` : item.name;
    // Una carpeta viene sin metadata; un archivo siempre la trae.
    if (item.id === null || item.metadata === null) {
      salida.push(...(await listarArchivos(supabase, ruta)));
    } else {
      salida.push(ruta);
    }
  }
  return salida;
}

async function main() {
  const destino = clienteDestino();
  const { supabase: origen, url: urlOrigen } = clienteOrigen();
  const avisos: string[] = [];

  // ── Archivos ──────────────────────────────────────────────────
  console.log("Copiando archivos…");
  const rutas = await listarArchivos(origen);
  let copiados = 0;

  for (const ruta of rutas) {
    const { data: archivo, error } = await origen.storage.from(BUCKET).download(ruta);
    if (error || !archivo) {
      avisos.push(`archivo ${ruta}: ${error?.message ?? "vino vacío"}`);
      continue;
    }

    const { error: errorSubida } = await destino.storage
      .from(BUCKET)
      .upload(ruta, await archivo.arrayBuffer(), {
        contentType: archivo.type || "application/octet-stream",
        upsert: true,
      });

    if (errorSubida) avisos.push(`archivo ${ruta}: ${errorSubida.message}`);
    else copiados++;
  }

  // ── Envios ────────────────────────────────────────────────────
  console.log("Copiando respuestas…");
  const { data: envios, error: errorEnvios } = await origen
    .from("brief_submissions")
    .select("*")
    .order("created_at", { ascending: true });

  if (errorEnvios) throw new Error(`No pude leer los envíos: ${errorEnvios.message}`);

  // Las respuestas guardan la URL publica del archivo, que lleva el host
  // del proyecto viejo adentro. Si no se reescribe, el panel nuevo sigue
  // pidiendole las imagenes a la base que estamos dejando atras.
  const urlDestino = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL)!;
  const reapuntar = (valor: string): string =>
    valor.split(urlOrigen).join(urlDestino.replace(/\/+$/, ""));

  let enviosCopiados = 0;
  let respuestasCopiadas = 0;

  for (const envio of envios ?? []) {
    const fila = envio as Record<string, unknown>;
    const id = fila.id as string;

    const payload = JSON.parse(reapuntar(JSON.stringify(fila.payload ?? {})));

    const { error } = await destino.from("brief_submissions").upsert(
      { ...fila, payload, origen: "migrado" },
      { onConflict: "id" },
    );

    if (error) {
      avisos.push(`envío ${id}: ${error.message}`);
      continue;
    }
    enviosCopiados++;

    const { data: respuestas, error: errorRespuestas } = await origen
      .from("brief_answers")
      .select("id, submission_id, campo_id, valor")
      .eq("submission_id", id);

    if (errorRespuestas) {
      avisos.push(`respuestas de ${id}: ${errorRespuestas.message}`);
      continue;
    }

    const filas = (respuestas ?? []).map((r) => ({
      ...(r as Record<string, unknown>),
      valor: reapuntar(((r as Record<string, unknown>).valor as string) ?? ""),
    }));

    if (filas.length > 0) {
      const { error: errorInsert } = await destino
        .from("brief_answers")
        .upsert(filas, { onConflict: "submission_id,campo_id" });

      if (errorInsert) avisos.push(`respuestas de ${id}: ${errorInsert.message}`);
      else respuestasCopiadas += filas.length;
    }
  }

  console.log("\nListo:");
  console.log(`  archivos     ${copiados}/${rutas.length}`);
  console.log(`  envíos       ${enviosCopiados}/${(envios ?? []).length}`);
  console.log(`  respuestas   ${respuestasCopiadas}`);

  if (avisos.length > 0) {
    console.log(`\nAvisos (${avisos.length}):`);
    for (const aviso of avisos) console.log(`  · ${aviso}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
