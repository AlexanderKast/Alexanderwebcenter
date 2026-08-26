import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Adjuntos } from "@/components/finanzas/Adjuntos";
import { FormularioMovimiento } from "@/components/finanzas/FormularioMovimiento";
import { requireAuth } from "@/lib/auth";
import { adjuntosDe, obtenerMovimiento } from "@/lib/proyectos/finanzas";
import type { DatosMovimiento } from "@/lib/proyectos/movimiento-form";
import { formatearCOP } from "@/lib/proyectos/movimientos-utils";
import { puedeEditarProyectos } from "@/lib/proyectos/permisos";
import { listarProyectos, listarSociedades } from "@/lib/proyectos/queries";

interface Props {
  params: Promise<{ id: string }>;
}

const UUID = /^[0-9a-f-]{36}$/i;
const ESTADOS = ["Pagado", "Pendiente", "Cancelado"] as const;

function fecha(valor: string | null): string {
  if (!valor) return "—";
  const d = new Date(`${valor}T12:00:00`);
  return Number.isNaN(d.getTime())
    ? valor
    : d.toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" });
}

export default async function MovimientoPage({ params }: Props) {
  const usuario = await requireAuth();
  const { id } = await params;
  if (!UUID.test(id)) notFound();

  const movimiento = await obtenerMovimiento(id);
  if (!movimiento) notFound();

  const [adjuntos, sociedades, proyectos] = await Promise.all([
    adjuntosDe(id),
    listarSociedades(),
    listarProyectos(),
  ]);

  const puedeEditar = puedeEditarProyectos(usuario.role);
  const delPanel = movimiento.origen === "panel";

  const inicial: DatosMovimiento = {
    fecha: movimiento.fechaTexto,
    tipo: movimiento.tipo,
    sociedadId: movimiento.sociedadId ?? "",
    proyectoId: movimiento.proyectoId ?? "",
    categoria: movimiento.categoria,
    descripcion: movimiento.descripcion,
    moneda: movimiento.moneda === "USD" ? "USD" : "COP",
    monto: movimiento.monto === null ? "" : String(movimiento.monto),
    trm: movimiento.trm === null ? "" : String(movimiento.trm),
    medioPago: movimiento.medioPago,
    pagadoPor: movimiento.pagadoPor,
    estado: ESTADOS.includes(movimiento.estado as (typeof ESTADOS)[number])
      ? (movimiento.estado as DatosMovimiento["estado"])
      : "Pagado",
    nota: movimiento.nota,
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/admin/finanzas"
        className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a finanzas
      </Link>

      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold text-white">
            {movimiento.descripcion || "Movimiento"}
          </h1>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs ${
              movimiento.tipo === "Egreso"
                ? "bg-red-500/15 text-red-300"
                : "bg-emerald-500/15 text-emerald-300"
            }`}
          >
            {movimiento.tipo === "Egreso" ? "Gasto" : "Ingreso"}
          </span>
        </div>

        <p className="text-sm text-white/50">
          {fecha(movimiento.fechaTexto)}
          {" · "}
          {formatearCOP(movimiento.montoCop)}
          {movimiento.moneda !== "COP" && movimiento.monto !== null
            ? ` (${movimiento.monto} ${movimiento.moneda})`
            : ""}
          {" · "}
          {movimiento.sociedadNombre || "sin sociedad"}
          {movimiento.proyectoNombre ? ` · ${movimiento.proyectoNombre}` : ""}
        </p>
      </header>

      {/* Una fila del Sheet se corrige en el Sheet: editarla acá duraría
          hasta la próxima sincronización. Las facturas sí son de acá. */}
      {delPanel ? (
        puedeEditar && (
          <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-6">
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-white/60">
              Editar
            </h2>
            <FormularioMovimiento
              sociedades={sociedades}
              proyectos={proyectos}
              inicial={inicial}
              movimientoId={id}
            />
          </div>
        )
      ) : (
        <p className="rounded-2xl border border-amber-400/25 bg-amber-400/5 px-4 py-3 text-sm text-amber-200/90">
          Este movimiento viene del Google Sheet. Para cambiar el monto o la fecha,
          corregilo allá y tocá Sincronizar gastos. Las facturas sí se suben acá.
        </p>
      )}

      <Adjuntos movimientoId={id} adjuntos={adjuntos} puedeEditar={puedeEditar} />
    </div>
  );
}
