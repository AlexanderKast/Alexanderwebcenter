import { z } from "zod";
import {
  ESTADOS_MOVIMIENTO,
  MEDIOS_PAGO,
  MONEDAS,
  TIPOS_MOVIMIENTO,
  categoriasDe,
  mesDe,
  montoEnPesos,
  parsearMonto,
  type TipoMovimiento,
} from "./movimientos-utils";

/**
 * Forma de un movimiento cargado a mano desde el panel.
 *
 * Vive aparte de la server action para que el formulario del navegador y el
 * servidor validen con la misma regla, y para poder probarlo sin base.
 */

export const esquemaMovimiento = z.object({
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Falta la fecha."),
  tipo: z.enum(TIPOS_MOVIMIENTO),
  sociedadId: z.string().uuid().or(z.literal("")),
  proyectoId: z.string().uuid().or(z.literal("")),
  categoria: z.string().trim().max(80),
  descripcion: z.string().trim().min(1, "Escribí de qué se trata.").max(300),
  moneda: z.enum(MONEDAS),
  monto: z.string().trim().min(1, "Falta el monto."),
  trm: z.string().trim().max(30),
  medioPago: z.string().trim().max(40),
  pagadoPor: z.string().trim().max(80),
  estado: z.enum(ESTADOS_MOVIMIENTO),
  nota: z.string().trim().max(1000),
});

export type DatosMovimiento = z.infer<typeof esquemaMovimiento>;

/** Los nombres que el Sheet guarda al lado de los ids; se resuelven afuera. */
export interface NombresMovimiento {
  sociedadNombre: string;
  proyectoNombre: string;
}

export type FilaMovimientoPanel = {
  sociedad_id: string | null;
  proyecto_id: string | null;
  sociedad_nombre: string;
  proyecto_nombre: string;
  fecha: string;
  mes: string;
  tipo: string;
  categoria: string;
  descripcion: string;
  moneda: string;
  monto: number;
  trm: number | null;
  monto_cop: number;
  pagado_por: string;
  medio_pago: string;
  estado: string;
  nota: string;
  origen: "panel";
};

/**
 * Convierte lo que se escribio en el formulario en la fila de la base.
 *
 * Devuelve el error como texto en lugar de tirar: son cosas que la persona
 * puede arreglar sola y el formulario tiene que poder mostrarlas.
 */
export function armarFilaMovimiento(
  datos: DatosMovimiento,
  nombres: NombresMovimiento,
): { fila: FilaMovimientoPanel } | { error: string } {
  const monto = parsearMonto(datos.monto);
  if (monto === null || monto === 0) {
    return { error: "El monto no se entiende o quedó en cero." };
  }

  const trm = datos.moneda === "COP" ? null : parsearMonto(datos.trm);
  const montoCop = montoEnPesos(datos.moneda, monto, trm);
  if (montoCop === null) {
    return { error: "Para una moneda que no es COP hace falta la TRM del día." };
  }

  // Una categoria de ingreso en un egreso no significa nada: mejor vacia
  // que mintiendo en los informes.
  const categoria = categoriasDe(datos.tipo as TipoMovimiento).includes(datos.categoria)
    ? datos.categoria
    : "";

  const medioPago = (MEDIOS_PAGO as readonly string[]).includes(datos.medioPago)
    ? datos.medioPago
    : "";

  return {
    fila: {
      sociedad_id: datos.sociedadId || null,
      proyecto_id: datos.proyectoId || null,
      sociedad_nombre: nombres.sociedadNombre,
      proyecto_nombre: nombres.proyectoNombre,
      fecha: datos.fecha,
      mes: mesDe(datos.fecha),
      tipo: datos.tipo,
      categoria,
      descripcion: datos.descripcion,
      moneda: datos.moneda,
      monto,
      trm,
      monto_cop: montoCop,
      pagado_por: datos.pagadoPor,
      medio_pago: medioPago,
      estado: datos.estado,
      nota: datos.nota,
      origen: "panel",
    },
  };
}

/** Un formulario vacío, con la fecha de hoy puesta por quien lo abre. */
export function movimientoVacio(hoy: string): DatosMovimiento {
  return {
    fecha: hoy,
    tipo: "Egreso",
    sociedadId: "",
    proyectoId: "",
    categoria: "",
    descripcion: "",
    moneda: "COP",
    monto: "",
    trm: "",
    medioPago: "",
    pagadoPor: "",
    estado: "Pagado",
    nota: "",
  };
}
