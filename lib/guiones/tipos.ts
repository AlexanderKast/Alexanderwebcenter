import { z } from "zod";

/**
 * Biblioteca de guiones.
 *
 * Las listas salen del plan de contenido que ya existe (5 pilares, los
 * formatos ganadores): un guion cargado a mano tiene que poder clasificarse
 * igual que uno pensado en el plan, o los informes por pilar no cierran.
 */

export const PILARES = ["Dios", "Estrategia", "IA", "Proceso", "Vida Real"] as const;

export const PLATAFORMAS = [
  "Instagram",
  "TikTok",
  "YouTube",
  "YouTube Shorts",
  "LinkedIn",
  "X",
] as const;

export const FORMATOS = [
  "Reel / Short",
  "Video largo",
  "Carrusel",
  "Post",
  "Thread",
  "Story",
  "Demo en pantalla",
] as const;

export const ESTADOS_GUION = [
  "idea",
  "escribiendo",
  "listo",
  "grabado",
  "publicado",
] as const;

export type EstadoGuion = (typeof ESTADOS_GUION)[number];

export interface Guion {
  id: string;
  titulo: string;
  pilar: string;
  plataforma: string;
  formato: string;
  estado: EstadoGuion;
  gancho: string;
  cuerpo: string;
  notas: string;
  link: string;
  autorNombre: string | null;
  createdAt: string;
  updatedAt: string;
}

export const esquemaGuion = z.object({
  titulo: z.string().trim().min(1, "Ponele un título.").max(200),
  pilar: z.string().trim().max(40),
  plataforma: z.string().trim().max(40),
  formato: z.string().trim().max(40),
  estado: z.enum(ESTADOS_GUION),
  gancho: z.string().trim().max(500),
  cuerpo: z.string().trim().max(20000),
  notas: z.string().trim().max(4000),
  link: z
    .string()
    .trim()
    .max(500)
    .refine(
      (v) => v === "" || /^https?:\/\//i.test(v),
      "El link tiene que empezar con https://",
    ),
});

export type DatosGuion = z.infer<typeof esquemaGuion>;

export function guionVacio(): DatosGuion {
  return {
    titulo: "",
    pilar: "",
    plataforma: "",
    formato: "",
    estado: "idea",
    gancho: "",
    cuerpo: "",
    notas: "",
    link: "",
  };
}

/** Como se ve cada estado en la lista. */
export function colorEstado(estado: EstadoGuion): string {
  switch (estado) {
    case "idea":
      return "bg-white/10 text-white/60";
    case "escribiendo":
      return "bg-sky-500/15 text-sky-300";
    case "listo":
      return "bg-[#D4AF37]/15 text-[#D4AF37]";
    case "grabado":
      return "bg-violet-500/15 text-violet-300";
    case "publicado":
      return "bg-emerald-500/15 text-emerald-300";
  }
}

/** Cuenta cuántos hay en cada estado, para el resumen de arriba. */
export function contarPorEstado(guiones: Guion[]): Record<EstadoGuion, number> {
  const cuenta = {
    idea: 0,
    escribiendo: 0,
    listo: 0,
    grabado: 0,
    publicado: 0,
  } satisfies Record<EstadoGuion, number>;

  for (const guion of guiones) cuenta[guion.estado] += 1;
  return cuenta;
}

/**
 * Cuántos guiones hay por pilar, incluidos los pilares en cero: si un pilar
 * no aparece, no se nota que se está quedando sin contenido.
 */
export function contarPorPilar(guiones: Guion[]): { pilar: string; total: number }[] {
  const cuenta = new Map<string, number>(PILARES.map((p) => [p, 0]));

  for (const guion of guiones) {
    const clave = guion.pilar || "Sin pilar";
    cuenta.set(clave, (cuenta.get(clave) ?? 0) + 1);
  }

  return [...cuenta.entries()].map(([pilar, total]) => ({ pilar, total }));
}
