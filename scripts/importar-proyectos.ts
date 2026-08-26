/**
 * Importa el Google Sheet financiero a la base.
 *
 * Se corre una sola vez, pero es idempotente: busca antes de insertar, asi
 * que correrlo dos veces no duplica nada.
 *
 *   npm run importar:proyectos
 */

import { createClient } from "@supabase/supabase-js";
import {
  celda,
  limpiarPorcentaje,
  normalizarFecha,
  parsearCSV,
} from "../lib/proyectos/importar-utils";

const SHEET_ID = "1JgPC6aknBmxLP82I-0F-Xa3I7kep9xxfHT5zh1KYq_Y";
const GID_CONFIG = "1785829694";
const GID_PORTAFOLIO = "1898545934";

// Columnas de la hoja Portafolio, contando desde cero.
const COL_SOCIEDAD = 0;
const COL_PROYECTO = 1;
const COL_CLIENTE = 2;
const COL_RESPONSABLE = 3;
const COL_ESTADO = 4;
const COL_FECHA_INICIO = 5;
const COL_FECHA_CIERRE = 6;
const COL_NOTAS = 15;

const ESTADOS_VALIDOS = new Set([
  "Prospecto",
  "Propuesta enviada",
  "En curso",
  "Pausado",
  "Cerrado",
  "Perdido",
]);

function cliente() {
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

async function bajarHoja(gid: string): Promise<string[][]> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${gid}`;
  const respuesta = await fetch(url);
  if (!respuesta.ok) {
    throw new Error(`No pude bajar la hoja ${gid}: HTTP ${respuesta.status}`);
  }
  return parsearCSV(await respuesta.text());
}

/**
 * Config trae dos bloques en la misma hoja. El de participaciones arranca
 * despues de la fila que dice "Participación por socio" y se corta en la
 * primera fila sin sociedad o en el bloque de control de sumas.
 */
function leerParticipaciones(
  filas: string[][],
): { sociedad: string; socio: string; pct: number; notas: string }[] {
  const inicio = filas.findIndex((f) =>
    celda(f, 0).toLowerCase().startsWith("participación por socio"),
  );
  if (inicio === -1) return [];

  const salida: { sociedad: string; socio: string; pct: number; notas: string }[] = [];

  // inicio + 1 es el encabezado; los datos arrancan en inicio + 2.
  for (let i = inicio + 2; i < filas.length; i++) {
    const sociedad = celda(filas[i], 0);
    const socio = celda(filas[i], 1);
    if (!sociedad || !socio) break;
    if (sociedad.toLowerCase().startsWith("control suma")) break;

    salida.push({
      sociedad,
      socio,
      pct: limpiarPorcentaje(celda(filas[i], 2)) ?? 0,
      notas: celda(filas[i], 3),
    });
  }

  return salida;
}

async function main() {
  const supabase = cliente();
  const resumen = { sociedades: 0, socios: 0, participaciones: 0, proyectos: 0 };
  const avisos: string[] = [];

  console.log("Bajando el Sheet…");
  const [config, portafolio] = await Promise.all([
    bajarHoja(GID_CONFIG),
    bajarHoja(GID_PORTAFOLIO),
  ]);

  // ── Sociedades ────────────────────────────────────────────────
  const participaciones = leerParticipaciones(config);
  const nombresSociedad = [...new Set(participaciones.map((p) => p.sociedad))];

  for (const nombre of nombresSociedad) {
    const { error } = await supabase
      .from("int_sociedades")
      .upsert({ nombre }, { onConflict: "nombre" });
    if (error) avisos.push(`sociedad ${nombre}: ${error.message}`);
    else resumen.sociedades++;
  }

  const { data: sociedades } = await supabase
    .from("int_sociedades")
    .select("id, nombre");
  const idSociedad = new Map(
    (sociedades ?? []).map((s) => [s.nombre as string, s.id as string]),
  );

  // ── Socios ────────────────────────────────────────────────────
  const nombresSocio = [...new Set(participaciones.map((p) => p.socio))];

  for (const nombre of nombresSocio) {
    const { error } = await supabase
      .from("int_socios")
      .upsert({ nombre }, { onConflict: "nombre" });
    if (error) avisos.push(`socio ${nombre}: ${error.message}`);
    else resumen.socios++;
  }

  const { data: socios } = await supabase.from("int_socios").select("id, nombre");
  const idSocio = new Map(
    (socios ?? []).map((s) => [s.nombre as string, s.id as string]),
  );

  // ── Participaciones ───────────────────────────────────────────
  for (const p of participaciones) {
    const sociedadId = idSociedad.get(p.sociedad);
    const socioId = idSocio.get(p.socio);
    if (!sociedadId || !socioId) {
      avisos.push(`participación sin mapear: ${p.sociedad} / ${p.socio}`);
      continue;
    }

    const { error } = await supabase.from("int_sociedad_socios").upsert(
      {
        sociedad_id: sociedadId,
        socio_id: socioId,
        pct_participacion: p.pct,
        rol_notas: p.notas || null,
      },
      { onConflict: "sociedad_id,socio_id" },
    );

    if (error) avisos.push(`participación ${p.sociedad}/${p.socio}: ${error.message}`);
    else resumen.participaciones++;
  }

  // ── Responsables: nombre del Sheet → admin_users ──────────────
  const { data: admins } = await supabase
    .from("admin_users")
    .select("id, full_name, email");

  const idAdminPorNombre = new Map<string, string>();
  for (const a of admins ?? []) {
    const nombre = ((a.full_name as string | null) ?? "").trim().toLowerCase();
    if (nombre) idAdminPorNombre.set(nombre, a.id as string);
    const email = ((a.email as string | null) ?? "").trim().toLowerCase();
    if (email) idAdminPorNombre.set(email, a.id as string);
  }

  // ── Columna inicial del tablero ───────────────────────────────
  const { data: columnas } = await supabase
    .from("int_kanban_columnas")
    .select("id, es_inicial, orden")
    .order("orden", { ascending: true });

  const columnaInicial =
    (columnas ?? []).find((c) => c.es_inicial)?.id ?? columnas?.[0]?.id;

  if (!columnaInicial) {
    throw new Error("No hay columnas en el tablero. Corré la migración 0006 primero.");
  }

  // ── Proyectos ─────────────────────────────────────────────────
  // La fila 4 del Sheet (indice 3) es el encabezado; los datos van desde el 4.
  for (let i = 4; i < portafolio.length; i++) {
    const fila = portafolio[i];
    const nombre = celda(fila, COL_PROYECTO);
    if (!nombre) continue;

    const nombreSociedad = celda(fila, COL_SOCIEDAD);
    const sociedadId = nombreSociedad ? (idSociedad.get(nombreSociedad) ?? null) : null;
    if (nombreSociedad && !sociedadId) {
      avisos.push(`proyecto "${nombre}": sociedad "${nombreSociedad}" no existe`);
    }

    const nombreResponsable = celda(fila, COL_RESPONSABLE);
    const responsableId = nombreResponsable
      ? (idAdminPorNombre.get(nombreResponsable.toLowerCase()) ?? null)
      : null;
    if (nombreResponsable && !responsableId) {
      avisos.push(
        `proyecto "${nombre}": "${nombreResponsable}" todavía no tiene cuenta en el panel`,
      );
    }

    const estadoCrudo = celda(fila, COL_ESTADO);
    const nombreCliente = celda(fila, COL_CLIENTE);

    const datos = {
      sociedad_id: sociedadId,
      nombre,
      cliente: nombreCliente && nombreCliente !== "—" ? nombreCliente : null,
      responsable_id: responsableId,
      estado_comercial: ESTADOS_VALIDOS.has(estadoCrudo) ? estadoCrudo : "Prospecto",
      fecha_inicio: normalizarFecha(celda(fila, COL_FECHA_INICIO)),
      fecha_cierre_est: normalizarFecha(celda(fila, COL_FECHA_CIERRE)),
      notas: celda(fila, COL_NOTAS) || null,
      es_operacion_general: nombre.toLowerCase() === "operación general",
    };

    // Idempotencia: buscar antes de insertar. El indice unico usa una
    // expresion y PostgREST no le puede apuntar con onConflict.
    let consulta = supabase.from("int_proyectos").select("id").eq("nombre", nombre);
    consulta = sociedadId
      ? consulta.eq("sociedad_id", sociedadId)
      : consulta.is("sociedad_id", null);

    const { data: existente } = await consulta.maybeSingle();

    const { error } = existente
      ? await supabase
          .from("int_proyectos")
          .update({ ...datos, updated_at: new Date().toISOString() })
          .eq("id", existente.id as string)
      : await supabase
          .from("int_proyectos")
          .insert({ ...datos, columna_id: columnaInicial });

    if (error) avisos.push(`proyecto "${nombre}": ${error.message}`);
    else resumen.proyectos++;
  }

  console.log("\nListo:");
  console.log(`  sociedades      ${resumen.sociedades}`);
  console.log(`  socios          ${resumen.socios}`);
  console.log(`  participaciones ${resumen.participaciones}`);
  console.log(`  proyectos       ${resumen.proyectos}`);

  if (avisos.length > 0) {
    console.log(`\nAvisos (${avisos.length}):`);
    for (const aviso of avisos) console.log(`  · ${aviso}`);
  }

  // Los presupuestos y montos reales del Sheet son formulas que dependen de
  // la hoja de Movimientos. Eso entra en la fase 2.
  console.log("\nOjo: presupuestos e importes reales no se importan. Eso es fase 2.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
