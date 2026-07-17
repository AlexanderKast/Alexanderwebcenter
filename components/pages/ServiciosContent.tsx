"use client";

import { useState } from "react";
import { useReveal } from "@/hooks/useReveal";

const PACKAGES = [
  {
    id: "estrategica",
    tag: "PUNTO DE ENTRADA",
    name: "SESIÓN\nESTRATÉGICA",
    price: "$300",
    priceSuffix: "— $400 USD",
    duration: "90 minutos",
    desc: "Una sesión enfocada en tu situación específica. Salimos con un mapa claro de dónde estás y qué hacer primero.",
    includes: [
      "Diagnóstico de tu negocio digital",
      "Identificación de cuellos de botella",
      "Roadmap de 90 días",
      "Grabación de la sesión",
      "Resumen con próximos pasos",
    ],
    cta: "AGENDAR SESIÓN",
    featured: false,
  },
  {
    id: "inicial",
    tag: "MÁS POPULAR",
    name: "PAQUETE\nINICIAL",
    price: "$1,200",
    priceSuffix: "USD",
    duration: "4 semanas",
    desc: "Para quien quiere arrancar con sistema. Estrategia + contenido + IA aplicada a tu negocio real.",
    includes: [
      "3 sesiones estratégicas (90 min c/u)",
      "Estrategia de contenido completa",
      "Sistema editorial con IA",
      "Setup básico de automatizaciones",
      "Acceso a recursos de Kreoon",
      "Soporte por WhatsApp 30 días",
    ],
    cta: "QUIERO ESTE",
    featured: true,
  },
  {
    id: "growth",
    tag: "IMPLEMENTACIÓN",
    name: "PAQUETE\nGROWTH",
    price: "$2,500",
    priceSuffix: "USD",
    duration: "8 semanas",
    desc: "Implementamos juntos. No solo estrategia — construimos los sistemas que funcionan sin que estés presente.",
    includes: [
      "Todo del Paquete Inicial",
      "Implementación de automatizaciones n8n",
      "Setup de agentes IA para tu negocio",
      "Estrategia de paid media (Meta/Google)",
      "Dashboard de métricas personalizado",
      "Soporte por WhatsApp 60 días",
      "Sesión de revisión mensual",
    ],
    cta: "HABLAR CON ALEXANDER",
    featured: false,
  },
  {
    id: "scale",
    tag: "TRANSFORMACIÓN",
    name: "PAQUETE\nSCALE",
    price: "$4,500",
    priceSuffix: "USD",
    duration: "12 semanas",
    desc: "Transformación digital completa. Para marcas y emprendedores que quieren operar en modo AI-First de verdad.",
    includes: [
      "Todo del Paquete Growth",
      "Arquitectura completa AI-First",
      "Equipo de contenido coordinado",
      "Sistema UGC para tu marca",
      "Setup Live Shopping (si aplica)",
      "Integración Kreoon completa",
      "Soporte prioritario 90 días",
      "2 sesiones de revisión mensual",
    ],
    cta: "APLICAR AL SCALE",
    featured: false,
  },
];

const ADDONS = [
  { name: "AUDITORÍA IA",           price: "$800",  desc: "Análisis completo de tu stack tecnológico + hoja de ruta de automatización." },
  { name: "SETUP LIVE SHOPPING",    price: "$1,500", desc: "Configuración completa de tu sistema de live shopping para tu marca." },
  { name: "RETAINER MENSUAL",       price: "$2,000–3,000", desc: "Estrategia continua. Alexander acompañando tu operación mes a mes." },
  { name: "ESTRATEGIA KREOON",      price: "$1,000", desc: "Setup completo de Kreoon + capacitación de tu equipo de contenido." },
  { name: "SESIÓN IMPLEMENTACIÓN",  price: "$500–600", desc: "Ejecutamos una automatización específica en una sesión de trabajo." },
];

const FAQS = [
  {
    q: "¿Cuánto tiempo tarda en verse resultados?",
    a: "Depende del punto de partida. En la Sesión Estratégica ya sales con claridad y próximos pasos. En los paquetes, los primeros resultados medibles suelen verse entre semana 3 y semana 6.",
  },
  {
    q: "¿Trabajas con negocios de cualquier tamaño?",
    a: "Trabajo mejor con emprendedores y marcas que ya tienen algo construido — aunque sea pequeño. No es para quien está pensando en empezar algún día. Es para quien ya está en el juego.",
  },
  {
    q: "¿En qué países trabajas?",
    a: "Todo es remoto. He trabajado con negocios en Colombia, Ecuador, República Dominicana y Perú. Si tienes internet y quieres resultados, la geografía no importa.",
  },
  {
    q: "¿Puedo combinar servicios?",
    a: "Sí. Los add-ons se pueden agregar a cualquier paquete. Y si el Paquete Inicial te queda corto a mitad del proceso, podemos hacer upgrade.",
  },
];

function PackageCard({ pkg, i, visible }: { pkg: typeof PACKAGES[0]; i: number; visible: boolean }) {
  return (
    <div style={{
      position: "relative",
      background: pkg.featured ? "rgba(201,168,76,0.06)" : "rgba(12,12,12,0.95)",
      border: `1px solid ${pkg.featured ? "var(--gold)" : "rgba(255,255,255,0.07)"}`,
      padding: "clamp(28px,3vw,44px)",
      display: "flex",
      flexDirection: "column",
      gap: 20,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(32px)",
      transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${200 + i * 100}ms,
                   transform 0.7s cubic-bezier(0.16,1,0.3,1) ${200 + i * 100}ms`,
    }}>
      {/* Gold top bar on featured */}
      {pkg.featured && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "var(--gold)" }} />
      )}

      {/* Tag */}
      <div style={{
        fontFamily: "var(--font-dm)",
        fontSize: 10, letterSpacing: "2.5px",
        color: pkg.featured ? "var(--gold)" : "var(--muted2)",
        border: `1px solid ${pkg.featured ? "var(--gold-dim)" : "rgba(255,255,255,0.08)"}`,
        padding: "4px 10px",
        width: "fit-content",
      }}>
        {pkg.tag}
      </div>

      {/* Name */}
      <h3 style={{
        fontFamily: "var(--font-bebas)",
        fontSize: "clamp(32px,3.5vw,48px)",
        letterSpacing: "-0.5px",
        color: "#fff", lineHeight: 1,
        whiteSpace: "pre-line",
      }}>
        {pkg.name}
      </h3>

      {/* Price */}
      <div>
        <div style={{
          fontFamily: "var(--font-bebas)",
          fontSize: "clamp(40px,5vw,60px)",
          letterSpacing: "-1px",
          color: "var(--gold)", lineHeight: 1,
        }}>
          {pkg.price}
        </div>
        <div style={{
          fontFamily: "var(--font-dm)",
          fontSize: 12, color: "var(--muted2)",
          marginTop: 2,
        }}>
          {pkg.priceSuffix} · {pkg.duration}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

      {/* Description */}
      <p style={{
        fontFamily: "var(--font-dm)",
        fontSize: 14, lineHeight: 1.7,
        color: "var(--muted)",
      }}>
        {pkg.desc}
      </p>

      {/* Includes */}
      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        {pkg.includes.map(item => (
          <li key={item} style={{
            fontFamily: "var(--font-dm)",
            fontSize: 13, color: "var(--muted)",
            display: "flex", alignItems: "flex-start", gap: 10,
          }}>
            <span style={{ color: "var(--gold)", flexShrink: 0, marginTop: 1 }}>✓</span>
            {item}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a
        href="https://wa.me/573132947776?text=Hola%20Alexander%2C%20me%20interesa%20el%20servicio"
        target="_blank" rel="noopener noreferrer"
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-bebas)",
          fontSize: 14, letterSpacing: "2px",
          background: pkg.featured ? "var(--gold)" : "transparent",
          color: pkg.featured ? "#000" : "var(--gold)",
          border: `1px solid ${pkg.featured ? "var(--gold)" : "var(--gold-dim)"}`,
          padding: "14px 24px",
          transition: "all .2s",
          marginTop: "auto",
          cursor: "pointer",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.background = "var(--gold)";
          (e.currentTarget as HTMLElement).style.color = "#000";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.background = pkg.featured ? "var(--gold)" : "transparent";
          (e.currentTarget as HTMLElement).style.color = pkg.featured ? "#000" : "var(--gold)";
        }}
      >
        {pkg.cta} →
      </a>
    </div>
  );
}

export function ServiciosContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { ref: pkgRef,  visible: pkgVisible  } = useReveal<HTMLDivElement>(0.05);
  const { ref: addRef,  visible: addVisible  } = useReveal<HTMLDivElement>(0.08);
  const { ref: faqRef,  visible: faqVisible  } = useReveal<HTMLDivElement>(0.08);
  const { ref: ctaRef,  visible: ctaVisible  } = useReveal<HTMLDivElement>(0.1);

  return (
    <>
      {/* ── Paquetes ── */}
      <section style={{
        background: "rgba(0,0,0,0.82)",
        backdropFilter: "blur(3px)",
        borderTop: "1px solid rgba(255,255,255,0.04)",
      }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(60px,8vw,100px) clamp(20px,4vw,60px)" }}>
          <div ref={pkgRef} className="servicios-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: "clamp(12px,1.5vw,20px)",
            alignItems: "start",
          }}>
            {PACKAGES.map((pkg, i) => (
              <PackageCard key={pkg.id} pkg={pkg} i={i} visible={pkgVisible} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Add-ons ── */}
      <section style={{
        background: "rgba(5,5,5,0.88)",
        backdropFilter: "blur(3px)",
        borderTop: "1px solid rgba(255,255,255,0.04)",
      }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(60px,8vw,100px) clamp(20px,4vw,60px)" }}>
          <div ref={addRef}>
            <div style={{
              fontFamily: "var(--font-dm)",
              fontSize: 11, letterSpacing: "3px",
              color: "var(--gold)", marginBottom: 16,
              opacity: addVisible ? 1 : 0,
              transition: "opacity 0.6s ease",
            }}>
              SERVICIOS ADICIONALES
            </div>
            <h2 style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(40px,5vw,64px)",
              letterSpacing: "-1px", color: "#fff", lineHeight: 1,
              marginBottom: "clamp(32px,4vw,52px)",
              opacity: addVisible ? 1 : 0,
              transform: addVisible ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 0.7s ease 80ms, transform 0.7s ease 80ms",
            }}>
              ADD-ONS & SERVICIOS PUNTUALES
            </h2>

            <div style={{ display: "flex", flexDirection: "column" }}>
              {ADDONS.map((a, i) => (
                <div key={a.name} style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  alignItems: "center",
                  gap: 32,
                  padding: "clamp(20px,2.5vw,32px) 0",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  opacity: addVisible ? 1 : 0,
                  transform: addVisible ? "translateX(0)" : "translateX(-20px)",
                  transition: `opacity 0.6s ease ${100 + i * 80}ms, transform 0.6s ease ${100 + i * 80}ms`,
                }}>
                  <div>
                    <div style={{
                      fontFamily: "var(--font-bebas)",
                      fontSize: "clamp(20px,2vw,28px)",
                      letterSpacing: "1px", color: "#fff",
                      marginBottom: 4,
                    }}>
                      {a.name}
                    </div>
                    <div style={{
                      fontFamily: "var(--font-dm)",
                      fontSize: 13, color: "var(--muted2)",
                    }}>
                      {a.desc}
                    </div>
                  </div>
                  <div style={{
                    fontFamily: "var(--font-bebas)",
                    fontSize: "clamp(22px,2.5vw,32px)",
                    letterSpacing: "-0.5px",
                    color: "var(--gold)",
                    flexShrink: 0,
                    textAlign: "right",
                  }}>
                    {a.price}
                  </div>
                </div>
              ))}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{
        background: "rgba(0,0,0,0.78)",
        backdropFilter: "blur(2px)",
        borderTop: "1px solid rgba(255,255,255,0.04)",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "clamp(60px,8vw,100px) clamp(20px,4vw,60px)" }}>
          <div ref={faqRef}>
            <div style={{
              fontFamily: "var(--font-dm)",
              fontSize: 11, letterSpacing: "3px",
              color: "var(--gold)", marginBottom: 16,
              opacity: faqVisible ? 1 : 0,
              transition: "opacity 0.6s ease",
            }}>
              PREGUNTAS FRECUENTES
            </div>
            <h2 style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(40px,5vw,64px)",
              letterSpacing: "-1px", color: "#fff", lineHeight: 1,
              marginBottom: "clamp(32px,4vw,52px)",
              opacity: faqVisible ? 1 : 0,
              transform: faqVisible ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 0.7s ease 80ms, transform 0.7s ease 80ms",
            }}>
              ANTES DE DECIDIR
            </h2>

            {FAQS.map((f, i) => (
              <div key={i} style={{
                borderTop: "1px solid rgba(255,255,255,0.06)",
                opacity: faqVisible ? 1 : 0,
                transition: `opacity 0.6s ease ${100 + i * 80}ms`,
              }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                  style={{
                    width: "100%", background: "none", border: "none",
                    cursor: "pointer",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "clamp(20px,2.5vw,28px) 0",
                    textAlign: "left", gap: 24,
                  }}
                >
                  <span style={{
                    fontFamily: "var(--font-bebas)",
                    fontSize: "clamp(20px,2.2vw,28px)",
                    letterSpacing: "0.5px", color: "#fff",
                  }}>
                    {f.q}
                  </span>
                  <span style={{
                    fontFamily: "var(--font-bebas)",
                    fontSize: 22, color: "var(--gold)", flexShrink: 0,
                    transform: openFaq === i ? "rotate(45deg)" : "rotate(0)",
                    transition: "transform .3s ease",
                    display: "inline-block",
                  }}>
                    +
                  </span>
                </button>
                <div style={{
                  maxHeight: openFaq === i ? "200px" : "0",
                  overflow: "hidden",
                  transition: "max-height .4s cubic-bezier(0.16,1,0.3,1)",
                }}>
                  <p style={{
                    fontFamily: "var(--font-dm)",
                    fontSize: 15, lineHeight: 1.7,
                    color: "var(--muted)",
                    paddingBottom: 24,
                  }}>
                    {f.a}
                  </p>
                </div>
              </div>
            ))}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />
          </div>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section style={{
        background: "rgba(8,8,8,0.90)",
        backdropFilter: "blur(4px)",
        borderTop: "1px solid var(--gold-dim)",
      }}>
        <div
          ref={ctaRef}
          style={{
            maxWidth: 1400, margin: "0 auto",
            padding: "clamp(60px,8vw,100px) clamp(20px,4vw,60px)",
            display: "flex", alignItems: "center",
            justifyContent: "space-between", gap: 40, flexWrap: "wrap",
            opacity: ctaVisible ? 1 : 0,
            transform: ctaVisible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          <div>
            <h2 style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(40px,5vw,68px)",
              letterSpacing: "-1px", color: "#fff", lineHeight: 1,
              marginBottom: 12,
            }}>
              ¿CUÁL ES EL TUYO?
            </h2>
            <p style={{
              fontFamily: "var(--font-dm)",
              fontSize: 16, color: "var(--muted)", maxWidth: 440,
            }}>
              Si no estás seguro, la Sesión Estratégica es el primer paso.
              Salimos con un mapa claro de qué necesitas exactamente.
            </p>
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a
              href="https://wa.me/573132947776?text=Hola%20Alexander%2C%20quiero%20saber%20qué%20servicio%20necesito"
              target="_blank" rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: 15, letterSpacing: "2px",
                background: "var(--gold)", color: "#000",
                padding: "16px 36px",
                transition: "opacity .2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = ".85")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              ESCRIBIR POR WHATSAPP →
            </a>
            <a
              href="/contacto"
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: 15, letterSpacing: "2px",
                border: "1px solid var(--gold-dim)",
                color: "var(--gold)",
                padding: "16px 36px",
                transition: "all .2s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = "var(--gold)";
                (e.currentTarget as HTMLElement).style.color = "#000";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.color = "var(--gold)";
              }}
            >
              VER CONTACTO
            </a>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .servicios-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .servicios-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
