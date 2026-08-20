import type { Metadata, Viewport } from "next";
import { Analytics }    from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { HomeChromeEstilos }     from "@/components/home/HomeChromeEstilos";
import { HomeVideoBackground } from "@/components/home/HomeVideoBackground";
import { HomeHeader }          from "@/components/home/HomeHeader";
import { HomeFooter }          from "@/components/home/HomeFooter";
import { site } from "@/content/site";

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const TITULO_PUBLICO = "Alexander Castaño — Estrategia Digital, Contenido & IA";
const DESCRIPCION_PUBLICA =
  "Paisa de Medellín con 8+ años construyendo negocios digitales en LATAM.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Alexander Castaño — Estrategia Digital, Contenido & IA",
    template: "%s — Alexander Castaño",
  },
  description:
    "Paisa de Medellín con 8+ años construyendo negocios digitales en LATAM. Estrategia digital, contenido que convierte e inteligencia artificial aplicada al negocio real.",
  keywords: [
    "Alexander Castaño",
    "estrategia digital LATAM",
    "consultoría IA Medellín",
    "contenido UGC",
    "AI-First emprendedores",
    "agencia de contenido",
    "emprende con alexander",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: site.url,
    siteName: "Emprende con Alexander",
    title: TITULO_PUBLICO,
    description: DESCRIPCION_PUBLICA,
    // Sin imagen declarada, compartir el sitio en WhatsApp o LinkedIn
    // mostraba solo texto.
    images: [{ url: site.ogImage, width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITULO_PUBLICO,
    description: DESCRIPCION_PUBLICA,
    images: [site.ogImage],
  },
  robots: { index: true, follow: true },
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HomeChromeEstilos />

      {/* Chrome compartido en todas las páginas */}
      <HomeVideoBackground />
      <HomeHeader />

      {children}

      <HomeFooter />

      <Analytics />
      <SpeedInsights />
    </>
  );
}
