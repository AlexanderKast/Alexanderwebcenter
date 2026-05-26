# Template: Viral Script — Pilar 2 (IA aplicada / Kreoon)

**Uso:** copiar este template, llenar los `[placeholders]`, y pasar por `agents/alexander-adapter.md` antes de publicar.
**Inputs:** `db/hooks/pilar-2-hooks.json` (hooks listos) + `db/estructuras/pilar-2-estructuras.md` (6 estructuras dominantes).
**Output deseado:** Reel/TikTok 60-120s, YT Short, o carrusel IG.

---

## Paso 1 — Decidir estructura

| Estructura | Cuándo usarla | Compat Alexander |
|---|---|---|
| E1 — Demo + Stunned Reaction (Riley Brown) | Lanzamiento Kreoon, workflow IA visible en pantalla | 🟡 |
| E2 — Tutorial paso-a-paso (Master Muñoz, Cómousarapps) | "Cómo hacer X con IA" para no-técnicos | ✅ |
| E3 — Comparativa antes/después (Bruno.ia1) | Mostrar reducción de tiempo o costo | ✅ |
| E4 — Lista numerada + tool stack (Vilma Núñez, Merodio) | "5 herramientas IA para X" | ✅ |
| E5 — Aforismo IA + insight (Allie Miller, Hormozi) | LinkedIn / posts cortos de autoridad | ✅ |
| E6 — Build-in-public con cifras (Pieter Levels) | "Vendí $X con esta app" | 🟡 |

**Default recomendado para Alexander:** E2 (Tutorial) o E4 (Lista) — calzan directo con voz didáctica paisa.

---

## Paso 2 — Elegir hook

Abrir `db/hooks/pilar-2-hooks.json` y filtrar `alexander_compat: ✅` para el formato deseado. Top picks reales:

| Hook | Métrica de origen | Adaptación lista |
|---|---|---|
| "Mira esto. Esto no debería ser posible." (Riley Brown adaptado) | 4.7M views TikTok | "Mira esto. Esto no debería ser posible." |
| "Pasé de 10 horas a 2 horas en estrategia con IA" (Alexander original) | — | Listo en voz |
| "La IA no te reemplaza. Alguien que use IA sí." (Allie Miller patrón) | — | Listo en voz |
| "5 prompts que cambian tu marketing" (Merodio patrón) | — | Listo en voz |
| "What happens when you give X access to Y?" (Riley Brown adaptado) | 694K views | "¿Qué pasa cuando le das a [IA] acceso a [herramienta]?" |

---

## Paso 3 — Esqueleto del guion (E2 — Tutorial paso-a-paso)

```markdown
### HOOK (0-3s)
[Hook elegido del paso 2]

### APERTURA (3-10s)
"Si todavía haces [tarea manual], estás perdiendo [tiempo/plata].
Te muestro cómo lo hago yo en [tiempo nuevo]."

### DESARROLLO (10-50s)
PASO 1: [acción concreta + screenshot]
   Voz: "Primero, abro [herramienta] y le pego este prompt:"
   Texto pantalla: "PASO 1: [palabra clave]"

PASO 2: [acción concreta + screenshot]
   Voz: "Después, le pido que [siguiente acción]:"
   Texto pantalla: "PASO 2: [palabra clave]"

PASO 3: [acción concreta + screenshot]
   Voz: "Y por último, [acción final]:"
   Texto pantalla: "PASO 3: [palabra clave]"

### REVEAL (50-70s)
[Mostrar output final en pantalla]
Voz: "Lo que antes me tomaba [tiempo viejo], ahora toma [tiempo nuevo]."

### ATERRIZAJE (70-85s)
"Esto funciona para [tipo de negocio LATAM específico]:
[ejemplo real de UGC Colombia o Kreoon]."

### CTA SUAVE (85s+)
"Si quieres el prompt completo, comenta 'IA' y te lo mando.
También funciona con [alternativa gratuita] si no tienes Kreoon."
```

---

## Paso 4 — Filtros pre-publicación

Pasar el guion por estos checkpoints **antes** de grabar:

- [ ] ¿El hook calza con `alexander_compat: ✅` o 🟡 adaptado? (Si es 🔴, descartar.)
- [ ] ¿Mencionas Kreoon respetando 80/20? (80% educación, 20% producto.)
- [ ] ¿Hay alternativa gratuita o manual? (Regla CLAUDE.md.)
- [ ] ¿Pasas por `skills/alexander-voice-adapter.md`?
   - Despojamiento (cero hype gratuito)
   - Paisización (1-2 expresiones naturales: "a la final", "en serio", "berraco" si calza)
   - Honestización (sin promesas vacías)
   - Aterrizaje (ejemplo concreto LATAM)
   - Simplificación (eliminar fluff)
- [ ] ¿Duración entre 60-120s para Reel/TikTok? (Si >120s, partir en 2 posts.)

---

## Paso 5 — Brief al editor / Director Visual

Pasar a `agents/visual-director.md` con esta info:

```
PROYECTO: [Título]
PILAR: 2 — IA aplicada
ESTRUCTURA: E2 (Tutorial paso-a-paso)
HOOK: "[hook literal]"

VISUAL (ver db/visual-director/pilar-2-visual.md):
- Plano apertura: screen recording de Mac/PC con la herramienta abierta
- Texto pantalla: PASO 1/2/3 grandes en Montserrat Bold
- Color grade: limpio, ligero desaturado
- Paleta: Azul Estratégico #2B4C7E + amarillo acento

EDICIÓN (ver db/edicion/pilar-2-edicion.md):
- Ritmo: 1 cut/4-6s
- Música: lo-fi tech 70-90 BPM, -18dB
- Subtítulos quemados: SÍ
- Transiciones: cut directo + zoom punch en outputs

DURACIÓN OBJETIVO: 75-90s
EXPORT: 1080x1920 H264 30fps
```

---

## Paso 6 — Plataformas de publicación

| Plataforma | Adaptación |
|---|---|
| Instagram Reel | Subir como Reel, NO como Story. Captions integradas obligatorias. |
| TikTok | Mismo video, ajustar copy descripción con 3 hashtags relevantes (#IA #automatizaciones #emprendimiento). |
| YouTube Shorts | Subir versión 60s (cortar más). Título con hook + emoji ≠ caps lock. |
| LinkedIn | NO subir el video. Convertir a post texto: hook + 3 bullets pasos + CTA. |
| Twitter/X | Hilo de 5-7 tweets: hook → cada paso → CTA. |

---

## Ejemplo completo (referencia)

**Hook:** "Pasé de 10 horas a 2 horas en estrategia de contenido. Esto fue lo que cambié."

**Apertura:** "Si todavía gastas un día entero planeando contenido del mes, estás haciendo lo que yo hacía hace 6 meses. Te muestro qué cambié."

**Desarrollo:**
- PASO 1: Abro Kreoon, pego mi nicho + objetivos del mes.
- PASO 2: Le pido que arme calendario por pilar (4 pilares × 4 semanas).
- PASO 3: Reviso, ajusto 2-3 ideas, le pido que escriba primer draft de cada post.

**Reveal:** "Lo que antes me tomaba 10 horas, ahora me toma 2. Y son ideas mejores."

**Aterrizaje:** "Esto lo armamos pensando en agencias UGC LATAM. Si vendes UGC, te ahorra el 80% del tiempo de research."

**CTA:** "Si quieres ver el flujo completo, te dejo el link abajo. Si no tienes Kreoon, lo puedes hacer manual con ChatGPT + 3 prompts (te paso los prompts si comentas 'IA')."

---

## Métricas a trackear post-publicación

| Métrica | Bench Pilar 2 |
|---|---|
| Retención 3s | >70% (señal hook funcional) |
| Retención 50% | >50% (señal estructura) |
| Saved rate | >3% (señal valor + replicable) |
| Comentarios "IA" / pidiendo prompt | >2% (señal CTA funcional) |
| Click bio | >0.5% (si hay link a Kreoon) |

Si después de 3 posts en Pilar 2 con esta estructura el retention 3s no llega al 60%, revisar hooks y probar E1 (Demo) en lugar de E2 (Tutorial).
