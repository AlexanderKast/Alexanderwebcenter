"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ESTADOS_COMERCIALES, type Sociedad } from "@/lib/proyectos/types";

interface Props {
  sociedades: Sociedad[];
  responsables: { id: string; nombre: string }[];
  seleccion: { sociedad: string; responsable: string; estado: string };
}

const CLASES_SELECT =
  "rounded-lg border border-white/10 bg-[#141414] px-3 py-2 text-sm text-white/80 focus:border-[#D4AF37]/40 focus:outline-none";

/**
 * Los filtros viven en la URL para que una vista se pueda compartir por chat.
 */
export function Filtros({ sociedades, responsables, seleccion }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function cambiar(clave: string, valor: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (valor) params.set(clave, valor);
    else params.delete(clave);
    router.push(`${pathname}?${params.toString()}`);
  }

  const hayFiltro = Boolean(
    seleccion.sociedad || seleccion.responsable || seleccion.estado,
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        aria-label="Filtrar por sociedad"
        className={CLASES_SELECT}
        value={seleccion.sociedad}
        onChange={(e) => cambiar("sociedad", e.target.value)}
      >
        <option value="">Todas las sociedades</option>
        {sociedades.map((s) => (
          <option key={s.id} value={s.id}>
            {s.nombre}
          </option>
        ))}
      </select>

      <select
        aria-label="Filtrar por responsable"
        className={CLASES_SELECT}
        value={seleccion.responsable}
        onChange={(e) => cambiar("responsable", e.target.value)}
      >
        <option value="">Todos los responsables</option>
        {responsables.map((r) => (
          <option key={r.id} value={r.id}>
            {r.nombre}
          </option>
        ))}
      </select>

      <select
        aria-label="Filtrar por estado comercial"
        className={CLASES_SELECT}
        value={seleccion.estado}
        onChange={(e) => cambiar("estado", e.target.value)}
      >
        <option value="">Todos los estados</option>
        {ESTADOS_COMERCIALES.map((e) => (
          <option key={e} value={e}>
            {e}
          </option>
        ))}
      </select>

      {hayFiltro && (
        <button
          type="button"
          onClick={() => router.push(pathname)}
          className="rounded-lg px-3 py-2 text-sm text-white/50 transition-colors hover:text-white"
        >
          Limpiar
        </button>
      )}
    </div>
  );
}
