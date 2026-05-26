import { NextRequest, NextResponse } from 'next/server';
import { predictSuggestions } from '@/lib/clientes/groq';

const CAMPO_CONFIGS: Record<string, { instruccion: string; n: number }> = {
  problemaPrincipal: {
    instruccion: 'Sugiere posibles problemas que enfrenta la audiencia de esa industria/nicho. Cada sugerencia debe comenzar con un verbo o con "No saber", "Falta de", "Dificultad para".',
    n: 3,
  },
  ventajaCompetitiva: {
    instruccion: 'Sugiere posibles diferenciadores frente a la competencia. Cada sugerencia debe ser un ARRANQUE de frase que el usuario pueda completar, como "La diferencia está en cómo..." o "A diferencia de otros...".',
    n: 2,
  },
  expresionesNaturales: {
    instruccion: 'Sugiere expresiones o frases que podrían sonar auténticas a esta marca, coherentes con su estilo comunicacional. Deben ser coloquiales o características de la voz ya definida.',
    n: 3,
  },
  creenciasFundamentales: {
    instruccion: 'Sugiere posibles creencias o paradigmas que esta marca podría defender. Cada sugerencia debe ser el INICIO de una creencia, no la creencia completa — algo como "Creemos que..." o "La verdad es que...".',
    n: 2,
  },
  mensajeCentral: {
    instruccion: 'Sugiere posibles mensajes centrales basados en los pilares y creencias del usuario. Cada uno debe ser el INICIO de una idea, no el mensaje completo.',
    n: 2,
  },
};

export async function POST(request: NextRequest) {
  try {
    const { campo, contexto } = await request.json() as {
      campo: string;
      contexto: Record<string, string | string[] | number>;
    };

    const config = CAMPO_CONFIGS[campo];
    if (!config) return NextResponse.json({ sugerencias: [] });

    const sugerencias = await predictSuggestions({
      campo,
      instruccion: config.instruccion,
      contexto,
      n: config.n,
    });

    return NextResponse.json({ sugerencias });
  } catch {
    return NextResponse.json({ sugerencias: [] });
  }
}
