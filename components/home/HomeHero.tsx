"use client";

const TAGS = [
  "ESTRATEGA DIGITAL AI-FIRST",
  "CREADOR DE CONTENIDO",
  "CONSULTOR IA PARA LATAM",
  "MEDELLÍN, COLOMBIA 🇨🇴",
];

/* Líneas del título con delay de entrada */
const TITLE_LINES = [
  { text: "ESTRATEGIA", gold: false, delay: 300 },
  { text: "CONTENIDO",  gold: false, delay: 420 },
  { text: "E INTELIGENCIA", gold: false, delay: 540 },
  { text: "ARTIFICIAL", gold: true,  delay: 660 },
];

export function HomeHero() {
  return (
    <section id="inicio" style={{
      position: "relative",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      overflow: "hidden",
      background: "transparent",
    }}>

      {/* Gradient overlay — oscurece el video global */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        background:
          "linear-gradient(135deg,rgba(0,0,0,0.82) 0%,rgba(0,0,0,0.42) 50%,rgba(0,0,0,0.68) 100%)",
      }} />

      {/* Línea dorada inferior */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: 1, background: "var(--gold-dim)", zIndex: 2,
      }} />

      {/* Contenido */}
      <div
        style={{
          position: "relative", zIndex: 2,
          maxWidth: 1400, margin: "0 auto", width: "100%",
          padding: "clamp(100px,14vw,160px) clamp(20px,4vw,60px) clamp(60px,8vw,100px)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(40px,6vw,100px)",
          alignItems: "center",
        }}
        className="hero-grid"
      >

        {/* ── Izquierda ── */}
        <div>
          {/* Tags */}
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 6, marginBottom: 36 }}>
            {TAGS.map((tag, i) => (
              <li
                key={tag}
                style={{
                  fontFamily: "var(--font-dm)",
                  fontSize: 11, letterSpacing: "2.5px",
                  color: "var(--muted)",
                  display: "flex", alignItems: "center", gap: 10,
                  animation: `hero-slide-left 0.7s cubic-bezier(0.16,1,0.3,1) ${80 + i * 80}ms both`,
                }}
              >
                <span style={{
                  display: "inline-block",
                  width: 20, height: 1,
                  background: "var(--gold)", flexShrink: 0,
                }} />
                {tag}
              </li>
            ))}
          </ul>

          {/* Título — curtain reveal por línea */}
          <h1 style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "clamp(72px,10vw,130px)",
            lineHeight: 0.92,
            letterSpacing: "-2px",
            marginBottom: 40,
          }}>
            {TITLE_LINES.map(({ text, gold, delay }) => (
              <div key={text} style={{ overflow: "hidden", display: "block" }}>
                <div style={{
                  color: gold ? "var(--gold)" : "#fff",
                  display: "block",
                  animation: `hero-curtain 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms both`,
                }}>
                  {text}
                </div>
              </div>
            ))}
          </h1>

          {/* Descripción */}
          <p style={{
            fontFamily: "var(--font-dm)",
            fontSize: "clamp(15px,1.6vw,18px)",
            lineHeight: 1.65,
            color: "var(--muted)",
            maxWidth: 480,
            marginBottom: 40,
            animation: "hero-fade-up 0.9s cubic-bezier(0.16,1,0.3,1) 750ms both",
          }}>
            Paisa de Medellín con 8+ años construyendo negocios digitales en LATAM.
            Ayudo a emprendedores y marcas a crecer con estrategia digital, contenido
            que convierte e inteligencia artificial aplicada al negocio real.
          </p>

          {/* CTA */}
          <div style={{
            animation: "hero-fade-up 0.9s cubic-bezier(0.16,1,0.3,1) 860ms both",
          }}>
            <a
              href="#contacto"
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                fontFamily: "var(--font-bebas)",
                fontSize: 16, letterSpacing: "2.5px",
                color: "#000", background: "var(--gold)",
                padding: "18px 36px",
                transition: "all .25s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "#fff";
                e.currentTarget.style.color = "#000";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "var(--gold)";
                e.currentTarget.style.color = "#000";
              }}
            >
              AGENDA UNA SESIÓN ESTRATÉGICA
              <span style={{ fontSize: 20 }}>→</span>
            </a>
          </div>
        </div>

        {/* ── Derecha — tarjeta de stats ── */}
        <div
          style={{
            display: "flex", justifyContent: "flex-end",
            animation: "hero-slide-right 1s cubic-bezier(0.16,1,0.3,1) 400ms both",
          }}
        >
          <div style={{
            background: "rgba(10,10,10,0.82)",
            border: "1px solid var(--gold-dim)",
            padding: "clamp(32px,4vw,52px)",
            maxWidth: 380, width: "100%",
            backdropFilter: "blur(12px)",
          }}>

            {/* Disponibilidad */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              marginBottom: 32,
              fontFamily: "var(--font-dm)",
              fontSize: 11, letterSpacing: "2px",
              color: "var(--muted)",
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: "50%",
                background: "#4ade80",
                boxShadow: "0 0 6px #4ade80",
                animation: "dot-pulse 2.4s ease infinite",
              }} />
              DISPONIBLE PARA PROYECTOS
            </div>

            {/* Stats */}
            {[
              { num: "8+",   label: "Años de experiencia" },
              { num: "4",    label: "Países de operación" },
              { num: "100+", label: "Clientes y alumnos" },
            ].map(({ num, label }) => (
              <div key={num} style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "baseline",
                padding: "16px 0",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}>
                <span style={{
                  fontFamily: "var(--font-bebas)",
                  fontSize: 42, letterSpacing: "-1px",
                  color: "var(--gold)",
                }}>
                  {num}
                </span>
                <span style={{
                  fontFamily: "var(--font-dm)",
                  fontSize: 12, color: "var(--muted)",
                  textAlign: "right", maxWidth: 180, letterSpacing: "0.5px",
                }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div style={{
        position: "absolute", bottom: 32,
        left: "50%", transform: "translateX(-50%)",
        zIndex: 2,
        display: "flex", flexDirection: "column",
        alignItems: "center", gap: 6,
        animation: "hero-fade-up 1s ease 1400ms both",
      }}>
        <div style={{
          fontFamily: "var(--font-dm)",
          fontSize: 9, letterSpacing: "3px",
          color: "var(--muted2)",
        }}>
          SCROLL
        </div>
        <div style={{
          width: 1, height: 40,
          background: "linear-gradient(to bottom, var(--gold-dim), transparent)",
          animation: "scroll-pulse 2s ease infinite",
        }} />
      </div>

      <style>{`
        /* Curtain: línea del título emerge de abajo */
        @keyframes hero-curtain {
          from { transform: translateY(105%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        /* Tags: entran desde la izquierda */
        @keyframes hero-slide-left {
          from { opacity: 0; transform: translateX(-28px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        /* Tarjeta: entra desde la derecha */
        @keyframes hero-slide-right {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        /* Descripción y CTA: fade up */
        @keyframes hero-fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        /* Punto verde pulsante */
        @keyframes dot-pulse {
          0%, 100% { box-shadow: 0 0 4px #4ade80; }
          50%       { box-shadow: 0 0 12px #4ade80; }
        }
        /* Scroll hint */
        @keyframes scroll-pulse {
          0%, 100% { opacity: 0.3; transform: scaleY(1); }
          50%       { opacity: 1;   transform: scaleY(1.15); }
        }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
