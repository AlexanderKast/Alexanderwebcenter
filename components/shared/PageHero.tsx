"use client";

import { useReveal } from "@/hooks/useReveal";

interface PageHeroProps {
  overline:    string;
  title:       string;
  subtitle?:   string;
  description?: string;
  /** Ruta anterior para el breadcrumb — default "/" */
  backLabel?:  string;
  backHref?:   string;
}

export function PageHero({
  overline,
  title,
  subtitle,
  description,
  backLabel = "INICIO",
  backHref  = "/",
}: PageHeroProps) {
  const { ref, visible } = useReveal<HTMLDivElement>(0.01);

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        minHeight: "52svh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        background: "rgba(0,0,0,0.70)",
        backdropFilter: "blur(2px)",
        borderBottom: "1px solid var(--gold-dim)",
        paddingTop: 72, /* clearance del header fijo */
        overflow: "hidden",
      }}
    >
      {/* Gradiente inferior para lectura del texto */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)",
        pointerEvents: "none",
      }} />

      {/* Línea dorada decorativa izquierda */}
      <div style={{
        position: "absolute",
        top: 0, left: 0,
        width: visible ? "100%" : "0%",
        height: 2,
        background: "linear-gradient(to right, var(--gold) 0%, transparent 100%)",
        transition: "width 1.2s cubic-bezier(0.16,1,0.3,1)",
      }} />

      <div
        className="page-hero-grid"
        style={{
          maxWidth: 1400, margin: "0 auto", width: "100%",
          padding: "clamp(40px,6vw,80px) clamp(20px,4vw,60px)",
          position: "relative", zIndex: 1,
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) minmax(0,26rem)",
          gap: "clamp(24px,4vw,64px)",
          alignItems: "end",
        }}
      >
        <div>
        {/* Breadcrumb */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          marginBottom: 32,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}>
          <a
            href={backHref}
            style={{
              fontFamily: "var(--font-dm)",
              fontSize: 12, letterSpacing: "1.6px",
              color: "var(--texto-tenue)",
              transition: "color .2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--texto-tenue)")}
          >
            {backLabel}
          </a>
          <span style={{ color: "var(--texto-tenue)", fontSize: 12 }}>／</span>
          <span style={{
            fontFamily: "var(--font-dm)",
            fontSize: 12, letterSpacing: "1.6px",
            color: "var(--gold)",
          }}>
            {title}
          </span>
        </div>

        {/* Overline */}
        <div style={{
          fontFamily: "var(--font-dm)",
          fontSize: 12, letterSpacing: "1.8px",
          color: "var(--gold)", marginBottom: 16,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(14px)",
          transition: "opacity 0.6s ease 100ms, transform 0.6s ease 100ms",
        }}>
          {overline}
        </div>

        {/* Title */}
        <div style={{ overflow: "hidden", marginBottom: subtitle || description ? 24 : 0 }}>
          <h1 style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "clamp(58px,8vw,120px)",
            letterSpacing: "-0.015em",
            color: "#fff",
            lineHeight: 0.95,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(110%)",
            transition: "opacity 0.9s cubic-bezier(0.16,1,0.3,1) 150ms, transform 0.9s cubic-bezier(0.16,1,0.3,1) 150ms",
          }}>
            {title}
          </h1>
        </div>

        {/* Subtitle */}
        {subtitle && (
          <div style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "clamp(24px,3vw,36px)",
            letterSpacing: "-0.01em",
            color: "var(--gold)",
            marginBottom: description ? 16 : 0,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease 300ms, transform 0.7s ease 300ms",
          }}>
            {subtitle}
          </div>
        )}

        </div>

        {/* Description — columna derecha en escritorio, debajo en movil */}
        {description && (
          <p style={{
            fontFamily: "var(--font-dm)",
            fontSize: "clamp(14px,1.5vw,17px)",
            lineHeight: 1.7,
            color: "var(--texto-suave)",
            maxWidth: 560,
            margin: 0,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.7s ease 400ms, transform 0.7s ease 400ms",
          }}>
            {description}
          </p>
        )}
      </div>

      <style>{`
        /* Debajo de 1024 el titular de 120px y la columna de texto no entran
           lado a lado: se apilan. */
        @media (max-width: 1023px) {
          .page-hero-grid { grid-template-columns: 1fr !important; align-items: start !important; }
        }
      `}</style>
    </div>
  );
}
