"use client";

import { useState } from "react";
import { useReveal } from "@/hooks/useReveal";

const RECURSOS = [
  {
    emoji: "📄",
    title: "UGC Colombia — Estrategia de Contenido 2026",
    desc: "El PDF completo que uso con nuestros clientes de agencia. Estructura, formatos, métricas y el sistema editorial que funciona para marcas en LATAM.",
    type: "PDF GRATUITO",
    cta: "DESCARGAR GRATIS",
    href: "/assets/pdfs/UGC-Colombia-Estrategia-Contenido-2026.pdf",
    featured: true,
  },
  {
    emoji: "🤖",
    title: "Kreoon — Marketplace de Creadores con IA",
    desc: "Estrategia, producción y operación corren con IA. Los creadores son reales — lo construí porque no existía nada así en español.",
    type: "MARKETPLACE",
    cta: "CONOCER KREOON",
    href: "https://kreoon.com",
    featured: false,
  },
];

export function HomeRecursos() {
  const [email, setEmail] = useState("");
  const [sent, setSent]   = useState(false);
  const { ref: secRef, visible: secVisible } = useReveal<HTMLElement>(0.08);
  const { ref: formRef, visible: formVisible } = useReveal<HTMLDivElement>(0.1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    /* Aquí conectar Formspree / n8n webhook */
    setSent(true);
  };

  return (
    <section
      id="recursos"
      ref={secRef}
      style={{
        position: "relative",
        background: "rgba(8,8,8,0.84)",
        backdropFilter: "blur(3px)",
        borderTop: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div style={{
        maxWidth: 1400, margin: "0 auto",
        padding: "clamp(60px,8vw,100px) clamp(20px,4vw,60px)",
      }}>

        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "clamp(48px,6vw,80px)",
          flexWrap: "wrap",
          gap: 24,
        }}>
          <div>
            <div style={{
              fontFamily: "var(--font-dm)",
              fontSize: 12, letterSpacing: "1.8px",
              color: "var(--gold)", marginBottom: 16,
              opacity: secVisible ? 1 : 0,
              transform: secVisible ? "translateY(0)" : "translateY(14px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}>
              VALOR GRATUITO
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
                RECURSOS
              </h2>
            </div>
          </div>
        </div>

        {/* Cards grid */}
        <div
          className="recursos-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: "clamp(16px,2vw,28px)",
            marginBottom: "clamp(48px,6vw,80px)",
          }}
        >
          {RECURSOS.map((r, i) => (
            <a
              key={r.title}
              href={r.href}
              target={r.href.startsWith("http") ? "_blank" : "_self"}
              rel="noopener noreferrer"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 20,
                background: r.featured ? "rgba(201,168,76,0.06)" : "rgba(17,17,17,0.9)",
                border: `1px solid ${r.featured ? "var(--gold-dim)" : "rgba(255,255,255,0.06)"}`,
                padding: "clamp(28px,3vw,44px)",
                position: "relative",
                overflow: "hidden",
                opacity: secVisible ? 1 : 0,
                transform: secVisible ? "translateY(0)" : "translateY(28px)",
                transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${200 + i * 100}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${200 + i * 100}ms`,
                textDecoration: "none",
                cursor: "pointer",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--gold)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = r.featured ? "var(--gold-dim)" : "rgba(255,255,255,0.06)";
              }}
            >
              {/* Gold line top */}
              {r.featured && (
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0,
                  height: 2, background: "var(--gold)",
                }} />
              )}

              <div style={{ fontSize: "clamp(28px,3vw,40px)" }}>{r.emoji}</div>

              <div style={{
                fontFamily: "var(--font-dm)",
                fontSize: 12, letterSpacing: "1.8px",
                color: "var(--gold)",
              }}>
                {r.type}
              </div>

              <h3 style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "clamp(20px,2.2vw,28px)",
                letterSpacing: "0.5px",
                color: "#fff", lineHeight: 1.2,
              }}>
                {r.title}
              </h3>

              <p style={{
                fontFamily: "var(--font-dm)",
                fontSize: 14, lineHeight: 1.65,
                color: "var(--muted)",
                flex: 1,
              }}>
                {r.desc}
              </p>

              <div style={{
                fontFamily: "var(--font-bebas)",
                fontSize: 13, letterSpacing: "2px",
                color: "var(--gold)",
                display: "flex", alignItems: "center", gap: 8,
                marginTop: "auto",
              }}>
                {r.cta} ↗
              </div>
            </a>
          ))}
        </div>

        {/* Email capture */}
        <div
          ref={formRef}
          style={{
            background: "rgba(17,17,17,0.9)",
            border: "1px solid rgba(255,255,255,0.06)",
            padding: "clamp(32px,4vw,52px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 32,
            flexWrap: "wrap",
            opacity: formVisible ? 1 : 0,
            transform: formVisible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <div>
            <div style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(24px,2.5vw,36px)",
              letterSpacing: "-0.5px",
              color: "#fff", marginBottom: 8,
            }}>
              Estrategia semanal directo a tu correo
            </div>
            <p style={{
              fontFamily: "var(--font-dm)",
              fontSize: 14, color: "var(--muted)",
            }}>
              Tips de IA, contenido y negocios digitales. Sin spam. Solo lo que uso yo.
            </p>
          </div>

          {sent ? (
            <div style={{
              fontFamily: "var(--font-bebas)",
              fontSize: 18, letterSpacing: "1px",
              color: "var(--gold)",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              ✓ LISTO — REVISA TU CORREO
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                gap: 0,
                flexShrink: 0,
              }}
            >
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                required
                style={{
                  fontFamily: "var(--font-dm)",
                  fontSize: 14,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRight: "none",
                  color: "#fff",
                  padding: "14px 20px",
                  outline: "none",
                  width: 240,
                }}
              />
              <button
                type="submit"
                style={{
                  fontFamily: "var(--font-bebas)",
                  fontSize: 13, letterSpacing: "2px",
                  background: "var(--gold)",
                  color: "#000",
                  border: "none",
                  padding: "14px 28px",
                  cursor: "pointer",
                  transition: "opacity .2s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >
                SUSCRIBIRME →
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .recursos-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .recursos-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  );
}
