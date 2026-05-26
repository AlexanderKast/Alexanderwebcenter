export type Empresa = {
  id: string;
  nombre: string;
  tagline: string;
  descripcion: string;
  logo: string;
  url: string;
  ctaPrimario: { label: string; href: string };
  ctaSecundario?: { label: string; href: string };
  color: string;
};

export const empresas: Empresa[] = [
  {
    id: "kreoon",
    nombre: "KREOON",
    tagline: "Plataforma tech para creadores.",
    descripcion:
      "Donde convergen contenido, IA y comunidad. En construcción activa para creadores y marcas que quieren operar con sistema, no con improvisación.",
    logo: "/logos/kreoon.svg",
    url: "https://kreoon.com",
    ctaPrimario: {
      label: "Lista de espera",
      href: "https://kreoon.com/waitlist",
    },
    color: "#d4af37",
  },
  {
    id: "ugc-colombia",
    nombre: "UGC Colombia",
    tagline: "Creadores reales que venden por ti.",
    descripcion:
      "Conectamos marcas con creadores colombianos para contenido auténtico que convierte. Pricing transparente LATAM, procesos documentados.",
    logo: "/logos/ugc-colombia.svg",
    url: "https://ugccolombia.com",
    ctaPrimario: {
      label: "Contratar creadores",
      href: "https://ugccolombia.com/marcas",
    },
    ctaSecundario: {
      label: "Ser creador",
      href: "https://ugccolombia.com/creadores",
    },
    color: "#B85C38",
  },
  {
    id: "infiny-latam",
    nombre: "Infiny Latam",
    tagline: "Consultoría digital estratégica.",
    descripcion:
      "El primer proyecto del ecosistema. Consultoría y estrategia digital para marcas y emprendedores que están dando el salto al mundo digital.",
    logo: "/logos/infiny-latam.svg",
    url: "https://infinylatam.com",
    ctaPrimario: {
      label: "Conocer Infiny",
      href: "https://infinylatam.com",
    },
    color: "#6B5B95",
  },
  {
    id: "los-reyes-del-contenido",
    nombre: "Los Reyes del Contenido",
    tagline: "Comunidad para emprendedores digitales.",
    descripcion:
      "Comunidad abierta donde comparto proceso real, recursos y conversación honesta para quienes están empezando o quieren escalar su marca.",
    logo: "/logos/los-reyes-del-contenido.svg",
    url: "https://losreyesdelcontenido.com",
    ctaPrimario: {
      label: "Entrar gratis",
      href: "https://losreyesdelcontenido.com/unirme",
    },
    color: "#d4af37",
  },
];
