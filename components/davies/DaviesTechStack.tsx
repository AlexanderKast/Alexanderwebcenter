interface TechItem {
  nombre: string;
  porcentaje: string;
  logo: string;
}

const techStack: TechItem[] = [
  { nombre: "Claude", porcentaje: "96%", logo: "/assets/images/section/app-claude.svg" },
  { nombre: "n8n", porcentaje: "92%", logo: "/assets/images/section/app-n8n.svg" },
  { nombre: "GPT-4o", porcentaje: "90%", logo: "/assets/images/section/app-openai.svg" },
];

const brands = [
  { src: "/assets/images/brand/brand-1.svg", w: 76, h: 48 },
  { src: "/assets/images/brand/brand-2.svg", w: 125, h: 24 },
  { src: "/assets/images/brand/brand-3.svg", w: 57, h: 48 },
  { src: "/assets/images/brand/brand-4.svg", w: 142, h: 36 },
  { src: "/assets/images/brand/brand-5.svg", w: 84, h: 48 },
  { src: "/assets/images/brand/brand-6.svg", w: 140, h: 36 },
  { src: "/assets/images/brand/brand-7.svg", w: 48, h: 48 },
  { src: "/assets/images/brand/brand-8.svg", w: 138, h: 24 },
  { src: "/assets/images/brand/brand-9.svg", w: 63, h: 48 },
  { src: "/assets/images/brand/brand-10.svg", w: 133, h: 24 },
];

export function DaviesTechStack() {
  return (
    <>
      {/* Tech Stack */}
      <section className="section-tech-stack flat-spacing">
        <div className="container">
          <h6 className="mini-title text-caption text-white-64 text-center">
            STACK DE IA
          </h6>
        </div>
        <ul className="tech-stack-list main-action-active">
          {techStack.map((tech, i) => (
            <li key={tech.nombre} className={`wg-tech btn-active${i === 0 ? " active" : ""}`}>
              <div className="tech_text letter-space--2">
                <p className="h1 fw-normal">{tech.nombre}</p>
                <h6 className="fw-normal">{tech.porcentaje}</h6>
              </div>
              <div className="infiniteSlide_tech_main">
                <div className="infiniteSlide infiniteSlide_tech" data-clone="5">
                  {[0, 1, 2].map((j) => (
                    <span key={j}>
                      <div className="app_name">
                        <div className="tech_text letter-space--2">
                          <p className="h1 text">{tech.nombre}</p>
                          <h6 className="process fw-normal">{tech.porcentaje}</h6>
                        </div>
                      </div>
                      <div className="app_icon">
                        <img loading="lazy" width={136} height={68} src={tech.logo} alt={tech.nombre} />
                      </div>
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Brand / Ecosistema */}
      <div className="section-brand flat-spacing">
        <div className="container">
          <h6 className="mini-title text-caption text-white-64 text-center">
            HERRAMIENTAS & ECOSISTEMA
          </h6>
          <div className="brand-list">
            {brands.map((b, i) => (
              <a key={i} href="#" className="img-brand">
                <img loading="lazy" width={b.w} height={b.h} src={b.src} alt="Brand" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Award / Stats */}
      <section className="section-award flat-spacing">
        <div className="container">
          <div className="row">
            <div className="col-md-5 ms-auto">
              <div className="col-right">
                <h6 className="mini-title text-caption text-white-64">TRAYECTORIA</h6>
                <h5 className="fw-normal letter-space--2 text-color-change">
                  Desde 2020, he diseñado sistemas de IA y contenido que han transformado
                  marcas en LATAM. Cada proyecto es una prueba de que estrategia + IA =
                  crecimiento real.
                </h5>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-5">
              <div className="col-left">
                <p className="desc text-white-64 mini-title">
                  60+ workflows automatizados.
                  <br />
                  Sistemas que trabajan mientras tú escalas.
                </p>
                <div className="award-static-list">
                  {[
                    { name: "KREOON", detail: "x4 lanzamientos" },
                    { name: "n8n Workflows", detail: "x60+" },
                    { name: "Contenidos producidos", detail: "x200+" },
                  ].map((item) => (
                    <div key={item.name} className="award-item h4 letter-space--2">
                      {item.name}{" "}
                      <span className="text-body-1 letter-space--1">{item.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="wrap-flip-image flat-spacing">
          <div className="container">
            <div className="flip-image-list gsap-anime-2">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="flip-image">
                  <img
                    loading="lazy"
                    width={300}
                    height={300}
                    src={`/assets/images/section/award-${n}.jpg`}
                    alt={`Award ${n}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
