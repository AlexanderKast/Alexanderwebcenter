import { describe, expect, it } from "vitest";
import {
  celda,
  limpiarMoneda,
  limpiarPorcentaje,
  normalizarFecha,
  parsearCSV,
} from "./importar-utils";

describe("parsearCSV", () => {
  it("separa filas y columnas simples", () => {
    expect(parsearCSV("a,b\nc,d")).toEqual([
      ["a", "b"],
      ["c", "d"],
    ]);
  });

  it("respeta las comas dentro de comillas", () => {
    expect(parsearCSV('IA Master Tech,"Alexander, Juan Carmona"')).toEqual([
      ["IA Master Tech", "Alexander, Juan Carmona"],
    ]);
  });

  it("entiende las comillas escapadas", () => {
    expect(parsearCSV('"dijo ""hola""",x')).toEqual([['dijo "hola"', "x"]]);
  });

  it("acepta saltos de linea dentro de comillas", () => {
    expect(parsearCSV('"linea1\nlinea2",b')).toEqual([["linea1\nlinea2", "b"]]);
  });

  it("normaliza CRLF", () => {
    expect(parsearCSV("a,b\r\nc,d")).toEqual([
      ["a", "b"],
      ["c", "d"],
    ]);
  });

  it("devuelve arreglo vacio con texto vacio", () => {
    expect(parsearCSV("")).toEqual([]);
  });
});

describe("normalizarFecha", () => {
  it("convierte D/M/YYYY a ISO", () => {
    expect(normalizarFecha("21/7/2026")).toBe("2026-07-21");
  });

  it("convierte DD/MM/YYYY a ISO", () => {
    expect(normalizarFecha("17/08/2026")).toBe("2026-08-17");
  });

  it("deja pasar una fecha que ya viene ISO", () => {
    expect(normalizarFecha("2026-07-22")).toBe("2026-07-22");
  });

  it("devuelve null con celda vacia", () => {
    expect(normalizarFecha("")).toBeNull();
    expect(normalizarFecha(undefined)).toBeNull();
    expect(normalizarFecha(null)).toBeNull();
  });

  it("devuelve null con basura", () => {
    expect(normalizarFecha("—")).toBeNull();
    expect(normalizarFecha("proximamente")).toBeNull();
  });

  it("devuelve null con una fecha imposible", () => {
    expect(normalizarFecha("32/13/2026")).toBeNull();
  });
});

describe("limpiarMoneda", () => {
  it("quita simbolo y separadores de miles", () => {
    expect(limpiarMoneda("$655,601")).toBe(655601);
  });

  it("entiende decimales", () => {
    expect(limpiarMoneda("238,080.00")).toBe(238080);
  });

  it("lee los parentesis como negativo", () => {
    expect(limpiarMoneda("($58,196)")).toBe(-58196);
  });

  it("devuelve null con guion o vacio", () => {
    expect(limpiarMoneda("-")).toBeNull();
    expect(limpiarMoneda("")).toBeNull();
    expect(limpiarMoneda(undefined)).toBeNull();
  });
});

describe("limpiarPorcentaje", () => {
  it("convierte 33.3% en numero", () => {
    expect(limpiarPorcentaje("33.3%")).toBe(33.3);
  });

  it("acepta el numero sin simbolo", () => {
    expect(limpiarPorcentaje("40")).toBe(40);
  });

  it("devuelve null con vacio", () => {
    expect(limpiarPorcentaje("")).toBeNull();
  });
});

describe("celda", () => {
  it("recorta el contenido", () => {
    expect(celda(["  hola  ", "b"], 0)).toBe("hola");
  });

  it("devuelve cadena vacia si el indice no existe", () => {
    expect(celda(["a"], 5)).toBe("");
  });
});
