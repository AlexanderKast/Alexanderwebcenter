import "server-only";
import { createSupabaseServiceRole } from "@/lib/supabase/server";
import type {
  FinanzasProyecto,
  Movimiento,
  ResumenSociedad,
} from "./types";

/**
 * La plata de cada proyecto, sacada de los movimientos que vienen del Sheet.
 *
 * Igual que el resto de las consultas int_: entra por service role y el
 * permiso lo pone requireAuth, no la base.
 */

interface FilaFinanzas {
  proyecto_id: string;
  ingresos: number;
  egresos: number;
  utilidad: number;
  movimientos: number;
  ultimo_movimiento: string | null;
}

function mapearFinanzas(f: FilaFinanzas): FinanzasProyecto {
  return {
    proyectoId: f.proyecto_id,
    ingresos: Number(f.ingresos),
    egresos: Number(f.egresos),
    utilidad: Number(f.utilidad),
    movimientos: Number(f.movimientos),
    ultimoMovimiento: f.ultimo_movimiento,
  };
}

/** Finanzas de todos los proyectos, listas para pegarle a cada tarjeta. */
export async function listarFinanzas(): Promise<Map<string, FinanzasProyecto>> {
  const supabase = createSupabaseServiceRole();
  const { data, error } = await supabase
    .from("int_proyecto_finanzas")
    .select("proyecto_id, ingresos, egresos, utilidad, movimientos, ultimo_movimiento");

  if (error) {
    console.error("[finanzas] listarFinanzas:", error.message);
    return new Map();
  }

  return new Map(
    (data as FilaFinanzas[] | null ?? []).map((f) => [f.proyecto_id, mapearFinanzas(f)]),
  );
}

export async function finanzasDe(proyectoId: string): Promise<FinanzasProyecto> {
  const supabase = createSupabaseServiceRole();
  const { data, error } = await supabase
    .from("int_proyecto_finanzas")
    .select("proyecto_id, ingresos, egresos, utilidad, movimientos, ultimo_movimiento")
    .eq("proyecto_id", proyectoId)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("[finanzas] finanzasDe:", error.message);
    return {
      proyectoId,
      ingresos: 0,
      egresos: 0,
      utilidad: 0,
      movimientos: 0,
      ultimoMovimiento: null,
    };
  }

  return mapearFinanzas(data as FilaFinanzas);
}

interface FilaMovimiento {
  id: string;
  proyecto_id: string | null;
  sociedad_nombre: string;
  proyecto_nombre: string;
  fecha: string | null;
  tipo: "Ingreso" | "Egreso";
  categoria: string;
  descripcion: string;
  moneda: string;
  monto: number | null;
  monto_cop: number;
  asignado_ecomnoticias: number;
  asignado_ia_master: number;
  asignado_nuskin: number;
  pagado_por: string;
  medio_pago: string;
  estado: string;
}

const CAMPOS_MOVIMIENTO =
  "id, proyecto_id, sociedad_nombre, proyecto_nombre, fecha, tipo, categoria, descripcion, moneda, monto, monto_cop, asignado_ecomnoticias, asignado_ia_master, asignado_nuskin, pagado_por, medio_pago, estado";

function mapearMovimiento(m: FilaMovimiento): Movimiento {
  return {
    id: m.id,
    proyectoId: m.proyecto_id,
    sociedadNombre: m.sociedad_nombre,
    proyectoNombre: m.proyecto_nombre,
    fecha: m.fecha,
    tipo: m.tipo,
    categoria: m.categoria,
    descripcion: m.descripcion,
    moneda: m.moneda,
    monto: m.monto === null ? null : Number(m.monto),
    montoCop: Number(m.monto_cop),
    pagadoPor: m.pagado_por,
    medioPago: m.medio_pago,
    estado: m.estado,
  };
}

export async function movimientosDe(proyectoId: string): Promise<Movimiento[]> {
  const supabase = createSupabaseServiceRole();
  const { data, error } = await supabase
    .from("int_movimientos")
    .select(CAMPOS_MOVIMIENTO)
    .eq("proyecto_id", proyectoId)
    .order("fecha", { ascending: false });

  if (error) {
    console.error("[finanzas] movimientosDe:", error.message);
    return [];
  }

  return (data as FilaMovimiento[] | null ?? []).map(mapearMovimiento);
}

export async function listarMovimientos(limite = 300): Promise<Movimiento[]> {
  const supabase = createSupabaseServiceRole();
  const { data, error } = await supabase
    .from("int_movimientos")
    .select(CAMPOS_MOVIMIENTO)
    .order("fecha", { ascending: false })
    .limit(limite);

  if (error) {
    console.error("[finanzas] listarMovimientos:", error.message);
    return [];
  }

  return (data as FilaMovimiento[] | null ?? []).map(mapearMovimiento);
}

/**
 * Cuanto lleva cada sociedad.
 *
 * Los movimientos de "Compartido" no son de nadie en particular: el Sheet
 * ya trae repartido cuanto le toca a cada una en las columnas "Asignado".
 * Si un gasto compartido no tiene reparto, se deja aparte en vez de
 * cargarselo a alguien.
 */
export async function resumenPorSociedad(): Promise<ResumenSociedad[]> {
  const supabase = createSupabaseServiceRole();
  const { data, error } = await supabase
    .from("int_movimientos")
    .select(
      "sociedad_nombre, tipo, monto_cop, asignado_ecomnoticias, asignado_ia_master, asignado_nuskin",
    );

  if (error) {
    console.error("[finanzas] resumenPorSociedad:", error.message);
    return [];
  }

  const REPARTO: Record<string, keyof FilaMovimiento> = {
    EcomNoticias: "asignado_ecomnoticias",
    "IA Master Tech": "asignado_ia_master",
    Nuskin: "asignado_nuskin",
  };

  const acumulado = new Map<string, { ingresos: number; egresos: number }>();
  const sumar = (sociedad: string, tipo: string, monto: number) => {
    if (monto === 0) return;
    const actual = acumulado.get(sociedad) ?? { ingresos: 0, egresos: 0 };
    if (tipo === "Ingreso") actual.ingresos += monto;
    else actual.egresos += monto;
    acumulado.set(sociedad, actual);
  };

  for (const fila of (data ?? []) as FilaMovimiento[]) {
    if (fila.sociedad_nombre === "Compartido") {
      let repartido = 0;
      for (const [sociedad, campo] of Object.entries(REPARTO)) {
        const parte = Number(fila[campo] ?? 0);
        repartido += parte;
        sumar(sociedad, fila.tipo, parte);
      }
      // Lo que el Sheet todavia no repartio se muestra tal cual.
      const resto = Number(fila.monto_cop) - repartido;
      if (Math.abs(resto) > 0.5) sumar("Compartido (sin repartir)", fila.tipo, resto);
      continue;
    }

    sumar(fila.sociedad_nombre || "Sin sociedad", fila.tipo, Number(fila.monto_cop));
  }

  return [...acumulado.entries()]
    .map(([sociedad, v]) => ({
      sociedad,
      ingresos: v.ingresos,
      egresos: v.egresos,
      utilidad: v.ingresos - v.egresos,
    }))
    .sort((a, b) => a.sociedad.localeCompare(b.sociedad, "es"));
}
