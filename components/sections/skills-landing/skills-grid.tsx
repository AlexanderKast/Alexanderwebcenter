import { SKILLS } from "./data";
import {
  SectionEyebrow,
  SectionTitle,
  sectionWrap,
  bodyText,
  cardStyle,
} from "./section-shell";

export function SkillsGrid() {
  return (
    <section
      id="skills"
      style={{
        background: "rgba(10,10,10,0.72)",
        borderTop: "1px solid var(--gold-dim)",
        borderBottom: "1px solid var(--gold-dim)",
      }}
    >
      <div style={sectionWrap}>
        <SectionEyebrow>EL PACK</SectionEyebrow>
        <div
          className="skills-grid-head"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 24,
            marginBottom: 56,
            flexWrap: "wrap",
          }}
        >
          <SectionTitle>
            9 MANUALES
            <br />
            DE <span style={{ color: "var(--gold)" }}>OPERACIÓN</span>
          </SectionTitle>
          <p style={{ ...bodyText, maxWidth: 300 }}>
            Archivos Markdown listos para copiar, pegar y activar en tu IA.
          </p>
        </div>

        <div
          className="skills-cards-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 20,
          }}
        >
          {SKILLS.map((skill) => (
            <article
              key={skill.archivo}
              style={{
                ...cardStyle,
                borderLeft: "2px solid var(--gold)",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-bebas)",
                    fontSize: 42,
                    lineHeight: 1,
                    color: "var(--gold)",
                    opacity: 0.55,
                  }}
                >
                  {skill.numero}
                </span>
                <code
                  style={{
                    fontFamily: "monospace",
                    fontSize: 10,
                    letterSpacing: "0.5px",
                    color: "var(--texto-tenue)",
                    background: "rgba(255,255,255,0.05)",
                    padding: "4px 8px",
                  }}
                >
                  {skill.archivo}
                </code>
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-bebas)",
                  fontSize: 26,
                  letterSpacing: "0.5px",
                  color: "#fff",
                }}
              >
                {skill.nombre.toUpperCase()}
              </h3>
              <p style={{ ...bodyText, fontSize: 14 }}>{skill.descripcion}</p>
            </article>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 1000px) {
          .skills-cards-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 640px) {
          .skills-cards-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
