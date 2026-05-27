import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://alexandercast.com"),
  title: {
    default: "Alexander Castaño — Estrategia Digital, Contenido & IA",
    template: "%s — Alexander Castaño",
  },
  description:
    "Paisa de Medellín con 6+ años construyendo negocios digitales en LATAM. Estrategia digital, contenido que convierte e inteligencia artificial aplicada al negocio real.",
  keywords: [
    "Alexander Castaño",
    "estrategia digital LATAM",
    "consultoría IA Medellín",
    "contenido UGC",
    "AI-First emprendedores",
    "agencia de contenido",
    "emprende con alexander",
  ],
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://alexandercast.com",
    siteName: "Emprende con Alexander",
    title: "Alexander Castaño — Estrategia Digital, Contenido & IA",
    description:
      "Paisa de Medellín con 6+ años construyendo negocios digitales en LATAM.",
  },
  robots: { index: true, follow: true },
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Google Fonts: Bebas Neue + DM Sans */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap"
      />
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body {
          background: #000;
          color: #fff;
          font-family: 'DM Sans', system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        :root {
          --gold: #C9A84C;
          --gold-dim: rgba(201,168,76,0.15);
          --gold-dim2: rgba(201,168,76,0.08);
          --surface: #0A0A0A;
          --surface2: #111;
          --muted: rgba(255,255,255,0.55);
          --muted2: rgba(255,255,255,0.35);
          --font-bebas: 'Bebas Neue', sans-serif;
          --font-dm: 'DM Sans', sans-serif;
        }
        a { text-decoration: none; color: inherit; }
        img, video { display: block; max-width: 100%; }
        ::selection { background: var(--gold); color: #000; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: var(--gold-dim); }

        /* ── Grain texture — superposición fija de grano cinematográfico ── */
        body::after {
          content: '';
          position: fixed;
          inset: 0;
          z-index: 9990;
          pointer-events: none;
          opacity: 0.038;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 200px 200px;
        }
      `}</style>

      {children}

      <Analytics />
      <SpeedInsights />
    </>
  );
}
