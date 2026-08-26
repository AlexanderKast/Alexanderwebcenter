"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Eye, EyeOff, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  agregarAcceso,
  borrarAcceso,
  guardarMenu,
  restablecerMenu,
} from "@/app/actions/menu";
import {
  ICONOS,
  ICONOS_PARA_ELEGIR,
  type NombreIcono,
} from "@/components/admin/nav-items";
import type { ItemMenu } from "@/lib/admin/menu";

interface Props {
  items: ItemMenu[];
  secciones: string[];
}

const campo =
  "h-11 w-full rounded-lg border border-[color:var(--line)] bg-[color:var(--surface-2)] px-3 text-sm text-white outline-none focus-visible:border-[#D4AF37]";

/**
 * Prender, apagar, renombrar, reordenar y agregar entradas del menú.
 *
 * Apagar no borra la pantalla: sale del menú y vuelve cuando la prendas.
 * Borrar solo existe para los accesos que agregaste vos.
 */
export function ConfiguradorMenu({ items, secciones }: Props) {
  const router = useRouter();
  const [lista, setLista] = useState<ItemMenu[]>(items);
  const [guardando, arrancarGuardado] = useTransition();
  const [trabajando, arrancarTrabajo] = useTransition();

  const [nuevo, setNuevo] = useState({
    label: "",
    href: "",
    seccion: secciones[0] ?? "Mis accesos",
    icono: "Link2" as NombreIcono,
  });

  const sucio = JSON.stringify(lista) !== JSON.stringify(items);

  function alternar(href: string) {
    setLista((l) => l.map((i) => (i.href === href ? { ...i, visible: !i.visible } : i)));
  }

  function renombrar(href: string, label: string) {
    setLista((l) => l.map((i) => (i.href === href ? { ...i, label } : i)));
  }

  function moverSeccion(href: string, seccion: string) {
    setLista((l) => l.map((i) => (i.href === href ? { ...i, seccion } : i)));
  }

  function mover(indice: number, direccion: -1 | 1) {
    const destino = indice + direccion;
    if (destino < 0 || destino >= lista.length) return;

    const copia = [...lista];
    [copia[indice], copia[destino]] = [copia[destino], copia[indice]];
    setLista(copia.map((i, n) => ({ ...i, orden: n })));
  }

  function guardar() {
    arrancarGuardado(async () => {
      const resultado = await guardarMenu(
        lista.map((i, n) => ({
          href: i.href,
          visible: i.visible,
          orden: n,
          seccion: i.seccion,
          label: i.label,
          personalizado: i.personalizado,
        })),
      );

      if (!resultado.ok) {
        toast.error(resultado.error);
        return;
      }
      toast.success("Menú guardado");
      router.refresh();
    });
  }

  function agregar(e: React.FormEvent) {
    e.preventDefault();
    arrancarTrabajo(async () => {
      const resultado = await agregarAcceso(nuevo);
      if (!resultado.ok) {
        toast.error(resultado.error);
        return;
      }
      toast.success("Acceso agregado");
      setNuevo({ label: "", href: "", seccion: nuevo.seccion, icono: "Link2" });
      router.refresh();
    });
  }

  function borrar(href: string, label: string) {
    if (!confirm(`¿Borrar el acceso "${label}"?`)) return;

    arrancarTrabajo(async () => {
      const resultado = await borrarAcceso(href);
      if (!resultado.ok) {
        toast.error(resultado.error);
        return;
      }
      toast.success("Acceso borrado");
      router.refresh();
    });
  }

  function restablecer() {
    if (
      !confirm(
        "¿Volver el menú a como viene de fábrica? Se pierden los accesos que agregaste.",
      )
    ) {
      return;
    }

    arrancarTrabajo(async () => {
      const resultado = await restablecerMenu();
      if (!resultado.ok) {
        toast.error(resultado.error);
        return;
      }
      toast.success("Menú restablecido");
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-[color:var(--line)]">
        <ul className="divide-y divide-white/5">
          {lista.map((item, indice) => {
            const Icono = ICONOS[item.icono] ?? ICONOS.Link2;

            return (
              <li
                key={item.href}
                className={`flex flex-wrap items-center gap-3 p-3 ${
                  item.visible ? "" : "opacity-45"
                }`}
              >
                <div className="flex shrink-0 flex-col">
                  <button
                    type="button"
                    onClick={() => mover(indice, -1)}
                    disabled={indice === 0}
                    aria-label={`Subir ${item.label}`}
                    className="rounded p-0.5 text-white/30 transition-colors hover:text-white disabled:opacity-20"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => mover(indice, 1)}
                    disabled={indice === lista.length - 1}
                    aria-label={`Bajar ${item.label}`}
                    className="rounded p-0.5 text-white/30 transition-colors hover:text-white disabled:opacity-20"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>

                <Icono className="h-4 w-4 shrink-0 text-white/40" aria-hidden />

                <input
                  value={item.label}
                  onChange={(e) => renombrar(item.href, e.target.value)}
                  aria-label={`Nombre de ${item.label}`}
                  className="h-9 min-w-0 flex-1 rounded-lg border border-transparent bg-transparent px-2 text-sm text-white outline-none hover:border-white/10 focus-visible:border-[#D4AF37]"
                />

                <input
                  list="secciones-menu"
                  value={item.seccion}
                  onChange={(e) => moverSeccion(item.href, e.target.value)}
                  aria-label={`Sección de ${item.label}`}
                  className="h-9 w-40 rounded-lg border border-transparent bg-transparent px-2 text-xs text-white/55 outline-none hover:border-white/10 focus-visible:border-[#D4AF37]"
                />

                <span className="hidden w-52 shrink-0 truncate text-xs text-white/30 lg:block">
                  {item.href}
                </span>

                <button
                  type="button"
                  onClick={() => alternar(item.href)}
                  aria-label={
                    item.visible ? `Esconder ${item.label}` : `Mostrar ${item.label}`
                  }
                  className="rounded-lg p-2 text-white/40 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {item.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>

                {item.personalizado && (
                  <button
                    type="button"
                    onClick={() => borrar(item.href, item.label)}
                    disabled={trabajando}
                    aria-label={`Borrar ${item.label}`}
                    className="rounded-lg p-2 text-white/30 transition-colors hover:bg-white/5 hover:text-red-300 disabled:opacity-40"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <datalist id="secciones-menu">
        {secciones.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={guardar}
          disabled={guardando || !sucio}
          className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-4 py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {guardando && <Loader2 className="h-4 w-4 animate-spin" />}
          Guardar menú
        </button>

        {sucio && (
          <button
            type="button"
            onClick={() => setLista(items)}
            className="text-sm text-white/50 transition-colors hover:text-white"
          >
            Descartar cambios
          </button>
        )}

        <button
          type="button"
          onClick={restablecer}
          disabled={trabajando}
          className="ml-auto text-sm text-white/40 transition-colors hover:text-white disabled:opacity-40"
        >
          Volver a como venía
        </button>
      </div>

      {/* Un acceso propio puede ser una pantalla del panel o un link de afuera. */}
      <form
        onSubmit={agregar}
        className="space-y-4 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-6"
      >
        <h2 className="text-sm font-semibold uppercase tracking-widest text-white/60">
          Agregar un acceso
        </h2>

        <div className="grid gap-3 sm:grid-cols-2">
          <input
            required
            maxLength={60}
            placeholder="Nombre (ej. Kreoon)"
            className={campo}
            value={nuevo.label}
            onChange={(e) => setNuevo((n) => ({ ...n, label: e.target.value }))}
          />
          <input
            required
            maxLength={300}
            placeholder="/admin/algo o https://…"
            className={campo}
            value={nuevo.href}
            onChange={(e) => setNuevo((n) => ({ ...n, href: e.target.value }))}
          />
          <input
            required
            list="secciones-menu"
            maxLength={60}
            placeholder="Sección"
            className={campo}
            value={nuevo.seccion}
            onChange={(e) => setNuevo((n) => ({ ...n, seccion: e.target.value }))}
          />
          <select
            className={campo}
            value={nuevo.icono}
            onChange={(e) => setNuevo((n) => ({ ...n, icono: e.target.value as NombreIcono }))}
          >
            {ICONOS_PARA_ELEGIR.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={trabajando}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-sm text-white/75 transition-colors hover:border-white/20 hover:text-white disabled:opacity-40"
        >
          <Plus className="h-4 w-4" />
          Agregar
        </button>
      </form>
    </div>
  );
}
