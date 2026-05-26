"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal, RevealStagger, RevealItem } from "@/components/effects/reveal";
import { timeline } from "@/content/timeline";

export function About() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [40, -80]);

  return (
    <section
      ref={ref}
      id="sobre-mi"
      aria-label="Sobre Alexander Cast"
      className="relative border-t border-[color:var(--line)] bg-[color:var(--background)] py-24 md:py-32"
    >
      <div className="container-wide grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-5">
          <div className="sticky top-24 space-y-6">
            <motion.div
              style={{ y: imageY }}
              className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-[color:var(--line)]"
            >
              <Image
                src="/images/about/alexander-about.webp"
                alt="Retrato editorial en blanco y negro de Alexander Cast"
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[color:var(--background)]/80 via-transparent to-transparent"
              />
            </motion.div>
            <Reveal direction="up" delay={0.1}>
              <blockquote className="border-l-2 border-[color:var(--gold)]/70 pl-4 text-sm italic text-white/60">
                &ldquo;El temor de Jehova es el principio de la sabiduria.&rdquo;
                <span className="mt-1 block not-italic text-xs uppercase tracking-[0.2em] text-[color:var(--gold)]/80">
                  Proverbios 9:10
                </span>
              </blockquote>
            </Reveal>
            <Reveal direction="up" delay={0.2}>
              <p className="font-[cursive] text-2xl text-white/80">— Alexander</p>
            </Reveal>
          </div>
        </div>

        <div className="lg:col-span-7">
          <Reveal direction="up">
            <SectionHeading
              align="left"
              superlabel="Quien soy"
              title="Sobre mi"
              description="Camino con Dios y construyo en publico. No vendo el resultado, comparto el proceso real."
            />
            <div className="section-divider section-divider-left" />
          </Reveal>

          <RevealStagger
            className="mt-10 space-y-5 text-base leading-relaxed text-[color:var(--muted-foreground)] md:text-lg"
            staggerChildren={0.08}
          >
            <RevealItem>
              <p>
                Soy Alexander Cast. Estratega digital, de contenido y de IA.
                Integro tres dimensiones que casi nadie une con seriedad en
                espanol: fe autentica, estrategia profunda e inteligencia
                artificial aplicada.
              </p>
            </RevealItem>
            <RevealItem>
              <p>
                Opero desde Bogota un ecosistema de cuatro proyectos vivos:
                KREOON, UGC Colombia, Infiny Group y Los Reyes del Contenido.
                Todo lo que enseno lo estoy aplicando en tiempo real. No es
                teoria de libro, es laboratorio diario.
              </p>
            </RevealItem>
            <RevealItem>
              <p>
                No soy developer. No soy &ldquo;CEO de cinco empresas
                exitosas&rdquo;. No vendo formulas magicas. Soy un hombre de fe
                que aprendio estrategia probando, fallando y ajustando, y que
                hoy usa IA como palanca para construir con proposito.
              </p>
            </RevealItem>
          </RevealStagger>

          <Reveal direction="up" delay={0.2}>
            <dl className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { k: "Ubicacion", v: "Bogota, Colombia" },
                { k: "Email", v: "founder@kreoon.com" },
                { k: "Idioma", v: "Español" },
                { k: "Disponibilidad", v: "Consultoria selectiva" },
                { k: "Rol", v: "Estratega digital + fundador" },
                { k: "Desde", v: "Construyendo desde 2017" },
              ].map((item) => (
                <div
                  key={item.k}
                  className="flex items-center justify-between gap-4 rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-2)]/50 px-4 py-3"
                >
                  <dt className="text-[11px] uppercase tracking-[0.22em] text-white/50">
                    {item.k}
                  </dt>
                  <dd className="text-sm font-medium text-white">{item.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <div className="mt-16">
            <Reveal direction="up">
              <h3 className="eyebrow">Linea de tiempo</h3>
            </Reveal>
            <ol className="relative mt-8 space-y-10 border-l border-[color:var(--line)] pl-8">
              {timeline.map((hito, i) => (
                <Reveal
                  key={hito.titulo}
                  direction="left"
                  delay={i * 0.08}
                  as="li"
                  className="timeline-item relative"
                >
                  <span aria-hidden="true" className="timeline-dot" />
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--gold)]/90">
                    {hito.año}
                  </p>
                  <h4 className="mt-1 font-display text-lg font-semibold text-white">
                    {hito.titulo}
                  </h4>
                  <p className="mt-2 text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                    {hito.descripcion}
                  </p>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
