/**
 * Lead magnets gratuitos que alimentan la newsletter.
 * Fuente: Modelo-Monetizacion.md Nivel 1 (Atraccion).
 */

export type LeadMagnet = {
  slug: string;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  formato: string;
  paginas?: number;
  coverImage: string;
  pilar: string;
  /** Si el recurso vive fuera (Notion, Figma, Drive), esta URL reemplaza la descarga firmada de Supabase. */
  externalUrl?: string;
};

export const leadMagnets: LeadMagnet[] = [
  {
    slug: "el-sistema-dei",
    titulo: "El Sistema DEI",
    subtitulo: "Dios, Estrategia e IA en un solo marco operativo",
    descripcion:
      "El manifiesto y manual practico del marco que uso para tomar decisiones de negocio, contenido y tecnologia desde una logica integrada. 27 paginas con el mapa mental, los principios y los ejercicios de aplicacion real. Lo que quise leer cuando empece a construir con proposito.",
    formato: "PDF",
    paginas: 27,
    coverImage: "/lead-magnets/el-sistema-dei.webp",
    pilar: "estrategia",
  },
  {
    slug: "canvas-marca-personal",
    titulo: "Canvas de Marca Personal",
    subtitulo: "Plantilla editable para definir tu marca en una pagina",
    descripcion:
      "La version Notion del canvas que use para estructurar mi propia marca personal. Propuesta de valor, segmentos, canales, pilares, diferenciadores y posicionamiento en una sola vista. Lo duplicas en tu Notion y lo trabajas a tu ritmo.",
    formato: "Plantilla Notion",
    coverImage: "/lead-magnets/canvas-marca-personal.webp",
    pilar: "estrategia",
    externalUrl:
      "https://www.notion.so/Canvas-de-Marca-Personal-Alexander-Cast-placeholder",
  },
  {
    slug: "10-prompts-ia-estrategas",
    titulo: "10 Prompts de IA para Estrategas",
    subtitulo: "Los prompts que uso cada semana para pensar mejor",
    descripcion:
      "No es un pack de 100 prompts generalistas. Son 10 prompts que uso yo, semanal, para expandir ideas, auditar estrategias, estructurar ofertas y depurar narrativa. Cada prompt viene con contexto de cuando usarlo y que esperar de salida. Listo para pegar en Claude o ChatGPT.",
    formato: "PDF",
    paginas: 14,
    coverImage: "/lead-magnets/10-prompts-ia-estrategas.webp",
    pilar: "ia",
  },
];
