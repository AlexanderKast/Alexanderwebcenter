"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import {
  actualizarProyecto,
  archivarProyecto,
  crearProyecto,
} from "@/app/actions/proyectos";
import {
  ESTADOS_COMERCIALES,
  type ColumnaKanban,
  type Proyecto,
  type Sociedad,
} from "@/lib/proyectos/types";

interface Props {
  /** Sin proyecto = alta. Con proyecto = edicion. */
  proyecto?: Proyecto;
  sociedades: Sociedad[];
  responsables: { id: string; nombre: string }[];
  columnas: ColumnaKanban[];
}

const INPUT =
  "w-full rounded-lg border border-white/10 bg-[#141414] px-3 py-2 text-sm text-white/80 placeholder:text-white/30 focus:border-[#D4AF37]/40 focus:outline-none";
const LABEL = "block text-xs uppercase tracking-wide text-white/40";

/**
 * Alta y edicion de un proyecto. Es el unico lugar desde donde se asigna
 * responsable, se cambia el estado comercial o se archiva algo: el tablero
 * solo mueve tarjetas entre columnas.
 */
export function FormularioProyecto({
  proyecto,
  sociedades,
  responsables,
  columnas,
}: Props) {
  const router = useRouter();
  const [pendiente, empezar] = useTransition();

  const editando = Boolean(proyecto);
  const columnaInicial = columnas.find((c) => c.esInicial) ?? columnas[0];

  function enviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const datos = new FormData(evento.currentTarget);

    empezar(async () => {
      const resultado = editando
        ? await actualizarProyecto(datos)
        : await crearProyecto(datos);

      if (!resultado.ok) {
        toast.error(resultado.error);
        return;
      }

      if (editando) {
        toast.success("Cambios guardados");
        router.refresh();
      } else {
        toast.success("Proyecto creado");
        router.push("/admin/proyectos");
      }
    });
  }

  function archivar() {
    if (!proyecto) return;

    empezar(async () => {
      const resultado = await archivarProyecto(proyecto.id);
      if (!resultado.ok) {
        toast.error(resultado.error);
        return;
      }
      toast.success("Proyecto archivado");
      router.push("/admin/proyectos");
    });
  }

  return (
    <form onSubmit={enviar} className="space-y-4 rounded-xl border border-white/10 p-4">
      {proyecto && <input type="hidden" name="proyectoId" value={proyecto.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={LABEL} htmlFor="nombre">
            Nombre
          </label>
          <input
            id="nombre"
            name="nombre"
            className={INPUT}
            defaultValue={proyecto?.nombre ?? ""}
            placeholder="Plataforma Interna Feria"
            required
          />
        </div>

        <div>
          <label className={LABEL} htmlFor="cliente">
            Cliente
          </label>
          <input
            id="cliente"
            name="cliente"
            className={INPUT}
            defaultValue={proyecto?.cliente ?? ""}
            placeholder="Feria Effix"
          />
        </div>

        <div>
          <label className={LABEL} htmlFor="sociedadId">
            Sociedad
          </label>
          <select
            id="sociedadId"
            name="sociedadId"
            className={INPUT}
            defaultValue={proyecto?.sociedadId ?? ""}
          >
            <option value="">Sin sociedad</option>
            {sociedades.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={LABEL} htmlFor="responsableId">
            Responsable
          </label>
          <select
            id="responsableId"
            name="responsableId"
            className={INPUT}
            defaultValue={proyecto?.responsableId ?? ""}
          >
            <option value="">Sin tomar</option>
            {responsables.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={LABEL} htmlFor="estadoComercial">
            Estado comercial
          </label>
          <select
            id="estadoComercial"
            name="estadoComercial"
            className={INPUT}
            defaultValue={proyecto?.estadoComercial ?? "Prospecto"}
          >
            {ESTADOS_COMERCIALES.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={LABEL} htmlFor="columnaId">
            Columna del tablero
          </label>
          <select
            id="columnaId"
            name="columnaId"
            className={INPUT}
            defaultValue={proyecto?.columnaId ?? columnaInicial?.id ?? ""}
            required
          >
            {columnas.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={LABEL} htmlFor="fechaInicio">
            Fecha de inicio
          </label>
          <input
            id="fechaInicio"
            name="fechaInicio"
            type="date"
            className={INPUT}
            defaultValue={proyecto?.fechaInicio ?? ""}
          />
        </div>

        <div>
          <label className={LABEL} htmlFor="fechaCierreEst">
            Cierre estimado
          </label>
          <input
            id="fechaCierreEst"
            name="fechaCierreEst"
            type="date"
            className={INPUT}
            defaultValue={proyecto?.fechaCierreEst ?? ""}
          />
        </div>

        <div>
          <label className={LABEL} htmlFor="pptoIngresos">
            Presupuesto ingresos (COP)
          </label>
          <input
            id="pptoIngresos"
            name="pptoIngresos"
            inputMode="numeric"
            className={INPUT}
            defaultValue={proyecto?.pptoIngresos ?? ""}
            placeholder="0"
          />
        </div>

        <div>
          <label className={LABEL} htmlFor="pptoGastos">
            Presupuesto gastos (COP)
          </label>
          <input
            id="pptoGastos"
            name="pptoGastos"
            inputMode="numeric"
            className={INPUT}
            defaultValue={proyecto?.pptoGastos ?? ""}
            placeholder="0"
          />
        </div>

        <div className="sm:col-span-2">
          <label className={LABEL} htmlFor="notas">
            Notas
          </label>
          <textarea
            id="notas"
            name="notas"
            rows={3}
            className={INPUT}
            defaultValue={proyecto?.notas ?? ""}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pendiente}
          className="rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {editando ? "Guardar cambios" : "Crear proyecto"}
        </button>

        {editando && (
          <button
            type="button"
            onClick={archivar}
            disabled={pendiente}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/50 transition-colors hover:border-red-400/30 hover:text-red-400 disabled:opacity-50"
          >
            Archivar
          </button>
        )}
      </div>
    </form>
  );
}
