"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { n: "01", label: "SERVICIOS",   href: "/servicios"   },
  { n: "02", label: "CONSULTORÍA", href: "/consultoria" },
  { n: "03", label: "SOBRE MÍ",    href: "/sobre-mi"    },
  { n: "04", label: "BLOG",        href: "/blog"        },
  { n: "05", label: "RECURSOS",    href: "/recursos"    },
  { n: "06", label: "PODCAST",     href: "/podcast"     },
  { n: "07", label: "CONTACTO",    href: "/contacto"    },
  { n: "08", label: "FORMULARIO",  href: "/brief"       },
];

export function HomeHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const pathname                = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* Con el menu abierto la pagina seguia scrolleando por detras y no habia
     forma de cerrarlo con teclado. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflowPrevio;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  /* El menú móvil se cierra desde el onClick de cada enlace. Hacerlo en un
     efecto sobre pathname obliga a un render extra en cada navegación. */

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      // Antes arriba de todo el header era 100% transparente y el nav quedaba
      // sobre el video: ilegible. Ahora sin scroll hay un degradado que oscurece
      // la franja superior sin tapar el fondo.
      background: scrolled
        ? "rgba(0,0,0,0.88)"
        : "linear-gradient(to bottom, rgba(0,0,0,0.75), rgba(0,0,0,0))",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: scrolled ? "1px solid var(--gold-dim)" : "1px solid transparent",
      transition: "background .35s ease, backdrop-filter .35s ease, border-color .35s ease",
    }}>
      <div style={{
        maxWidth: 1400, margin: "0 auto",
        padding: "0 clamp(20px,4vw,60px)",
        height: 72, display: "flex",
        alignItems: "center", justifyContent: "space-between", gap: 24,
      }}>

        {/* Logo */}
        <Link href="/" style={{
          fontFamily: "var(--font-bebas)",
          fontSize: 20, letterSpacing: 4,
          color: "var(--gold)", flexShrink: 0,
        }}>
          ALEXANDER
        </Link>

        {/* Desktop nav */}
        <nav role="navigation" aria-label="Navegación principal"
          style={{ display: "flex", gap: 4, alignItems: "center" }}
          className="home-nav-desktop"
        >
          {NAV.map(({ n, label, href }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                style={{
                  fontFamily: "var(--font-dm)",
                  // 10px con 2.5px de tracking era ilegible. 12/1.6 se lee
                  // y sigue leyendose como nav editorial.
                  fontSize: 12, letterSpacing: "1.6px",
                  color: active ? "#fff" : "var(--texto-suave)",
                  padding: "8px 12px",
                  transition: "color .2s",
                  position: "relative",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
                onMouseLeave={e => (e.currentTarget.style.color = active ? "#fff" : "var(--texto-suave)")}
              >
                <span style={{ color: "var(--gold)", marginRight: 5 }}>{n}</span>
                {label}
                {/* Underline activo */}
                {active && (
                  <span style={{
                    position: "absolute", bottom: 2, left: 14, right: 14,
                    height: 1, background: "var(--gold)",
                  }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* CTA + hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
          <Link href="/contacto"
            className="home-cta-desktop"
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: 13, letterSpacing: "2px",
              background: "var(--gold)", color: "#000",
              padding: "11px 22px",
              transition: "opacity .2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = ".8")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            TRABAJEMOS JUNTOS
          </Link>

          <button
            onClick={() => setOpen(o => !o)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            style={{
              display: "none", background: "none", border: "none",
              color: "var(--gold)", cursor: "pointer", padding: 4,
            }}
            className="home-hamburger"
          >
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
        <nav role="navigation" aria-label="Menú móvil" className="home-nav-movil" style={{
          background: "rgba(0,0,0,0.96)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid var(--gold-dim)",
          padding: "24px clamp(20px,4vw,60px) 32px",
        }}>
          {NAV.map(({ n, label, href }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
                style={{
                  display: "block",
                  fontFamily: "var(--font-bebas)",
                  fontSize: 32, letterSpacing: "3px",
                  color: active ? "var(--gold)" : "#fff",
                  padding: "14px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <span style={{ color: "var(--gold)", fontSize: 13, marginRight: 12, fontFamily: "var(--font-dm)", letterSpacing: "2px" }}>
                  {n}
                </span>
                {label}
              </Link>
            );
          })}
          <Link href="/contacto"
            onClick={() => setOpen(false)}
            style={{
              display: "inline-block", marginTop: 28,
              fontFamily: "var(--font-bebas)", fontSize: 14, letterSpacing: "2px",
              background: "var(--gold)", color: "#000", padding: "14px 32px",
            }}
          >
            TRABAJEMOS JUNTOS
          </Link>
        </nav>
      )}

      <style>{`
        /* Subido de 900 a 1120: con 8 items de nav mas logo mas CTA, entre
           900 y 1100px todo se apretaba y se montaba. */
        @media (max-width: 1120px) {
          .home-nav-desktop { display: none !important; }
          .home-cta-desktop { display: none !important; }
          .home-hamburger   { display: flex !important; }
        }
        /* El menu movil abierto podia quedar mas alto que la pantalla y los
           ultimos enlaces eran inalcanzables. */
        .home-nav-movil {
          max-height: calc(100vh - 72px);
          max-height: calc(100dvh - 72px);
          overflow-y: auto;
          overscroll-behavior: contain;
        }
      `}</style>
    </header>
  );
}
