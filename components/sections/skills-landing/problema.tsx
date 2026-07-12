import {
  SectionEyebrow,
  SectionTitle,
  sectionWrap,
  bodyText,
  cardStyle,
} from "./section-shell";

const problemas = [
  {
    titulo: "TE DICE QUE SÍ A TODO",
    texto:
      "Sin criterio, la IA solo busca complacerte y deja pasar errores críticos en la lógica.",
  },
  {
    titulo: "ENTREGA SIN VERIFICAR",
    texto:
      "No revisa sus propias fuentes ni su propio trabajo. El control de calidad te lo delega a ti.",
  },
  {
    titulo: "SUENA SEGURO AUNQUE INVENTE",
    texto:
      "La alucinación no es el fallo. El fallo es no tener un protocolo de verificación senior.",
  },
];

export function SkillsProblema() {
  return (
    <section style={{ background: "#000", position: "relative" }}>
      <div style={sectionWrap}>
        <SectionEyebrow>EL PROBLEMA</SectionEyebrow>
        <SectionTitle>
          LA IA NO ES TU PROBLEMA.
          <br />
          <span style={{ color: "var(--gold)" }}>EL SISTEMA SÍ.</span>
        </SectionTitle>
        <p style={{ ...bodyText, maxWidth: 560, marginBottom: 56 }}>
          La mayoría le habla a la IA como a una calculadora y espera magia. El
          resultado es mediocridad acelerada. Necesitas pasar de dar
          instrucciones a instalar sistemas de pensamiento.
        </p>

        <div
          className="skills-problema-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 20,
          }}
        >
          {problemas.map((p, i) => (
            <article key={p.titulo} style={cardStyle}>
              <div
                style={{
                  fontFamily: "var(--font-bebas)",
                  fontSize: 40,
                  color: "var(--gold)",
                  lineHeight: 1,
                  marginBottom: 16,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-bebas)",
                  fontSize: 24,
                  letterSpacing: "0.5px",
                  color: "#fff",
                  marginBottom: 12,
                }}
              >
                {p.titulo}
              </h3>
              <p style={{ ...bodyText, fontSize: 14 }}>{p.texto}</p>
              <div
                style={{
                  height: 2,
                  background: "var(--gold)",
                  width: 32,
                  marginTop: 20,
                }}
              />
            </article>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 800px) {
          .skills-problema-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
