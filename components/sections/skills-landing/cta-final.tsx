import { SkillsLeadForm } from "./skills-lead-form";
import { SectionEyebrow, sectionWrap, bodyText } from "./section-shell";

export function SkillsCtaFinal() {
  return (
    <section
      style={{
        background: "rgba(10,10,10,0.72)",
        borderTop: "1px solid var(--gold-dim)",
      }}
    >
      <div
        className="skills-cta-grid"
        style={{
          ...sectionWrap,
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: "clamp(40px,6vw,90px)",
          alignItems: "center",
        }}
      >
        <div>
          <SectionEyebrow>ÚLTIMO PASO</SectionEyebrow>
          <h2
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(44px,6vw,84px)",
              lineHeight: 0.95,
              letterSpacing: "-1px",
              color: "#fff",
              marginBottom: 20,
            }}
          >
            QUÉDATE CON EL CRITERIO,
            <br />
            <span style={{ color: "var(--gold)" }}>NO CON LA FACTURA</span>
          </h2>
          <p style={{ ...bodyText, maxWidth: 480 }}>
            Únete a los profesionales que ya operan su IA a nivel senior.
          </p>
        </div>

        <div
          style={{
            background: "rgba(10,10,10,0.82)",
            border: "1px solid var(--gold-dim)",
            padding: "clamp(32px,4vw,52px)",
          }}
        >
          <SkillsLeadForm idPrefix="cta" />
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .skills-cta-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
