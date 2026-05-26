import { z } from 'zod';

export const brandIntakeSchema = z.object({
  tipo: z.enum(['personal', 'producto', 'servicio']),
  nombreMarca: z.string().min(2, 'Nombre muy corto'),
  expertiseDiferenciador: z.string().min(10, 'Sé más específico'),
  anosExperiencia: z.number().min(0).max(50),
  ubicacionGeografica: z.string().min(3),
  idiomas: z.array(z.string()).min(1, 'Agrega al menos un idioma'),
  industriaNicho: z.string().min(3),
  perfilDemografico: z.string().min(20),
  problemaPrincipal: z.string().min(20),
  resultadoDeseado: z.string().min(20),
  nivelSofisticacion: z.number().min(0).max(5),
  objecionesPrincipales: z.array(z.string()).min(3).max(5),
  competenciaDirecta: z.array(z.string()).min(1),
  ventajaCompetitiva: z.string().min(20),
  queOfrece: z.string().min(20),
  promesaRealista: z.string().min(20),
  precioInversion: z.string().min(5),
  formatoEntrega: z.string().min(10),
  garantia: z.string().optional(),
  noPromete: z.string().min(10),
  estiloComuncacional: z.string().min(10),
  expresionesNaturales: z.array(z.string()).min(15, 'Necesitamos mínimo 15 expresiones'),
  prohibiciones: z.array(z.string()).min(10, 'Necesitamos mínimo 10 prohibiciones'),
  nivelFormalidad: z.number().min(1).max(10),
  usoHumor: z.enum(['Alto', 'Moderado', 'Bajo', 'Sin humor']),
  regionalismos: z.string().optional(),
  temasSensibles: z.string().optional(),
  pilares: z
    .array(
      z.object({
        nombre: z.string().min(3),
        porcentaje: z.number().min(5).max(60),
      })
    )
    .min(3)
    .max(5)
    .refine((p) => p.reduce((s, x) => s + x.porcentaje, 0) === 100, {
      message: 'Los pilares deben sumar 100%',
    }),
  creenciasFundamentales: z.array(z.string()).min(3).max(7),
  queRechaza: z.array(z.string()).min(2).max(5),
  limitesEticos: z.array(z.string()).min(2).max(5),
  propositoMarca: z.string().min(30),
  historiaOrigen: z.string().optional(),
  historiaBatallas: z.string().optional(),
  historiaLogros: z.string().optional(),
  mensajeCentral: z.string().min(20, 'El mensaje central debe tener mínimo 20 caracteres'),
  comoPierciben: z.string().optional(),
  costoNoActuar: z.string().min(20, 'Describe el costo de no actuar'),
  errorPrincipal: z.string().min(20, 'Describe el error principal del cliente'),
  aQuienNoAyudo: z.string().min(10, 'Define a quién no puedes ayudar'),
  resultadosClientes: z.string().optional(),
  figurasReferencia: z.object({
    heroInfluencer: z.string(),
    competidoresDirectos: z.array(z.string()),
    creadoresIndustria: z.array(z.string()),
  }).optional(),
  objetivoPrincipal: z.enum(['awareness', 'leads', 'ventas', 'comunidad']),
  kpiCritico: z.string().min(5),
  frecuenciaContenido: z.string().min(5),
  plataformas: z.array(z.string()).min(1),
  recursosDisponibles: z.object({
    tiempoPorSemana: z.number().min(1).max(168),
    presupuesto: z.string().optional(),
    equipo: z.string().optional(),
  }),
  timeline: z.string().min(5),
  productosSecundarios: z.array(z.string()).optional(),
  colaboraciones: z.array(z.string()).optional(),
  temporadasEventos: z.array(z.string()).optional(),
  restricciones: z.array(z.string()).optional(),
  integracionesNecesarias: z.array(z.string()).optional(),
});

export type BrandIntakeFormData = z.infer<typeof brandIntakeSchema>;
