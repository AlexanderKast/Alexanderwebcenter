"use client";

import { useEffect, useRef } from "react";

/**
 * Cursor premium: punto dorado instantáneo + anillo que sigue con lerp.
 * Solo se activa en dispositivos con cursor fino (desktop).
 * El anillo se expande cuando el cursor está sobre links/botones.
 */
export function HomeCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos     = useRef({ x: -200, y: -200 });
  const ring    = useRef({ x: -200, y: -200 });
  const hovered = useRef(false);

  useEffect(() => {
    // Solo en dispositivos con puntero fino (no touch)
    if (!window.matchMedia("(pointer: fine)").matches) return;

    document.body.style.cursor = "none";

    /* —— seguimiento del mouse —— */
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    /* —— loop de animación —— */
    let raf: number;
    const tick = () => {
      // Dot: instantáneo
      dotRef.current!.style.transform =
        `translate(${pos.current.x - 3}px, ${pos.current.y - 3}px)`;

      // Ring: lerp suave
      ring.current.x += (pos.current.x - ring.current.x) * 0.1;
      ring.current.y += (pos.current.y - ring.current.y) * 0.1;
      const size = hovered.current ? 56 : 36;
      const off  = size / 2;
      ringRef.current!.style.width  = `${size}px`;
      ringRef.current!.style.height = `${size}px`;
      ringRef.current!.style.transform =
        `translate(${ring.current.x - off}px, ${ring.current.y - off}px)`;
      ringRef.current!.style.borderColor = hovered.current
        ? "var(--gold)"
        : "rgba(201,168,76,0.5)";
      ringRef.current!.style.background = hovered.current
        ? "rgba(201,168,76,0.08)"
        : "transparent";

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    /* —— hover sobre interactivos (delegación en document) —— */
    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("a") || el.closest("button")) hovered.current = true;
    };
    const onOut = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("a") || el.closest("button")) hovered.current = false;
    };

    /* —— ocultar cursor al salir del viewport —— */
    const onLeave = () => {
      dotRef.current!.style.opacity  = "0";
      ringRef.current!.style.opacity = "0";
    };
    const onEnter = () => {
      dotRef.current!.style.opacity  = "1";
      ringRef.current!.style.opacity = "1";
    };

    window.addEventListener("mousemove",   onMove,  { passive: true });
    document.addEventListener("mouseover",  onOver,  { passive: true });
    document.addEventListener("mouseout",   onOut,   { passive: true });
    document.addEventListener("mouseleave", onLeave, { passive: true });
    document.addEventListener("mouseenter", onEnter, { passive: true });

    return () => {
      document.body.style.cursor = "";
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove",   onMove);
      document.removeEventListener("mouseover",  onOver);
      document.removeEventListener("mouseout",   onOut);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return (
    <>
      {/* Punto dorado (instantáneo) */}
      <div
        ref={dotRef}
        style={{
          position: "fixed", top: 0, left: 0,
          zIndex: 9998, pointerEvents: "none",
          width: 6, height: 6, borderRadius: "50%",
          background: "var(--gold)",
          boxShadow: "0 0 8px rgba(201,168,76,0.6)",
          transition: "opacity 0.3s",
        }}
      />
      {/* Anillo (lerp) */}
      <div
        ref={ringRef}
        style={{
          position: "fixed", top: 0, left: 0,
          zIndex: 9997, pointerEvents: "none",
          width: 36, height: 36, borderRadius: "50%",
          border: "1px solid rgba(201,168,76,0.5)",
          transition: "opacity 0.3s, border-color 0.3s, background 0.3s, width 0.3s, height 0.3s",
        }}
      />
    </>
  );
}
