"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

/**
 * Mueve al elemento a distinta velocidad que el scroll para crear profundidad.
 *
 * @example <Parallax y={-80}><Image /></Parallax>  // sube 80px cuando la seccion se recorre
 */
export function Parallax({
  children,
  y = -60,
  className,
}: {
  children: ReactNode;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const translateY = useTransform(scrollYProgress, [0, 1], [0, y]);

  return (
    <motion.div ref={ref} style={{ y: translateY }} className={className}>
      {children}
    </motion.div>
  );
}

/**
 * Parallax con efecto zoom + fade: la imagen se acerca/aleja mientras haces scroll.
 */
export function ParallaxZoom({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.4, 1, 1, 0.4]);

  return (
    <motion.div ref={ref} style={{ scale, opacity }} className={className}>
      {children}
    </motion.div>
  );
}
