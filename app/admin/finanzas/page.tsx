import Link from "next/link";
import { redirect } from "next/navigation";
import { Paperclip, Plus } from "lucide-react";
import { SincronizarGastos } from "@/components/proyectos/SincronizarGastos";
import { requireAuth } from "@/lib/auth";
import {
  conteoAdjuntos,
  listarMovimientos,
  resumenPorSociedad,
} from "@/lib/proyectos/finanzas";
import { formatearCOP } from "@/lib/proyectos/movimientos-utils";
import {
  puedeEditarProyectos,
  puedeGestionarConfiguracion,
} from "@/lib/proyectos/permisos";
import { listarProyectos } from "@/lib/proyectos/queries";

export const metadata = { title: "Finanzas · Admin" };

function fecha(valor: string | null): string {
  if (!valor) return "—";
  const d = new Date(`${valor}T12:00:00`);
  return Number.isNaN(d.getTime())
    ? valor
    : d.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function FinanzasPage() {
  const usuario = await requireAuth();
  if (!puedeGestionarConfiguracion(usuario.role)) redirect("/admin/proyectos");

  const [sociedades, movimientos, proyectos, adjuntos] = await Promise.all([
    resumenPorSociedad(),
    listarMovimientos(),
    listarProyectos(),
    conteoAdjuntos(),
  ]);

  const porId = new Map(proyectos.map((p) => [p.id, p]));

  const totalIngresos = sociedades.reduce((s, x) => s + x.ingresos, 0);
  const totalEgresos = sociedades.reduce((s, x) => s + x.egresos, 0);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Finanzas</h1>
          <p className="max-w-2xl text-sm text-white/50">
            Todo lo que entra y sale, junto a los proyectos. Podés registrar un
            gasto o un cobro acá con su factura, y lo que ya está anotado en el
            Google Sheet se trae con Sincronizar. Lo cargado acá el importador no
            lo toca.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {puedeEditarProyectos(usuario.role) && (
            <Link
              href="/admin/finanzas/nuevo"
              className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-3 py-2 text-sm text-black transition-opacity hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Registrar movimiento
            </Link>
          )}
          <SincronizarGastos />
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-5">
          <p className="text-xs text-white/40">Cobrado</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-300">
            {formatearCOP(totalIngresos)}
          </p>
        </div>
        <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-5">
          <p className="text-xs text-white/40">Gastado</p>
          <p className="mt-1 text-2xl font-semibold text-red-300">
            {formatearCOP(totalEgresos)}
          </p>
        </div>
        <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-5">
          <p className="text-xs text-white/40">Utilidad</p>
          <p
            className={`mt-1 text-2xl font-semibold ${
              totalIngresos - totalEgresos < 0 ? "text-red-300" : "text-white"
            }`}
          >
            {formatearCOP(totalIngresos - totalEgresos)}
          </p>
        </div>
      </div>

      {/* Por sociedad: los gastos compartidos ya vienen repartidos del Sheet. */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-white/60">
          Por sociedad
        </h2>

        {sociedades.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-white/50">
            Todavía no hay movimientos. Tocá Sincronizar gastos para traerlos del Sheet.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-[color:var(--line)]">
            <table className="w-full text-sm">
              <thead className="bg-white/[0.03] text-left text-[11px] uppercase tracking-widest text-white/40">
                <tr>
                  <th className="px-4 py-3 font-medium">Sociedad</th>
                  <th className="px-4 py-3 text-right font-medium">Cobrado</th>
                  <th className="px-4 py-3 text-right font-medium">Gastado</th>
                  <th className="px-4 py-3 text-right font-medium">Utilidad</th>
                </tr>
              </thead>
              <tbody>
                {sociedades.map((s) => (
                  <tr key={s.sociedad} className="border-t border-white/5">
                    <td className="px-4 py-3 text-white/85">{s.sociedad}</td>
                    <td className="px-4 py-3 text-right text-emerald-300">
                      {formatearCOP(s.ingresos)}
                    </td>
                    <td className="px-4 py-3 text-right text-red-300">
                      {formatearCOP(s.egresos)}
                    </td>
                    <td
                      className={`px-4 py-3 text-right ${
                        s.utilidad < 0 ? "text-red-300" : "text-white"
                      }`}
                    >
                      {formatearCOP(s.utilidad)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Todos los movimientos, lo último arriba. */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-white/60">
          Movimientos ({movimientos.length})
        </h2>

        {movimientos.length > 0 && (
          <div className="overflow-x-auto rounded-2xl border border-[color:var(--line)]">
            <table className="w-full text-sm">
              <thead className="bg-white/[0.03] text-left text-[11px] uppercase tracking-widest text-white/40">
                <tr>
                  <th className="px-4 py-3 font-medium">Fecha</th>
                  <th className="px-4 py-3 font-medium">Concepto</th>
                  <th className="px-4 py-3 font-medium">Proyecto</th>
                  <th className="px-4 py-3 font-medium">Sociedad</th>
                  <th className="px-4 py-3 text-right font-medium">Monto</th>
                </tr>
              </thead>
              <tbody>
                {movimientos.map((m) => {
                  const proyecto = m.proyectoId ? porId.get(m.proyectoId) : null;

                  return (
                    <tr key={m.id} className="border-t border-white/5">
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-white/50">
                        {fecha(m.fecha)}
                      </td>
                      <td className="px-4 py-3 text-white/85">
                        <Link
                          href={`/admin/finanzas/${m.id}`}
                          className="underline-offset-4 hover:underline"
                        >
                          {m.descripcion || "—"}
                        </Link>
                        <div className="flex items-center gap-2 text-xs text-white/35">
                          <span>{m.categoria || "—"}</span>
                          {(adjuntos.get(m.id) ?? 0) > 0 && (
                            <span
                              className="inline-flex items-center gap-1 text-white/45"
                              title="Tiene facturas"
                            >
                              <Paperclip className="h-3 w-3" />
                              {adjuntos.get(m.id)}
                            </span>
                          )}
                          {m.origen === "panel" && (
                            <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] text-white/50">
                              panel
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {proyecto ? (
                          <Link
                            href={`/admin/proyectos/${proyecto.id}`}
                            className="text-white/70 underline-offset-4 hover:text-white hover:underline"
                          >
                            {proyecto.nombre}
                          </Link>
                        ) : (
                          /* Un gasto que nombra un proyecto que no está en el
                             tablero: la plata está, pero no suma a ninguna tarjeta. */
                          <span className="text-amber-300/80">
                            {m.proyectoNombre || "sin proyecto"}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-white/45">
                        {m.sociedadNombre || "—"}
                      </td>
                      <td
                        className={`whitespace-nowrap px-4 py-3 text-right ${
                          m.tipo === "Egreso" ? "text-red-300" : "text-emerald-300"
                        }`}
                      >
                        {m.tipo === "Egreso" ? "−" : "+"}
                        {formatearCOP(m.montoCop)}
                        {m.moneda !== "COP" && m.monto !== null && (
                          <div className="text-xs text-white/35">
                            {m.monto} {m.moneda}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
