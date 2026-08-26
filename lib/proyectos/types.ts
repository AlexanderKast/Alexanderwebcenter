export const ESTADOS_COMERCIALES = [
  "Prospecto",
  "Propuesta enviada",
  "En curso",
  "Pausado",
  "Cerrado",
  "Perdido",
] as const;

export type EstadoComercial = (typeof ESTADOS_COMERCIALES)[number];

export const TIPOS_LINK = [
  "repo",
  "staging",
  "produccion",
  "drive",
  "figma",
  "otro",
] as const;

export type TipoLink = (typeof TIPOS_LINK)[number];

export const ESTADOS_TAREA = ["pendiente", "haciendo", "hecha"] as const;
export type EstadoTarea = (typeof ESTADOS_TAREA)[number];

export interface Sociedad {
  id: string;
  nombre: string;
  descripcion: string | null;
  activa: boolean;
}

export interface Socio {
  id: string;
  nombre: string;
  email: string | null;
  adminUserId: string | null;
  activo: boolean;
}

export interface ParticipacionSocio {
  sociedadId: string;
  sociedadNombre: string;
  socioId: string;
  socioNombre: string;
  pct: number;
  rolNotas: string | null;
}

export interface ColumnaKanban {
  id: string;
  nombre: string;
  orden: number;
  color: string;
  esInicial: boolean;
  esFinal: boolean;
}

export interface FinanzasProyecto {
  proyectoId: string;
  ingresos: number;
  egresos: number;
  utilidad: number;
  movimientos: number;
  ultimoMovimiento: string | null;
}

export interface Movimiento {
  id: string;
  proyectoId: string | null;
  sociedadNombre: string;
  proyectoNombre: string;
  fecha: string | null;
  tipo: "Ingreso" | "Egreso";
  categoria: string;
  descripcion: string;
  moneda: string;
  monto: number | null;
  montoCop: number;
  pagadoPor: string;
  medioPago: string;
  estado: string;
  /** sheet = lo trajo el importador; panel = lo cargo alguien aca. */
  origen: "sheet" | "panel";
}

/** Lo que lleva gastado y cobrado una sociedad, con los compartidos ya repartidos. */
export interface ResumenSociedad {
  sociedad: string;
  ingresos: number;
  egresos: number;
  utilidad: number;
}

export interface Proyecto {
  id: string;
  nombre: string;
  cliente: string | null;
  sociedadId: string | null;
  sociedadNombre: string | null;
  responsableId: string | null;
  responsableNombre: string | null;
  estadoComercial: EstadoComercial;
  columnaId: string | null;
  orden: number;
  fechaInicio: string | null;
  fechaCierreEst: string | null;
  pptoIngresos: number | null;
  pptoGastos: number | null;
  notas: string | null;
  archivado: boolean;
  finanzas?: FinanzasProyecto;
}

export interface ProyectoLink {
  id: string;
  proyectoId: string;
  tipo: TipoLink;
  label: string;
  url: string;
}

export interface ProyectoTarea {
  id: string;
  proyectoId: string;
  titulo: string;
  descripcion: string | null;
  estado: EstadoTarea;
  asignadoA: string | null;
  asignadoNombre: string | null;
  orden: number;
}

export interface ProyectoNota {
  id: string;
  proyectoId: string;
  autorId: string | null;
  autorNombre: string | null;
  tipo: "bug" | "nota";
  texto: string;
  resuelto: boolean;
  createdAt: string;
}

export interface EstadisticasTablero {
  activos: number;
  sinResponsable: number;
  entregadosEsteMes: number;
  porColumna: { columnaId: string; nombre: string; total: number }[];
  porResponsable: { nombre: string; total: number }[];
  diasPromedioCiclo: number | null;
}

export interface FiltrosTablero {
  sociedadId?: string;
  responsableId?: string;
  estadoComercial?: EstadoComercial;
}
