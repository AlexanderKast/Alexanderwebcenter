import { SKILLS_FAQS } from "./data";
import {
  SectionEyebrow,
  SectionTitle,
  sectionWrap,
  bodyText,
} from "./section-shell";

export function SkillsFaq() {
  return (
    <section style={{ background: "#000" }}>
      <div style={{ ...sectionWrap, maxWidth: 900 }}>
        <SectionEyebrow>DUDAS FRECUENTES</SectionEyebrow>
        <SectionTitle>
          PREGUNTAS <span style={{ color: "var(--gold)" }}>FRECUENTES</span>
        </SectionTitle>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            marginTop: 40,
          }}
        >
          {SKILLS_FAQS.map((faq) => (
            <details
              key={faq.pregunta}
              style={{
                background: "rgba(10,10,10,0.82)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <summary
                style={{
                  fontFamily: "var(--font-bebas)",
                  fontSize: 20,
                  letterSpacing: "0.5px",
                  color: "#fff",
                  padding: "20px 24px",
                  cursor: "pointer",
                  listStyle: "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                {faq.pregunta.toUpperCase()}
                <span style={{ color: "var(--gold)", fontSize: 24 }}>+</span>
              </summary>
              <p style={{ ...bodyText, padding: "0 24px 22px" }}>
                {faq.respuesta}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
