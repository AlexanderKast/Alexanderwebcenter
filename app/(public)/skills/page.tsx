import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { SkillsHero, SkillsProofStrip } from "@/components/sections/skills-landing/hero";
import { SkillsProblema } from "@/components/sections/skills-landing/problema";
import { SkillsGrid } from "@/components/sections/skills-landing/skills-grid";
import { SkillsComoFunciona } from "@/components/sections/skills-landing/como-funciona";
import { SkillsAutor } from "@/components/sections/skills-landing/autor";
import { SkillsFaq } from "@/components/sections/skills-landing/faq";
import { SkillsCtaFinal } from "@/components/sections/skills-landing/cta-final";

export const metadata: Metadata = buildMetadata({
  title: "9 Skills PRO para tu IA — Recurso gratuito",
  description:
    "Los manuales de operación que convierten a cualquier modelo de IA en un colaborador con criterio senior. 9 protocolos + guía de instalación. Gratis, en español, listos en 5 minutos.",
  path: "/skills",
});

export default function SkillsPage() {
  return (
    <main>
      <SkillsHero />
      <SkillsProofStrip />
      <SkillsProblema />
      <SkillsGrid />
      <SkillsComoFunciona />
      <SkillsAutor />
      <SkillsFaq />
      <SkillsCtaFinal />
    </main>
  );
}
