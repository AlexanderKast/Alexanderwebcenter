import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/sonner";
import { SiteHeader } from "@/components/nav/site-header";
import { Footer as SiteFooter } from "@/components/sections/footer";
import { JsonLd } from "@/components/shared/json-ld";
import { ScrollProgress } from "@/components/effects/scroll-progress";
import { Preloader } from "@/components/shared/preloader";
import { ScrollToTop } from "@/components/shared/scroll-to-top";
import { StickyCta } from "@/components/shared/sticky-cta";
import { ExitIntentModal } from "@/components/shared/exit-intent-modal";
import { FloatingSocialProof } from "@/components/shared/floating-social-proof";
import { buildPersonSchema, buildWebsiteSchema } from "@/lib/seo";
import { site } from "@/content/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const viewport: Viewport = {
  themeColor: "#030303",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  keywords: [
    "Alexander Cast",
    "estratega digital",
    "consultoria IA Medellin",
    "marca personal",
    "emprendedores LATAM",
    "captacion de clientes",
    "KREOON",
    "UGC Colombia",
    "Infiny Group",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${site.name} — ${site.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.descriptionCorta,
    images: ["/opengraph-image"],
    creator: site.social.x.handle,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable} dark`}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <JsonLd schema={buildPersonSchema()} />
        <JsonLd schema={buildWebsiteSchema()} />
        <Preloader />
        <ScrollProgress />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <ScrollToTop />
        <StickyCta />
        <FloatingSocialProof />
        <ExitIntentModal />
        <Toaster richColors position="top-center" theme="dark" />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
