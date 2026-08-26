import { describe, expect, it } from "vitest";
import {
  formatearCOP,
  huellaDe,
  parsearMovimientos,
  PRIMERA_FILA_DATOS,
} from "./movimientos-utils";

/** Una fila de la hoja, con los indices que usa el Sheet real. */
function fila(valores: Record<number, string>): string[] {
  const salida: string[] = [];
  for (let i = 0; i <= 22; i++) salida.push(valores[i] ?? "");
  return salida;
}

/** Las 4 primeras filas del Sheet son titulo, ayuda y encabezados. */
function hoja(...filas: string[][]): string[][] {
  const relleno = Array.from({ length: PRIMERA_FILA_DATOS }, () => [] as string[]);
  return [...relleno, ...filas];
}

const GASTO_EN_USD = fila({
  0: "2026-07-22",
  1: "2026-07",
  2: "IA Master Tech",
  3: "Operación general",
  4: "Egreso",
  5: "Software / Herramientas",
  6: "CLAUDE",
  7: "USD",
  8: "100.00",
  10: "3,238.19",
  11: "$323,819",
  18: "Alexander",
  19: "Tarjeta",
  20: "Pagado",
});

describe("parsearMovimientos", () => {
  it("lee un gasto en dólares y lo deja en pesos", () => {
    const [movimiento] = parsearMovimientos(hoja(GASTO_EN_USD));

    expect(movimiento).toMatchObject({
      fecha: "2026-07-22",
      sociedad: "IA Master Tech",
      proyecto: "Operación general",
      tipo: "Egreso",
      moneda: "USD",
      monto: 100,
      trm: 3238.19,
      montoCop: 323819,
    });
  });

  it("descarta las filas a medio escribir", () => {
    // Pasa en el Sheet real: alguien pone la fecha y la sociedad y se va.
    const aMedias = fila({ 0: "2026-07-23", 2: "IA Master Tech" });

    expect(parsearMovimientos(hoja(aMedias))).toEqual([]);
  });

  it("descarta lo que no mueve plata", () => {
    const sinMonto = fila({
      0: "2026-08-01",
      2: "Nuskin",
      4: "Egreso",
      6: "pendiente de cotizar",
      11: "-",
    });

    expect(parsearMovimientos(hoja(sinMonto))).toEqual([]);
  });

  it("guarda el reparto de los gastos compartidos", () => {
    const compartido = fila({
      0: "2026-08-11",
      2: "Compartido",
      3: "Operación general",
      4: "Egreso",
      6: "VPS - HOSTINGER",
      7: "COP",
      11: "$394,800",
      15: "$131,600",
      16: "$131,600",
      17: "$131,600",
    });

    const [movimiento] = parsearMovimientos(hoja(compartido));

    expect(movimiento.asignadoEcomnoticias).toBe(131600);
    expect(movimiento.asignadoIaMaster).toBe(131600);
    expect(movimiento.asignadoNuskin).toBe(131600);
  });

  it("entiende un ingreso", () => {
    const cobro = fila({
      0: "2026-08-20",
      2: "EcomNoticias",
      3: "Pagina Web",
      4: "Ingreso",
      6: "Anticipo",
      11: "$1,500,000",
    });

    const [movimiento] = parsearMovimientos(hoja(cobro));

    expect(movimiento.tipo).toBe("Ingreso");
    expect(movimiento.montoCop).toBe(1500000);
  });
});

describe("huellaDe", () => {
  it("no cambia si se corrige el medio de pago", () => {
    const [antes] = parsearMovimientos(hoja(GASTO_EN_USD));

    const corregido = [...GASTO_EN_USD];
    corregido[19] = "Nequi";
    corregido[20] = "Por pagar";
    const [despues] = parsearMovimientos(hoja(corregido));

    // Si cambiara, reimportar duplicaria el gasto en lugar de actualizarlo.
    expect(despues.huella).toBe(antes.huella);
  });

  it("cambia si cambia el monto", () => {
    const [antes] = parsearMovimientos(hoja(GASTO_EN_USD));

    const otro = [...GASTO_EN_USD];
    otro[11] = "$400,000";
    const [despues] = parsearMovimientos(hoja(otro));

    expect(despues.huella).not.toBe(antes.huella);
  });

  it("distingue la operación general de cada sociedad", () => {
    const base = {
      fecha: "2026-07-22",
      mes: "2026-07",
      proyecto: "Operación general",
      tipo: "Egreso" as const,
      categoria: "",
      descripcion: "CLAUDE",
      moneda: "USD",
      monto: 100,
      trm: null,
      montoCop: 323819,
      asignadoEcomnoticias: 0,
      asignadoIaMaster: 0,
      asignadoNuskin: 0,
      pagadoPor: "",
      medioPago: "",
      estado: "",
      nota: "",
    };

    expect(huellaDe({ ...base, sociedad: "IA Master Tech" })).not.toBe(
      huellaDe({ ...base, sociedad: "EcomNoticias" }),
    );
  });
});

describe("formatearCOP", () => {
  it("muestra pesos sin decimales", () => {
    // El separador de miles de es-CO es un punto. El espacio que mete Intl
    // puede ser duro o normal segun la version de Node.
    expect(formatearCOP(655601).replace(/\s/g, " ")).toBe("$ 655.601");
  });

  it("marca los negativos", () => {
    expect(formatearCOP(-58196)).toContain("-");
  });
});
