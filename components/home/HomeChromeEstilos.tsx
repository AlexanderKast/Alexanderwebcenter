/**
 * Fuentes y variables del chrome del sitio (--gold, --muted, --font-bebas…).
 *
 * Vivian dentro del layout publico, asi que cualquier ruta fuera de ese
 * grupo (como /brief) heredaba texto negro sobre fondo negro: el menu
 * quedaba invisible. Ahora es un componente y lo usan los dos layouts.
 */
export function HomeChromeEstilos() {
  return (
    <>
      <style>{`
        /* En capa base: si va sin capa le gana a las utilidades de
           Tailwind (que viven en @layer utilities) y borra todos los
           padding y margin de las paginas. */
        @layer base {
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          html {
            scroll-behavior: smooth;
            /*
             * Varias secciones entran con translateX positivo (24-40px) y,
             * mientras siguen bajo el fold, ese desplazamiento ensancha el
             * documento: en movil se podia scrollear ~12px de costado.
             * Se usa clip y no hidden a proposito: hidden convertiria al
             * elemento en contenedor de scroll y romperia los position: sticky.
             */
            overflow-x: clip;
          }
          body {
            background: #000;
            color: #fff;
            font-family: var(--font-sans), system-ui, sans-serif;
            -webkit-font-smoothing: antialiased;
            /*
             * Las animaciones de entrada arrancan con translateX, y mientras
             * la seccion sigue bajo el fold ese desplazamiento ensancha el
             * documento: en movil aparecia scroll horizontal.
             * Se usa clip y no hidden a proposito: hidden convierte al body en
             * contenedor de scroll y rompe los position: sticky de adentro.
             */
            overflow-x: clip;
          }
          /*
           * Alias sobre los tokens de globals.css. Antes este bloque redefinia
           * --gold con OTRO valor (#C9A84C contra #c9a227) y declaraba sus
           * propias familias: dos fuentes de verdad con los mismos nombres.
           * Ahora todo apunta al mismo lado y aca solo viven los alias que
           * usan los componentes del chrome.
           */
          :root {
            --gold-dim:  color-mix(in srgb, var(--gold-mid) 15%, transparent);
            --gold-dim2: color-mix(in srgb, var(--gold-mid) 8%, transparent);
            --surface:  var(--surface-1);
            --surface2: var(--surface-2);
            /* Subidos desde 0.55/0.35: sobre el video de fondo esos valores
               no llegaban a contraste AA y el texto secundario no se leia. */
            --font-dm: var(--font-sans);
          }
          a { text-decoration: none; color: inherit; }
          img, video { display: block; max-width: 100%; }
          ::selection { background: var(--gold); color: #000; }
          ::-webkit-scrollbar { width: 4px; }
          ::-webkit-scrollbar-track { background: #000; }
          ::-webkit-scrollbar-thumb { background: var(--gold-dim); }
          body::after {
            content: '';
            position: fixed;
            inset: 0;
            z-index: 9990;
            pointer-events: none;
            opacity: 0.038;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E");
            background-repeat: repeat;
            background-size: 200px 200px;
          }

          /* El reset de arriba borra el outline por defecto y no habia nada
             que lo reemplazara: navegar con teclado era a ciegas. */
          :focus-visible {
            outline: 2px solid var(--gold);
            outline-offset: 3px;
            border-radius: 2px;
          }

          /* Area tactil minima en movil: varios enlaces del chrome quedaban
             por debajo de 44px y eran dificiles de acertar. */
          @media (pointer: coarse) {
            nav a, header a, footer a, button {
              min-height: 44px;
              display: inline-flex;
              align-items: center;
            }
          }
        }

        /*
         * Tokens de texto del chrome. Van SIN capa a proposito.
         *
         * Antes se llamaban --muted / --muted2 y vivian dentro de @layer base,
         * pero globals.css declara su propio --muted: #101010 (una superficie
         * de shadcn) sin capa. El CSS sin capa le gana al CSS en capa, asi que
         * --muted resolvia a #101010: texto casi negro sobre fondo negro. Ese
         * era el motivo real de que el nav y las descripciones no se vieran.
         * Con nombres propios ya no hay colision posible.
         */
        :root {
          --texto-suave: rgba(255,255,255,0.74);
          --texto-tenue: rgba(255,255,255,0.56);
        }

        /* No existia ningun respeto por reduced-motion en el sitio publico. */
        @media (prefers-reduced-motion: reduce) {
          html { scroll-behavior: auto; }
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </>
  );
}
