/**
 * Tipos del modulo Brief — cuestionario de descubrimiento de marca/tienda.
 * El cuestionario vive en content/brief/schema.ts.
 */

export type BriefCampoTipo =
  | 'text'
  | 'tel'
  | 'email'
  | 'area'
  | 'radio'
  | 'check'
  /** link (Drive, Dropbox, web) o archivo subido: se guarda la URL */
  | 'archivo';

export type BriefEstado = 'nuevo' | 'leido' | 'en_proceso' | 'archivado';

export const BRIEF_ESTADOS: readonly BriefEstado[] = [
  'nuevo',
  'leido',
  'en_proceso',
  'archivado',
] as const;

/** Condicion que hace visible un campo segun la respuesta de otro. */
export interface BriefCondicion {
  /** id del campo del que depende */
  f: string;
  /** valores que activan la visibilidad */
  v: string[];
}

export interface BriefCampo {
  id: string;
  /** etiqueta; admite {{M}} como marcador del nombre de la marca */
  l: string;
  ty: BriefCampoTipo;
  /** 1 = respuesta necesaria */
  r?: number;
  /** texto de ayuda */
  h?: string;
  /** placeholder */
  ph?: string;
  /** opciones para radio/check */
  o?: string[];
  when?: BriefCondicion;
}

export interface BriefCallout {
  tipo: 'info' | 'warn';
  /** HTML controlado por nosotros, nunca por el visitante */
  txt: string;
}

export interface BriefSeccion {
  /** numero mostrado ("0", "1", ...) */
  n: string;
  t: string;
  note?: string;
  callout?: BriefCallout;
  /** 1 = solo se muestra a clientes del sector salud */
  soloSalud?: number;
  f: BriefCampo[];
}

export interface BriefCliente {
  marca: string;
  categoria: string;
  sector: string;
  acento: string;
}

/** Respuestas en el navegador: string para todo salvo check (lista). */
export type BriefRespuestas = Record<string, string | string[]>;

/** Cuerpo que viaja al endpoint de envio. */
export interface BriefEnvio {
  cliente: string;
  /** campo trampa: siempre vacio en envios legitimos */
  sitioWeb: string;
  msEnPagina: number;
  respuestas: BriefRespuestas;
}

/** Fila de brief_submissions tal como la devuelve Supabase. */
export interface BriefSubmission {
  id: string;
  cliente: string;
  marca: string;
  sector: string;
  contacto_nombre: string;
  contacto_email: string;
  contacto_tel: string;
  empresa: string;
  completado_pct: number;
  respondidas: number;
  total_campos: number;
  estado: BriefEstado;
  notas: string | null;
  created_at: string;
  updated_at: string;
}

export interface BriefSubmissionConRespuestas extends BriefSubmission {
  respuestas: Record<string, string>;
}
