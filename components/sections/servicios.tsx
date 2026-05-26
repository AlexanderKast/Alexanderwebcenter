import Link from "next/link";
import Image from "next/image";
import { Check, Sparkles } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { cn } from "@/lib/utils";
import { Reveal, RevealStagger, RevealItem } from "@/components/effects/reveal";
import { Parallax } from "@/components/effects/parallax";
import { servicios } from "@/content/servicios";

export function Servicios() {
  return (
    <section
      id="servicios"
      aria-label="Servicios de consultoria"
      className="relative overflow-hidden border-t border-[color:var(--line)] bg-[color:var(--background)] py-24 md:py-32"
    >
      <Parallax y={-50} className="absolute inset-0 -z-20 opacity-15">
        <div className="relative h-[115%] w-full">
          <Image
            src="/images/servicios/consultoria-session.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--background)] via-[color:var(--background)]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--background)] to-transparent" />
        </div>
      </Parallax>

      <div className="container-wide relative">
        <Reveal direction="up">
          <SectionHeading
            superlabel="Consultoria"
            title="Trabaja conmigo"
            description="Tres formas de trabajar juntos. Todas empiezan con un proceso de calificacion: solo avanzamos si hay fit real."
          />
          <div className="section-divider" />
        </Reveal>

        <RevealStagger
          staggerChildren={0.12}
          className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {servicios.map((servicio) => {
            const destacado = servicio.destacado;
            return (
              <RevealItem key={servicio.id} direction="up">
                <article
                  className={cn(
                    "relative flex h-full flex-col rounded-3xl border bg-[color:var(--surface-2)] p-8 transition-all duration-300 hover:-translate-y-1",
                    destacado
                      ? "border-[color:var(--gold)]/60 shadow-[0_0_60px_-20px_rgba(254,197,68,0.45)]"
                      : "border-[color:var(--line)] hover:border-[color:var(--gold)]/40",
                  )}
                >
                  {destacado ? (
                    <span className="absolute -top-3 left-8 inline-flex items-center gap-1.5 rounded-full bg-[color:var(--gold)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--brand)]">
                      <Sparkles className="size-3" aria-hidden="true" />
                      Mas solicitado
                    </span>
                  ) : null}

                  <h3 className="font-display text-2xl font-semibold text-white">
                    {servicio.nombre}
                  </h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/50">
                    {servicio.duracion}
                  </p>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span
                      className={cn(
                        "font-display text-4xl font-semibold tracking-tight",
                        destacado ? "text-[color:var(--gold)]" : "text-white",
                      )}
                    >
                      {servicio.precio}
                    </span>
                  </div>

                  <p className="mt-6 text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                    {servicio.descripcion}
                  </p>

                  <ul className="mt-8 space-y-3">
                    {servicio.incluye.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-sm text-white/75"
                      >
                        <span
                          className={cn(
                            "mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full",
                            destacado
                              ? "bg-[color:var(--gold)]/15 text-[color:var(--gold)]"
                              : "bg-white/5 text-white/70",
                          )}
                        >
                          <Check className="size-3" aria-hidden="true" />
                        </span>
                        <span className="leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-10 pt-6 border-t border-[color:var(--line)]">
                    <Link
                      href={destacado ? "/consultoria" : servicio.ctaHref}
                      aria-label={`${servicio.ctaLabel}: ${servicio.nombre}`}
                      className={cn(
                        destacado ? "btn-davis" : "btn-davis-outline",
                        "h-11 w-full",
                      )}
                    >
                      {servicio.ctaLabel}
                    </Link>
                  </div>
                </article>
              </RevealItem>
            );
          })}
        </RevealStagger>
      </div>
    </section>
  );
}
