import type { Metadata } from "next";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { SectionHeading } from "@/components/shared/section-heading";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Newsletter — Dios, Estrategia e IA",
  description:
    "Cada domingo, una reflexion sobre fe, estrategia de negocio e inteligencia artificial. Sin humo. Sin formulas magicas.",
  path: "/newsletter",
});

export default function NewsletterPage() {
  return (
    <section className="container-narrow py-24 md:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <SectionHeading
          superlabel="Newsletter"
          title="Dios, Estrategia e IA — cada domingo"
          description="Una sola idea por semana, aplicable a tu negocio. Sin fluff. Lectura de 5 minutos."
        />
        <div className="mt-10">
          <NewsletterForm source="page-newsletter" variant="stacked" label="Unirme gratis" />
        </div>
        <p className="mt-6 text-xs text-white/50">
          Al suscribirte aceptas recibir correos mios y la politica de privacidad.
        </p>
      </div>
    </section>
  );
}
