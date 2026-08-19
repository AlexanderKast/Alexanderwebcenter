import type { Metadata } from "next";
import { Check } from "lucide-react";
import { servicios } from "@/content/servicios";
import { SectionHeading } from "@/components/shared/section-heading";
import { ConsultationForm } from "@/components/forms/consultation-form";
import { CalEmbed } from "@/components/sections/cal-embed";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Consultoria 1:1",
  description:
    "Trabaja conmigo en estrategia, contenido e IA. Intensive, mentoring y workshops para equipos.",
  path: "/consultoria",
});

const calLink = process.env.NEXT_PUBLIC_CAL_LINK ?? "alexandercast/consultoria";

export default function ConsultoriaPage() {
  return (
    <>
      <section className="container-narrow py-24 md:py-32">
        <SectionHeading
          superlabel="Trabaja conmigo"
          title="Consultoria directa"
          as="h1"
          description="Sesiones pensadas para emprendedores que construyen en serio. Sin paquetes inflados, sin escalera de bait."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {servicios.map((s) => (
            <article
              key={s.id}
              className={cn(
                "flex h-full flex-col rounded-2xl border p-6 transition-colors",
                s.destacado
                  ? "border-[color:var(--gold)]/50 bg-[color:var(--gold)]/5"
                  : "border-white/10 bg-white/5 hover:border-white/20",
              )}
            >
              {s.destacado ? (
                <span className="mb-3 w-fit rounded-full border border-[color:var(--gold)]/50 bg-[color:var(--gold)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--gold)]">
                  Mas solicitado
                </span>
              ) : null}
              <h3 className="font-display text-2xl">{s.nombre}</h3>
              <p className="mt-1 text-sm text-white/60">{s.duracion}</p>
              <p className="mt-4 font-display text-3xl">{s.precio}</p>
              <p className="mt-4 text-sm text-white/70 text-pretty">{s.descripcion}</p>
              <ul className="mt-5 space-y-2 text-sm">
                {s.incluye.map((item) => (
                  <li key={item} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-[color:var(--gold)]" />
                    <span className="text-white/80">{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section id="agendar" className="container-narrow py-16 md:py-24">
        <SectionHeading
          superlabel="Agenda tu llamada"
          title="Hablemos 30 minutos"
          description="Te escucho, te digo si soy la persona indicada y, si lo soy, diseñamos un plan. Si no lo soy, te oriento a donde mirar."
        />
        <div className="mt-10">
          <CalEmbed calLink={calLink} />
        </div>
      </section>

      <section className="container-narrow py-16 md:py-24">
        <div className="mx-auto max-w-2xl">
          <SectionHeading
            superlabel="Preferis contarme primero"
            title="Escribeme un brief"
            description="Si prefieres dejarme contexto por escrito antes de agendar, este formulario me llega directo."
          />
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
            <ConsultationForm />
          </div>
        </div>
      </section>
    </>
  );
}
