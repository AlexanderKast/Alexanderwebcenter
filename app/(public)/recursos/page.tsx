import type { Metadata } from "next";
import { PageHero }       from "@/components/shared/PageHero";
import { RecursosContent } from "@/components/pages/RecursosContent";

export const metadata: Metadata = {
  title: "Recursos — Alexander Cast",
  description:
    "Descargas gratuitas, mi stack AI-First y herramientas que uso en mis negocios. PDF de estrategia UGC, comunidad Skool y acceso a Kreoon.",
};

export default function RecursosPage() {
  return (
    <>
      <PageHero
        overline="HERRAMIENTAS"
        title="RECURSOS"
        subtitle="DESCARGAS · STACK · NEWSLETTER"
        description="Lo que uso yo. Templates, PDFs y el stack completo que mueve mis negocios — disponible para ti."
      />
      <RecursosContent />
    </>
  );
}
