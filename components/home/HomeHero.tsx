"use client";

const TAGS = [
  "ESTRATEGA DIGITAL AI-FIRST",
  "CREADOR DE CONTENIDO",
  "CONSULTOR IA PARA LATAM",
  "MEDELLÍN, COLOMBIA 🇨🇴",
];

export function HomeHero() {
  return (
    <section id="inicio" style={{
      position: "relative",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      overflow: "hidden",
      background: "transparent",         /* el video global se ve detrás */
    }}>
      {/* Gradient overlay — oscurece el video global para legibilidad */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: "linear-gradient(135deg,rgba(0,0,0,0.80) 0%,rgba(0,0,0,0.40) 50%,rgba(0,0,0,0.65) 100%)",
      }} />

      {/* Gold bottom line */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: 1, background: "var(--gold-dim)", zIndex: 2,
      }} />

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 2,
        maxWidth: 1400, margin: "0 auto", width: "100%",
        padding: "clamp(100px,14vw,160px) clamp(20px,4vw,60px) clamp(60px,8vw,100px)",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "clamp(40px,6vw,100px)",
        alignItems: "center",
      }} className="hero-grid">

        {/* Left */}
        <div>
          {/* Tags */}
          <ul style={{
            listStyle: "none",
            display: "flex", flexDirection: "column", gap: 6,
            marginBottom: 36,
          }}>
            {TAGS.map(tag => (
              <li key={tag} style={{
                fontFamily: "var(--font-dm)",
                fontSize: 11, letterSpacing: "2.5px",
                color: "var(--muted)",
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <span style={{
                  display: "inline-block",
                  width: 20, height: 1,
                  background: "var(--gold)",
                  flexShrink: 0,
                }}/>
                {tag}
              </li>
            ))}
          </ul>

          {/* Main title */}
          <h1 style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "clamp(72px,10vw,130px)",
            lineHeight: 0.92,
            letterSpacing: "-2px",
            color: "#fff",
            marginBottom: 40,
          }}>
            ESTRATEGIA<br/>
            CONTENIDO<br/>
            E INTELIGENCIA<br/>
            <span style={{ color: "var(--gold)" }}>ARTIFICIAL</span>
          </h1>

          {/* Body text */}
          <p style={{
            fontFamily: "var(--font-dm)",
            fontSize: "clamp(15px,1.6vw,18px)",
            lineHeight: 1.65,
            color: "var(--muted)",
            maxWidth: 480,
            marginBottom: 40,
          }}>
            Paisa de Medellín con 6+ años construyendo negocios digitales en LATAM.
            Ayudo a emprendedores y marcas a crecer con estrategia digital, contenido
            que convierte e inteligencia artificial aplicada al negocio real.
          </p>

          {/* CTA */}
          <a href="#contacto" style={{
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

        {/* Right — badge card */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{
            background: "rgba(10,10,10,0.85)",
            border: "1px solid var(--gold-dim)",
            padding: "clamp(32px,4vw,52px)",
            maxWidth: 380, width: "100%",
            backdropFilter: "blur(10px)",
          }}>
            {/* Availability */}
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
              }}/>
              DISPONIBLE PARA PROYECTOS
            </div>

            {/* Stats in card */}
            {[
              { num: "6+",   label: "Años de experiencia" },
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
                  textAlign: "right", maxWidth: 180,
                  letterSpacing: "0.5px",
                }}>
                  {label}
                </span>
              </div>
            ))}

            <div style={{
              marginTop: 28,
              fontFamily: "var(--font-dm)",
              fontSize: 11, letterSpacing: "1.5px",
              color: "var(--muted2)",
            }}>
              MEDELLÍN → BOGOTÁ → MIAMI → CDMX
            </div>
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
          animation: "scrollPulse 2s ease infinite",
        }}/>
      </div>

      <style>{`
        @keyframes scrollPulse {
          0%,100%{opacity:.3;transform:scaleY(1)}
          50%{opacity:1;transform:scaleY(1.15)}
        }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
