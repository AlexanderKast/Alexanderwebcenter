"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export function DaviesHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Reloj BOG
  useEffect(() => {
    const el = document.getElementById("daviesClock");
    if (!el) return;
    const tick = () => {
      const now = new Date();
      const bog = new Intl.DateTimeFormat("es-CO", {
        timeZone: "America/Bogota",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(now);
      el.textContent = bog;
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className={`tf-header${scrolled ? " header-fixed" : ""}`}>
        <div className="header-inner">
          <div className="container">
            <div className="row">
              <div className="col-6 col-md-1">
                <Link href="/" className="logo-site" aria-label="Inicio">
                  <i className="icon icon-davies-logo"></i>
                </Link>
              </div>
              <div className="col-7 d-none d-md-block">
                <div className="box-navigation">
                  <ul className="nav-menu-main">
                    <li className="menu-item">
                      <a href="#workScroll" className="item-link link text-caption">
                        <span>01 /</span>PROYECTOS
                      </a>
                    </li>
                    <li className="menu-item">
                      <a href="#serviceScroll" className="item-link link text-caption">
                        <span>02 /</span>SERVICIOS
                      </a>
                    </li>
                    <li className="menu-item">
                      <a href="#aboutScroll" className="item-link link text-caption">
                        <span>03 /</span>SOBRE MÍ
                      </a>
                    </li>
                    <li className="menu-item">
                      <a href="#contactScroll" className="item-link link text-caption">
                        <span>04 /</span>CONTACTO
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-3 col-md-2 d-none d-sm-block">
                <div className="header-contact">
                  <p className="text-caption">
                    BOG <span className="clock" id="daviesClock"></span>
                  </p>
                </div>
              </div>
              <div className="col-6 col-sm-3 col-md-2 d-flex justify-content-end align-items-start">
                <button
                  type="button"
                  className="btn-mobile-menu text-caption text-white link"
                  onClick={() => setMenuOpen(true)}
                  aria-label="Abrir menú"
                >
                  <i className="icon icon-menu"></i>
                  MENU
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Offcanvas */}
      <div className={`offcanvas-menu${menuOpen ? " active" : ""}`}>
        <div className="offcanvas-content">
          <div className="container h-100">
            <div className="offcanvas-content_wrapin">
              <div className="canvas_head">
                <Link href="/" className="logo-site" onClick={closeMenu} aria-label="Inicio">
                  <i className="icon icon-davies-logo"></i>
                </Link>
                <button
                  className="btn-mobile-menu text-caption link"
                  onClick={closeMenu}
                  aria-label="Cerrar menú"
                >
                  <i className="icon icon-close"></i>
                  CLOSE
                </button>
              </div>
              <div className="canvas_center">
                <ul className="nav-ul-mb">
                  <li>
                    <div className="item">
                      <a href="#workScroll" className="mb-menu-link text-display-1" onClick={closeMenu}>
                        <span className="text">Proyectos</span>
                        <div className="infiniteSlide_text_main">
                          <div className="infiniteSlide infiniteSlide_text" data-clone="5">
                            <p className="text-body-2 letter-space--1"><span className="text-primary">//</span> View Works</p>
                            <p className="text-body-2 letter-space--1"><span className="text-primary">//</span> View Works</p>
                            <p className="text-body-2 letter-space--1"><span className="text-primary">//</span> View Works</p>
                          </div>
                        </div>
                      </a>
                    </div>
                  </li>
                  <li>
                    <div className="item">
                      <a href="#serviceScroll" className="mb-menu-link text-display-1" onClick={closeMenu}>
                        <span className="text">Servicios</span>
                        <div className="infiniteSlide_text_main">
                          <div className="infiniteSlide infiniteSlide_text" data-clone="5">
                            <p className="text-body-2 letter-space--1"><span className="text-primary">//</span> View Services</p>
                            <p className="text-body-2 letter-space--1"><span className="text-primary">//</span> View Services</p>
                            <p className="text-body-2 letter-space--1"><span className="text-primary">//</span> View Services</p>
                          </div>
                        </div>
                      </a>
                    </div>
                  </li>
                  <li>
                    <div className="item">
                      <a href="#aboutScroll" className="mb-menu-link text-display-1" onClick={closeMenu}>
                        <span className="text">Sobre mí</span>
                        <div className="infiniteSlide_text_main">
                          <div className="infiniteSlide infiniteSlide_text" data-clone="5">
                            <p className="text-body-2 letter-space--1"><span className="text-primary">//</span> View About</p>
                            <p className="text-body-2 letter-space--1"><span className="text-primary">//</span> View About</p>
                            <p className="text-body-2 letter-space--1"><span className="text-primary">//</span> View About</p>
                          </div>
                        </div>
                      </a>
                    </div>
                  </li>
                  <li>
                    <div className="item">
                      <a href="#contactScroll" className="mb-menu-link text-display-1" onClick={closeMenu}>
                        <span className="text">Contacto</span>
                        <div className="infiniteSlide_text_main">
                          <div className="infiniteSlide infiniteSlide_text" data-clone="5">
                            <p className="text-body-2 letter-space--1"><span className="text-primary">//</span> Get in Touch</p>
                            <p className="text-body-2 letter-space--1"><span className="text-primary">//</span> Get in Touch</p>
                            <p className="text-body-2 letter-space--1"><span className="text-primary">//</span> Get in Touch</p>
                          </div>
                        </div>
                      </a>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="canvas_bot">
                <div className="canvas_social">
                  <a
                    href="https://instagram.com/alexemprendee"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link text-caption letter-space--1"
                  >
                    Instagram
                  </a>
                  <a
                    href="https://www.linkedin.com/in/alexandercast"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link text-caption letter-space--1"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="https://github.com/AlexanderKast"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link text-caption letter-space--1"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
