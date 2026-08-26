import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/content/site";

export const metadata: Metadata = buildMetadata({
  title: "Tus 9 Skills PRO están listas",
  description: "Descarga tu pack de 9 Skills PRO para tu IA.",
  path: "/skills/gracias",
  noindex: true,
});

const descargas = [
  {
    href: "/downloads/skills-pro/9-skills-pro.zip",
    label: "DESCARGAR LAS 9 SKILLS (.ZIP)",
    detalle: "9 archivos .md listos para instalar",
  },
  {
    href: "/downloads/skills-pro/guia-instalacion-skills-pro.pdf",
    label: "DESCARGAR LA GUÍA DE INSTALACIÓN (PDF)",
    detalle: "Actívalas en 5 minutos, paso a paso",
  },
];

type SearchParams = Promise<{ nombre?: string }>;

function buildWhatsappUrl(nombre: string | undefined) {
  const primerNombre = (nombre ?? "").trim().split(/\s+/)[0] || "";
  const mensaje = primerNombre
    ? `Hola Alex, mi nombre es ${primerNombre} y quiero unirme a tu comunidad.`
    : "Hola Alex, quiero unirme a tu comunidad.";
  return `https://wa.me/${site.comunidad.whatsappBusinessNumber}?text=${encodeURIComponent(mensaje)}`;
}

export default async function SkillsGraciasPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { nombre } = await searchParams;
  const whatsappUrl = buildWhatsappUrl(nombre);

  return (
    <main
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: "transparent",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background:
            "linear-gradient(135deg,rgba(0,0,0,0.86) 0%,rgba(0,0,0,0.55) 50%,rgba(0,0,0,0.75) 100%)",
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 760,
          margin: "0 auto",
          width: "100%",
          padding: "clamp(140px,18vw,200px) clamp(20px,4vw,60px) clamp(80px,10vw,120px)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-dm)",
            fontSize: 11,
            letterSpacing: "2.5px",
            color: "var(--gold)",
            marginBottom: 18,
          }}
        >
          DIOS. ESTRATEGIA. IA.
        </div>
        <h1
          style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "clamp(52px,8vw,96px)",
            lineHeight: 0.95,
            letterSpacing: "-1px",
            color: "#fff",
            marginBottom: 20,
          }}
        >
          LISTO. <span style={{ color: "var(--gold)" }}>EL PACK ES TUYO.</span>
        </h1>
        <p
          style={{
            fontFamily: "var(--font-dm)",
            fontSize: "clamp(14px,1.6vw,17px)",
            lineHeight: 1.65,
            color: "var(--texto-suave)",
            maxWidth: 520,
            margin: "0 auto 48px",
          }}
        >
          Descarga los archivos aquí mismo. Y si quieres ir más allá, en la
          comunidad comparto cómo aplico estas skills en negocios reales.
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            marginBottom: 40,
            textAlign: "left",
          }}
        >
          {descargas.map((d) => (
            <a
              key={d.href}
              href={d.href}
              download
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 16,
                background: "rgba(10,10,10,0.82)",
                border: "1px solid var(--gold-dim)",
                padding: "22px 26px",
                backdropFilter: "blur(8px)",
              }}
            >
              <span>
                <span
                  style={{
                    display: "block",
                    fontFamily: "var(--font-bebas)",
                    fontSize: 20,
                    letterSpacing: "1px",
                    color: "#fff",
                  }}
                >
                  {d.label}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-dm)",
                    fontSize: 13,
                    color: "var(--texto-suave)",
                  }}
                >
                  {d.detalle}
                </span>
              </span>
              <span style={{ color: "var(--gold)", fontSize: 22, flexShrink: 0 }}>
                ↓
              </span>
            </a>
          ))}
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            fontFamily: "var(--font-bebas)",
            fontSize: 16,
            letterSpacing: "2.5px",
            color: "#000",
            background: "var(--gold)",
            padding: "18px 36px",
          }}
        >
          UNIRME A LA COMUNIDAD DE WHATSAPP
          <span style={{ fontSize: 20 }}>→</span>
        </a>

        <div style={{ marginTop: 36 }}>
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-dm)",
              fontSize: 12,
              letterSpacing: "1.5px",
              color: "var(--texto-suave)",
              borderBottom: "1px solid var(--gold-dim)",
              paddingBottom: 2,
            }}
          >
            VOLVER AL INICIO
          </Link>
        </div>
      </div>
    </main>
  );
}
