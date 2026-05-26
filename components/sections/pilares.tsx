import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  Coffee,
  Compass,
  Cross,
  Layers,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal, RevealStagger, RevealItem } from "@/components/effects/reveal";
import { Tilt } from "@/components/effects/tilt";
import { pilares } from "@/content/pilares";

const iconMap: Record<string, LucideIcon> = {
  cross: Cross,
  compass: Compass,
  sparkles: Sparkles,
  layers: Layers,
  coffee: Coffee,
};

const sceneMap: Record<string, string> = {
  dios: "/images/pilares/scene-dios.webp",
  estrategia: "/images/pilares/scene-estrategia.webp",
  ia: "/images/pilares/scene-ia.webp",
  proceso: "/images/pilares/scene-proceso.webp",
  "vida-real": "/images/pilares/scene-vida.webp",
};

export function Pilares() {
  return (
    <section
      id="pilares"
      aria-label="Los cinco pilares de Alexander Cast"
      className="relative border-t border-[color:var(--line)] bg-[color:var(--background)] py-24 md:py-32"
    >
      <div className="container-wide">
        <Reveal direction="up">
          <SectionHeading
            superlabel="Cosmovision"
            title="Los 5 pilares que me mueven"
            description="Dios al centro, estrategia como lente, IA como palanca, proceso como prueba y vida real como recordatorio de que detras de todo hay un humano."
          />
          <div className="section-divider" />
        </Reveal>

        <RevealStagger
          className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5"
          staggerChildren={0.12}
        >
          {pilares.map((pilar) => {
            const Icon = iconMap[pilar.icono] ?? Sparkles;
            const scene = sceneMap[pilar.slug];
            return (
              <RevealItem key={pilar.id} direction="up">
                <Tilt intensity={6} className="h-full">
                  <article className="group/card card-davis relative flex h-full flex-col overflow-hidden rounded-2xl p-6">
                    {scene ? (
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 -z-10 opacity-20 transition-opacity duration-500 group-hover/card:opacity-40"
                      >
                        <Image
                          src={scene}
                          alt=""
                          fill
                          sizes="(min-width:1024px) 20vw, 40vw"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--background)] via-[color:var(--background)]/80 to-[color:var(--background)]/20" />
                      </div>
                    ) : null}

                    <div>
                      <div className="flex items-center justify-between">
                        <span className="inline-flex size-10 items-center justify-center rounded-xl border border-[color:var(--gold)]/30 bg-[color:var(--gold)]/10 text-[color:var(--gold)]">
                          <Icon className="size-5" aria-hidden="true" />
                        </span>
                        <span className="text-xs font-semibold text-white/50">
                          {pilar.porcentaje}%
                        </span>
                      </div>
                      <h3 className="mt-6 font-display text-xl font-semibold text-white">
                        {pilar.nombre}
                      </h3>
                      <p className="mt-3 text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                        {pilar.microCopy}
                      </p>
                    </div>
                    <Link
                      href={pilar.ctaHref}
                      aria-label={`${pilar.ctaLabel} sobre ${pilar.nombre}`}
                      className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--gold)] transition-colors hover:text-[color:var(--gold-soft)]"
                    >
                      {pilar.ctaLabel}
                      <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    </Link>
                  </article>
                </Tilt>
              </RevealItem>
            );
          })}
        </RevealStagger>
      </div>
    </section>
  );
}
