import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal, RevealStagger, RevealItem } from "@/components/effects/reveal";
import { empresas } from "@/content/empresas";

export function Ecosistema() {
  return (
    <section
      id="autoridad"
      aria-label="Ecosistema Alexander Cast"
      className="relative overflow-hidden border-t border-[color:var(--line)] bg-[color:var(--background)] py-20 md:py-28"
    >
      <div className="container-wide">
        <Reveal direction="up">
          <SectionHeading
            superlabel="Lo que lidero"
            title="Cuatro proyectos activos."
            description="No hablo de teoría. Todo lo que enseño lo aplico en tiempo real."
          />
          <div className="section-divider" />
        </Reveal>

        <RevealStagger
          staggerChildren={0.1}
          className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5"
        >
          {empresas.map((e) => (
            <RevealItem key={e.id} direction="up">
              <Link
                href={e.ctaPrimario.href}
                target="_blank"
                rel="noreferrer noopener"
                className="card-dark group/card relative flex h-full flex-col justify-between rounded-2xl p-5 md:p-6"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-10 -right-10 size-32 rounded-full opacity-10 blur-2xl transition-opacity group-hover/card:opacity-30"
                  style={{ backgroundColor: e.color }}
                />
                <div>
                  <p className="eyebrow">{e.tagline}</p>
                  <h3 className="mt-3 font-display text-xl font-semibold text-white md:text-2xl">
                    {e.nombre}
                  </h3>
                </div>
                <div className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--gold-mid)]">
                  {e.ctaPrimario.label}
                  <ArrowUpRight className="size-3.5 transition-transform group-hover/card:translate-x-0.5" />
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
