"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { actualizarGuion, crearGuion, eliminarGuion } from "@/app/actions/guiones";
import {
  ESTADOS_GUION,
  FORMATOS,
  PILARES,
  PLATAFORMAS,
  type DatosGuion,
} from "@/lib/guiones/tipos";

interface Props {
  inicial: DatosGuion;
  /** Si viene, se edita ese guión en vez de crear uno nuevo. */
  guionId?: string;
}

const campo =
  "h-11 w-full rounded-lg border border-[color:var(--line)] bg-[color:var(--surface-2)] px-3 text-sm text-white outline-none focus-visible:border-[#D4AF37]";
const area =
  "w-full rounded-lg border border-[color:var(--line)] bg-[color:var(--surface-2)] p-3 text-sm leading-relaxed text-white outline-none focus-visible:border-[#D4AF37]";
const etiqueta = "text-xs font-semibold uppercase tracking-[0.16em] text-white/50";

export function FormularioGuion({ inicial, guionId }: Props) {
  const router = useRouter();
  const [datos, setDatos] = useState<DatosGuion>(inicial);
  const [guardando, arrancar] = useTransition();
  const [borrando, arrancarBorrado] = useTransition();

  function set<K extends keyof DatosGuion>(clave: K, valor: DatosGuion[K]) {
    setDatos((d) => ({ ...d, [clave]: valor }));
  }

  function guardar(e: React.FormEvent) {
    e.preventDefault();
    arrancar(async () => {
      const resultado = guionId
        ? await actualizarGuion(guionId, datos)
        : await crearGuion(datos);

      if (!resultado.ok) {
        toast.error(resultado.error);
        return;
      }

      toast.success(guionId ? "Guión actualizado" : "Guión creado");
      router.push(`/admin/guiones/${resultado.id}`);
      router.refresh();
    });
  }

  function borrar() {
    if (!guionId) return;
    if (!confirm("¿Borrar este guión? No se puede deshacer.")) return;

    arrancarBorrado(async () => {
      const resultado = await eliminarGuion(guionId);
      if (!resultado.ok) {
        toast.error(resultado.error);
        return;
      }
      toast.success("Guión borrado");
      router.push("/admin/guiones");
      router.refresh();
    });
  }

  return (
    <form onSubmit={guardar} className="space-y-5">
      <label className="block space-y-1.5">
        <span className={etiqueta}>Título</span>
        <input
          required
          maxLength={200}
          placeholder="De qué trata el video"
          className={campo}
          value={datos.titulo}
          onChange={(e) => set("titulo", e.target.value)}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="space-y-1.5">
          <span className={etiqueta}>Pilar</span>
          <select
            className={campo}
            value={datos.pilar}
            onChange={(e) => set("pilar", e.target.value)}
          >
            <option value="">Sin pilar</option>
            {PILARES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5">
          <span className={etiqueta}>Plataforma</span>
          <select
            className={campo}
            value={datos.plataforma}
            onChange={(e) => set("plataforma", e.target.value)}
          >
            <option value="">Sin definir</option>
            {PLATAFORMAS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5">
          <span className={etiqueta}>Formato</span>
          <select
            className={campo}
            value={datos.formato}
            onChange={(e) => set("formato", e.target.value)}
          >
            <option value="">Sin definir</option>
            {FORMATOS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5">
          <span className={etiqueta}>Estado</span>
          <select
            className={campo}
            value={datos.estado}
            onChange={(e) => set("estado", e.target.value as DatosGuion["estado"])}
          >
            {ESTADOS_GUION.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* El gancho va aparte: es lo único que decide si alguien se queda. */}
      <label className="block space-y-1.5">
        <span className={etiqueta}>Gancho</span>
        <textarea
          rows={2}
          maxLength={500}
          placeholder="Los primeros segundos. Lo que hace que no siga scrolleando."
          className={area}
          value={datos.gancho}
          onChange={(e) => set("gancho", e.target.value)}
        />
      </label>

      <label className="block space-y-1.5">
        <span className={etiqueta}>Guión</span>
        <textarea
          rows={16}
          maxLength={20000}
          placeholder="El texto completo, tal como lo vas a decir."
          className={`${area} font-mono text-[13px]`}
          value={datos.cuerpo}
          onChange={(e) => set("cuerpo", e.target.value)}
        />
        <span className="block text-right text-xs text-white/30">
          {datos.cuerpo.length} caracteres
        </span>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5">
          <span className={etiqueta}>Notas</span>
          <textarea
            rows={3}
            maxLength={4000}
            placeholder="B-roll, música, quién graba, lo que sea."
            className={area}
            value={datos.notas}
            onChange={(e) => set("notas", e.target.value)}
          />
        </label>

        <label className="space-y-1.5">
          <span className={etiqueta}>Link</span>
          <input
            maxLength={500}
            placeholder="https://… donde quedó publicado"
            className={campo}
            value={datos.link}
            onChange={(e) => set("link", e.target.value)}
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={guardando}
          className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-4 py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {guardando && <Loader2 className="h-4 w-4 animate-spin" />}
          {guionId ? "Guardar cambios" : "Crear guión"}
        </button>

        {guionId && (
          <button
            type="button"
            onClick={borrar}
            disabled={borrando}
            className="inline-flex items-center gap-2 rounded-lg border border-red-400/30 px-4 py-2.5 text-sm text-red-300 transition-colors hover:border-red-400/60 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            Borrar
          </button>
        )}
      </div>
    </form>
  );
}
