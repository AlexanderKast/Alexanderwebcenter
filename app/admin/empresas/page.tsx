import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { empresas } from "@/content/empresas";
import { ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EmpresasPage() {
  await requireAuth();
  return (
    <div className="space-y-10">
      <header>
        <p className="eyebrow">Ecosistema</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-white md:text-4xl">
          Mis empresas
        </h1>
        <p className="mt-2 text-sm text-white/55">
          Los 4 proyectos que nutren la marca personal y que la marca personal nutre.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {empresas.map((e) => (
          <article
            key={e.id}
            className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--gold-mid)]">
                  {e.tagline}
                </p>
                <h3 className="mt-1 font-display text-2xl font-semibold text-white">
                  {e.nombre}
                </h3>
              </div>
              <Link
                href={e.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-md border border-[color:var(--line)] px-2.5 py-1 text-xs text-white/70 transition-colors hover:border-[color:var(--gold-mid)]/40 hover:text-white"
              >
                Abrir <ExternalLink className="size-3" />
              </Link>
            </div>
            <p className="mt-4 text-sm text-white/75 leading-relaxed">{e.descripcion}</p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs">
              <Link
                href={e.ctaPrimario.href}
                target="_blank"
                rel="noreferrer"
                className="btn-gold-metallic h-9 min-w-0 px-3 text-[11px]"
              >
                {e.ctaPrimario.label}
              </Link>
              {e.ctaSecundario ? (
                <Link
                  href={e.ctaSecundario.href}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-gold-outline h-9 min-w-0 px-3 text-[11px]"
                >
                  {e.ctaSecundario.label}
                </Link>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
