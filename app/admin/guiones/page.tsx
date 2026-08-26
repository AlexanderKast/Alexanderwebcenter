import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import { requireAuth } from "@/lib/auth";
import { listarGuiones } from "@/lib/guiones/queries";
import {
  ESTADOS_GUION,
  PILARES,
  PLATAFORMAS,
  colorEstado,
  contarPorEstado,
  contarPorPilar,
} from "@/lib/guiones/tipos";
import { puedeEditarProyectos } from "@/lib/proyectos/permisos";

export const metadata = { title: "Guiones · Admin" };
export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ pilar?: string; plataforma?: string; estado?: string }>;
}

function fecha(valor: string): string {
  const d = new Date(valor);
  return Number.isNaN(d.getTime())
    ? valor
    : d.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
}

/** Un filtro es un link: así el estado vive en la URL y se puede compartir. */
function Filtro({
  activo,
  href,
  children,
}: {
  activo: boolean;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-3 py-1 text-xs transition-colors ${
        activo
          ? "border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37]"
          : "border-white/10 text-white/55 hover:border-white/25 hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}

export default async function GuionesPage({ searchParams }: Props) {
  const usuario = await requireAuth();
  const params = await searchParams;

  const guiones = await listarGuiones({
    pilar: params.pilar,
    plataforma: params.plataforma,
    estado: params.estado,
  });

  const porEstado = contarPorEstado(guiones);
  const porPilar = contarPorPilar(guiones);
  const puedeEditar = puedeEditarProyectos(usuario.role);

  const conFiltro = (clave: string, valor: string) => {
    const q = new URLSearchParams(params as Record<string, string>);
    if (q.get(clave) === valor) q.delete(clave);
    else q.set(clave, valor);
    const texto = q.toString();
    return texto ? `/admin/guiones?${texto}` : "/admin/guiones";
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Guiones</h1>
          <p className="max-w-2xl text-sm text-white/50">
            Tu biblioteca. Cada guión se escribe acá: gancho, cuerpo y en qué
            estado va, del primer apunte hasta publicado.
          </p>
        </div>

        {puedeEditar && (
          <Link
            href="/admin/guiones/nuevo"
            className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-3 py-2 text-sm text-black transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Nuevo guión
          </Link>
        )}
      </header>

      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {ESTADOS_GUION.map((estado) => (
          <div
            key={estado}
            className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-4"
          >
            <p className="text-2xl font-semibold text-white">{porEstado[estado]}</p>
            <p className="text-xs capitalize text-white/40">{estado}</p>
          </div>
        ))}
      </div>

      {/* Los pilares en cero también se muestran: es la señal de cuál se está
          quedando sin contenido. */}
      <section className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
          Por pilar
        </p>
        <div className="flex flex-wrap gap-2">
          {porPilar.map((p) => (
            <span
              key={p.pilar}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/60"
            >
              {p.pilar} <span className="ml-1 text-white/85">{p.total}</span>
            </span>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {PILARES.map((p) => (
            <Filtro key={p} activo={params.pilar === p} href={conFiltro("pilar", p)}>
              {p}
            </Filtro>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PLATAFORMAS.map((p) => (
            <Filtro
              key={p}
              activo={params.plataforma === p}
              href={conFiltro("plataforma", p)}
            >
              {p}
            </Filtro>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {ESTADOS_GUION.map((e) => (
            <Filtro key={e} activo={params.estado === e} href={conFiltro("estado", e)}>
              {e}
            </Filtro>
          ))}
        </div>
      </section>

      {guiones.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center">
          <FileText className="mx-auto h-8 w-8 text-white/20" />
          <p className="mt-3 text-sm text-white/60">
            {params.pilar || params.plataforma || params.estado
              ? "Ningún guión con esos filtros."
              : "Todavía no hay guiones. El primero lo escribís vos."}
          </p>
          {puedeEditar && (
            <Link
              href="/admin/guiones/nuevo"
              className="mt-4 inline-block rounded-xl border border-white/15 px-4 py-2 text-sm text-white/70 transition-colors hover:border-white/30 hover:text-white"
            >
              Escribir el primero
            </Link>
          )}
        </div>
      ) : (
        <ul className="divide-y divide-white/5 overflow-hidden rounded-2xl border border-[color:var(--line)]">
          {guiones.map((g) => (
            <li key={g.id} className="p-4 transition-colors hover:bg-white/[0.02]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    href={`/admin/guiones/${g.id}`}
                    className="font-medium text-white underline-offset-4 hover:underline"
                  >
                    {g.titulo}
                  </Link>
                  {g.gancho && (
                    <p className="mt-1 line-clamp-2 max-w-2xl text-sm text-white/45">
                      {g.gancho}
                    </p>
                  )}
                  <p className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-white/35">
                    {g.pilar && <span>{g.pilar}</span>}
                    {g.plataforma && <span>· {g.plataforma}</span>}
                    {g.formato && <span>· {g.formato}</span>}
                    <span>· {fecha(g.updatedAt)}</span>
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs capitalize ${colorEstado(g.estado)}`}
                >
                  {g.estado}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
