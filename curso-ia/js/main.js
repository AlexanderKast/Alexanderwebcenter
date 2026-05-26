/* ═══════════════════════════════════════════════════════════
   CURSO IA APLICADA — main.js
   Orden de ejecución: preloader → clock → neural canvas →
   scroll video → swiper → reveal → counters → faq → gsap hero
═══════════════════════════════════════════════════════════ */

'use strict';

document.addEventListener('DOMContentLoaded', function () {

  /* ══════════════════════════════════════════════════════
     1. PRELOADER
  ══════════════════════════════════════════════════════ */
  (function initPreloader() {
    var loader  = document.getElementById('preloader');
    var fill    = loader ? loader.querySelector('.preloader-fill') : null;
    if (!loader || !fill) return;

    var progress = 0;
    var interval = setInterval(function () {
      progress += Math.random() * 18 + 4;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        fill.style.width = '100%';
        setTimeout(function () {
          loader.classList.add('hidden');
          document.body.style.overflow = '';
          initHeroGSAP(); // dispara GSAP al terminar el preloader
        }, 500);
      } else {
        fill.style.width = progress + '%';
      }
    }, 80);

    document.body.style.overflow = 'hidden';
  })();

  /* ══════════════════════════════════════════════════════
     2. RELOJ MEDELLÍN (UTC-5)
  ══════════════════════════════════════════════════════ */
  (function initClock() {
    var el = document.getElementById('clock');
    if (!el) return;

    function updateClock() {
      var now  = new Date();
      var utc  = now.getTime() + now.getTimezoneOffset() * 60000;
      var mde  = new Date(utc + (-5 * 3600000)); // UTC-5 Colombia
      var h    = String(mde.getHours()).padStart(2, '0');
      var m    = String(mde.getMinutes()).padStart(2, '0');
      var s    = String(mde.getSeconds()).padStart(2, '0');
      el.textContent = h + ':' + m + ':' + s;
    }
    updateClock();
    setInterval(updateClock, 1000);
  })();

  /* ══════════════════════════════════════════════════════
     3. HEADER — scroll shrink + burger mobile
  ══════════════════════════════════════════════════════ */
  (function initHeader() {
    var header    = document.getElementById('header');
    var burger    = document.getElementById('burger');
    var mobileNav = document.getElementById('mobileNav');
    if (!header) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });

    if (burger && mobileNav) {
      burger.addEventListener('click', function () {
        var isOpen = mobileNav.classList.toggle('open');
        burger.classList.toggle('open', isOpen);
      });
      // Cerrar al hacer click en un link mobile
      mobileNav.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          mobileNav.classList.remove('open');
          burger.classList.remove('open');
        });
      });
    }
  })();

  /* ══════════════════════════════════════════════════════
     4. NEURAL CANVAS BACKGROUND
        Nodos conectados por líneas — efecto red neuronal
  ══════════════════════════════════════════════════════ */
  (function initNeuralCanvas() {
    var canvas = document.getElementById('neuralCanvas');
    if (!canvas) return;
    var ctx   = canvas.getContext('2d');
    var nodes = [];
    var NODE_COUNT   = 55;
    var MAX_DIST     = 160;
    var NODE_SPEED   = 0.35;
    var mouse        = { x: -9999, y: -9999 };
    var raf;

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createNodes() {
      nodes = [];
      for (var i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x:  Math.random() * canvas.width,
          y:  Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * NODE_SPEED,
          vy: (Math.random() - 0.5) * NODE_SPEED,
          r:  Math.random() * 1.5 + 0.8
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Mover nodos
      nodes.forEach(function (n) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      });

      // Dibujar líneas entre nodos cercanos
      for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
          var dx   = nodes[i].x - nodes[j].x;
          var dy   = nodes[i].y - nodes[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            var alpha = (1 - dist / MAX_DIST) * 0.18;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = 'rgba(0, 180, 216, ' + alpha + ')';
            ctx.lineWidth   = 0.7;
            ctx.stroke();
          }
        }
        // Línea desde nodo al mouse si está cerca
        var mdx  = nodes[i].x - mouse.x;
        var mdy  = nodes[i].y - mouse.y;
        var mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < MAX_DIST * 1.5) {
          var mAlpha = (1 - mDist / (MAX_DIST * 1.5)) * 0.5;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = 'rgba(144, 224, 239, ' + mAlpha + ')';
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      }

      // Dibujar nodos
      nodes.forEach(function (n) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 180, 216, 0.55)';
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    }

    window.addEventListener('mousemove', function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });

    window.addEventListener('resize', function () {
      resize();
      createNodes();
    });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        raf = requestAnimationFrame(draw);
      }
    });

    resize();
    createNodes();
    raf = requestAnimationFrame(draw);
  })();

  /* ══════════════════════════════════════════════════════
     5. SCROLL-TRIGGERED VIDEO
        Controla currentTime del video según el scroll
        total de la página. Cuando esté el .mp4 real,
        quita el comentario del <video> en el HTML.
  ══════════════════════════════════════════════════════ */
  (function initScrollVideo() {
    var video = document.getElementById('bg-video');
    if (!video) return; // Si no hay video, no hace nada

    video.pause();
    video.setAttribute('preload', 'auto');

    var target  = 0;
    var current = 0;
    var raf;

    function lerp(a, b, t) { return a + (b - a) * t; }

    function tick() {
      current = lerp(current, target, 0.07);
      if (Math.abs(current - video.currentTime) > 0.005) {
        video.currentTime = current;
      }
      raf = requestAnimationFrame(tick);
    }

    function onScroll() {
      var maxScroll = document.body.scrollHeight - window.innerHeight;
      var progress  = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      if (video.duration) {
        target = Math.min(progress * video.duration, video.duration);
      }
    }

    video.addEventListener('loadedmetadata', function () {
      onScroll();
      raf = requestAnimationFrame(tick);
    });

    if (video.readyState >= 1) {
      onScroll();
      raf = requestAnimationFrame(tick);
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        raf = requestAnimationFrame(tick);
      }
    });
  })();

  /* ══════════════════════════════════════════════════════
     6. SWIPER — MÓDULOS
  ══════════════════════════════════════════════════════ */
  (function initSwiperModulos() {
    if (typeof Swiper === 'undefined') return;
    new Swiper('.swiper-modulos', {
      slidesPerView: 1.2,
      spaceBetween: 20,
      loop: true,
      grabCursor: true,
      pagination: {
        el: '.swiper-modulos-pag',
        clickable: true,
        dynamicBullets: true
      },
      navigation: {
        prevEl: '.mod-prev',
        nextEl: '.mod-next'
      },
      breakpoints: {
        640:  { slidesPerView: 2,   spaceBetween: 24 },
        1024: { slidesPerView: 3,   spaceBetween: 28 },
        1280: { slidesPerView: 3.5, spaceBetween: 32 }
      }
    });
  })();

  /* ══════════════════════════════════════════════════════
     7. SWIPER — TESTIMONIOS
  ══════════════════════════════════════════════════════ */
  (function initSwiperTestimonios() {
    if (typeof Swiper === 'undefined') return;
    new Swiper('.swiper-tes', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      grabCursor: true,
      centeredSlides: true,
      pagination: {
        el: '.swiper-tes-pag',
        clickable: true,
        dynamicBullets: true
      },
      breakpoints: {
        768:  { slidesPerView: 1.8, spaceBetween: 24, centeredSlides: true },
        1024: { slidesPerView: 2.5, spaceBetween: 28, centeredSlides: true }
      }
    });
  })();

  /* ══════════════════════════════════════════════════════
     8. SCROLL REVEAL — IntersectionObserver
  ══════════════════════════════════════════════════════ */
  (function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    items.forEach(function (el, i) {
      // Stagger sutil entre elementos hermanos consecutivos
      el.style.transitionDelay = (i % 4) * 0.08 + 's';
      observer.observe(el);
    });
  })();

  /* ══════════════════════════════════════════════════════
     9. CONTADORES ANIMADOS (count-up al entrar en viewport)
  ══════════════════════════════════════════════════════ */
  (function initCounters() {
    var counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el     = entry.target;
        var target = parseInt(el.getAttribute('data-target'), 10);
        var start  = 0;
        var dur    = 1800; // ms
        var step   = Math.ceil(target / (dur / 30));
        var timer  = setInterval(function () {
          start += step;
          if (start >= target) {
            el.textContent = target;
            clearInterval(timer);
          } else {
            el.textContent = start;
          }
        }, 30);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { observer.observe(el); });
  })();

  /* ══════════════════════════════════════════════════════
     10. FAQ ACCORDION
  ══════════════════════════════════════════════════════ */
  (function initFAQ() {
    var items = document.querySelectorAll('.faq-item');
    items.forEach(function (item) {
      var btn = item.querySelector('.faq-q');
      if (!btn) return;
      btn.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');
        // Cerrar todos
        items.forEach(function (i) { i.classList.remove('open'); });
        // Abrir el clickeado (si no estaba abierto)
        if (!isOpen) item.classList.add('open');
      });
    });
  })();

  /* ══════════════════════════════════════════════════════
     11. GSAP HERO ANIMATIONS
         Se llama desde initPreloader() al terminar la carga
  ══════════════════════════════════════════════════════ */
  function initHeroGSAP() {
    if (typeof gsap === 'undefined') {
      // Fallback sin GSAP: simplemente mostrar el hero
      var heroEls = document.querySelectorAll('.hero .reveal');
      heroEls.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Stagger de entrada para los elementos del hero
    gsap.from('.hero-badge', {
      opacity: 0, y: 24, duration: 0.7, ease: 'power2.out', delay: 0.1
    });
    gsap.from('.hero-title', {
      opacity: 0, y: 48, duration: 0.9, ease: 'power3.out', delay: 0.25,
      onComplete: function () {
        document.querySelector('.hero-title') &&
          document.querySelector('.hero-title').classList.add('visible');
      }
    });
    gsap.from('.hero-sub', { opacity: 0, y: 30, duration: 0.7, ease: 'power2.out', delay: 0.45 });
    gsap.from('.hero-desc', { opacity: 0, y: 24, duration: 0.7, ease: 'power2.out', delay: 0.55 });
    gsap.from('.hero-actions', { opacity: 0, y: 20, duration: 0.7, ease: 'power2.out', delay: 0.68 });
    gsap.from('.hero-price-hint', { opacity: 0, y: 16, duration: 0.6, ease: 'power2.out', delay: 0.8 });
    gsap.from('.hero-scroll-indicator', { opacity: 0, y: 10, duration: 0.6, ease: 'power2.out', delay: 1.1 });

    // Parallax sutil en el header del hero al scrollear
    gsap.to('.hero-content', {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  /* ══════════════════════════════════════════════════════
     12. FORMULARIO — Prevenir submit por defecto
         Conectar con Formspree, emailjs, etc.
  ══════════════════════════════════════════════════════ */
  (function initForm() {
    var form = document.getElementById('ctaForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      // TODO: Conectar con backend o Formspree
      // Ejemplo Formspree: form.action = "https://formspree.io/f/TU_ID"
      var btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.textContent = '✓ Recibido — te contactamos pronto';
        btn.style.background = 'linear-gradient(135deg, #00695c, #00b4d8)';
        btn.disabled = true;
      }
    });
  })();

  /* ══════════════════════════════════════════════════════
     13. ACTIVE NAV LINK según sección visible
  ══════════════════════════════════════════════════════ */
  (function initActiveNav() {
    var sections = document.querySelectorAll('section[id], div[id]');
    var navLinks = document.querySelectorAll('.nav-link');
    if (!navLinks.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (link) {
            link.style.color = '';
            if (link.getAttribute('href') === '#' + entry.target.id) {
              link.style.color = 'var(--teal)';
            }
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(function (s) { observer.observe(s); });
  })();

}); // DOMContentLoaded
