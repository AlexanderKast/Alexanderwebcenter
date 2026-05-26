# Curso IA Aplicada — Landing Page

Landing page premium para el curso **"IA Aplicada"** de Alexander Cast. Diseño dark mode, 100% custom HTML/CSS/JS sin frameworks CSS.

---

## Archivos creados

| Archivo | Descripción |
|---|---|
| `index.html` | Estructura completa (16 secciones) |
| `css/style.css` | Estilos custom (~700 líneas) |
| `js/main.js` | Lógica interactiva (~310 líneas) |
| `assets/video/hero-bg.mp4` | ⚠️ Pendiente — colocar aquí el video real |

---

## Secciones implementadas (en orden)

| # | Sección | ID / Anchor | Estado |
|---|---|---|---|
| 1 | Preloader | — | ✅ Animado |
| 2 | Header fijo | `header` | ✅ Glassmorphism + reloj MDE |
| 3 | Hero | `#inicio` | ✅ Canvas neural + aurora CSS |
| 4 | Benefits Ticker | — | ✅ Scroll infinito |
| 5 | El Curso | `#el-curso` | ✅ Grid 3 columnas |
| 6 | Módulos | `#modulos` | ✅ Swiper 8 slides |
| 7 | Instructores | `#instructores` | ✅ 3 cards con avatares iniciales |
| 8 | Tech Stack | — | ✅ Logos en scroll infinito |
| 9 | Estadísticas | — | ✅ 4 contadores animados |
| 10 | Testimonios | — | ✅ Swiper loop centrado |
| 11 | Inversión / Pricing | `#inversion` | ✅ 2 planes (cuotas + completo) |
| 12 | FOMO Block | — | ✅ Urgencia + spots restantes |
| 13 | FAQ | — | ✅ Acordeón 5 preguntas |
| 14 | CTA / Formulario | `#cta` | ✅ Form 4 campos |
| 15 | Footer | — | ✅ Texto logo outline grande |

---

## Placeholders a reemplazar (checklist)

### Texto / Contenido

- [ ] **Hero headline** — `[TÍTULO HERO]` en `index.html`
- [ ] **Hero sub** — `[SUBTÍTULO]` y descripción en `#inicio`
- [ ] **Beneficios ticker** — los ítems de la barra animada (`Domina ChatGPT...` etc.)
- [ ] **Sección "El Curso"** — los 3 bloques de beneficios principales
- [ ] **Módulos (1–8)** — título, descripción y temas de cada módulo
- [ ] **Instructor 2 handle** — `@img2` → handle real de Diana Mile
- [ ] **Instructor 3 handle** — `@img3` → handle real de Samuel Cast
- [ ] **Tech Stack logos** — reemplazar texto por `<img>` reales de cada herramienta IA
- [ ] **Estadísticas** — los 4 números y etiquetas del bloque Stats
- [ ] **Testimonios** — nombre, cargo, foto real y texto de los 3 testimonios
- [ ] **Precios** — montos en COP de los 2 planes (cuotas y pago completo)
- [ ] **FOMO block** — número de spots restantes y fecha límite real
- [ ] **FAQ** — las 5 preguntas y respuestas

### Links / Funcional

- [ ] **WhatsApp** — reemplazar `https://wa.me/573000000000` con número real (buscar en `index.html` con Ctrl+F)
- [ ] **Formspree** — en `js/main.js` función `initForm()`, conectar al endpoint real
- [ ] **Open Graph** — `<meta property="og:image">` con URL de imagen de preview real
- [ ] **Google Analytics** — agregar `<script>` de GA4 antes de `</head>`

### Imágenes / Media

- [ ] **Fotos instructores** — en `index.html` reemplazar los `<div class="instructor-avatar">AC</div>` por `<img src="..." alt="...">`
- [ ] **Fotos testimonios** — ídem los avatares con iniciales en la sección Testimonios
- [ ] **Video hero** — copiar el `.mp4` a `assets/video/hero-bg.mp4`, luego en `index.html` descomentar el bloque `<video>` en `#hero-bg` y eliminar el `<canvas>`
- [ ] **Favicon** — `<link rel="icon">` en `<head>` apunta a `assets/favicon.ico` (crear/colocar)

---

## CDN Dependencies

| Librería | URL |
|---|---|
| Google Fonts (Space Grotesk + Inter) | `https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap` |
| SwiperJS 11 CSS | `https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css` |
| SwiperJS 11 JS | `https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js` |
| GSAP 3.12.5 | `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js` |
| GSAP ScrollTrigger | `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js` |

> ⚠️ Si planeas hacer deploy en producción con mucho tráfico, considera hostear las librerías GSAP en tu propio CDN (Bunny CDN) para evitar dependencia de terceros y mejorar el score de Lighthouse.

---

## Deploy en Vercel

### Opción A — CLI local

```bash
# Instalar Vercel CLI si no lo tienes
npm i -g vercel

# Desde la carpeta curso-ia/
cd curso-ia
vercel --prod
```

### Opción B — Sin instalar nada (npx)

```bash
cd curso-ia
npx vercel --prod
```

### Opción C — Desde la raíz del repo (apuntando a subcarpeta)

```bash
# En vercel.json de la raíz, configurar rootDirectory
vercel --prod --root curso-ia
```

> El proyecto es 100% estático — Vercel lo detecta automáticamente. No necesita `package.json` ni build step.

---

## Paleta de colores (referencia rápida)

```css
--bg:   #03040a   /* Fondo base */
--navy: #03045e   /* Navy profundo */
--blue: #0077b6   /* Azul principal */
--cyan: #00b4d8   /* Cyan interactivo */
--teal: #90e0ef   /* Teal acento */
--white: #caf0f8  /* Blanco frío */
--gold: #f4a100   /* SOLO precios y urgencia */
```

---

## Reloj MDE

El header muestra la hora actual de **Medellín (UTC-5)** en tiempo real. Se actualiza cada segundo con `setInterval`. No requiere configuración adicional.

---

## Estado actual del background del Hero

El hero usa actualmente un **canvas neural animado** (nodos flotantes + líneas de conexión + efecto mouse) combinado con blobs CSS aurora. Cuando tengas el video real:

1. Coloca el `.mp4` en `assets/video/hero-bg.mp4`
2. En `index.html` busca el comentario `<!-- VIDEO HERO: descomentar cuando tengas el mp4 -->`
3. Descomenta el bloque `<video>` y elimina el `<canvas id="neuralCanvas">`
4. En `js/main.js` la función `initScrollVideo()` ya está lista para activarse automáticamente

---

*Creado: Mayo 2026 — Alexander Cast Content System*
