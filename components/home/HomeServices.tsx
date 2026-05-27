"use client";

import { useState } from "react";
import { useReveal } from "@/hooks/useReveal";

const SERVICES = [
  {
    title: "ESTRATEGIA DIGITAL",
    label: "CONSULTORÍA & SISTEMAS",
    img: "/assets/images/section/service-1.jpg",
    desc: "Diseño la estrategia digital de tu marca o negocio desde cero. Auditoría, roadmap y sistemas que funcionan sin que estés presente.",
    items: ["Auditoría de marca digital", "Roadmap de contenido", "Sistema editorial automatizado", "KPIs y métricas reales"],
  },
  {
    title: "CONTENIDO & UGC",
    label: "AGENCIA DE CONTENIDO",
    img: "/assets/images/section/service-2.jpg",
    desc: "Produzco contenido que convierte para marcas y ecommerce. Video, carruseles, guiones y campañas UGC a escala.",
    items: ["Estrategia de contenido", "Producción UGC para marcas", "Guiones con IA", "Campañas para ecommerce"],
  },
  {
    title: "INTELIGENCIA ARTIFICIAL",
    label: "FORMACIÓN AI-FIRST",
    img: "/assets/images/section/service-3.jpg",
    desc: "Forma a tu equipo y negocio para operar en modo AI-First. Herramientas, workflows y mentalidad para LATAM.",
    items: ["Consultoría AI-First", "Automatizaciones con n8n", "Agentes IA para tu negocio", "Formación para equipos"],
  },
];

/* ── Fila individual con su propio useReveal ── */
function ServiceRow({
  s,
  i,
  hovered,
  onEnter,
  onLeave,
}: {
  s: typeof SERVICES[0];
  i: number;
  hovered: number | null;
  onEnter: (i: number) => void;
  onLeave: () => void;
}) {
  const { ref, visible } = useReveal<HTMLDivElement>(0.1);

  return (
    <div
      ref={ref}
      onMouseEnter={() => onEnter(i)}
      onMouseLeave={onLeave}
      style={{
        maxWidth: 1400, margin: "0 auto",
        padding: "0 clamp(20px,4vw,60px)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-40px)",
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 80}ms,
                     transform 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 80}ms`,
      }}
    >
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "clamp(28px,4vw,44px) 0",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        cursor: "pointer",
        transition: "all .3s ease",
        gap: 24,
      }}>
        {/* Número */}
        <span style={{
          fontFamily: "var(--font-bebas)",
          fontSize: 13, letterSpacing: "2px",
          color: hovered === i ? "var(--gold)" : "var(--muted2)",
          flexShrink: 0, transition: "color .3s",
        }}>
          0{i + 1}
        </span>

        {/* Título */}
        <h3 style={{
          fontFamily: "var(--font-bebas)",
          fontSize: "clamp(38px,5vw,70px)",
          letterSpacing: "-1px",
          color: hovered === i ? "#fff" : "rgba(255,255,255,0.75)",
          flex: 1, transition: "color .3s", lineHeight: 1,
        }}>
          {s.title}
        </h3>

        {/* Label */}
        <span style={{
          fontFamily: "var(--font-dm)",
          fontSize: 11, letterSpacing: "2px",
          color: hovered === i ? "var(--gold)" : "var(--muted2)",
          flexShrink: 0, transition: "color .3s",
        }}>
          {s.label}
        </span>

        {/* Flecha */}
        <span style={{
          fontFamily: "var(--font-bebas)", fontSize: 24,
          color: hovered === i ? "var(--gold)" : "rgba(255,255,255,0.2)",
          flexShrink: 0,
          transform: hovered === i ? "translateX(4px)" : "translateX(0)",
          transition: "all .3s ease",
        }}>
          ↗
        </span>
      </div>

      {/* Contenido expandido */}
      <div style={{
        maxHeight: hovered === i ? "220px" : "0",
        overflow: "hidden",
        transition: "max-height .45s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 32,
          paddingBottom: 32,
        }}>
          <p style={{
            fontFamily: "var(--font-dm)",
            fontSize: 15, lineHeight: 1.7,
            color: "var(--muted)",
          }}>
            {s.desc}
          </p>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
            {s.items.map(item => (
              <li key={item} style={{
                fontFamily: "var(--font-dm)",
                fontSize: 13, color: "var(--muted)",
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <span style={{ color: "var(--gold)", fontSize: 16 }}>//</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ── Componente principal ── */
export function HomeServices() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [bgImg,   setBgImg]   = useState<string | null>(null);
  const { ref: headerRef, visible: headerVisible } = useReveal<HTMLDivElement>(0.15);

  const handleEnter = (idx: number) => { setHovered(idx); setBgImg(SERVICES[idx].img); };
  const handleLeave = () => { setHovered(null); setBgImg(null); };

  return (
    <section id="servicios" style={{
      position: "relative",
      background: "rgba(0,0,0,0.78)",
      backdropFilter: "blur(2px)",
      overflow: "hidden",
    }}>

      {/* Background image reveal on hover */}
      {bgImg && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: `url(${bgImg})`,
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.12,
          transition: "opacity .4s ease",
        }} />
      )}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: "linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 100%)",
      }} />

      {/* Header */}
      <div
        ref={headerRef}
        style={{
          position: "relative", zIndex: 2,
          maxWidth: 1400, margin: "0 auto",
          padding: "clamp(60px,8vw,100px) clamp(20px,4vw,60px) 0",
          display: "flex", justifyContent: "space-between", alignItems: "flex-end",
          marginBottom: 60,
        }}
      >
        <div>
          <div style={{
            fontFamily: "var(--font-dm)",
            fontSize: 11, letterSpacing: "3px",
            color: "var(--gold)", marginBottom: 16,
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}>
            LO QUE HAGO
          </div>
          <div style={{ overflow: "hidden" }}>
            <h2 style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(52px,6vw,80px)",
              letterSpacing: "-1px", color: "#fff", lineHeight: 1,
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? "translateY(0)" : "translateY(100%)",
              transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1) 100ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) 100ms",
            }}>
              SERVICIOS
            </h2>
          </div>
        </div>

        <a
          href="#contacto"
          style={{
            fontFamily: "var(--font-bebas)",
            fontSize: 13, letterSpacing: "2px",
            border: "1px solid var(--gold-dim)",
            color: "var(--gold)", padding: "12px 24px",
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(10px)",
            transitionProperty: "background,color,opacity,transform",
            transitionDuration: "0.2s,0.2s,0.6s,0.6s",
            transitionDelay: "0s,0s,200ms,200ms",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--gold)"; e.currentTarget.style.color = "#000"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--gold)"; }}
        >
          TRABAJEMOS JUNTOS →
        </a>
      </div>

      {/* Filas de servicios */}
      <div style={{ position: "relative", zIndex: 2 }}>
        {SERVICES.map((s, i) => (
          <ServiceRow
            key={s.title}
            s={s}
            i={i}
            hovered={hovered}
            onEnter={handleEnter}
            onLeave={handleLeave}
          />
        ))}

        {/* Borde inferior */}
        <div style={{
          maxWidth: 1400, margin: "0 auto",
          padding: "0 clamp(20px,4vw,60px)",
          borderTop: "1px solid rgba(255,255,255,0.07)",
        }} />
      </div>

      <div style={{ height: "clamp(60px,8vw,100px)" }} />
    </section>
  );
}
