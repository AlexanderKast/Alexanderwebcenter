const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

interface PredictOptions {
  campo: string;
  instruccion: string;
  contexto: Record<string, string | string[] | number>;
  n?: number;
}

export async function predictSuggestions(opts: PredictOptions): Promise<string[]> {
  const { campo, instruccion, contexto, n = 3 } = opts;

  const contextStr = Object.entries(contexto)
    .filter(([, v]) => v && (Array.isArray(v) ? v.length > 0 : String(v).length > 0))
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
    .join('\n');

  if (!contextStr) return [];

  const systemPrompt = `Eres un asistente de estrategia de marca que ayuda a completar un formulario de intake.
El usuario está llenando el campo "${campo}".
${instruccion}

Reglas estrictas:
- Genera exactamente ${n} sugerencias cortas (máximo 15 palabras cada una)
- Cada sugerencia es una IDEA SEMILLA o ARRANQUE, no texto final listo para copiar
- El usuario debe pensar y completar la idea — no le des la respuesta
- Tono neutro y descriptivo, nunca vendedor ni persuasivo
- Responde SOLO con un array JSON válido: ["sugerencia 1", "sugerencia 2", ...]
- Si el contexto no tiene suficiente información, responde con: []`;

  const userMessage = `Información ya ingresada:\n${contextStr}\n\nGenera ${n} sugerencias de arranque para el campo "${campo}".`;

  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GROQ_API}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 300,
    }),
  });

  if (!res.ok) return [];

  const json = await res.json();
  const content: string = json.choices?.[0]?.message?.content ?? '[]';

  try {
    const match = content.match(/\[[\s\S]*\]/);
    if (!match) return [];
    const parsed = JSON.parse(match[0]);
    if (Array.isArray(parsed)) return parsed.filter((s): s is string => typeof s === 'string').slice(0, n);
  } catch {}

  return [];
}
