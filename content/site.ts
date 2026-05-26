/**
 * Constantes globales del sitio alexandercast.com
 */

export const site = {
  name: "Alexander Cast",
  handle: "@alexemprendee",
  tagline: "Dios. Estrategia. IA.",
  url: "https://alexandercast.com",
  locale: "es-CO",
  description:
    "Estratega digital, de contenido e IA. Ayudo a emprendedores tradicionales a dar el salto al digital y a quienes están creando su marca personal, producto o negocio desde cero.",
  descriptionCorta:
    "Convierte tu marca o negocio en una máquina de clientes. Estrategia, contenido e IA aplicada.",
  promesa:
    "Ayudo a emprendedores tradicionales a dar el salto al mundo digital y a quienes están creando marca, producto o negocio desde cero.",
  ubicacion: "Medellín, Colombia",
  idiomas: ["Español"],
  rol: "Estratega Digital y de IA",
  fundador: [
    "KREOON",
    "Infiny Latam",
    "UGC Colombia",
    "Los Reyes del Contenido",
  ],
  ogImage: "/og/alexandercast-cover.png",
  social: {
    instagram: {
      handle: "@alexemprendee",
      url: "https://instagram.com/alexemprendee",
    },
    tiktok: {
      handle: "@alexemprendee",
      url: "https://tiktok.com/@alexemprendee",
    },
    youtube: {
      handle: "@alexemprendee",
      url: "https://youtube.com/@alexemprendee",
    },
    linkedin: {
      handle: "alexandercast",
      url: "https://www.linkedin.com/in/alexandercast",
    },
    x: {
      handle: "@alexemprendee",
      url: "https://x.com/alexemprendee",
    },
    github: {
      handle: "AlexanderKast",
      url: "https://github.com/AlexanderKast",
    },
  },
  contacto: {
    principal: "founder@kreoon.com",
    prensa: "founder@kreoon.com",
    comercial: "comercial@infinygroup.com",
    consultoria: "founder@kreoon.com",
  },
  brand: {
    colorPrimario: "#030303",
    colorAcento: "#d4af37",
    fuenteDisplay: "Playfair Display",
    fuenteTexto: "Inter",
  },
  arquetipo: ["Explorador", "Sabio"],
} as const;

export type Site = typeof site;
