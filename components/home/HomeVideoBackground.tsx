"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

/**
 * Fondo del sitio: capa base CSS (siempre) + video opcional encima.
 *
 * El video pesa 62 MB, asi que NO se carga siempre. Antes se montaba con
 * preload="auto" en todos lados y en movil se bajaba entero; ahora la capa
 * base es un degradado CSS que pinta al instante y el video solo entra
 * cuando el dispositivo lo aguanta.
 *
 * Se descarta el video si:
 *  - prefers-reduced-motion: reduce
 *  - viewport angosto (< 1024px): el scrubbing por seek se traba en movil
 *  - Save-Data activo o conexion 2g/3g
 *
 * Encima de todo va un scrim: sin el, los frames dorados quedaban detras
 * del texto y ni los parrafos ni los botones se leian.
 */

/** Opacidad del video. Por encima de esto el texto deja de tener contraste. */
const OPACIDAD_VIDEO = 0.55;
/** Distancia minima en segundos para justificar un seek nuevo. */
const UMBRAL_SEEK = 0.04;
/** Debajo de esta distancia en px damos el scroll por quieto y frenamos el rAF. */
const UMBRAL_REPOSO = 0.5;

type ConexionLenta = { saveData?: boolean; effectiveType?: string };

function deberiaCargarVideo(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (window.matchMedia("(max-width: 1023px)").matches) return false;

  const conexion = (navigator as Navigator & { connection?: ConexionLenta }).connection;
  if (conexion?.saveData) return false;
  if (conexion?.effectiveType && /(^|-)(2g|3g)$/.test(conexion.effectiveType)) return false;

  return true;
}

/** Reevalua el soporte cuando cambia el viewport o el ajuste de movimiento. */
function suscribirEntorno(alCambiar: () => void): () => void {
  const consultas = [
    window.matchMedia("(prefers-reduced-motion: reduce)"),
    window.matchMedia("(max-width: 1023px)"),
  ];
  consultas.forEach((c) => c.addEventListener("change", alCambiar));
  return () => consultas.forEach((c) => c.removeEventListener("change", alCambiar));
}

export function HomeVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const smoothY = useRef(0);
  const targetY = useRef(0);
  const rafRef = useRef<number | null>(null);
  const readyRef = useRef(false);

  // useSyncExternalStore y no useState+useEffect: deberiaCargarVideo() lee
  // window, en el servidor siempre da false, y ademas asi el video entra o
  // sale solo si cambia el tamano de pantalla o el ajuste de movimiento.
  const conVideo = useSyncExternalStore(
    suscribirEntorno,
    deberiaCargarVideo,
    () => false,
  );

  useEffect(() => {
    if (!conVideo) return;
    const video = videoRef.current;
    if (!video) return;

    if (video.readyState >= 1) {
      readyRef.current = true;
    } else {
      video.addEventListener(
        "loadedmetadata",
        () => {
          readyRef.current = true;
        },
        { once: true },
      );
    }

    const tick = () => {
      const distancia = targetY.current - smoothY.current;
      smoothY.current += distancia * 0.11;

      if (readyRef.current && video.duration > 0 && !video.seeking) {
        const maxScroll = Math.max(
          1,
          document.documentElement.scrollHeight - window.innerHeight,
        );
        const progreso = Math.min(smoothY.current / maxScroll, 1);
        const destino = progreso * video.duration;

        if (Math.abs(destino - video.currentTime) > UMBRAL_SEEK) {
          video.currentTime = destino;
        }
      }

      // El loop anterior corria para siempre y quemaba bateria aunque nadie
      // scrolleara. Ahora se apaga solo al llegar a destino y lo revive el
      // proximo scroll.
      if (Math.abs(distancia) < UMBRAL_REPOSO) {
        smoothY.current = targetY.current;
        rafRef.current = null;
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    const arrancar = () => {
      if (rafRef.current === null) rafRef.current = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      targetY.current = window.scrollY;
      arrancar();
    };

    const onVisibilidad = () => {
      if (document.hidden && rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibilidad);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibilidad);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [conVideo]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        overflow: "hidden",
        // Capa base: pinta al instante, cuesta 0 bytes y es el fondo
        // definitivo en movil y con reduced-motion.
        background:
          "radial-gradient(ellipse 90% 60% at 50% -10%, rgba(201,168,76,0.14), transparent 60%)," +
          "radial-gradient(ellipse 70% 50% at 85% 110%, rgba(201,168,76,0.07), transparent 55%)," +
          "#000",
      }}
    >
      {conVideo ? (
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
            opacity: OPACIDAD_VIDEO,
          }}
        >
          <source src="/assets/images/video/black-gold.mp4" type="video/mp4" />
        </video>
      ) : null}

      {/* Scrim: oscurece TODO, no solo los bordes. Es lo que devuelve el
          contraste al texto y a los botones que van encima. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.55) 35%, rgba(0,0,0,0.62) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 120% 80% at 50% 50%, transparent 25%, rgba(0,0,0,0.6) 100%)",
        }}
      />
    </div>
  );
}
