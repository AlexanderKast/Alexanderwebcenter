"use client";

import { useEffect, useRef } from "react";

/**
 * Video de fondo fijo para toda la página.
 * El tiempo del video se controla con la posición horizontal del mouse:
 * izquierda = inicio del video, derecha = final.
 * Usa requestAnimationFrame + lerp para un scrubbing suave.
 */
export function HomeVideoBackground() {
  const videoRef  = useRef<HTMLVideoElement>(null);
  const targetRef = useRef(0);          // tiempo objetivo (segundos)
  const rafRef    = useRef<number>(0);
  const readyRef  = useRef(false);      // duration disponible

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    /* — cuando el metadata esté listo, marcamos ready — */
    const onMeta = () => { readyRef.current = true; };

    /* — mouse move: mapea X del viewport al tiempo del video — */
    const onMove = (e: MouseEvent) => {
      if (!readyRef.current || !video.duration) return;
      targetRef.current = (e.clientX / window.innerWidth) * video.duration;
    };

    /* — touch (mobile): usa la posición X del primer dedo — */
    const onTouch = (e: TouchEvent) => {
      if (!readyRef.current || !video.duration) return;
      const t = e.touches[0];
      targetRef.current = (t.clientX / window.innerWidth) * video.duration;
    };

    /* — loop de animación: lerp suave hacia el target — */
    const tick = () => {
      if (readyRef.current && video.duration) {
        const diff = targetRef.current - video.currentTime;
        if (Math.abs(diff) > 0.016) {           // ~1 frame a 60fps
          video.currentTime += diff * 0.07;      // factor de suavizado
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    video.addEventListener("loadedmetadata", onMeta);
    window.addEventListener("mousemove",     onMove,  { passive: true });
    window.addEventListener("touchmove",     onTouch, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      video.removeEventListener("loadedmetadata", onMeta);
      window.removeEventListener("mousemove",     onMove);
      window.removeEventListener("touchmove",     onTouch);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: -1,                 /* detrás de todo el contenido */
      pointerEvents: "none",
      overflow: "hidden",
    }}>
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
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
