# Lista Consolidada de 50 Referentes — Alexander Cast

**Fecha:** 2026-05-05
**Total Tier 1 firmes:** 46 (algunos slots Pilar 4 quedan Tier 2)
**Mix:** ~70% LATAM/Español + 30% Global

Para detalles por pilar, ver:
- [Pilar 1 — Mentalidad / Fe + Negocios](pilar-1-mentalidad-fe/_summary.md)
- [Pilar 2 — IA aplicada / Kreoon](pilar-2-ia-aplicada/_summary.md)
- [Pilar 3 — Live Shopping](pilar-3-live-shopping/_summary.md)
- [Pilar 4 — Contenido / Creator Economy](pilar-4-contenido/_summary.md)

---

## Resumen por pilar

| Pilar | Tier 1 firmes | Tier 2 / pendientes | Plataforma dominante | Plataforma scrapeable |
|---|---|---|---|---|
| 1 — Mentalidad/Fe | 12 | — | IG + YouTube | ✅ Apify (IG/YT) |
| 2 — IA aplicada | 8 | 4 en X/Twitter (manual) | YouTube + TikTok + IG + X | ✅ 8 Apify, 4 manual WebFetch |
| 3 — Live Shopping | 12 | 1 borderline (Meif Espinosa) | TikTok | ✅ Apify (TikTok) |
| 4 — Contenido | 10 firmes | 2 slots LATAM Tier 2 | IG + YouTube + LinkedIn | ✅ Apify (IG/YT/LinkedIn) |
| **Total** | **42 scrapeables** | **8 manuales/Tier 2** | — | **42 ítems × 5 = 210 posts max Apify** |

---

## Hallazgos críticos

1. **Los handles del `.env` actual NO encajan en Pilar 3.** juandaeffi, davidguerrero.pro, davidrojas.drp, converzzo son educators/mentores/podcasters, no live sellers. Considerar refactorizar `.env` con los handles validados de live commerce real (Camila Pudim, Mikayla Nogueira, etc).

2. **Pilar 2 tiene 4 referentes en X/Twitter** (Greg Isenberg, Pieter Levels, Allie K. Miller, Linus Ekenstam). Apify no scraperea X de forma fiable. **Plan:** análisis manual con WebFetch de 5 tweets virales públicos por referente (FASE 4, no FASE 3).

3. **Carlos Master Muñoz aparece en Pilares 1, 2 y 4.** Perfil legítimamente cross-pilar. Al analizar sus posts, segmentar según tema: mentalidad/emprendimiento → P1, IA aplicada a negocios → P2, marca personal/monetización → P4.

4. **Live Shopping LATAM puro es nicho emergente** (TikTok Shop MX feb 2025, BR oct 2025). Por eso varios referentes son creators con followers masivos que adoptaron live commerce hace <12 meses, no live-sellers de carrera como en USA.

5. **Pilar 4 tiene 10 sólidos.** Slots 11-12 LATAM Tier 2 (Maïder Tomasena 113K, Jay Clouse 138K — referentes cualitativos del pilar pero <200K). Para llegar a 12, validar manualmente Euge Oller (@primerempleo) y Roberto Rocha (@robertorochamx) en FASE 3 antes de scrapear.

---

## Plan de scraping (FASE 3)

**Total presupuestado:** 50 referentes × 5 posts top = 250 items max (free tier Apify).
**Reales scrapeables:** 42 referentes Apify + 8 manuales = 250 items / 42 ≈ 6 posts c/u si hay margen, o 5 posts × 42 = 210 items + 8 referentes manuales × 5 tweets = ~250 ítems totales.

**Distribución por actor Apify:**

| Actor | Referentes | Items estimados |
|---|---|---|
| `apify/instagram-scraper` | ~22 | ~110 |
| `clockworks/tiktok-scraper` | ~12 | ~60 |
| `apify/youtube-scraper` | ~6 | ~30 |
| `apify/linkedin-post-scraper` | ~2 | ~10 |
| **Manual (X/WebFetch)** | 4 | 20 |
| **Total** | **46** | **~230** |
