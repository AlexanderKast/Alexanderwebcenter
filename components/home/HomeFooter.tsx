"use client";

const NAV_LINKS = [
  { label: "SERVICIOS",  href: "/servicios" },
  { label: "SOBRE MÍ",   href: "/sobre-mi" },
  { label: "RECURSOS",   href: "/recursos" },
  { label: "PODCAST",    href: "/podcast" },
  { label: "CONTACTO",   href: "/contacto" },
];

const SOCIAL_LINKS = [
  { label: "LINKEDIN",   href: "https://linkedin.com/in/alexemprendee" },
  { label: "INSTAGRAM",  href: "https://instagram.com/alexemprendee" },
];

export function HomeFooter() {
  return (
    <footer style={{
      background: "rgba(0,0,0,0.85)",
      backdropFilter: "blur(8px)",
      borderTop: "1px solid var(--gold-dim)",
    }}>
      <div style={{
        maxWidth: 1400, margin: "0 auto",
        padding: "clamp(48px,6vw,80px) clamp(20px,4vw,60px) clamp(24px,3vw,40px)",
      }}>

        {/* Top row */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 40,
          marginBottom: "clamp(40px,5vw,64px)",
          flexWrap: "wrap",
        }}>

          {/* Brand */}
          <div style={{ maxWidth: 320 }}>
            <div style={{
              fontFamily: "var(--font-bebas)",
              fontSize: 28, letterSpacing: 4,
              color: "var(--gold)",
              marginBottom: 16,
            }}>
              ALEXANDER
            </div>
            <p style={{
              fontFamily: "var(--font-dm)",
              fontSize: 14, lineHeight: 1.7,
              color: "var(--muted)",
            }}>
              Estrategia digital, contenido que convierte e inteligencia artificial
              aplicada al negocio real. Para emprendedores y marcas en LATAM.
            </p>
            <div style={{
              marginTop: 24,
              fontFamily: "var(--font-dm)",
              fontSize: 12, letterSpacing: "1.8px",
              color: "var(--muted2)",
            }}>
              MEDELLÍN, COLOMBIA — PARA TODA LATAM
            </div>
          </div>

          {/* Nav links */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{
              fontFamily: "var(--font-dm)",
              fontSize: 12, letterSpacing: "1.8px",
              color: "var(--gold)", marginBottom: 4,
            }}>
              NAVEGACIÓN
            </div>
            {NAV_LINKS.map(({ label, href }) => (
              <a key={href} href={href} style={{
                fontFamily: "var(--font-dm)",
                fontSize: 12, letterSpacing: "1.5px",
                color: "var(--muted)",
                transition: "color .2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Social + CTA */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div>
              <div style={{
                fontFamily: "var(--font-dm)",
                fontSize: 12, letterSpacing: "1.8px",
                color: "var(--gold)", marginBottom: 12,
              }}>
                REDES
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {SOCIAL_LINKS.map(({ label, href }) => (
                  <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                    style={{
                      fontFamily: "var(--font-dm)",
                      fontSize: 12, letterSpacing: "1.5px",
                      color: "var(--muted)",
                      transition: "color .2s",
                      display: "flex", alignItems: "center", gap: 8,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
                  >
                    <span style={{ color: "var(--gold)", fontSize: 12 }}>↗</span>
                    {label}
                  </a>
                ))}
              </div>
            </div>

            <a href="/contacto" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontFamily: "var(--font-bebas)",
              fontSize: 13, letterSpacing: "2px",
              border: "1px solid var(--gold)",
              color: "var(--gold)", padding: "12px 24px",
              transition: "all .2s",
              alignSelf: "flex-start",
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
              TRABAJEMOS JUNTOS →
            </a>
          </div>
        </div>

        {/* Gold divider */}
        <div style={{
          height: 1,
          background: "var(--gold-dim)",
          marginBottom: "clamp(20px,3vw,32px)",
        }}/>

        {/* Bottom row */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}>
          <div style={{
            fontFamily: "var(--font-dm)",
            fontSize: 12, letterSpacing: "1px",
            color: "var(--muted2)",
          }}>
            © 2025 EMPRENDE CON ALEXANDER ·{" "}
            <span style={{ color: "var(--muted)" }}>Estrat</span>
            <span style={{ color: "var(--gold)" }}>IA</span>
          </div>

          <div style={{
            fontFamily: "var(--font-dm)",
            fontSize: 12, letterSpacing: "1.5px",
            color: "var(--muted2)",
          }}>
            DISEÑO & DESARROLLO — AI-FIRST LATAM
          </div>
        </div>
      </div>
    </footer>
  );
}
