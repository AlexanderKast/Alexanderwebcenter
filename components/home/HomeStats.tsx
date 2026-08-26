"use client";

import { useEffect, useRef, useState } from "react";
import { useReveal } from "@/hooks/useReveal";

function useCounter(target: number, active: boolean) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let current = 0;
    const step = target / 60;
    const id = setInterval(() => {
      current = Math.min(current + step, target);
      setVal(Math.floor(current));
      if (current >= target) clearInterval(id);
    }, 18);
    return () => clearInterval(id);
  }, [active, target]);
  return val;
}

const STATS = [
  { num: 6,    suffix: "+",  label: "AÑOS EN\nNEGOCIOS DIGITALES" },
  { num: 4,    suffix: "",   label: "PAÍSES DE\nOPERACIÓN" },
  { num: 100,  suffix: "+",  label: "CLIENTES\nY ALUMNOS" },
  { num: null, suffix: "",   label: "METODOLOGÍA 2025", special: "AI" },
];

export function HomeStats() {
  const { ref, visible } = useReveal<HTMLDivElement>(0.2);

  const c0 = useCounter(6,   visible);
  const c1 = useCounter(4,   visible);
  const c2 = useCounter(100, visible);
  const counters = [c0, c1, c2];

  return (
    <div
      ref={ref}
      style={{
        background: "rgba(10,10,10,0.72)",
        borderTop: "1px solid var(--gold-dim)",
        borderBottom: "1px solid var(--gold-dim)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        style={{
          maxWidth: 1400, margin: "0 auto",
          padding: "0 clamp(20px,4vw,60px)",
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
        }}
        className="stats-grid"
      >
        {STATS.map((s, i) => (
          <div
            key={i}
            style={{
              padding: "clamp(36px,5vw,56px) clamp(20px,3vw,40px)",
              borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none",
              display: "flex", flexDirection: "column", gap: 12,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(24px)",
              transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 110}ms,
                           transform 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 110}ms`,
            }}
          >
            {/* Número */}
            <div style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(52px,6vw,80px)",
              letterSpacing: "-2px",
              lineHeight: 1,
              color: s.special ? "var(--gold)" : "#fff",
            }}>
              {s.special
                ? <span style={{ color: "var(--gold)" }}>AI</span>
                : <>{counters[i]}{s.suffix}</>
              }
            </div>

            {/* Label */}
            <div style={{
              fontFamily: "var(--font-dm)",
              fontSize: 12, letterSpacing: "1.8px",
              color: "var(--muted)",
              whiteSpace: "pre-line",
              lineHeight: 1.6,
            }}>
              {s.label}
            </div>

            {/* Línea dorada animada */}
            <div style={{
              height: 2, background: "var(--gold)",
              marginTop: 4,
              width: visible ? 32 : 0,
              transition: `width 0.6s cubic-bezier(0.16,1,0.3,1) ${200 + i * 110}ms`,
            }} />
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 700px) {
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
    </div>
  );
}
