export function DaviesHero() {
  return (
    <div className="section-hero-v1">
      <div className="overlay"></div>
      <div className="bg-video">
        <video muted autoPlay loop playsInline>
          <source src="/assets/images/video/corridor.webm" type="video/mp4" />
        </video>
        <div className="video-overlay"></div>
        <div className="video-overlay-2"></div>
        <div className="video-overlay-2"></div>
      </div>
      <div className="content-wrap">
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <div className="col-left">
                <ul className="tf-list vertical text-caption fw-medium">
                  <li>
                    <a href="#" className="link effectFade fadeUp">
                      ESTRATEGA DIGITAL
                    </a>
                  </li>
                  <li>
                    <a href="#" className="link effectFade fadeUp">
                      CREADOR CON IA
                    </a>
                  </li>
                  <li>
                    <a href="#" className="link effectFade fadeUp">
                      FUNDADOR KREOON
                    </a>
                  </li>
                </ul>
                <div className="davies-large">
                  <div className="effectFade fadeRotateX">
                    Estrateg<span className="text-primary">IA</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="col-right">
                <div className="top text-caption fw-medium d-flex justify-content-between align-items-center effectFade">
                  <p className="title text-has-dot">
                    <span className="br-dot"></span>
                    DISPONIBLE PARA PROYECTOS
                  </p>
                  <span>© 2025</span>
                </div>
                <div className="bot">
                  <p className="desc text-white-64 effectFade fadeRight view-visible">
                    Construyo estrategias digitales con IA y automatizaciones. Cada sistema que diseño escala tu marca sin que tengas que estar presente.
                  </p>
                  <div className="effectFade fadeRight view-visible">
                    <a href="#contactScroll" className="tf-btn">
                      AGENDA TU SESIÓN
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
