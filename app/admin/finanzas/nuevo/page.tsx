import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { FormularioMovimiento } from "@/components/finanzas/FormularioMovimiento";
import { requireAuth } from "@/lib/auth";
import { movimientoVacio } from "@/lib/proyectos/movimiento-form";
import { puedeEditarProyectos } from "@/lib/proyectos/permisos";
import { listarProyectos, listarSociedades } from "@/lib/proyectos/queries";

export const metadata = { title: "Registrar movimiento · Admin" };

/**
 * Hoy en Bogotá. El servidor corre en UTC: de noche ya es el día siguiente
 * allá, y el formulario abriría con la fecha de mañana.
 * en-CA da el formato YYYY-MM-DD, que es el que espera el input date.
 */
function hoyEnBogota(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" });
}

export default async function NuevoMovimientoPage() {
  const usuario = await requireAuth();
  if (!puedeEditarProyectos(usuario.role)) redirect("/admin/finanzas");

  const [sociedades, proyectos] = await Promise.all([
    listarSociedades(),
    listarProyectos(),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/admin/finanzas"
        className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a finanzas
      </Link>

      <header>
        <h1 className="text-2xl font-semibold text-white">Registrar movimiento</h1>
        <p className="text-sm text-white/50">
          Un gasto o un cobro. Queda marcado como cargado desde el panel, así el
          importador del Sheet no lo pisa nunca. Las facturas se suben después de
          guardarlo.
        </p>
      </header>

      <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-6">
        <FormularioMovimiento
          sociedades={sociedades}
          proyectos={proyectos}
          inicial={movimientoVacio(hoyEnBogota())}
        />
      </div>
    </div>
  );
}
