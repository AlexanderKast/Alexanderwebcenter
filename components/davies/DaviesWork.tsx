"use client";
import { useState } from "react";
import Image from "next/image";

interface Proyecto {
  nombre: string;
  tags: string[];
  img: string;
  desc: string;
}

const proyectos: Proyecto[] = [
  {
    nombre: "Jarvis",
    tags: ["AGENTE IA", "WHATSAPP", "AUTOMATIZACIÓN"],
    img: "/assets/images/section/work-1.jpg",
    desc: "Agente IA en WhatsApp que trabaja 24/7",
  },
  {
    nombre: "KREOON",
    tags: ["PLATAFORMA TECH", "SAAS", "LATAM"],
    img: "/assets/images/section/work-2.jpg",
    desc: "Plataforma de contenido UGC",
  },
  {
    nombre: "ContentForge",
    tags: ["CONTENIDO IA", "PIPELINE", "UGC"],
    img: "/assets/images/section/work-3.jpg",
    desc: "Motor de generación de contenido con IA",
  },
];

export function DaviesWork() {
  const [active, setActive] = useState(0);

  const prev = () => setActive((active - 1 + proyectos.length) % proyectos.length);
  const next = () => setActive((active + 1) % proyectos.length);

  return (
    <div className="section-selected-work flat-spacing pb-0" id="workScroll">
      <div className="bg-img effectFade fadeUp">
        <img
          loading="lazy"
          width={1440}
          height={720}
          src="/assets/images/item/mountain.png"
          alt="Proyectos seleccionados"
        />
      </div>
      <div className="content-wrap-1 wrap-list-btn">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <div className="col-left mb-md-0">
                <p className="mini-title text-caption text-white-64 effectFade fadeUp">
                  PROYECTOS SELECCIONADOS
                </p>
                <div className="position-relative effectFade fadeUp no-div">
                  <div>
                    {proyectos.map((p, i) => (
                      <p
                        key={p.nombre}
                        onClick={() => setActive(i)}
                        className={`text-display-2 fw-semibold cs-pointer${
                          i === active ? " text-primary" : ""
                        }`}
                        style={{ cursor: "pointer", transition: "color 0.3s" }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && setActive(i)}
                        aria-pressed={i === active}
                      >
                        {p.nombre}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="col-right">
                <div className="image effectFade fadeZoom">
                  <img
                    src={proyectos[active].img}
                    alt={proyectos[active].nombre}
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="content-wrap-2">
        <div className="container position-relative z-5">
          <div className="row">
            <div className="col-md-4">
              <ul className="work-tag">
                <li>
                  <div className="group-btn">
                    {proyectos[active].tags.map((tag) => (
                      <a key={tag} href="#" className="tf-btn style-2">
                        {tag}
                      </a>
                    ))}
                  </div>
                </li>
              </ul>
            </div>
            <div className="col-6 col-md-4">
              <div className="group-btn-slider">
                <div
                  className="btn-nav-swiper cs-pointer text-caption fw-medium link"
                  onClick={prev}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && prev()}
                  aria-label="Proyecto anterior"
                >
                  <i className="icon icon-arrow-long-left"></i> PREV
                </div>
                <div
                  className="btn-nav-swiper cs-pointer text-caption fw-medium link"
                  onClick={next}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && next()}
                  aria-label="Proyecto siguiente"
                >
                  NEXT <i className="icon icon-arrow-long-right"></i>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-4">
              <div className="col-right">
                <p className="text-display-2 letter-space--3 fw-semibold">
                  20<span className="text-primary">25</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
