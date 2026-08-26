import { describe, expect, it } from "vitest";
import {
  contarPorEstado,
  contarPorPilar,
  esquemaGuion,
  guionVacio,
  type Guion,
} from "./tipos";

function guion(cambios: Partial<Guion> = {}): Guion {
  return {
    id: "1",
    titulo: "Un guión",
    pilar: "IA",
    plataforma: "TikTok",
    formato: "Reel / Short",
    estado: "idea",
    gancho: "",
    cuerpo: "",
    notas: "",
    link: "",
    autorNombre: null,
    createdAt: "2026-08-26T00:00:00Z",
    updatedAt: "2026-08-26T00:00:00Z",
    ...cambios,
  };
}

describe("esquemaGuion", () => {
  it("exige el título", () => {
    expect(esquemaGuion.safeParse(guionVacio()).success).toBe(false);
  });

  it("guarda una idea con el título solo", () => {
    // Anotar la idea y volver después es el uso normal.
    const r = esquemaGuion.safeParse({ ...guionVacio(), titulo: "Idea suelta" });
    expect(r.success).toBe(true);
  });

  it("acepta el link vacío pero no uno a medias", () => {
    const base = { ...guionVacio(), titulo: "x" };
    expect(esquemaGuion.safeParse({ ...base, link: "" }).success).toBe(true);
    expect(esquemaGuion.safeParse({ ...base, link: "instagram.com/p/1" }).success).toBe(
      false,
    );
    expect(
      esquemaGuion.safeParse({ ...base, link: "https://instagram.com/p/1" }).success,
    ).toBe(true);
  });
});

describe("contarPorEstado", () => {
  it("cuenta cada estado y deja los vacíos en cero", () => {
    const cuenta = contarPorEstado([
      guion({ estado: "idea" }),
      guion({ estado: "idea" }),
      guion({ estado: "publicado" }),
    ]);

    expect(cuenta.idea).toBe(2);
    expect(cuenta.publicado).toBe(1);
    expect(cuenta.grabado).toBe(0);
  });
});

describe("contarPorPilar", () => {
  it("muestra los pilares en cero", () => {
    // Un pilar que no aparece es justamente el que se está quedando sin
    // contenido: esconderlo seria esconder el problema.
    const cuenta = contarPorPilar([guion({ pilar: "IA" })]);
    const porNombre = Object.fromEntries(cuenta.map((c) => [c.pilar, c.total]));

    expect(porNombre["IA"]).toBe(1);
    expect(porNombre["Dios"]).toBe(0);
    expect(porNombre["Vida Real"]).toBe(0);
  });

  it("junta aparte los que no tienen pilar", () => {
    const cuenta = contarPorPilar([guion({ pilar: "" }), guion({ pilar: "" })]);
    const sinPilar = cuenta.find((c) => c.pilar === "Sin pilar");

    expect(sinPilar?.total).toBe(2);
  });
});
