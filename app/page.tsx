import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Pilares } from "@/components/sections/pilares";
import { Ecosistema } from "@/components/sections/ecosistema";
import { Servicios } from "@/components/sections/servicios";
import { LeadMagnets } from "@/components/sections/lead-magnets";
import { NewsletterCta } from "@/components/sections/newsletter-cta";
import { ConsultoriaEmbed } from "@/components/sections/consultoria-embed";
import { Testimonios } from "@/components/sections/testimonios";
import { Galeria } from "@/components/sections/galeria";
import { FaqsSection } from "@/components/sections/faqs-section";
import { JsonLd } from "@/components/shared/json-ld";
import {
  buildFAQSchema,
  buildOrganizationSchema,
  buildServiceSchema,
} from "@/lib/seo";
import { faqs } from "@/content/faqs";
import { empresas } from "@/content/empresas";
import { servicios } from "@/content/servicios";

export default function HomePage() {
  return (
    <>
      <JsonLd schema={buildFAQSchema(faqs)} />
      {empresas.map((empresa) => (
        <JsonLd key={empresa.id} schema={buildOrganizationSchema(empresa)} />
      ))}
      {servicios.map((servicio) => (
        <JsonLd key={servicio.id} schema={buildServiceSchema(servicio)} />
      ))}

      <Hero />
      <About />
      <Pilares />
      <Ecosistema />
      <Servicios />
      <LeadMagnets />
      <NewsletterCta />
      <ConsultoriaEmbed />
      <Testimonios />
      <Galeria />
      <FaqsSection />
    </>
  );
}
