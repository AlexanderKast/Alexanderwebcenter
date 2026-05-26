/**
 * Placeholders hasta tener testimonios reales firmados.
 * Perfiles representativos del ICP: emprendedores tradicionales migrando
 * al digital y personas creando marca, producto o negocio desde cero.
 */

export type Testimonio = {
  nombre: string;
  rol: string;
  empresa?: string;
  quote: string;
  imagen?: string;
  resultado?: string;
};

export const testimonios: Testimonio[] = [
  {
    nombre: "Nombre por confirmar",
    rol: "Dueño de panadería",
    empresa: "PYME tradicional · Medellín",
    quote:
      "Llevaba 12 años con mi negocio y no sabía ni qué era un embudo. Alexander me hizo ver que no tenía que ser tiktoker, solo necesitaba un sistema. Hoy tengo pedidos por WhatsApp todos los días.",
    imagen: "/testimonios/placeholder-pyme.png",
    resultado: "Primer canal digital funcionando en 6 semanas",
  },
  {
    nombre: "Nombre por confirmar",
    rol: "Fundadora de marca",
    empresa: "Skincare en lanzamiento · Bogotá",
    quote:
      "Estaba arrancando mi marca de cremas y me ahogaba entre 50 decisiones al día. El Diagnóstico Express me dio 3 prioridades claras. Por fin sentí que sabía por dónde avanzar.",
    imagen: "/testimonios/placeholder-dtc.png",
    resultado: "Claridad estratégica en 60 minutos",
  },
  {
    nombre: "Nombre por confirmar",
    rol: "Consultor independiente",
    empresa: "Construyendo marca personal",
    quote:
      "Pensaba que tenía que publicar todos los días para existir. Alexander me enseñó a usar IA para producir 10x más con el tiempo que ya tenía. Ahora mi contenido jala clientes solo.",
    imagen: "/testimonios/placeholder-solo.png",
    resultado: "Contenido multiplicado con IA aplicada",
  },
];
