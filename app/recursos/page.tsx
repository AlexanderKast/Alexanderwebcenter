import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { leadMagnets } from "@/content/lead-magnets";
import { SectionHeading } from "@/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Recursos gratuitos",
  description:
    "Lead magnets, plantillas y prompts que uso en mi propio trabajo. Disenados para aplicar, no para coleccionar.",
  path: "/recursos",
});

export default function RecursosPage() {
  return (
    <section className="container-narrow py-24 md:py-32">
      <SectionHeading
        superlabel="Descargas"
        title="Recursos gratuitos"
        description="Cosas que uso yo. Las comparto porque a alguien le sirvieron primero."
      />

      <ul className="mt-14 grid gap-6 md:grid-cols-3">
        {leadMagnets.map((m) => (
          <li
            key={m.slug}
            className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-[color:var(--gold)]/40"
          >
            <div className="relative mb-6 aspect-[3/4] overflow-hidden rounded-lg bg-gradient-to-br from-black to-zinc-900 p-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(230,184,0,0.15),transparent_60%)]" />
              <div className="relative flex h-full flex-col justify-between">
                <span className="text-xs uppercase tracking-[0.2em] text-[color:var(--gold)]/80">
                  {m.formato}
                </span>
                <div>
                  <p className="font-display text-xl leading-tight text-white/95">
                    {m.titulo}
                  </p>
                  {m.paginas ? (
                    <p className="mt-1 text-xs text-white/50">{m.paginas} paginas</p>
                  ) : null}
                </div>
              </div>
            </div>
            <h3 className="font-display text-lg">{m.subtitulo}</h3>
            <p className="mt-2 text-sm text-white/65 text-pretty">{m.descripcion}</p>
            <div className="mt-4 flex gap-2">
              <Badge variant="outline" className="border-white/15 text-white/70">
                Pilar: {m.pilar}
              </Badge>
            </div>
            <Link
              href={`/descargas/${m.slug}`}
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--gold)]"
            >
              Descargar
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
