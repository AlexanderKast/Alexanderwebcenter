"use client";
import { useState } from "react";

interface Feature {
  tag: string;
  name: string;
  img: string;
}

const features: Feature[] = [
  {
    tag: "Prompts · PDF",
    name: "50 Prompts de Marketing con IA",
    img: "/assets/images/section/feature-1.jpg",
  },
  {
    tag: "Automatización · Template",
    name: "Plantilla n8n: Pipeline de Contenido",
    img: "/assets/images/section/feature-2.jpg",
  },
  {
    tag: "Estrategia · PDF",
    name: "Guía: Estrategia de Contenido con IA 2026",
    img: "/assets/images/section/feature-1.jpg",
  },
];

export function DaviesFeature() {
  const [page, setPage] = useState(0);
  const itemsPerPage = 2;
  const totalPages = Math.ceil(features.length / itemsPerPage);
  const visible = features.slice(page * itemsPerPage, page * itemsPerPage + itemsPerPage);

  const prev = () => setPage(Math.max(0, page - 1));
  const next = () => setPage(Math.min(totalPages - 1, page + 1));

  return (
    <section className="section-feature flat-spacing tf-btn-swiper-main">
      <div className="container">
        <div className="s-header">
          <h2 className="text-display-2 fw-semibold letter-space--3 effectFade fadeUp">
            Recursos Gratuitos
          </h2>
          <a href="#contactScroll" className="tf-btn">
            VER TODOS
          </a>
        </div>
        <div className="position-relative">
          <div className="row g-4">
            {visible.map((f, i) => (
              <div key={i} className="col-md-6">
                <div className="wg-feature-v01 hover-img">
                  <a href="#contactScroll" className="feature-image img-style">
                    <img
                      loading="lazy"
                      width={628}
                      height={471}
                      src={f.img}
                      alt={f.name}
                    />
                  </a>
                  <div className="feature-content">
                    <div className="info">
                      <p className="tag text-white-64 letter-space--1">{f.tag}</p>
                      <h5 className="name letter-space--2">
                        <a href="#contactScroll" className="link">
                          {f.name}
                        </a>
                      </h5>
                    </div>
                    <h5 className="price letter-space--2 text-primary">GRATIS</h5>
                  </div>
                  <div className="tf-mouse">
                    <a href="#contactScroll" className="action tf-btn-2">
                      <i className="icon icon-arrow-long-right"></i>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="group-btn-slider mt-4">
            <div
              className="btn-nav-swiper text-caption fw-medium link cs-pointer"
              onClick={prev}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && prev()}
              aria-label="Anterior recurso"
            >
              <i className="icon icon-arrow-long-left"></i> PREV
            </div>
            <div
              className="btn-nav-swiper text-caption fw-medium link cs-pointer"
              onClick={next}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && next()}
              aria-label="Siguiente recurso"
            >
              NEXT <i className="icon icon-arrow-long-right"></i>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
