"use client";

import { useState } from "react";
import { useReveal } from "@/hooks/useReveal";

const PLATFORMS = [
  { name: "Spotify",       color: "#1DB954", icon: "🎧", href: "#", soon: false },
  { name: "Apple Podcasts",color: "#FC3C44", icon: "🎙️", href: "#", soon: false },
  { name: "YouTube",       color: "#FF0000", icon: "▶️", href: "#", soon: false },
  { name: "Amazon Music",  color: "#00A8E0", icon: "📻", href: "#", soon: true  },
];

const FEATURED = {
  ep: "EP. 12",
  title: "De cero a $30K MRR: cómo construí Kreoon sin inversión",
  guest: "Solo — Alexander Cast",
  duration: "52 min",
  date: "Mayo 2026",
  desc: "El relato sin filtros de cómo nació Kreoon: el problema que quería resolver, los primeros 10 usuarios, los errores de pricing, y qué haría diferente si empezara hoy.",
  topics: ["Bootstrap sin inversión", "Pricing en LATAM", "Producto vs Mercado", "IA Aplicada"],
  href: "#",
};

const EPISODES = [
  {
    ep: "EP. 11",
    title: "UGC como activo de marca — más allá de los views",
    guest: "Diana Mile — UGC Colombia",
    duration: "44 min",
    date: "Abr 2026",
    href: "#",
  },
  {
    ep: "EP. 09",
    title: "Automatización sin código: workflows que ahorran 20h/semana",
    guest: "Solo — Alexander Cast",
    duration: "38 min",
    date: "Mar 2026",
    href: "#",
  },
  {
    ep: "EP. 08",
    title: "Mentalidad de constructor: por qué la mayoría abandona",
    guest: "Mauricio Cuevas — Grupo Effi",
    duration: "55 min",
    date: "Mar 2026",
    href: "#",
  },
  {
    ep: "EP. 07",
    title: "Meta Ads en 2026: lo que realmente funciona",
    guest: "Invitado especial",
    duration: "49 min",
    date: "Feb 2026",
    href: "#",
  },
  {
    ep: "EP. 06",
    title: "Construir en público: ventajas, riesgos y aprendizajes",
    guest: "Solo — Alexander Cast",
    duration: "33 min",
    date: "Feb 2026",
    href: "#",
  },
];

const STATS = [
  { value: "12+",    label: "Episodios" },
  { value: "8",      label: "Invitados" },
  { value: "LATAM",  label: "Audiencia" },
  { value: "Semanal",label: "Frecuencia" },
];

export function PodcastContent() {
  const [email, setEmail] = useState("");
  const [sent, setSent]   = useState(false);

  const { ref: heroRef,    visible: heroVisible    } = useReveal<HTMLDivElement>(0.05);
  const { ref: featRef,    visible: featVisible    } = useReveal<HTMLDivElement>(0.05);
  const { ref: listRef,    visible: listVisible    } = useReveal<HTMLDivElement>(0.05);
  const { ref: statsRef,   visible: statsVisible   } = useReveal<HTMLDivElement>(0.05);
  const { ref: subRef,     visible: subVisible     } = useReveal<HTMLDivElement>(0.05);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
  };

  return (
    <>
      {/* ── Plataformas + Stats ── */}
      <section style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(3px)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(60px,8vw,100px) clamp(20px,4vw,60px)" }}>

          {/* Stats */}
          <div
            ref={statsRef}
            className="podcast-stats-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: "clamp(16px,2vw,28px)",
              marginBottom: "clamp(48px,6vw,80px)",
            }}
          >
            {STATS.map((s, i) => (
              <div key={s.label} style={{
                padding: "clamp(20px,2.5vw,32px)",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(12,12,12,0.95)",
                opacity: statsVisible ? 1 : 0,
                transform: statsVisible ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.6s ease ${i * 80}ms, transform 0.6s ease ${i * 80}ms`,
              }}>
                <div style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(32px,3.5vw,48px)", color: "var(--gold)", lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ fontFamily: "var(--font-dm)", fontSize: 12, letterSpacing: "1.5px", color: "var(--muted2)", marginTop: 6 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Plataformas */}
          <div ref={heroRef}>
            <div style={{
              fontFamily: "var(--font-dm)", fontSize: 11, letterSpacing: "3px",
              color: "var(--gold)", marginBottom: 20,
              opacity: heroVisible ? 1 : 0, transition: "opacity 0.6s ease",
            }}>
              ESCUCHA EN
            </div>
            <div className="platforms-grid" style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: "clamp(10px,1.5vw,16px)",
            }}>
              {PLATFORMS.map((p, i) => (
                <a
                  key={p.name}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "clamp(14px,1.8vw,22px)",
                    background: "rgba(12,12,12,0.95)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    cursor: p.soon ? "default" : "pointer",
                    opacity: heroVisible ? (p.soon ? 0.45 : 1) : 0,
                    transform: heroVisible ? "translateY(0)" : "translateY(20px)",
                    transition: `opacity 0.6s ease ${i * 80}ms, transform 0.6s ease ${i * 80}ms`,
                    pointerEvents: p.soon ? "none" : "auto",
                    position: "relative",
                  }}
                  onMouseEnter={e => { if (!p.soon) e.currentTarget.style.borderColor = p.color; }}
                  onMouseLeave={e => { if (!p.soon) e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
                >
                  <span style={{ fontSize: 20 }}>{p.icon}</span>
                  <div>
                    <div style={{ fontFamily: "var(--font-bebas)", fontSize: 14, letterSpacing: "1px", color: "#fff" }}>
                      {p.name}
                    </div>
                    {p.soon && (
                      <div style={{ fontFamily: "var(--font-dm)", fontSize: 10, color: "var(--muted2)", marginTop: 2 }}>
                        Próximamente
                      </div>
                    )}
                  </div>
                  {!p.soon && (
                    <span style={{ marginLeft: "auto", color: p.color, fontSize: 12 }}>↗</span>
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Episodio Destacado ── */}
      <section style={{ background: "rgba(5,5,5,0.9)", backdropFilter: "blur(3px)", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(60px,8vw,100px) clamp(20px,4vw,60px)" }}>
          <div ref={featRef}>
            <div style={{
              fontFamily: "var(--font-dm)", fontSize: 11, letterSpacing: "3px",
              color: "var(--gold)", marginBottom: 16,
              opacity: featVisible ? 1 : 0, transition: "opacity 0.6s ease",
            }}>
              EPISODIO RECIENTE
            </div>

            <a
              href={FEATURED.href}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: "clamp(24px,4vw,60px)",
                alignItems: "center",
                background: "rgba(201,168,76,0.05)",
                border: "1px solid var(--gold)",
                padding: "clamp(28px,4vw,52px)",
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                opacity: featVisible ? 1 : 0,
                transform: featVisible ? "translateY(0)" : "translateY(24px)",
                transition: "opacity 0.8s ease 100ms, transform 0.8s ease 100ms",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(201,168,76,0.09)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(201,168,76,0.05)")}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "var(--gold)" }} />

              <div>
                <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "var(--font-bebas)", fontSize: 13, letterSpacing: "2px", color: "var(--gold)" }}>
                    {FEATURED.ep}
                  </span>
                  <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, color: "var(--muted2)" }}>
                    {FEATURED.duration}
                  </span>
                  <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, color: "var(--muted2)" }}>
                    {FEATURED.date}
                  </span>
                </div>

                <h2 style={{
                  fontFamily: "var(--font-bebas)",
                  fontSize: "clamp(28px,3.5vw,52px)",
                  letterSpacing: "-0.5px", color: "#fff", lineHeight: 1.1,
                  marginBottom: 16,
                }}>
                  {FEATURED.title}
                </h2>

                <div style={{ fontFamily: "var(--font-dm)", fontSize: 12, color: "var(--gold)", marginBottom: 14 }}>
                  🎙️ {FEATURED.guest}
                </div>

                <p style={{ fontFamily: "var(--font-dm)", fontSize: 14, lineHeight: 1.7, color: "var(--muted)", maxWidth: 640, marginBottom: 20 }}>
                  {FEATURED.desc}
                </p>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {FEATURED.topics.map(t => (
                    <span key={t} style={{
                      fontFamily: "var(--font-dm)", fontSize: 11, letterSpacing: "1px",
                      color: "var(--muted2)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      padding: "4px 12px",
                    }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{
                width: "clamp(80px,10vw,120px)",
                height: "clamp(80px,10vw,120px)",
                border: "2px solid var(--gold)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontSize: "clamp(28px,4vw,44px)",
              }}>
                ▶
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ── Lista de Episodios ── */}
      <section style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(3px)", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(60px,8vw,100px) clamp(20px,4vw,60px)" }}>
          <div ref={listRef}>
            <div style={{
              fontFamily: "var(--font-dm)", fontSize: 11, letterSpacing: "3px",
              color: "var(--gold)", marginBottom: 16,
              opacity: listVisible ? 1 : 0, transition: "opacity 0.6s ease",
            }}>
              TODOS LOS EPISODIOS
            </div>
            <h2 style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(36px,4.5vw,60px)",
              letterSpacing: "-1px", color: "#fff", lineHeight: 1,
              marginBottom: "clamp(32px,4vw,52px)",
              opacity: listVisible ? 1 : 0,
              transform: listVisible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.7s ease 80ms, transform 0.7s ease 80ms",
            }}>
              ARCHIVO COMPLETO
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {EPISODES.map((ep, i) => (
                <a
                  key={ep.ep}
                  href={ep.href}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "80px 1fr auto",
                    gap: "clamp(16px,2vw,32px)",
                    alignItems: "center",
                    padding: "clamp(18px,2.5vw,28px) 0",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    cursor: "pointer",
                    opacity: listVisible ? 1 : 0,
                    transform: listVisible ? "translateY(0)" : "translateY(16px)",
                    transition: `opacity 0.6s ease ${i * 60}ms, transform 0.6s ease ${i * 60}ms`,
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget.children[0] as HTMLElement).style.color = "var(--gold)";
                    (e.currentTarget.children[1] as HTMLElement).style.color = "#fff";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget.children[0] as HTMLElement).style.color = "var(--muted2)";
                    (e.currentTarget.children[1] as HTMLElement).style.color = "inherit";
                  }}
                >
                  <div style={{
                    fontFamily: "var(--font-bebas)", fontSize: 13, letterSpacing: "1.5px",
                    color: "var(--muted2)", transition: "color 0.2s",
                  }}>
                    {ep.ep}
                  </div>
                  <div style={{ transition: "color 0.2s" }}>
                    <div style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(16px,1.8vw,22px)", letterSpacing: "0.5px", color: "#fff", lineHeight: 1.2, marginBottom: 6 }}>
                      {ep.title}
                    </div>
                    <div style={{ fontFamily: "var(--font-dm)", fontSize: 12, color: "var(--muted2)" }}>
                      🎙️ {ep.guest}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontFamily: "var(--font-dm)", fontSize: 12, color: "var(--muted2)", marginBottom: 4 }}>
                      {ep.duration}
                    </div>
                    <div style={{ fontFamily: "var(--font-dm)", fontSize: 11, color: "var(--muted2)" }}>
                      {ep.date}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Suscripción ── */}
      <section style={{ background: "rgba(5,5,5,0.9)", backdropFilter: "blur(4px)", borderTop: "1px solid var(--gold-dim)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(60px,8vw,100px) clamp(20px,4vw,60px)" }}>
          <div
            ref={subRef}
            style={{
              display: "flex", alignItems: "center",
              justifyContent: "space-between", gap: 40, flexWrap: "wrap",
              opacity: subVisible ? 1 : 0,
              transform: subVisible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
          >
            <div>
              <div style={{ fontFamily: "var(--font-dm)", fontSize: 11, letterSpacing: "3px", color: "var(--gold)", marginBottom: 12 }}>
                NUNCA TE PIERDAS UN EPISODIO
              </div>
              <h2 style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "clamp(32px,4vw,52px)",
                letterSpacing: "-0.5px", color: "#fff", lineHeight: 1, marginBottom: 10,
              }}>
                SUSCRÍBETE AL PODCAST
              </h2>
              <p style={{ fontFamily: "var(--font-dm)", fontSize: 14, color: "var(--muted)", maxWidth: 400 }}>
                Nuevo episodio cada semana. Negocios reales, estrategia aplicada, sin relleno.
              </p>
            </div>
            {sent ? (
              <div style={{ fontFamily: "var(--font-bebas)", fontSize: 18, letterSpacing: "1px", color: "var(--gold)" }}>
                ✓ LISTO — TE AVISAMOS CUANDO HAYA NUEVO EPISODIO
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
                  AVISARME →
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .podcast-stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .platforms-grid     { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 600px) {
          .platforms-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </>
  );
}
