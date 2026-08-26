/**
 * Piezas compartidas de la landing /skills con la estética del home:
 * Bebas Neue para títulos, DM Sans para cuerpo, dorado var(--gold).
 */

export function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-dm)",
        fontSize: 11,
        letterSpacing: "2.5px",
        color: "var(--gold)",
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 18,
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: 20,
          height: 1,
          background: "var(--gold)",
        }}
      />
      {children}
    </div>
  );
}

export function SectionTitle({
  children,
  center = false,
}: {
  children: React.ReactNode;
  center?: boolean;
}) {
  return (
    <h2
      style={{
        fontFamily: "var(--font-bebas)",
        fontSize: "clamp(40px,5.5vw,72px)",
        lineHeight: 0.95,
        letterSpacing: "-1px",
        color: "#fff",
        marginBottom: 20,
        textAlign: center ? "center" : "left",
      }}
    >
      {children}
    </h2>
  );
}

export const sectionWrap: React.CSSProperties = {
  maxWidth: 1400,
  margin: "0 auto",
  padding: "clamp(70px,9vw,120px) clamp(20px,4vw,60px)",
};

export const bodyText: React.CSSProperties = {
  fontFamily: "var(--font-dm)",
  fontSize: "clamp(14px,1.5vw,17px)",
  lineHeight: 1.65,
  color: "var(--texto-suave)",
};

export const cardStyle: React.CSSProperties = {
  background: "rgba(10,10,10,0.82)",
  border: "1px solid rgba(255,255,255,0.08)",
  padding: "clamp(24px,3vw,36px)",
};
