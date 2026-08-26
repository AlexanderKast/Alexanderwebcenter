"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Bug, ExternalLink, StickyNote, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { ResultadoAccion } from "@/app/actions/proyectos";
import {
  alternarNota,
  borrarLink,
  cambiarEstadoTarea,
  crearLink,
  crearNota,
  crearTarea,
} from "@/app/actions/proyectos-detalle";
import type {
  EstadoTarea,
  ProyectoLink,
  ProyectoNota,
  ProyectoTarea,
} from "@/lib/proyectos/types";
import { ESTADOS_TAREA, TIPOS_LINK } from "@/lib/proyectos/types";

interface Props {
  proyectoId: string;
  links: ProyectoLink[];
  tareas: ProyectoTarea[];
  notas: ProyectoNota[];
  responsables: { id: string; nombre: string }[];
  puedeEditar: boolean;
}

const INPUT =
  "w-full rounded-lg border border-white/10 bg-[#141414] px-3 py-2 text-sm text-white/80 placeholder:text-white/30 focus:border-[#D4AF37]/40 focus:outline-none";
const BOTON =
  "rounded-lg bg-[#D4AF37] px-3 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-50";

export function DetalleProyecto({
  proyectoId,
  links,
  tareas,
  notas,
  responsables,
  puedeEditar,
}: Props) {
  const router = useRouter();
  const [pendiente, empezar] = useTransition();

  function ejecutar(accion: () => Promise<ResultadoAccion>) {
    empezar(async () => {
      const r = await accion();
      if (!r.ok) {
        toast.error(r.error);
        return;
      }
      router.refresh();
    });
  }

  function enviar(
    evento: React.FormEvent<HTMLFormElement>,
    accion: (fd: FormData) => Promise<ResultadoAccion>,
  ) {
    evento.preventDefault();
    const form = evento.currentTarget;
    const datos = new FormData(form);
    empezar(async () => {
      const r = await accion(datos);
      if (!r.ok) {
        toast.error(r.error);
        return;
      }
      form.reset();
      router.refresh();
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ── Links ────────────────────────────────────────────────── */}
      <section className="space-y-3 rounded-xl border border-white/10 p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-white/50">
          Accesos y links
        </h2>

        {links.length === 0 && (
          <p className="text-sm text-white/40">Todavía no hay links.</p>
        )}

        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.id} className="flex items-center gap-2">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center gap-2 text-sm text-white/80 hover:text-[#D4AF37]"
              >
                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{link.label}</span>
                <span className="shrink-0 rounded-full bg-white/8 px-2 py-0.5 text-[10px] text-white/40">
                  {link.tipo}
                </span>
              </a>
              {puedeEditar && (
                <button
                  type="button"
                  aria-label={`Borrar ${link.label}`}
                  disabled={pendiente}
                  onClick={() => ejecutar(() => borrarLink(link.id, proyectoId))}
                  className="text-white/30 transition-colors hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </li>
          ))}
        </ul>

        {puedeEditar && (
          <form onSubmit={(e) => enviar(e, crearLink)} className="space-y-2 pt-2">
            <input type="hidden" name="proyectoId" value={proyectoId} />
            <input name="label" className={INPUT} placeholder="Nombre del link" required />
            <input name="url" type="url" className={INPUT} placeholder="https://..." required />
            <div className="flex gap-2">
              <select name="tipo" className={INPUT} defaultValue="otro">
                {TIPOS_LINK.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <button type="submit" className={BOTON} disabled={pendiente}>
                Agregar
              </button>
            </div>
          </form>
        )}
      </section>

      {/* ── Tareas ───────────────────────────────────────────────── */}
      <section className="space-y-3 rounded-xl border border-white/10 p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-white/50">
          Cambios y tareas
        </h2>

        {tareas.length === 0 && (
          <p className="text-sm text-white/40">Todavía no hay tareas.</p>
        )}

        <ul className="space-y-2">
          {tareas.map((tarea) => (
            <li
              key={tarea.id}
              className="flex items-center justify-between gap-3 rounded-lg bg-white/[0.02] px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-sm text-white/80">{tarea.titulo}</p>
                {tarea.asignadoNombre && (
                  <p className="text-xs text-white/40">{tarea.asignadoNombre}</p>
                )}
              </div>
              <select
                aria-label={`Estado de ${tarea.titulo}`}
                className="shrink-0 rounded-lg border border-white/10 bg-[#141414] px-2 py-1 text-xs text-white/70"
                value={tarea.estado}
                disabled={!puedeEditar || pendiente}
                onChange={(e) =>
                  ejecutar(() =>
                    cambiarEstadoTarea(
                      tarea.id,
                      proyectoId,
                      e.target.value as EstadoTarea,
                    ),
                  )
                }
              >
                {ESTADOS_TAREA.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </li>
          ))}
        </ul>

        {puedeEditar && (
          <form onSubmit={(e) => enviar(e, crearTarea)} className="space-y-2 pt-2">
            <input type="hidden" name="proyectoId" value={proyectoId} />
            <input name="titulo" className={INPUT} placeholder="Qué hay que hacer" required />
            <div className="flex gap-2">
              <select name="asignadoA" className={INPUT} defaultValue="">
                <option value="">Sin asignar</option>
                {responsables.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nombre}
                  </option>
                ))}
              </select>
              <button type="submit" className={BOTON} disabled={pendiente}>
                Agregar
              </button>
            </div>
          </form>
        )}
      </section>

      {/* ── Notas y bugs ─────────────────────────────────────────── */}
      <section className="space-y-3 rounded-xl border border-white/10 p-4 lg:col-span-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-white/50">
          Notas y bugs
        </h2>

        {notas.length === 0 && (
          <p className="text-sm text-white/40">Todavía no hay reportes.</p>
        )}

        <ul className="space-y-2">
          {notas.map((nota) => (
            <li
              key={nota.id}
              className={`flex items-start gap-3 rounded-lg px-3 py-2 ${
                nota.resuelto ? "bg-white/[0.02] opacity-50" : "bg-white/[0.04]"
              }`}
            >
              {nota.tipo === "bug" ? (
                <Bug className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              ) : (
                <StickyNote className="mt-0.5 h-4 w-4 shrink-0 text-white/40" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm text-white/80">{nota.texto}</p>
                <p className="text-xs text-white/35">
                  {nota.autorNombre ?? "—"} · {nota.createdAt.slice(0, 10)}
                </p>
              </div>
              {puedeEditar && (
                <button
                  type="button"
                  disabled={pendiente}
                  onClick={() =>
                    ejecutar(() => alternarNota(nota.id, proyectoId, !nota.resuelto))
                  }
                  className="shrink-0 text-xs text-white/40 transition-colors hover:text-white"
                >
                  {nota.resuelto ? "Reabrir" : "Resolver"}
                </button>
              )}
            </li>
          ))}
        </ul>

        <form onSubmit={(e) => enviar(e, crearNota)} className="space-y-2 pt-2">
          <input type="hidden" name="proyectoId" value={proyectoId} />
          <textarea
            name="texto"
            className={INPUT}
            rows={2}
            placeholder="Contá qué viste"
            required
          />
          <div className="flex gap-2">
            <select name="tipo" className={INPUT} defaultValue="nota">
              <option value="nota">Nota</option>
              <option value="bug">Bug</option>
            </select>
            <button type="submit" className={BOTON} disabled={pendiente}>
              Reportar
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
