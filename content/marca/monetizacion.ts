export type NivelMonetizacion = {
  nivel: number;
  nombre: string;
  objetivo: string;
  rangoPrecio: string;
  productos: { nombre: string; precio: string; descripcion: string; disponible: "activo" | "planeado" | "validando" }[];
  metaMensual?: string;
};

export const nivelesMonetizacion: NivelMonetizacion[] = [
  {
    nivel: 1,
    nombre: "Atracción",
    objetivo: "Construir audiencia, demostrar expertise, generar confianza",
    rangoPrecio: "$0",
    productos: [
      { nombre: "Contenido diario en redes", precio: "$0", descripcion: "5 plataformas activas", disponible: "activo" },
      { nombre: "Newsletter 'Dios, Estrategia e IA'", precio: "$0", descripcion: "Ensayo semanal", disponible: "activo" },
      { nombre: "10 Prompts de IA para Estrategas", precio: "$0", descripcion: "PDF lead magnet", disponible: "activo" },
      { nombre: "El Sistema DEI", precio: "$0", descripcion: "PDF 27 páginas", disponible: "planeado" },
      { nombre: "Canvas de Marca Personal", precio: "$0", descripcion: "Plantilla Notion", disponible: "planeado" },
      { nombre: "Los Reyes del Contenido (gratuita)", precio: "$0", descripcion: "Comunidad abierta", disponible: "planeado" },
    ],
  },
  {
    nivel: 2,
    nombre: "Activación (low ticket)",
    objetivo: "Primer 'sí' de la audiencia. Validar demanda.",
    rangoPrecio: "USD 7-47",
    productos: [
      { nombre: "Prompt Pack Estrategia con IA", precio: "USD 17", descripcion: "30 prompts categorizados", disponible: "planeado" },
      { nombre: "Template Notion Sistema de Contenido", precio: "USD 27", descripcion: "Plantilla duplicable", disponible: "planeado" },
      { nombre: "Mini-curso IA para no técnicos", precio: "USD 37", descripcion: "90 min grabado", disponible: "planeado" },
      { nombre: "Ebook Construir en Público", precio: "USD 17", descripcion: "PDF 50 pág", disponible: "planeado" },
      { nombre: "Swipe file 200 ganchos en español", precio: "USD 27", descripcion: "Hooks por pilar", disponible: "planeado" },
      { nombre: "Guía Auditoría de Marca (7 pasos)", precio: "USD 17", descripcion: "Workbook", disponible: "planeado" },
    ],
  },
  {
    nivel: 3,
    nombre: "Transformación (mid ticket)",
    objetivo: "Transformación real, no solo información. Ingresos recurrentes.",
    rangoPrecio: "USD 97-497",
    productos: [
      { nombre: "Diagnóstico Express", precio: "USD 97", descripcion: "60 min + plan 30 días", disponible: "activo" },
      { nombre: "Cast Mentoring", precio: "USD 297/mes", descripcion: "3 meses, sesiones quincenales", disponible: "activo" },
      { nombre: "Workshop en vivo mensual", precio: "USD 97", descripcion: "Tema rotativo + grabación", disponible: "planeado" },
      { nombre: "Membresía Los Reyes del Contenido PRO", precio: "USD 47/mes", descripcion: "Comunidad premium", disponible: "planeado" },
      { nombre: "Curso Sistema de Contenido con IA", precio: "USD 297", descripcion: "6 módulos 8 semanas", disponible: "planeado" },
      { nombre: "Bootcamp Newsletter Rentable", precio: "USD 497", descripcion: "30 días intensivos", disponible: "planeado" },
    ],
    metaMensual: "USD 3.000-5.000",
  },
  {
    nivel: 4,
    nombre: "Aceleración (high ticket)",
    objetivo: "Grupos reducidos con transformación acompañada",
    rangoPrecio: "USD 997-4.997",
    productos: [
      { nombre: "Programa cohort Estratega con IA", precio: "USD 1.997", descripcion: "90 días · 20 personas", disponible: "planeado" },
      { nombre: "Mastermind Consultores con IA", precio: "USD 2.997", descripcion: "6 meses · 12 personas", disponible: "planeado" },
      { nombre: "Intensivo 1 día Claridad Estratégica", precio: "USD 997", descripcion: "Virtual en vivo", disponible: "planeado" },
      { nombre: "Programa Productiza tu Servicio con IA", precio: "USD 1.997", descripcion: "8 semanas", disponible: "planeado" },
    ],
  },
  {
    nivel: 5,
    nombre: "Premium (1:1 / corporativo)",
    objetivo: "Ingresos fundacionales, trabajo profundo con pocos clientes",
    rangoPrecio: "USD 3.000-15.000/mes",
    productos: [
      { nombre: "Consultoría 1:1 (3 meses)", precio: "USD 6.000-12.000", descripcion: "Sesiones semanales", disponible: "validando" },
      { nombre: "Retainer estratégico mensual", precio: "USD 3.000-5.000/mes", descripcion: "4 sesiones + acceso directo", disponible: "validando" },
      { nombre: "Done-for-you Sistema de Contenido", precio: "USD 8.000-15.000", descripcion: "Implementación completa", disponible: "validando" },
      { nombre: "Auditoría + Roadmap Estratégico", precio: "USD 5.000", descripcion: "2 semanas", disponible: "validando" },
      { nombre: "Speaking corporativo", precio: "USD 3.000-10.000", descripcion: "Empresas y eventos", disponible: "planeado" },
    ],
    metaMensual: "USD 10.000-20.000 (2 clientes premium)",
  },
];

export const metasIngresos = {
  mes3: "USD 500-1.500 (tripwires + primeros Diagnósticos Express)",
  mes6: "USD 2.000-4.000 (mid-ticket activo)",
  mes12: "USD 8.000-15.000 (conservador) · base sostenible",
  mes24: "USD 20.000-40.000 (con ecosistema operando y automatización madura)",
} as const;
