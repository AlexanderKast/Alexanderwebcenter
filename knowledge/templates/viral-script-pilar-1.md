# Template: Viral Script — Pilar 1 (Mentalidad / Fe + Negocios)

**Uso:** copiar, llenar `[placeholders]`, pasar por `agents/alexander-adapter.md`.
**Inputs:** `db/hooks/pilar-1-hooks.json` (12 hooks listos) + `db/estructuras/pilar-1-estructuras.md` (5 estructuras).
**Output:** Reel/TikTok 30-90s, carrusel IG, post imagen estática, YouTube Long.

---

## Paso 1 — Decidir estructura

| Estructura | Cuándo usarla | Compat Alexander |
|---|---|---|
| E1 — Aforismo + Reflexión | Insight reflexivo, fe implícita | ✅ |
| E2 — Storytime + Lección | Experiencia personal con transformación (SICOMMER, KREOON) | ✅ |
| E3 — Lista de 3 con Escalada | Insights cortos, slide 1 carrusel | ✅ |
| E4 — Pregunta + Respuesta No-Obvia | Reflexión profunda con pivote | ✅ |
| E5 — Predicación Motivacional | NUNCA — rompe voz Alexander | 🔴 |

**Default Alexander:** E1 (Aforismo) o E2 (Storytime). Calzan directo.

---

## Paso 2 — Elegir hook

Filtrar `db/hooks/pilar-1-hooks.json` por `alexander_compat: ✅` o 🟡 adaptado:

| Hook adaptado | Origen | Métrica origen |
|---|---|---|
| "Algunas personas merecen una respuesta. Otras una explicación. Y otras tu silencio." | Daniel Habif | 171K likes |
| "La pobreza no es no tener dinero. Es no tener disciplina." | Yokoi Kenji | +5M views típico |
| "La forma más rápida de ganar confianza es construir evidencia. No hay atajo." | Hormozi | 15.8K likes |
| "Si no estás aprendiendo, no estás viviendo. Estás repitiendo." | Jay Shetty adaptado | +5M views típico |
| "Estos 3 errores quiebran un negocio en el primer año. Yo los cometí los 3." | Pat Bet-David adaptado | +1M views típico |
| "Donde pones la atención, llega la energía. Por eso lo que rumeas es lo que crece." | Tony Robbins adaptado | +1.5M views típico |

---

## Paso 3 — Esqueleto del guion (E2 — Storytime + Lección)

```markdown
### HOOK (0-5s)
[Hook con before/after truncado]
Ejemplo: "Hace 3 años quebré SICOMMER. Hoy facturo 7 cifras. Esto fue lo que cambió."

### SETUP (5-30s)
[Estado terrible inicial — qué pasaba, cómo se sentía]
[Momento de quiebre — el evento que rompió la inercia]

### PROCESO (30-60s)
[1-2 acciones específicas que tomaste]
[Anécdota personal real, sin embellecer]

### RESULTADO (60-80s)
[Estado actual — cifra concreta, situación tangible]

### LECCIÓN (80-90s)
[1 frase que sintetiza el aprendizaje universal]
[Pregunta abierta o silencio — NO CTA agresivo]
```

---

## Paso 4 — Filtros pre-publicación

- [ ] Hook con `alexander_compat: ✅` o 🟡 adaptado.
- [ ] Cierre SIN CTA agresivo (regla Pilar 1: pregunta o silencio).
- [ ] Si hay fe/espiritualidad: implícita, no explícita ("Algo más grande", no "Dios"). Si es explícita, marca el post como "público cristiano" en metadata.
- [ ] Pasar por `skills/alexander-voice-adapter.md`:
  - Despojamiento (cero hype gratuito)
  - Paisización (1-2 expresiones: "a la final", "en serio")
  - Honestización (sin promesas vacías)
  - Aterrizaje (ejemplo concreto LATAM)
  - Simplificación (eliminar fluff)
- [ ] Duración 30-90s para reel, 200-400 palabras para LinkedIn/caption.

---

## Paso 5 — Brief al editor

Pasar a `agents/visual-director.md` + `db/visual-director/pilar-1-visual.md`:

```
PROYECTO: [Título]
PILAR: 1 — Mentalidad / Fe + Negocios
ESTRUCTURA: [E1 | E2 | E3 | E4]
HOOK: "[hook literal]"
DURACIÓN OBJETIVO: 60-90s

VISUAL (ver db/visual-director/pilar-1-visual.md):
- Plano principal: talking head medium close-up + ventana lateral
- B-roll: taza de café, escribiendo, foto SICOMMER
- Texto on-screen: Playfair Display Italic 60-80pt
- Paleta: Verde Crecimiento + tonos tierra cálidos
- LUT: Warm Reflective

EDICIÓN (ver db/edicion/pilar-1-edicion.md):
- Ritmo: 1 cut/8-15s para aforismo, 1 cut/5-8s para storytime
- Música: Ólafur Arnalds-style, 60-80 BPM, -18dB
- Pausas reflexivas: 1-2s post-aforismo
- Subtítulos: integrados Inter Regular 36-48pt
- Transitions: cut directo + fade in/out

EXPORT: 1080x1920 H264 30fps subtítulos quemados
```

---

## Paso 6 — Plataformas

| Plataforma | Adaptación |
|---|---|
| IG Reel | Subir como Reel. Captions integradas. |
| TikTok | Mismo video. Hashtags: #mindset #emprendimiento #colombia |
| YouTube Shorts | Versión 60s. Título con hook. |
| IG Post imagen | Quote-card estática (E1, E3). Caption largo con reflexión. |
| LinkedIn | Convertir storytime a post texto 300-400 palabras. |
| Carrusel IG | E2 o E3 → 8-10 slides con jerarquía. |

---

## Ejemplo completo (referencia)

**Estructura:** E2 — Storytime + Lección
**Hook:** "Hace 3 años quebré SICOMMER. Hoy facturo 7 cifras. Esto fue lo que cambió."

**Guion:**

```
[Hook]
"Hace 3 años quebré SICOMMER. Hoy facturo 7 cifras. Esto fue lo que cambió."

[Setup]
SICOMMER era mi marca de carruseles a domicilio. La armé sin sistema.
Crecí. Pero no medía nada.
Cuando llegó la cuenta de impuestos del año, no había plata.

[Proceso]
Cerré. Lloré una semana.
Después aprendí 2 cosas:
1) No mezclar plata personal con plata del negocio.
2) Saber el costo real ANTES de vender, no después.

[Resultado]
Con esas dos cosas, armé KREOON. Desde el día 1 hubo libro contable.
3 años después, factura 7 cifras y no le debo a nadie.

[Lección]
No es que no podías. Era que no medías.
```

---

## Métricas a trackear

| Métrica | Bench Pilar 1 |
|---|---|
| Retención 3s | >70% (E2 puede llegar a 80%+) |
| Retención completa | >50% |
| Save rate | >2% |
| Comentarios reflexivos | señal de E1/E2 funcionando |
| Compartidos | >2% (señal de aforismo/lección replicable) |
