import { ChevronDown } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/effects/reveal";
import { faqs } from "@/content/faqs";

export function FaqsSection() {
  return (
    <section
      id="faqs"
      aria-label="Preguntas frecuentes"
      className="relative border-t border-[color:var(--line)] bg-[color:var(--surface-0)] py-20 md:py-28"
    >
      <div className="container-narrow">
        <Reveal direction="up">
          <SectionHeading
            superlabel="Dudas"
            title="Preguntas rápidas."
          />
          <div className="section-divider" />
        </Reveal>

        <Reveal direction="up" delay={0.1}>
          <div className="mt-12 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-2 md:p-4">
            <Accordion className="divide-y divide-[color:var(--line)]">
              {faqs.map((faq, i) => (
                <AccordionItem key={faq.pregunta} value={`faq-${i}`} className="border-0 px-4">
                  <AccordionTrigger className="py-5 text-left font-display text-base font-semibold text-white hover:no-underline md:text-lg">
                    <span>{faq.pregunta}</span>
                    <ChevronDown
                      data-slot="accordion-trigger-icon"
                      className="size-4 text-[color:var(--gold-mid)] transition-transform duration-300 group-data-[panel-open]/accordion-trigger:rotate-180"
                      aria-hidden="true"
                    />
                  </AccordionTrigger>
                  <AccordionContent className="pr-10 text-sm text-[color:var(--muted-foreground)] md:text-base leading-relaxed">
                    <p>{faq.respuesta}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
