"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { crearCodigoBot, desactivarCodigoBot } from "@/app/actions/ideas";
import type { CodigoInvitacion } from "@/lib/ideas/queries";

interface Props {
  codigos: CodigoInvitacion[];
  miembros: { id: string; nombre: string }[];
  usuarioBot: string;
}

const campo =
  "h-11 w-full rounded-lg border border-[color:var(--line)] bg-[color:var(--surface-2)] px-3 text-sm text-white outline-none focus-visible:border-[#D4AF37]";
const etiqueta = "text-xs font-semibold uppercase tracking-[0.16em] text-white/50";

function fecha(valor: string): string {
  const d = new Date(valor);
  return Number.isNaN(d.getTime())
    ? valor
    : d.toLocaleDateString("es-CO", { day: "2-digit", month: "short" });
}

export function AccesoBot({ codigos, miembros, usuarioBot }: Props) {
  const router = useRouter();
  const [nota, setNota] = useState("");
  const [miembro, setMiembro] = useState("");
  const [usos, setUsos] = useState(1);
  const [copiado, setCopiado] = useState("");
  const [creando, arrancar] = useTransition();

  /**
   * Se copia el link, no el código suelto: al abrirlo, Telegram manda
   * `/start CODIGO` solo y la persona no tiene que tipear nada.
   */
  async function copiar(codigo: string) {
    const link = `https://t.me/${usuarioBot}?start=${codigo}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopiado(codigo);
      setTimeout(() => setCopiado(""), 2000);
    } catch {
      toast.error(`No pude copiar. El link es: ${link}`);
    }
  }

  function crear(e: React.FormEvent) {
    e.preventDefault();
    arrancar(async () => {
      const resultado = await crearCodigoBot(nota, miembro || null, usos);
      if (!resultado.ok) {
        toast.error(resultado.error);
        return;
      }
      toast.success(`Código ${resultado.codigo} creado`);
      setNota("");
      setMiembro("");
      setUsos(1);
      router.refresh();
    });
  }

  function desactivar(id: string) {
    if (!confirm("¿Desactivar este código? Quien ya entró sigue pudiendo mandar ideas."))
      return;

    arrancar(async () => {
      const resultado = await desactivarCodigoBot(id);
      if (!resultado.ok) {
        toast.error(resultado.error);
        return;
      }
      toast.success("Código desactivado");
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={crear}
        className="space-y-4 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-6"
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block space-y-1.5 sm:col-span-2">
            <span className={etiqueta}>Para quién</span>
            <input
              className={campo}
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              placeholder="Nombre o recordatorio de a quién se lo diste"
              maxLength={200}
            />
          </label>

          <label className="block space-y-1.5">
            <span className={etiqueta}>Usos</span>
            <input
              type="number"
              min={1}
              max={50}
              className={campo}
              value={usos}
              onChange={(e) => setUsos(Number(e.target.value))}
            />
          </label>
        </div>

        <label className="block space-y-1.5">
          <span className={etiqueta}>Ligar a una cuenta del panel</span>
          <select
            className={campo}
            value={miembro}
            onChange={(e) => setMiembro(e.target.value)}
          >
            <option value="">
              Sin ligar — la idea queda firmada con su nombre de Telegram
            </option>
            {miembros.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          disabled={creando}
          className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-4 py-2.5 text-sm text-black transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {creando ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Crear código
        </button>
      </form>

      {codigos.length === 0 ? (
        <p className="rounded-xl border border-white/10 bg-white/[0.02] p-8 text-center text-sm text-white/50">
          Todavía no creaste ningún código.
        </p>
      ) : (
        <ul className="space-y-2">
          {codigos.map((c) => {
            const agotado = c.usos >= c.usosMax;
            const muerto = !c.activo || agotado;

            return (
              <li
                key={c.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <code
                      className={`font-mono text-sm ${muerto ? "text-white/30 line-through" : "text-[#D4AF37]"}`}
                    >
                      {c.codigo}
                    </code>
                    <span className="text-xs text-white/35">
                      {c.usos}/{c.usosMax}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-xs text-white/40">
                    {c.nota || "Sin nota"}
                    {c.asignadoA && ` · ${c.asignadoA}`} · {fecha(c.createdAt)}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {muerto ? (
                    <span className="text-xs text-white/30">
                      {agotado ? "Agotado" : "Desactivado"}
                    </span>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => copiar(c.codigo)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/70 transition-colors hover:border-white/25 hover:text-white"
                      >
                        {copiado === c.codigo ? (
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                        {copiado === c.codigo ? "Copiado" : "Copiar link"}
                      </button>
                      <button
                        type="button"
                        onClick={() => desactivar(c.id)}
                        className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/50 transition-colors hover:border-red-500/40 hover:text-red-300"
                      >
                        Desactivar
                      </button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
