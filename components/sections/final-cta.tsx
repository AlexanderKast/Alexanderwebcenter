import Link from "next/link";
import { CalendarCheck } from "lucide-react";
import { Reveal } from "@/components/effects/reveal";

export function FinalCta() {
  return (
    <section
      aria-label="CTA final"
      className="relative overflow-hidden border-y border-[color:var(--gold-mid)]/20 bg-[color:var(--surface-0)] py-24 md:py-32"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.12),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--gold-mid)] to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[color:var(--gold-mid)] to-transparent"
      />

      <div className="container-narrow text-center">
        <Reveal direction="up">
          <p className="eyebrow">Último paso</p>
          <h2 className="h-section mt-4 text-balance text-white">
            ¿Listo para dejar de <span className="text-gold-shimmer">improvisar</span>?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-[color:var(--muted-foreground)]">
            30 minutos conmigo. Sin venta. Sin compromiso. Solo te digo si somos fit.
          </p>
        </Reveal>

        <Reveal direction="up" delay={0.15}>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/consultoria" className="btn-gold-metallic">
              <CalendarCheck className="size-4" aria-hidden />
              Agendar llamada gratuita
            </Link>
            <Link href="#recurso" className="btn-gold-outline">
              Llevarme el recurso
            </Link>
          </div>
          <p className="mt-4 text-xs text-white/40">
            Respondo yo · no equipo · máximo 24h
          </p>
        </Reveal>
      </div>
    </section>
  );
}
