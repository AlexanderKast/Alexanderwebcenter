"use client";

import { useState } from "react";
import { useReveal } from "@/hooks/useReveal";
import { empresas } from "@/content/empresas";
import { site } from "@/content/site";

const MIS_NEGOCIOS = empresas
  .filter((e) => e.tipo === "actual" || e.tipo === "trayectoria")
  .map((e) => ({
    name: e.nombre.toUpperCase(),
    role: e.estado === "vendida" ? `${e.rol.toUpperCase()} (VENDIDA)` : e.rol.toUpperCase(),
    tag: e.tagline || e.descripcion,
  }));

const CLIENTES_ALIANZAS = empresas
  .filter((e) => e.tipo === "cliente")
  .map((e) => ({
    name: e.nombre.toUpperCase(),
    role: e.estado === "cerrada" ? `${e.rol.toUpperCase()} · YA NO ACTIVO` : e.rol.toUpperCase(),
    tag: e.tagline || e.descripcion,
  }));

const STATS = [
  { n: `${site.metricas.aniosConstruyendo}+`, label: "años en negocios digitales" },
  { n: `${MIS_NEGOCIOS.length}`,              label: "ventures propios construidos" },
  { n: "4",                                    label: "países: CO, EC, RD, PE" },
  { n: `${CLIENTES_ALIANZAS.length}+`,        label: "empresas asesoradas activas" },
];

export function HomeSobreMi() {
  const [photoOk, setPhotoOk]                      = useState(true);
  const { ref: secRef,    visible: secVisible }    = useReveal<HTMLElement>(0.08);
  const { ref: storyRef,  visible: storyVisible }  = useReveal<HTMLDivElement>(0.1);
  const { ref: venRef,    visible: venVisible }    = useReveal<HTMLDivElement>(0.08);

  return (
    <section
      id="sobre-mi"
      ref={secRef}
      style={{
        position: "relative",
        background: "rgba(5,5,5,0.82)",
        backdropFilter: "blur(4px)",
        borderTop: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div style={{
        maxWidth: 1400, margin: "0 auto",
        padding: "clamp(60px,8vw,100px) clamp(20px,4vw,60px)",
      }}>

        {/* Header */}
        <div style={{ marginBottom: "clamp(48px,6vw,80px)" }}>
          <div style={{
            fontFamily: "var(--font-dm)",
            fontSize: 11, letterSpacing: "3px",
            color: "var(--gold)", marginBottom: 16,
            opacity: secVisible ? 1 : 0,
            transform: secVisible ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}>
            QUIÉN SOY
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
              SOBRE MÍ
            </h2>
          </div>
        </div>

        {/* Main grid: story + photo */}
        <div
          ref={storyRef}
          className="sobre-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(32px,5vw,80px)",
            alignItems: "start",
            marginBottom: "clamp(48px,7vw,96px)",
          }}
        >
          {/* Story column */}
          <div style={{
            opacity: storyVisible ? 1 : 0,
            transform: storyVisible ? "translateX(0)" : "translateX(-32px)",
            transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)",
          }}>
            {/* Kicker */}
            <div style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(34px,4vw,52px)",
              letterSpacing: "-0.5px",
              color: "#fff", lineHeight: 1.1,
              marginBottom: 32,
            }}>
              Paisa de Medellín con{" "}
              <span style={{ color: "var(--gold)" }}>8+ años</span>
              {" "}construyendo negocios digitales en LATAM.
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <p style={{
                fontFamily: "var(--font-dm)",
                fontSize: 16, lineHeight: 1.75,
                color: "var(--muted)",
              }}>
                Empecé en el ecommerce sin saber nada. Co-fundé SICOMMER — llegamos a ser
                uno de los proveedores de dropshipping más grandes de Colombia — y en 2024 vendí mi parte a mi socio.
                No todo fue perfecto: viví una crisis fuerte en 2024-2025 que me enseñó más
                que cualquier éxito anterior.
              </p>
              <p style={{
                fontFamily: "var(--font-dm)",
                fontSize: 16, lineHeight: 1.75,
                color: "var(--muted)",
              }}>
                Mi fe me ancla. UGC Colombia nació como la provisión de Dios en ese momento
                difícil — hoy es la empresa más activa del ecosistema. A eso me refiero cuando
                digo que no vendo humo: construyo con lo que tengo, en el momento en que toca.
              </p>
              <p style={{
                fontFamily: "var(--font-dm)",
                fontSize: 16, lineHeight: 1.75,
                color: "var(--muted)",
              }}>
                Hoy combino consultoría, agencia UGC, live shopping y un marketplace de creadores propio (Kreoon)
                para ayudar a emprendedores y marcas en LATAM a operar en modo AI-First.
                Sin teorías. Sin cursos de 100 horas. Con sistemas que funcionan cuando no estás.
              </p>
            </div>

            {/* Mini stats */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(2,1fr)",
              gap: 24,
              marginTop: 40,
            }}>
              {STATS.map((s, i) => (
                <div key={i} style={{
                  borderTop: "1px solid var(--gold-dim)",
                  paddingTop: 16,
                  opacity: storyVisible ? 1 : 0,
                  transform: storyVisible ? "translateY(0)" : "translateY(16px)",
                  transition: `opacity 0.6s ease ${300 + i * 80}ms, transform 0.6s ease ${300 + i * 80}ms`,
                }}>
                  <div style={{
                    fontFamily: "var(--font-bebas)",
                    fontSize: 42, letterSpacing: "-1px",
                    color: "var(--gold)", lineHeight: 1,
                  }}>
                    {s.n}
                  </div>
                  <div style={{
                    fontFamily: "var(--font-dm)",
                    fontSize: 12, lineHeight: 1.5,
                    color: "var(--muted2)", marginTop: 4,
                  }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Photo + credentials column */}
          <div style={{
            opacity: storyVisible ? 1 : 0,
            transform: storyVisible ? "translateX(0)" : "translateX(32px)",
            transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1) 120ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) 120ms",
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}>
            {/* Photo placeholder */}
            <div style={{
              position: "relative",
              aspectRatio: "3/4",
              maxHeight: 480,
              background: "rgba(17,17,17,0.9)",
              border: "1px solid rgba(255,255,255,0.06)",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              {/* Foto real — fallback controlado por estado */}
              {photoOk && (
                <img
                  src="/assets/images/section/alexander-foto.jpg"
                  alt="Alexander Cast"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", position: "relative", zIndex: 1 }}
                  onError={() => setPhotoOk(false)}
                />
              )}
              {/* Fallback: solo visible cuando la foto falla o no existe */}
              {!photoOk && (
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  gap: 12,
                }}>
                  <div style={{
                    width: 80, height: 80,
                    border: "1px solid var(--gold-dim)",
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ fontFamily: "var(--font-bebas)", fontSize: 32, color: "var(--gold)", letterSpacing: 2 }}>AC</span>
                  </div>
                  <div style={{
                    fontFamily: "var(--font-dm)", fontSize: 11,
                    letterSpacing: "2px", color: "var(--muted2)",
                  }}>
                    ALEXANDER CAST
                  </div>
                </div>
              )}
              {/* Gold accent corner */}
              <div style={{
                position: "absolute", bottom: 0, left: 0,
                width: 80, height: 3,
                background: "var(--gold)",
              }} />
            </div>

            {/* Credential tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["Diseñador Gráfico", "Tecnólogo en Sistemas", "Co-host Casa Host"].map(c => (
                <span key={c} style={{
                  fontFamily: "var(--font-dm)",
                  fontSize: 11, letterSpacing: "1px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "var(--muted2)",
                  padding: "6px 12px",
                }}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Ecosistema: dos bloques separados ── */}
        <div ref={venRef}>

          {/* Bloque 1: mis negocios */}
          <div style={{
            fontFamily: "var(--font-dm)",
            fontSize: 11, letterSpacing: "3px",
            color: "var(--gold)", marginBottom: 20,
            opacity: venVisible ? 1 : 0,
            transform: venVisible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}>
            MIS NEGOCIOS
          </div>

          <div className="ventures-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 1,
            background: "rgba(255,255,255,0.04)",
            marginBottom: "clamp(28px,4vw,48px)",
          }}>
            {MIS_NEGOCIOS.map((v, i) => (
              <div key={v.name} style={{
                background: "rgba(5,5,5,0.95)",
                padding: "clamp(20px,2.5vw,32px)",
                borderLeft: "2px solid var(--gold-dim)",
                opacity: venVisible ? 1 : 0,
                transform: venVisible ? "translateY(0)" : "translateY(24px)",
                transition: `opacity 0.6s ease ${i * 60}ms, transform 0.6s ease ${i * 60}ms`,
              }}>
                <div style={{
                  fontFamily: "var(--font-bebas)",
                  fontSize: 17, letterSpacing: "1.5px",
                  color: "#fff", marginBottom: 4,
                }}>
                  {v.name}
                </div>
                <div style={{
                  fontFamily: "var(--font-dm)",
                  fontSize: 10, letterSpacing: "1.5px",
                  color: "var(--gold)", marginBottom: 8,
                }}>
                  {v.role}
                </div>
                <div style={{
                  fontFamily: "var(--font-dm)",
                  fontSize: 12, color: "var(--muted2)",
                }}>
                  {v.tag}
                </div>
              </div>
            ))}
          </div>

          {/* Bloque 2: clientes y alianzas */}
          <div style={{
            fontFamily: "var(--font-dm)",
            fontSize: 11, letterSpacing: "3px",
            color: "var(--muted2)", marginBottom: 20,
            opacity: venVisible ? 1 : 0,
            transform: venVisible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.6s ease 200ms, transform 0.6s ease 200ms",
          }}>
            EMPRESAS QUE ACOMPAÑO
          </div>

          <div className="alianzas-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 1,
            background: "rgba(255,255,255,0.02)",
          }}>
            {CLIENTES_ALIANZAS.map((v, i) => (
              <div key={v.name} style={{
                background: "rgba(10,10,10,0.95)",
                padding: "clamp(16px,2vw,28px)",
                opacity: venVisible ? 1 : 0,
                transform: venVisible ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.6s ease ${300 + i * 60}ms, transform 0.6s ease ${300 + i * 60}ms`,
              }}>
                <div style={{
                  fontFamily: "var(--font-bebas)",
                  fontSize: 15, letterSpacing: "1px",
                  color: "rgba(255,255,255,0.7)", marginBottom: 4,
                }}>
                  {v.name}
                </div>
                <div style={{
                  fontFamily: "var(--font-dm)",
                  fontSize: 10, letterSpacing: "1.5px",
                  color: "var(--muted2)",
                }}>
                  {v.role}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .sobre-grid   { grid-template-columns: 1fr !important; }
          .ventures-grid { grid-template-columns: repeat(2,1fr) !important; }
          .alianzas-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (min-width: 769px) and (max-width: 1100px) {
          .ventures-grid { grid-template-columns: repeat(3,1fr) !important; }
          .alianzas-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
    </section>
  );
}
