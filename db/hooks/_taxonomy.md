# Taxonomía de Hooks Virales — Alexander Cast

**Base:** extiende `skills/viral-hooks.md` (10 fórmulas) con dimensiones adicionales para clasificar, filtrar y replicar hooks reales scrapeados de los 50 referentes.

---

## 10 fórmulas de hook (reusadas de skills/viral-hooks.md)

| Código | Fórmula | Estructura | Ejemplo |
|---|---|---|---|
| F1 | Número + Resultado + Tiempo | "[#] [cosa] que [resultado] en [tiempo]" | "3 prompts que reducen 8 horas a 20 minutos" |
| F2 | Contrarian | "[Creencia común] es falso. [Verdad contraria]" | "Live shopping NO es prender un live en TikTok" |
| F3 | Resultado Extremo + Método Inesperado | "[Resultado] haciendo [método opuesto]" | "Vendí más cuando dejé de hacer lives en vivo" |
| F4 | Error Fatal (Fear-Based) | "El error de [$/consecuencia] que [audiencia] comete" | "El error de $10k que cometí en mi primer año" |
| F5 | Resultado Personal Específico | "[Acción] → [Resultado con número] en [tiempo]" | "1 email → $47k en ventas" |
| F6 | Pregunta con gap de información | "¿[Pregunta intrigante]?" | "¿Por qué quebré SICOMMER vendiendo $X/mes?" |
| F7 | Before/After Extremo | "De [estado terrible] a [estado increíble]" | "De 0 seguidores a 50k en 6 meses" |
| F8 | Secreto / Verdad Oculta | "[Grupo] no te dice esto sobre [tema]" | "Lo que las agencias omiten cuando venden 'resultados garantizados'" |
| F9 | Challenge / Test | "Si [condición], entonces [acción/conclusión]" | "Si tu ER es <3%, estás haciendo esto mal" |
| F10 | Lista Curiosa | "[#] [cosas inesperadas] que [resultado sorprendente]" | "3 cosas que NO hago que duplicaron mi productividad" |

---

## Dimensiones secundarias (para clasificar cada hook capturado)

### Dimensión 1 — Emoción primaria activada

| Código | Emoción | Señal lingüística |
|---|---|---|
| E1 | Curiosidad | "¿Sabías?" / "Esto es lo que..." / promesa de revelación |
| E2 | Sorpresa | "Nadie te dice" / "Lo que descubrí" / contraste inesperado |
| E3 | Miedo / pérdida | "Te está costando" / "El error" / "Si no haces X" |
| E4 | Esperanza / aspiracional | "Finalmente" / "Pasé de X a Y" / "Cómo logré" |
| E5 | Indignación / contrarian | "Te mintieron" / "Es falso" / "Deja de creer en X" |
| E6 | Identificación / espejo | "Si eres [perfil]..." / "Tú también..." / "Como tú, yo..." |

### Dimensión 2 — Estructura sintáctica

| Código | Estructura | Ejemplo |
|---|---|---|
| S1 | Declarativa fuerte | "La IA no te va a reemplazar." |
| S2 | Pregunta retórica | "¿Por qué dejé de usar ChatGPT?" |
| S3 | Apertura con cifra | "$47k en 28 días." |
| S4 | Apertura con tiempo | "Hace 3 años quebré." |
| S5 | Comparativa con flecha / contraste | "De 10 horas a 2 horas." |
| S6 | Lista numerada | "5 errores que matan el engagement." |
| S7 | Imperativo | "Deja de hacer X." / "Mira esto." |
| S8 | Storytelling truncado | "Hice X. Pasó Y. Esto aprendí." |

### Dimensión 3 — Tono compatible con voz Alexander

| Código | Tono | ¿Calza con Alexander? |
|---|---|---|
| T1 | Tranquilo / directo | ✅ Calza directo |
| T2 | Reflexivo / íntimo | ✅ Calza directo |
| T3 | Didáctico / paciente | ✅ Calza directo |
| T4 | Energético contenido | 🟡 Adaptable |
| T5 | Hype / explosivo / mayúsculas | 🔴 No calza (despojar) |
| T6 | Predicador / emocional fuerte | 🔴 No calza (suavizar) |
| T7 | Sarcástico / agresivo | 🔴 No calza (descartar) |

### Dimensión 4 — Gancho cognitivo (Cialdini / sesgos)

| Código | Gancho | Mecanismo |
|---|---|---|
| C1 | Prueba social | "X miles ya lo hacen" |
| C2 | Autoridad | "Lo que aprendí en [contexto creíble]" |
| C3 | Reciprocidad | "Te regalo X aprendizaje" |
| C4 | Escasez | "Solo 3 lo saben" / "Antes de que..." |
| C5 | Aversión a pérdida | "Estás perdiendo X por Y" |
| C6 | Sesgo de novedad | "Lo nuevo que cambió todo" |
| C7 | Curiosity gap | Promete sin entregar en hook |

### Dimensión 5 — Plataforma para la que está optimizado

| Código | Plataforma | Características |
|---|---|---|
| P1 | Instagram Reel / TikTok | Visual hook + audio hook + texto pantalla, 3s primeros |
| P2 | Instagram Carrusel | Slide 1 = hook visual + textual coherente |
| P3 | YouTube Short | Hook 0-3s, retención del 70%+ |
| P4 | YouTube Long | Promesa de valor + agenda en primeros 30s |
| P5 | LinkedIn Post | Insight con número o aprendizaje, tono profesional |
| P6 | Twitter/X | <280 caracteres, alta densidad de idea |

---

## Schema del registro JSON por hook (lo usa FASE 4)

```json
{
  "hook_id": "p1-001",
  "pilar": "1",
  "referente": "@danielhabif",
  "platform": "instagram",
  "url": "https://instagram.com/p/...",
  "post_views": 2400000,
  "post_likes": 180000,
  "post_engagement_rate_pct": 8.1,
  "hook_text": "...",
  "formula": "F2",
  "emocion": "E5",
  "estructura": "S1",
  "tono": "T6",
  "gancho_cognitivo": "C5",
  "platform_optim": ["P1"],
  "alexander_compat": "🟡",
  "alexander_adapted": "...",
  "notas": "Hook funciona pero tono predicador requiere despojar y suavizar."
}
```

---

## Benchmarks de hook (heredados de skills/viral-hooks.md)

| Calidad | Alcance vs followers | ER primeros 5 min | Retención video |
|---|---|---|---|
| Malo | <10% | <1% | <30% |
| Promedio | 10-25% | 1-3% | 30-50% |
| Bueno | 25-40% | 3-6% | 50-70% |
| Viral | >40% | >6% | >70% |

---

## Anti-patterns a marcar en el análisis

- Hook genérico ("Hoy quiero hablarte sobre...")
- Clickbait sin valor ("No vas a creer...")
- Hook >20 palabras
- Hook sin contexto ("Esto es increíble")
- Hook con jerga vulgar (gonorrea, sisas, etc.) — incompat absoluto con voz Alexander

## Próximos pasos (FASE 4)

1. Extraer hooks de los 250 posts scrapeados.
2. Clasificar cada hook con las 5 dimensiones (formula, emocion, estructura, tono, gancho).
3. Calcular `alexander_compat` automáticamente vía tono (T1-T3 = ✅, T4 = 🟡, T5-T7 = 🔴).
4. Para los 🟡, generar versión adaptada usando `skills/alexander-voice-adapter.md`.
5. Guardar en `db/hooks/pilar-N-hooks.json`.
