"use client";

import { useState } from "react";
import { useReveal } from "@/hooks/useReveal";

const STACK = [
  {
    cat: "INTELIGENCIA ARTIFICIAL",
    tools: [
      { name: "Kreoon",      desc: "Mi marketplace de creadores. Estrategia, contenido y operación con IA; creadores reales.", link: "https://kreoon.com" },
      { name: "Claude",      desc: "Para razonamiento profundo, código y redacción de alto nivel.", link: "#" },
      { name: "Gemini",      desc: "Generación de imágenes y video (Veo 3). Integrado en Kreoon.", link: "#" },
      { name: "Perplexity",  desc: "Research en tiempo real. Siempre con fuentes verificadas.", link: "#" },
      { name: "ChatGPT",     desc: "Primer punto de exploración y brainstorming rápido.", link: "#" },
    ],
  },
  {
    cat: "AUTOMATIZACIÓN",
    tools: [
      { name: "n8n",          desc: "Orquestador de flujos. Todo mi backend de automatizaciones.", link: "#" },
      { name: "Jarvis v2",    desc: "Mi agente IA personal en WhatsApp — construido sobre n8n.", link: "#" },
      { name: "Make",         desc: "Automatizaciones más simples o con herramientas legacy.", link: "#" },
    ],
  },
  {
    cat: "CONTENIDO & VIDEO",
    tools: [
      { name: "Remotion",     desc: "Videos programáticos en React. Para series y contenido escalado.", link: "#" },
      { name: "ElevenLabs",   desc: "Voz 'Cristian Sanchez' para voiceover en español natural.", link: "#" },
      { name: "CapCut",       desc: "Edición rápida para Reels y TikToks.", link: "#" },
      { name: "Canva",        desc: "Carruseles, diseño de posts y kits de marca.", link: "#" },
    ],
  },
  {
    cat: "NEGOCIOS & INFRAESTRUCTURA",
    tools: [
      { name: "Supabase",     desc: "Base de datos de todos mis proyectos.", link: "#" },
      { name: "Vercel",       desc: "Deploy de Kreoon y portafolios.", link: "#" },
      { name: "Pancake",      desc: "Stack de live shopping (Botcake + Webcake + Postcake).", link: "#" },
      { name: "WhatsApp API", desc: "Canal principal de ventas y soporte — integrado con n8n.", link: "#" },
    ],
  },
];

const DOWNLOADS = [
  {
    tag: "PDF GRATUITO",
    emoji: "📄",
    title: "UGC Colombia — Estrategia de Contenido 2026",
    subtitle: "El sistema editorial que uso con mis clientes de agencia",
    desc: "Formato, frecuencia, hooks, métricas y el workflow completo para producir contenido UGC que convierte en Meta Ads y TikTok Ads.",
    pages: "28 páginas",
    href: "/assets/pdfs/UGC-Colombia-Estrategia-Contenido-2026.pdf",
    featured: true,
  },
  {
    tag: "MARKETPLACE",
    emoji: "🤖",
    title: "Kreoon",
    subtitle: "Marketplace de creadores + agencia 360 con IA",
    desc: "Estrategia, producción y operación corren con IA. Los creadores son reales. Lo construí porque no existía en español.",
    pages: "Prueba gratuita",
    href: "https://kreoon.com",
    featured: false,
  },
];

export function RecursosContent() {
  const [email, setEmail]   = useState("");
  const [sent, setSent]     = useState(false);
  const { ref: dlRef,    visible: dlVisible    } = useReveal<HTMLDivElement>(0.05);
  const { ref: stackRef, visible: stackVisible } = useReveal<HTMLDivElement>(0.05);
  const { ref: nlRef,    visible: nlVisible    } = useReveal<HTMLDivElement>(0.08);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    /* 🔧 Conectar con Formspree o n8n webhook */
    setSent(true);
  };

  return (
    <>
      {/* ── Descargas ── */}
      <section style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(3px)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(60px,8vw,100px) clamp(20px,4vw,60px)" }}>
          <div ref={dlRef}>
            <div style={{
              fontFamily: "var(--font-dm)", fontSize: 11, letterSpacing: "3px",
              color: "var(--gold)", marginBottom: 16,
              opacity: dlVisible ? 1 : 0, transition: "opacity 0.6s ease",
            }}>
              RECURSOS GRATUITOS
            </div>
            <h2 style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(40px,5vw,68px)",
              letterSpacing: "-1px", color: "#fff", lineHeight: 1,
              marginBottom: "clamp(32px,4vw,52px)",
              opacity: dlVisible ? 1 : 0,
              transform: dlVisible ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 0.7s ease 80ms, transform 0.7s ease 80ms",
            }}>
              DESCARGAS & HERRAMIENTAS
            </h2>

            <div className="dl-grid" style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr",
              gap: "clamp(12px,1.5vw,20px)",
              alignItems: "start",
            }}>
              {DOWNLOADS.map((d, i) => (
                <a
                  key={d.title}
                  href={d.href}
                  target={d.href.startsWith("http") ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  style={{
                    display: "flex", flexDirection: "column", gap: 16,
                    background: d.featured ? "rgba(201,168,76,0.06)" : "rgba(12,12,12,0.95)",
                    border: `1px solid ${d.featured ? "var(--gold)" : "rgba(255,255,255,0.07)"}`,
                    padding: "clamp(24px,3vw,40px)",
                    position: "relative", overflow: "hidden",
                    opacity: dlVisible ? 1 : 0,
                    transform: dlVisible ? "translateY(0)" : "translateY(24px)",
                    transition: `opacity 0.7s ease ${200 + i * 100}ms, transform 0.7s ease ${200 + i * 100}ms`,
                    cursor: "pointer",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--gold)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = d.featured ? "var(--gold)" : "rgba(255,255,255,0.07)")}
                >
                  {d.featured && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "var(--gold)" }} />}
                  <div style={{ fontSize: "clamp(28px,3vw,36px)" }}>{d.emoji}</div>
                  <div style={{ fontFamily: "var(--font-dm)", fontSize: 10, letterSpacing: "2px", color: "var(--gold)" }}>{d.tag}</div>
                  <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(20px,2vw,28px)", letterSpacing: "0.5px", color: "#fff", lineHeight: 1.2 }}>{d.title}</h3>
                  <div style={{ fontFamily: "var(--font-dm)", fontSize: 12, color: "var(--texto-tenue)" }}>{d.subtitle}</div>
                  <p style={{ fontFamily: "var(--font-dm)", fontSize: 13, lineHeight: 1.65, color: "var(--texto-suave)", flex: 1 }}>{d.desc}</p>
                  <div style={{ fontFamily: "var(--font-dm)", fontSize: 11, color: "var(--texto-tenue)", marginTop: "auto" }}>{d.pages}</div>
                  <div style={{ fontFamily: "var(--font-bebas)", fontSize: 13, letterSpacing: "2px", color: "var(--gold)", display: "flex", alignItems: "center", gap: 6 }}>
                    {d.featured ? "DESCARGAR GRATIS" : "ACCEDER"} ↗
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stack ── */}
      <section style={{ background: "rgba(5,5,5,0.88)", backdropFilter: "blur(3px)", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(60px,8vw,100px) clamp(20px,4vw,60px)" }}>
          <div ref={stackRef}>
            <div style={{
              fontFamily: "var(--font-dm)", fontSize: 11, letterSpacing: "3px",
              color: "var(--gold)", marginBottom: 16,
              opacity: stackVisible ? 1 : 0, transition: "opacity 0.6s ease",
            }}>
              LO QUE USO YO
            </div>
            <h2 style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(40px,5vw,68px)",
              letterSpacing: "-1px", color: "#fff", lineHeight: 1,
              marginBottom: "clamp(40px,5vw,64px)",
              opacity: stackVisible ? 1 : 0,
              transform: stackVisible ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 0.7s ease 80ms, transform 0.7s ease 80ms",
            }}>
              MI STACK AI-FIRST
            </h2>

            <div className="stack-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "clamp(24px,3vw,40px)" }}>
              {STACK.map((cat, ci) => (
                <div key={cat.cat} style={{
                  opacity: stackVisible ? 1 : 0,
                  transform: stackVisible ? "translateY(0)" : "translateY(24px)",
                  transition: `opacity 0.7s ease ${ci * 100}ms, transform 0.7s ease ${ci * 100}ms`,
                }}>
                  <div style={{
                    fontFamily: "var(--font-bebas)", fontSize: 13, letterSpacing: "2px",
                    color: "var(--gold)", marginBottom: 16,
                    borderBottom: "1px solid var(--gold-dim)", paddingBottom: 10,
                  }}>
                    {cat.cat}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {cat.tools.map(tool => (
                      <div key={tool.name} style={{
                        display: "grid", gridTemplateColumns: "120px 1fr",
                        gap: 16, alignItems: "start",
                        padding: "12px 0",
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                      }}>
                        <div style={{ fontFamily: "var(--font-bebas)", fontSize: 15, letterSpacing: "1px", color: "#fff" }}>
                          {tool.name}
                        </div>
                        <div style={{ fontFamily: "var(--font-dm)", fontSize: 13, lineHeight: 1.6, color: "var(--texto-tenue)" }}>
                          {tool.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(4px)", borderTop: "1px solid var(--gold-dim)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(60px,8vw,100px) clamp(20px,4vw,60px)" }}>
          <div
            ref={nlRef}
            style={{
              display: "flex", alignItems: "center",
              justifyContent: "space-between", gap: 40, flexWrap: "wrap",
              opacity: nlVisible ? 1 : 0,
              transform: nlVisible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
          >
            <div>
              <h2 style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "clamp(32px,4vw,52px)",
                letterSpacing: "-0.5px", color: "#fff", lineHeight: 1, marginBottom: 10,
              }}>
                ESTRATEGIA SEMANAL EN TU CORREO
              </h2>
              <p style={{ fontFamily: "var(--font-dm)", fontSize: 14, color: "var(--texto-suave)", maxWidth: 440 }}>
                Tips de IA, contenido y negocios digitales. Solo lo que uso yo. Sin spam.
              </p>
            </div>
            {sent ? (
              <div style={{ fontFamily: "var(--font-bebas)", fontSize: 18, letterSpacing: "1px", color: "var(--gold)" }}>
                ✓ LISTO — REVISA TU CORREO
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", gap: 0, flexShrink: 0 }}>
                <input
                  type="email" value={email} required
                  onChange={e => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  style={{
                    fontFamily: "var(--font-dm)", fontSize: 14,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)", borderRight: "none",
                    color: "#fff", padding: "14px 20px", outline: "none", width: 260,
                  }}
                />
                <button type="submit" style={{
                  fontFamily: "var(--font-bebas)", fontSize: 13, letterSpacing: "2px",
                  background: "var(--gold)", color: "#000", border: "none",
                  padding: "14px 28px", cursor: "pointer",
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = ".85")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >
                  SUSCRIBIRME →
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .dl-grid    { grid-template-columns: 1fr 1fr !important; }
          .stack-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .dl-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
