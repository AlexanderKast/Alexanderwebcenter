/**
 * Fuente de verdad de empresas — reconciliada con los datos reales ya
 * existentes en components/home/HomeSobreMi.tsx y components/pages/SobreMiContent.tsx.
 *
 * TODO(alex) — Placeholders pendientes de confirmar antes de publicar:
 * - Kastore: años exactos de operación pendientes de confirmar.
 * - Infiny Group: aparece en content/site.ts como holding pero NO aparece en los componentes reales del
 *   portal (HomeSobreMi/SobreMiContent no lo listan). Confirmar con Alexander si sigue activo.
 */

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
  tipo: "actual" | "trayectoria" | "cliente";
  rol: string;
  periodo: string;
  estado: "activa" | "en-desarrollo" | "vendida" | "cerrada";
};

export const empresas: Empresa[] = [
  {
    id: "master-ia-tech",
    nombre: "Master IA Tech",
    tagline: "Ingeniería, software, IA y contenido en un solo sistema.",
    descripcion:
      "La empresa que unifica todo el ecosistema: desarrollo de software, automatización con IA, educación y creación de contenido para marcas que quieren operar con sistema.",
    logo: "/logos/master-ia-tech.svg",
    url: "",
    ctaPrimario: { label: "Conocer la empresa", href: "/contacto" },
    color: "#d4af37",
    tipo: "actual",
    rol: "Fundador & CEO",
    periodo: "2026 — hoy",
    estado: "en-desarrollo",
  },
  {
    id: "ugc-colombia",
    nombre: "UGC Colombia",
    tagline: "Creadores reales que venden por ti.",
    descripcion:
      "Conectamos marcas con creadores colombianos para contenido auténtico que convierte. Pricing transparente LATAM, procesos documentados. La empresa más activa del ecosistema.",
    logo: "/logos/ugc-colombia.svg",
    url: "https://ugccolombia.com",
    ctaPrimario: { label: "Contratar creadores", href: "https://ugccolombia.com/marcas" },
    ctaSecundario: { label: "Ser creador", href: "https://ugccolombia.com/creadores" },
    color: "#B85C38",
    tipo: "actual",
    rol: "Cofundador & CEO",
    periodo: "2025 — hoy",
    estado: "activa",
  },
  {
    id: "kreoon",
    nombre: "KREOON",
    tagline: "Marketplace de creadores + agencia 360 con IA.",
    descripcion:
      "Conecta marcas con creadores reales de contenido. Estrategia, producción y operación corren con IA — los creadores son personas de verdad, no generadas.",
    logo: "/logos/kreoon.svg",
    url: "https://kreoon.com",
    ctaPrimario: { label: "Ver caso de estudio", href: "/sobre-mi#kreoon" },
    color: "#d4af37",
    tipo: "actual",
    rol: "Cofundador",
    periodo: "2025 — hoy",
    estado: "en-desarrollo",
  },
  {
    id: "sanavi-natural",
    nombre: "Sanavi Natural",
    tagline: "Marca de productos naturales.",
    descripcion: "Marca de productos naturales fundada dentro del ecosistema.",
    logo: "/logos/sanavi-natural.svg",
    url: "",
    ctaPrimario: { label: "", href: "" },
    color: "#6B8E4E",
    tipo: "actual",
    rol: "Fundador",
    periodo: "— hoy",
    estado: "activa",
  },
  {
    id: "infiny-group",
    nombre: "Infiny Group",
    tagline: "Holding digital y consultoría estratégica.",
    descripcion:
      "Holding del ecosistema. TODO(alex): no aparece en los componentes reales del portal (HomeSobreMi/SobreMiContent) — confirmar si sigue activo.",
    logo: "/logos/infiny-group.svg",
    url: "https://infinygroup.com",
    ctaPrimario: { label: "Conocer Infiny", href: "https://infinygroup.com" },
    color: "#6B5B95",
    tipo: "actual",
    rol: "Fundador",
    periodo: "2023 — hoy",
    estado: "activa",
  },
  {
    id: "sicommer",
    nombre: "SICOMMER",
    tagline: "Uno de los mayores proveedores de dropshipping de Colombia.",
    descripcion:
      "Cofundada en 2018, operó en Colombia, Ecuador, República Dominicana y Perú. Lideré estrategia y comercial. En 2024 vendí mi parte a mi socio tras una crisis de administración — no quebrada.",
    logo: "/logos/sicommer.svg",
    url: "",
    ctaPrimario: { label: "", href: "" },
    color: "#3A3A3A",
    tipo: "trayectoria",
    rol: "Cofundador — Estrategia y Comercial",
    periodo: "2018 — 2024",
    estado: "vendida",
  },
  {
    id: "kastore",
    nombre: "Kastore",
    tagline: "Tiendas propias de ecommerce.",
    descripcion:
      "Kastore y otras tiendas propias. Más de $1M USD en ventas y más de $100K USD invertidos en Meta/Google Ads.",
    logo: "",
    url: "",
    ctaPrimario: { label: "", href: "" },
    color: "#3A3A3A",
    tipo: "trayectoria",
    rol: "Fundador",
    periodo: "[AAAA] — [AAAA]",
    estado: "cerrada",
  },
  {
    id: "grupo-effi",
    nombre: "Grupo Effi",
    tagline: "Estrategia y comunidades digitales.",
    descripcion: "Cliente de consultoría AI-First.",
    logo: "",
    url: "",
    ctaPrimario: { label: "", href: "" },
    color: "#3A3A3A",
    tipo: "cliente",
    rol: "Estratega Digital AI-First",
    periodo: "2026",
    estado: "activa",
  },
  {
    id: "feria-effix",
    nombre: "Feria Effix",
    tagline: "Feria de emprendedores 2026.",
    descripcion: "Cliente de consultoría AI-First.",
    logo: "",
    url: "",
    ctaPrimario: { label: "", href: "" },
    color: "#3A3A3A",
    tipo: "cliente",
    rol: "Estratega Digital AI-First",
    periodo: "2026",
    estado: "activa",
  },
  {
    id: "distrilatam",
    nombre: "Distrilatam",
    tagline: "Estrategia digital y distribución.",
    descripcion: "Cliente de consultoría AI-First.",
    logo: "",
    url: "",
    ctaPrimario: { label: "", href: "" },
    color: "#3A3A3A",
    tipo: "cliente",
    rol: "Estratega Digital AI-First",
    periodo: "2026",
    estado: "activa",
  },
  {
    /** TODO(alex): confirmar si sigue activa o ya no la acompaña. */
    id: "adma-company",
    nombre: "ADMA Company",
    tagline: "",
    descripcion: "Cliente de consultoría.",
    logo: "",
    url: "",
    ctaPrimario: { label: "", href: "" },
    color: "#3A3A3A",
    tipo: "cliente",
    rol: "Líder Comercial y Estratega",
    periodo: "2026",
    estado: "activa",
  },
  {
    /** TODO(alex): confirmar si sigue activa o ya no la acompaña. */
    id: "rima-global",
    nombre: "Rima Global",
    tagline: "",
    descripcion: "Cliente de consultoría.",
    logo: "",
    url: "",
    ctaPrimario: { label: "", href: "" },
    color: "#3A3A3A",
    tipo: "cliente",
    rol: "Líder Comercial y Estratega",
    periodo: "2026",
    estado: "activa",
  },
  {
    id: "pancake",
    nombre: "Pancake",
    tagline: "Stack live shopping — Mauricio Cuevas.",
    descripcion: "Cliente de consultoría AI-First.",
    logo: "",
    url: "",
    ctaPrimario: { label: "", href: "" },
    color: "#3A3A3A",
    tipo: "cliente",
    rol: "Estratega Digital AI-First",
    periodo: "2026",
    estado: "cerrada",
  },
];
