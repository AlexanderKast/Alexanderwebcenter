"use client";

import { useState } from "react";
import { useReveal } from "@/hooks/useReveal";

const WHATSAPP_NUMBER = "573132947776";
const EMAIL_PRINCIPAL = "founder@kreoon.com";

const CONTACT_OPTIONS = [
  {
    icon: "💬",
    label: "WHATSAPP",
    title: "Respuesta en menos de 24h",
    desc: "Para proyectos concretos, propuestas comerciales o consultas sobre servicios.",
    cta: "Escribir por WhatsApp",
    href: `https://wa.me/${WHATSAPP_NUMBER}?text=Hola%20Alexander%2C%20me%20interesa%20hablar%20sobre%20%5Btu%20proyecto%5D`,
    primary: true,
  },
  {
    icon: "✉️",
    label: "CORREO",
    title: "Para propuestas formales",
    desc: "Presentaciones de marca, partnerships y colaboraciones que requieran documentación.",
    cta: EMAIL_PRINCIPAL,
    href: `mailto:${EMAIL_PRINCIPAL}`,
    primary: false,
  },
];

const FAQS = [
  {
    q: "¿Trabajas con empresas de cualquier tamaño?",
    a: "Sí, pero me especializo en negocios en etapa de crecimiento: entre $5K y $150K MRR. Empresas que ya validaron su oferta y necesitan escalar con estrategia y sistemas.",
  },
  {
    q: "¿Cuánto tiempo toma ver resultados?",
    a: "Depende del servicio. Una sesión estratégica da claridad inmediata. Un paquete de implementación tarda 60–90 días en mostrar métricas concretas. No prometo resultados de un día para otro.",
  },
  {
    q: "¿Trabajas con clientes fuera de Colombia?",
    a: "Sí. La mayoría de mis clientes están en LATAM — México, Argentina, Ecuador, España. Trabajo 100% remoto.",
  },
  {
    q: "¿Qué necesito preparar antes de contactarte?",
    a: "Nada formal. Con una descripción breve de tu negocio y lo que quieres resolver es suficiente para una primera conversación.",
  },
];

const SOCIAL_LINKS = [
  { name: "Instagram",  handle: "@alexemprendee",      href: "https://instagram.com/alexemprendee",      icon: "📷" },
  { name: "LinkedIn",   handle: "Alexander Cast",       href: "https://linkedin.com/in/alexandercast",    icon: "💼" },
  { name: "TikTok",     handle: "@alexemprendee",      href: "https://tiktok.com/@alexemprendee",        icon: "🎵" },
  { name: "YouTube",    handle: "Alexander Cast",       href: "https://youtube.com/@alexcast",            icon: "▶️" },
];

export function ContactoContent() {
  const [openFaq, setOpenFaq]         = useState<number | null>(null);
  const [formData, setFormData]       = useState({ name: "", email: "", project: "", message: "" });
  const [sent, setSent]               = useState(false);

  const { ref: topRef,    visible: topVisible    } = useReveal<HTMLDivElement>(0.05);
  const { ref: faqRef,    visible: faqVisible    } = useReveal<HTMLDivElement>(0.05);
  const { ref: socialRef, visible: socialVisible } = useReveal<HTMLDivElement>(0.05);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    /* 🔧 Conectar con Formspree o n8n webhook */
    setSent(true);
  };

  return (
    <>
      {/* ── Opciones de contacto + Formulario ── */}
      <section style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(3px)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(60px,8vw,100px) clamp(20px,4vw,60px)" }}>
          <div
            ref={topRef}
            className="contacto-grid"
            style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "clamp(32px,5vw,80px)", alignItems: "start" }}
          >
            {/* Columna izquierda — opciones */}
            <div>
              <div style={{
                fontFamily: "var(--font-dm)", fontSize: 11, letterSpacing: "3px",
                color: "var(--gold)", marginBottom: 16,
                opacity: topVisible ? 1 : 0, transition: "opacity 0.6s ease",
              }}>
                ELIGE TU CANAL
              </div>
              <h2 style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "clamp(36px,4.5vw,60px)",
                letterSpacing: "-1px", color: "#fff", lineHeight: 1,
                marginBottom: "clamp(28px,4vw,44px)",
                opacity: topVisible ? 1 : 0,
                transform: topVisible ? "translateY(0)" : "translateY(24px)",
                transition: "opacity 0.7s ease 80ms, transform 0.7s ease 80ms",
              }}>
                HABLEMOS
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {CONTACT_OPTIONS.map((opt, i) => (
                  <a
                    key={opt.label}
                    href={opt.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex", gap: 20, alignItems: "flex-start",
                      padding: "clamp(20px,2.5vw,32px)",
                      background: opt.primary ? "rgba(201,168,76,0.06)" : "rgba(12,12,12,0.95)",
                      border: `1px solid ${opt.primary ? "var(--gold)" : "rgba(255,255,255,0.07)"}`,
                      position: "relative", overflow: "hidden",
                      cursor: "pointer",
                      opacity: topVisible ? 1 : 0,
                      transform: topVisible ? "translateY(0)" : "translateY(20px)",
                      transition: `opacity 0.7s ease ${200 + i * 100}ms, transform 0.7s ease ${200 + i * 100}ms`,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--gold)")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = opt.primary ? "var(--gold)" : "rgba(255,255,255,0.07)")}
                  >
                    {opt.primary && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "var(--gold)" }} />}
                    <span style={{ fontSize: 24, flexShrink: 0 }}>{opt.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "var(--font-dm)", fontSize: 10, letterSpacing: "2px", color: "var(--gold)", marginBottom: 6 }}>
                        {opt.label}
                      </div>
                      <div style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(16px,1.8vw,22px)", letterSpacing: "0.5px", color: "#fff", marginBottom: 8 }}>
                        {opt.title}
                      </div>
                      <p style={{ fontFamily: "var(--font-dm)", fontSize: 13, lineHeight: 1.6, color: "var(--muted)", marginBottom: 14 }}>
                        {opt.desc}
                      </p>
                      <div style={{ fontFamily: "var(--font-bebas)", fontSize: 13, letterSpacing: "2px", color: "var(--gold)" }}>
                        {opt.cta} ↗
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              {/* Nota de respuesta */}
              <div style={{
                marginTop: 24,
                padding: "16px 20px",
                border: "1px solid rgba(255,255,255,0.06)",
                opacity: topVisible ? 1 : 0,
                transition: "opacity 0.7s ease 500ms",
              }}>
                <p style={{ fontFamily: "var(--font-dm)", fontSize: 12, lineHeight: 1.7, color: "var(--muted2)" }}>
                  ⏱ Respondo personalmente en menos de 24h hábiles. Si tu proyecto es urgente,
                  menciona <em style={{ color: "var(--gold)" }}>urgente</em> al inicio del mensaje.
                </p>
              </div>
            </div>

            {/* Columna derecha — formulario */}
            <div style={{
              opacity: topVisible ? 1 : 0,
              transform: topVisible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.8s ease 300ms, transform 0.8s ease 300ms",
            }}>
              <div style={{
                background: "rgba(12,12,12,0.95)",
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "clamp(28px,3.5vw,48px)",
              }}>
                <div style={{ fontFamily: "var(--font-bebas)", fontSize: 18, letterSpacing: "1px", color: "#fff", marginBottom: 28 }}>
                  CUÉNTAME TU PROYECTO
                </div>

                {sent ? (
                  <div style={{ textAlign: "center", padding: "40px 0" }}>
                    <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
                    <div style={{ fontFamily: "var(--font-bebas)", fontSize: 22, letterSpacing: "1px", color: "var(--gold)", marginBottom: 10 }}>
                      MENSAJE RECIBIDO
                    </div>
                    <p style={{ fontFamily: "var(--font-dm)", fontSize: 14, color: "var(--muted)" }}>
                      Te respondo en menos de 24h.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <div>
                        <label style={{ fontFamily: "var(--font-dm)", fontSize: 11, letterSpacing: "1.5px", color: "var(--muted2)", display: "block", marginBottom: 8 }}>
                          NOMBRE *
                        </label>
                        <input
                          type="text" required
                          value={formData.name}
                          onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                          placeholder="Tu nombre"
                          style={{
                            width: "100%", fontFamily: "var(--font-dm)", fontSize: 14,
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "#fff", padding: "12px 16px", outline: "none",
                            boxSizing: "border-box",
                          }}
                          onFocus={e => (e.currentTarget.style.borderColor = "var(--gold)")}
                          onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                        />
                      </div>
                      <div>
                        <label style={{ fontFamily: "var(--font-dm)", fontSize: 11, letterSpacing: "1.5px", color: "var(--muted2)", display: "block", marginBottom: 8 }}>
                          CORREO *
                        </label>
                        <input
                          type="email" required
                          value={formData.email}
                          onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                          placeholder="tu@correo.com"
                          style={{
                            width: "100%", fontFamily: "var(--font-dm)", fontSize: 14,
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "#fff", padding: "12px 16px", outline: "none",
                            boxSizing: "border-box",
                          }}
                          onFocus={e => (e.currentTarget.style.borderColor = "var(--gold)")}
                          onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontFamily: "var(--font-dm)", fontSize: 11, letterSpacing: "1.5px", color: "var(--muted2)", display: "block", marginBottom: 8 }}>
                        ¿QUÉ NECESITAS?
                      </label>
                      <select
                        value={formData.project}
                        onChange={e => setFormData(p => ({ ...p, project: e.target.value }))}
                        style={{
                          width: "100%", fontFamily: "var(--font-dm)", fontSize: 14,
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: formData.project ? "#fff" : "rgba(255,255,255,0.4)",
                          padding: "12px 16px", outline: "none",
                          cursor: "pointer",
                          boxSizing: "border-box",
                        }}
                        onFocus={e => (e.currentTarget.style.borderColor = "var(--gold)")}
                        onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                      >
                        <option value="" style={{ background: "#111" }}>Selecciona una opción</option>
                        <option value="sesion" style={{ background: "#111" }}>Sesión Estratégica</option>
                        <option value="inicial" style={{ background: "#111" }}>Paquete Inicial</option>
                        <option value="growth" style={{ background: "#111" }}>Paquete Growth</option>
                        <option value="scale" style={{ background: "#111" }}>Paquete Scale</option>
                        <option value="live" style={{ background: "#111" }}>Setup Live Shopping</option>
                        <option value="otro" style={{ background: "#111" }}>Otro / No sé aún</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontFamily: "var(--font-dm)", fontSize: 11, letterSpacing: "1.5px", color: "var(--muted2)", display: "block", marginBottom: 8 }}>
                        CUÉNTAME MÁS
                      </label>
                      <textarea
                        rows={5}
                        value={formData.message}
                        onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                        placeholder="¿En qué etapa está tu negocio? ¿Qué quieres lograr?"
                        style={{
                          width: "100%", fontFamily: "var(--font-dm)", fontSize: 14,
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "#fff", padding: "12px 16px", outline: "none",
                          resize: "vertical", lineHeight: 1.6,
                          boxSizing: "border-box",
                        }}
                        onFocus={e => (e.currentTarget.style.borderColor = "var(--gold)")}
                        onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                      />
                    </div>

                    <button
                      type="submit"
                      style={{
                        fontFamily: "var(--font-bebas)", fontSize: 14, letterSpacing: "2.5px",
                        background: "var(--gold)", color: "#000", border: "none",
                        padding: "16px 32px", cursor: "pointer", marginTop: 8,
                        alignSelf: "flex-start",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = ".85")}
                      onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                    >
                      ENVIAR MENSAJE →
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ background: "rgba(5,5,5,0.88)", backdropFilter: "blur(3px)", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(60px,8vw,100px) clamp(20px,4vw,60px)" }}>
          <div ref={faqRef}>
            <div style={{
              fontFamily: "var(--font-dm)", fontSize: 11, letterSpacing: "3px",
              color: "var(--gold)", marginBottom: 16,
              opacity: faqVisible ? 1 : 0, transition: "opacity 0.6s ease",
            }}>
              ANTES DE ESCRIBIR
            </div>
            <h2 style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(36px,4.5vw,60px)",
              letterSpacing: "-1px", color: "#fff", lineHeight: 1,
              marginBottom: "clamp(32px,4vw,52px)",
              opacity: faqVisible ? 1 : 0,
              transform: faqVisible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.7s ease 80ms, transform 0.7s ease 80ms",
            }}>
              PREGUNTAS FRECUENTES
            </h2>

            <div className="faq-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(12px,1.5vw,20px)" }}>
              {FAQS.map((faq, i) => (
                <div
                  key={i}
                  style={{
                    background: "rgba(12,12,12,0.95)",
                    border: `1px solid ${openFaq === i ? "var(--gold)" : "rgba(255,255,255,0.07)"}`,
                    overflow: "hidden",
                    opacity: faqVisible ? 1 : 0,
                    transform: faqVisible ? "translateY(0)" : "translateY(20px)",
                    transition: `opacity 0.6s ease ${i * 80}ms, transform 0.6s ease ${i * 80}ms, border-color 0.2s`,
                    cursor: "pointer",
                  }}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "clamp(16px,2vw,24px)",
                    gap: 16,
                  }}>
                    <span style={{
                      fontFamily: "var(--font-bebas)", fontSize: "clamp(15px,1.5vw,18px)",
                      letterSpacing: "0.5px", color: "#fff", lineHeight: 1.3,
                    }}>
                      {faq.q}
                    </span>
                    <span style={{
                      color: "var(--gold)", fontSize: 18, flexShrink: 0,
                      transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                      display: "inline-block",
                    }}>
                      +
                    </span>
                  </div>
                  {openFaq === i && (
                    <div style={{
                      padding: "0 clamp(16px,2vw,24px) clamp(16px,2vw,24px)",
                      fontFamily: "var(--font-dm)", fontSize: 14, lineHeight: 1.7, color: "var(--muted)",
                    }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Redes Sociales ── */}
      <section style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(4px)", borderTop: "1px solid var(--gold-dim)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(60px,8vw,100px) clamp(20px,4vw,60px)" }}>
          <div ref={socialRef} style={{ textAlign: "center" }}>
            <div style={{
              fontFamily: "var(--font-dm)", fontSize: 11, letterSpacing: "3px",
              color: "var(--gold)", marginBottom: 16,
              opacity: socialVisible ? 1 : 0, transition: "opacity 0.6s ease",
            }}>
              TAMBIÉN ESTOY EN
            </div>
            <h2 style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(32px,4vw,52px)",
              letterSpacing: "-0.5px", color: "#fff", lineHeight: 1,
              marginBottom: "clamp(32px,4vw,52px)",
              opacity: socialVisible ? 1 : 0,
              transform: socialVisible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.7s ease 80ms, transform 0.7s ease 80ms",
            }}>
              SÍGUEME EN REDES
            </h2>

            <div className="social-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "clamp(12px,1.5vw,20px)", maxWidth: 900, margin: "0 auto" }}>
              {SOCIAL_LINKS.map((s, i) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    gap: 12, padding: "clamp(20px,2.5vw,32px)",
                    background: "rgba(12,12,12,0.95)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    cursor: "pointer",
                    opacity: socialVisible ? 1 : 0,
                    transform: socialVisible ? "translateY(0)" : "translateY(20px)",
                    transition: `opacity 0.6s ease ${i * 80}ms, transform 0.6s ease ${i * 80}ms`,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--gold)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
                >
                  <span style={{ fontSize: 28 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontFamily: "var(--font-bebas)", fontSize: 15, letterSpacing: "1px", color: "#fff", marginBottom: 4 }}>
                      {s.name}
                    </div>
                    <div style={{ fontFamily: "var(--font-dm)", fontSize: 11, color: "var(--muted2)" }}>
                      {s.handle}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .contacto-grid { grid-template-columns: 1fr !important; }
          .faq-grid      { grid-template-columns: 1fr !important; }
          .social-grid   { grid-template-columns: repeat(2,1fr) !important; }
          .form-row      { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
