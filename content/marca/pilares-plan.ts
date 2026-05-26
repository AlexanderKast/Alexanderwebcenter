export type PilarContenido = {
  numero: number;
  slug: string;
  nombre: string;
  porcentaje: number;
  descripcion: string;
  formatos: string[];
  plataformasIdeales: string[];
  plataformasEvitar: string[];
  hookEjemplo: string;
  ctaModelo: string;
};

export const pilaresPlan: PilarContenido[] = [
  {
    numero: 1,
    slug: "dios",
    nombre: "Mi Caminar con Dios",
    porcentaje: 25,
    descripcion:
      "No predicación. Un hombre de fe con empresa de contenido. Reflexiones personales sin versículos performativos. Cómo la fe moldea la ética de negocios y los momentos de silencio, incertidumbre, certeza.",
    formatos: ["Posts reflexivos LinkedIn/X", "Reels 30-45s IG", "Stories espontáneas"],
    plataformasIdeales: ["Instagram", "LinkedIn", "X"],
    plataformasEvitar: ["TikTok principal (muy corto para profundidad)"],
    hookEjemplo: "Me enseñaron que fe y negocios eran mundos separados. Estaban equivocados.",
    ctaModelo: "Reflexión abierta. Pregunta a la audiencia. Nunca venta directa.",
  },
  {
    numero: 2,
    slug: "estrategia",
    nombre: "Mi Experticia en Estrategia",
    porcentaje: 25,
    descripcion:
      "Frameworks, perspectiva aplicada, errores comunes en LATAM, análisis de tendencias, casos de estudio propios (los 5 pilares, UGC Colombia, KREOON como laboratorios).",
    formatos: ["Carruseles IG 7-10 slides", "Posts largos LinkedIn 1300-2000 chars", "Reels 45-60s", "Threads X", "YT Shorts"],
    plataformasIdeales: ["Instagram", "LinkedIn", "YouTube", "X"],
    plataformasEvitar: [],
    hookEjemplo: "La mayoría de creadores LATAM tienen táctica sin estrategia. Aquí está la diferencia.",
    ctaModelo: "Guarda esto. Comparte con quien necesite. Comenta tu duda de estrategia.",
  },
  {
    numero: 3,
    slug: "ia",
    nombre: "Mi Experticia en IA",
    porcentaje: 20,
    descripcion:
      "Demos en pantalla. Workflows reales. Comparativas de herramientas con criterio propio. IA no reemplaza estrategia, la amplifica. Casos de uso específicos.",
    formatos: ["TikTok/Shorts pantalla compartida", "Reels con overlay", "Carruseles stack IA", "Demos grabadas"],
    plataformasIdeales: ["TikTok", "YouTube Shorts", "Instagram", "LinkedIn"],
    plataformasEvitar: [],
    hookEjemplo: "Uso IA para crear contenido y te muestro exactamente cómo — sin filtros.",
    ctaModelo: "Guarda para implementar. Comenta qué herramienta usas. Pregunta tu bloqueo con IA.",
  },
  {
    numero: 4,
    slug: "proceso",
    nombre: "Mi Proceso y Proyectos",
    porcentaje: 20,
    descripcion:
      "Construcción pública sin dramatismo. Decisiones, dudas, iteraciones. KREOON, Infiny Latam, UGC Colombia, Los Reyes del Contenido como laboratorios. Lo que sale bien y lo que no.",
    formatos: ["Reels proceso semanal", "Stories en tiempo real", "Posts LinkedIn decisiones", "YT Shorts herramientas", "TikTok behind-the-scenes"],
    plataformasIdeales: ["Instagram", "TikTok", "LinkedIn", "YouTube"],
    plataformasEvitar: [],
    hookEjemplo: "Llevo 3 meses construyendo esto y aquí está lo que nadie te cuenta.",
    ctaModelo: "Comparte si estás en proceso similar. Comenta en qué etapa estás.",
  },
  {
    numero: 5,
    slug: "vida-real",
    nombre: "Mi Vida Real",
    porcentaje: 10,
    descripcion:
      "Humanización. No lifestyle de influencer. Persona real detrás de proyectos. Medellín, rutinas, familia (lo que decida compartir), gustos, frustraciones.",
    formatos: ["Stories espontáneas", "TikTok casual sin guión", "Posts IG sin filtro"],
    plataformasIdeales: ["Instagram (Stories)", "TikTok"],
    plataformasEvitar: ["LinkedIn"],
    hookEjemplo: "Medellín a las 7am. Aquí comienza el día real.",
    ctaModelo: "Ninguno obligatorio. Conexión = objetivo.",
  },
];

export const sistemaProduccion = {
  bloques: [
    { nombre: "Ideación", duracion: "90min", dia: "Domingo/Lunes", output: "10-15 ideas asignadas por pilar/plataforma/formato, 7-9 priorizadas" },
    { nombre: "Guiones", duracion: "2 horas", dia: "Lunes/Martes", output: "Guiones + captions + hashtags listos" },
    { nombre: "Grabación", duracion: "2-3 horas", dia: "Martes/Miércoles", output: "Todos los videos de la semana en batch" },
    { nombre: "Edición + Programación", duracion: "2-3 horas", dia: "Jueves/Viernes", output: "Subtítulos + programación IG/TikTok/LinkedIn/X" },
  ],
  stackIa: {
    ideacion: "Claude (prompt brainstorming pilares)",
    guiones: "Claude (voice prompt Alexander)",
    video: "Remotion (videos programáticos)",
    voz: "ElevenLabs (voz Cristian Sánchez)",
    broll: "Veo 3 + Gemini",
    carruseles: "Canva Pro",
    automatizacion: "n8n",
    metricas: "GA4 + nativas",
  },
} as const;

export const formatosGanadores = [
  { nombre: "Framework explicado", estructura: "Nombre + problema + cómo funciona + cómo aplicar", plataformas: "Carrusel IG, Reel" },
  { nombre: "Confesión productiva", estructura: "Algo mal hecho + aprendizaje + cambio", plataformas: "LinkedIn, Reel" },
  { nombre: "Demo herramienta", estructura: "Problema + cómo funciona en pantalla + resultado", plataformas: "TikTok/Short" },
  { nombre: "Opinión caliente", estructura: "Afirmación contraria + razonamiento + consecuencia práctica", plataformas: "LinkedIn, X" },
  { nombre: "Build in public update", estructura: "Estado actual + aprendizaje semana + próximo paso", plataformas: "Reel, Post" },
  { nombre: "Reflexión fe aplicada", estructura: "Principio + manifestación en decisión + invitación", plataformas: "LinkedIn, Reel" },
  { nombre: "Listicle herramientas IA", estructura: "X herramientas para Y + criterio de cada", plataformas: "Carrusel, TikTok" },
  { nombre: "Antes vs Después conceptual", estructura: "Cómo normal vs cómo Alexander + por qué su forma funciona", plataformas: "Carrusel" },
  { nombre: "Día real", estructura: "Un día sin glamour — decisiones, bloqueos, victorias pequeñas", plataformas: "Stories, TikTok" },
  { nombre: "Predicción fundamentada", estructura: "Tendencia que viene + datos + cómo prepararse", plataformas: "LinkedIn, X" },
] as const;
