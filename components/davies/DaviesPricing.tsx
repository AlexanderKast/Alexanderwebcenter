"use client";
import { useState } from "react";

type PeriodKey = "mensual" | "anual";

interface Plan {
  nombre: string;
  precio: Record<PeriodKey, string>;
  periodo: Record<PeriodKey, string>;
  desc: string;
  items: string[];
  estilo: "basic" | "pro" | "max";
}

const planes: Plan[] = [
  {
    nombre: "Basic",
    precio: { mensual: "$497", anual: "$3,976" },
    periodo: { mensual: "/mes", anual: "/año" },
    desc: "Ideal para emprendedores y solopreneurs que quieren arrancar con IA sin enredarse en lo técnico.",
    items: [
      "Sesión estratégica mensual",
      "Auditoría inicial de marca",
      "Roadmap básico con IA",
      "Acceso a recursos exclusivos",
      "Soporte por WhatsApp",
    ],
    estilo: "basic",
  },
  {
    nombre: "Pro",
    precio: { mensual: "$997", anual: "$7,976" },
    periodo: { mensual: "/mes", anual: "/año" },
    desc: "Para marcas en crecimiento que necesitan automatizaciones activas y sistema de contenido con IA.",
    items: [
      "Todo lo del Basic +",
      "2 sesiones estratégicas/mes",
      "Implementación de 1 automatización",
      "Acceso a prompts premium",
      "Reporte mensual de resultados",
    ],
    estilo: "pro",
  },
  {
    nombre: "Max",
    precio: { mensual: "$2,497", anual: "$19,976" },
    periodo: { mensual: "/mes", anual: "/año" },
    desc: "Para agencias y empresas que quieren implementación completa con agente IA y sistema editorial propio.",
    items: [
      "Todo lo del Pro +",
      "Implementación completa",
      "Agente IA personalizado",
      "Manager dedicado",
      "Soporte prioritario",
    ],
    estilo: "max",
  },
];

export function DaviesPricing() {
  const [period, setPeriod] = useState<PeriodKey>("mensual");

  return (
    <section className="section-pricing flat-spacing flat-animate-tab">
      <div className="bg-img">
        <img loading="lazy" width={1440} height={1081} src="/assets/images/item/bg-4.png" alt="" />
      </div>
      <div className="container">
        <div className="s-header justify-content-center">
          <h2 className="text-display-2 letter-space--3 effectFade fadeUp">
            Planes claros, resultados reales
          </h2>
        </div>
        <ul className="pricing-tab_btn" role="tablist">
          <li className="nav-tab-item" role="presentation">
            <button
              className={`tf-btn-tab fw-medium letter-space--1${period === "mensual" ? " active" : ""}`}
              onClick={() => setPeriod("mensual")}
              aria-pressed={period === "mensual"}
            >
              <span className="dot-active"></span>
              Mensual
            </button>
          </li>
          <li className="nav-tab-item" role="presentation">
            <button
              className={`tf-btn-tab fw-medium letter-space--1${period === "anual" ? " active" : ""}`}
              onClick={() => setPeriod("anual")}
              aria-pressed={period === "anual"}
            >
              <span className="dot-active"></span>
              <span>
                Anual — <span className="text-primary">Ahorra 20%</span>
              </span>
            </button>
          </li>
        </ul>
        <div className="tf-grid-layout md-col-2 lg-col-3">
          {planes.map((plan) => {
            const isPro = plan.estilo === "pro";
            const isMax = plan.estilo === "max";
            return (
              <div
                key={plan.nombre}
                className={`wg-plan${isPro ? " style-2 type-2" : isMax ? " style-2" : ""}`}
              >
                {isPro && (
                  <>
                    <div className="bg-img bg-img_1 d-xl-block"></div>
                    <div className="bg-img bg-img_2">
                      <img loading="lazy" width={416} height={625} src="/assets/images/item/bg-2.png" alt="" />
                    </div>
                  </>
                )}
                {isMax && <div className="bg-img bg-img_1"></div>}
                <div
                  className={`br-line${isPro ? " bg-primary" : isMax ? " bg-white" : ""}`}
                ></div>
                <p className="plan-name letter-space--1 fw-medium">{plan.nombre}</p>
                <h4 className="plan-price">
                  {isPro && (
                    <span>
                      <span className="text-primary">$</span>
                      {plan.precio[period].replace("$", "")}
                    </span>
                  )}
                  {!isPro && plan.precio[period]}
                  <span className="text-body-2 fw-normal text-white-64 letter-space--1">
                    {plan.periodo[period]}
                  </span>
                </h4>
                <p className="plan-desc text-white-64">{plan.desc}</p>
                <a
                  href="#contactScroll"
                  className={`btn-action tf-btn ${
                    isPro
                      ? "style-fill w-100 animate-btn animate-dark"
                      : isMax
                      ? "style-fill-white w-100 animate-btn animate-dark"
                      : "style-troke w-100"
                  }`}
                >
                  <span className="text-caption fw-medium">ELEGIR ESTE PLAN</span>
                </a>
                <ul className="benefit-list tf-list vertical">
                  <li className="benefit_title text-white-64">Incluye:</li>
                  {plan.items.map((item, j) => (
                    <li key={j}>
                      <span className={isPro ? "text-primary" : ""}>//</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
