"use client";

import { useEffect, useRef } from "react";

/**
 * Video de fondo fijo — scrubbing por scroll con suavizado real.
 *
 * Técnica:
 *  1. Lerp del scrollY en píxeles (no del tiempo) → evita imprecisión de FP
 *  2. Guarda `video.seeking` → NO lanza un seek si el anterior aún no terminó
 *  3. Threshold de 40 ms → evita micro-seeks que colapsan el decoder
 *  4. will-change: transform en el wrapper → compositor layer dedicado
 *  5. prefers-reduced-motion → pausa scrubbing, muestra primer frame estático
 *  6. preload="metadata" → no descarga el video completo en móvil
 */
export function HomeVideoBackground() {
  const videoRef  = useRef<HTMLVideoElement>(null);
  const smoothY   = useRef(0);
  const targetY   = useRef(0);
  const rafRef    = useRef<number>(0);
  const readyRef  = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    /* ── Respetar prefers-reduced-motion: no scrubbear, dejar primer frame ── */
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      /* Carga el primer frame y se detiene — sin animación */
      video.addEventListener("loadedmetadata", () => { video.currentTime = 0; }, { once: true });
      return;
    }

    const onMeta   = () => { readyRef.current = true; };
    const onScroll = () => { targetY.current = window.scrollY; };

    const tick = () => {
      smoothY.current += (targetY.current - smoothY.current) * 0.11;

      if (readyRef.current && video.duration > 0) {
        const maxScroll = Math.max(
          1,
          document.documentElement.scrollHeight - window.innerHeight,
        );
        const progress = Math.min(smoothY.current / maxScroll, 1);
        const wantTime = progress * video.duration;

        if (!video.seeking && Math.abs(wantTime - video.currentTime) > 0.04) {
          video.currentTime = wantTime;
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    video.addEventListener("loadedmetadata", onMeta);
    window.addEventListener("scroll", onScroll, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      video.removeEventListener("loadedmetadata", onMeta);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: -1,
      pointerEvents: "none",
      overflow: "hidden",
      willChange: "transform",
    }}>
      <video
        ref={videoRef}
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.9,
        }}
      >
        <source src="/assets/images/video/black-gold.mp4" type="video/mp4" />
      </video>

      {/* Viñeta radial para profundidad en bordes */}
      <div style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(ellipse 120% 80% at 50% 50%, transparent 30%, rgba(0,0,0,0.55) 100%)",
      }} />
    </div>
  );
}
