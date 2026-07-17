/**
 * Línea de tiempo real de Alexander Cast.
 * Fuente: notas personales (Reyes-del-Contenido-Modulos) + Canvas de Marca.
 */

export type HitoTimeline = {
  año: string;
  titulo: string;
  descripcion: string;
};

export const timeline: HitoTimeline[] = [
  {
    año: "Antes de 2022",
    titulo: "SICOMMER — mi orgullo",
    descripcion:
      "Años construyendo mi empresa: clientes grandes, equipo, reconocimiento. Por fuera todo era éxito. Por dentro, una espiral que no quería ver.",
  },
  {
    año: "2022",
    titulo: "La quiebra",
    descripcion:
      "Lloré en el piso de mi oficina, con las luces apagadas, sin saber cómo iba a pagar la nómina. Era buenísimo vendiendo y pésimo administrando. Confié en quien no debía. Un día, la contadora me dijo que tenía tres meses para cerrar.",
  },
  {
    año: "2022",
    titulo: "El post vulnerable",
    descripcion:
      "Después de tres meses muerto en vida, escribí mi primera publicación honesta contando el fracaso. Pensé que iba a quedar en evidencia. Lo que llegó fue conexión real y los primeros clientes de consultoría.",
  },
  {
    año: "2023",
    titulo: "Infiny Group",
    descripcion:
      "Con esos primeros clientes, nace Infiny Group. La decisión fue una sola: no construir de nuevo para mi ego, construir con propósito y con Dios al centro.",
  },
  {
    año: "2024",
    titulo: "UGC Colombia",
    descripcion:
      "De Infiny Latam surge UGC Colombia: agencia que conecta marcas con creadores reales de LATAM. Pricing transparente, procesos documentados, contenido que vende.",
  },
  {
    año: "2025",
    titulo: "KREOON",
    descripcion:
      "Nace el proyecto más ambicioso del ecosistema: marketplace de creadores reales con estrategia, contenido y operación corriendo con IA. El sistema que yo quise tener cuando empecé.",
  },
  {
    año: "Hoy",
    titulo: "Dios. Estrategia. IA.",
    descripcion:
      "Varios proyectos vivos operando en paralelo. Una newsletter semanal, consultoría 1:1 y un sistema de contenido con IA como copiloto. Todo documentado en tiempo real.",
  },
];

/**
 * Experiencia laboral tipo hoja de vida — para la sección "Sobre mí" / About del sitio.
 * Reconciliada con components/pages/SobreMiContent.tsx (fuente más reciente y detallada).
 * TODO(alex): años exactos de Kastore pendientes de confirmar. Ver comentarios en content/empresas.ts.
 */
export type ExperienciaItem = {
  empresa: string;
  rol: string;
  periodo: string;
  descripcion?: string;
  empresaId?: string;
};

export const experiencia: ExperienciaItem[] = [
  {
    empresa: "Master IA Tech",
    rol: "Fundador & CEO",
    periodo: "2026 — hoy",
    descripcion:
      "Ingeniería, desarrollo de software, IA y contenido bajo un solo sistema.",
    empresaId: "master-ia-tech",
  },
  {
    empresa: "KREOON",
    rol: "Cofundador",
    periodo: "2025 — hoy",
    descripcion: "Marketplace de creadores + agencia 360 con IA.",
    empresaId: "kreoon",
  },
  {
    empresa: "UGC Colombia",
    rol: "Cofundador & CEO",
    periodo: "2025 — hoy",
    descripcion: "La empresa más activa del ecosistema.",
    empresaId: "ugc-colombia",
  },
  {
    empresa: "Sanavi Natural",
    rol: "Fundador",
    periodo: "— hoy",
    descripcion: "Marca de productos naturales.",
    empresaId: "sanavi-natural",
  },
  {
    empresa: "Infiny Group",
    rol: "Fundador",
    periodo: "2023 — hoy",
    empresaId: "infiny-group",
  },
  {
    empresa: "SICOMMER",
    rol: "Cofundador — Estrategia y Comercial",
    periodo: "2018 — 2024",
    descripcion:
      "Uno de los mayores proveedores de dropshipping de Colombia. Operó también en Ecuador, República Dominicana y Perú. Lideré estrategia y comercial. En 2024 vendí mi parte a mi socio.",
    empresaId: "sicommer",
  },
  {
    empresa: "Kastore",
    rol: "Fundador",
    periodo: "[AAAA] — [AAAA]",
    descripcion:
      "Tiendas propias de ecommerce. Más de $1M USD en ventas y más de $100K USD invertidos en Meta/Google Ads.",
    empresaId: "kastore",
  },
];
