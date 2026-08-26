import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { DetalleProyecto } from "@/components/proyectos/DetalleProyecto";
import { FormularioProyecto } from "@/components/proyectos/FormularioProyecto";
import { colorEstado } from "@/components/proyectos/mapear";
import { requireAuth } from "@/lib/auth";
import { puedeEditarProyectos } from "@/lib/proyectos/permisos";
import {
  listarColumnas,
  listarLinks,
  listarNotas,
  listarResponsables,
  listarSociedades,
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

  const [links, tareas, notas, responsables, sociedades, columnas] =
    await Promise.all([
      listarLinks(id),
      listarTareas(id),
      listarNotas(id),
      listarResponsables(),
      listarSociedades(),
      listarColumnas(),
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

      {puedeEditarProyectos(usuario.role) && (
        <details>
          <summary className="cursor-pointer text-sm text-white/50 transition-colors hover:text-white">
            Editar proyecto
          </summary>
          <div className="mt-3">
            <FormularioProyecto
              proyecto={proyecto}
              sociedades={sociedades}
              responsables={responsables}
              columnas={columnas}
            />
          </div>
        </details>
      )}

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
