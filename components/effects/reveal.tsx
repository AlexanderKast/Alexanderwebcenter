"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

const variants: Record<Direction, Variants> = {
  up: {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0 },
  },
  down: {
    hidden: { opacity: 0, y: -32 },
    visible: { opacity: 1, y: 0 },
  },
  left: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
  right: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
  none: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
};

/**
 * Envuelve children y los revela cuando entran al viewport.
 * Usa Intersection Observer via framer-motion `whileInView`.
 */
export function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.7,
  once = true,
  amount = 0.2,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  once?: boolean;
  amount?: number;
  className?: string;
  as?: "div" | "section" | "article" | "li" | "span";
}) {
  const MotionTag = motion[Tag] as typeof motion.div;
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount, margin: "-80px 0px" }}
      variants={variants[direction]}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Version stagger: envuelve a children (array) y los escalona.
 */
export function RevealStagger({
  children,
  delayChildren = 0.1,
  staggerChildren = 0.08,
  className,
}: {
  children: ReactNode;
  delayChildren?: number;
  staggerChildren?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15, margin: "-60px 0px" }}
      variants={{
        hidden: {},
        visible: {
          transition: { delayChildren, staggerChildren },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  direction = "up",
  className,
}: {
  children: ReactNode;
  direction?: Direction;
  className?: string;
}) {
  return (
    <motion.div variants={variants[direction]} className={className}>
      {children}
    </motion.div>
  );
}
