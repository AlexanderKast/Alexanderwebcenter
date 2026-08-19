import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
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
  themeColor: "#000000",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const TITULO_POR_DEFECTO = "Alexander Cast — Estrategia Digital & IA";
const DESCRIPCION_POR_DEFECTO =
  "Estratega digital, de contenido e IA. Fundador de KREOON e Infiny Group. Medellín, Colombia.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: TITULO_POR_DEFECTO,
    template: "%s — Alexander Cast",
  },
  description: DESCRIPCION_POR_DEFECTO,
  robots: { index: true, follow: true },
  // Canonical y Open Graph por defecto: sin esto, las paginas que no llaman
  // a buildMetadata() quedaban sin canonical y sin imagen al compartirlas.
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "es_CO",
    url: site.url,
    title: TITULO_POR_DEFECTO,
    description: DESCRIPCION_POR_DEFECTO,
    images: [{ url: site.ogImage, width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITULO_POR_DEFECTO,
    description: DESCRIPCION_POR_DEFECTO,
    images: [site.ogImage],
  },
};

/**
 * Root layout minimalista — solo provee el shell HTML/CSS base.
 * El header, footer y CSS específico de cada sección lo provee
 * el layout anidado: (public)/layout.tsx para el sitio público,
 * admin/layout.tsx para el panel de administración.
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable} dark`}>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
