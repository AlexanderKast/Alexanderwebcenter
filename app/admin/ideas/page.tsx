import Link from "next/link";
import { Lightbulb, Mic, Plus, Send } from "lucide-react";
import { requireAuth } from "@/lib/auth";
import { listarIdeas } from "@/lib/ideas/queries";
import {
  ESTADOS_IDEA,
  NOMBRE_ESTADO,
  colorEstado,
  contarPorEstado,
  duracionLegible,
} from "@/lib/ideas/tipos";
import { puedeEditarProyectos, puedeInvitar } from "@/lib/proyectos/permisos";

export const metadata = { title: "Ideas · Admin" };
export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ estado?: string; origen?: string }>;
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

export default async function IdeasPage({ searchParams }: Props) {
  const usuario = await requireAuth();
  const params = await searchParams;

  const ideas = await listarIdeas({
    estado: params.estado,
    origen: params.origen,
  });

  const porEstado = contarPorEstado(ideas);
  const puedeEditar = puedeEditarProyectos(usuario.role);

  const conFiltro = (clave: string, valor: string) => {
    const q = new URLSearchParams(params as Record<string, string>);
    if (q.get(clave) === valor) q.delete(clave);
    else q.set(clave, valor);
    const texto = q.toString();
    return texto ? `/admin/ideas?${texto}` : "/admin/ideas";
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Ideas</h1>
          <p className="max-w-2xl text-sm text-white/50">
            La bandeja. Las ideas caen acá por nota de voz desde el bot de
            Telegram, ya transcritas, o escritas a mano. Después se revisan y
            se ligan a un proyecto.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {puedeInvitar(usuario.role) && (
            <Link
              href="/admin/ideas/acceso"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-white/70 transition-colors hover:border-white/25 hover:text-white"
            >
              <Send className="h-4 w-4" />
              Acceso al bot
            </Link>
          )}
          {puedeEditar && (
            <Link
              href="/admin/ideas/nueva"
              className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-3 py-2 text-sm text-black transition-opacity hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Nueva idea
            </Link>
          )}
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        {ESTADOS_IDEA.map((estado) => (
          <Filtro
            key={estado}
            activo={params.estado === estado}
            href={conFiltro("estado", estado)}
          >
            {NOMBRE_ESTADO[estado]}{" "}
            <span className="text-white/40">{porEstado[estado]}</span>
          </Filtro>
        ))}
        <Filtro
          activo={params.origen === "telegram"}
          href={conFiltro("origen", "telegram")}
        >
          Por voz
        </Filtro>
      </div>

      {ideas.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-10 text-center">
          <Lightbulb className="mx-auto h-8 w-8 text-white/20" />
          <p className="mt-3 text-sm text-white/60">
            {params.estado || params.origen
              ? "No hay ideas con ese filtro."
              : "Todavía no hay ideas. Mandale una nota de voz al bot y aparece acá."}
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {ideas.map((idea) => (
            <li key={idea.id}>
              <Link
                href={`/admin/ideas/${idea.id}`}
                className="block rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-white/25"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {idea.origen === "telegram" && idea.audioSeg > 0 && (
                        <Mic className="h-3.5 w-3.5 shrink-0 text-[#D4AF37]" />
                      )}
                      <h2 className="truncate font-medium text-white">
                        {idea.titulo || "Sin título"}
                      </h2>
                    </div>

                    {idea.resumen && (
                      <p className="mt-1 line-clamp-2 text-sm text-white/50">
                        {idea.resumen}
                      </p>
                    )}

                    <p className="mt-2 text-xs text-white/35">
                      {idea.autorNombre || "Sin autor"} · {fecha(idea.createdAt)}
                      {idea.audioSeg > 0 && ` · ${duracionLegible(idea.audioSeg)}`}
                      {idea.proyectoNombre && ` · ${idea.proyectoNombre}`}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs ${colorEstado(idea.estado)}`}
                  >
                    {NOMBRE_ESTADO[idea.estado]}
                  </span>
                </div>

                {idea.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {idea.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-white/45"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
