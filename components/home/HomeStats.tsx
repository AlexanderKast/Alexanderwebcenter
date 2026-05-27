"use client";

import { useEffect, useRef, useState } from "react";

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
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setActive(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const c0 = useCounter(6, active);
  const c1 = useCounter(4, active);
  const c2 = useCounter(100, active);

  const counters = [c0, c1, c2];

  return (
    <div ref={ref} style={{
      background: "rgba(10,10,10,0.72)",
      borderTop: "1px solid var(--gold-dim)",
      borderBottom: "1px solid var(--gold-dim)",
      backdropFilter: "blur(4px)",
    }}>
      <div style={{
        maxWidth: 1400, margin: "0 auto",
        padding: "0 clamp(20px,4vw,60px)",
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
      }} className="stats-grid">
        {STATS.map((s, i) => (
          <div key={i} style={{
            padding: "clamp(36px,5vw,56px) clamp(20px,3vw,40px)",
            borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none",
            display: "flex", flexDirection: "column", gap: 12,
          }}>
            {/* Big number */}
            <div style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(52px,6vw,80px)",
              letterSpacing: "-2px",
              lineHeight: 1,
              color: s.special ? "var(--gold)" : "#fff",
            }}>
              {s.special
                ? <><span style={{ color: "var(--gold)" }}>AI</span></>
                : <>{counters[i]}{s.suffix}</>
              }
            </div>

            {/* Label */}
            <div style={{
              fontFamily: "var(--font-dm)",
              fontSize: 11, letterSpacing: "2px",
              color: "var(--muted)",
              whiteSpace: "pre-line",
              lineHeight: 1.6,
            }}>
              {s.label}
            </div>

            {/* Gold line */}
            <div style={{
              width: 32, height: 2,
              background: "var(--gold)",
              marginTop: 4,
            }}/>
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
