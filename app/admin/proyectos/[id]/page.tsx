import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { DetalleProyecto } from "@/components/proyectos/DetalleProyecto";
import { colorEstado } from "@/components/proyectos/mapear";
import { requireAuth } from "@/lib/auth";
import { puedeEditarProyectos } from "@/lib/proyectos/permisos";
import {
  listarLinks,
  listarNotas,
  listarResponsables,
  listarTareas,
  obtenerProyecto,
} from "@/lib/proyectos/queries";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProyectoPage({ params }: Props) {
  const usuario = await requireAuth();
  const { id } = await params;

  const proyecto = await obtenerProyecto(id);
  if (!proyecto) notFound();

  const [links, tareas, notas, responsables] = await Promise.all([
    listarLinks(id),
    listarTareas(id),
    listarNotas(id),
    listarResponsables(),
  ]);

  return (
    <div className="space-y-6">
      <Link
        href="/admin/proyectos"
        className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al tablero
      </Link>

      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold text-white">{proyecto.nombre}</h1>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs ${colorEstado(proyecto.estadoComercial)}`}
          >
            {proyecto.estadoComercial}
          </span>
        </div>
        <p className="text-sm text-white/50">
          {proyecto.sociedadNombre ?? "Sin sociedad"}
          {proyecto.cliente ? ` · ${proyecto.cliente}` : ""}
          {" · "}
          {proyecto.responsableNombre ?? "Sin tomar"}
        </p>
        {proyecto.notas && (
          <p className="max-w-2xl text-sm text-white/60">{proyecto.notas}</p>
        )}
      </header>

      <DetalleProyecto
        proyectoId={proyecto.id}
        links={links}
        tareas={tareas}
        notas={notas}
        responsables={responsables}
        puedeEditar={puedeEditarProyectos(usuario.role)}
      />
    </div>
  );
}
