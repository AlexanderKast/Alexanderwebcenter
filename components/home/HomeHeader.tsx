"use client";

import { useState, useEffect } from "react";

const NAV = [
  { n: "01", label: "SERVICIOS",  href: "#servicios" },
  { n: "02", label: "SOBRE MÍ",   href: "#sobre-mi" },
  { n: "03", label: "RECURSOS",   href: "#recursos" },
  { n: "04", label: "PODCAST",    href: "#podcast" },
  { n: "05", label: "CONTACTO",   href: "#contacto" },
];

export function HomeHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      background: scrolled ? "rgba(0,0,0,0.80)" : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: scrolled ? "1px solid var(--gold-dim)" : "1px solid transparent",
      transition: "all .35s ease",
    }}>
      <div style={{
        maxWidth: 1400, margin: "0 auto",
        padding: "0 clamp(20px,4vw,60px)",
        height: 72, display: "flex",
        alignItems: "center", justifyContent: "space-between", gap: 24,
      }}>

        {/* Logo */}
        <a href="/" style={{
          fontFamily: "var(--font-bebas)",
          fontSize: 20, letterSpacing: 4,
          color: "var(--gold)", flexShrink: 0,
        }}>
          ALEXANDER
        </a>

        {/* Desktop nav */}
        <nav style={{ display: "flex", gap: 4, alignItems: "center" }} className="home-nav-desktop">
          {NAV.map(({ n, label, href }) => (
            <a key={href} href={href} style={{
              fontFamily: "var(--font-dm)",
              fontSize: 10, letterSpacing: "2.5px",
              color: "var(--muted)", padding: "8px 14px",
              transition: "color .2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
            >
              <span style={{ color: "var(--gold)", marginRight: 5 }}>{n}</span>
              {label}
            </a>
          ))}
        </nav>

        {/* Right: CTA + hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
          <a href="#contacto" style={{
            fontFamily: "var(--font-bebas)",
            fontSize: 13, letterSpacing: "2px",
            background: "var(--gold)", color: "#000",
            padding: "11px 22px",
            transition: "opacity .2s",
          }}
          className="home-cta-desktop"
          onMouseEnter={e => (e.currentTarget.style.opacity = ".8")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            TRABAJEMOS JUNTOS
          </a>

          {/* Hamburger */}
          <button onClick={() => setOpen(o => !o)} style={{
            display: "none", background: "none", border: "none",
            color: "var(--gold)", cursor: "pointer", padding: 4,
          }} className="home-hamburger" aria-label="Menú">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {open
                ? <><line x1="4" y1="4" x2="20" y2="20"/><line x1="20" y1="4" x2="4" y2="20"/></>
                : <><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></>
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{
          background: "#050505",
          borderTop: "1px solid var(--gold-dim)",
          padding: "24px clamp(20px,4vw,60px)",
        }}>
          {NAV.map(({ n, label, href }) => (
            <a key={href} href={href} onClick={() => setOpen(false)} style={{
              display: "block",
              fontFamily: "var(--font-bebas)",
              fontSize: 28, letterSpacing: "3px",
              color: "#fff", padding: "12px 0",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}>
              <span style={{ color: "var(--gold)", fontSize: 14, marginRight: 12, fontFamily: "var(--font-dm)" }}>{n}</span>
              {label}
            </a>
          ))}
          <a href="#contacto" onClick={() => setOpen(false)} style={{
            display: "inline-block", marginTop: 24,
            fontFamily: "var(--font-bebas)", fontSize: 14, letterSpacing: "2px",
            background: "var(--gold)", color: "#000", padding: "14px 28px",
          }}>
            TRABAJEMOS JUNTOS
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .home-nav-desktop { display: none !important; }
          .home-cta-desktop { display: none !important; }
          .home-hamburger { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
