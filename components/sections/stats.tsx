import { Counter } from "@/components/shared/counter";
import { Reveal, RevealStagger, RevealItem } from "@/components/effects/reveal";

const stats = [
  { label: "Proyectos vivos", value: 4, suffix: "" },
  { label: "Años construyendo", value: 8, suffix: "+" },
  { label: "Emprendedores formados", value: 2500, suffix: "+" },
  { label: "Pilares de contenido", value: 5, suffix: "" },
];

export function Stats() {
  return (
    <section
      aria-label="Numeros que me representan"
      className="relative border-t border-[color:var(--line)] bg-[color:var(--surface-1)] py-16 md:py-24"
    >
      <div className="container-wide">
        <RevealStagger
          staggerChildren={0.08}
          className="grid grid-cols-2 gap-6 md:grid-cols-4"
        >
          {stats.map((s) => (
            <RevealItem key={s.label} direction="up">
              <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-2)] p-6 text-center md:p-8">
                <p className="font-display text-4xl font-bold tracking-tight text-[color:var(--gold)] md:text-5xl">
                  <Counter value={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.22em] text-white/60">
                  {s.label}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
