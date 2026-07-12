/* eslint-disable @next/next/no-img-element */
import {
  SectionEyebrow,
  SectionTitle,
  sectionWrap,
  bodyText,
} from "./section-shell";

export function SkillsAutor() {
  return (
    <section
      id="autor"
      style={{
        background: "rgba(10,10,10,0.72)",
        borderTop: "1px solid var(--gold-dim)",
        borderBottom: "1px solid var(--gold-dim)",
      }}
    >
      <div
        className="skills-autor-grid"
        style={{
          ...sectionWrap,
          display: "grid",
          gridTemplateColumns: "0.8fr 1.2fr",
          gap: "clamp(40px,6vw,90px)",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            border: "1px solid var(--gold-dim)",
            padding: 12,
          }}
        >
          <img
            src="/assets/images/section/alexander-foto.jpg"
            alt="Alexander Cast, estratega digital y de IA"
            style={{
              width: "100%",
              display: "block",
              aspectRatio: "4/5",
              objectFit: "cover",
              filter: "grayscale(20%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -1,
              left: -1,
              width: 60,
              height: 60,
              borderLeft: "2px solid var(--gold)",
              borderBottom: "2px solid var(--gold)",
            }}
          />
        </div>

        <div>
          <SectionEyebrow>QUIÉN LO CREÓ</SectionEyebrow>
          <SectionTitle>
            ALEXANDER <span style={{ color: "var(--gold)" }}>CAST</span>
          </SectionTitle>
          <p
            style={{
              fontFamily: "var(--font-dm)",
              fontSize: 12,
              letterSpacing: "2px",
              color: "var(--gold)",
              marginBottom: 24,
            }}
          >
            ESTRATEGA DIGITAL · IA FIRST · MEDELLÍN
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p style={bodyText}>
              Llevo años construyendo negocios digitales en Latinoamérica, y
              hoy mi trabajo es uno solo: que emprendedores y empresas usen IA
              que no solo ahorra tiempo, sino que eleva la calidad de lo que se
              hace.
            </p>
            <p style={bodyText}>
              Estos protocolos no salen de un curso. Salen de resolver, una y
              otra vez, el punto débil de la IA generativa: la falta de rigor.
            </p>
            <p
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: 22,
                letterSpacing: "0.5px",
                color: "#fff",
              }}
            >
              NO USO IA. <span style={{ color: "var(--gold)" }}>CONSTRUYO SISTEMAS CON ELLA.</span>
            </p>
          </div>
          <blockquote
            style={{
              borderLeft: "2px solid var(--gold)",
              paddingLeft: 24,
              marginTop: 32,
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "clamp(22px,2.4vw,30px)",
                letterSpacing: "0.5px",
                color: "#fff",
                lineHeight: 1.2,
              }}
            >
              "LAS HERRAMIENTAS SE ALQUILAN.
              <br />
              <span style={{ color: "var(--gold)" }}>
                LOS SISTEMAS SE CONSTRUYEN."
              </span>
            </p>
          </blockquote>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .skills-autor-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
