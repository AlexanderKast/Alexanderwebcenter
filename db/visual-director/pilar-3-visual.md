# Visual — Pilar 3 (Live Shopping)

**Paleta primaria:** Naranja Energía `#E67E22` + Rojo LIVE `#FF0000` + fondos oscuros (negro `#1A1A1A`, gris oscuro `#2C3E50`).
**Paleta acento:** Amarillo `#F39C12` + blanco alto contraste.
**Mood:** dinámico, energético contenido (no chillón), enfoque en producto/herramienta + cifras.

---

## Tipos de plano dominantes

| Plano | Cuándo | Ejemplo referente |
|---|---|---|
| Talking head close-up con producto en mano | Demo, comparativa | Mikayla, Athena, Beachwaver |
| Screen recording dashboard | Demo de software (Pancake, OBS) | Kreoon-style |
| Split screen comparativo | E4 (precio vs precio) | Athena |
| Plano cenital sobre mesa | Comparar productos físicos | Mari Saad |
| Pantalla del live (replay) | E2 Recap con captura del live | Virginia Fonseca, Mikayla |

---

## Iluminación

- **Ring light suave + softbox lateral** para talking head (ojos brillantes pero sin "ojos de muñeca").
- Producto bien iluminado (clave para que se vea bien la marca/UI del software).
- Para screen recording: brillo de pantalla 80% + grabación nítida sin compresión.
- Si es replay del live: usar el frame original sin re-grabar.

---

## Tipografía y texto en pantalla

| Uso | Fuente | Tamaño | Color |
|---|---|---|---|
| Hook con cifras | **Montserrat Black** | 100-130pt | Blanco con borde rojo o naranja |
| Badge "🔴 LIVE" / "EN VIVO" | Montserrat Bold | 50-60pt | Rojo `#FF0000` con fondo blanco o transparente |
| Producto / nombre software | Montserrat Bold | 60-80pt | Naranja Energía |
| Comparativa $X vs $Y | Roboto Mono Bold | 80-100pt | Verde (gana) / Rojo (pierde) |
| Subtítulos integrados | Inter Bold | 40-48pt | Blanco con sombra negra |

**Regla:** alto contraste + texto bold + animaciones rápidas (fade in 0.2s, NO bouncing).

---

## Color grading

- **LUT recomendado:** "Vibrant Commerce" (vibrante, saturado pero no irreal).
- Saturación: +10-15% (vivo, energético).
- Highlights: +10 (productos brillantes pop).
- Shadows: -5 (mantener detalle).
- Temperatura: neutral (5500K). Si se va a oscuro, ligero +100K cálido.

---

## Composición típica

- **Producto/pantalla domina el frame** (60-70%) → texto on-screen no compite.
- **Talking head:** rostro encuadrado a tercio superior, producto o pantalla a tercio inferior derecho.
- **Split screen:** 50/50 vertical. Cada lado con etiqueta clara (precio, marca).
- **Counter de stock / urgencia:** esquina superior derecha en rojo.

---

## Elementos recurrentes

| Elemento | Cuándo |
|---|---|
| Badge "🔴 LIVE" o "🔴 EN VIVO HOY" | E1 (anuncio live) |
| Contador stock animado ("Quedan 5") | Final E1, recap E2 |
| Captura de pantalla del live | E2 (recap) |
| Logo / UI del software (Pancake, OBS, Shopify) | E3, E4 |
| Cifras de venta (counter animado) | E5 |
| Flecha o arrow guideline (señalando UI) | E3 (demo) |
| Producto en mano frente a cámara | E5 |

🚫 **EVITAR:** flames 🔥 excesivos (look TikTok shop barato), countdown agresivo cada 3s, autopromoción gritada.

---

## Reels / TikTok 9:16 — layout estándar

```
┌─────────────────────────────┐
│  🔴 LIVE | Quedan 5  ┐ esquina sup-derecha
│                             │
│   [Talking head 60%]        │
│   con producto/pantalla     │
│                             │
│      ┌─────────────────┐    │
│      │ HOOK / TEXTO    │    │
│      │ Montserrat Black│    │
│      └─────────────────┘    │
│                             │
│  Captions integrados        │
│  @alexemprendee             │
└─────────────────────────────┘
```

---

## Carrusel IG comparativa (E4) — 8 slides

```
SLIDE 1: Hook "$0 vs $300/mes en live shopping. ¿Cuál uso?"
SLIDE 2: Opción A — captura UI + precio + setup time
SLIDE 3: Opción A — pros (3 bullets)
SLIDE 4: Opción A — contras (2-3 bullets)
SLIDE 5: Opción B — captura UI + precio + setup time
SLIDE 6: Opción B — pros (3 bullets)
SLIDE 7: Opción B — contras (2-3 bullets)
SLIDE 8: Reveal: cuál uso y regla de decisión
```

---

## Anti-patterns visuales (no hacer en Pilar 3)

- ❌ Caps lock con 🔥🔥 en cada frame → look gurú dropshipper.
- ❌ Countdown timer agresivo cada 3s → manipulativo.
- ❌ Stock photos de "creator de éxito" → cliché.
- ❌ Filtro saturación extrema TikTok shop barato.
- ❌ Texto en gradiente rainbow → ruido visual.
- ❌ Música épica trance / drum&bass → no calza con voz Alexander.

---

## Brief al editor — ejemplo Pilar 3

```
PROYECTO: "Pancake vs OBS — comparativa honesta para tu primer live shopping"
PILAR: 3 — Live Shopping
ESTRUCTURA: E4 (Comparativa precio/calidad)
DURACIÓN: 50-60s reel

VISUAL:
- Plano apertura: split screen 50/50 con UI de Pancake (izq) y OBS (der)
- Texto pantalla:
   * Frame 1: "$0 vs $300/mes" (Roboto Mono Bold 100pt)
   * Frame 2: "PANCAKE 5min setup"
   * Frame 3: "OBS 2 horas setup"
   * Frame 4: "Mi regla: <$5k/mes → OBS. >$5k/mes → Pancake."
- Color grade: Vibrant Commerce
- Paleta: Naranja Energía + Rojo LIVE + blanco

EDICIÓN: ver db/edicion/pilar-3-edicion.md
EXPORT: 1080x1920 H264 30fps subtítulos quemados
```
