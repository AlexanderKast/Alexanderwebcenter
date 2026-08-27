"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { actualizarIdea, crearIdea, eliminarIdea } from "@/app/actions/ideas";
import { ESTADOS_IDEA, NOMBRE_ESTADO, type DatosIdea } from "@/lib/ideas/tipos";

interface Props {
  inicial: DatosIdea;
  /** Si viene, se edita esa idea en vez de crear una nueva. */
  ideaId?: string;
  /** Para ligarla a un proyecto. Vacío si todavía no hay proyectos. */
  proyectos: { id: string; nombre: string }[];
}

const campo =
  "h-11 w-full rounded-lg border border-[color:var(--line)] bg-[color:var(--surface-2)] px-3 text-sm text-white outline-none focus-visible:border-[#D4AF37]";
const area =
  "w-full rounded-lg border border-[color:var(--line)] bg-[color:var(--surface-2)] p-3 text-sm leading-relaxed text-white outline-none focus-visible:border-[#D4AF37]";
const etiqueta = "text-xs font-semibold uppercase tracking-[0.16em] text-white/50";

export function FormularioIdea({ inicial, ideaId, proyectos }: Props) {
  const router = useRouter();
  const [datos, setDatos] = useState<DatosIdea>(inicial);
  const [tagNuevo, setTagNuevo] = useState("");
  const [guardando, arrancar] = useTransition();
  const [borrando, arrancarBorrado] = useTransition();

  function set<K extends keyof DatosIdea>(clave: K, valor: DatosIdea[K]) {
    setDatos((d) => ({ ...d, [clave]: valor }));
  }

  function agregarTag() {
    const tag = tagNuevo.trim().toLowerCase().replace(/^#/, "");
    if (!tag) return;
    if (datos.tags.includes(tag)) {
      setTagNuevo("");
      return;
    }
    if (datos.tags.length >= 12) {
      toast.error("Máximo 12 etiquetas.");
      return;
    }
    set("tags", [...datos.tags, tag]);
    setTagNuevo("");
  }

  function guardar(e: React.FormEvent) {
    e.preventDefault();
    arrancar(async () => {
      const resultado = ideaId
        ? await actualizarIdea(ideaId, datos)
        : await crearIdea(datos);

      if (!resultado.ok) {
        toast.error(resultado.error);
        return;
      }

      toast.success(ideaId ? "Idea actualizada" : "Idea creada");
      router.push(`/admin/ideas/${resultado.id}`);
      router.refresh();
    });
  }

  function borrar() {
    if (!ideaId) return;
    if (!confirm("¿Borrar esta idea? También se borra el audio. No se puede deshacer."))
      return;

    arrancarBorrado(async () => {
      const resultado = await eliminarIdea(ideaId);
      if (!resultado.ok) {
        toast.error(resultado.error);
        return;
      }
      toast.success("Idea borrada");
      router.push("/admin/ideas");
      router.refresh();
    });
  }

  return (
    <form onSubmit={guardar} className="space-y-5">
      <label className="block space-y-1.5">
        <span className={etiqueta}>Título</span>
        <input
          className={campo}
          value={datos.titulo}
          onChange={(e) => set("titulo", e.target.value)}
          placeholder="De qué es la idea"
          maxLength={200}
          required
        />
      </label>

      <label className="block space-y-1.5">
        <span className={etiqueta}>Resumen</span>
        <textarea
          className={area}
          rows={3}
          value={datos.resumen}
          onChange={(e) => set("resumen", e.target.value)}
          placeholder="El fondo de la idea en dos o tres frases"
          maxLength={2000}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className={etiqueta}>Estado</span>
          <select
            className={campo}
            value={datos.estado}
            onChange={(e) => set("estado", e.target.value as DatosIdea["estado"])}
          >
            {ESTADOS_IDEA.map((estado) => (
              <option key={estado} value={estado}>
                {NOMBRE_ESTADO[estado]}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-1.5">
          <span className={etiqueta}>Proyecto</span>
          <select
            className={campo}
            value={datos.proyectoId ?? ""}
            onChange={(e) => set("proyectoId", e.target.value || null)}
          >
            <option value="">Sin ligar</option>
            {proyectos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="space-y-1.5">
        <span className={etiqueta}>Etiquetas</span>
        <div className="flex gap-2">
          <input
            className={campo}
            value={tagNuevo}
            onChange={(e) => setTagNuevo(e.target.value)}
            // Enter dentro de un form manda el form. Acá tiene que agregar
            // la etiqueta, no guardar la idea a medio escribir.
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                agregarTag();
              }
            }}
            placeholder="Escribí y dale Enter"
            maxLength={40}
          />
          <button
            type="button"
            onClick={agregarTag}
            className="shrink-0 rounded-lg border border-white/10 px-4 text-sm text-white/70 transition-colors hover:border-white/25 hover:text-white"
          >
            Agregar
          </button>
        </div>

        {datos.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {datos.tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() =>
                  set(
                    "tags",
                    datos.tags.filter((t) => t !== tag),
                  )
                }
                className="inline-flex items-center gap-1 rounded-md bg-white/5 px-2 py-1 text-xs text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                {tag}
                <X className="h-3 w-3" />
              </button>
            ))}
          </div>
        )}
      </div>

      <label className="block space-y-1.5">
        <span className={etiqueta}>{ideaId ? "Transcripción" : "La idea"}</span>
        <textarea
          className={area}
          rows={8}
          value={datos.transcripcion}
          onChange={(e) => set("transcripcion", e.target.value)}
          placeholder="Lo que se dijo, tal cual"
          maxLength={50000}
        />
      </label>

      <label className="block space-y-1.5">
        <span className={etiqueta}>Notas de revisión</span>
        <textarea
          className={area}
          rows={3}
          value={datos.notas}
          onChange={(e) => set("notas", e.target.value)}
          placeholder="Qué se decidió, qué falta averiguar"
          maxLength={4000}
        />
      </label>

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={guardando}
          className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-4 py-2.5 text-sm text-black transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {guardando && <Loader2 className="h-4 w-4 animate-spin" />}
          {ideaId ? "Guardar cambios" : "Crear idea"}
        </button>

        {ideaId && (
          <button
            type="button"
            onClick={borrar}
            disabled={borrando}
            className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 px-4 py-2.5 text-sm text-red-300/80 transition-colors hover:border-red-500/40 hover:text-red-300 disabled:opacity-60"
          >
            {borrando ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Borrar
          </button>
        )}
      </div>
    </form>
  );
}
