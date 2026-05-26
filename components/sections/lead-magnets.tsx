import Link from "next/link";
import Image from "next/image";
import { ArrowDownToLine } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal, RevealStagger, RevealItem } from "@/components/effects/reveal";
import { Tilt } from "@/components/effects/tilt";
import { leadMagnets } from "@/content/lead-magnets";

export function LeadMagnets() {
  return (
    <section
      id="recursos"
      aria-label="Recursos gratuitos descargables"
      className="relative border-t border-[color:var(--line)] bg-[color:var(--background)] py-24 md:py-32"
    >
      <div className="container-wide">
        <Reveal direction="up">
          <SectionHeading
            superlabel="Descargas"
            title="Recursos gratis"
            description="Tres recursos que uso yo mismo. Los dejo gratis porque creo en servir antes de vender."
          />
          <div className="section-divider" />
        </Reveal>

        <RevealStagger
          staggerChildren={0.15}
          className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {leadMagnets.map((lm) => (
            <RevealItem key={lm.slug} direction="up">
              <Tilt intensity={5} className="h-full">
                <article className="group/card flex h-full flex-col rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface-2)] p-6 transition-all duration-300 hover:border-[color:var(--gold)]/40">
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-[color:var(--line)] bg-black shadow-[0_30px_60px_-20px_rgba(254,197,68,0.35)]">
                    <Image
                      src={lm.coverImage}
                      alt={`Portada de ${lm.titulo}`}
                      fill
                      sizes="(min-width:768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                    />
                    <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--gold)] backdrop-blur">
                      {lm.formato}
                    </span>
                  </div>

                  <div className="mt-6 flex flex-1 flex-col">
                    <p className="eyebrow">Pilar: {lm.pilar}</p>
                    <h4 className="mt-3 font-display text-lg font-semibold text-white">
                      {lm.subtitulo}
                    </h4>
                    <p className="mt-3 flex-1 text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                      {lm.descripcion}
                    </p>

                    <Link
                      href={`/descargas/${lm.slug}`}
                      aria-label={`Descargar ${lm.titulo} gratis`}
                      className="btn-davis mt-6 h-11 w-full"
                    >
                      <ArrowDownToLine className="size-4" aria-hidden="true" />
                      Descargar gratis
                    </Link>
                  </div>
                </article>
              </Tilt>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
