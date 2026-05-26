import Image from "next/image";
import { Mail, MapPin, MessageSquare } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { SectionHeading } from "@/components/shared/section-heading";
import { SocialCapsule } from "@/components/shared/social-capsule";
import { Reveal } from "@/components/effects/reveal";
import { Parallax } from "@/components/effects/parallax";
import { site } from "@/content/site";

export function ContactHome() {
  return (
    <section
      id="contacto"
      aria-label="Contacto directo con Alexander Cast"
      className="relative overflow-hidden border-t border-[color:var(--line)] bg-[color:var(--surface-1)] py-24 md:py-32"
    >
      <Parallax y={-50} className="absolute -left-10 top-20 -z-10 hidden w-80 opacity-15 md:block">
        <div className="relative aspect-square">
          <Image
            src="/images/cta/listening.webp"
            alt=""
            fill
            sizes="320px"
            className="rounded-3xl object-cover"
          />
        </div>
      </Parallax>

      <div className="container-wide grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal direction="up">
            <SectionHeading
              align="left"
              superlabel="Hablemos"
              title="Just say hello"
              description="Escribeme directo. Te respondo yo, no un bot ni un asistente."
            />
            <div className="section-divider section-divider-left" />
          </Reveal>

          <Reveal direction="up" delay={0.1}>
            <div className="mt-10 space-y-5">
              <a
                href={`mailto:${site.contacto.principal}`}
                className="flex items-start gap-4 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-2)] p-5 transition-colors hover:border-[color:var(--gold)]/40"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[color:var(--gold)]/10 text-[color:var(--gold)]">
                  <Mail className="size-4" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                    Correo directo
                  </p>
                  <p className="font-medium text-white">
                    {site.contacto.principal}
                  </p>
                </div>
              </a>
              <a
                href={`mailto:${site.contacto.comercial}`}
                className="flex items-start gap-4 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-2)] p-5 transition-colors hover:border-[color:var(--gold)]/40"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[color:var(--gold)]/10 text-[color:var(--gold)]">
                  <MessageSquare className="size-4" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                    Temas comerciales
                  </p>
                  <p className="font-medium text-white">
                    {site.contacto.comercial}
                  </p>
                </div>
              </a>
              <div className="flex items-start gap-4 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-2)] p-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[color:var(--gold)]/10 text-[color:var(--gold)]">
                  <MapPin className="size-4" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                    Donde estoy
                  </p>
                  <p className="font-medium text-white">{site.ubicacion}</p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal direction="up" delay={0.2}>
            <div className="mt-8 flex flex-col gap-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                Sigueme
              </p>
              <SocialCapsule />
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <Reveal direction="up" delay={0.1}>
            <div className="rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface-2)] p-6 md:p-10">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
