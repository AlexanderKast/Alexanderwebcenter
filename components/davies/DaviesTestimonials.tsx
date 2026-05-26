"use client";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

interface Testimonio {
  nombre: string;
  cargo: string;
  texto: string;
  img: string;
}

const testimonios: Testimonio[] = [
  {
    nombre: "Carlos Mendoza",
    cargo: "CEO · Startup Bogotá",
    texto:
      "Alexander rediseñó nuestra presencia digital. El resultado es impactante, rápido e intuitivo — transmite nuestra marca con claridad.",
    img: "/assets/images/section/tes-1.jpg",
  },
  {
    nombre: "Laura Jiménez",
    cargo: "Fundadora · E-commerce México",
    texto:
      "Trabajar con Alexander fue fluido. Capturó nuestra visión y entregó un sitio moderno y funcional que se siente completamente nuestro.",
    img: "/assets/images/section/tes-2.jpg",
  },
  {
    nombre: "Sebastián Torres",
    cargo: "Director Marketing · Agencia LATAM",
    texto:
      "Desde el primer concepto hasta el lanzamiento, Alexander superó expectativas. Cada decisión fue intencional y el resultado habla solo.",
    img: "/assets/images/section/tes-3.jpg",
  },
];

interface StatItem {
  label: string;
  num: number;
  suffix: string;
  sub: string;
}

const stats: StatItem[] = [
  {
    label: "Projects Delivered",
    num: 50,
    suffix: "+",
    sub: "Sistemas que generan resultados reales",
  },
  {
    label: "Clients Satisfaction",
    num: 96,
    suffix: "%",
    sub: "Clientes que repiten o refieren",
  },
  {
    label: "Years of Experience",
    num: 10,
    suffix: "+",
    sub: "Estrategia digital + IA en LATAM",
  },
];

interface CounterProps {
  target: number;
  suffix: string;
}

function Counter({ target, suffix }: CounterProps) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export function DaviesTestimonials() {
  const [active, setActive] = useState(0);

  const prev = () => setActive((active - 1 + testimonios.length) % testimonios.length);
  const next = () => setActive((active + 1) % testimonios.length);

  return (
    <section className="section-testimonial flat-spacing tf-btn-swiper-main">
      <h6 className="mini-title text-caption text-white-64 text-center">
        CONFÍAN EN EL SISTEMA
      </h6>
      <div className="container">
        <div className="row g-4 justify-content-center">
          {testimonios.map((t, i) => (
            <div key={i} className="col-md-4">
              <div
                className={`testimonial-v01${i === active ? " active" : ""}`}
                onClick={() => setActive(i)}
                style={{ cursor: "pointer" }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setActive(i)}
              >
                <div className="tes-author">
                  <div className="author_image">
                    <img
                      loading="lazy"
                      src={t.img}
                      alt={t.nombre}
                      width={437}
                      height={328}
                    />
                  </div>
                  <div className="author_info">
                    <h6 className="info__name text-body-1 letter-space--1">{t.nombre}</h6>
                    <p className="info__duty">{t.cargo}</p>
                  </div>
                </div>
                <div className="br-line"></div>
                <p className="tes-text text-body-1">"{t.texto}"</p>
              </div>
            </div>
          ))}
        </div>
        <div className="group-btn-slider mt-4 justify-content-center">
          <div
            className="nav-prev-swiper lh-1"
            onClick={prev}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && prev()}
            aria-label="Testimonio anterior"
          >
            <i className="icon icon-arrow-caret-left fs-8"></i>
          </div>
          <div className="sw-dot-default tf-sw-pagination">
            {testimonios.map((_, i) => (
              <span
                key={i}
                className={`swiper-pagination-bullet${i === active ? " swiper-pagination-bullet-active" : ""}`}
                onClick={() => setActive(i)}
                style={{ cursor: "pointer" }}
              ></span>
            ))}
          </div>
          <div
            className="nav-next-swiper lh-1"
            onClick={next}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && next()}
            aria-label="Testimonio siguiente"
          >
            <i className="icon icon-arrow-caret-right fs-8"></i>
          </div>
        </div>
      </div>
      <div className="indicator-wrap flat-spacing">
        <div className="container">
          <div className="row">
            {stats.map((s, i) => (
              <div key={i} className="col-md-4">
                <div className="wg-indicator mb-md-0">
                  <p className="indicate-title text-body-1">
                    <span className="text-primary">//</span> {s.label}
                  </p>
                  <p className="indicate-counter wg-counter text-display-1 fw-medium">
                    <Counter target={s.num} suffix={s.suffix} />
                  </p>
                  <p className="indicate-sub">{s.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-img-item">
        <img loading="lazy" width={1440} height={800} src="/assets/images/item/grid.png" alt="" />
      </div>
    </section>
  );
}
