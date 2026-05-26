# Pilar 2 — IA aplicada / Kreoon

**Fecha de validación:** 2026-05-05
**Total referentes Tier 1:** 12 (6 LATAM + 6 globales)
**Criterio mínimo:** ≥200K seguidores en plataforma principal + viralidad recurrente.
**Nota:** 4 de 12 viven en X/Twitter — análisis manual vía WebFetch (Apify X no es fiable).

---

## Tier 1 — LATAM / Español (6)

| # | Handle | Nombre | Followers (plat. principal) | Plataforma principal | Tema | Notas |
|---|---|---|---|---|---|---|
| 1 | @dotcsv | Carlos Santana Vega | YouTube ~1M / TikTok 425K / IG 104K | YouTube + TikTok | Divulgación IA en español, LLMs, generativa | Referente #1 IA en español. TikTok regularmente +500K-1M views. |
| 2 | @aldouscaldous | Aldo Bartra (El Robot de Platón) | YouTube ~3M / IG 378K | YouTube | Ciencia + IA divulgativa LATAM | +3M subs, videos millones de views. Forbes Top Creators LATAM 2024. |
| 3 | @mastermunozoficial | Carlos Master Muñoz | IG 1M | IG + YouTube | IA aplicada a negocios MX | Reels +500K. Mismo nombre que Pilar 1 (perfil mixto). |
| 4 | @comousarapps | Cómousarapps | IG 183K | IG | Tutoriales herramientas IA, monetización | 183K (debajo 200K, pero ángulo Kreoon perfecto). Tier 1 borderline. |
| 5 | @artificialmente.ia | Iván | IG 256K | IG | IA + tech práctica para emprendedores LATAM | Carrusel + reels. Cumple 200K. |
| 6 | @bruno.ia1 | Bruno Pereira | IG 201K | IG | IA aplicada a contenido (Brasil-LATAM, PT/ES) | Cumple 200K. |

## Tier 1 — Global (6)

| # | Handle | Nombre | Followers (plat. principal) | Plataforma | Tema | Notas |
|---|---|---|---|---|---|---|
| 7 | @gregisenberg | Greg Isenberg | X 630K / IG 122K | X/Twitter | Startup ideas IA, productos, comunidades | Vive en X. Análisis manual. |
| 8 | @rileybrown.ai | Riley Brown | TikTok 624K / cross 1.5M | TikTok + IG | Vibe coding, AI content creator | Primer TikTok ChatGPT 20M views. Recurrente +1M. Ángulo Kreoon directo. |
| 9 | @levelsio | Pieter Levels | X 862K | X/Twitter | Indie hacking + IA, micro-SaaS | Vive en X. Análisis manual. Posts 500K-2M+ impresiones. |
| 10 | @alliekmiller | Allie K. Miller | LinkedIn ~2M / X cross 2M | LinkedIn | IA business, frameworks aplicados | "#1 most-followed voice in AI business". Scrapeable LinkedIn. |
| 11 | @mreflow | Matt Wolfe (FutureTools) | YouTube ~700K-1M / Newsletter 230K | YouTube | Reviews/tutoriales herramientas IA | Videos +500K recurrentes. Ángulo Kreoon directo. |
| 12 | @LinusEkenstam | Linus Ekenstam | X 219K / Threads 132K | X/Twitter | AI evangelist, prompts, tools | Cumple 200K X. Análisis manual. |

## Reservas / Sustitutos

- **Nick Saraev** (@nicksaraev YouTube ~313-400K) — Si "IA aplicada con N8N/agentes" es el ángulo central, sustituir Linus Ekenstam. Encaja literal Kreoon-style.
- **Wes Roth** (YouTube ~305K) — Backup para cubrir noticias/herramientas IA.

## Descartados (con razón)

- **Domingo Espinosa, brainmasterco (50K), prompteafacil, IA Latam, Skooltify** — sin entidad verificable o <200K en pilar/plataforma principal.
- **Logan Kilpatrick** — 297K X pero ángulo DevRel/PM en Google, no creator IA aplicada.
- **Christian Heidorn (7K X), Cody Schneider (59K X), Bilawal Sidhu (75K IG)** — debajo del piso.
- **Andrew Ng** — 1.5M X pero ángulo académico/educacional, no aplicado-emprendedor.
- **Mario Nawfal, Codie Sanchez, AI Explained, Mr Beast Lab** — pilar incorrecto.

## Notas operativas

- **Plataformas X (4 referentes):** Greg Isenberg, Pieter Levels, Allie K. Miller, Linus Ekenstam — Apify X no fiable. Hacer análisis manual con WebFetch sobre 5-10 tweets públicos virales por referente.
- **Cómousarapps:** 183K (borderline). Si exigimos 200K estricto, sustituir por Nick Saraev YouTube (Tier 1 firme).
- **Allie K. Miller:** LinkedIn es plataforma principal — scrapear con `apify/linkedin-post-scraper`.
- **Matt Wolfe + DotCSV + Aldo Bartra:** scrapear con `apify/youtube-scraper`.
- **Riley Brown:** scrapear con `clockworks/tiktok-scraper`.
