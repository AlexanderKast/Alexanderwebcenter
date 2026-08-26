import { describe, expect, it } from "vitest";
import type { Role } from "@/lib/auth";
import {
  puedeComentar,
  puedeEditarProyectos,
  puedeGestionarConfiguracion,
  puedeInvitar,
} from "./permisos";

const TODOS: Role[] = [
  "founder",
  "manager",
  "coordinator",
  "sales",
  "creative",
  "tester",
];

describe("puedeEditarProyectos", () => {
  it("deja a todos menos al tester", () => {
    for (const rol of TODOS) {
      expect(puedeEditarProyectos(rol)).toBe(rol !== "tester");
    }
  });
});

describe("puedeGestionarConfiguracion", () => {
  it("solo founder y manager", () => {
    expect(puedeGestionarConfiguracion("founder")).toBe(true);
    expect(puedeGestionarConfiguracion("manager")).toBe(true);
    expect(puedeGestionarConfiguracion("coordinator")).toBe(false);
    expect(puedeGestionarConfiguracion("creative")).toBe(false);
    expect(puedeGestionarConfiguracion("sales")).toBe(false);
    expect(puedeGestionarConfiguracion("tester")).toBe(false);
  });
});

describe("puedeInvitar", () => {
  it("solo founder", () => {
    for (const rol of TODOS) {
      expect(puedeInvitar(rol)).toBe(rol === "founder");
    }
  });
});

describe("puedeComentar", () => {
  it("todos pueden, incluido el tester", () => {
    for (const rol of TODOS) {
      expect(puedeComentar(rol)).toBe(true);
    }
  });
});
