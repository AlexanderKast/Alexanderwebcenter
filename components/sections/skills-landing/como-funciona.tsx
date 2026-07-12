import {
  SectionEyebrow,
  SectionTitle,
  sectionWrap,
  bodyText,
} from "./section-shell";

const pasos = [
  {
    titulo: "DEJA TU NOMBRE Y WHATSAPP",
    texto: "Acceso inmediato al pack completo.",
  },
  {
    titulo: "INSTÁLALAS EN 5 MINUTOS",
    texto: "La guía incluida te muestra dónde pegarlas.",
  },
  {
    titulo: "TU IA TRABAJA CON CRITERIO SENIOR",
    texto: "Planifica, verifica y entrega como un profesional.",
  },
];

export function SkillsComoFunciona() {
  return (
    <section style={{ background: "#000" }}>
      <div style={sectionWrap}>
        <SectionEyebrow>CÓMO FUNCIONA</SectionEyebrow>
        <SectionTitle>
          TRES PASOS <span style={{ color: "var(--gold)" }}>Y LISTO</span>
        </SectionTitle>

        <div
          className="skills-pasos-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 0,
            marginTop: 40,
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {pasos.map((paso, i) => (
            <div
              key={paso.titulo}
              style={{
                padding: "clamp(28px,4vw,48px) clamp(20px,3vw,40px)",
                borderRight:
                  i < pasos.length - 1
                    ? "1px solid rgba(255,255,255,0.06)"
                    : "none",
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-bebas)",
                  fontSize: "clamp(52px,6vw,80px)",
                  lineHeight: 1,
                  color: "var(--gold)",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-bebas)",
                  fontSize: 22,
                  letterSpacing: "0.5px",
                  color: "#fff",
                }}
              >
                {paso.titulo}
              </h3>
              <p style={{ ...bodyText, fontSize: 14 }}>{paso.texto}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 800px) {
          .skills-pasos-grid { grid-template-columns: 1fr !important; }
          .skills-pasos-grid > div { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.06); }
        }
      `}</style>
    </section>
  );
}
