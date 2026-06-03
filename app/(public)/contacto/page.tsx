import type { Metadata } from "next";
import { PageHero }        from "@/components/shared/PageHero";
import { ContactoContent } from "@/components/pages/ContactoContent";

export const metadata: Metadata = {
  title: "Contacto — Alexander Cast",
  description:
    "Escríbeme por WhatsApp o correo. Para proyectos, colaboraciones, consultoría y preguntas sobre el ecosistema.",
};

export default function ContactoPage() {
  return (
    <>
      <PageHero
        overline="TRABAJEMOS JUNTOS"
        title="CONTACTO"
        subtitle="RESPONDO EN MENOS DE 24H"
        description="Para proyectos concretos, colaboraciones o cualquier pregunta. Sin formularios genéricos — hablamos directo."
      />
      <ContactoContent />
    </>
  );
}
