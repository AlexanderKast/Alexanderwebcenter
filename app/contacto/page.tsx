import type { Metadata } from "next";
import { Mail, MessageSquare } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { SectionHeading } from "@/components/shared/section-heading";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/content/site";

export const metadata: Metadata = buildMetadata({
  title: "Contacto",
  description:
    "Escribeme directo. Contar tu proyecto, colaboraciones, prensa o preguntas sobre el ecosistema.",
  path: "/contacto",
});

export default function ContactoPage() {
  return (
    <section className="container-narrow py-24 md:py-32">
      <SectionHeading
        superlabel="Contacto"
        title="Hablemos"
        description="Si prefieres el correo directo, escribeme a founder@kreoon.com. Si vas a proponer algo comercial, mira primero los servicios."
      />

      <div className="mt-12 grid gap-10 md:grid-cols-[1.2fr_1fr]">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
          <ContactForm />
        </div>
        <div className="space-y-4">
          <a
            href={`mailto:${site.contacto.principal}`}
            className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-5 transition-colors hover:border-[color:var(--gold)]/40"
          >
            <Mail className="mt-1 size-5 text-[color:var(--gold)]" />
            <div>
              <p className="font-medium">Correo directo</p>
              <p className="text-sm text-white/60">{site.contacto.principal}</p>
            </div>
          </a>
          <a
            href={`mailto:${site.contacto.comercial}`}
            className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-5 transition-colors hover:border-[color:var(--gold)]/40"
          >
            <MessageSquare className="mt-1 size-5 text-[color:var(--gold)]" />
            <div>
              <p className="font-medium">Temas comerciales</p>
              <p className="text-sm text-white/60">{site.contacto.comercial}</p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
