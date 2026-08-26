"use client";

import { useState, useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { sincronizarGastos } from "@/app/actions/movimientos";

/**
 * Vuelve a bajar los gastos del Sheet.
 *
 * Se avisa cuando un movimiento nombra un proyecto que no esta en el
 * tablero: sin eso, la plata entra a la base pero no aparece en ninguna
 * tarjeta y el numero parece estar mal.
 */
export function SincronizarGastos() {
  const [pendiente, arrancar] = useTransition();
  const [ultima, setUltima] = useState<string | null>(null);

  function alHacerClic() {
    arrancar(async () => {
      const resultado = await sincronizarGastos();

      if (!resultado.ok) {
        toast.error(resultado.error);
        return;
      }

      toast.success(
        `${resultado.guardados} movimiento${resultado.guardados === 1 ? "" : "s"} al día`,
      );

      if (resultado.sinProyecto.length > 0) {
        toast.warning(
          `Sin proyecto en el tablero: ${resultado.sinProyecto.join(", ")}`,
          { duration: 8000 },
        );
      }

      setUltima(
        new Date().toLocaleTimeString("es-CO", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "America/Bogota",
        }),
      );
    });
  }

  return (
    <div className="flex items-center gap-2">
      {ultima && <span className="text-xs text-white/35">Actualizado {ultima}</span>}
      <button
        type="button"
        onClick={alHacerClic}
        disabled={pendiente}
        className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-white/70 transition-colors hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        <RefreshCw className={`h-4 w-4 ${pendiente ? "animate-spin" : ""}`} />
        {pendiente ? "Sincronizando…" : "Sincronizar gastos"}
      </button>
    </div>
  );
}
