"use client";
import { useState } from "react";

interface FaqItem {
  q: string;
  a: string;
}

const faqs: FaqItem[] = [
  {
    q: "¿Necesito saber programar para trabajar contigo?",
    a: "No. Me encargo de toda la parte técnica. Tú defines el objetivo, yo construyo el sistema.",
  },
  {
    q: "¿Cuánto tiempo tarda en verse resultados?",
    a: "Los primeros resultados se ven en 2–4 semanas con el sistema activo y corriendo.",
  },
  {
    q: "¿Trabajas con negocios de cualquier tamaño?",
    a: "Sí, desde solopreneurs hasta agencias y empresas en crecimiento en LATAM.",
  },
  {
    q: "¿Qué herramientas de IA usas?",
    a: "Claude, GPT-4o, n8n, Make, Remotion, ElevenLabs, Antigravity y más. El stack varía según el proyecto.",
  },
  {
    q: "¿Cómo empiezo?",
    a: "Completa el formulario o escríbeme directo. Agendamos una sesión de diagnóstico gratuita de 30 min.",
  },
];

export function DaviesFaq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="section-faq flat-spacing">
      <div className="container">
        <div className="s-header d-block">
          <h2 className="text-display-2 letter-space--3 text-center effectFade fadeUp">
            Preguntas <br />
            frecuentes
          </h2>
        </div>
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <div id="accordion-faq_list">
              {faqs.map((faq, i) => (
                <div key={i} className="accordion-faq_item" role="presentation">
                  <div
                    className={`accordion-action text-body-1 letter-space--1 fw-medium${
                      open === i ? "" : " collapsed"
                    }`}
                    onClick={() => setOpen(open === i ? null : i)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setOpen(open === i ? null : i)}
                    aria-expanded={open === i}
                  >
                    <span className="accordion-order">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="accordion-text">{faq.q}</p>
                    <div className="ic-wrap d-flex">
                      <i
                        className={`icon icon-arrow-caret-${
                          open === i ? "up" : "down"
                        } fs-10`}
                      ></i>
                    </div>
                  </div>
                  {open === i && (
                    <div className="collapse show">
                      <p className="accordion-content">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
