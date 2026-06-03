import type { Metadata } from "next";
import { PageHero }        from "@/components/shared/PageHero";
import { SobreMiContent }  from "@/components/pages/SobreMiContent";

export const metadata: Metadata = {
  title: "Sobre mí — Alexander Cast",
  description:
    "Estratega digital AI-First. Fundador de KREOON, UGC Colombia e Infiny Group. Historia, valores y el camino que me trajo aquí.",
};

export default function SobreMiPage() {
  return (
    <>
      <PageHero
        overline="QUIÉN SOY"
        title="SOBRE MÍ"
        subtitle="ESTRATEGA · FUNDADOR · CONSTRUCTOR"
        description="Construyo con fe, estrategia e inteligencia artificial. Bogotá, Colombia — operando en toda LATAM."
      />
      <SobreMiContent />
    </>
  );
}
