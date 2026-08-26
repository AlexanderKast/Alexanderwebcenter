/**
 * Trae los gastos y cobros del Sheet a la base.
 *
 * Lo usan el script (`npm run importar:movimientos`) y el boton
 * "Sincronizar" del panel, para que los dos hagan exactamente lo mismo.
 * A proposito no importa "server-only": el script tiene que poder cargarlo.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { parsearCSV } from "./importar-utils";
import { parsearMovimientos, type MovimientoSheet } from "./movimientos-utils";

const SHEET_ID = "1JgPC6aknBmxLP82I-0F-Xa3I7kep9xxfHT5zh1KYq_Y";
const GID_MOVIMIENTOS = "1694856994";

export interface ResultadoSincronizacion {
  leidos: number;
  guardados: number;
  sinProyecto: string[];
  avisos: string[];
}

/** Sin tildes y en minusculas, para que "Operación" y "Operacion" sean lo mismo. */
function clave(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

async function bajarMovimientos(): Promise<string[][]> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID_MOVIMIENTOS}`;
  const respuesta = await fetch(url, { cache: "no-store" });
  if (!respuesta.ok) {
    throw new Error(
      `No pude bajar la hoja de movimientos: HTTP ${respuesta.status}. ` +
        "Revisá que el Sheet siga compartido por link.",
    );
  }
  return parsearCSV(await respuesta.text());
}

export async function sincronizarMovimientos(
  supabase: SupabaseClient,
): Promise<ResultadoSincronizacion> {
  const movimientos = parsearMovimientos(await bajarMovimientos());

  const [{ data: sociedades }, { data: proyectos }] = await Promise.all([
    supabase.from("int_sociedades").select("id, nombre"),
    supabase.from("int_proyectos").select("id, nombre, sociedad_id"),
  ]);

  const idSociedad = new Map<string, string>();
  for (const s of sociedades ?? []) {
    idSociedad.set(clave(s.nombre as string), s.id as string);
  }

  // Un proyecto se identifica por su nombre dentro de su sociedad: hay una
  // "Operación general" por cada una y no son la misma.
  const idProyecto = new Map<string, string>();
  for (const p of proyectos ?? []) {
    const sociedad = (p.sociedad_id as string | null) ?? "";
    idProyecto.set(`${sociedad}::${clave(p.nombre as string)}`, p.id as string);
  }

  const avisos: string[] = [];
  const sinProyecto = new Set<string>();

  const filas = movimientos.map((m: MovimientoSheet) => {
    const sociedadId = m.sociedad ? (idSociedad.get(clave(m.sociedad)) ?? null) : null;
    if (m.sociedad && !sociedadId) {
      avisos.push(`sociedad "${m.sociedad}" no existe en la base`);
    }

    const proyectoId = m.proyecto
      ? (idProyecto.get(`${sociedadId ?? ""}::${clave(m.proyecto)}`) ?? null)
      : null;
    if (m.proyecto && !proyectoId) {
      // El movimiento se guarda igual: no se pierde plata porque falte una
      // fila en el tablero, pero queda dicho cual es.
      sinProyecto.add(`${m.sociedad || "sin sociedad"} · ${m.proyecto}`);
    }

    return {
      sociedad_id: sociedadId,
      proyecto_id: proyectoId,
      sociedad_nombre: m.sociedad,
      proyecto_nombre: m.proyecto,
      fecha: m.fecha,
      mes: m.mes,
      tipo: m.tipo,
      categoria: m.categoria,
      descripcion: m.descripcion,
      moneda: m.moneda,
      monto: m.monto,
      trm: m.trm,
      monto_cop: m.montoCop,
      asignado_ecomnoticias: m.asignadoEcomnoticias,
      asignado_ia_master: m.asignadoIaMaster,
      asignado_nuskin: m.asignadoNuskin,
      pagado_por: m.pagadoPor,
      medio_pago: m.medioPago,
      estado: m.estado,
      nota: m.nota,
      huella: m.huella,
      updated_at: new Date().toISOString(),
    };
  });

  let guardados = 0;
  if (filas.length > 0) {
    const { error, count } = await supabase
      .from("int_movimientos")
      .upsert(filas, { onConflict: "huella", count: "exact" });

    if (error) throw new Error(`No pude guardar los movimientos: ${error.message}`);
    guardados = count ?? filas.length;
  }

  return {
    leidos: movimientos.length,
    guardados,
    sinProyecto: [...sinProyecto],
    avisos: [...new Set(avisos)],
  };
}
