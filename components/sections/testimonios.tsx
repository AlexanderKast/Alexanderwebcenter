// Placeholders hasta tener testimonios reales firmados.
import { Quote } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal, RevealStagger, RevealItem } from "@/components/effects/reveal";
import { testimonios } from "@/content/testimonios";

export function Testimonios() {
  const top3 = testimonios.slice(0, 3);

  return (
    <section
      id="testimonios"
      aria-label="Testimonios"
      className="relative border-t border-[color:var(--line)] bg-[color:var(--background)] py-20 md:py-28"
    >
      <div className="container-wide">
        <Reveal direction="up">
          <SectionHeading
            superlabel="Voces"
            title="Historias reales."
          />
          <div className="section-divider" />
        </Reveal>

        <RevealStagger staggerChildren={0.12} className="mt-14 grid gap-5 md:grid-cols-3">
          {top3.map((t, i) => (
            <RevealItem key={`${t.nombre}-${i}`} direction="up">
              <article className="card-dark relative flex h-full flex-col justify-between overflow-hidden rounded-2xl p-7">
                <Quote
                  aria-hidden
                  className="pointer-events-none absolute -right-3 -top-3 size-24 text-[color:var(--gold-mid)]/10"
                />
                <blockquote className="relative text-base leading-relaxed text-white md:text-lg">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="relative mt-8 border-t border-[color:var(--line)] pt-5">
                  <p className="font-display text-sm font-semibold text-white">
                    {t.nombre}
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-white/50">
                    {t.rol}
                    {t.empresa ? ` · ${t.empresa}` : ""}
                  </p>
                  {t.resultado ? (
                    <p className="mt-3 inline-flex rounded-full border border-[color:var(--gold-mid)]/30 bg-[color:var(--gold-mid)]/10 px-3 py-1 text-[11px] font-medium text-[color:var(--gold-light)]">
                      {t.resultado}
                    </p>
                  ) : null}
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
