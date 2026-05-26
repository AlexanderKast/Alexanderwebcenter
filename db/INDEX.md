# DB — Inteligencia de Referentes Alexander Cast

**Generado:** 2026-05-05 (actualizado 2026-05-06 con FASE 9.1-9.8: gaps cerrados + sub-batches Apify)
**Total referentes mapeados:** 50 (43 Tier 1 firmes + 7 Tier 2/manuales) → 47 con archivos individuales en DB
**Posts con data Apify real:** **16 referentes** × ~5 top virales = ~80 items reales con métricas verificadas
**Análisis manual X/Twitter:** 4 referentes Pilar 2 (Greg Isenberg, Pieter Levels, Allie K. Miller, Linus Ekenstam)
**Hooks consolidados:** ver `db/hooks/REAL_DATA_HOOKS.md` con top 10 cross-pilar listos para usar.
**Post test producido:** `outputs/posts/test-post-01-pilar-4-felipe-vergara-style.md` (5 plataformas adaptadas).

---

## Estructura de la DB

```
db/
├── INDEX.md                              ← este archivo
├── referentes/
│   ├── _candidates.md                    ← lista consolidada 50 referentes
│   ├── pilar-1-mentalidad-fe/
│   │   ├── _summary.md                   ← top 12 + benchmarks pilar
│   │   ├── danielhabif.md                ← data Apify real (5 top virales)
│   │   └── [otros 11 perfiles tras batch CSV]
│   ├── pilar-2-ia-aplicada/
│   │   ├── _summary.md
│   │   ├── rileybrown.ai.md              ← data Apify real
│   │   └── [otros 11]
│   ├── pilar-3-live-shopping/
│   │   ├── _summary.md
│   │   ├── camilapudim.md                ← data Apify real (679M views top)
│   │   └── [otros 11]
│   └── pilar-4-contenido/
│       ├── _summary.md
│       ├── hormozi.md                    ← data Apify real
│       └── [otros 9-10]
├── hooks/
│   ├── _taxonomy.md                      ← 10 fórmulas + 5 dimensiones
│   ├── pilar-1-hooks.json                ← hooks reales + adaptados a voz Alexander
│   ├── pilar-2-hooks.json
│   ├── pilar-3-hooks.json
│   └── pilar-4-hooks.json
├── estructuras/
│   ├── pilar-1-estructuras.md            ← 4-6 estructuras narrativas dominantes
│   ├── pilar-2-estructuras.md
│   ├── pilar-3-estructuras.md
│   └── pilar-4-estructuras.md
├── visual-director/
│   ├── _playbook.md                      ← reglas transversales del Director
│   ├── pilar-1-visual.md
│   ├── pilar-2-visual.md
│   ├── pilar-3-visual.md
│   └── pilar-4-visual.md
└── edicion/
    ├── _styles.md                        ← estilos transversales
    ├── pilar-1-edicion.md
    ├── pilar-2-edicion.md
    ├── pilar-3-edicion.md
    └── pilar-4-edicion.md

knowledge/templates/
├── viral-script-pilar-1.md ... 4.md      ← guion completo (hook + estructura + CTA)
├── visual-script-pilar-1.md ... 4.md     ← guion visual del Director
└── edition-guide-pilar-1.md ... 4.md     ← guía de edición

outputs/reports/
└── REFERENTES_ANALYSIS_2026-05-05.md     ← reporte ejecutivo final
```

---

## Cómo usar esta DB en producción

### Para crear UN POST nuevo:
1. Identificar pilar → `db/referentes/pilar-N-X/_summary.md` para context.
2. Pick 1 hook de `db/hooks/pilar-N-hooks.json` (filtrar por `alexander_compat: ✅` o 🟡).
3. Pick estructura de `db/estructuras/pilar-N-estructuras.md`.
4. Diseñar visual con `db/visual-director/pilar-N-visual.md` + `_playbook.md`.
5. Editar siguiendo `db/edicion/pilar-N-edicion.md` + `_styles.md`.
6. Pasar copy final por `agents/alexander-adapter.md` → workflow del CLAUDE.md.

### Para PLANEAR UN MES:
1. Leer `db/referentes/_candidates.md` para inspiración cross-pilar.
2. Aplicar `skills/pillar-distributor.md` (balance 30/30/20/20 sugerido).
3. Para cada slot, escoger combinación hook+estructura+visual de pilar correspondiente.
4. Templates en `knowledge/templates/` para arrancar drafts rápido.

### Para RE-FRESCAR REFERENTES:
1. Ejecutar batch completo Apify (~210 items, dentro free tier):
   ```
   python scripts/apify-scraper.py --batch scripts/referentes.csv --top-n 5 --min-views 500000
   ```
2. Revisar `scripts/scraping.log` para detectar errores.
3. Re-correr FASE 4 (análisis de hooks/estructuras) cuando haya nueva data.

---

## Hallazgos clave (resumen actualizado 2026-05-06)

1. **Handles del `.env` actual NO encajaban en Pilar 3.** Refactorizado: `.env` tiene ahora `INSTAGRAM_REFERENTS_P1`, `_P2`, `_P3`, `_P4` con handles validados + sección legacy preservada.

2. **Pilar 2 X/Twitter completados:** 4 archivos manuales en `pilar-2-ia-aplicada/` con análisis de tweets virales reales:
   - Greg Isenberg: listas masivas 30-50 startup ideas, +630K X.
   - Pieter Levels: build-in-public con cifras crudas, $3M ARR portfolio.
   - Allie K. Miller: LinkedIn long-form 2M followers, predicciones + casos Fortune 500.
   - Linus Ekenstam: prompts visuales públicos, 225K X.

3. **Validación Pilar 4 slots 11-12:**
   - ✅ Euge Oller (@euge.oller, 547K IG) — VALIDADO Tier 1.
   - ❌ Roberto Rocha — descartado (cuentas con 162K y 103K, no llegan a 200K).
   - Slot 12 LATAM queda vacante. 7 LATAM firmes + 4 globales = 11 Tier 1.

4. **Carlos Master Muñoz cross-pilar (P1, P2, P4):** scrapeado con data real — sus posts tipo "Si quieres ser rico, deja de comportarte como pobre" son F2 contrarian polémico (🔴 incompatible con voz Alexander tono confrontacional). Estudiar patrones, no replicar tono.

5. **Vilma Núñez (data real):** hooks IDÉNTICOS a Hormozi pero en español:
   - "Hay una palabra que muchos usan como estrategia... y muy pocos viven de verdad."
   - "Hay una pregunta que se repite cada vez que alguien quiere construir marca personal."
   - "¿Quién es Vilma?" (F6 pregunta personal)
   - Es el modelo LATAM más cercano a voz Alexander en P4.

6. **Mikayla Nogueira (data real):** sus top virales NO son live shopping puro — incluyen viajes/lifestyle ("MCDONALDS IN KOREA 😳", "WE SHOW UP AND SHOW OUTTTT"). Confirma que el sub-tipo A (Teaser/Tráfico) domina incluso en referentes Tier 1 USA del Pilar 3.

7. **Yokoi Kenji (data real):** hooks aforismo cortos en español ("Todo hace parte, nada es para siempre.", "Café de libertad"). Patrón replicable directo para Alexander en E1 (Aforismo + Reflexión).

8. **Camila Pudim:** confirmado — viraliza con makeup transformations (679M views top), no con live shopping. Funnel a Pudim Beauty.

9. **Tasa de replicabilidad directa estimada (✅):** ~55-65% en hooks observados con data real. Pilar 4 sigue siendo el más alto (75%); Pilar 3 el más bajo (55%).

10. **Re-scrapes YouTube completados (2026-05-06):** ✅ TheDiaryOfACEO (7.8M views top), ✅ Valuetainment/PBD (822K views, 🔴 tono político), ✅ DanKoeTalks (822K views, ✅ compatible). Total: **19 referentes con data real** + 4 X/Twitter manual = **23 referentes analizados**.

11. **12 posts test producidos (2026-05-06):** Calendario 30 días completo — 3 posts por pilar, multi-plataforma, con brief de editor, hipótesis A/B y métricas. `outputs/posts/test-post-01 a 12.md`.

---

## Estado del sistema: 100% OPERATIVO ✅

**Fecha de cierre:** 2026-05-06

### Posts test listos para publicar

| Post | Pilar | Estructura | Hook principal | Plataforma |
|---|---|---|---|---|
| test-post-01 | P4 | E2 Tutorial | "10h → 2h calendario IA" | Reel + YT + LinkedIn |
| test-post-02 | P1 | E1 Aforismo | "Respuesta. Explicación. Silencio." | Reel + Carrusel |
| test-post-03 | P1 | E2 Storytime | "Hace 4 años casi pierdo todo" | Reel 90s + LinkedIn |
| test-post-04 | P1 | E4 Pregunta | "¿Qué harías si no puedes fallar?" | Carrusel + LinkedIn |
| test-post-05 | P2 | E2 Tutorial | "Noticias IA: Claude Projects" | YT Short + Reel |
| test-post-06 | P2 | E3 Demo | "El prompt que más uso cada semana" | Reel 45s + LinkedIn |
| test-post-07 | P2 | E3 Lista | "5 herramientas IA ($0-$20/mes)" | Carrusel + Twitter |
| test-post-08 | P3 | E3 Comparativa | "Live convierte 3x más" | Reel + Carrusel |
| test-post-09 | P3 | E2 Storytime | "Mi primer live: 0 ventas" | Reel 90s |
| test-post-10 | P3 | E5 Anuncio | "LIVE [Fecha]: estructura 45 min" | Story + Post |
| test-post-11 | P4 | E1 Aforismo | "No dejes tu trabajo. Úsalo." | LinkedIn + Carrusel |
| test-post-12 | P4 | E4 Build-pub | "Mes 6 KREOON — números reales" | Twitter + LinkedIn |

### Próximos pasos operativos

- [ ] **Publicar posts en orden del calendario** — comenzar con test-post-02 (P1, Aforismo Silencio).
- [ ] **Tracking semanal:** registrar métricas en `outputs/tracking/` por post publicado.
- [ ] **Datos reales para test-post-12:** llenar números de KREOON mes 6 antes de publicar.
- [ ] **Slot 12 LATAM Pilar 4:** todavía vacante — candidatos: @primerempleo, creators MX/AR.
- [ ] **Batch CSV completo:** 44 referentes restantes cuando haya créditos Apify disponibles.
- [ ] **Tracking mensual:** re-scrapear top 12 referentes cada 30 días para detectar shifts.
