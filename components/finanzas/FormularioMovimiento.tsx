"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  actualizarMovimiento,
  crearMovimiento,
  eliminarMovimiento,
} from "@/app/actions/movimientos";
import type { DatosMovimiento } from "@/lib/proyectos/movimiento-form";
import {
  ESTADOS_MOVIMIENTO,
  MEDIOS_PAGO,
  MONEDAS,
  PAGADO_POR,
  TIPOS_MOVIMIENTO,
  categoriasDe,
  formatearCOP,
  montoEnPesos,
  parsearMonto,
  type TipoMovimiento,
} from "@/lib/proyectos/movimientos-utils";
import type { Proyecto, Sociedad } from "@/lib/proyectos/types";

interface Props {
  sociedades: Sociedad[];
  proyectos: Proyecto[];
  inicial: DatosMovimiento;
  /** Si viene, se edita ese movimiento en lugar de crear uno nuevo. */
  movimientoId?: string;
}

const campo =
  "h-11 w-full rounded-lg border border-[color:var(--line)] bg-[color:var(--surface-2)] px-3 text-sm text-white outline-none focus-visible:border-[#D4AF37]";
const etiqueta = "text-xs font-semibold uppercase tracking-[0.16em] text-white/50";

export function FormularioMovimiento({
  sociedades,
  proyectos,
  inicial,
  movimientoId,
}: Props) {
  const router = useRouter();
  const [datos, setDatos] = useState<DatosMovimiento>(inicial);
  const [pendiente, arrancar] = useTransition();
  const [borrando, arrancarBorrado] = useTransition();

  function set<K extends keyof DatosMovimiento>(clave: K, valor: DatosMovimiento[K]) {
    setDatos((d) => ({ ...d, [clave]: valor }));
  }

  // Solo los proyectos de la sociedad elegida: un gasto de EcomNoticias no
  // se carga contra un proyecto de IA Master Tech.
  const proyectosVisibles = useMemo(
    () =>
      datos.sociedadId
        ? proyectos.filter((p) => p.sociedadId === datos.sociedadId)
        : proyectos,
    [proyectos, datos.sociedadId],
  );

  const enPesos = montoEnPesos(
    datos.moneda,
    parsearMonto(datos.monto),
    parsearMonto(datos.trm),
  );

  function guardar(e: React.FormEvent) {
    e.preventDefault();
    arrancar(async () => {
      const resultado = movimientoId
        ? await actualizarMovimiento(movimientoId, datos)
        : await crearMovimiento(datos);

      if (!resultado.ok) {
        toast.error(resultado.error);
        return;
      }

      toast.success(movimientoId ? "Movimiento actualizado" : "Movimiento registrado");
      router.push(`/admin/finanzas/${resultado.id}`);
      router.refresh();
    });
  }

  function borrar() {
    if (!movimientoId) return;
    if (!confirm("¿Borrar este movimiento y sus facturas?")) return;

    arrancarBorrado(async () => {
      const resultado = await eliminarMovimiento(movimientoId);
      if (!resultado.ok) {
        toast.error(resultado.error);
        return;
      }
      toast.success("Movimiento borrado");
      router.push("/admin/finanzas");
      router.refresh();
    });
  }

  return (
    <form onSubmit={guardar} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5">
          <span className={etiqueta}>Tipo</span>
          <select
            className={campo}
            value={datos.tipo}
            onChange={(e) => {
              const tipo = e.target.value as TipoMovimiento;
              // La categoría vieja puede no existir en el otro tipo.
              setDatos((d) => ({ ...d, tipo, categoria: "" }));
            }}
          >
            {TIPOS_MOVIMIENTO.map((t) => (
              <option key={t} value={t}>
                {t === "Egreso" ? "Gasto" : "Ingreso"}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5">
          <span className={etiqueta}>Fecha</span>
          <input
            type="date"
            required
            className={campo}
            value={datos.fecha}
            onChange={(e) => set("fecha", e.target.value)}
          />
        </label>

        <label className="space-y-1.5">
          <span className={etiqueta}>Sociedad</span>
          <select
            className={campo}
            value={datos.sociedadId}
            onChange={(e) =>
              setDatos((d) => ({ ...d, sociedadId: e.target.value, proyectoId: "" }))
            }
          >
            <option value="">Sin sociedad</option>
            {sociedades.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5">
          <span className={etiqueta}>Proyecto</span>
          <select
            className={campo}
            value={datos.proyectoId}
            onChange={(e) => set("proyectoId", e.target.value)}
          >
            <option value="">Sin proyecto</option>
            {proyectosVisibles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block space-y-1.5">
        <span className={etiqueta}>Concepto</span>
        <input
          required
          maxLength={300}
          placeholder="Hosting del mes, anticipo del cliente…"
          className={campo}
          value={datos.descripcion}
          onChange={(e) => set("descripcion", e.target.value)}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5">
          <span className={etiqueta}>Categoría</span>
          <select
            className={campo}
            value={datos.categoria}
            onChange={(e) => set("categoria", e.target.value)}
          >
            <option value="">Sin categoría</option>
            {categoriasDe(datos.tipo as TipoMovimiento).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5">
          <span className={etiqueta}>Estado</span>
          <select
            className={campo}
            value={datos.estado}
            onChange={(e) => set("estado", e.target.value as DatosMovimiento["estado"])}
          >
            {ESTADOS_MOVIMIENTO.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="space-y-1.5">
          <span className={etiqueta}>Moneda</span>
          <select
            className={campo}
            value={datos.moneda}
            onChange={(e) => set("moneda", e.target.value as DatosMovimiento["moneda"])}
          >
            {MONEDAS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5">
          <span className={etiqueta}>Monto</span>
          <input
            required
            inputMode="decimal"
            placeholder={datos.moneda === "COP" ? "238.080" : "19.00"}
            className={campo}
            value={datos.monto}
            onChange={(e) => set("monto", e.target.value)}
          />
        </label>

        {datos.moneda === "COP" ? (
          <div className="space-y-1.5">
            <span className={etiqueta}>En pesos</span>
            <p className="flex h-11 items-center text-sm text-white/60">
              {enPesos === null ? "—" : formatearCOP(enPesos)}
            </p>
          </div>
        ) : (
          <label className="space-y-1.5">
            <span className={etiqueta}>TRM del día</span>
            <input
              inputMode="decimal"
              placeholder="3.238,19"
              className={campo}
              value={datos.trm}
              onChange={(e) => set("trm", e.target.value)}
            />
          </label>
        )}
      </div>

      {datos.moneda !== "COP" && (
        <p className="text-xs text-white/45">
          {enPesos === null
            ? "Poné la TRM del día para saber cuánto es en pesos."
            : `Queda registrado como ${formatearCOP(enPesos)}.`}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5">
          <span className={etiqueta}>Medio de pago</span>
          <select
            className={campo}
            value={datos.medioPago}
            onChange={(e) => set("medioPago", e.target.value)}
          >
            <option value="">Sin especificar</option>
            {MEDIOS_PAGO.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5">
          <span className={etiqueta}>
            {datos.tipo === "Ingreso" ? "Recibido por" : "Pagado por"}
          </span>
          <select
            className={campo}
            value={datos.pagadoPor}
            onChange={(e) => set("pagadoPor", e.target.value)}
          >
            <option value="">Sin especificar</option>
            {PAGADO_POR.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block space-y-1.5">
        <span className={etiqueta}>Nota</span>
        <textarea
          rows={3}
          maxLength={1000}
          placeholder="Número de factura, a qué corresponde, lo que haga falta recordar."
          className="w-full rounded-lg border border-[color:var(--line)] bg-[color:var(--surface-2)] p-3 text-sm text-white outline-none focus-visible:border-[#D4AF37]"
          value={datos.nota}
          onChange={(e) => set("nota", e.target.value)}
        />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pendiente}
          className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-4 py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pendiente && <Loader2 className="h-4 w-4 animate-spin" />}
          {movimientoId ? "Guardar cambios" : "Registrar movimiento"}
        </button>

        {movimientoId && (
          <button
            type="button"
            onClick={borrar}
            disabled={borrando}
            className="inline-flex items-center gap-2 rounded-lg border border-red-400/30 px-4 py-2.5 text-sm text-red-300 transition-colors hover:border-red-400/60 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            Borrar
          </button>
        )}
      </div>
    </form>
  );
}
