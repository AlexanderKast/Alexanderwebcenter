import Link from "next/link";

/**
 * 404 global. Vive fuera del grupo (public), asi que no hereda el chrome ni
 * sus variables CSS: por eso los colores van explicitos y no por token.
 */
export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#000",
        color: "#fff",
        padding: "40px 24px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: 520, textAlign: "center" }}>
        <p
          style={{
            fontSize: 12,
            letterSpacing: "2.5px",
            textTransform: "uppercase",
            color: "#C9A84C",
          }}
        >
          Error 404
        </p>
        <h1
          style={{
            fontSize: "clamp(34px,6vw,56px)",
            lineHeight: 1.1,
            margin: "16px 0 12px",
            fontWeight: 600,
          }}
        >
          Esta página no existe
        </h1>
        <p style={{ color: "rgba(255,255,255,0.74)", fontSize: 16, lineHeight: 1.7 }}>
          Puede que el enlace esté viejo o que la hayamos movido de lugar.
        </p>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            minHeight: 44,
            marginTop: 32,
            background: "#C9A84C",
            color: "#000",
            padding: "0 32px",
            fontSize: 14,
            letterSpacing: "2px",
            textTransform: "uppercase",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
