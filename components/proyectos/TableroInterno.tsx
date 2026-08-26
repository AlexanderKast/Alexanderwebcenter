"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { moverProyecto } from "@/app/actions/proyectos";
import { KanbanBoard } from "@/components/portal/KanbanBoard";
import type { ColumnaKanban, Proyecto } from "@/lib/proyectos/types";
import { armarColumnas } from "./mapear";

interface Props {
  columnas: ColumnaKanban[];
  proyectos: Proyecto[];
  puedeEditar: boolean;
}

/**
 * Envuelve el KanbanBoard del portal. El componente ya resuelve el arrastre;
 * aca solo se traducen proyectos a tarjetas y se guarda el movimiento.
 *
 * El estado local hace que la tarjeta se quede donde la soltaron mientras el
 * servidor confirma. Si falla, se vuelve atras y sale un toast.
 */
export function TableroInterno({ columnas, proyectos, puedeEditar }: Props) {
  const router = useRouter();
  const [locales, setLocales] = useState<Proyecto[]>(proyectos);

  const columnasKanban = useMemo(
    () => armarColumnas(locales, columnas),
    [locales, columnas],
  );

  async function alMover(proyectoId: string, columnaId: string) {
    const previos = locales;

    setLocales((actuales) =>
      actuales.map((p) => (p.id === proyectoId ? { ...p, columnaId } : p)),
    );

    const resultado = await moverProyecto(proyectoId, columnaId);

    if (!resultado.ok) {
      setLocales(previos);
      toast.error(resultado.error);
      return;
    }

    const destino = columnas.find((c) => c.id === columnaId);
    toast.success(`Movido a ${destino?.nombre ?? "otra columna"}`);
    router.refresh();
  }

  if (columnas.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-white/10 p-8 text-center text-sm text-white/50">
        Todavía no hay columnas. Creá al menos una en Configurar columnas.
      </p>
    );
  }

  return (
    <KanbanBoard
      columns={columnasKanban}
      onMoveItem={alMover}
      canEdit={puedeEditar}
      onCardClick={(id) => router.push(`/admin/proyectos/${id}`)}
    />
  );
}
