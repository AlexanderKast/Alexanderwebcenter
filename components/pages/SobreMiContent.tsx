"use client";

import { useState } from "react";
import { useReveal } from "@/hooks/useReveal";
import { empresas } from "@/content/empresas";

const TIMELINE = [
  {
    year: "2018",
    title: "El comienzo",
    body: "Empecé en ecommerce sin saber nada. Primeros productos, primeros errores, primera prueba de que se podía construir algo desde cero.",
  },
  {
    year: "2020",
    title: "SICOMMER — el gran salto",
    body: "Co-fundé SICOMMER, que llegó a ser uno de los proveedores de dropshipping más grandes de Colombia. Dos años de operación real a escala.",
  },
  {
    year: "2022",
    title: "Expansión internacional",
    body: "Llevamos el modelo a Ecuador, República Dominicana y Perú. Proveeduría verificada, red de distribuidores, operaciones en 4 países.",
  },
  {
    year: "2024",
    title: "La crisis — el punto de quiebre",
    body: "El ciclo terminó. No fue falta de ideas — fue administración. Aprendí más en ese año que en los seis anteriores juntos. Vendí mi parte de SICOMMER a mi socio.",
  },
  {
    year: "2025",
    title: "La provisión — UGC Colombia y Kreoon",
    body: "Lo que Dios nos entregó a Diana y a mí para comenzar de nuevo. UGC Colombia nació como la empresa más activa del ecosistema. Kreoon, el marketplace de creadores que construí porque no existía nada así en español.",
  },
  {
    year: "2026",
    title: "AI-First — el nuevo norte",
    body: "Consultoría y un ecosistema que opera sin depender de mi presencia en todo. El sistema trabaja. Yo me enfoco en lo que solo yo puedo hacer.",
  },
];

const VALORES = [
  {
    n: "01",
    title: "FE COMO ANCLA",
    body: "No lo digo por decirlo. Mi fe es lo que me mantuvo cuando el negocio se cayó. Es lo que le da contexto a todo lo demás.",
  },
  {
    n: "02",
    title: "EJECUCIÓN SOBRE TEORÍA",
    body: "Tengo productos reales funcionando. Negocios reales con clientes reales. No vendo lo que nunca he hecho.",
  },
  {
    n: "03",
    title: "SISTEMAS, NO SUERTE",
    body: "Si depende de que yo esté presente, no es un negocio — es un trabajo. Construyo para que funcione sin mí.",
  },
  {
    n: "04",
    title: "HONESTIDAD RADICAL",
    body: "No embellezco los números. No escondo los fracasos. Eso es lo que hace que lo que comparto valga algo.",
  },
];

const MIS_NEGOCIOS = empresas
  .filter((e) => e.tipo === "actual" || e.tipo === "trayectoria")
  .map((e) => ({
    name: e.nombre.toUpperCase(),
    role: e.estado === "vendida" ? `${e.rol.toUpperCase()} (VENDIDA)` : e.rol.toUpperCase(),
    tag: e.tagline || e.descripcion,
  }));

const ACOMPAÑO = empresas
  .filter((e) => e.tipo === "cliente")
  .map((e) => ({
    name: e.nombre.toUpperCase(),
    role: e.estado === "cerrada" ? `${e.rol.toUpperCase()} · YA NO ACTIVO` : e.rol.toUpperCase(),
    tag: e.tagline || e.descripcion,
  }));

export function SobreMiContent() {
  const [photoOk, setPhotoOk] = useState(true);
  const { ref: storyRef,  visible: storyVisible  } = useReveal<HTMLDivElement>(0.05);
  const { ref: timeRef,   visible: timeVisible   } = useReveal<HTMLDivElement>(0.05);
  const { ref: valRef,    visible: valVisible    } = useReveal<HTMLDivElement>(0.05);
  const { ref: venRef,    visible: venVisible    } = useReveal<HTMLDivElement>(0.05);
  const { ref: ctaRef,    visible: ctaVisible    } = useReveal<HTMLDivElement>(0.1);

  return (
    <>
      {/* ── Historia + Foto ── */}
      <section style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(3px)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(60px,8vw,100px) clamp(20px,4vw,60px)" }}>
          <div ref={storyRef} className="sobre-grid" style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(32px,5vw,80px)",
            alignItems: "start",
          }}>
            {/* Texto */}
            <div style={{
              opacity: storyVisible ? 1 : 0,
              transform: storyVisible ? "translateX(0)" : "translateX(-28px)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
            }}>
              <blockquote style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "clamp(28px,3.5vw,44px)",
                letterSpacing: "-0.5px",
                color: "var(--gold)", lineHeight: 1.1,
                borderLeft: "3px solid var(--gold)",
                paddingLeft: 24,
                marginBottom: 40,
              }}>
                "Me dedico a servir a Dios a través del marketing digital, la estrategia de contenido e implementaciones con IA para negocios."
              </blockquote>

              {[
                "Soy Alexander Cast — Johan Alexander Castaño Céspedes. Paisa de Medellín, Diseñador Gráfico, Tecnólogo en Sistemas. Empecé en el ecommerce sin capital ni contactos, solo con la convicción de que se podía construir algo real desde cero.",
                "Co-fundé SICOMMER y la llevamos a ser uno de los proveedores de dropshipping más grandes de Colombia en dos años, liderando estrategia y comercial. También tuve tiendas propias (Kastore y otras) con más de $1M USD en ventas y más de $100K USD invertidos en Meta/Google Ads. En 2024 vendí mi parte de SICOMMER a mi socio, tras una crisis que me enseñó más que todos los éxitos anteriores — no fue falta de ideas, fue administración.",
                "UGC Colombia nació de esa crisis. Lo que Dios le entregó a Diana y a mí para comenzar de nuevo. Hoy es la empresa más activa de mi ecosistema. Kreoon lo construí porque no existía nada así en español — un marketplace de creadores + agencia 360 con IA hecho para LATAM.",
                "Hoy trabajo como consultor y estratega AI-First con emprendedores y marcas que quieren construir sistemas que funcionen sin que ellos estén presentes en todo. No vendo humo. Tengo los cicatrices y los resultados para probarlo.",
              ].map((p, i) => (
                <p key={i} style={{
                  fontFamily: "var(--font-dm)",
                  fontSize: 16, lineHeight: 1.75,
                  color: "var(--texto-suave)",
                  marginBottom: i < 3 ? 20 : 0,
                  opacity: storyVisible ? 1 : 0,
                  transition: `opacity 0.7s ease ${200 + i * 100}ms`,
                }}>
                  {p}
                </p>
              ))}

              {/* Credenciales */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 32 }}>
                {[
                  "Diseñador Gráfico",
                  "Tecnólogo en Sistemas",
                  "Co-host Casa Host",
                  "Feria Effix 2026",
                ].map(c => (
                  <span key={c} style={{
                    fontFamily: "var(--font-dm)",
                    fontSize: 11, letterSpacing: "1px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "var(--texto-tenue)",
                    padding: "5px 12px",
                  }}>
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Foto + Redes */}
            <div style={{
              opacity: storyVisible ? 1 : 0,
              transform: storyVisible ? "translateX(0)" : "translateX(28px)",
              transition: "opacity 0.8s ease 120ms, transform 0.8s ease 120ms",
              display: "flex", flexDirection: "column", gap: 20,
            }}>
              <div style={{
                position: "relative",
                aspectRatio: "3/4",
                maxHeight: 520,
                background: "rgba(17,17,17,0.9)",
                border: "1px solid rgba(255,255,255,0.06)",
                overflow: "hidden",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {photoOk && (
                  <img
                    src="/assets/images/section/alexander-foto.jpg"
                    alt="Alexander Cast"
                    style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", position: "relative", zIndex: 1 }}
                    onError={() => setPhotoOk(false)}
                  />
                )}
                {!photoOk && (
                  <div style={{
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", gap: 12,
                  }}>
                    <div style={{
                      width: 80, height: 80,
                      border: "1px solid var(--gold-dim)", borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <span style={{ fontFamily: "var(--font-bebas)", fontSize: 32, color: "var(--gold)", letterSpacing: 2 }}>AC</span>
                    </div>
                    <div style={{ fontFamily: "var(--font-dm)", fontSize: 11, letterSpacing: "2px", color: "var(--texto-tenue)" }}>
                      ALEXANDER CAST
                    </div>
                  </div>
                )}
                <div style={{ position: "absolute", bottom: 0, left: 0, width: 80, height: 3, background: "var(--gold)" }} />
              </div>

              {/* Redes */}
              <div style={{
                background: "rgba(17,17,17,0.9)",
                border: "1px solid rgba(255,255,255,0.06)",
                padding: 24,
                display: "flex", flexDirection: "column", gap: 12,
              }}>
                <div style={{ fontFamily: "var(--font-dm)", fontSize: 10, letterSpacing: "2px", color: "var(--texto-tenue)" }}>
                  ENCONTRARME EN
                </div>
                {[
                  { label: "INSTAGRAM / TIKTOK / LINKEDIN / YOUTUBE", href: "https://instagram.com/alexemprendee", platform: "@alexemprendee" },
                ].map(r => (
                  <a key={r.href} href={r.href} target="_blank" rel="noopener noreferrer"
                    style={{
                      fontFamily: "var(--font-bebas)",
                      fontSize: 15, letterSpacing: "1px",
                      color: "var(--texto-suave)",
                      display: "flex", alignItems: "center", gap: 8,
                      transition: "color .2s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--texto-suave)")}
                  >
                    <span style={{ color: "var(--gold)" }}>↗</span>
                    {r.platform}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section style={{ background: "rgba(5,5,5,0.88)", backdropFilter: "blur(3px)", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(60px,8vw,100px) clamp(20px,4vw,60px)" }}>
          <div ref={timeRef}>
            <div style={{
              fontFamily: "var(--font-dm)", fontSize: 11, letterSpacing: "3px",
              color: "var(--gold)", marginBottom: 16,
              opacity: timeVisible ? 1 : 0, transition: "opacity 0.6s ease",
            }}>
              HISTORIA
            </div>
            <h2 style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(40px,5vw,68px)",
              letterSpacing: "-1px", color: "#fff", lineHeight: 1,
              marginBottom: "clamp(40px,5vw,64px)",
              opacity: timeVisible ? 1 : 0,
              transform: timeVisible ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 0.7s ease 80ms, transform 0.7s ease 80ms",
            }}>
              EL CAMINO REAL
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {TIMELINE.map((t, i) => (
                <div key={t.year} style={{
                  display: "grid",
                  gridTemplateColumns: "80px 1fr",
                  gap: "clamp(24px,3vw,48px)",
                  paddingBottom: "clamp(24px,3vw,40px)",
                  opacity: timeVisible ? 1 : 0,
                  transform: timeVisible ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity 0.6s ease ${i * 80}ms, transform 0.6s ease ${i * 80}ms`,
                }}>
                  {/* Year */}
                  <div style={{ paddingTop: 4 }}>
                    <div style={{
                      fontFamily: "var(--font-bebas)",
                      fontSize: 13, letterSpacing: "2px",
                      color: "var(--gold)",
                    }}>
                      {t.year}
                    </div>
                    {/* Línea vertical */}
                    {i < TIMELINE.length - 1 && (
                      <div style={{
                        width: 1,
                        height: "100%",
                        minHeight: 40,
                        background: "var(--gold-dim)",
                        margin: "8px auto 0",
                      }} />
                    )}
                  </div>
                  {/* Content */}
                  <div>
                    <h3 style={{
                      fontFamily: "var(--font-bebas)",
                      fontSize: "clamp(22px,2.5vw,32px)",
                      letterSpacing: "0.5px", color: "#fff",
                      marginBottom: 8,
                    }}>
                      {t.title}
                    </h3>
                    <p style={{
                      fontFamily: "var(--font-dm)",
                      fontSize: 14, lineHeight: 1.7,
                      color: "var(--texto-suave)",
                    }}>
                      {t.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Valores ── */}
      <section style={{ background: "rgba(0,0,0,0.80)", backdropFilter: "blur(3px)", borderTop: "1px solid var(--gold-dim)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(60px,8vw,100px) clamp(20px,4vw,60px)" }}>
          <div ref={valRef}>
            <div style={{
              fontFamily: "var(--font-dm)", fontSize: 11, letterSpacing: "3px",
              color: "var(--gold)", marginBottom: 16,
              opacity: valVisible ? 1 : 0, transition: "opacity 0.6s ease",
            }}>
              POR QUÉ SOY DIFERENTE
            </div>
            <h2 style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(40px,5vw,68px)",
              letterSpacing: "-1px", color: "#fff", lineHeight: 1,
              marginBottom: "clamp(40px,5vw,64px)",
              opacity: valVisible ? 1 : 0,
              transform: valVisible ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 0.7s ease 80ms, transform 0.7s ease 80ms",
            }}>
              LO QUE ME DEFINE
            </h2>

            <div className="valores-grid" style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 1, background: "rgba(255,255,255,0.04)",
            }}>
              {VALORES.map((v, i) => (
                <div key={v.n} style={{
                  background: "rgba(5,5,5,0.95)",
                  padding: "clamp(24px,3vw,40px)",
                  opacity: valVisible ? 1 : 0,
                  transform: valVisible ? "translateY(0)" : "translateY(24px)",
                  transition: `opacity 0.6s ease ${i * 80}ms, transform 0.6s ease ${i * 80}ms`,
                }}>
                  <div style={{
                    width: 32, height: 2,
                    background: "var(--gold)",
                    marginBottom: 20,
                  }} />
                  <div style={{
                    fontFamily: "var(--font-dm)",
                    fontSize: 10, letterSpacing: "2px",
                    color: "var(--texto-tenue)", marginBottom: 12,
                  }}>
                    {v.n}
                  </div>
                  <h3 style={{
                    fontFamily: "var(--font-bebas)",
                    fontSize: "clamp(22px,2vw,28px)",
                    letterSpacing: "0.5px", color: "#fff",
                    marginBottom: 16, lineHeight: 1.1,
                  }}>
                    {v.title}
                  </h3>
                  <p style={{
                    fontFamily: "var(--font-dm)",
                    fontSize: 14, lineHeight: 1.7,
                    color: "var(--texto-suave)",
                  }}>
                    {v.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Ventures ── */}
      <section style={{ background: "rgba(5,5,5,0.90)", backdropFilter: "blur(3px)", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(60px,8vw,100px) clamp(20px,4vw,60px)" }}>
          <div ref={venRef}>
            <div style={{
              fontFamily: "var(--font-dm)", fontSize: 11, letterSpacing: "3px",
              color: "var(--gold)", marginBottom: 16,
              opacity: venVisible ? 1 : 0, transition: "opacity 0.6s ease",
            }}>
              MIS NEGOCIOS
            </div>
            <h2 style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(40px,5vw,68px)",
              letterSpacing: "-1px", color: "#fff", lineHeight: 1,
              marginBottom: "clamp(32px,4vw,48px)",
              opacity: venVisible ? 1 : 0,
              transform: venVisible ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 0.7s ease 80ms, transform 0.7s ease 80ms",
            }}>
              EL ECOSISTEMA
            </h2>

            <div className="negocios-grid" style={{
              display: "grid", gridTemplateColumns: "repeat(3,1fr)",
              gap: 1, background: "rgba(255,255,255,0.04)",
              marginBottom: "clamp(32px,4vw,52px)",
            }}>
              {MIS_NEGOCIOS.map((v, i) => (
                <div key={v.name} style={{
                  background: "rgba(5,5,5,0.95)",
                  padding: "clamp(20px,2.5vw,32px)",
                  borderLeft: "2px solid var(--gold-dim)",
                  opacity: venVisible ? 1 : 0,
                  transform: venVisible ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity 0.6s ease ${i * 60}ms, transform 0.6s ease ${i * 60}ms`,
                }}>
                  <div style={{ fontFamily: "var(--font-bebas)", fontSize: 17, letterSpacing: "1.5px", color: "#fff", marginBottom: 4 }}>{v.name}</div>
                  <div style={{ fontFamily: "var(--font-dm)", fontSize: 10, letterSpacing: "1.5px", color: "var(--gold)", marginBottom: 8 }}>{v.role}</div>
                  <div style={{ fontFamily: "var(--font-dm)", fontSize: 12, color: "var(--texto-tenue)" }}>{v.tag}</div>
                </div>
              ))}
            </div>

            <div style={{
              fontFamily: "var(--font-dm)", fontSize: 11, letterSpacing: "3px",
              color: "var(--texto-tenue)", marginBottom: 20,
              opacity: venVisible ? 1 : 0,
              transition: "opacity 0.6s ease 300ms",
            }}>
              EMPRESAS QUE ACOMPAÑO
            </div>

            <div className="alianzas-grid" style={{
              display: "grid", gridTemplateColumns: "repeat(4,1fr)",
              gap: 1, background: "rgba(255,255,255,0.02)",
            }}>
              {ACOMPAÑO.map((v, i) => (
                <div key={v.name} style={{
                  background: "rgba(8,8,8,0.95)",
                  padding: "clamp(16px,2vw,28px)",
                  opacity: venVisible ? 1 : 0,
                  transform: venVisible ? "translateY(0)" : "translateY(16px)",
                  transition: `opacity 0.6s ease ${360 + i * 60}ms, transform 0.6s ease ${360 + i * 60}ms`,
                }}>
                  <div style={{ fontFamily: "var(--font-bebas)", fontSize: 15, letterSpacing: "1px", color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>{v.name}</div>
                  <div style={{ fontFamily: "var(--font-dm)", fontSize: 10, letterSpacing: "1.5px", color: "var(--texto-tenue)" }}>{v.role}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(4px)", borderTop: "1px solid var(--gold-dim)" }}>
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
              letterSpacing: "-1px", color: "#fff", lineHeight: 1, marginBottom: 12,
            }}>
              ¿TRABAJAMOS JUNTOS?
            </h2>
            <p style={{ fontFamily: "var(--font-dm)", fontSize: 16, color: "var(--texto-suave)", maxWidth: 400 }}>
              Si lo que leíste tiene sentido con lo que buscas, hablemos.
            </p>
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a
              href="https://wa.me/573132947776"
              target="_blank" rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-bebas)", fontSize: 15, letterSpacing: "2px",
                background: "var(--gold)", color: "#000", padding: "16px 36px",
                transition: "opacity .2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = ".85")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              ESCRIBIR POR WHATSAPP →
            </a>
            <a href="/servicios" style={{
              fontFamily: "var(--font-bebas)", fontSize: 15, letterSpacing: "2px",
              border: "1px solid var(--gold-dim)", color: "var(--gold)", padding: "16px 36px",
              transition: "all .2s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--gold)"; (e.currentTarget as HTMLElement).style.color = "#000"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--gold)"; }}
            >
              VER SERVICIOS
            </a>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .sobre-grid   { grid-template-columns: 1fr !important; }
          .valores-grid { grid-template-columns: repeat(2,1fr) !important; }
          .negocios-grid { grid-template-columns: repeat(2,1fr) !important; }
          .alianzas-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 600px) {
          .valores-grid  { grid-template-columns: 1fr !important; }
          .negocios-grid { grid-template-columns: 1fr !important; }
          .alianzas-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
