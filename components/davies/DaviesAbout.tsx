export function DaviesAbout() {
  return (
    <section className="section-about-me flat-spacing" id="aboutScroll">
      <div className="s-img-bg">
        <img
          loading="lazy"
          width={1440}
          height={906}
          src="/assets/images/section/bg-about.jpg"
          alt="Background"
        />
      </div>
      <div className="container position-relative z-5">
        <div className="row">
          <div className="col-lg-5">
            <div className="col-left mb-lg-0">
              <div className="davies-video">
                <video className="video" muted autoPlay loop playsInline>
                  <source src="/assets/images/video/davies-video.mp4" type="video/mp4" />
                </video>
                <div className="overlay v1"></div>
                <div className="overlay mark-1"></div>
                <div className="overlay mark-2"></div>
              </div>
              <div className="signature">
                <img
                  loading="lazy"
                  width={111}
                  height={40}
                  src="/assets/images/logo/davies-small.svg"
                  alt="Firma Alexander Cast"
                />
              </div>
              <div className="badget">
                <img
                  loading="lazy"
                  width={156}
                  height={156}
                  src="/assets/images/item/badge-kreoon.svg"
                  alt="KREOON Badge"
                />
              </div>
            </div>
          </div>
          <div className="offset-lg-1 col-lg-6 offset-xl-2 col-xl-5">
            <div className="col-right">
              <h6 className="mini-title text-caption text-white-64">SOBRE MÍ</h6>
              <div className="text-color-change">
                <h5 className="desc letter-space--2 fw-normal">
                  Soy Alexander Cast, fundador de KREOON e Infiny Group. Combino estrategia
                  creativa, inteligencia artificial y automatizaciones para escalar marcas
                  digitales en LATAM.
                </h5>
              </div>
              <div className="br-line"></div>
              <ul className="experience-list overflow-hidden">
                <li>Experiencia</li>
                <li className="effectFade fadeRight">
                  <p className="exp_name">Founder — KREOON</p>
                  <p className="exp_year">2024 - hoy</p>
                </li>
                <li className="effectFade fadeRight">
                  <p className="exp_name">Founder — Infiny Group</p>
                  <p className="exp_year">2023 - hoy</p>
                </li>
                <li className="effectFade fadeRight">
                  <p className="exp_name">Director Creativo — Agencia UGC Colombia</p>
                  <p className="exp_year">2022 - hoy</p>
                </li>
                <li className="effectFade fadeRight">
                  <p className="exp_name">Consultor Estrategia Digital</p>
                  <p className="exp_year">2020 - 2022</p>
                </li>
                <li className="effectFade fadeRight">
                  <p className="exp_name">Marketing Digital & Contenido</p>
                  <p className="exp_year">2019 - 2020</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
