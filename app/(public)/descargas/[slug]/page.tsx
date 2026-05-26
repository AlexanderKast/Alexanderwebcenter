import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { leadMagnets } from "@/content/lead-magnets";
import { LeadMagnetForm } from "@/components/forms/lead-magnet-form";
import { SectionHeading } from "@/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";
import { buildMetadata } from "@/lib/seo";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return leadMagnets.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const magnet = leadMagnets.find((m) => m.slug === slug);
  if (!magnet) return {};
  return buildMetadata({
    title: magnet.titulo,
    description: magnet.subtitulo,
    path: `/descargas/${magnet.slug}`,
  });
}

export default async function DescargaPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const magnet = leadMagnets.find((m) => m.slug === slug);
  if (!magnet) notFound();

  return (
    <section className="container-narrow py-24 md:py-32">
      <Link
        href="/#recursos"
        className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
      >
        <ArrowLeft className="size-4" /> Volver a recursos
      </Link>

      <div className="mt-10 grid gap-12 md:grid-cols-2">
        <div>
          <SectionHeading
            superlabel="Descarga gratis"
            title={magnet.titulo}
            align="left"
          />
          <p className="mt-4 text-lg text-white/75 text-pretty">
            {magnet.subtitulo}
          </p>
          <p className="mt-6 text-base text-white/65 leading-relaxed text-pretty">
            {magnet.descripcion}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge variant="outline" className="border-white/20 text-white/80">
              {magnet.formato}
            </Badge>
            {magnet.paginas ? (
              <Badge variant="outline" className="border-white/20 text-white/80">
                {magnet.paginas} paginas
              </Badge>
            ) : null}
            <Badge variant="outline" className="border-[color:var(--gold)]/40 text-[color:var(--gold)]">
              Pilar: {magnet.pilar}
            </Badge>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
          <h2 className="font-display text-xl">Te lo envio a tu correo</h2>
          <p className="mt-1 text-sm text-white/60">
            Cero spam. Te sumo a la newsletter para compartirte lo mejor que
            publico, puedes salir cuando quieras.
          </p>
          <div className="mt-6">
            <LeadMagnetForm slug={magnet.slug} />
          </div>
        </div>
      </div>
    </section>
  );
}
