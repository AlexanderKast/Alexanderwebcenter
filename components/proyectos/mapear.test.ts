import { describe, expect, it } from "vitest";
import type { ColumnaKanban, Proyecto } from "@/lib/proyectos/types";
import { armarColumnas, colorEstado, proyectoAItem } from "./mapear";

const COLUMNAS: ColumnaKanban[] = [
  { id: "col-1", nombre: "Sin tomar", orden: 1, color: "bg-white/10", esInicial: true, esFinal: false },
  { id: "col-2", nombre: "En proceso", orden: 2, color: "bg-amber-500/15", esInicial: false, esFinal: false },
];

function proyecto(over: Partial<Proyecto> = {}): Proyecto {
  return {
    id: "p-1",
    nombre: "COD Master Pro",
    cliente: "Oswaldo",
    sociedadId: "s-1",
    sociedadNombre: "IA Master Tech",
    responsableId: "u-1",
    responsableNombre: "Samuel Castaño",
    estadoComercial: "En curso",
    columnaId: "col-2",
    orden: 1,
    fechaInicio: "2026-07-21",
    fechaCierreEst: null,
    pptoIngresos: null,
    pptoGastos: null,
    notas: null,
    archivado: false,
    ...over,
  };
}

describe("proyectoAItem", () => {
  it("usa el nombre como titulo y la sociedad como subtitulo", () => {
    const item = proyectoAItem(proyecto());
    expect(item.id).toBe("p-1");
    expect(item.title).toBe("COD Master Pro");
    expect(item.subtitle).toBe("IA Master Tech");
  });

  it("pone el estado comercial en el badge", () => {
    expect(proyectoAItem(proyecto()).badge).toBe("En curso");
  });

  it("dice sin tomar cuando no hay responsable", () => {
    const item = proyectoAItem(proyecto({ responsableId: null, responsableNombre: null }));
    expect(item.meta).toContain("Sin tomar");
  });

  it("muestra el responsable cuando lo hay", () => {
    expect(proyectoAItem(proyecto()).meta).toContain("Samuel Castaño");
  });

  it("muestra el cliente cuando lo hay", () => {
    expect(proyectoAItem(proyecto()).meta).toContain("Oswaldo");
  });

  it("dice sin sociedad cuando no tiene", () => {
    const item = proyectoAItem(proyecto({ sociedadId: null, sociedadNombre: null }));
    expect(item.subtitle).toBe("Sin sociedad");
  });

  it("agrega la fecha de cierre cuando existe", () => {
    const item = proyectoAItem(proyecto({ fechaCierreEst: "2026-12-01" }));
    expect(item.meta).toContain("Cierra 2026-12-01");
  });
});

describe("armarColumnas", () => {
  it("reparte los proyectos por columna", () => {
    const columnas = armarColumnas(
      [proyecto({ id: "a", columnaId: "col-1" }), proyecto({ id: "b", columnaId: "col-2" })],
      COLUMNAS,
    );
    expect(columnas.map((c) => c.items.length)).toEqual([1, 1]);
  });

  it("manda a la columna inicial los proyectos sin columna", () => {
    const columnas = armarColumnas([proyecto({ id: "a", columnaId: null })], COLUMNAS);
    expect(columnas[0].items.map((i) => i.id)).toEqual(["a"]);
  });

  it("respeta el orden de las columnas", () => {
    const columnas = armarColumnas([], COLUMNAS);
    expect(columnas.map((c) => c.label)).toEqual(["Sin tomar", "En proceso"]);
  });

  it("ordena las tarjetas por su campo orden", () => {
    const columnas = armarColumnas(
      [
        proyecto({ id: "b", columnaId: "col-1", orden: 2 }),
        proyecto({ id: "a", columnaId: "col-1", orden: 1 }),
      ],
      COLUMNAS,
    );
    expect(columnas[0].items.map((i) => i.id)).toEqual(["a", "b"]);
  });
});

describe("colorEstado", () => {
  it("da una clase distinta a cada estado", () => {
    expect(colorEstado("En curso")).not.toBe(colorEstado("Perdido"));
  });
});
