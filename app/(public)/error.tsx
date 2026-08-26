"use client";

import { useEffect } from "react";

/** El sitio publico tampoco tenia error boundary. */
export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[public]", error);
  }, [error]);

  return (
    <main
      style={{
        minHeight: "70vh",
        display: "grid",
        placeItems: "center",
        padding: "120px clamp(20px,4vw,60px) 80px",
      }}
    >
      <div style={{ maxWidth: 520, textAlign: "center" }}>
        <p
          style={{
            fontFamily: "var(--font-dm)",
            fontSize: 12,
            letterSpacing: "2.5px",
            textTransform: "uppercase",
            color: "var(--gold)",
          }}
        >
          Algo salió mal
        </p>
        <h1
          style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "clamp(38px,6vw,64px)",
            letterSpacing: "2px",
            margin: "16px 0 12px",
            color: "#fff",
          }}
        >
          NO PUDIMOS CARGAR ESTA PÁGINA
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 16, lineHeight: 1.7 }}>
          Fue un problema de nuestro lado. Probá de nuevo en un momento.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: 32,
            minHeight: 44,
            fontFamily: "var(--font-bebas)",
            fontSize: 14,
            letterSpacing: "2px",
            background: "var(--gold)",
            color: "#000",
            border: "none",
            padding: "14px 32px",
            cursor: "pointer",
          }}
        >
          REINTENTAR
        </button>
      </div>
    </main>
  );
}
