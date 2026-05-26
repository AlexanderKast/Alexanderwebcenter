"use client";

import { useEffect, useRef } from "react";

/**
 * Glow dorado que sigue al cursor en toda la ventana.
 * Inspirado en el efecto ripples de Davis Portfolio 1 pero modernizado.
 * Usa CSS variables + requestAnimationFrame para evitar re-renders.
 */
export function MouseGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let targetX = x;
    let targetY = y;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const loop = () => {
      x += (targetX - x) * 0.12;
      y += (targetY - y) * 0.12;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] mix-blend-screen"
      style={{
        background:
          "radial-gradient(600px circle at var(--mx, 50%) var(--my, 50%), rgba(254,197,68,0.10), transparent 45%)",
      }}
    />
  );
}
