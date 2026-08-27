import { describe, expect, it } from "vitest";
import {
  contarPorEstado,
  duracionLegible,
  esquemaIdea,
  generarCodigo,
  ideaVacia,
  normalizarCodigo,
  type Idea,
} from "./tipos";

function idea(cambios: Partial<Idea> = {}): Idea {
  return {
    id: "1",
    titulo: "Una idea",
    resumen: "",
    transcripcion: "",
    tags: [],
    estado: "nueva",
    origen: "telegram",
    proyectoId: null,
    proyectoNombre: null,
    audioPath: "",
    audioSeg: 0,
    autorId: null,
    autorNombre: "Alexander",
    notas: "",
    createdAt: "2026-08-26T00:00:00Z",
    updatedAt: "2026-08-26T00:00:00Z",
    ...cambios,
  };
}

describe("contarPorEstado", () => {
  it("cuenta cada estado y deja los vacíos en cero", () => {
    const cuenta = contarPorEstado([
      idea({ estado: "nueva" }),
      idea({ estado: "nueva" }),
      idea({ estado: "aprobada" }),
    ]);

    expect(cuenta.nueva).toBe(2);
    expect(cuenta.aprobada).toBe(1);
    expect(cuenta.descartada).toBe(0);
  });
});

describe("duracionLegible", () => {
  it("muestra los segundos solos cuando no llega al minuto", () => {
    expect(duracionLegible(45)).toBe("45s");
  });

  it("parte en minutos y segundos", () => {
    expect(duracionLegible(80)).toBe("1m 20s");
  });

  it("no muestra nada cuando no hay audio", () => {
    expect(duracionLegible(0)).toBe("");
  });
});

describe("esquemaIdea", () => {
  it("exige un título", () => {
    const resultado = esquemaIdea.safeParse(ideaVacia());
    expect(resultado.success).toBe(false);
  });

  it("acepta una idea con solo el título", () => {
    const resultado = esquemaIdea.safeParse({
      ...ideaVacia(),
      titulo: "Probar el bot",
    });
    expect(resultado.success).toBe(true);
  });

  it("rechaza un proyecto que no es un uuid", () => {
    const resultado = esquemaIdea.safeParse({
      ...ideaVacia(),
      titulo: "Con proyecto",
      proyectoId: "el-proyecto-de-antes",
    });
    expect(resultado.success).toBe(false);
  });
});

describe("códigos de invitación", () => {
  it("no usa caracteres que se confunden al dictarlos", () => {
    // 0/O y 1/I/L son los que hacen que un código dictado no entre.
    for (let i = 0; i < 50; i += 1) {
      expect(generarCodigo()).not.toMatch(/[01OIL]/);
    }
  });

  it("normaliza como lo escribiría alguien en el celular", () => {
    expect(normalizarCodigo("  abc 23x  ")).toBe("ABC23X");
  });
});
