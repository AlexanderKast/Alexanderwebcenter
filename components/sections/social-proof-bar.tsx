import { Reveal } from "@/components/effects/reveal";
import { Counter } from "@/components/shared/counter";

type Stat = {
  v: number;
  suffix: string;
  label: string;
  isText?: string;
};

const stats: Stat[] = [
  { v: 4, suffix: "", label: "Proyectos activos" },
  { v: 8, suffix: "+", label: "Años construyendo" },
  { v: 2500, suffix: "+", label: "Formados" },
  { v: 1, suffix: "", label: "Medellín, Colombia", isText: "Medellín" },
];

const proyectos = ["KREOON", "UGC Colombia", "Infiny Latam", "Los Reyes del Contenido"];

export function SocialProofBar() {
  return (
    <section
      aria-label="Prueba social"
      className="relative border-y border-[color:var(--line)] bg-[color:var(--surface-0)] py-12 md:py-16"
    >
      <div className="container-wide">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} direction="up" delay={i * 0.08}>
              <div className="text-center">
                <p className="font-display text-3xl font-bold text-gold-metallic md:text-4xl">
                  {s.isText ? s.isText : <Counter value={s.v} suffix={s.suffix} />}
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-white/50">
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal direction="up" delay={0.35}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 border-t border-[color:var(--line)] pt-8">
            <span className="eyebrow">Ecosistema</span>
            {proyectos.map((p) => (
              <span
                key={p}
                className="font-display text-sm font-medium text-white/70 transition-colors hover:text-[color:var(--gold-mid)] md:text-base"
              >
                {p}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
