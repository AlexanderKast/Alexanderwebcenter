"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/effects/reveal";

type Skill = { nombre: string; porcentaje: number };

const skills: Skill[] = [
  { nombre: "Estrategia de contenido", porcentaje: 95 },
  { nombre: "Prompt engineering con IA", porcentaje: 92 },
  { nombre: "Marca personal y storytelling", porcentaje: 90 },
  { nombre: "Fundamentos de negocio", porcentaje: 88 },
  { nombre: "Produccion audiovisual", porcentaje: 82 },
  { nombre: "Automatizacion n8n", porcentaje: 80 },
];

function Bar({ nombre, porcentaje }: Skill) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });
  return (
    <div ref={ref} className="w-full">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-white/90">{nombre}</span>
        <motion.span
          className="text-xs font-semibold text-[color:var(--gold)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: inView ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {porcentaje}%
        </motion.span>
      </div>
      <div className="mt-3 h-[3px] w-full overflow-hidden rounded-full bg-[color:var(--line-strong)]">
        <motion.div
          className="h-full rounded-full bg-[color:var(--gold)]"
          initial={{ width: 0 }}
          animate={inView ? { width: `${porcentaje}%` } : { width: 0 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

export function Skills() {
  return (
    <section
      id="skills"
      aria-label="Habilidades clave de Alexander Cast"
      className="relative border-t border-[color:var(--line)] bg-[color:var(--surface-1)] py-24 md:py-32"
    >
      <div className="container-wide grid gap-16 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-5">
          <Reveal direction="up">
            <SectionHeading
              align="left"
              superlabel="Stack mental"
              title="En lo que soy fuerte"
              description="Lo que aplico todos los dias. No soy experto en todo, pero en esto si lo soy."
            />
            <div className="section-divider section-divider-left" />
          </Reveal>
          <Reveal direction="up" delay={0.15}>
            <p className="mt-8 text-[color:var(--muted-foreground)] leading-relaxed">
              Cada porcentaje es auto-evaluacion honesta despues de años
              probando. Publico abiertamente lo que domino para que sepas
              cuando soy el indicado y cuando no.
            </p>
          </Reveal>
        </div>
        <div className="space-y-6 lg:col-span-7">
          {skills.map((s, i) => (
            <Reveal key={s.nombre} direction="up" delay={i * 0.05}>
              <Bar {...s} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
