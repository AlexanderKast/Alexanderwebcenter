import { formatearCOP } from "@/lib/proyectos/movimientos-utils";
import type { FinanzasProyecto, Movimiento, Proyecto } from "@/lib/proyectos/types";

interface Props {
  proyecto: Proyecto;
  finanzas: FinanzasProyecto;
  movimientos: Movimiento[];
}

function fecha(valor: string | null): string {
  if (!valor) return "—";
  const d = new Date(`${valor}T12:00:00`);
  return Number.isNaN(d.getTime())
    ? valor
    : d.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
}

/**
 * La plata del proyecto: lo que entro, lo que salio y en que se fue.
 *
 * Todo sale de la hoja de movimientos del Sheet. Si no hay nada anotado se
 * dice asi, en vez de mostrar ceros que parecen un error.
 */
export function Finanzas({ proyecto, finanzas, movimientos }: Props) {
  const hayPresupuesto = proyecto.pptoGastos !== null && proyecto.pptoGastos > 0;
  const consumido = hayPresupuesto
    ? Math.min(100, Math.round((finanzas.egresos / proyecto.pptoGastos!) * 100))
    : null;

  return (
    <section className="space-y-4 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-white/60">
          Plata del proyecto
        </h2>
        <span className="text-xs text-white/35">
          {finanzas.movimientos === 0
            ? "sin movimientos"
            : `${finanzas.movimientos} movimiento${finanzas.movimientos === 1 ? "" : "s"} · último ${fecha(finanzas.ultimoMovimiento)}`}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <p className="text-xs text-white/40">Cobrado</p>
          <p className="mt-1 text-xl font-semibold text-emerald-300">
            {formatearCOP(finanzas.ingresos)}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <p className="text-xs text-white/40">Gastado</p>
          <p className="mt-1 text-xl font-semibold text-red-300">
            {formatearCOP(finanzas.egresos)}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <p className="text-xs text-white/40">Utilidad</p>
          <p
            className={`mt-1 text-xl font-semibold ${
              finanzas.utilidad < 0 ? "text-red-300" : "text-white"
            }`}
          >
            {formatearCOP(finanzas.utilidad)}
          </p>
        </div>
      </div>

      {hayPresupuesto && (
        <div>
          <div className="flex items-baseline justify-between text-xs text-white/40">
            <span>Presupuesto de gastos</span>
            <span>
              {formatearCOP(finanzas.egresos)} de {formatearCOP(proyecto.pptoGastos!)} ·{" "}
              {consumido}%
            </span>
          </div>
          <span className="mt-1.5 block h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <span
              className={`block h-full rounded-full ${
                (consumido ?? 0) >= 100 ? "bg-red-400" : "bg-[#D4AF37]"
              }`}
              style={{ width: `${consumido}%` }}
            />
          </span>
        </div>
      )}

      {movimientos.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-white/45">
          Todavía no hay gastos ni cobros anotados para este proyecto en el Sheet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.03] text-left text-[11px] uppercase tracking-widest text-white/40">
              <tr>
                <th className="px-3 py-2 font-medium">Fecha</th>
                <th className="px-3 py-2 font-medium">Concepto</th>
                <th className="px-3 py-2 font-medium">Categoría</th>
                <th className="px-3 py-2 text-right font-medium">Monto</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.map((m) => (
                <tr key={m.id} className="border-t border-white/5">
                  <td className="whitespace-nowrap px-3 py-2 text-xs text-white/50">
                    {fecha(m.fecha)}
                  </td>
                  <td className="px-3 py-2 text-white/85">
                    {m.descripcion || "—"}
                    {m.moneda !== "COP" && m.monto !== null && (
                      <span className="ml-2 text-xs text-white/35">
                        {m.monto} {m.moneda}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-xs text-white/45">{m.categoria || "—"}</td>
                  <td
                    className={`whitespace-nowrap px-3 py-2 text-right ${
                      m.tipo === "Egreso" ? "text-red-300" : "text-emerald-300"
                    }`}
                  >
                    {m.tipo === "Egreso" ? "−" : "+"}
                    {formatearCOP(m.montoCop)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
