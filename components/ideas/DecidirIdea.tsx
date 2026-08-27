"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Check, Loader2, Send, X } from "lucide-react";
import { toast } from "sonner";
import { resolverIdea } from "@/app/actions/ideas";
import type { RespuestaIdea } from "@/lib/ideas/queries";
import type { EstadoIdea } from "@/lib/ideas/tipos";

interface Props {
  ideaId: string;
  /** false si la idea se escribió en el panel: no hay a quién avisarle. */
  tieneChat: boolean;
  autorNombre: string;
  respuestas: RespuestaIdea[];
}

const area =
  "w-full rounded-lg border border-[color:var(--line)] bg-[color:var(--surface-2)] p-3 text-sm leading-relaxed text-white outline-none focus-visible:border-[#D4AF37]";

function fecha(valor: string): string {
  const d = new Date(valor);
  return Number.isNaN(d.getTime())
    ? valor
    : d.toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
}

export function DecidirIdea({ ideaId, tieneChat, autorNombre, respuestas }: Props) {
  const router = useRouter();
  const [mensaje, setMensaje] = useState("");
  const [pendiente, arrancar] = useTransition();
  const [enviando, setEnviando] = useState<EstadoIdea | null>(null);

  function decidir(estado: EstadoIdea) {
    setEnviando(estado);
    arrancar(async () => {
      const resultado = await resolverIdea(ideaId, estado, mensaje);
      setEnviando(null);

      if (!resultado.ok) {
        toast.error(resultado.error);
        return;
      }

      if (resultado.aviso === "enviado")
        toast.success("Guardado y avisado por Telegram");
      else if (resultado.aviso === "falló")
        toast.warning("Guardé el estado, pero Telegram no aceptó el mensaje");
      else toast.success("Guardado");

      setMensaje("");
      router.refresh();
    });
  }

  return (
    <div className="space-y-5 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-6">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-white/50">
          Decidir
        </h2>
        <p className="mt-1 text-sm text-white/45">
          {tieneChat
            ? `Lo que escribas le llega a ${autorNombre} por Telegram. Podés dejarlo vacío y solo cambiar el estado.`
            : "Esta idea se escribió en el panel, así que no hay Telegram al otro lado. El mensaje queda como registro de la decisión."}
        </p>
      </div>

      <textarea
        className={area}
        rows={3}
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        placeholder="Por qué sí, por qué no, o qué le falta para servir"
        maxLength={2000}
      />

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => decidir("aprobada")}
          disabled={pendiente}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/15 px-4 py-2.5 text-sm text-emerald-300 transition-colors hover:bg-emerald-500/25 disabled:opacity-60"
        >
          {enviando === "aprobada" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}
          Aprobar
        </button>

        <button
          type="button"
          onClick={() => decidir("descartada")}
          disabled={pendiente}
          className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2.5 text-sm text-white/60 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-60"
        >
          {enviando === "descartada" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <X className="h-4 w-4" />
          )}
          Descartar
        </button>

        {/* Preguntar algo sin cerrar la idea: sigue en revisión. */}
        <button
          type="button"
          onClick={() => decidir("en_revision")}
          disabled={pendiente || !mensaje.trim()}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-sm text-white/60 transition-colors hover:border-white/25 hover:text-white disabled:opacity-40"
        >
          {enviando === "en_revision" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Solo mandar mensaje
        </button>
      </div>

      {respuestas.length > 0 && (
        <ul className="space-y-2 border-t border-white/5 pt-4">
          {respuestas.map((r) => (
            <li key={r.id} className="rounded-lg bg-white/[0.03] p-3">
              <p className="whitespace-pre-wrap text-sm text-white/70">{r.texto}</p>
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-white/35">
                {r.adminNombre} · {fecha(r.createdAt)}
                {!r.entregado && (
                  <span className="inline-flex items-center gap-1 text-amber-400/70">
                    <AlertTriangle className="h-3 w-3" />
                    no se entregó
                  </span>
                )}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
