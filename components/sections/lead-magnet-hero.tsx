import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { HeroFormCapture } from "@/components/forms/hero-form-capture";
import { Reveal } from "@/components/effects/reveal";

const beneficios = [
  "10 prompts ganadores usados en producción",
  "Contexto exacto de cuándo aplicar cada uno",
  "Copy-paste listo para Claude o ChatGPT",
  "PDF 14 páginas · Descarga inmediata",
];

export function LeadMagnetHero() {
  return (
    <section
      id="recurso"
      aria-label="Recurso gratuito 10 prompts IA"
      className="relative overflow-hidden border-t border-[color:var(--line)] bg-[color:var(--background)] py-24 md:py-32"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_right,rgba(212,175,55,0.08),transparent_60%)]"
      />

      <div className="container-wide grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal direction="right" className="lg:col-span-5">
          <div className="relative mx-auto aspect-[3/4] w-full max-w-sm">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[color:var(--gold-dark)]/40 via-[color:var(--gold-mid)]/20 to-[color:var(--gold-dark)]/40 blur-3xl" />
            <Image
              src="/lead-magnets/10-prompts-ia-estrategas.webp"
              alt="10 Prompts de IA para Estrategas"
              fill
              sizes="(min-width:1024px) 33vw, 70vw"
              className="relative rounded-2xl border border-[color:var(--gold-mid)]/30 object-cover shadow-[0_40px_100px_-20px_rgba(212,175,55,0.35)]"
            />
          </div>
        </Reveal>

        <div className="lg:col-span-7">
          <Reveal direction="up">
            <p className="eyebrow">Recurso destacado · Gratis</p>
            <h2 className="h-section mt-4 text-white text-balance">
              Los <span className="text-gold-shimmer">10 prompts</span> que uso cada semana.
            </h2>
            <p className="mt-5 text-lg text-[color:var(--muted-foreground)] text-pretty">
              No es un pack genérico. Son los prompts exactos que uso para
              auditar estrategias, estructurar ofertas y acelerar negocio.
            </p>
          </Reveal>

          <Reveal direction="up" delay={0.15}>
            <ul className="mt-8 space-y-3">
              {beneficios.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm md:text-base">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[color:var(--gold-mid)]" aria-hidden />
                  <span className="text-white/85">{b}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal direction="up" delay={0.3}>
            <div className="mt-10">
              <HeroFormCapture slug="10-prompts-ia-estrategas" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
