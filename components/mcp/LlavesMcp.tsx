"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, KeyRound, Loader2, Plus, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { crearLlaveMcp, revocarLlaveMcp } from "@/app/actions/mcp";

export interface LlaveMcp {
  id: string;
  nombre: string;
  pista: string;
  ultimoUsoAt: string | null;
  activo: boolean;
  createdAt: string;
}

interface Props {
  llaves: LlaveMcp[];
  /** La URL del MCP en producción, para armar el comando de instalación. */
  urlMcp: string;
}

const campo =
  "h-11 w-full rounded-lg border border-[color:var(--line)] bg-[color:var(--surface-2)] px-3 text-sm text-white outline-none focus-visible:border-[#D4AF37]";
const claseEtiqueta = "text-xs font-semibold uppercase tracking-[0.16em] text-white/50";

function fecha(valor: string | null): string {
  if (!valor) return "nunca";
  const d = new Date(valor);
  return Number.isNaN(d.getTime())
    ? valor
    : d.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
}

/** Un bloque que se copia entero: nadie transcribe un comando a mano. */
function Bloque({ texto, titulo }: { texto: string; titulo: string }) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      toast.error("No pude copiar. Seleccionalo y copialo a mano.");
    }
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className={claseEtiqueta}>{titulo}</span>
        <button
          type="button"
          onClick={copiar}
          className="inline-flex items-center gap-1.5 text-xs text-white/50 transition-colors hover:text-white"
        >
          {copiado ? (
            <Check className="h-3.5 w-3.5 text-emerald-400" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          {copiado ? "Copiado" : "Copiar"}
        </button>
      </div>
      <pre className="overflow-x-auto rounded-lg border border-[color:var(--line)] bg-[color:var(--surface-2)] p-3 text-xs leading-relaxed text-white/80">
        {texto}
      </pre>
    </div>
  );
}

export function LlavesMcp({ llaves, urlMcp }: Props) {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [reciente, setReciente] = useState("");
  const [pendiente, arrancar] = useTransition();

  function crear(e: React.FormEvent) {
    e.preventDefault();
    arrancar(async () => {
      const resultado = await crearLlaveMcp(nombre);
      if (!resultado.ok) {
        toast.error(resultado.error);
        return;
      }
      setReciente(resultado.token);
      setNombre("");
      toast.success("Llave creada. Copiala ahora: no se vuelve a mostrar.");
      router.refresh();
    });
  }

  function revocar(id: string) {
    if (!confirm("¿Revocar esta llave? Lo que la esté usando deja de funcionar ya."))
      return;

    arrancar(async () => {
      const resultado = await revocarLlaveMcp(id);
      if (!resultado.ok) {
        toast.error(resultado.error);
        return;
      }
      toast.success("Llave revocada");
      router.refresh();
    });
  }

  const llave = reciente || "TU_LLAVE";

  return (
    <div className="space-y-6">
      <form
        onSubmit={crear}
        className="space-y-4 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-6"
      >
        <label className="block space-y-1.5">
          <span className={claseEtiqueta}>Nombre de la llave</span>
          <input
            className={campo}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Mi portátil, la del estudio…"
            maxLength={80}
          />
        </label>

        <button
          type="submit"
          disabled={pendiente}
          className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-4 py-2.5 text-sm text-black transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {pendiente ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Crear llave
        </button>
      </form>

      {reciente && (
        <div className="space-y-3 rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/[0.06] p-6">
          <p className="flex items-center gap-2 text-sm text-[#D4AF37]">
            <TriangleAlert className="h-4 w-4 shrink-0" />
            Esta es la única vez que se ve. Copiala ahora.
          </p>
          <Bloque texto={reciente} titulo="Tu llave" />
        </div>
      )}

      <div className="space-y-5 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-6">
        <div>
          <h2 className={claseEtiqueta}>Instalar</h2>
          <p className="mt-1.5 text-sm text-white/50">
            {reciente
              ? "Con tu llave nueva ya puesta. Pegá esto donde uses Claude."
              : "Creá una llave arriba y estos comandos salen con ella puesta."}
          </p>
        </div>

        <Bloque
          titulo="Claude Code (terminal)"
          texto={`claude mcp add --transport http alexander-panel ${urlMcp} --header "Authorization: Bearer ${llave}"`}
        />

        <Bloque
          titulo="Claude Desktop — claude_desktop_config.json"
          texto={JSON.stringify(
            {
              mcpServers: {
                "alexander-panel": {
                  type: "http",
                  url: urlMcp,
                  headers: { Authorization: `Bearer ${llave}` },
                },
              },
            },
            null,
            2,
          )}
        />
      </div>

      <div className="space-y-3">
        <h2 className={claseEtiqueta}>Tus llaves</h2>

        {llaves.length === 0 ? (
          <p className="rounded-xl border border-white/10 bg-white/[0.02] p-8 text-center text-sm text-white/50">
            Todavía no tenés ninguna.
          </p>
        ) : (
          <ul className="space-y-2">
            {llaves.map((l) => (
              <li
                key={l.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4"
              >
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-sm text-white">
                    <KeyRound
                      className={`h-3.5 w-3.5 shrink-0 ${l.activo ? "text-[#D4AF37]" : "text-white/25"}`}
                    />
                    {l.nombre}
                    {!l.activo && (
                      <span className="text-xs text-white/30">· revocada</span>
                    )}
                  </p>
                  <p className="mt-1 font-mono text-xs text-white/35">
                    {l.pista}… · creada {fecha(l.createdAt)} · último uso{" "}
                    {fecha(l.ultimoUsoAt)}
                  </p>
                </div>

                {l.activo && (
                  <button
                    type="button"
                    onClick={() => revocar(l.id)}
                    disabled={pendiente}
                    className="shrink-0 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/50 transition-colors hover:border-red-500/40 hover:text-red-300 disabled:opacity-50"
                  >
                    Revocar
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
