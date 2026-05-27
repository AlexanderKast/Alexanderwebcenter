"use client";

import { useReveal } from "@/hooks/useReveal";

const STEPS = [
  {
    n: "01",
    title: "DIAGNÓSTICO",
    body: "Analizo tu situación actual, tus recursos y tus objetivos. Sin suposiciones: un mapa real de dónde estás y a dónde puedes llegar con lo que tienes.",
  },
  {
    n: "02",
    title: "DISEÑO DEL SISTEMA",
    body: "Construimos tu hoja de ruta personalizada: qué canales, qué contenido, qué herramientas IA y qué procesos necesitas para crecer sin depender de la suerte.",
  },
  {
    n: "03",
    title: "ACTIVACIÓN Y ESCALA",
    body: "Implementamos, medimos y optimizamos. El sistema trabaja para ti — tú te enfocas en lo que solo tú puedes hacer.",
  },
];

export function HomeProcess() {
  const { ref: secRef, visible: secVisible } = useReveal<HTMLElement>(0.1);

  return (
    <section
      ref={secRef}
      style={{
        background: "rgba(10,10,10,0.75)",
        backdropFilter: "blur(3px)",
        borderTop: "1px solid var(--gold-dim)",
      }}
    >
      <div style={{
        maxWidth: 1400, margin: "0 auto",
        padding: "clamp(60px,8vw,100px) clamp(20px,4vw,60px)",
      }}>

        {/* Header */}
        <div style={{ marginBottom: "clamp(48px,6vw,80px)" }}>
          <div style={{
            fontFamily: "var(--font-dm)",
            fontSize: 11, letterSpacing: "3px",
            color: "var(--gold)", marginBottom: 16,
            opacity: secVisible ? 1 : 0,
            transform: secVisible ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}>
            CÓMO TRABAJO
          </div>
          <div style={{ overflow: "hidden" }}>
            <h2 style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(52px,6vw,80px)",
              letterSpacing: "-1px", color: "#fff", lineHeight: 1,
              opacity: secVisible ? 1 : 0,
              transform: secVisible ? "translateY(0)" : "translateY(100%)",
              transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1) 80ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) 80ms",
            }}>
              EL PROCESO
            </h2>
          </div>
        </div>

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: "clamp(20px,3vw,40px)",
          }}
          className="process-grid"
        >
          {STEPS.map((s, i) => (
            <div
              key={s.n}
              style={{
                position: "relative",
                background: "rgba(17,17,17,0.9)",
                border: "1px solid rgba(255,255,255,0.06)",
                padding: "clamp(32px,4vw,52px)",
                overflow: "hidden",
                opacity: secVisible ? 1 : 0,
                transform: secVisible ? "translateY(0)" : "translateY(36px)",
                transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${160 + i * 120}ms,
                             transform 0.7s cubic-bezier(0.16,1,0.3,1) ${160 + i * 120}ms`,
              }}
            >
              {/* Número decorativo de fondo */}
              <div style={{
                position: "absolute",
                top: -20, right: 16,
                fontFamily: "var(--font-bebas)",
                fontSize: "clamp(100px,12vw,160px)",
                lineHeight: 1,
                color: "rgba(255,255,255,0.03)",
                userSelect: "none",
                pointerEvents: "none",
              }}>
                {s.n}
              </div>

              {/* Línea dorada top — se extiende con el reveal */}
              <div style={{
                width: secVisible ? 40 : 0,
                height: 2,
                background: "var(--gold)",
                marginBottom: 28,
                transition: `width 0.5s cubic-bezier(0.16,1,0.3,1) ${300 + i * 120}ms`,
              }} />

              {/* Step label */}
              <div style={{
                fontFamily: "var(--font-dm)",
                fontSize: 11, letterSpacing: "3px",
                color: "var(--gold)", marginBottom: 16,
              }}>
                PASO {s.n}
              </div>

              {/* Título */}
              <h3 style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "clamp(28px,3vw,40px)",
                letterSpacing: "-0.5px",
                color: "#fff", marginBottom: 20, lineHeight: 1,
              }}>
                {s.title}
              </h3>

              {/* Cuerpo */}
              <p style={{
                fontFamily: "var(--font-dm)",
                fontSize: 15, lineHeight: 1.7,
                color: "var(--muted)",
              }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .process-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .process-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
    </section>
  );
}
