import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { DaviesPreloader } from "@/components/davies/DaviesPreloader";
import { DaviesScrollTop } from "@/components/davies/DaviesScrollTop";
import { DaviesHeader } from "@/components/davies/DaviesHeader";
import { DaviesFooter } from "@/components/davies/DaviesFooter";

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://alexandercast.com"),
  title: {
    default: "Alexander Cast — Estrategia Digital & IA",
    template: "%s — Alexander Cast",
  },
  description:
    "Estratega digital, de contenido e IA. Fundador de KREOON e Infiny Group. Medellín, Colombia.",
  keywords: [
    "Alexander Cast",
    "estratega digital",
    "consultoria IA Medellin",
    "automatizaciones IA",
    "KREOON",
    "Infiny Group",
    "UGC Colombia",
    "agente IA",
  ],
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://alexandercast.com",
    siteName: "Alexander Cast",
    title: "Alexander Cast — Estrategia Digital & IA",
    description:
      "Estratega digital, de contenido e IA. Fundador de KREOON e Infiny Group. Medellín, Colombia.",
  },
  robots: { index: true, follow: true },
  icons: { icon: "/assets/images/logo/favicon.svg" },
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* React 19 hoists <link rel="stylesheet"> al <head> automáticamente */}
      <link rel="stylesheet" href="/assets/fonts/fonts.css" />
      <link rel="stylesheet" href="/assets/icon/icomoon/style.css" />
      <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
      <link rel="stylesheet" href="/assets/css/swiper-bundle.min.css" />
      <link rel="stylesheet" href="/assets/css/animate.css" />
      <link rel="stylesheet" href="/assets/css/odometer.min.css" />
      <link rel="stylesheet" href="/assets/css/slick.css" />
      <link rel="stylesheet" href="/assets/css/slick.theme.css" />
      <link rel="stylesheet" href="/assets/css/styles-v3.css" />

      <DaviesPreloader />
      <DaviesScrollTop />
      <main id="wrapper">
        <DaviesHeader />
        {children}
        <DaviesFooter />
      </main>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
