"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { moverProyecto } from "@/app/actions/proyectos";
import { KanbanBoard, type MarcaEnVivo } from "@/components/portal/KanbanBoard";
import { useActividadMcp } from "@/components/mcp/pulso";
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
  const actividadMcp = useActividadMcp();

  /**
   * Donde quedo una tarjeta que se acaba de soltar, mientras el servidor
   * confirma. Es un parche sobre los props y no una copia de ellos: el pulso
   * del MCP refresca la pagina sola, y una copia se quedaria con la foto
   * vieja justo cuando hay que ver la tarjeta moverse.
   */
  const [enVuelo, setEnVuelo] = useState<Record<string, string>>({});

  // Lo que Claude esta tocando ahora, tarjeta por tarjeta. La pantalla se
  // refresca sola cuando termina, asi que la tarjeta se ve moverse en vez de
  // aparecer del otro lado sin explicacion.
  function marcaDe(proyectoId: string): MarcaEnVivo | null {
    const a = actividadMcp.find(
      (x) => x.recursoTipo === "proyecto" && x.recursoId === proyectoId,
    );
    if (!a) return null;
    return { texto: `${a.quien} · ${a.descripcion}`, estado: a.estado };
  }

  const columnasKanban = useMemo(() => {
    const vistos = proyectos.map((p) =>
      enVuelo[p.id] ? { ...p, columnaId: enVuelo[p.id]! } : p,
    );
    return armarColumnas(vistos, columnas);
  }, [proyectos, enVuelo, columnas]);

  function soltar(proyectoId: string) {
    setEnVuelo((actuales) => {
      const resto = { ...actuales };
      delete resto[proyectoId];
      return resto;
    });
  }

  async function alMover(proyectoId: string, columnaId: string) {
    setEnVuelo((actuales) => ({ ...actuales, [proyectoId]: columnaId }));

    const resultado = await moverProyecto(proyectoId, columnaId);

    if (!resultado.ok) {
      soltar(proyectoId);
      toast.error(resultado.error);
      return;
    }

    const destino = columnas.find((c) => c.id === columnaId);
    toast.success(`Movido a ${destino?.nombre ?? "otra columna"}`);
    router.refresh();
    soltar(proyectoId);
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
      marcaDe={marcaDe}
    />
  );
}
