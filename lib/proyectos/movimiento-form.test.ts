import { describe, expect, it } from "vitest";
import {
  armarFilaMovimiento,
  movimientoVacio,
  type DatosMovimiento,
} from "./movimiento-form";
import { mesDe, montoEnPesos, parsearMonto } from "./movimientos-utils";

const NOMBRES = { sociedadNombre: "IA Master Tech", proyectoNombre: "COD Master Pro" };

function datos(cambios: Partial<DatosMovimiento> = {}): DatosMovimiento {
  return {
    ...movimientoVacio("2026-08-26"),
    descripcion: "Hosting",
    monto: "100",
    ...cambios,
  };
}

describe("parsearMonto", () => {
  it("entiende los puntos de miles que se escriben en Colombia", () => {
    expect(parsearMonto("1.500.000")).toBe(1500000);
    expect(parsearMonto("$ 238.080")).toBe(238080);
  });

  it("entiende el formato con comas", () => {
    expect(parsearMonto("1,500,000")).toBe(1500000);
  });

  it("respeta los decimales", () => {
    expect(parsearMonto("19.00")).toBe(19);
    expect(parsearMonto("3.062,96")).toBeCloseTo(3062.96);
  });

  it("devuelve null cuando no hay un número", () => {
    expect(parsearMonto("")).toBeNull();
    expect(parsearMonto("no sé")).toBeNull();
  });
});

describe("montoEnPesos", () => {
  it("en COP es el mismo número", () => {
    expect(montoEnPesos("COP", 238080, null)).toBe(238080);
  });

  it("en USD multiplica por la TRM", () => {
    expect(montoEnPesos("USD", 19, 3062.96)).toBe(58196);
  });

  it("sin TRM no inventa un valor", () => {
    // Es la diferencia entre "no sé cuánto fue" y "fueron 19 pesos".
    expect(montoEnPesos("USD", 19, null)).toBeNull();
    expect(montoEnPesos("USD", 19, 0)).toBeNull();
  });
});

describe("mesDe", () => {
  it("agrupa como el Sheet", () => {
    expect(mesDe("2026-08-26")).toBe("2026-08");
  });
});

describe("armarFilaMovimiento", () => {
  it("arma la fila de un gasto en pesos", () => {
    const resultado = armarFilaMovimiento(
      datos({ monto: "238.080", categoria: "Hosting / Infraestructura" }),
      NOMBRES,
    );

    expect(resultado).toMatchObject({
      fila: {
        tipo: "Egreso",
        moneda: "COP",
        monto: 238080,
        monto_cop: 238080,
        mes: "2026-08",
        origen: "panel",
        sociedad_nombre: "IA Master Tech",
        categoria: "Hosting / Infraestructura",
      },
    });
  });

  it("convierte un gasto en dólares con la TRM", () => {
    const resultado = armarFilaMovimiento(
      datos({ moneda: "USD", monto: "19.00", trm: "3.062,96" }),
      NOMBRES,
    );

    expect("fila" in resultado && resultado.fila.monto_cop).toBe(58196);
  });

  it("no deja pasar dólares sin TRM", () => {
    const resultado = armarFilaMovimiento(datos({ moneda: "USD", monto: "19" }), NOMBRES);

    expect("error" in resultado).toBe(true);
  });

  it("rechaza un monto que no se entiende", () => {
    expect("error" in armarFilaMovimiento(datos({ monto: "abc" }), NOMBRES)).toBe(true);
    expect("error" in armarFilaMovimiento(datos({ monto: "0" }), NOMBRES)).toBe(true);
  });

  it("descarta una categoría que no es de ese tipo", () => {
    // "Venta servicio" es de ingreso; en un egreso no significa nada y
    // ensuciaría los informes por categoría.
    const resultado = armarFilaMovimiento(
      datos({ tipo: "Egreso", categoria: "Venta servicio" }),
      NOMBRES,
    );

    expect("fila" in resultado && resultado.fila.categoria).toBe("");
  });

  it("deja vacíos los ids que no se eligieron", () => {
    const resultado = armarFilaMovimiento(datos({ sociedadId: "", proyectoId: "" }), {
      sociedadNombre: "",
      proyectoNombre: "",
    });

    expect("fila" in resultado && resultado.fila.sociedad_id).toBeNull();
    expect("fila" in resultado && resultado.fila.proyecto_id).toBeNull();
  });
});
