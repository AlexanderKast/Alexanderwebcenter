"use client";

import { useEffect, useRef } from "react";

/**
 * Cursor premium: punto dorado instantáneo + anillo que sigue con lerp.
 * Solo se activa en dispositivos con cursor fino (desktop).
 * El anillo se expande cuando el cursor está sobre links/botones.
 */
export function HomeCursor() {
  const dotRef    = useRef<HTMLDivElement>(null);
  const ringRef   = useRef<HTMLDivElement>(null);
  const mousePos  = useRef({ x: -200, y: -200 });
  const ringPos   = useRef({ x: -200, y: -200 }); // posición interpolada del anillo
  const hovered   = useRef(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    document.body.style.cursor = "none";

    const onMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    /* —— loop de animación con null checks explícitos —— */
    let raf: number;
    const tick = () => {
      const dot  = dotRef.current;
      const ring = ringRef.current;
      if (!dot || !ring) { raf = requestAnimationFrame(tick); return; }

      dot.style.transform =
        `translate(${mousePos.current.x - 3}px, ${mousePos.current.y - 3}px)`;

      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.1;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.1;

      const size = hovered.current ? 56 : 36;
      const off  = size / 2;
      ring.style.width       = `${size}px`;
      ring.style.height      = `${size}px`;
      ring.style.transform   = `translate(${ringPos.current.x - off}px, ${ringPos.current.y - off}px)`;
      ring.style.borderColor = hovered.current ? "var(--gold)" : "rgba(201,168,76,0.5)";
      ring.style.background  = hovered.current ? "rgba(201,168,76,0.08)" : "transparent";

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onOver  = (e: MouseEvent) => { if ((e.target as HTMLElement).closest("a,button")) hovered.current = true; };
    const onOut   = (e: MouseEvent) => { if ((e.target as HTMLElement).closest("a,button")) hovered.current = false; };
    const onLeave = () => { if (dotRef.current) dotRef.current.style.opacity = "0"; if (ringRef.current) ringRef.current.style.opacity = "0"; };
    const onEnter = () => { if (dotRef.current) dotRef.current.style.opacity = "1"; if (ringRef.current) ringRef.current.style.opacity = "1"; };

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
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed", top: 0, left: 0,
          zIndex: 9998, pointerEvents: "none",
          width: 6, height: 6, borderRadius: "50%",
          background: "var(--gold)",
          boxShadow: "0 0 8px rgba(201,168,76,0.6)",
          transition: "opacity 0.3s",
        }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
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
