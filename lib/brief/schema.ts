import { BRIEF_CLIENTES, BRIEF_SECCIONES } from '@/content/brief/schema';
import type {
  BriefCampo,
  BriefCliente,
  BriefRespuestas,
  BriefSeccion,
} from '@/types/brief';

/**
 * Logica compartida del cuestionario. Se usa igual en el navegador
 * (pintar, progreso) y en el servidor (validar). Un solo criterio.
 */

const MAX_TEXTO = 300;
const MAX_AREA = 5000;
const MAX_EMAIL = 190;
const MAX_TEL = 40;
const MAX_URL = 500;
/** Solo http(s): evita javascript:, data: y demas esquemas. */
const URL_VALIDA = /^https?:\/\/[^\s]+\.[^\s]{2,}$/i;

/** Campos sin los cuales no podemos responderle a la persona. */
export const CAMPOS_OBLIGATORIOS = ['contacto_nombre', 'contacto_whatsapp'] as const;

export const CLIENTE_POR_DEFECTO = 'demo';

export interface ClienteResuelto extends BriefCliente {
  slug: string;
}

/** Resuelve un slug contra la lista blanca de clientes. Nunca falla. */
export function resolverCliente(slug: string | undefined): ClienteResuelto {
  const clave = (slug ?? '').toLowerCase().trim();
  const encontrado = BRIEF_CLIENTES[clave];
  if (encontrado) return { ...encontrado, slug: clave };

  const fallback = BRIEF_CLIENTES[CLIENTE_POR_DEFECTO];
  return { ...fallback, slug: CLIENTE_POR_DEFECTO };
}

export function listaClientes(): ClienteResuelto[] {
  return Object.entries(BRIEF_CLIENTES).map(([slug, cliente]) => ({ ...cliente, slug }));
}

/** Secciones aplicables: las de salud solo para clientes del sector salud. */
export function seccionesPara(sector: string): BriefSeccion[] {
  return BRIEF_SECCIONES.filter((s) => !s.soloSalud || sector === 'salud');
}

/** Mapa campo_id → definicion, para el sector indicado. */
export function camposPara(sector: string): Map<string, BriefCampo> {
  const mapa = new Map<string, BriefCampo>();
  for (const seccion of seccionesPara(sector)) {
    for (const campo of seccion.f) mapa.set(campo.id, campo);
  }
  return mapa;
}

/** Reemplaza {{M}} por el nombre de la marca. */
export function conMarca(texto: string, marca: string): string {
  return texto.split('{{M}}').join(marca);
}

/** ¿El campo se muestra con las respuestas actuales? */
export function esVisible(campo: BriefCampo, respuestas: BriefRespuestas): boolean {
  const condicion = campo.when;
  if (!condicion) return true;
  const valor = respuestas[condicion.f];
  if (Array.isArray(valor)) return valor.some((v) => condicion.v.includes(v));
  return typeof valor === 'string' && condicion.v.includes(valor);
}

export function camposVisibles(seccion: BriefSeccion, respuestas: BriefRespuestas): BriefCampo[] {
  return seccion.f.filter((campo) => esVisible(campo, respuestas));
}

export function tieneValor(valor: string | string[] | undefined): boolean {
  if (Array.isArray(valor)) return valor.length > 0;
  return typeof valor === 'string' && valor.trim().length > 0;
}

export interface Progreso {
  total: number;
  respondidas: number;
  faltanNecesarias: number;
  pct: number;
}

export function calcularProgreso(secciones: BriefSeccion[], respuestas: BriefRespuestas): Progreso {
  let total = 0;
  let respondidas = 0;
  let faltanNecesarias = 0;

  for (const seccion of secciones) {
    for (const campo of camposVisibles(seccion, respuestas)) {
      total += 1;
      if (tieneValor(respuestas[campo.id])) respondidas += 1;
      else if (campo.r) faltanNecesarias += 1;
    }
  }

  return {
    total,
    respondidas,
    faltanNecesarias,
    pct: total > 0 ? Math.round((respondidas / total) * 100) : 0,
  };
}

/* ============================================================
   Normalizacion + validacion (servidor)
   ============================================================ */

export interface ResultadoValidacion {
  valores: Record<string, string>;
  errores: string[];
  respondidas: number;
  total: number;
  pct: number;
}

/** Caracteres de control, conservando tabulacion y salto de linea. */
const CONTROL = new RegExp('[' + String.fromCharCode(0) + '-' + String.fromCharCode(8) + String.fromCharCode(11) + String.fromCharCode(12) + String.fromCharCode(14) + '-' + String.fromCharCode(31) + String.fromCharCode(127) + ']', 'g');
const TEL_VALIDO = /^[0-9+()\s.-]{6,}$/;
const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function limpiar(valor: string, max: number): string {
  return valor.replace(/\r/g, '').replace(CONTROL, '').trim().slice(0, max);
}

/**
 * Normaliza y valida respuestas crudas contra el cuestionario.
 * Descarta campos desconocidos, valores fuera de las opciones permitidas
 * y respuestas de condicionales que no aplican. Nunca confia en el cliente.
 */
export function validarRespuestas(
  entrada: unknown,
  sector: string,
  marca: string,
): ResultadoValidacion {
  const campos = camposPara(sector);
  const crudo = (entrada && typeof entrada === 'object' ? entrada : {}) as Record<string, unknown>;
  const valores: Record<string, string> = {};
  const errores: string[] = [];

  for (const [id, campo] of campos) {
    if (!(id in crudo)) continue;
    const bruto = crudo[id];

    if (campo.ty === 'check') {
      const permitidas = campo.o ?? [];
      const lista = Array.isArray(bruto) ? bruto.map(String) : String(bruto ?? '').split('|');
      const elegidas: string[] = [];
      for (const item of lista) {
        const v = limpiar(item, MAX_TEXTO);
        if (v && permitidas.includes(v) && !elegidas.includes(v)) elegidas.push(v);
      }
      valores[id] = elegidas.join(' | ');
      continue;
    }

    const plano = Array.isArray(bruto) ? bruto.map(String).join(' | ') : String(bruto ?? '');
    let valor = limpiar(plano, campo.ty === 'area' ? MAX_AREA : MAX_TEXTO);

    if (campo.ty === 'radio') {
      if (valor && !(campo.o ?? []).includes(valor)) valor = '';
    } else if (campo.ty === 'email') {
      valor = valor.slice(0, MAX_EMAIL);
      if (valor && !EMAIL_VALIDO.test(valor)) {
        errores.push('El correo electronico no tiene un formato valido.');
        valor = '';
      }
    } else if (campo.ty === 'tel') {
      valor = valor.slice(0, MAX_TEL);
      if (valor && !TEL_VALIDO.test(valor)) {
        errores.push('El telefono o WhatsApp solo admite numeros, espacios y los signos + ( ) - .');
        valor = '';
      }
    } else if (campo.ty === 'archivo') {
      valor = valor.slice(0, MAX_URL);
      if (valor && !URL_VALIDA.test(valor)) {
        errores.push('El enlace del archivo debe empezar por http:// o https://');
        valor = '';
      }
    }

    valores[id] = valor;
  }

  // Condicionales cuya condicion no se cumple: la respuesta se descarta.
  for (const [id, campo] of campos) {
    const condicion = campo.when;
    if (!condicion || !(id in valores)) continue;
    const dependencia = valores[condicion.f] ?? '';
    const marcados = dependencia ? dependencia.split('|').map((v) => v.trim()) : [];
    if (!marcados.some((v) => condicion.v.includes(v))) delete valores[id];
  }

  for (const id of CAMPOS_OBLIGATORIOS) {
    const campo = campos.get(id);
    if (!campo) continue;
    if (!(valores[id] ?? '').trim()) {
      errores.push(`Falta un dato necesario: ${conMarca(campo.l, marca)}.`);
    }
  }

  let total = 0;
  let respondidas = 0;
  for (const [id, campo] of campos) {
    if (campo.when && !(id in valores)) continue;
    total += 1;
    if ((valores[id] ?? '').trim()) respondidas += 1;
  }

  return {
    valores,
    errores: [...new Set(errores)],
    respondidas,
    total,
    pct: total > 0 ? Math.round((respondidas / total) * 100) : 0,
  };
}
