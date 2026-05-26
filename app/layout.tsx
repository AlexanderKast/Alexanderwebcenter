import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://alexandercast.com"),
  title: {
    default: "Alexander Cast — Estrategia Digital & IA",
    template: "%s — Alexander Cast",
  },
  description:
    "Estratega digital, de contenido e IA. Fundador de KREOON e Infiny Group. Medellín, Colombia.",
  robots: { index: true, follow: true },
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
