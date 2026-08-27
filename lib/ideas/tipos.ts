import { z } from "zod";

/**
 * Bandeja de ideas.
 *
 * Una idea entra cruda: alguien la solto por voz y todavia no se sabe si
 * sirve. Por eso el estado arranca en "nueva" y el unico campo obligatorio
 * es el titulo — todo lo demas puede llegar vacio y completarse despues.
 */

export const ESTADOS_IDEA = [
  "nueva",
  "en_revision",
  "aprobada",
  "descartada",
  "convertida",
] as const;

export type EstadoIdea = (typeof ESTADOS_IDEA)[number];

export const ORIGENES_IDEA = ["telegram", "panel"] as const;
export type OrigenIdea = (typeof ORIGENES_IDEA)[number];

/** Como se lee cada estado en pantalla. El de la base es snake_case. */
export const NOMBRE_ESTADO: Record<EstadoIdea, string> = {
  nueva: "Nueva",
  en_revision: "En revisión",
  aprobada: "Aprobada",
  descartada: "Descartada",
  convertida: "Convertida",
};

export interface Idea {
  id: string;
  titulo: string;
  resumen: string;
  transcripcion: string;
  tags: string[];
  estado: EstadoIdea;
  origen: OrigenIdea;
  proyectoId: string | null;
  proyectoNombre: string | null;
  audioPath: string;
  audioSeg: number;
  autorId: string | null;
  autorNombre: string;
  notas: string;
  createdAt: string;
  updatedAt: string;
}

export const esquemaIdea = z.object({
  titulo: z.string().trim().min(1, "Ponele un título.").max(200),
  resumen: z.string().trim().max(2000),
  transcripcion: z.string().trim().max(50000),
  tags: z.array(z.string().trim().min(1).max(40)).max(12),
  estado: z.enum(ESTADOS_IDEA),
  proyectoId: z.string().uuid().nullable(),
  notas: z.string().trim().max(4000),
});

export type DatosIdea = z.infer<typeof esquemaIdea>;

export function ideaVacia(): DatosIdea {
  return {
    titulo: "",
    resumen: "",
    transcripcion: "",
    tags: [],
    estado: "nueva",
    proyectoId: null,
    notas: "",
  };
}

/** Como se ve cada estado en la lista. Mismo criterio que guiones. */
export function colorEstado(estado: EstadoIdea): string {
  switch (estado) {
    case "nueva":
      return "bg-[#D4AF37]/15 text-[#D4AF37]";
    case "en_revision":
      return "bg-sky-500/15 text-sky-300";
    case "aprobada":
      return "bg-emerald-500/15 text-emerald-300";
    case "descartada":
      return "bg-white/10 text-white/40";
    case "convertida":
      return "bg-violet-500/15 text-violet-300";
  }
}

export function contarPorEstado(ideas: Idea[]): Record<EstadoIdea, number> {
  const cuenta = {
    nueva: 0,
    en_revision: 0,
    aprobada: 0,
    descartada: 0,
    convertida: 0,
  } satisfies Record<EstadoIdea, number>;

  for (const idea of ideas) cuenta[idea.estado] += 1;
  return cuenta;
}

/** `1m 20s`. Los audios son cortos: en minutos sueltos no se lee nada. */
export function duracionLegible(segundos: number): string {
  if (segundos <= 0) return "";
  const min = Math.floor(segundos / 60);
  const seg = segundos % 60;
  return min > 0 ? `${min}m ${seg}s` : `${seg}s`;
}

/**
 * Codigos de invitacion del bot.
 *
 * Se leen en voz alta y se tipean en el celular, asi que el alfabeto saca
 * lo que se confunde: 0/O, 1/I/L. Y siempre en mayuscula, para que no
 * importe como lo escriba quien lo canjea.
 */
const ALFABETO = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function generarCodigo(largo = 8): string {
  const bytes = new Uint8Array(largo);
  crypto.getRandomValues(bytes);
  let salida = "";
  for (const b of bytes) salida += ALFABETO[b % ALFABETO.length];
  return salida;
}

export function normalizarCodigo(codigo: string): string {
  return codigo.trim().toUpperCase().replace(/\s+/g, "");
}
