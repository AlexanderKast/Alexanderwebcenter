"use client";

import { useState } from "react";
import { useReveal } from "@/hooks/useReveal";

const SERVICIOS_OPTIONS = [
  "Sesión Estratégica ($300-400)",
  "Sesión Implementación ($500-600)",
  "Paquete Inicial ($1,200)",
  "Paquete Growth ($2,500)",
  "Paquete Scale ($4,500)",
  "Retainer Mensual ($2,000-3,000)",
  "UGC Colombia — Agencia",
  "Auditoría IA ($800)",
  "Otro / Explorar opciones",
];

export function HomeContacto() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    servicio: "",
    mensaje: "",
  });
  const [sent, setSent]     = useState(false);
  const [loading, setLoading] = useState(false);

  const { ref: secRef,  visible: secVisible  } = useReveal<HTMLElement>(0.08);
  const { ref: formRef, visible: formVisible } = useReveal<HTMLDivElement>(0.08);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    /* 🔧 Reemplazar la URL con tu Formspree o n8n webhook:
       const res = await fetch("https://formspree.io/f/XXXXXXX", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(form),
       });
    */
    await new Promise(r => setTimeout(r, 900)); // Simula el envío
    setLoading(false);
    setSent(true);
  };

  const INPUT_STYLE: React.CSSProperties = {
    fontFamily: "var(--font-dm)",
    fontSize: 14,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#fff",
    padding: "14px 18px",
    outline: "none",
    width: "100%",
    transition: "border-color .2s",
  };

  return (
    <section
      id="contacto"
      ref={secRef}
      style={{
        position: "relative",
        background: "rgba(0,0,0,0.88)",
        backdropFilter: "blur(6px)",
        borderTop: "1px solid var(--gold-dim)",
        overflow: "hidden",
      }}
    >
      {/* Decorative radial gold glow */}
      <div style={{
        position: "absolute",
        top: "50%", right: "-10%",
        transform: "translateY(-50%)",
        width: 500, height: 500,
        background: "radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />

      <div style={{
        maxWidth: 1400, margin: "0 auto",
        padding: "clamp(60px,8vw,100px) clamp(20px,4vw,60px)",
        position: "relative", zIndex: 1,
      }}>

        {/* Header */}
        <div style={{ marginBottom: "clamp(48px,6vw,72px)" }}>
          <div style={{
            fontFamily: "var(--font-dm)",
            fontSize: 12, letterSpacing: "1.8px",
            color: "var(--gold)", marginBottom: 16,
            opacity: secVisible ? 1 : 0,
            transform: secVisible ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}>
            HABLEMOS
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
              TRABAJEMOS JUNTOS
            </h2>
          </div>
        </div>

        {/* 2-col layout */}
        <div
          className="contacto-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(32px,6vw,96px)",
            alignItems: "start",
          }}
        >
          {/* Left: info + CTAs primarios */}
          <div style={{
            opacity: secVisible ? 1 : 0,
            transform: secVisible ? "translateX(0)" : "translateX(-24px)",
            transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1) 100ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) 100ms",
          }}>
            <p style={{
              fontFamily: "var(--font-dm)",
              fontSize: "clamp(16px,1.8vw,20px)",
              lineHeight: 1.7,
              color: "var(--texto-suave)",
              marginBottom: 40,
              maxWidth: 440,
            }}>
              Si quieres que revisemos juntos tu negocio y diseñemos una estrategia real,
              agenda una sesión. Si prefieres explorar primero, escríbeme al WhatsApp.
            </p>

            {/* Primary CTA: WhatsApp */}
            <a
              href="https://wa.me/573132947776?text=Hola%20Alexander%2C%20vi%20tu%20página%20y%20quiero%20conocer%20tus%20servicios"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                background: "#25D366",
                color: "#000",
                padding: "16px 28px",
                fontFamily: "var(--font-bebas)",
                fontSize: 16, letterSpacing: "2px",
                marginBottom: 16,
                transition: "opacity .2s",
                width: "fit-content",
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#000">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              ESCRIBIR POR WHATSAPP
            </a>

            {/* Secondary CTA: Calendly */}
            <a
              href="https://calendly.com/alexemprendee"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                border: "1px solid var(--gold)",
                color: "var(--gold)",
                padding: "14px 28px",
                fontFamily: "var(--font-bebas)",
                fontSize: 14, letterSpacing: "2px",
                marginBottom: 40,
                transition: "all .2s",
                width: "fit-content",
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
              📅 AGENDAR SESIÓN ESTRATÉGICA
            </a>

            {/* Divider */}
            <div style={{
              height: 1,
              background: "rgba(255,255,255,0.06)",
              marginBottom: 32,
            }} />

            {/* Contact info */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{
                fontFamily: "var(--font-dm)",
                fontSize: 12, letterSpacing: "1.8px",
                color: "var(--texto-tenue)",
              }}>
                TAMBIÉN PUEDES ESCRIBIRME A:
              </div>

              <a
                href="mailto:founder@kreoon.com"
                style={{
                  fontFamily: "var(--font-dm)",
                  fontSize: 15,
                  color: "var(--texto-suave)",
                  display: "flex", alignItems: "center", gap: 8,
                  transition: "color .2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--texto-suave)")}
              >
                <span style={{ color: "var(--gold)", fontSize: 12 }}>✉</span>
                founder@kreoon.com
              </a>

              <a
                href="https://instagram.com/alexemprendee"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "var(--font-dm)",
                  fontSize: 15,
                  color: "var(--texto-suave)",
                  display: "flex", alignItems: "center", gap: 8,
                  transition: "color .2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--texto-suave)")}
              >
                <span style={{ color: "var(--gold)", fontSize: 12 }}>↗</span>
                @alexemprendee
              </a>
            </div>

            {/* Location note */}
            <div style={{
              marginTop: 32,
              fontFamily: "var(--font-dm)",
              fontSize: 12, letterSpacing: "1.8px",
              color: "var(--texto-tenue)",
            }}>
              📍 MEDELLÍN, COLOMBIA — ATIENDO TODA LATAM
            </div>
          </div>

          {/* Right: form */}
          <div
            ref={formRef}
            style={{
              opacity: formVisible ? 1 : 0,
              transform: formVisible ? "translateX(0)" : "translateX(24px)",
              transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1) 150ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) 150ms",
            }}
          >
            <div style={{
              background: "rgba(17,17,17,0.9)",
              border: "1px solid rgba(255,255,255,0.06)",
              padding: "clamp(28px,3.5vw,48px)",
            }}>
              <div style={{
                fontFamily: "var(--font-bebas)",
                fontSize: 20, letterSpacing: "1px",
                color: "#fff", marginBottom: 28,
              }}>
                CUÉNTAME UN POCO
              </div>

              {sent ? (
                <div style={{
                  textAlign: "center",
                  padding: "48px 0",
                }}>
                  <div style={{
                    fontFamily: "var(--font-bebas)",
                    fontSize: 48, color: "var(--gold)",
                    letterSpacing: "-1px", marginBottom: 16,
                  }}>
                    ✓ RECIBIDO
                  </div>
                  <p style={{
                    fontFamily: "var(--font-dm)",
                    fontSize: 15, lineHeight: 1.7,
                    color: "var(--texto-suave)",
                  }}>
                    Gracias. Te respondo en menos de 24 horas.
                    Mientras tanto, sígueme en{" "}
                    <a href="https://instagram.com/alexemprendee" target="_blank" rel="noopener noreferrer"
                      style={{ color: "var(--gold)", textDecoration: "none" }}>
                      @alexemprendee
                    </a>
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={{
                        fontFamily: "var(--font-dm)",
                        fontSize: 12, letterSpacing: "1.8px",
                        color: "var(--texto-tenue)", display: "block", marginBottom: 6,
                      }}>
                        NOMBRE *
                      </label>
                      <input
                        type="text"
                        value={form.nombre}
                        onChange={set("nombre")}
                        required
                        placeholder="Tu nombre"
                        style={INPUT_STYLE}
                        onFocus={e => (e.currentTarget.style.borderColor = "var(--gold)")}
                        onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                      />
                    </div>
                    <div>
                      <label style={{
                        fontFamily: "var(--font-dm)",
                        fontSize: 12, letterSpacing: "1.8px",
                        color: "var(--texto-tenue)", display: "block", marginBottom: 6,
                      }}>
                        EMAIL *
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={set("email")}
                        required
                        placeholder="tu@correo.com"
                        style={INPUT_STYLE}
                        onFocus={e => (e.currentTarget.style.borderColor = "var(--gold)")}
                        onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{
                      fontFamily: "var(--font-dm)",
                      fontSize: 12, letterSpacing: "1.8px",
                      color: "var(--texto-tenue)", display: "block", marginBottom: 6,
                    }}>
                      ¿EN QUÉ TE PUEDO AYUDAR?
                    </label>
                    <select
                      value={form.servicio}
                      onChange={set("servicio")}
                      style={{
                        ...INPUT_STYLE,
                        appearance: "none",
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 7L11 1' stroke='%23C9A84C' stroke-width='1.5'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 16px center",
                        cursor: "pointer",
                      }}
                      onFocus={e => (e.currentTarget.style.borderColor = "var(--gold)")}
                      onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                    >
                      <option value="" style={{ background: "#111" }}>Selecciona una opción...</option>
                      {SERVICIOS_OPTIONS.map(o => (
                        <option key={o} value={o} style={{ background: "#111" }}>{o}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{
                      fontFamily: "var(--font-dm)",
                      fontSize: 12, letterSpacing: "1.8px",
                      color: "var(--texto-tenue)", display: "block", marginBottom: 6,
                    }}>
                      MENSAJE
                    </label>
                    <textarea
                      value={form.mensaje}
                      onChange={set("mensaje")}
                      rows={4}
                      placeholder="Cuéntame sobre tu negocio y lo que buscas lograr..."
                      style={{
                        ...INPUT_STYLE,
                        resize: "vertical",
                        minHeight: 100,
                      }}
                      onFocus={e => (e.currentTarget.style.borderColor = "var(--gold)")}
                      onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      fontFamily: "var(--font-bebas)",
                      fontSize: 15, letterSpacing: "3px",
                      background: loading ? "rgba(201,168,76,0.5)" : "var(--gold)",
                      color: "#000",
                      border: "none",
                      padding: "16px 32px",
                      cursor: loading ? "not-allowed" : "pointer",
                      transition: "opacity .2s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                    onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.opacity = "0.88"; }}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
                  >
                    {loading ? "ENVIANDO..." : "ENVIAR MENSAJE →"}
                  </button>

                  <p style={{
                    fontFamily: "var(--font-dm)",
                    fontSize: 12, color: "var(--texto-tenue)",
                    textAlign: "center",
                  }}>
                    Respondo en menos de 24 horas · Sin spam
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contacto-grid { grid-template-columns: 1fr !important; }
          .form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
