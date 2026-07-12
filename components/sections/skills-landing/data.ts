/**
 * Datos estáticos de la landing /skills — pack "9 Skills PRO para tu IA".
 */

export const SKILLS_PRO_SLUG = "skills-pro";

/** Códigos de país permitidos en el selector del form. */
export const COUNTRY_CODES = [
  { code: "+57", pais: "Colombia" },
  { code: "+52", pais: "México" },
  { code: "+54", pais: "Argentina" },
  { code: "+51", pais: "Perú" },
  { code: "+56", pais: "Chile" },
  { code: "+593", pais: "Ecuador" },
  { code: "+58", pais: "Venezuela" },
  { code: "+591", pais: "Bolivia" },
  { code: "+595", pais: "Paraguay" },
  { code: "+598", pais: "Uruguay" },
  { code: "+507", pais: "Panamá" },
  { code: "+506", pais: "Costa Rica" },
  { code: "+502", pais: "Guatemala" },
  { code: "+503", pais: "El Salvador" },
  { code: "+504", pais: "Honduras" },
  { code: "+505", pais: "Nicaragua" },
  { code: "+1", pais: "USA / Canadá / RD / PR" },
  { code: "+34", pais: "España" },
] as const;

export type Skill = {
  numero: string;
  nombre: string;
  descripcion: string;
  archivo: string;
};

export const SKILLS: Skill[] = [
  {
    numero: "01",
    nombre: "El Planificador",
    descripcion: "Piensa el plan completo antes de mover un solo dedo.",
    archivo: "skill-plan.md",
  },
  {
    numero: "02",
    nombre: "El Abogado del Diablo",
    descripcion: "Cuestiona tus ideas para encontrar los puntos ciegos.",
    archivo: "skill-devil.md",
  },
  {
    numero: "03",
    nombre: "Investigación Primero",
    descripcion: "Prohíbe ejecutar sin haber investigado a fondo.",
    archivo: "skill-research.md",
  },
  {
    numero: "04",
    nombre: "El Arranque",
    descripcion: "Arranca cada proyecto con contexto y objetivos claros.",
    archivo: "skill-start.md",
  },
  {
    numero: "05",
    nombre: "El Que Arregla de Verdad",
    descripcion: "Va a la causa raíz, no al parche rápido.",
    archivo: "skill-fixer.md",
  },
  {
    numero: "06",
    nombre: "El Chequeo de Seguridad",
    descripcion: "Audita riesgos antes de que algo salga a producción.",
    archivo: "skill-security.md",
  },
  {
    numero: "07",
    nombre: "El Orquestador",
    descripcion: "Coordina tareas grandes en entregas coherentes.",
    archivo: "skill-orchestrator.md",
  },
  {
    numero: "08",
    nombre: "Control de Calidad",
    descripcion: "Filtro implacable contra el resultado genérico.",
    archivo: "skill-qa.md",
  },
  {
    numero: "09",
    nombre: "Entrega Profesional",
    descripcion: "Empaqueta el trabajo a nivel de junta directiva.",
    archivo: "skill-delivery.md",
  },
];

export type FaqItem = { pregunta: string; respuesta: string };

export const SKILLS_FAQS: FaqItem[] = [
  {
    pregunta: "¿De verdad es gratis?",
    respuesta:
      "Totalmente. Es una muestra de la metodología que implemento con mis clientes. Sin tarjeta, sin trampa.",
  },
  {
    pregunta: "¿Funciona con ChatGPT o solo con Claude?",
    respuesta:
      "Funcionan en Claude, ChatGPT y Gemini. Son protocolos en texto plano: cualquier modelo de lenguaje actual los entiende.",
  },
  {
    pregunta: "¿Necesito saber programar?",
    respuesta:
      "No. Son archivos de texto (Markdown). Los copias en las instrucciones de tu IA o al inicio de un chat y listo. La guía te muestra cómo, paso a paso.",
  },
  {
    pregunta: "¿Qué recibo exactamente?",
    respuesta:
      "Los 9 archivos .md listos para usar y una guía rápida en PDF con la instalación en 5 minutos. Todo en español.",
  },
];
