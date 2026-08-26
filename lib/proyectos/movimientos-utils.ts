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
