import { Target, Cpu, Crown } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal, RevealStagger, RevealItem } from "@/components/effects/reveal";

const props = [
  {
    icon: Target,
    titulo: "Estrategia clara",
    copy: "Un plan simple para empezar sin perderte entre mil tácticas.",
  },
  {
    icon: Cpu,
    titulo: "IA como copiloto",
    copy: "Automatiza lo tedioso y multiplica tu contenido sin perder tu voz.",
  },
  {
    icon: Crown,
    titulo: "Marca que conecta",
    copy: "Una historia y oferta tan claras que tus clientes te eligen sin dudar.",
  },
];

export function ValueProps() {
  return (
    <section
      id="beneficios"
      aria-label="Propuesta de valor"
      className="relative border-t border-[color:var(--line)] bg-[color:var(--surface-0)] py-20 md:py-28"
    >
      <div className="container-wide">
        <Reveal direction="up">
          <SectionHeading
            superlabel="Cómo lo logras"
            title="Tres palancas. Cero humo."
          />
          <div className="section-divider" />
        </Reveal>

        <RevealStagger staggerChildren={0.12} className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {props.map((p) => {
            const Icon = p.icon;
            return (
              <RevealItem key={p.titulo} direction="up">
                <article className="card-dark group/card h-full rounded-2xl p-8">
                  <span className="inline-flex size-14 items-center justify-center rounded-2xl border border-[color:var(--gold-mid)]/30 bg-[color:var(--gold-mid)]/5 text-[color:var(--gold-mid)] transition-colors group-hover/card:bg-[color:var(--gold-mid)]/15">
                    <Icon className="size-6" aria-hidden />
                  </span>
                  <h3 className="mt-6 font-display text-xl font-semibold text-white">
                    {p.titulo}
                  </h3>
                  <p className="mt-2 text-[color:var(--muted-foreground)] leading-relaxed">
                    {p.copy}
                  </p>
                </article>
              </RevealItem>
            );
          })}
        </RevealStagger>
      </div>
    </section>
  );
}
