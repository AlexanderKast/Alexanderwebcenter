# Template: Viral Script — Pilar 3 (Live Shopping)

**Uso:** copiar, llenar `[placeholders]`, pasar por `agents/alexander-adapter.md`.
**Inputs:** `db/hooks/pilar-3-hooks.json` (12 hooks) + `db/estructuras/pilar-3-estructuras.md` (6 estructuras, sub-tipos A y B).

---

## Decisión clave: Sub-tipo A o B

**Sub-tipo A — Teaser/Tráfico viral** (transformations, demos, reveals): Camila Pudim. **NO recomendado para Alexander.**
**Sub-tipo B — Live + educación stack** (anuncios, recaps, demos software, comparativas, storytime): Mikayla Nogueira, Beachwaver, Athena. **SÍ recomendado para Alexander.**

Default Alexander: Sub-tipo B siempre.

---

## Paso 1 — Decidir estructura

| Estructura | Cuándo usarla | Compat |
|---|---|---|
| E1 — Anuncio Live + Producto + Beneficio | Día del live (Alexander hace live de Kreoon) | 🟡 |
| E2 — Recap de Live | 24-48h post-live | ✅ |
| E3 — Demo Persuasivo Stack | Showcase Kreoon, Pancake, OBS | ✅ |
| E4 — Comparativa Precio/Calidad | $0 vs $300 software | ✅ |
| E5 — Storytime Stack | "Probé 12 herramientas, 3 funcionaron" | ✅ |
| E6 — Trend Transformation | NO usar | 🔴 |

---

## Paso 2 — Elegir hook

Filtrar `db/hooks/pilar-3-hooks.json` por `alexander_compat: ✅` o 🟡 adaptado:

| Hook adaptado | Estructura | Origen |
|---|---|---|
| "🔴 Estoy en vivo ahorita. Probando un labial de $4 que se hizo viral. Pasa." | E1 | Mikayla |
| "Mira lo que hace esta herramienta en 30 segundos." | E3 | Beachwaver |
| "$10 vs $100 — adivina cuál estoy usando." | E4 | Athena |
| "Si no llegaste a mi live de ayer, esto pasó." | E2 | Virginia Fonseca |
| "Compré 50 herramientas de live commerce. Estas 3 no funcionaron y te ahorro la prueba." | E5 | Mari Saad adaptado |
| "Después de [N] horas armando lives para clientes UGC Colombia, esto es lo que funciona." | E5 | Katrina DiMiele adaptado |

---

## Paso 3 — Esqueleto del guion (E4 — Comparativa Precio/Calidad)

```markdown
### HOOK (0-3s)
"$X vs $Y — adivina cuál estoy usando."
[Visual: split screen 50/50 con UI de cada opción]

### OPCIÓN A (3-15s)
[Mostrar UI de la opción barata/gratis]
[Pros y contras en 2-3 bullets]

### OPCIÓN B (15-30s)
[Mostrar UI de la opción cara]
[Pros y contras en 2-3 bullets]

### REVEAL (30-45s)
"Estoy usando [A o B]. Te explico por qué."
[Razón concreta — no opinión vaga]

### REGLA DE DECISIÓN (45-60s)
"Si tu negocio hace <$X/mes, A. Si pasa de eso, B."

### CTA SUAVE (60s)
"El comparativo completo lo dejo en bio. Comenta 'STACK' si quieres el PDF."
```

---

## Paso 4 — Filtros pre-publicación

- [ ] Hook con `alexander_compat: ✅` o 🟡 adaptado.
- [ ] Mencionar herramienta gratuita primero, paga después (regla 80/20 Kreoon).
- [ ] Comparativa honesta (no maquillar Kreoon como ganador siempre — credibilidad).
- [ ] Pasar por `skills/alexander-voice-adapter.md`:
  - Sin gritos / sin caps lock excesivo
  - Sin 🔥 en cada frame
  - Sin promesas tipo "te haces millonario en 24h"
- [ ] Si hay CTA, suave: "Comenta X" mejor que "Compra ya".
- [ ] Duración 15-90s.

---

## Paso 5 — Brief al editor

```
PROYECTO: [Título]
PILAR: 3 — Live Shopping
ESTRUCTURA: [E1-E5]
HOOK: "[hook literal]"
DURACIÓN OBJETIVO: [15-30s anuncio | 30-60s recap/comparativa | 60-120s demo/storytime]

VISUAL (ver db/visual-director/pilar-3-visual.md):
- Plano principal: talking head close-up + producto/pantalla en mano
- Texto on-screen: Montserrat Black para cifras, badge "🔴 LIVE" rojo si E1
- Color grade: Vibrant Commerce
- Paleta: Naranja Energía + Rojo LIVE + blanco alto contraste
- Counter animado para cifras (0 → final en 0.5s)

EDICIÓN (ver db/edicion/pilar-3-edicion.md):
- Ritmo: rápido (1 cut/2-3s para anuncios y comparativas, 1 cut/4-6s para demos)
- Música: trending audio TikTok (E1) o lo-fi tech 80-100 BPM (E3-E4) a -16dB
- Beat sync transitions en E1 y E4
- Subtítulos: integrados Inter Bold 40-48pt con corrección de marcas (Pancake, OBS, Shopify)
- Sonidos extra: whoosh + ding (máx 2 por video)

EXPORT: 1080x1920 H264 30fps subtítulos quemados
```

---

## Paso 6 — Plataformas

| Plataforma | Adaptación |
|---|---|
| TikTok | Plataforma #1 para Pilar 3. Hashtags: #liveshopping #ecommercelatam #pancake |
| IG Reel | Mismo video. Tag de marcas (Shopify, Pancake) en caption. |
| YouTube Short | Versión 60s para tutoriales. |
| IG Carrusel | E4 (comparativa) → 8 slides con UI side-by-side. |
| LinkedIn | Convertir E5 a post texto + screenshot del comparativo. |

---

## Ejemplo completo (referencia)

**Estructura:** E4 — Comparativa Precio/Calidad
**Hook:** "$0 vs $300/mes en software de live shopping. Adivina con cuál estoy haciendo más ventas."

**Guion:**

```
[Hook]
"$0 vs $300/mes en software de live shopping. Adivina con cuál estoy haciendo más ventas."

[Opción A]
"OBS Studio + Streamyard. Setup técnico, 2 horas configurar.
Pros: gratis, customizable.
Contras: pesado para principiantes."

[Opción B]
"Pancake. Setup en 5 minutos, integración nativa con Shopify.
Pros: rápido, profesional.
Contras: $300/mes."

[Reveal]
"Estoy usando A. Pero solo porque ya sabía OBS desde antes. Si empiezas hoy, B."

[Regla de decisión]
"Mi regla: si tu tienda hace <$5k/mes, gratis. Si pasas de eso, paga."

[CTA]
"El comparativo completo de 12 herramientas lo dejo en bio. Comenta 'STACK' si quieres el PDF."
```

---

## Métricas a trackear

| Métrica | Bench Pilar 3 |
|---|---|
| Retención 3s | >65% |
| Click bio (a live o curso) | >3% |
| Comentarios pidiendo recurso ("STACK", "PRECIO") | >2% |
| Sales attributable a video | tracking con UTM |
| Suscriptores nuevos al webinar/live | conversión esperada 5-10% |

**Regla:** En Pilar 3 SÍ es válido CTA explícito (a diferencia de Pilar 1) — pero suave. El pilar es ventas-relacionado, audiencia espera oferta.
