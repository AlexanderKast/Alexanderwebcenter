import type { Metadata } from "next";
import { PageHero }       from "@/components/shared/PageHero";
import { PodcastContent } from "@/components/pages/PodcastContent";

export const metadata: Metadata = {
  title: "Podcast — Casa Host",
  description: "Casa Host: conversaciones reales sobre negocios digitales, IA aplicada y mentalidad para emprendedores LATAM. Sin filtros.",
};

export default function PodcastPage() {
  return (
    <>
      <PageHero
        overline="CASA HOST"
        title="PODCAST"
        subtitle="NEGOCIOS DIGITALES · IA · MENTALIDAD"
        description="Conversaciones reales con emprendedores que están construyendo. Sin hype, sin humo — solo ejecución y aprendizaje."
      />
      <PodcastContent />
    </>
  );
}
