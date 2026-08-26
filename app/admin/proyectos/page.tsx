import Link from "next/link";
import { Suspense } from "react";
import { Settings2 } from "lucide-react";
import { Estadisticas } from "@/components/proyectos/Estadisticas";
import { Filtros } from "@/components/proyectos/Filtros";
import { TableroInterno } from "@/components/proyectos/TableroInterno";
import { requireAuth } from "@/lib/auth";
import {
  puedeEditarProyectos,
  puedeGestionarConfiguracion,
} from "@/lib/proyectos/permisos";
import {
  calcularEstadisticas,
  listarColumnas,
  listarProyectos,
  listarResponsables,
  listarSociedades,
} from "@/lib/proyectos/queries";
import { ESTADOS_COMERCIALES, type EstadoComercial } from "@/lib/proyectos/types";

export const metadata = { title: "Proyectos internos · Admin" };

interface Props {
  searchParams: Promise<{
    sociedad?: string;
    responsable?: string;
    estado?: string;
  }>;
}

export default async function ProyectosPage({ searchParams }: Props) {
  const usuario = await requireAuth();
  const params = await searchParams;

  const estado = ESTADOS_COMERCIALES.includes(params.estado as EstadoComercial)
    ? (params.estado as EstadoComercial)
    : undefined;

  const [columnas, proyectos, sociedades, responsables] = await Promise.all([
    listarColumnas(),
    listarProyectos({
      sociedadId: params.sociedad || undefined,
      responsableId: params.responsable || undefined,
      estadoComercial: estado,
    }),
    listarSociedades(),
    listarResponsables(),
  ]);

  const estadisticas = await calcularEstadisticas(proyectos, columnas);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Proyectos internos</h1>
          <p className="text-sm text-white/50">
            {usuario.role === "tester"
              ? "Estás en modo lectura. Podés reportar bugs desde cada proyecto."
              : "Arrastrá una tarjeta para cambiarle el estado de trabajo."}
          </p>
        </div>

        {puedeGestionarConfiguracion(usuario.role) && (
          <Link
            href="/admin/proyectos/columnas"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-white/70 transition-colors hover:border-white/20 hover:text-white"
          >
            <Settings2 className="h-4 w-4" />
            Configurar columnas
          </Link>
        )}
      </header>

      <Estadisticas datos={estadisticas} />

      <Suspense fallback={<div className="h-10" />}>
        <Filtros
          sociedades={sociedades}
          responsables={responsables}
          seleccion={{
            sociedad: params.sociedad ?? "",
            responsable: params.responsable ?? "",
            estado: estado ?? "",
          }}
        />
      </Suspense>

      <TableroInterno
        columnas={columnas}
        proyectos={proyectos}
        puedeEditar={puedeEditarProyectos(usuario.role)}
      />
    </div>
  );
}
