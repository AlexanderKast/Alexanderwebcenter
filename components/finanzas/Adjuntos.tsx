"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FileText, Loader2, Paperclip, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { eliminarAdjunto } from "@/app/actions/movimientos";
import type { AdjuntoMovimiento } from "@/lib/proyectos/finanzas";

interface Props {
  movimientoId: string;
  adjuntos: AdjuntoMovimiento[];
  puedeEditar: boolean;
}

const ACEPTA = ".pdf,.png,.jpg,.jpeg,.webp,.heic,.xml,.zip,.txt,.csv,.xls,.xlsx";

function peso(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Facturas y comprobantes del movimiento.
 *
 * Los enlaces son firmados y caducan: si alguien deja la pestaña abierta un
 * día, al recargar vuelven a servir. Por eso no se guardan en ningún lado.
 */
export function Adjuntos({ movimientoId, adjuntos, puedeEditar }: Props) {
  const router = useRouter();
  const entrada = useRef<HTMLInputElement>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [borrando, arrancarBorrado] = useTransition();

  async function subir(archivos: FileList | null) {
    if (!archivos || archivos.length === 0) return;

    setSubiendo(true);
    let subidos = 0;

    // De a uno: así un archivo grande que falla no se lleva a los demás.
    for (const archivo of Array.from(archivos)) {
      const cuerpo = new FormData();
      cuerpo.set("movimientoId", movimientoId);
      cuerpo.set("archivo", archivo);

      try {
        const r = await fetch("/api/finanzas/adjuntos", { method: "POST", body: cuerpo });
        const j = (await r.json()) as { ok: boolean; error?: string };
        if (j.ok) subidos++;
        else toast.error(`${archivo.name}: ${j.error ?? "no se pudo subir"}`);
      } catch {
        toast.error(`${archivo.name}: se cortó la subida`);
      }
    }

    setSubiendo(false);
    if (entrada.current) entrada.current.value = "";

    if (subidos > 0) {
      toast.success(
        `${subidos} archivo${subidos === 1 ? "" : "s"} guardado${subidos === 1 ? "" : "s"}`,
      );
      router.refresh();
    }
  }

  function borrar(id: string, nombre: string) {
    if (!confirm(`¿Borrar ${nombre}?`)) return;

    arrancarBorrado(async () => {
      const resultado = await eliminarAdjunto(id);
      if (!resultado.ok) {
        toast.error(resultado.error);
        return;
      }
      toast.success("Factura borrada");
      router.refresh();
    });
  }

  return (
    <section className="space-y-4 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-white/60">
          Facturas y comprobantes
        </h2>

        {puedeEditar && (
          <>
            <input
              ref={entrada}
              type="file"
              multiple
              accept={ACEPTA}
              className="sr-only"
              onChange={(e) => subir(e.target.files)}
            />
            <button
              type="button"
              onClick={() => entrada.current?.click()}
              disabled={subiendo}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-white/70 transition-colors hover:border-white/20 hover:text-white disabled:opacity-50"
            >
              {subiendo ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Paperclip className="h-4 w-4" />
              )}
              {subiendo ? "Subiendo…" : "Subir archivo"}
            </button>
          </>
        )}
      </div>

      {adjuntos.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-white/45">
          Todavía no hay facturas. Admite PDF, foto del recibo, XML de la factura
          electrónica, Excel o ZIP, hasta 15 MB cada uno.
        </p>
      ) : (
        <ul className="divide-y divide-white/5">
          {adjuntos.map((a) => (
            <li key={a.id} className="flex items-center gap-3 py-3">
              <FileText className="h-4 w-4 shrink-0 text-white/30" aria-hidden />

              <div className="min-w-0 flex-1">
                {a.url ? (
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="block truncate text-sm text-white/85 underline-offset-4 hover:text-white hover:underline"
                  >
                    {a.nombre}
                  </a>
                ) : (
                  <span className="block truncate text-sm text-white/50">{a.nombre}</span>
                )}
                <span className="text-xs text-white/35">{peso(a.tamano)}</span>
              </div>

              {puedeEditar && (
                <button
                  type="button"
                  onClick={() => borrar(a.id, a.nombre)}
                  disabled={borrando}
                  aria-label={`Borrar ${a.nombre}`}
                  className="rounded-lg p-2 text-white/35 transition-colors hover:bg-white/5 hover:text-red-300 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
