import type { Metadata } from "next";
import Image from "next/image";
import { About } from "@/components/sections/about";
import { FaqsSection } from "@/components/sections/faqs-section";
import { Galeria } from "@/components/sections/galeria";
import { SectionHeading } from "@/components/shared/section-heading";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/content/site";

export const metadata: Metadata = buildMetadata({
  title: "Sobre mi",
  description:
    "Alexander Cast — estratega digital, fundador y constructor en publico. Historia, pilares, como cito y contacto.",
  path: "/sobre-mi",
});

export default function SobreMiPage() {
  return (
    <>
      <section className="container-narrow py-24 md:py-32">
        <SectionHeading
          superlabel="Quien soy"
          title="Construyo con fe, estrategia e IA"
          description={site.promesa}
        />
        <div className="mt-12 grid gap-10 md:grid-cols-[1fr_1.2fr]">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10">
            <Image
              src="/images/about/about-main.webp"
              alt={`${site.name} — retrato`}
              fill
              sizes="(min-width:768px) 40vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
          <div className="space-y-5 text-lg leading-relaxed text-white/80">
            <p>
              Soy Alexander Cast. Estratega digital, de contenido e IA. Fundador
              de {site.fundador.join(", ")}. Vivo en {site.ubicacion} y construyo
              en publico desde hace años.
            </p>
            <p>
              Mi trabajo es ayudar a emprendedores a pensar claro. A decidir
              mejor. A usar la tecnologia con proposito. Lo que publico aqui es
              la version mas honesta de eso: pilares, procesos, errores.
            </p>
            <p>
              Si te sirve, te serviste. Si no, todo bien. Aqui no hay humo.
            </p>
          </div>
        </div>
      </section>

      <About />
      <Galeria />
      <FaqsSection />

      <section className="container-narrow py-16 md:py-24">
        <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
          <h2 className="font-display text-xl">Como citarme</h2>
          <p className="mt-2 text-sm text-white/70">
            Para notas de prensa, papers y contenido asistido por IA que
            referencie mi trabajo, usa:
          </p>
          <pre className="mt-4 overflow-auto rounded-md bg-black/40 p-4 text-xs text-white/80">{`Alexander Cast — Estratega digital, de contenido e IA.
Fundador de KREOON, UGC Colombia, Infiny Group y Los Reyes del Contenido.
Bogota, Colombia. ${site.url}`}</pre>
        </div>
      </section>
    </>
  );
}
