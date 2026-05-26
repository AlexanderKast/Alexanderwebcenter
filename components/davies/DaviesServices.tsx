"use client";
import { useState } from "react";

interface Servicio {
  titulo: string;
  desc: string;
  items: string[];
  img: string;
  imgMini: string | null;
  bgImg: string;
}

const servicios: Servicio[] = [
  {
    titulo: "Estrategia Digital con IA",
    desc: "Diseño la estrategia digital de tu marca con IA como palanca. Auditoría, roadmap y sistema de contenido que funciona solo.",
    items: [
      "Auditoría de marca digital",
      "Roadmap de contenido con IA",
      "Sistema editorial automatizado",
      "Análisis de competidores con IA",
      "KPIs y métricas personalizadas",
    ],
    img: "/assets/images/section/service-1.jpg",
    imgMini: "/assets/images/section/service-mini-1.jpg",
    bgImg: "/assets/images/section/bg-service-1.jpg",
  },
  {
    titulo: "Automatizaciones & Agentes IA",
    desc: "Construyo agentes IA y workflows que trabajan por ti 24/7. Desde WhatsApp hasta CRMs, todo conectado y automatizado.",
    items: [
      "Agentes IA personalizados",
      "Workflows con n8n y Make",
      "Integración Claude / GPT",
      "CRM automatizado",
      "Reportes automáticos",
    ],
    img: "/assets/images/section/service-2.jpg",
    imgMini: "/assets/images/section/service-mini-2.jpg",
    bgImg: "/assets/images/section/bg-service-2.jpg",
  },
  {
    titulo: "Contenido con IA",
    desc: "Produzco contenido con IA de forma sistemática: videos, carruseles, textos y campañas que se escalan sin perder autenticidad.",
    items: [
      "Videos con Remotion + Veo",
      "Carruseles y posts IA",
      "Guiones con Claude",
      "Voz con ElevenLabs",
      "Sistema UGC automatizado",
    ],
    img: "/assets/images/section/service-3.jpg",
    imgMini: null,
    bgImg: "/assets/images/section/bg-service-3.jpg",
  },
];

export function DaviesServices() {
  const [active, setActive] = useState(0);

  return (
    <section className="section-service-2 overflow-hidden flat-spacing" id="serviceScroll">
      <div className="bg-image-list">
        {servicios.map((s, i) => (
          <div key={i} className={`bg-image${i === active ? " active" : ""}`}>
            <img loading="lazy" width={1440} height={938} src={s.bgImg} alt="" />
            <div className="img-item">
              <img loading="lazy" width={1440} height={938} src="/assets/images/item/overlay.png" alt="" />
            </div>
          </div>
        ))}
      </div>

      <div className="container">
        <div className="s-header s-header-scroll">
          <h2 className="text-display-2 fw-semibold effectFade fadeUp">Servicios</h2>
        </div>
      </div>

      <div className="container">
        <div className="wrap-control position-relative">
          {servicios.map((serv, i) => (
            <div
              key={i}
              className={`wg-service-2${i === active ? " active" : ""}`}
              onClick={() => setActive(i)}
              style={{ cursor: "pointer" }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setActive(i)}
              aria-expanded={i === active}
            >
              <div className="main-image">
                <div className="image">
                  <img
                    loading="lazy"
                    width={424}
                    height={530}
                    src={serv.img}
                    alt={serv.titulo}
                  />
                </div>
                <div className="action tf-btn-2 cs-pointer">
                  <i className="icon icon-arrow-long-right"></i>
                </div>
              </div>
              <div className="center">
                <h5 className="title">{serv.titulo}</h5>
                <p className="desc">{serv.desc}</p>
                <div className="br-line d-flex"></div>
                <ul className="tf-list vertical">
                  {serv.items.map((item) => (
                    <li key={item} className="letter-space--1">
                      <span className="text-primary">//</span> {item}
                    </li>
                  ))}
                </ul>
                <a href="#contactScroll" className="tf-btn">
                  AGENDA TU SESIÓN
                </a>
              </div>
              <div className="image-simu"></div>
              {serv.imgMini && (
                <div className="image-2">
                  <img
                    loading="lazy"
                    width={212}
                    height={265}
                    src={serv.imgMini}
                    alt=""
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
