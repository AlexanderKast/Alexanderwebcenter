import { X, Check } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal, RevealStagger, RevealItem } from "@/components/effects/reveal";

const dolor = [
  "Tu negocio funciona offline, pero online no existe",
  "Quieres lanzar tu marca y no sabes por dónde empezar",
  "Publicas sin que nadie te escriba",
  "Ves que todos usan IA y tú sigues haciéndolo todo a mano",
];
const solucion = [
  "Presencia digital que te trae clientes",
  "Ruta clara para lanzar tu marca sin perder meses",
  "Contenido que convierte, no solo gusta",
  "IA como copiloto para hacer 10× en la mitad de tiempo",
];

export function PainSolution() {
  return (
    <section
      id="problema"
      aria-label="Problema y solución"
      className="relative border-t border-[color:var(--line)] bg-[color:var(--background)] py-20 md:py-28"
    >
      <div className="container-wide">
        <Reveal direction="up">
          <SectionHeading
            superlabel="Por qué estás aquí"
            title="Llevas tiempo intentándolo solo."
            description="Ya lo sabes: improvisar cansa, el feed no se llena solo y el tiempo se va en tareas que no venden."
          />
          <div className="section-divider" />
        </Reveal>

        <div className="mt-16 grid gap-8 md:grid-cols-2 md:gap-10">
          <Reveal direction="right">
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-7 md:p-10">
              <p className="eyebrow text-red-400/80">Ahora</p>
              <h3 className="mt-3 font-display text-2xl font-semibold text-white">
                Lo que estás viviendo
              </h3>
              <RevealStagger staggerChildren={0.08} className="mt-6 space-y-3">
                {dolor.map((d) => (
                  <RevealItem key={d} direction="up">
                    <div className="flex items-start gap-3">
                      <X className="mt-0.5 size-5 shrink-0 text-red-400/70" aria-hidden />
                      <span className="text-white/80">{d}</span>
                    </div>
                  </RevealItem>
                ))}
              </RevealStagger>
            </div>
          </Reveal>

          <Reveal direction="left" delay={0.15}>
            <div className="rounded-2xl border-gold-metallic p-7 md:p-10">
              <p className="eyebrow">Con sistema</p>
              <h3 className="mt-3 font-display text-2xl font-semibold text-gold-metallic">
                Lo que vas a construir
              </h3>
              <RevealStagger staggerChildren={0.08} className="mt-6 space-y-3">
                {solucion.map((s) => (
                  <RevealItem key={s} direction="up">
                    <div className="flex items-start gap-3">
                      <Check className="mt-0.5 size-5 shrink-0 text-[color:var(--gold-mid)]" aria-hidden />
                      <span className="font-medium text-white">{s}</span>
                    </div>
                  </RevealItem>
                ))}
              </RevealStagger>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
