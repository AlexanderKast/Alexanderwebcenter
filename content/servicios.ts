/**
 * Servicios iniciales con pricing accesible para mercado LATAM.
 * Escalera de valor pensada para emprendedores que recién arrancan.
 */

export type Servicio = {
  id: string;
  nombre: string;
  duracion: string;
  precio: string;
  descripcion: string;
  incluye: string[];
  ctaLabel: string;
  ctaHref: string;
  destacado: boolean;
};

export const servicios: Servicio[] = [
  {
    id: "diagnostico-express",
    nombre: "Diagnóstico Express",
    duracion: "Sesión de 60 minutos + plan de acción",
    precio: "USD 97",
    descripcion:
      "Si estás empezando y necesitas saber por dónde arrancar sin perder meses probando, esta sesión te da claridad. Miramos juntos tu negocio, identificamos el cuello de botella y salimos con 3 acciones prioritarias para los próximos 30 días.",
    incluye: [
      "Cuestionario previo para revisar tu situación",
      "Sesión 1:1 de 60 minutos grabada",
      "3 prioridades claras para los próximos 30 días",
      "Plantilla de plan semanal para ejecutar",
      "Recomendación de 2-3 herramientas clave",
    ],
    ctaLabel: "Agendar diagnóstico",
    ctaHref: "/contacto?servicio=diagnostico",
    destacado: true,
  },
  {
    id: "cast-mentoring",
    nombre: "Cast Mentoring",
    duracion: "3 meses, sesiones quincenales",
    precio: "USD 297 /mes",
    descripcion:
      "Acompañamiento mes a mes para emprendedores que están construyendo su marca, su oferta o dando el salto al digital. No es coaching genérico. Es pensar contigo cada dos semanas sobre decisiones reales de tu negocio.",
    incluye: [
      "2 sesiones 1:1 de 60 minutos al mes",
      "Chat directo conmigo entre sesiones",
      "Revisión de contenido, ofertas y landings",
      "Plan trimestral co-construido",
      "Plantillas personalizadas según tu negocio",
    ],
    ctaLabel: "Postular al mentoring",
    ctaHref: "/contacto?servicio=mentoring",
    destacado: false,
  },
  {
    id: "workshop-equipos",
    nombre: "Workshop para equipos",
    duracion: "Medio día o día completo",
    precio: "Consulta precio",
    descripcion:
      "Workshop en vivo para equipos de pymes, agencias o negocios tradicionales que quieren adoptar IA con criterio o diseñar su primer sistema de contenido. Virtual o presencial en LATAM. A medida según el reto del equipo.",
    incluye: [
      "Reunión de descubrimiento con liderazgo",
      "Workshop en vivo de 4 u 8 horas",
      "Plantillas entregadas al equipo",
      "Ejercicios prácticos aplicados a tu caso",
      "Reporte de acciones post-workshop",
    ],
    ctaLabel: "Solicitar propuesta",
    ctaHref: "/contacto?servicio=workshop",
    destacado: false,
  },
];

/**
 * Líneas de servicio de Master IA Tech — el ecosistema unificado de
 * ingeniería, IA, educación y contenido.
 */
export type LineaServicio = {
  id: string;
  titulo: string;
  etiqueta: string;
  categoria: string;
  descripcion: string;
  items: string[];
  img: string;
};

export const lineasServicio: LineaServicio[] = [
  {
    id: "ingenieria-software",
    titulo: "Ingeniería & Desarrollo de Software",
    etiqueta: "01",
    categoria: "DESARROLLO & SISTEMAS",
    descripcion:
      "Sistemas y productos digitales construidos con criterio de negocio, no solo de código.",
    items: [
      "Apps y plataformas web a medida",
      "Automatizaciones e integraciones",
      "Bases de datos y backend (Supabase, APIs)",
    ],
    img: "/assets/images/section/service-1.jpg",
  },
  {
    id: "ia-automatizacion",
    titulo: "IA & Automatización",
    etiqueta: "02",
    categoria: "AUTOMATIZACIÓN & AGENTES",
    descripcion:
      "Agentes, workflows y sistemas de IA aplicada que ahorran horas operativas reales.",
    items: [
      "Agentes IA (WhatsApp, atención, ventas)",
      "Automatización con n8n / Make",
      "Integraciones con Claude, GPT y otros modelos",
    ],
    img: "/assets/images/section/service-2.jpg",
  },
  {
    id: "educacion-formacion",
    titulo: "Educación & Formación",
    etiqueta: "03",
    categoria: "FORMACIÓN AI-FIRST",
    descripcion:
      "Mentoring, cursos y comunidad para quienes quieren aprender a construir con IA y estrategia.",
    items: [
      "Mentoring 1:1 y workshops para equipos",
      "Cursos y recursos descargables",
      "Rutas de aprendizaje personalizadas",
    ],
    img: "/assets/images/section/service-3.jpg",
  },
  {
    id: "creacion-contenido",
    titulo: "Creación de Contenido & UGC",
    etiqueta: "04",
    categoria: "AGENCIA DE CONTENIDO",
    descripcion:
      "Contenido que vende, producido por creadores reales con procesos documentados.",
    items: [
      "Producción UGC (UGC Colombia)",
      "Estrategia de contenido y guiones",
      "Sistemas de contenido con IA como copiloto",
    ],
    img: "/assets/images/section/service-4.jpg",
  },
];
