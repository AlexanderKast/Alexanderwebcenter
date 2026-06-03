"use client";

import { useReveal } from "@/hooks/useReveal";

const EPISODIOS = [
  {
    n: "EP.08",
    title: "Cómo construir un sistema de contenido con IA en 7 días",
    desc: "Paso a paso desde cero: herramientas, prompts, y el workflow exacto que uso con clientes.",
    duracion: "42 MIN",
    fecha: "MAY 2026",
  },
  {
    n: "EP.07",
    title: "Live Shopping en LATAM: la oportunidad que nadie está viendo",
    desc: "Por qué el live commerce va a transformar el ecommerce en Colombia y cómo posicionarte ahora.",
    duracion: "38 MIN",
    fecha: "ABR 2026",
  },
  {
    n: "EP.06",
    title: "UGC desde cero: cómo construimos nuestra agencia con fe y sin capital",
    desc: "La historia real detrás de UGC Colombia: la crisis, el punto de quiebre, y cómo empezamos.",
    duracion: "55 MIN",
    fecha: "MAR 2026",
  },
];

const PLATAFORMAS = [
  { label: "SPOTIFY",       href: "#" },
  { label: "APPLE PODCASTS",href: "#" },
  { label: "YOUTUBE",       href: "#" },
];

export function HomePodcast() {
  const { ref: secRef,   visible: secVisible }   = useReveal<HTMLElement>(0.08);
  const { ref: listRef,  visible: listVisible }  = useReveal<HTMLDivElement>(0.08);

  return (
    <section
      id="podcast"
      ref={secRef}
      style={{
        position: "relative",
        background: "rgba(6,6,6,0.88)",
        backdropFilter: "blur(3px)",
        borderTop: "1px solid var(--gold-dim)",
        overflow: "hidden",
      }}
    >
      {/* Decorative */}
      <div style={{
        position: "absolute",
        bottom: -40, left: -40,
        width: 300, height: 300,
        background: "radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{
        maxWidth: 1400, margin: "0 auto",
        padding: "clamp(60px,8vw,100px) clamp(20px,4vw,60px)",
        position: "relative", zIndex: 1,
      }}>

        {/* Header + CTA */}
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
              fontSize: 11, letterSpacing: "3px",
              color: "var(--gold)", marginBottom: 16,
              opacity: secVisible ? 1 : 0,
              transform: secVisible ? "translateY(0)" : "translateY(14px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}>
              CASA HOST
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
                PODCAST
              </h2>
            </div>
            <p style={{
              fontFamily: "var(--font-dm)",
              fontSize: 14, color: "var(--muted)",
              marginTop: 16, maxWidth: 440,
              opacity: secVisible ? 1 : 0,
              transition: "opacity 0.6s ease 300ms",
            }}>
              Negocios digitales, IA aplicada y mentalidad para emprendedores LATAM.
              Conversaciones reales, sin filtros.
            </p>
          </div>

          {/* Plataformas */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            opacity: secVisible ? 1 : 0,
            transform: secVisible ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.6s ease 300ms, transform 0.6s ease 300ms",
          }}>
            <div style={{
              fontFamily: "var(--font-dm)",
              fontSize: 10, letterSpacing: "2px",
              color: "var(--muted2)", marginBottom: 4,
            }}>
              ESCUCHAR EN
            </div>
            {PLATAFORMAS.map(p => (
              <a
                key={p.label}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "var(--font-bebas)",
                  fontSize: 12, letterSpacing: "2px",
                  color: "var(--muted)",
                  display: "flex", alignItems: "center", gap: 6,
                  transition: "color .2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
              >
                <span style={{ color: "var(--gold)", fontSize: 8 }}>●</span>
                {p.label}
              </a>
            ))}
          </div>
        </div>

        {/* Episodios list */}
        <div ref={listRef}>
          {EPISODIOS.map((ep, i) => (
            <div
              key={ep.n}
              style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr auto",
                gap: 32,
                alignItems: "center",
                padding: "clamp(24px,3vw,36px) 0",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                cursor: "pointer",
                opacity: listVisible ? 1 : 0,
                transform: listVisible ? "translateX(0)" : "translateX(-24px)",
                transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 100}ms,
                             transform 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 100}ms`,
              }}
              className="ep-row"
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.querySelectorAll(".ep-title").forEach(t => {
                  (t as HTMLElement).style.color = "var(--gold)";
                });
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.querySelectorAll(".ep-title").forEach(t => {
                  (t as HTMLElement).style.color = "#fff";
                });
              }}
            >
              {/* Episode number */}
              <div style={{
                fontFamily: "var(--font-bebas)",
                fontSize: 13, letterSpacing: "2px",
                color: "var(--gold)",
              }}>
                {ep.n}
              </div>

              {/* Title + desc */}
              <div>
                <h3
                  className="ep-title"
                  style={{
                    fontFamily: "var(--font-bebas)",
                    fontSize: "clamp(20px,2.2vw,28px)",
                    letterSpacing: "0.5px",
                    color: "#fff",
                    lineHeight: 1.2,
                    marginBottom: 8,
                    transition: "color .25s",
                  }}
                >
                  {ep.title}
                </h3>
                <p style={{
                  fontFamily: "var(--font-dm)",
                  fontSize: 13, lineHeight: 1.6,
                  color: "var(--muted2)",
                }}>
                  {ep.desc}
                </p>
              </div>

              {/* Meta */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                alignItems: "flex-end",
                flexShrink: 0,
              }}>
                <div style={{
                  fontFamily: "var(--font-dm)",
                  fontSize: 11, letterSpacing: "1.5px",
                  color: "var(--muted2)",
                }}>
                  {ep.duracion}
                </div>
                <div style={{
                  fontFamily: "var(--font-dm)",
                  fontSize: 11, letterSpacing: "1px",
                  color: "var(--muted2)",
                }}>
                  {ep.fecha}
                </div>
                {/* Play icon */}
                <div style={{
                  width: 32, height: 32,
                  border: "1px solid rgba(255,255,255,0.12)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginTop: 4,
                  transition: "border-color .25s",
                }}>
                  <span style={{ color: "var(--gold)", fontSize: 12 }}>▶</span>
                </div>
              </div>
            </div>
          ))}

          {/* Border bottom */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />
        </div>

        {/* Ver todos CTA */}
        <div style={{
          marginTop: 40,
          opacity: listVisible ? 1 : 0,
          transition: "opacity 0.6s ease 400ms",
        }}>
          <a
            href="#"
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: 13, letterSpacing: "2px",
              color: "var(--gold)",
              border: "1px solid var(--gold-dim)",
              padding: "12px 28px",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              transition: "all .2s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "var(--gold)";
              e.currentTarget.style.color = "#000";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--gold)";
            }}
          >
            VER TODOS LOS EPISODIOS ↗
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .ep-row { grid-template-columns: 60px 1fr !important; }
          .ep-row > div:last-child { display: none; }
        }
      `}</style>
    </section>
  );
}
