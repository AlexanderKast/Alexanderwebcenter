/**
 * Lectura de la hoja "Libro de movimientos" del Sheet financiero.
 *
 * Cada fila es un gasto o un cobro. Lo que le importa al tablero es a que
 * proyecto pertenece y cuanto fue en pesos.
 */

import { celda, limpiarMoneda, normalizarFecha } from "./importar-utils";

/** Columnas de la hoja, contando desde cero. */
export const COL = {
  fecha: 0,
  mes: 1,
  sociedad: 2,
  proyecto: 3,
  tipo: 4,
  categoria: 5,
  descripcion: 6,
  moneda: 7,
  monto: 8,
  trm: 10,
  montoCop: 11,
  asignadoEcom: 15,
  asignadoIa: 16,
  asignadoNuskin: 17,
  pagadoPor: 18,
  medioPago: 19,
  estado: 20,
  nota: 21,
} as const;

/** La fila 4 del Sheet es el encabezado; los datos arrancan en la 5. */
export const PRIMERA_FILA_DATOS = 4;

export interface MovimientoSheet {
  fecha: string | null;
  mes: string;
  sociedad: string;
  proyecto: string;
  tipo: "Ingreso" | "Egreso";
  categoria: string;
  descripcion: string;
  moneda: string;
  monto: number | null;
  trm: number | null;
  montoCop: number;
  asignadoEcomnoticias: number;
  asignadoIaMaster: number;
  asignadoNuskin: number;
  pagadoPor: string;
  medioPago: string;
  estado: string;
  nota: string;
  huella: string;
}

/**
 * Identifica una fila del Sheet, que no trae id propio.
 *
 * Va con la fecha, las dos etiquetas, el concepto y el monto: cambiar
 * cualquiera de esos es otro movimiento, y corregir el medio de pago o el
 * estado sigue siendo el mismo. Asi reimportar actualiza en vez de duplicar.
 */
export function huellaDe(m: Omit<MovimientoSheet, "huella">): string {
  return [
    m.fecha ?? "",
    m.sociedad,
    m.proyecto,
    m.tipo,
    m.descripcion,
    m.moneda,
    m.montoCop.toFixed(2),
  ]
    .map((parte) => parte.trim().toLowerCase())
    .join("|");
}

/**
 * Convierte la hoja en movimientos. Descarta lo que no es un movimiento:
 * filas vacias, filas a medio escribir (sin tipo) y las que no mueven plata.
 */
export function parsearMovimientos(filas: string[][]): MovimientoSheet[] {
  const salida: MovimientoSheet[] = [];

  for (let i = PRIMERA_FILA_DATOS; i < filas.length; i++) {
    const fila = filas[i];
    if (!fila || fila.every((c) => c.trim() === "")) continue;

    const tipo = celda(fila, COL.tipo);
    if (tipo !== "Ingreso" && tipo !== "Egreso") continue;

    const montoCop = limpiarMoneda(celda(fila, COL.montoCop));
    if (montoCop === null || montoCop === 0) continue;

    const sinHuella = {
      fecha: normalizarFecha(celda(fila, COL.fecha)),
      mes: celda(fila, COL.mes),
      sociedad: celda(fila, COL.sociedad),
      proyecto: celda(fila, COL.proyecto),
      tipo,
      categoria: celda(fila, COL.categoria),
      descripcion: celda(fila, COL.descripcion),
      moneda: celda(fila, COL.moneda) || "COP",
      monto: limpiarMoneda(celda(fila, COL.monto)),
      trm: limpiarMoneda(celda(fila, COL.trm)),
      montoCop,
      asignadoEcomnoticias: limpiarMoneda(celda(fila, COL.asignadoEcom)) ?? 0,
      asignadoIaMaster: limpiarMoneda(celda(fila, COL.asignadoIa)) ?? 0,
      asignadoNuskin: limpiarMoneda(celda(fila, COL.asignadoNuskin)) ?? 0,
      pagadoPor: celda(fila, COL.pagadoPor),
      medioPago: celda(fila, COL.medioPago),
      estado: celda(fila, COL.estado),
      nota: celda(fila, COL.nota),
    } satisfies Omit<MovimientoSheet, "huella">;

    salida.push({ ...sinHuella, huella: huellaDe(sinHuella) });
  }

  return salida;
}

/** Formato corto para la interfaz: $655.601, sin decimales. */
export function formatearCOP(valor: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(valor);
}

/* ────────────────────────────────────────────────────────────
   Carga manual desde el panel

   Las listas son las mismas que las del Sheet (hoja Configuracion),
   para que un movimiento cargado aca y uno importado hablen igual.
   ──────────────────────────────────────────────────────────── */

export const TIPOS_MOVIMIENTO = ["Egreso", "Ingreso"] as const;
export type TipoMovimiento = (typeof TIPOS_MOVIMIENTO)[number];

export const CATEGORIAS_INGRESO = [
  "Venta servicio",
  "Venta producto",
  "Pauta / Patrocinio",
  "Consultoría",
  "Formación",
  "Comisión",
  "Suscripción",
  "Otro ingreso",
] as const;

export const CATEGORIAS_EGRESO = [
  "Nómina / Honorarios",
  "Pauta publicitaria",
  "Software / Herramientas",
  "Hosting / Infraestructura",
  "Proveedores",
  "Logística",
  "Impuestos",
  "Legal / Contable",
  "Comisiones bancarias",
  "Viáticos / Transporte",
  "Equipos",
  "Otro egreso",
] as const;

export const MEDIOS_PAGO = [
  "Transferencia",
  "Nequi / Daviplata",
  "Efectivo",
  "Tarjeta crédito",
  "PayPal / Wise",
  "Otro",
] as const;

export const ESTADOS_MOVIMIENTO = ["Pagado", "Pendiente", "Cancelado"] as const;

export const MONEDAS = ["COP", "USD"] as const;

export const PAGADO_POR = [
  "Caja sociedad",
  "Alexander",
  "Juan Carmona",
  "Samuel Castaño",
  "Lucía",
  "Sara",
  "Diana Mile",
] as const;

/** Las categorias que tienen sentido para ese tipo de movimiento. */
export function categoriasDe(tipo: TipoMovimiento): readonly string[] {
  return tipo === "Ingreso" ? CATEGORIAS_INGRESO : CATEGORIAS_EGRESO;
}

/**
 * Lee un monto escrito a mano.
 *
 * En Colombia el punto separa los miles ("1.500.000") pero mucha gente
 * escribe a la inglesa ("1,500,000") o pega el valor con el simbolo. Manda
 * el ultimo separador que aparezca: si deja dos digitos detras es decimal,
 * si deja tres es de miles.
 */
export function parsearMonto(texto: string | number | null | undefined): number | null {
  if (typeof texto === "number") return Number.isFinite(texto) ? texto : null;

  const limpio = (texto ?? "").replace(/[^\d,.-]/g, "").trim();
  if (!limpio) return null;

  const negativo = limpio.startsWith("-");
  const cuerpo = limpio.replace(/-/g, "");

  const ultimoPunto = cuerpo.lastIndexOf(".");
  const ultimaComa = cuerpo.lastIndexOf(",");
  const corte = Math.max(ultimoPunto, ultimaComa);

  let numero: number;
  if (corte === -1) {
    numero = Number(cuerpo);
  } else {
    const decimales = cuerpo.length - corte - 1;
    if (decimales === 3) {
      // Tres digitos detras del ultimo separador: era separador de miles.
      numero = Number(cuerpo.replace(/[.,]/g, ""));
    } else {
      const entero = cuerpo.slice(0, corte).replace(/[.,]/g, "");
      numero = Number(`${entero}.${cuerpo.slice(corte + 1)}`);
    }
  }

  if (!Number.isFinite(numero)) return null;
  return negativo ? -numero : numero;
}

/**
 * Cuanto es en pesos. En COP es el mismo numero; en otra moneda hace falta
 * la TRM del dia, y sin ella no se inventa un valor.
 */
export function montoEnPesos(
  moneda: string,
  monto: number | null,
  trm: number | null,
): number | null {
  if (monto === null) return null;
  if (moneda === "COP") return Math.round(monto);
  if (trm === null || trm <= 0) return null;
  return Math.round(monto * trm);
}

/** El mes que usa el Sheet para agrupar: 2026-08. */
export function mesDe(fecha: string): string {
  return /^\d{4}-\d{2}/.test(fecha) ? fecha.slice(0, 7) : "";
}
