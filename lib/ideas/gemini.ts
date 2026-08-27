import "server-only";

/**
 * Nota de voz -> idea escrita, con Gemini.
 *
 * Gemini lee el audio directo, asi que transcribir y resumir es una sola
 * llamada. Con Whisper serian dos (transcribir, despues pedirle el titulo a
 * un LLM): el doble de latencia y de costo para el mismo resultado.
 *
 * Es la misma via que ya se usa en las automatizaciones, no una tercera
 * cuenta de IA para mantener.
 */

// Variable propia y no GEMINI_MODEL: esa la comparten otras partes y puede
// estar en un modelo que no escucha audio. Aca, si no se elige nada, tiene
// que caer en uno que si.
const MODELO = process.env.GEMINI_MODEL_AUDIO || "gemini-2.5-flash";
const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";

/** Audios largos son monologos, no ideas. Se corta antes de gastar tokens. */
const MAX_BYTES = 25 * 1024 * 1024;

export interface IdeaTranscrita {
  titulo: string;
  resumen: string;
  transcripcion: string;
  tags: string[];
}

export type ResultadoTranscripcion =
  | { ok: true; idea: IdeaTranscrita }
  | { ok: false; error: string };

const COMUN = `Sos el asistente de una bandeja de ideas de un equipo de marketing y contenido colombiano.

Devolvé:
- "titulo": máximo 60 caracteres, concreto y en minúscula salvo nombres propios. Que se entienda de qué es la idea leyendo solo eso. Nada de "Idea sobre..." ni "Propuesta de...".
- "resumen": 1 a 3 frases con el fondo de la idea y, si lo dijo, qué habría que hacer. Si la idea es muy corta, repetila en una frase; no inventes.
- "tags": entre 1 y 5 etiquetas de una o dos palabras, en minúscula, sin #.

Nunca inventes datos, nombres, cifras ni fechas que no estén en lo que te mandaron.`;

const INSTRUCCION_AUDIO = `${COMUN}

Te llega una nota de voz donde alguien suelta una idea sin pensarla mucho: puede irse por las ramas, repetirse o cortarse a mitad.

Además de lo de arriba devolvé:
- "transcripcion": lo que dijo, literal y completo, en español. Limpiá solo muletillas repetidas ("eh", "este", "o sea" encadenados) y arreglá la puntuación. No resumas, no agregues, no interpretes.

Si el audio no se entiende o está vacío, devolvé todo en cadena vacía y tags en lista vacía.`;

/**
 * El texto ya esta escrito, asi que no hay nada que transcribir: la
 * transcripcion es lo que la persona mando, palabra por palabra. Pedirle al
 * modelo que la "devuelva" es invitarlo a corregirle la idea a alguien.
 */
const INSTRUCCION_TEXTO = `${COMUN}

Te llega una idea escrita a las apuradas, tal vez sin puntuación ni orden.

No reescribas ni corrijas lo que mandaron: solo devolvé el título, el resumen y las etiquetas.

Si el mensaje no dice nada aprovechable, devolvé todo en cadena vacía y tags en lista vacía.`;

const ESQUEMA = {
  type: "OBJECT",
  properties: {
    titulo: { type: "STRING" },
    resumen: { type: "STRING" },
    transcripcion: { type: "STRING" },
    tags: { type: "ARRAY", items: { type: "STRING" } },
  },
  required: ["titulo", "resumen", "transcripcion", "tags"],
} as const;

interface RespuestaGemini {
  candidates?: { content?: { parts?: { text?: string }[] } }[];
  error?: { message?: string };
}

/** Recorta y limpia lo que devolvio el modelo antes de que toque la base. */
function sanear(crudo: unknown): IdeaTranscrita {
  const obj = (crudo ?? {}) as Record<string, unknown>;
  const texto = (v: unknown, max: number) =>
    typeof v === "string" ? v.trim().slice(0, max) : "";

  const tags = Array.isArray(obj.tags)
    ? obj.tags
        .filter((t): t is string => typeof t === "string")
        .map((t) => t.trim().toLowerCase().replace(/^#/, "").slice(0, 40))
        .filter(Boolean)
        .slice(0, 5)
    : [];

  return {
    titulo: texto(obj.titulo, 200),
    resumen: texto(obj.resumen, 2000),
    transcripcion: texto(obj.transcripcion, 50000),
    tags,
  };
}

/** La llamada a Gemini. Solo cambia la instruccion y lo que se le manda. */
async function pedir(
  instruccion: string,
  partes: Record<string, unknown>[],
): Promise<ResultadoTranscripcion> {
  const key = process.env.GOOGLE_API_KEY;
  if (!key) return { ok: false, error: "Falta GOOGLE_API_KEY." };

  let respuesta: Response;
  try {
    respuesta = await fetch(
      `${ENDPOINT}/${MODELO}:generateContent?key=${encodeURIComponent(key)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: instruccion }] },
          contents: [{ role: "user", parts: partes }],
          generationConfig: {
            // Transcribir no es escribir: cualquier libertad aca es una
            // palabra que la persona no dijo.
            temperature: 0.2,
            responseMimeType: "application/json",
            responseSchema: ESQUEMA,
          },
        }),
        signal: AbortSignal.timeout(120_000),
      },
    );
  } catch (e) {
    console.error("[ideas] gemini fetch:", e);
    return { ok: false, error: "No pude contactar a Gemini." };
  }

  const cuerpo = (await respuesta.json().catch(() => null)) as RespuestaGemini | null;

  if (!respuesta.ok || !cuerpo) {
    console.error("[ideas] gemini:", respuesta.status, cuerpo?.error?.message);
    return { ok: false, error: "Gemini no pudo procesar el audio." };
  }

  const texto = cuerpo.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!texto) return { ok: false, error: "Gemini devolvió una respuesta vacía." };

  let crudo: unknown;
  try {
    crudo = JSON.parse(texto);
  } catch {
    console.error("[ideas] gemini json invalido");
    return { ok: false, error: "Gemini devolvió algo que no pude leer." };
  }

  return { ok: true, idea: sanear(crudo) };
}

/** Nota de voz -> idea escrita, con la transcripcion adentro. */
export async function transcribirIdea(
  audio: Buffer,
  mimeType: string,
): Promise<ResultadoTranscripcion> {
  if (audio.byteLength > MAX_BYTES) {
    return { ok: false, error: "El audio es muy largo. Mandá uno más corto." };
  }

  const salida = await pedir(INSTRUCCION_AUDIO, [
    { inlineData: { mimeType, data: audio.toString("base64") } },
  ]);
  if (!salida.ok) return salida;

  const { idea } = salida;
  if (!idea.transcripcion && !idea.titulo) {
    return { ok: false, error: "No se entendió nada en el audio." };
  }

  // Un audio entendible pero sin titulo igual tiene que poder guardarse: la
  // idea esta en la transcripcion y el titulo se arregla en el panel.
  if (!idea.titulo) idea.titulo = idea.transcripcion.slice(0, 60);

  return { ok: true, idea };
}

/**
 * Idea escrita -> mismo titulo, resumen y tags que una nota de voz.
 *
 * La transcripcion no la pone el modelo: es el texto original, intacto. Que
 * escribir en vez de hablar deje una idea peor ordenada seria un castigo por
 * estar en un lugar donde no se puede mandar un audio.
 */
export async function resumirTexto(entrada: string): Promise<ResultadoTranscripcion> {
  const texto = entrada.trim().slice(0, 50000);
  if (!texto) return { ok: false, error: "El mensaje está vacío." };

  const salida = await pedir(INSTRUCCION_TEXTO, [{ text: texto }]);
  if (!salida.ok) return salida;

  return {
    ok: true,
    idea: {
      ...salida.idea,
      transcripcion: texto,
      titulo: salida.idea.titulo || texto.slice(0, 60),
    },
  };
}
