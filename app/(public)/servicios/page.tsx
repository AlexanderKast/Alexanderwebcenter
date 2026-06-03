import type { Metadata } from "next";
import { PageHero }      from "@/components/shared/PageHero";
import { ServiciosContent } from "@/components/pages/ServiciosContent";

export const metadata: Metadata = {
  title: "Servicios",
  description: "Consultoría estratégica, IA aplicada y live shopping para emprendedores y marcas en LATAM. Desde $300 hasta $4,500 — elige el nivel que necesitas.",
};

export default function ServiciosPage() {
  return (
    <>
      <PageHero
        overline="LO QUE OFREZCO"
        title="SERVICIOS"
        subtitle="DESDE $300 HASTA $4,500"
        description="No vendo cursos. Trabajo directamente contigo en tu negocio. Diseñamos la estrategia, implementamos los sistemas y medimos los resultados."
      />
      <ServiciosContent />
    </>
  );
}
