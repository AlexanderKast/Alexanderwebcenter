"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { CalendarDays } from "lucide-react";
import { HeroFormCapture } from "@/components/forms/hero-form-capture";
import { ParticlesBg } from "@/components/shared/particles-bg";
import { Tilt } from "@/components/effects/tilt";
import { site } from "@/content/site";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  return (
    <section
      ref={ref}
      id="top"
      aria-label="Presentacion Alexander Cast"
      className="relative isolate flex min-h-[92vh] items-center overflow-hidden bg-[color:var(--background)]"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-grid-subtle" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(212,175,55,0.08),transparent_55%)]"
      />
      <ParticlesBg id="hero-particles" />

      <div className="container-wide relative z-10 grid grid-cols-1 items-center gap-12 py-24 lg:grid-cols-12 lg:gap-12 lg:py-28">
        {/* Texto + form */}
        <motion.div
          className="lg:col-span-7"
          style={{ y: textY }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="h-hero text-balance text-white">
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15 }}
            >
              Convierte tu marca o negocio
            </motion.span>
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3 }}
            >
              en una <span className="text-gold-shimmer">máquina de clientes.</span>
            </motion.span>
          </h1>

          <motion.p
            className="h-profession mt-6 font-display italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Dios. Estrategia. IA.
          </motion.p>

          <motion.p
            className="mt-5 max-w-xl text-[color:var(--muted-foreground)] text-base md:text-lg leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65 }}
          >
            Ayudo a emprendedores tradicionales a dar el salto al mundo digital
            y a quienes están creando marca, producto o negocio desde cero.
          </motion.p>

          <motion.div
            className="mt-10 space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <p className="text-sm text-white/70">
              <span className="text-gold-metallic font-semibold">GRATIS:</span>{" "}
              10 Prompts de IA para Estrategas
            </p>
            <HeroFormCapture slug="10-prompts-ia-estrategas" />
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-white/40">
              <span>o también</span>
              <Link
                href="/consultoria"
                className="group inline-flex items-center gap-1.5 text-[color:var(--gold-light)] transition-colors hover:text-[color:var(--gold-hi)]"
              >
                <CalendarDays className="size-3.5" />
                Agenda una llamada
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Imagen */}
        <motion.div
          className="relative lg:col-span-5"
          style={{ y: imageY }}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <Tilt intensity={4}>
            <motion.div
              style={{ scale: imageScale }}
              className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl border-gold-metallic shadow-[0_60px_120px_-40px_rgba(212,175,55,0.45)] lg:max-w-none"
            >
              <Image
                src="/images/hero/alexander-hero.webp"
                alt={`Retrato editorial de ${site.name}`}
                fill
                priority
                sizes="(min-width:1024px) 42vw, (min-width:768px) 60vw, 90vw"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[color:var(--background)]/80 via-transparent to-transparent"
              />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                <div>
                  <p className="eyebrow">{site.tagline}</p>
                  <p className="mt-1 font-display text-lg font-semibold text-white">
                    {site.name}
                  </p>
                </div>
              </div>
            </motion.div>
          </Tilt>
        </motion.div>
      </div>
    </section>
  );
}
