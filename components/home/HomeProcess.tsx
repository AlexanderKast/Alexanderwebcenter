const STEPS = [
  {
    n: "01",
    title: "DIAGNÓSTICO",
    body: "Analizo tu situación actual, tus recursos y tus objetivos. Sin suposiciones: un mapa real de dónde estás y a dónde puedes llegar con lo que tienes.",
  },
  {
    n: "02",
    title: "DISEÑO DEL SISTEMA",
    body: "Construimos tu hoja de ruta personalizada: qué canales, qué contenido, qué herramientas IA y qué procesos necesitas para crecer sin depender de la suerte.",
  },
  {
    n: "03",
    title: "ACTIVACIÓN Y ESCALA",
    body: "Implementamos, medimos y optimizamos. El sistema trabaja para ti — tú te enfocas en lo que solo tú puedes hacer.",
  },
];

export function HomeProcess() {
  return (
    <section style={{
      background: "var(--surface)",
      borderTop: "1px solid var(--gold-dim)",
    }}>
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
          }}>
            CÓMO TRABAJO
          </div>
          <h2 style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "clamp(52px,6vw,80px)",
            letterSpacing: "-1px", color: "#fff",
            lineHeight: 1,
          }}>
            EL PROCESO
          </h2>
        </div>

        {/* Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "clamp(20px,3vw,40px)",
        }} className="process-grid">
          {STEPS.map((s) => (
            <div key={s.n} style={{
              position: "relative",
              background: "var(--surface2)",
              border: "1px solid rgba(255,255,255,0.06)",
              padding: "clamp(32px,4vw,52px)",
              overflow: "hidden",
            }}>
              {/* Background number */}
              <div style={{
                position: "absolute",
                top: -20, right: 16,
                fontFamily: "var(--font-bebas)",
                fontSize: "clamp(100px,12vw,160px)",
                lineHeight: 1,
                color: "rgba(255,255,255,0.03)",
                userSelect: "none",
                pointerEvents: "none",
              }}>
                {s.n}
              </div>

              {/* Gold top line */}
              <div style={{
                width: 40, height: 2,
                background: "var(--gold)",
                marginBottom: 28,
              }}/>

              {/* Step number */}
              <div style={{
                fontFamily: "var(--font-dm)",
                fontSize: 11, letterSpacing: "3px",
                color: "var(--gold)",
                marginBottom: 16,
              }}>
                PASO {s.n}
              </div>

              {/* Title */}
              <h3 style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "clamp(28px,3vw,40px)",
                letterSpacing: "-0.5px",
                color: "#fff",
                marginBottom: 20,
                lineHeight: 1,
              }}>
                {s.title}
              </h3>

              {/* Body */}
              <p style={{
                fontFamily: "var(--font-dm)",
                fontSize: 15, lineHeight: 1.7,
                color: "var(--muted)",
              }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .process-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .process-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
    </section>
  );
}
