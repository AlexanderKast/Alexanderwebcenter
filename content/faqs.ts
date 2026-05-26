/**
 * FAQs CRO: preguntas directas que resuelven objeciones.
 */

export type FAQ = {
  pregunta: string;
  respuesta: string;
  pilar?: string;
};

export const faqs: FAQ[] = [
  {
    pregunta: "¿Qué recibo si descargo los 10 Prompts de IA?",
    respuesta:
      "Un PDF de 14 páginas con los 10 prompts que uso cada semana con Claude y ChatGPT para auditar estrategias, estructurar ofertas y acelerar contenido. Cada prompt trae el contexto de cuándo aplicarlo y qué salida esperar. Descarga inmediata al correo, sin spam, cancelas cuando quieras.",
    pilar: "ia",
  },
  {
    pregunta: "¿Para quién es esto?",
    respuesta:
      "Para emprendedores tradicionales que quieren dar el salto al mundo digital sin perder meses probando. También para quienes están creando su marca personal, un producto o empezando un negocio desde cero. Si esperas fórmulas mágicas o quieres viralidad fácil, no somos fit.",
    pilar: "estrategia",
  },
  {
    pregunta: "¿Cuánto cuesta trabajar contigo?",
    respuesta:
      "Diagnóstico Express (60 min + plan): USD 97. Cast Mentoring (3 meses): USD 297/mes. Workshops para equipos: bajo cotización. Todo pensado para que un emprendedor en LATAM pueda empezar sin endeudarse. La primera charla de descubrimiento es gratis.",
    pilar: "estrategia",
  },
  {
    pregunta: "¿Dónde estás y cómo trabajas?",
    respuesta:
      "Medellín, Colombia. Trabajo 100% remoto con clientes en toda LATAM y España. Consultorías 1:1 por video. Workshops virtuales o presenciales según alcance. Respondo yo, no un equipo, en menos de 24 horas.",
    pilar: "vida-real",
  },
];
