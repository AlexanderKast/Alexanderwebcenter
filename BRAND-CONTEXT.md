# BRAND CONTEXT — Alexander Cast / alexandercast.com

> Documento maestro de contexto para modelos de IA. Consolida identidad de marca, línea gráfica, voz, audiencia y arquitectura técnica del portal. Fuentes: `content/marca/brand.ts`, `app/globals.css`, `content/site.ts`, `core/*.md`, `README.md`.
> Última actualización: 2026-07-11

---

## 1. Identidad de marca

| Campo | Valor |
|---|---|
| Nombre | Alexander Cast (Johan Alexander Castaño Céspedes) |
| Tagline | **Dios. Estrategia. IA.** |
| Handle | **@alexemprendee** (Instagram, TikTok, YouTube, X) — nunca @alexandercast |
| Rol | Estratega Digital y de IA |
| Ubicación | Medellín, Colombia |
| Idioma | Español latino (es-CO) |
| URL | https://alexandercast.com |
| Arquetipos | El Explorador + El Sabio |
| Email principal | founder@kreoon.com · comercial@infinygroup.com |

**Personalidad de marca:**
- Directo sin agresión
- Reflexivo sin filosofía vacía
- Cercano sin informalidad descuidada
- Autoridad por transparencia, no por pretensión
- Fe integrada, no predicada

**Promesa de marca:**
> "Te ayudo a pensar claro, construir con estrategia y usar IA con propósito. Sin fórmulas mágicas, sin humo. Con Dios al centro."

**Descripción del sitio:**
> "Estratega digital, de contenido e IA. Ayudo a emprendedores tradicionales a dar el salto al digital y a quienes están creando su marca personal, producto o negocio desde cero."

**Ventures activos:** Consultor IA + Marketing Digital · UGC Colombia (agencia UGC, con su esposa) · LiveCake (live shopping) · KREOON (SaaS IA para contenido, co-founder) · Sanavi Natural · Los Reyes del Contenido (comunidad) · Grupo Effi (estratega).

**Posicionamiento único:** IA aplicada a negocios reales + Live Shopping Expert LATAM + fe y valores (sin predicar) + experiencia ecommerce verificable + productos SaaS funcionando. Mensaje central: "Cualquier persona puede ganar de $3,000 a $5,000 por mes vendiendo productos físicos por internet usando IA y live shopping."

---

## 2. Línea gráfica

### 2.1 Concepto visual

**Dark luxury**: negro profundo + dorado metalizado. Fondo casi negro con degradados radiales dorados sutiles. Elegancia sobria, sin saturación de color. Un solo acento (dorado) sobre escala de negros y grises cálidos.

### 2.2 Paleta de colores

| Nombre | Hex | Rol |
|---|---|---|
| Negro profundo | `#030303` | Fondo principal (`--background`, `--brand`) |
| Negro absoluto | `#000000` | Surface 0, sidebar |
| Superficie 1 | `#080808` | Cards y paneles |
| Superficie card | `#0c0c0c` | `--card`, `--popover` |
| Superficie 2 | `#101010` | Hover, secondary, muted |
| Superficie 3 | `#181818` | Accent |
| Línea | `#1f1f1f` | Bordes, divisores, inputs (`--border`) |
| Línea fuerte | `#2a2a2a` | Bordes destacados |
| Dorado oscuro | `#6b4f0e` | Sombras y base metálica |
| Dorado base | `#c9a227` | Acentos principales (`--gold`) |
| Dorado medio | `#d4af37` | **Primary**, ring, highlights, links |
| Dorado claro | `#f4e4a6` | Brillos metálicos |
| Dorado hi | `#fff3c4` | Reflejo superior del degradado metálico |
| Texto principal | `#f5f3ee` | Blanco cálido luxury (`--foreground`) |
| Texto secundario | `#8a8680` | Muted, metadata |

**Reglas:**
- `--primary: #d4af37` con texto oscuro `#030303` encima (botones dorados llevan texto negro).
- `::selection` dorado con texto negro.
- Destructive: `oklch(0.7 0.2 20)` (rojo suave, único color fuera de la paleta).
- Fondo del body: dos degradados radiales dorados translúcidos (`rgba(212,175,55,0.08)` arriba centro, `0.04` abajo derecha) sobre `#030303`, `background-attachment: fixed`.

### 2.3 Degradado dorado metalizado (firma visual)

```css
linear-gradient(110deg, #8a6e18 0%, #d4af37 40%, #fff3c4 50%, #d4af37 60%, #8a6e18 100%)
```

Usado en `.text-gold-metallic` (texto con clip), `.text-gold-shimmer` (animado 8s ease-in-out infinite) y `.btn-gold-metallic` (botón pill dorado, min-width 160px, padding 14px 1.75em, border-radius 9999px).

### 2.4 Tipografía

| Rol | Familia | Pesos | Uso |
|---|---|---|---|
| Display | **Playfair Display** | 400–900 | Headlines, H1–H3, números destacados |
| Body | **Inter** | 400–700 | Párrafos, UI, forms, microcopy |
| Mono | Geist Mono | — | Código |

**Escala tipográfica:**

| Clase | Tamaño | Peso | Notas |
|---|---|---|---|
| `.h-hero` | `clamp(52px, 7.5vw, 96px)` | 700 | line-height 1.02, letter-spacing -0.02em |
| `.h-section` | `clamp(28px, 4vw, 48px)` | 700 | letter-spacing -0.01em |
| `.h-sub` | `clamp(22px, 2.6vw, 32px)` | 400 | |
| `.h-profession` | `clamp(18px, 2vw, 26px)` | 400 | color dorado medio |
| `.eyebrow` | 11px uppercase | 600 | letter-spacing 0.26em, dorado medio |

Headings: `font-display tracking-tight`. Body: antialiased, `font-feature-settings: "cv02", "cv11"`.

### 2.5 Radios y layout

- `--radius: 0.75rem` base; escala sm (×0.6) → 4xl (×2.6); pill = 50px / 9999px en botones.
- Contenedores: `.container-narrow` (max-w-6xl) y `.container-wide` (max-w-7xl), padding responsivo px-4/6/8.

### 2.6 Logos

| Archivo | Uso |
|---|---|
| `/logos/ac-gold-mark.png` | Monograma AC dorado — favicon, header, avatar |
| `/logos/ac-gold.png` | Logo completo (wordmark) — piezas grandes |
| `/logos/ak-original.png` | Original sin recortar — backup / impresión |

---

## 3. Voz y tono

**Esencia:** Emprendedor paisa tranquilo, reflexivo y estratégico. Comunicación clara, amigable pero profesional. Calma que refleja sabiduría, calidez de Medellín sin vulgaridad.

- **Persona:** 1ª persona singular. Conversacional, no corporativo. Tuteo. Modismos colombianos mínimos y elegantes.
- **Cadencia:** ritmo pausado, claridad > velocidad, sin exaltaciones ni drama.
- **Cualidades:** honesto, directo, reflexivo, humor sobrio, sin palabras hinchadas.

**Expresiones permitidas:** "¿Qué más pues?", "Quiubo", "Hagámosle pues", "A la final", "Muy bacano", "Parce, te cuento que...", "Mira, te explico...", "La cosa es así...".

**Cierre de video obligatorio:** "Nos vemos." + gesto de todo bien (pulgar arriba / OK). ❌ "Dale pues" NO es de Alexander.

**Prohibido:** "gonorrea", "sisas", "parche", "todo bien o qué" · jerga corporativa (sinergia, paradigma) · gurismo ("secretos", "te vas a volver rico") · predicación agresiva · exceso de anglicismos · victimismo · claims numéricos sin prueba.

**Hooks modelo:**
- "Me enseñaron que [X] e [Y] eran mundos separados. Estaban equivocados."
- "La mayoría de [grupo] hace [A]. Aquí está por qué está mal."
- "Llevo 3 meses construyendo esto y aquí está lo que nadie te cuenta."
- "Uso IA para [X] y te muestro exactamente cómo — sin filtros."

**Fe:** integrada, nunca impuesta. "Mi fe me guía. Tal vez tú tienes otra brújula." Compartir, no predicar.

---

## 4. Audiencia

| Perfil | Edad | Región | Dolor principal | Deseo principal |
|---|---|---|---|---|
| **Primaria:** Emprendedor tradicional migrando al digital | 25–45 | LATAM + España | "Mi negocio funciona offline pero online no existe" | Presencia digital que traiga clientes, IA como palanca |
| **Secundaria:** Fundador de marca/producto en lanzamiento | 25–40 | LATAM | "Tengo el producto pero no la marca" | Autoridad desde cero, sistema de contenido |
| **Terciaria:** Creador/consultor freelance | 22–35 | LATAM + España | "No sé productizar lo que hago" | Escalar sin más horas, workflows IA con voz propia |
| **Afinidad:** Profesional cristiano en negocios/tech | — | — | Busca referentes que integren fe con estrategia real sin lenguaje de iglesia | — |

---

## 5. Pilares de contenido

1. **Mentalidad + Fe (25–30%)** — propósito, resiliencia, fe aplicada sin predicar, balance familia-emprendimiento.
2. **IA aplicada a negocios** — implementaciones reales, workflows, KREOON (regla 80% educación / 20% producto).
3. **Live Shopping** — vertical estratégica 2026, LiveCake, ecommerce.
4. **Creación de contenido / UGC** — UGC Colombia, producción, estrategia.

---

## 6. Arquitectura técnica

### 6.1 Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Estilos | Tailwind CSS v4 + shadcn/ui + tw-animate-css |
| DB / Auth / Storage | Supabase (PostgreSQL + RLS) |
| Email | Resend (newsletter + transaccional) |
| Rate limiting | Upstash Redis |
| IA | Claude (Anthropic) + Gemini + Groq + WaveSpeed |
| Calendario | Cal.com embed |
| Analytics | Vercel Analytics + Speed Insights |
| Deploy | Vercel |
| Repo | github.com/AlexanderKast/Alexanderwebcenter (branch `master`) |

### 6.2 Módulos

- **Portal público (`/`)** — Hero, About, Pilares, Servicios, Testimonios, Galería, Blog MDX, Consultoría (Cal.com), Lead magnets, Newsletter, Contacto.
- **Admin panel (`/admin`)** — Supabase Auth. Dashboard con métricas, Leads Kanban, Suscriptores, Consultorías, Mensajes, Manual de marca (`/admin/marca`), Estrategia, Guiones, Tareas, Content Forge.
- **Módulo Clientes (`/clientes`)** — onboarding de marca personal: formulario multi-paso de 9 secciones (~30 min), auto-guardado, sugerencias IA con Groq, guardado en Google Drive.
- **Content Forge (`scripts/content-forge/`)** — motor de generación: carruseles IG, guiones Reels/TikTok, calendarios, imágenes con WaveSpeed + Gemini, análisis de virales con Apify.

### 6.3 Rutas públicas

`/` · `/blog` · `/consultoria` · `/contacto` · `/descargas` · `/gracias` · `/legal` · `/newsletter` · `/podcast` · `/recursos` · `/servicios` · `/sobre-mi`

### 6.4 Secciones del home (`components/sections/`)

hero · social-proof-bar · pain-solution · value-props · about · pilares · servicios · skills · stats · ecosistema · testimonios · galeria · ig-feed · clients-strip · lead-magnets · newsletter-cta · faqs-section · consultoria-embed (Cal.com) · contact-home · final-cta · footer

### 6.5 Estructura de carpetas

```
├── app/                     # Next.js App Router
│   ├── (public)/            # Rutas públicas
│   ├── admin/               # Panel admin (auth)
│   ├── clientes/            # Onboarding de marca
│   ├── api/                 # API routes
│   └── globals.css          # Design tokens (fuente de verdad visual)
├── components/
│   ├── sections/            # Secciones del site
│   ├── admin/               # Header, Sidebar admin
│   ├── clientes/            # Formulario onboarding
│   └── ui/                  # shadcn/ui primitives
├── content/                 # Datos del sitio
│   ├── site.ts              # Constantes globales (URLs, social, contacto)
│   ├── marca/               # Manual de marca (brand.ts, audiencia.ts, pilares-plan.ts, plataformas.ts, monetizacion.ts)
│   ├── pilares.ts · servicios.ts · faqs.ts · lead-magnets.ts · empresas.ts
│   └── blog/                # Posts MDX
├── lib/                     # Utilidades
├── supabase/                # Migraciones SQL + RLS
├── scripts/content-forge/   # Motor generación contenido IA
├── agents/ · core/ · skills/ · knowledge/  # Sistema de contenido Alexander Cast
├── news/                    # Briefs semanales de noticias
└── davies/                  # Template HTML original (solo referencia visual)
```

### 6.6 Archivos fuente de verdad

| Tema | Archivo |
|---|---|
| Tokens visuales (CSS) | `app/globals.css` |
| Manual de marca estructurado | `content/marca/brand.ts` |
| Constantes del sitio | `content/site.ts` |
| Identidad / voz para contenido | `core/identity.md`, `core/voice-dna.md`, `core/positioning.md` |
| Arquitectura Content Forge | `scripts/content-forge/docs/architecture.md` |

---

## 7. Redes y contacto

| Red | Handle / URL |
|---|---|
| Instagram | @alexemprendee — instagram.com/alexemprendee |
| TikTok | @alexemprendee |
| YouTube | @alexemprendee |
| LinkedIn | linkedin.com/in/alexandercast |
| X | @alexemprendee |
| GitHub | AlexanderKast |
| Email | founder@kreoon.com (principal, prensa, consultoría) · comercial@infinygroup.com (comercial) |
