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
