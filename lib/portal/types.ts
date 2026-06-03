export type PortalClient = {
  id: string;
  nombre: string;
  slug: string;
  logo_url: string | null;
  industria: string | null;
  contacto_email: string | null;
  contacto_nombre: string | null;
  notas: string | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
};

export type PortalClientUser = {
  id: string;
  auth_user_id: string;
  client_id: string;
  email: string;
  nombre: string | null;
  rol: 'viewer' | 'editor';
  activo: boolean;
  created_at: string;
};

export type Campaign = {
  id: string;
  client_id: string;
  nombre: string;
  producto: string | null;
  plataforma: string[] | null;
  mercados: string[] | null;
  estado: 'Borrador' | 'Activa' | 'Pausada' | 'Finalizada';
  fase_esfera: string | null;
  fecha_inicio: string | null;
  fecha_cierre: string | null;
  landing_url: string | null;
  objetivo_principal: string | null;
  presupuesto: number | null;
  cpc_promedio: number | null;
  ctr: number | null;
  cpa: number | null;
  responsable: string | null;
  checklist: CampaignChecklist;
  project_id: string | null;
  ad_account_id: string | null;
  custom_fields: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

export type CampaignChecklist = {
  estrategia: ChecklistItem[];
  ejecucion: ChecklistItem[];
  optimizacion: ChecklistItem[];
};

export type ChecklistItem = {
  id: string;
  texto: string;
  completado: boolean;
};

export type Project = {
  id: string;
  client_id: string;
  nombre: string;
  responsable: string | null;
  equipo: string | null;
  estado: 'Sin empezar' | 'En curso' | 'Listo' | 'Cancelado';
  prioridad: 'Alta' | 'Media' | 'Baja';
  progreso: number;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  presupuesto: number | null;
  resumen_ia: string | null;
  custom_fields: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

export type Objective = {
  id: string;
  client_id: string;
  nombre: string;
  propietario: string | null;
  estado: 'Sin empezar' | 'En curso' | 'Listo';
  fecha_limite: string | null;
  prioridad: 'Alta' | 'Media' | 'Baja';
  trimestre: string | null;
  equipo: string | null;
  valor_inicial: number;
  valor_final: number;
  progreso: number;
  project_id: string | null;
  custom_fields: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

export type PortalEvent = {
  id: string;
  client_id: string;
  nombre: string;
  fecha_evento: string | null;
  estado: 'Planificación' | 'Inscripción abierta' | 'En curso' | 'Listo' | 'Cancelado';
  propietario: string | null;
  formato: 'Virtual' | 'En persona' | 'Híbrido' | null;
  categoria: string | null;
  lugar: string | null;
  capacidad: number | null;
  presupuesto: number | null;
  url: string | null;
  project_id: string | null;
  custom_fields: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

export type SocialPost = {
  id: string;
  client_id: string;
  nombre: string;
  estado: 'Idea' | 'En producción' | 'Programado' | 'Publicado' | 'Cancelado';
  fecha_publicacion: string | null;
  plataforma: string[] | null;
  propietario: string | null;
  publico_objetivo: string | null;
  tipo_contenido: string[] | null;
  url_publicacion: string | null;
  campaign_id: string | null;
  custom_fields: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

export type EditorialItem = {
  id: string;
  client_id: string;
  nombre: string;
  fecha: string | null;
  formato: string | null;
  plataforma: string[] | null;
  estado: 'Pendiente' | 'En producción' | 'Listo' | 'Publicado';
  notas: string | null;
  campaign_id: string | null;
  funnel_stage: 'TOFU' | 'MOFU' | 'BOFU' | null;
  custom_fields: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

export type AdAccount = {
  id: string;
  client_id: string;
  nombre: string;
  plataforma: string | null;
  account_id: string | null;
  estado: 'Activa' | 'Pausada' | 'Suspendida' | 'Cerrada';
  notas: string | null;
  custom_fields: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

export type Tool = {
  id: string;
  client_id: string;
  nombre: string;
  area: string | null;
  estado: 'Sin Activar' | 'Activo' | 'Cancelado' | 'Por renovar';
  fecha_compra: string | null;
  prioridad: 'Alta' | 'Media' | 'Baja' | null;
  responsable: string | null;
  resumen_ia: string | null;
  url: string | null;
  usuario: string | null;
  valor: number | null;
  custom_fields: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

export type PortalTask = {
  id: string;
  client_id: string;
  titulo: string;
  descripcion: string | null;
  tipo_entregable: string | null;
  asignado_a: string | null;
  estado: 'Pendiente' | 'En progreso' | 'En revisión' | 'Aprobado' | 'Entregado';
  prioridad: 'Alta' | 'Media' | 'Baja';
  fecha_limite: string | null;
  fecha_entrega: string | null;
  link_entrega: string | null;
  notas: string | null;
  entity_type: string | null;
  entity_id: string | null;
  created_at: string;
  updated_at: string;
};

export type FieldType = 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'url' | 'checkbox';

export type EntityType =
  | 'campaign' | 'project' | 'objective' | 'event'
  | 'social_post' | 'editorial' | 'tool' | 'ad_account';

export type PortalFieldDef = {
  id: string;
  client_id: string;
  entity_type: EntityType;
  name: string;
  field_type: FieldType;
  options: string[];
  position: number;
  created_at: string;
};

export type TabId =
  | 'campanas'
  | 'proyectos'
  | 'objetivos'
  | 'eventos'
  | 'social'
  | 'editorial'
  | 'cuentas'
  | 'herramientas'
  | 'tareas';

export type ClientDashboardData = {
  client: PortalClient;
  campaigns: Campaign[];
  projects: Project[];
  objectives: Objective[];
  events: PortalEvent[];
  social_posts: SocialPost[];
  editorial: EditorialItem[];
  ad_accounts: AdAccount[];
  tools: Tool[];
  tasks: PortalTask[];
  field_defs: PortalFieldDef[];
};