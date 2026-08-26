import type {
  KanbanColumn,
  KanbanItem,
} from "@/components/portal/KanbanBoard";
import type {
  ColumnaKanban,
  EstadoComercial,
  Proyecto,
} from "@/lib/proyectos/types";

/** Color del badge segun el estado comercial del proyecto. */
export function colorEstado(estado: EstadoComercial): string {
  switch (estado) {
    case "En curso":
      return "bg-emerald-500/15 text-emerald-300";
    case "Propuesta enviada":
      return "bg-sky-500/15 text-sky-300";
    case "Prospecto":
      return "bg-white/10 text-white/60";
    case "Pausado":
      return "bg-amber-500/15 text-amber-300";
    case "Cerrado":
      return "bg-violet-500/15 text-violet-300";
    case "Perdido":
      return "bg-red-500/15 text-red-300";
  }
}

/** Un proyecto como lo espera el KanbanBoard que ya existe. */
export function proyectoAItem(proyecto: Proyecto): KanbanItem {
  const meta: string[] = [];

  meta.push(proyecto.responsableNombre ?? "Sin tomar");
  if (proyecto.cliente) meta.push(proyecto.cliente);
  if (proyecto.fechaCierreEst) meta.push(`Cierra ${proyecto.fechaCierreEst}`);

  return {
    id: proyecto.id,
    title: proyecto.nombre,
    subtitle: proyecto.sociedadNombre ?? "Sin sociedad",
    badge: proyecto.estadoComercial,
    badgeColor: colorEstado(proyecto.estadoComercial),
    meta,
  };
}

/**
 * Arma las columnas del tablero. Un proyecto sin columna cae en la inicial,
 * que es el caso de los que se importaron sin estado.
 */
export function armarColumnas(
  proyectos: Proyecto[],
  columnas: ColumnaKanban[],
): KanbanColumn[] {
  const inicial = columnas.find((c) => c.esInicial) ?? columnas[0];

  return columnas.map((columna) => {
    const propios = proyectos
      .filter((p) => (p.columnaId ?? inicial?.id) === columna.id)
      .sort((a, b) => a.orden - b.orden);

    return {
      id: columna.id,
      label: columna.nombre,
      color: columna.color,
      items: propios.map(proyectoAItem),
    };
  });
}
