/**
 * Manual de marca personal Alexander Cast.
 * Data estructurada para renderizar en /admin/marca.
 */

export const brandIdentity = {
  nombre: "Alexander Cast",
  tagline: "Dios. Estrategia. IA.",
  handle: "@alexemprendee",
  ubicacion: "Medellín, Colombia",
  arquetipo: ["El Explorador", "El Sabio"],
  personalidad: [
    "Directo sin agresión",
    "Reflexivo sin filosofía vacía",
    "Cercano sin informalidad descuidada",
    "Autoridad por transparencia, no por pretensión",
    "Fe integrada, no predicada",
  ],
} as const;

export const brandColors = [
  { name: "Negro profundo", hex: "#030303", role: "Fondo principal" },
  { name: "Superficie 1", hex: "#080808", role: "Cards y paneles" },
  { name: "Superficie 2", hex: "#101010", role: "Hover y acentos dark" },
  { name: "Línea", hex: "#1f1f1f", role: "Bordes y divisores" },
  { name: "Dorado oscuro", hex: "#6b4f0e", role: "Sombras y base metálica" },
  { name: "Dorado base", hex: "#c9a227", role: "Acentos principales" },
  { name: "Dorado medio", hex: "#d4af37", role: "Ring y highlights" },
  { name: "Dorado claro", hex: "#f4e4a6", role: "Brillos metálicos" },
  { name: "Dorado hi", hex: "#fff3c4", role: "Reflejo superior" },
  { name: "Texto principal", hex: "#f5f3ee", role: "Blanco cálido luxury" },
  { name: "Texto secundario", hex: "#8a8680", role: "Muted, metadata" },
] as const;

export const brandTypography = {
  display: {
    familia: "Playfair Display",
    uso: "Headlines, H1-H3, números destacados",
    pesos: [400, 500, 600, 700, 800, 900],
  },
  body: {
    familia: "Inter",
    uso: "Párrafos, UI, forms, microcopy",
    pesos: [400, 500, 600, 700],
  },
  escalas: [
    { clase: ".h-hero", tamano: "clamp(52px, 7.5vw, 96px)", peso: 700 },
    { clase: ".h-section", tamano: "clamp(28px, 4vw, 48px)", peso: 700 },
    { clase: ".h-profession", tamano: "clamp(18px, 2vw, 26px)", peso: 400 },
    { clase: ".eyebrow", tamano: "11px uppercase 0.26em", peso: 600 },
  ],
} as const;

export const brandVoice = {
  personas: "1a persona singular. Conversacional. No corporativo.",
  conjugacion: "Español latino. Tuteo. Modismos colombianos mínimos.",
  cualidades: ["honesto", "directo", "reflexivo", "con humor sobrio", "sin palabras hinchadas"],
  evitar: [
    "Jerga corporativa ('sinergia', 'paradigma')",
    "Gurismo ('secretos', 'te vas a volver rico')",
    "Predicación agresiva",
    "Exceso de anglicismos",
    "Victimismo o drama",
    "Claims numéricos sin prueba",
  ],
  hooks_modelo: [
    "Me enseñaron que [X] e [Y] eran mundos separados. Estaban equivocados.",
    "La mayoría de [grupo] hace [A]. Aquí está por qué está mal.",
    "Llevo 3 meses construyendo esto y aquí está lo que nadie te cuenta.",
    "Uso IA para [X] y te muestro exactamente cómo — sin filtros.",
  ],
} as const;

export const brandPromise =
  "Te ayudo a pensar claro, construir con estrategia y usar IA con propósito. Sin fórmulas mágicas, sin humo. Con Dios al centro.";

export const brandLogos = [
  { nombre: "Monograma AC (dorado)", archivo: "/logos/ac-gold-mark.png", uso: "Favicon, header, avatar" },
  { nombre: "Logo completo", archivo: "/logos/ac-gold.png", uso: "Wordmark completo en piezas grandes" },
  { nombre: "Original sin recortar", archivo: "/logos/ak-original.png", uso: "Backup / impresión" },
] as const;
