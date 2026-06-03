"use client";

import { useState } from "react";
import { useReveal } from "@/hooks/useReveal";

const TESTIMONIOS = [
  {
    quote:
      "Alexander no te da un curso genérico. Analizó mi negocio específico, identificó exactamente dónde estaba perdiendo tiempo y dinero, y me dio un sistema que funciona sin que yo esté pendiente todo el día.",
    name: "Marcela R.",
    role: "Fundadora, ecommerce de moda — Bogotá",
    service: "Paquete Growth",
  },
  {
    quote:
      "Lo que más me sorprendió fue que Alexander realmente usa las herramientas que recomienda. No es teoría. Kreoon lo vi funcionando en vivo y entendí por qué vale la inversión. En 3 semanas ya tenía mi sistema editorial automatizado.",
    name: "Diego M.",
    role: "Consultor de marketing — Medellín",
    service: "Consultoría IA + Kreoon",
  },
  {
    quote:
      "Implementamos live shopping para nuestra marca y en el primer mes triplicamos las ventas de ese canal. Alexander conoce el sistema de adentro hacia afuera porque lo construyó con sus propios negocios.",
    name: "Valentina C.",
    role: "Directora de marca, retail LATAM",
    service: "Setup Live Shopping",
  },
];

export function HomeTestimonios() {
  const [active, setActive] = useState(0);
  const { ref, visible } = useReveal<HTMLElement>(0.1);

  const t = TESTIMONIOS[active];

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        background: "rgba(0,0,0,0.80)",
        backdropFilter: "blur(3px)",
        borderTop: "1px solid var(--gold-dim)",
        overflow: "hidden",
      }}
    >
      {/* Decorative large quote mark */}
      <div style={{
        position: "absolute",
        top: -20, right: 60,
        fontFamily: "var(--font-bebas)",
        fontSize: "clamp(200px,22vw,320px)",
        lineHeight: 1,
        color: "rgba(201,168,76,0.04)",
        userSelect: "none",
        pointerEvents: "none",
      }}>
        "
      </div>

      <div style={{
        maxWidth: 1400, margin: "0 auto",
        padding: "clamp(60px,8vw,100px) clamp(20px,4vw,60px)",
        position: "relative", zIndex: 1,
      }}>

        {/* Header */}
        <div style={{ marginBottom: "clamp(40px,5vw,64px)" }}>
          <div style={{
            fontFamily: "var(--font-dm)",
            fontSize: 11, letterSpacing: "3px",
            color: "var(--gold)", marginBottom: 16,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}>
            LO QUE DICEN
          </div>
          <div style={{ overflow: "hidden" }}>
            <h2 style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(52px,6vw,80px)",
              letterSpacing: "-1px", color: "#fff", lineHeight: 1,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(100%)",
              transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1) 80ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) 80ms",
            }}>
              RESULTADOS REALES
            </h2>
          </div>
        </div>

        {/* Main testimonial */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "clamp(32px,5vw,80px)",
          alignItems: "center",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.8s ease 200ms, transform 0.8s ease 200ms",
        }}
        className="testimonial-grid"
        >
          {/* Quote */}
          <div>
            {/* Stars */}
            <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
              {[1,2,3,4,5].map(s => (
                <span key={s} style={{ color: "var(--gold)", fontSize: 14 }}>★</span>
              ))}
            </div>

            <blockquote style={{
              fontFamily: "var(--font-dm)",
              fontSize: "clamp(18px,2.2vw,26px)",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.88)",
              fontStyle: "normal",
              fontWeight: 300,
              marginBottom: 40,
            }}>
              "{t.quote}"
            </blockquote>

            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {/* Avatar initials */}
              <div style={{
                width: 44, height: 44,
                background: "var(--gold-dim)",
                border: "1px solid var(--gold-dim)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <span style={{
                  fontFamily: "var(--font-bebas)",
                  fontSize: 16, color: "var(--gold)",
                }}>
                  {t.name.split(" ").map(n => n[0]).join("").slice(0,2)}
                </span>
              </div>

              <div>
                <div style={{
                  fontFamily: "var(--font-bebas)",
                  fontSize: 18, letterSpacing: "1px",
                  color: "#fff",
                }}>
                  {t.name}
                </div>
                <div style={{
                  fontFamily: "var(--font-dm)",
                  fontSize: 12, color: "var(--muted2)",
                  marginTop: 2,
                }}>
                  {t.role}
                </div>
              </div>

              <div style={{
                marginLeft: "auto",
                fontFamily: "var(--font-dm)",
                fontSize: 10, letterSpacing: "2px",
                color: "var(--gold)",
                border: "1px solid var(--gold-dim)",
                padding: "4px 10px",
                whiteSpace: "nowrap",
              }}>
                {t.service}
              </div>
            </div>
          </div>

          {/* Navigation dots */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            alignSelf: "center",
          }}>
            {TESTIMONIOS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Ver testimonio ${i + 1} de ${TESTIMONIOS.length}`}
                aria-pressed={active === i}
                style={{
                  width: 40, height: 40,
                  background: active === i ? "var(--gold)" : "transparent",
                  border: `1px solid ${active === i ? "var(--gold)" : "rgba(255,255,255,0.15)"}`,
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all .25s ease",
                  fontFamily: "var(--font-bebas)",
                  fontSize: 13,
                  color: active === i ? "#000" : "var(--muted2)",
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom strip: numbers */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 1,
          background: "rgba(255,255,255,0.04)",
          marginTop: "clamp(48px,6vw,80px)",
        }}
        className="proof-grid"
        >
          {[
            { n: "$4,500",  label: "Paquete Scale — máxima inversión" },
            { n: "LATAM",   label: "CO, EC, RD, PE — experiencia regional" },
            { n: "AI-FIRST",label: "Sistemas que trabajan sin ti" },
          ].map((item, i) => (
            <div key={i} style={{
              background: "rgba(5,5,5,0.95)",
              padding: "clamp(24px,3vw,40px)",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: `opacity 0.6s ease ${400 + i * 100}ms, transform 0.6s ease ${400 + i * 100}ms`,
            }}>
              <div style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "clamp(28px,3vw,42px)",
                letterSpacing: "-0.5px",
                color: "var(--gold)", lineHeight: 1,
                marginBottom: 8,
              }}>
                {item.n}
              </div>
              <div style={{
                fontFamily: "var(--font-dm)",
                fontSize: 13, color: "var(--muted2)",
              }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .testimonial-grid { grid-template-columns: 1fr !important; }
          .testimonial-grid > div:last-child { flex-direction: row !important; justify-content: center; }
          .proof-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
