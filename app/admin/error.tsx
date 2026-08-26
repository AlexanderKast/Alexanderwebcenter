"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

/**
 * No habia error boundary en ninguna parte de la app: cualquier fallo de
 * Supabase en una pagina del panel tiraba la pantalla generica de Next, sin
 * contexto ni forma de reintentar sin recargar a mano.
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin]", error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-start gap-5 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-8">
      <span className="grid size-11 place-items-center rounded-full bg-red-500/10 text-red-400">
        <AlertTriangle className="size-5" aria-hidden />
      </span>

      <div className="space-y-2">
        <h1 className="font-display text-xl font-semibold text-white">
          No se pudo cargar esta sección
        </h1>
        <p className="text-sm text-white/70">
          Algo falló al traer los datos. Podés reintentar; si sigue igual, el
          detalle técnico está abajo.
        </p>
      </div>

      <button
        type="button"
        onClick={reset}
        className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[color:var(--gold-mid)]/40 bg-[color:var(--gold-mid)]/10 px-4 text-sm font-medium text-[color:var(--gold-mid)] transition-colors hover:bg-[color:var(--gold-mid)]/20"
      >
        <RotateCcw className="size-4" aria-hidden />
        Reintentar
      </button>

      <details className="w-full">
        <summary className="cursor-pointer text-xs uppercase tracking-[0.18em] text-white/50">
          Detalle técnico
        </summary>
        <pre className="mt-2 overflow-x-auto rounded-lg bg-black/60 p-3 text-[11px] leading-relaxed text-white/60">
          {error.message}
          {error.digest ? `

digest: ${error.digest}` : ""}
        </pre>
      </details>
    </div>
  );
}
