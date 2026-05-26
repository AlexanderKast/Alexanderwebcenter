export type PlataformaConfig = {
  id: string;
  nombre: string;
  handle: string;
  url?: string;
  bio: string;
  frecuencia: string;
  duracionIdeal?: string;
  formatoDominante: string;
  pilaresFoco?: string;
  hashtagsCore?: string[];
  horariosSugeridos?: string[];
  ctas?: string[];
  kpis90Dias: Record<string, string>;
  highlightsOPlaylists?: string[];
  notas?: string;
};

export const plataformas: PlataformaConfig[] = [
  {
    id: "instagram",
    nombre: "Instagram",
    handle: "@alexemprendee",
    url: "https://instagram.com/alexemprendee",
    bio: "Estratega Digital, de Contenido y IA. Dios. Estrategia. IA. Construyo con fe y proceso — no con suerte. Fundador @kreoon.app",
    frecuencia: "3 Reels/Carruseles + 7 Stories por semana",
    duracionIdeal: "Reels 30-60s, Carruseles 7-10 slides",
    formatoDominante: "Reels + Carruseles",
    hashtagsCore: [
      "emprendimiento",
      "contenidodigital",
      "marketingdigital",
      "inteligenciaartificial",
      "emprendimientolatam",
      "creadordecontenido",
      "estrategiadigital",
      "marcapersonal",
      "kreoon",
      "alexemprendee",
    ],
    horariosSugeridos: [
      "Reels 7-8pm Lun/Mié/Vie",
      "Carrusel 12-1pm Mié",
      "Stories 7:30-8am + 8-9pm",
    ],
    ctas: ["Guarda esto", "Comenta tu caso", "Comparte con quien necesite"],
    highlightsOPlaylists: [
      "Proceso — flujo trabajo IA, n8n, automatización",
      "Fe y Negocio — reflexiones de fe aplicada",
      "KREOON — demos plataforma",
      "Contenido + UGC — behind the scenes",
      "Herramientas IA — tutoriales y stacks",
      "Comunidad — Los Reyes del Contenido",
    ],
    kpis90Dias: {
      seguidores: "500-1.000 reales",
      alcanceReel: "500-3.000 por video",
      engagement: "3-8%",
      saves: "5-20 por carrusel",
    },
  },
  {
    id: "tiktok",
    nombre: "TikTok",
    handle: "@alex.emprendee",
    url: "https://tiktok.com/@alex.emprendee",
    bio: "Estratega Digital + IA | Dios. Estrategia. IA. Medellín — KREOON",
    frecuencia: "4-5 videos por semana",
    duracionIdeal: "45-90s autoridad · 15-30s hooks virales",
    formatoDominante: "Talking head + pantalla compartida",
    pilaresFoco: "Proceso 40% · Opinión 25% · Tutorial 20% · Fe 15%",
    hashtagsCore: [
      "estrategiadigital",
      "marketingdigital",
      "emprendimientolatam",
      "inteligenciaartificial",
      "automatizacion",
      "herramientasIA",
      "alexemprendee",
    ],
    horariosSugeridos: ["Lun 6pm", "Mié 12pm", "Vie 7pm", "Sáb 10am"],
    ctas: ["Guarda para implementar", "Comenta tu pregunta", "Sígueme para más"],
    kpis90Dias: {
      seguidores: "300-800",
      completacion: "40%+",
      meta: "Identificar contenido que resuena",
    },
  },
  {
    id: "youtube",
    nombre: "YouTube",
    handle: "@alex.emprendee",
    url: "https://youtube.com/@alex.emprendee",
    bio: "Estrategia digital, contenido e IA para emprendedores en LATAM. Proceso real sin la versión pulida.",
    frecuencia: "1 video largo (10-20 min) + 2 Shorts por semana",
    duracionIdeal: "Long-form 10-20min · Shorts <60s",
    formatoDominante: "Videos largos profundidad + Shorts tutoriales",
    ctas: ["Suscríbete para ver el proceso, no el resultado filtrado"],
    highlightsOPlaylists: [
      "IA Para Creadores",
      "Estrategia de Contenido",
      "Emprendimiento Digital en LATAM",
      "UGC y Contenido Auténtico",
      "Dios y Proceso",
    ],
    kpis90Dias: {
      suscriptores: "100-400",
      retencionShorts: "50%+",
      crecimientoMes: "+20-80 suscriptores",
    },
  },
  {
    id: "linkedin",
    nombre: "LinkedIn",
    handle: "alexandercast",
    url: "https://linkedin.com/in/alexandercast",
    bio: "Estratega digital, de contenido e IA. Fundador de KREOON, Infiny Latam, UGC Colombia y Los Reyes del Contenido.",
    frecuencia: "3-4 posts por semana",
    formatoDominante: "Posts texto largo 1.300-2.000 caracteres (ganan al video 2:1 en B2B)",
    pilaresFoco: "Estrategia 40% · Proceso 30% · Fe aplicada 20% · IA 10%",
    ctas: ["Preguntas específicas que inviten a comentar"],
    notas:
      "Primera línea = hook autónomo que funciona antes del 'ver más'. No uses links en el post (van en un comentario fijo).",
    kpis90Dias: {
      conexiones: "+300-500 ICP",
      impresionesPost: "200-1.500",
      engagement: "2-5%",
    },
  },
  {
    id: "x",
    nombre: "X (Twitter)",
    handle: "@alexemprendee",
    url: "https://x.com/alexemprendee",
    bio: "Estrategia, contenido e IA. Construyendo en público desde Medellín.",
    frecuencia: "Diaria · Threads Lun y Mié · Tweets sueltos resto",
    formatoDominante: "Threads 5-10 tweets + tweets individuales",
    ctas: ["Un insight por tweet, sin relleno"],
    notas:
      "Laboratorio de ideas. Los que generen engagement se convierten en carrusel o video. No hashtags en threads.",
    kpis90Dias: {
      seguidores: "500-1.500",
      impresiones: "5k-25k/mes",
    },
  },
  {
    id: "newsletter",
    nombre: "Newsletter",
    handle: "Dios, Estrategia e IA",
    bio: "Ensayo profundo semanal sin distracción del algoritmo.",
    frecuencia: "1 por semana (domingo)",
    formatoDominante: "Ensayo personal 600-1.200 palabras",
    ctas: ["Responde este correo", "Descarga el recurso", "Agenda llamada"],
    kpis90Dias: {
      suscriptores: "500-1.500 mes 6",
      openRate: "45%+",
      clickRate: "8%+",
    },
  },
];
