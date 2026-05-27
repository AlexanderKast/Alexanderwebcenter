const TEXT =
  "ESTRATEGIA DIGITAL — CONTENIDO UGC — INTELIGENCIA ARTIFICIAL — AI-FIRST LATAM — CONSULTORÍA IA — NEGOCIOS DIGITALES — MEDELLÍN, COLOMBIA — ";

export function HomeMarquee() {
  return (
    <div style={{
      overflow: "hidden",
      background: "var(--gold)",
      padding: "13px 0",
      borderTop: "1px solid rgba(201,168,76,0.4)",
      borderBottom: "1px solid rgba(201,168,76,0.4)",
      userSelect: "none",
    }}>
      {/* Duplicate ×4 para loop perfecto a cualquier ancho */}
      <div style={{
        display: "flex",
        width: "max-content",
        animation: "marquee 28s linear infinite",
      }}>
        {[0, 1, 2, 3].map(i => (
          <span key={i} style={{
            fontFamily: "var(--font-bebas)",
            fontSize: 12,
            letterSpacing: "3px",
            color: "#000",
            whiteSpace: "nowrap",
            paddingRight: 0,
          }}>
            {TEXT}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
