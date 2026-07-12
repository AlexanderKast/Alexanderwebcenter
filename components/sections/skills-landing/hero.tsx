"use client";

import Image from "next/image";
import { SkillsLeadForm } from "./skills-lead-form";

const TAGS = [
  "RECURSO GRATUITO",
  "9 PROTOCOLOS ACCIONABLES",
  "EN ESPAÑOL, LISTOS EN 5 MINUTOS",
];

const TITLE_LINES = [
  { text: "9 SKILLS PRO", gold: false, delay: 300 },
  { text: "PARA TU", gold: false, delay: 420 },
  { text: "INTELIGENCIA ARTIFICIAL", gold: true, delay: 540 },
];

export function SkillsHero() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "transparent",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background:
            "linear-gradient(135deg,rgba(0,0,0,0.82) 0%,rgba(0,0,0,0.42) 50%,rgba(0,0,0,0.68) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 1,
          background: "var(--gold-dim)",
          zIndex: 2,
        }}
      />

      <div
        className="skills-hero-grid"
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1400,
          margin: "0 auto",
          width: "100%",
          padding:
            "clamp(120px,16vw,180px) clamp(20px,4vw,60px) clamp(60px,8vw,100px)",
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: "clamp(40px,6vw,100px)",
          alignItems: "center",
        }}
      >
        {/* Izquierda */}
        <div>
          <ul
            style={{
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: 6,
              marginBottom: 36,
            }}
          >
            {TAGS.map((tag, i) => (
              <li
                key={tag}
                style={{
                  fontFamily: "var(--font-dm)",
                  fontSize: 11,
                  letterSpacing: "2.5px",
                  color: "var(--muted)",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  animation: `skills-slide-left 0.7s cubic-bezier(0.16,1,0.3,1) ${80 + i * 80}ms both`,
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: 20,
                    height: 1,
                    background: "var(--gold)",
                    flexShrink: 0,
                  }}
                />
                {tag}
              </li>
            ))}
          </ul>

          <h1
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(56px,7.5vw,104px)",
              lineHeight: 0.92,
              letterSpacing: "-2px",
              marginBottom: 40,
            }}
          >
            {TITLE_LINES.map(({ text, gold, delay }) => (
              <div key={text} style={{ overflow: "hidden", display: "block" }}>
                <div
                  style={{
                    color: gold ? "var(--gold)" : "#fff",
                    display: "block",
                    animation: `skills-curtain 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms both`,
                  }}
                >
                  {text}
                </div>
              </div>
            ))}
          </h1>

          <p
            style={{
              fontFamily: "var(--font-dm)",
              fontSize: "clamp(15px,1.6vw,18px)",
              lineHeight: 1.65,
              color: "var(--muted)",
              maxWidth: 480,
              animation: "skills-fade-up 0.9s cubic-bezier(0.16,1,0.3,1) 750ms both",
            }}
          >
            Los manuales de operación que convierten a cualquier modelo de IA en
            un colaborador con criterio senior. Gratis, en español, listos en 5
            minutos.
          </p>
        </div>

        {/* Derecha — tarjeta con el form */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            animation: "skills-slide-right 1s cubic-bezier(0.16,1,0.3,1) 400ms both",
          }}
        >
          <div
            style={{
              background: "rgba(10,10,10,0.82)",
              border: "1px solid var(--gold-dim)",
              padding: "clamp(32px,4vw,52px)",
              maxWidth: 420,
              width: "100%",
              backdropFilter: "blur(12px)",
            }}
          >
            <div style={{ marginBottom: 28 }}>
              <Image
                src="/logos/ac-mark-new.png"
                alt="Logo Alexander Cast"
                width={110}
                height={58}
                style={{ marginBottom: 20 }}
              />
              <p
                style={{
                  fontFamily: "var(--font-bebas)",
                  fontSize: 28,
                  letterSpacing: "1px",
                  color: "#fff",
                  lineHeight: 1.1,
                }}
              >
                DESCARGA EL PACK{" "}
                <span style={{ color: "var(--gold)" }}>GRATIS</span>
              </p>
            </div>
            <SkillsLeadForm idPrefix="hero" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes skills-curtain {
          from { transform: translateY(110%); }
          to   { transform: translateY(0); }
        }
        @keyframes skills-fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes skills-slide-left {
          from { opacity: 0; transform: translateX(-24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes skills-slide-right {
          from { opacity: 0; transform: translateX(32px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @media (max-width: 900px) {
          .skills-hero-grid { grid-template-columns: 1fr !important; }
          .skills-hero-grid > div:last-child { justify-content: flex-start !important; }
        }
      `}</style>
    </section>
  );
}

export function SkillsProofStrip() {
  const items = [
    "FUNCIONAN EN CLAUDE, CHATGPT Y GEMINI",
    "9 PROTOCOLOS ACCIONABLES",
    "GUÍA DE INSTALACIÓN INCLUIDA",
  ];
  return (
    <div
      style={{
        background: "rgba(10,10,10,0.72)",
        borderBottom: "1px solid var(--gold-dim)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "22px clamp(20px,4vw,60px)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 14,
        }}
      >
        {items.map((item) => (
          <span
            key={item}
            style={{
              fontFamily: "var(--font-dm)",
              fontSize: 11,
              letterSpacing: "2px",
              color: "var(--muted)",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 16,
                height: 1,
                background: "var(--gold)",
              }}
            />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
