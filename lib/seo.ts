import type { Metadata } from "next";
import { site } from "@/content/site";
import type { Empresa } from "@/content/empresas";
import type { FAQ } from "@/content/faqs";
import type { Servicio } from "@/content/servicios";

const DEFAULT_IMAGE = site.ogImage;

type BuildMetadataInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noindex?: boolean;
};

/**
 * Factory de Metadata Next.js con Open Graph + Twitter Cards.
 */
export function buildMetadata({
  title,
  description,
  path = "/",
  image = DEFAULT_IMAGE,
  noindex = false,
}: BuildMetadataInput): Metadata {
  const url = new URL(path, site.url).toString();
  const absoluteImage = image.startsWith("http")
    ? image
    : new URL(image, site.url).toString();

  return {
    metadataBase: new URL(site.url),
    title,
    description,
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-snippet": -1,
            "max-image-preview": "large",
            "max-video-preview": -1,
          },
        },
    openGraph: {
      type: "website",
      locale: site.locale,
      url,
      siteName: site.name,
      title,
      description,
      images: [
        {
          url: absoluteImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteImage],
      creator: site.social.x.handle,
      site: site.social.x.handle,
    },
  };
}

/** JSON-LD Person para Alexander Cast */
export function buildPersonSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    alternateName: site.handle,
    url: site.url,
    image: new URL(DEFAULT_IMAGE, site.url).toString(),
    jobTitle: site.rol,
    description: site.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Medellin",
      addressCountry: "CO",
    },
    knowsLanguage: site.idiomas,
    sameAs: [
      site.social.instagram.url,
      site.social.tiktok.url,
      site.social.youtube.url,
      site.social.linkedin.url,
      site.social.x.url,
      site.social.github.url,
    ],
    worksFor: site.fundador.map((nombre) => ({
      "@type": "Organization",
      name: nombre,
    })),
  };
}

/** JSON-LD Organization para una empresa del ecosistema */
export function buildOrganizationSchema(
  empresa: Empresa,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: empresa.nombre,
    url: empresa.url,
    description: empresa.descripcion,
    logo: new URL(empresa.logo, site.url).toString(),
    slogan: empresa.tagline,
    founder: {
      "@type": "Person",
      name: site.name,
      url: site.url,
    },
  };
}

/** JSON-LD FAQPage desde content/faqs.ts */
export function buildFAQSchema(items: FAQ[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((faq) => ({
      "@type": "Question",
      name: faq.pregunta,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.respuesta,
      },
    })),
  };
}

/** JSON-LD Service para un servicio premium */
export function buildServiceSchema(
  servicio: Servicio,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: servicio.nombre,
    description: servicio.descripcion,
    serviceType: "Consultoria estrategica",
    provider: {
      "@type": "Person",
      name: site.name,
      url: site.url,
    },
    areaServed: ["LATAM", "Espana"],
    availableLanguage: site.idiomas,
    offers: {
      "@type": "Offer",
      price: servicio.precio,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: new URL(servicio.ctaHref, site.url).toString(),
    },
  };
}

/** JSON-LD WebSite con SearchAction */
export function buildWebsiteSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: site.description,
    inLanguage: site.locale,
    publisher: {
      "@type": "Person",
      name: site.name,
      url: site.url,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${site.url}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}
