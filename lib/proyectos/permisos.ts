import type { Role } from "@/lib/auth";

/**
 * Quien puede hacer que en el panel interno.
 *
 * El tester es el rol que se le da a alguien de afuera para que mire y
 * reporte: ve el tablero y escribe notas, pero no toca nada mas.
 */

/** Mover tarjetas, crear y editar proyectos, tareas y links. */
export function puedeEditarProyectos(rol: Role): boolean {
  return rol !== "tester";
}

/** Editar columnas del tablero y ver sociedades, socios y porcentajes. */
export function puedeGestionarConfiguracion(rol: Role): boolean {
  return rol === "founder" || rol === "manager";
}

/** Dar de alta gente nueva en el panel. */
export function puedeInvitar(rol: Role): boolean {
  return rol === "founder";
}

/** Dejar notas y reportar bugs. Todos, incluido el tester. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- la firma se mantiene por simetria y por si algun rol deja de poder comentar
export function puedeComentar(_rol: Role): boolean {
  return true;
}
