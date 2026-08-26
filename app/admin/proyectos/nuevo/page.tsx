import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { FormularioProyecto } from "@/components/proyectos/FormularioProyecto";
import { requireAuth } from "@/lib/auth";
import { puedeEditarProyectos } from "@/lib/proyectos/permisos";
import {
  listarColumnas,
  listarResponsables,
  listarSociedades,
} from "@/lib/proyectos/queries";

export const metadata = { title: "Nuevo proyecto · Admin" };

export default async function NuevoProyectoPage() {
  const usuario = await requireAuth();
  if (!puedeEditarProyectos(usuario.role)) redirect("/admin/proyectos");

  const [sociedades, responsables, columnas] = await Promise.all([
    listarSociedades(),
    listarResponsables(),
    listarColumnas(),
  ]);

  return (
    <div className="max-w-3xl space-y-6">
      <Link
        href="/admin/proyectos"
        className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al tablero
      </Link>

      <header>
        <h1 className="text-2xl font-semibold text-white">Nuevo proyecto</h1>
        <p className="text-sm text-white/50">
          Cargá los datos básicos. Después vas a poder sumarle tareas, links y
          notas desde la ficha del proyecto.
        </p>
      </header>

      <FormularioProyecto
        sociedades={sociedades}
        responsables={responsables}
        columnas={columnas}
      />
    </div>
  );
}
