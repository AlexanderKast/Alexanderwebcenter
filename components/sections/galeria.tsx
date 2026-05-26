"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal, RevealStagger, RevealItem } from "@/components/effects/reveal";

const fotos = [
  { src: "/images/galeria/editorial-01.webp", aspect: "aspect-[4/5]", alt: "Alexander Cast caminando en la ciudad al atardecer", speed: -40 },
  { src: "/images/process/alexander-writing.webp", aspect: "aspect-[3/2]", alt: "Alexander Cast escribiendo en el escritorio", speed: -20 },
  { src: "/images/galeria/editorial-02.webp", aspect: "aspect-[3/4]", alt: "Alexander Cast en su estudio de trabajo", speed: -60 },
  { src: "/images/galeria/editorial-03.webp", aspect: "aspect-[4/5]", alt: "Alexander Cast con una Biblia junto a la ventana", speed: -30 },
  { src: "/images/process/alexander-speaking.webp", aspect: "aspect-[3/2]", alt: "Alexander Cast presentando", speed: -50 },
  { src: "/images/galeria/editorial-04.webp", aspect: "aspect-[3/2]", alt: "Manos escribiendo en laptop", speed: -25 },
  { src: "/images/galeria/editorial-05.webp", aspect: "aspect-[4/5]", alt: "Alexander Cast con cafe al amanecer", speed: -45 },
  { src: "/images/process/alexander-thinking.webp", aspect: "aspect-[3/2]", alt: "Alexander Cast pensativo junto a la ventana", speed: -15 },
  { src: "/images/galeria/editorial-06.webp", aspect: "aspect-[3/4]", alt: "Alexander Cast retrato profesional", speed: -55 },
];

function Tile({
  src,
  alt,
  aspect,
  speed,
}: {
  src: string;
  alt: string;
  aspect: string;
  speed: number;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, speed]);

  return (
    <motion.li
      ref={ref}
      style={{ y }}
      className={`zoom-in group/tile relative ${aspect} overflow-hidden rounded-2xl border border-[color:var(--line)]`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 30vw, (min-width: 768px) 32vw, 48vw"
        className="object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[color:var(--background)]/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover/tile:opacity-100"
      />
    </motion.li>
  );
}

export function Galeria() {
  return (
    <section
      id="galeria"
      aria-label="Galeria editorial de Alexander Cast"
      className="relative border-t border-[color:var(--line)] bg-[color:var(--surface-1)] py-24 md:py-32"
    >
      <div className="container-wide">
        <Reveal direction="up">
          <SectionHeading
            superlabel="Detras de escenas"
            title="Proceso real"
            description="Editoriales del dia a dia. Bogota, estudio, lecturas, escritura, reuniones. La marca se construye con constancia."
          />
          <div className="section-divider" />
        </Reveal>

        <RevealStagger
          staggerChildren={0.06}
          className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4"
        >
          {fotos.map((foto) => (
            <RevealItem key={foto.src} direction="up">
              <Tile {...foto} />
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
