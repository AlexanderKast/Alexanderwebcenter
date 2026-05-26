interface Paso {
  titulo: string;
  desc: string;
  img: string;
  num: string;
  bg: string;
}

const pasos: Paso[] = [
  {
    titulo: "Descubrir tu palanca",
    desc: "Analizamos tu negocio, audiencia y estado actual con IA para identificar el punto de mayor apalancamiento.",
    img: "/assets/images/item/process-1.png",
    num: "/assets/images/item/S1.svg",
    bg: "/assets/images/item/bg-1.jpg",
  },
  {
    titulo: "Diseñar tu sistema",
    desc: "Creamos la estrategia, los flujos y los contenidos. Todo orientado a resultados medibles desde el día uno.",
    img: "/assets/images/item/process-2.png",
    num: "/assets/images/item/S2.svg",
    bg: "/assets/images/item/bg-1.jpg",
  },
  {
    titulo: "Activar y escalar",
    desc: "Implementamos, automatizamos y dejamos todo funcionando. Tú escalas, el sistema trabaja.",
    img: "/assets/images/item/process-3.png",
    num: "/assets/images/item/S3.svg",
    bg: "/assets/images/item/bg-1.jpg",
  },
];

export function DaviesProcess() {
  return (
    <section className="section-process flat-spacing">
      <div className="container">
        <div className="s-header">
          <h2 className="title text-display-2 letter-space--3 fw-semibold effectFade fadeUp">
            El Proceso
          </h2>
        </div>
        <div className="process-list">
          <div className="row g-4">
            {pasos.map((paso, i) => (
              <div key={i} className="col-md-4 effectFade fadeUp no-div">
                <div className="wg-process">
                  <div className="bg-img">
                    <img
                      loading="lazy"
                      width={509}
                      height={509}
                      src={paso.bg}
                      alt=""
                    />
                  </div>
                  <div className="content position-relative z-5">
                    <div className="img-icon">
                      <img
                        loading="lazy"
                        width={120}
                        height={120}
                        src={paso.img}
                        alt=""
                      />
                    </div>
                    <div>
                      <h5 className="title letter-space--2">
                        <a href="#" className="link">
                          {paso.titulo}
                        </a>
                      </h5>
                      <div className="br-line"></div>
                      <div className="bot">
                        <div className="img-item">
                          <img
                            loading="lazy"
                            width={81}
                            height={68}
                            src={paso.num}
                            alt=""
                          />
                        </div>
                        <p className="desc text-body-3 letter-space--1 text-white-64">
                          {paso.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
