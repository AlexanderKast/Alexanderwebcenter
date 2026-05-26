import Image from "next/image";
import { Mail } from "lucide-react";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { Reveal } from "@/components/effects/reveal";
import { Parallax } from "@/components/effects/parallax";

export function NewsletterCta() {
  return (
    <section
      id="newsletter"
      aria-label="Suscripcion a la newsletter semanal"
      className="relative overflow-hidden border-y border-[color:var(--line)] py-24 md:py-32"
    >
      {/* Background image con parallax */}
      <Parallax y={-120} className="absolute inset-0 -z-20">
        <div className="relative h-[120%] w-full">
          <Image
            src="/images/newsletter/newsletter-banner.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-40"
          />
        </div>
      </Parallax>

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-br from-[color:var(--gold)]/15 via-[color:var(--background)]/90 to-[color:var(--background)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-grid opacity-60"
      />

      <div className="container-narrow text-center">
        <Reveal direction="up">
          <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--gold)]/30 bg-[color:var(--gold)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--gold)]">
            <Mail className="size-3" aria-hidden="true" />
            Newsletter
          </span>
        </Reveal>

        <Reveal direction="up" delay={0.1}>
          <h2 className="h-section mt-8 text-white">
            Recibe los <span className="text-[color:var(--gold)]">domingos</span>
          </h2>
        </Reveal>

        <Reveal direction="up" delay={0.2}>
          <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-[color:var(--muted-foreground)] leading-relaxed">
            Dios, Estrategia e IA en tu correo cada semana. Ensayos honestos,
            sin humo, sin venta agresiva.
          </p>
        </Reveal>

        <Reveal direction="up" delay={0.3}>
          <div className="mx-auto mt-10 max-w-xl">
            <NewsletterForm source="home-banner" label="Unirme" />
          </div>
          <p className="mt-4 text-xs text-white/40">
            Sin spam. Solo un envio semanal. Cancelas cuando quieras.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
