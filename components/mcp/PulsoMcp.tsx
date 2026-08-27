"use client";

import { useEffect, useState } from "react";
import { Check, Sparkles, TriangleAlert } from "lucide-react";

/**
 * El cartel de "esto lo esta moviendo Claude".
 *
 * El panel es de varias personas a la vez. Si el MCP mueve una tarjeta
 * mientras alguien esta mirando el tablero, sin esto la tarjeta se mueve
 * sola y parece un error de la pagina. Asi que mientras el MCP trabaja,
 * aparece abajo a la izquierda que esta haciendo y quien lo mando.
 *
 * Es un poll y no realtime a proposito: las tablas int_ estan cerradas al
 * navegador (RLS sin politicas), asi que suscribirse desde el cliente
 * pediria abrirlas o montar un canal aparte. Tres segundos contra un
 * endpoint que lee diez filas alcanza para que se sienta en vivo.
 */

interface Actividad {
  id: string;
  quien: string;
  descripcion: string;
  estado: "trabajando" | "listo" | "error";
}

const CADA = 3000;

export function PulsoMcp() {
  const [actividad, setActividad] = useState<Actividad[]>([]);

  useEffect(() => {
    let vivo = true;
    let timer: number | undefined;

    async function mirar() {
      // Con la pestaña de fondo no hay nadie mirando: no vale la pena
      // pegarle al servidor cada tres segundos.
      if (document.visibilityState === "visible") {
        try {
          const res = await fetch("/api/mcp/actividad", { cache: "no-store" });
          if (!vivo) return;
          if (res.ok) {
            const datos = (await res.json()) as { actividad: Actividad[] };
            setActividad(datos.actividad ?? []);
          } else if (res.status === 401) {
            // La sesion se cayo: dejar de preguntar.
            return;
          }
        } catch {
          // Un corte de red no tiene que llenar la consola ni romper nada:
          // el proximo intento lo resuelve.
        }
      }
      if (vivo) timer = window.setTimeout(mirar, CADA);
    }

    mirar();

    return () => {
      vivo = false;
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  if (actividad.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-6 left-6 z-50 w-[min(22rem,calc(100vw-3rem))] space-y-2"
      aria-live="polite"
    >
      {actividad.map((a) => (
        <article
          key={a.id}
          className="rounded-xl border border-[#D4AF37]/30 bg-[color:var(--surface-2)]/95 p-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.45)] backdrop-blur"
        >
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 shrink-0">
              {a.estado === "trabajando" ? (
                <Sparkles className="h-4 w-4 text-[#D4AF37] motion-safe:animate-pulse" />
              ) : a.estado === "error" ? (
                <TriangleAlert className="h-4 w-4 text-red-400" />
              ) : (
                <Check className="h-4 w-4 text-emerald-400" />
              )}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#D4AF37]">
                {a.estado === "trabajando"
                  ? "Claude está modificando esto por MCP"
                  : a.estado === "error"
                    ? "Claude no pudo hacerlo"
                    : "Claude terminó"}
              </p>
              <p className="mt-1 break-words text-sm text-white">{a.descripcion}</p>
              <p className="mt-1 text-xs text-white/45">con la llave de {a.quien}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
