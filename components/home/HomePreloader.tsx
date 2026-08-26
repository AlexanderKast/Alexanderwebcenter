"use client";

import { useEffect, useState } from "react";

const SPLASH_KEY = "ac-splash-shown";

export function HomePreloader() {
  // Estado inicial IGUAL en servidor y cliente (0) — evita hydration mismatch.
  // sessionStorage solo se lee dentro del efecto, después del montaje.
  const [phase, setPhase] = useState<0 | 1 | 2>(0); // 0 visible · 1 saliendo · 2 eliminado

  useEffect(() => {
    if (sessionStorage.getItem(SPLASH_KEY) === "1") {
      setPhase(2);
      return;
    }

    // Bloquear scroll mientras carga
    document.documentElement.style.overflow = "hidden";

    const t1 = setTimeout(() => setPhase(1), 2400);
    const t2 = setTimeout(() => {
      setPhase(2);
      document.documentElement.style.overflow = "";
      sessionStorage.setItem(SPLASH_KEY, "1");
    }, 3050);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (phase === 2) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
        opacity: phase === 1 ? 0 : 1,
        transform: phase === 1 ? "scale(1.04)" : "scale(1)",
        transition: "opacity 0.6s cubic-bezier(0.4,0,0.2,1), transform 0.6s cubic-bezier(0.4,0,0.2,1)",
        pointerEvents: "none",
      }}
    >
      {/* Logo */}
      <div style={{
        fontFamily: "var(--font-bebas)",
        fontSize: "clamp(40px,7vw,88px)",
        letterSpacing: "clamp(8px,2vw,22px)",
        color: "#fff",
        animation: "pl-rise 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s both",
      }}>
        ALEXANDER
      </div>

      {/* Subtítulo */}
      <div style={{
        fontFamily: "var(--font-dm)",
        fontSize: 12, letterSpacing: "1.8px",
        color: "var(--texto-tenue)",
        textTransform: "uppercase",
        animation: "pl-rise 0.9s cubic-bezier(0.16,1,0.3,1) 0.35s both",
      }}>
        ESTRATEGIA · CONTENIDO · INTELIGENCIA ARTIFICIAL
      </div>

      {/* Barra de progreso */}
      <div style={{
        position: "relative",
        width: "clamp(140px,18vw,220px)",
        height: 1,
        background: "rgba(255,255,255,0.08)",
        overflow: "hidden",
        animation: "pl-rise 0.5s ease 0.05s both",
      }}>
        {/* Línea dorada que llena */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "var(--gold)",
          transformOrigin: "left center",
          animation: "pl-fill 2.3s cubic-bezier(0.4,0,0.2,1) 0.3s forwards",
          transform: "scaleX(0)",
        }} />
      </div>

      {/* Punto parpadeante */}
      <div style={{
        width: 4, height: 4,
        borderRadius: "50%",
        background: "var(--gold)",
        animation: "pl-pulse 1s ease infinite, pl-rise 0.5s ease 0.6s both",
      }} />

      <style>{`
        @keyframes pl-rise {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pl-fill {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes pl-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.6); }
        }
      `}</style>
    </div>
  );
}
