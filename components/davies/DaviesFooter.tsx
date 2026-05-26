export function DaviesFooter() {
  return (
    <footer className="tf-footer">
      <div className="container">
        <div className="br-line"></div>
      </div>
      <div className="footer-inner">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <p className="title text-has-dot text-caption fw-medium mb-md-0">
                <span className="br-dot"></span>
                OPERANDO DESDE BOGOTÁ, PARA EL MUNDO
              </p>
            </div>
            <div className="col-6 col-sm-2 col-md-1">
              <p className="footer-heading text-caption fw-medium text-white-64">SITEMAP</p>
            </div>
            <div className="col-6 col-sm-4 col-md-3">
              <ul className="footer-menu-list mb-sm-0">
                <li>
                  <a href="#aboutScroll" className="link letter-space--2 h5">
                    About
                  </a>
                </li>
                <li>
                  <a href="#workScroll" className="link letter-space--2 h5">
                    Works
                  </a>
                </li>
                <li>
                  <a href="#serviceScroll" className="link letter-space--2 h5">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#contactScroll" className="link letter-space--2 h5">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-6 col-sm-2 col-md-1">
              <p className="footer-heading text-caption fw-medium text-white-64">SOCIALS</p>
            </div>
            <div className="col-6 col-sm-4 col-md-3">
              <ul className="footer-menu-list mb-0">
                <li>
                  <a
                    href="https://instagram.com/alexemprendee"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link letter-space--2 h5"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/alexandercast"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link letter-space--2 h5"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/AlexanderKast"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link letter-space--2 h5"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <div className="img-agency">
            <img
              className="effectFade fadeZoom"
              loading="lazy"
              width={1293}
              height={269}
              src="/assets/images/logo/agency.png"
              alt="Alexander Cast"
            />
          </div>
          <div className="bottom">
            <p className="text-nocopy text-caption fw-medium letter-space--1">
              © ALEXANDERCAST · ESTRATEG<span className="text-primary">IA</span>
            </p>
            <a
              href="#top"
              className="action-go-top tf-link-icon link text-caption fw-medium letter-space--1"
            >
              BACK TO TOP
              <i className="icon icon-arrow-long-right"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
