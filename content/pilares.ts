export type Pilar = {
  id: string;
  slug: string;
  nombre: string;
  porcentaje: number;
  icono: string;
  microCopy: string;
  descripcionLarga: string;
  ctaLabel: string;
  ctaHref: string;
  color: string;
};

export const pilares: Pilar[] = [
  {
    id: "dios",
    slug: "dios",
    nombre: "Dios",
    porcentaje: 25,
    icono: "cross",
    microCopy: "Fe que se vive, no se predica.",
    descripcionLarga:
      "Mi caminar con Dios no es marketing. Es quien soy. Aquí comparto reflexiones sobre decisiones, silencios, certezas e incertidumbres del proceso espiritual de un emprendedor. Sin versículos performativos ni moralismo.",
    ctaLabel: "Leer reflexiones",
    ctaHref: "/contenido?pilar=dios",
    color: "#6B5B95",
  },
  {
    id: "estrategia",
    slug: "estrategia",
    nombre: "Estrategia",
    porcentaje: 25,
    icono: "compass",
    microCopy: "Claridad antes que táctica.",
    descripcionLarga:
      "Marcos y frameworks para construir negocios digitales con cabeza. Lo que la mayoría llama estrategia es una lista de tácticas sin dirección. Acá vas a ver la diferencia.",
    ctaLabel: "Ver frameworks",
    ctaHref: "/contenido?pilar=estrategia",
    color: "#0A0A0A",
  },
  {
    id: "ia",
    slug: "ia",
    nombre: "IA",
    porcentaje: 20,
    icono: "sparkles",
    microCopy: "IA como palanca, no como relleno.",
    descripcionLarga:
      "Uso IA todos los días para construir. Comparto workflows reales, herramientas que funcionan y errores que costaron tiempo. Stack: Claude, Gemini, ElevenLabs, n8n, Remotion. Demos, no hype.",
    ctaLabel: "Ver mi stack IA",
    ctaHref: "/contenido?pilar=ia",
    color: "#E6B800",
  },
  {
    id: "proceso",
    slug: "proceso",
    nombre: "Proceso",
    porcentaje: 20,
    icono: "layers",
    microCopy: "Construyendo en público, sin drama.",
    descripcionLarga:
      "KREOON, UGC Colombia, Infiny Latam, Los Reyes del Contenido. Cuatro proyectos en construcción activa. Decisiones, dudas, pivotes y aprendizajes reales en vivo.",
    ctaLabel: "Ver proyectos",
    ctaHref: "/#autoridad",
    color: "#3A7D44",
  },
  {
    id: "vida-real",
    slug: "vida-real",
    nombre: "Vida Real",
    porcentaje: 10,
    icono: "coffee",
    microCopy: "El humano detrás de los proyectos.",
    descripcionLarga:
      "El 10% que humaniza todo lo demás. Rutinas, libros, frustraciones, días buenos y malos sin victimismo. No es lifestyle de influencer. Es la persona detrás del estratega.",
    ctaLabel: "Conóceme",
    ctaHref: "/sobre-mi",
    color: "#B85C38",
  },
];
