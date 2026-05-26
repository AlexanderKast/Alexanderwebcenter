# Dirección Visual — Pilar 2 (IA aplicada / Kreoon)

**Fecha:** 2026-05-05
**Base:** `agents/visual-director.md` + análisis de Riley Brown, DotCSV, Master Muñoz, Cómousarapps, Bruno.ia1, Matt Wolfe, Allie Miller, Greg Isenberg, Pieter Levels, Linus Ekenstam, Aldo Bartra, Artificialmente.ia.
**Objetivo:** mood board, paleta, tipografías, props y reglas de composición específicas para todo contenido del pilar IA aplicada.

---

## Identidad visual del pilar

**Mood en 3 palabras:** limpio · técnico-cálido · accesible.

**NO somos:**
- ❌ Tech frío estilo "Silicon Valley pitch deck" (azul oscuro saturado, neon).
- ❌ Estética "AI hype" con renders 3D giratorios y holos.
- ❌ Caos de screenshots desordenados estilo "tutorial casero sin diseño".

**SÍ somos:**
- ✅ Estudio limpio, profesional, con calidez paisa subyacente.
- ✅ Screenshots reales bien anotados (no maquetas exageradas).
- ✅ Tipografía grande y legible — la audiencia consume en móvil pequeño.

---

## Paleta de colores

### Primarios

| Rol | Color | Hex | Uso |
|---|---|---|---|
| Primario dominante | Azul Estratégico | `#2B4C7E` | Fondos planos, títulos principales, frames de tutorial |
| Acento principal | Amarillo Insight | `#F39C12` | Highlights de pasos, checkmarks, números grandes |
| Fondo neutro | Blanco puro | `#FFFFFF` | Fondo de carruseles tutoriales |
| Fondo neutro 2 | Gris Claro | `#ECF0F1` | Fondos suaves para screenshots con anotaciones |

### Secundarios (uso ocasional)

| Rol | Color | Hex | Uso |
|---|---|---|---|
| Texto principal | Gris Oscuro | `#34495E` | Cuerpo de texto sobre blanco/gris claro |
| Confirmación | Verde Crecimiento | `#27AE60` | Checkmarks, "DESPUÉS" en comparativas |
| Alerta | Rojo Alerta | `#E74C3C` | "ANTES" en comparativas, errores típicos |

### Reglas de uso

- 60% blanco/gris claro · 25% azul estratégico · 10% amarillo insight · 5% otros.
- Nunca azul + naranja + rojo en la misma pieza (esa mezcla pertenece a Pilar 3 Live Shopping).
- Texto sobre azul estratégico: siempre blanco o amarillo insight (nunca gris).
- Highlights amarillo insight: máximo 2 por slide / frame.

---

## Tipografía

### Fuentes asignadas

| Rol | Fuente | Peso | Uso |
|---|---|---|---|
| Títulos H1 | Montserrat | Bold (700) | Hooks de portada, título carruseles |
| Títulos H2 | Poppins | SemiBold (600) | Subtítulos, nombres de paso |
| Cuerpo | Inter | Regular (400) / Medium (500) | Explicaciones largas, captions |
| Datos / código | Space Mono | Regular | Cifras, prompts, snippets de código |

### Jerarquía por formato

**Carrusel IG (1080×1350):**
- H1 (portada): 96-110 px
- H2 (slides internos): 60-72 px
- Cuerpo: 36-44 px
- Datos: 48-60 px

**Reel / TikTok (1080×1920):**
- Texto principal: 80-100 px
- Subtexto: 48-56 px
- Máximo 7-10 palabras por frame.

**LinkedIn (1200×627):**
- Título: 48-56 px
- Cuerpo: 24-28 px

---

## Elementos visuales recurrentes

### 1. Screenshots con anotaciones

**Estilo aprobado:**
- Screenshot real de la herramienta (Mac/PC, ventana sin notificaciones de WhatsApp/email visibles).
- Borde redondeado 12-16 px, sombra suave (0 8px 24px rgba(0,0,0,0.08)).
- Anotaciones con flechas amarillas insight `#F39C12`, grosor 3px.
- Círculos resaltadores amarillos sobre la zona clave (opacity 0.3).
- Texto de anotación en Poppins SemiBold sobre fondo blanco con padding 8px.

**Anti-patterns:**
- ❌ Screenshots con barra de notificaciones del sistema visible.
- ❌ Cursor mal posicionado o capturado a media animación.
- ❌ Marcas de agua de extensiones de browser.
- ❌ Capturas de baja resolución estiradas.

### 2. Diagramas de flujo

**Estilo:**
- Cajas rectangulares con esquinas redondeadas (radius 8 px).
- Conectores con flechas finas (2 px), nunca curvas barrocas.
- Máximo 5 nodos por diagrama (más es ilegible en móvil).
- Color de cajas: azul estratégico al 100% para nodos clave, gris claro para nodos secundarios.

**Plantilla típica para Pilar 2:**
```
[Input usuario] → [Prompt estructurado] → [IA] → [Output limpio] → [Acción negocio]
```

### 3. Iconografía

- **Librería:** Feather Icons / Heroicons (line icons, contorno).
- **Grosor:** 2 px.
- **Tamaño:** 64-96 px en carruseles, 48 px en post LinkedIn.
- **Color:** azul estratégico o gris oscuro sobre fondos claros; blanco o amarillo insight sobre azul.

**Iconos recurrentes para Pilar 2:**
- 🤖 (robot / chip) — IA, modelo, agente
- ⚡ (rayo) — velocidad, automatización
- 🎯 (target) — precisión, foco
- 💡 (bombilla) — insight, prompt clave
- ⏱️ (cronómetro) — ahorro de tiempo
- 🔧 (llave / tool) — herramienta
- 📊 (gráfica) — resultado medible

### 4. Números grandes (para pasos numerados)

- Estilo: Space Mono o Montserrat Bold, tamaño 200-280 px.
- Color: amarillo insight `#F39C12` con outline azul estratégico de 4 px (efecto "hueco").
- Posición: esquina superior izquierda del slide, sangra fuera del margen para sensación de continuidad.

### 5. Props físicos en fotografía

**Cuando Alexander aparece en cámara (Reels / portada de carrusel):**

✅ **Usar:**
- Laptop Mac abierto en escritorio (pantalla con UI de Kreoon o ChatGPT visible borrosa).
- Cuaderno + pluma (señal de "pienso en papel antes de IA").
- Café / tinto (cercanía paisa).
- Fondo: oficina con luz natural, librero con libros de negocios visible.

❌ **Evitar:**
- Pantallas con Matrix-style code green (cliché).
- Auriculares gaming RGB.
- Múltiples monitores estilo "trader".
- Hologramas / efectos AR.

---

## Composiciones por formato

### Carrusel IG tutorial (8-10 slides)

```
SLIDE 1 — Portada
┌──────────────────────────────┐
│ [Fondo azul estratégico]     │
│                              │
│ TÍTULO IMPACTANTE            │ ← Montserrat Bold 96px blanco
│ en 2-3 líneas máx            │
│                              │
│ [icono IA grande amarillo]   │
│                              │
│         @alexemprendee       │ ← esquina inferior derecha
└──────────────────────────────┘

SLIDES 2-7 — Pasos
┌──────────────────────────────┐
│ 01     [Título del paso]     │ ← número grande izquierda
│        Subtítulo contextual  │
│                              │
│ [Screenshot con anotaciones] │ ← centrado, sombra suave
│                              │
│ • Tip rápido del paso        │
│                              │
│         02 / 07              │ ← contador slide
└──────────────────────────────┘

SLIDE FINAL — Recap + CTA
┌──────────────────────────────┐
│ RECAP en 3 puntos            │
│ ✅ [punto 1]                 │
│ ✅ [punto 2]                 │
│ ✅ [punto 3]                 │
│                              │
│ ¿Quieres el prompt?          │
│ Comenta "IA" abajo.          │
│                              │
│ @alexemprendee               │
└──────────────────────────────┘
```

### Reel / TikTok demo (60-90s)

```
[Frame 0-3s]      Hook visual: pantalla de la herramienta
                  + texto pantalla: "Esto no debería ser posible"
                  (Montserrat Bold 100px, blanco con sombra)

[Frame 3-15s]     Setup: Alexander explicando, plano medio
                  Texto bajo: "Le pedí a [tool] que..."

[Frame 15-70s]    Screen recording de la demo
                  + texto pantalla cada 5-8s con el paso actual
                  + zoom-in en clicks clave

[Frame 70-85s]    Output final con resaltado amarillo
                  Texto pantalla: "Lo hizo en X minutos"

[Frame 85-90s]    CTA suave + handle @alexemprendee
```

### Post estático aforismo (LinkedIn / IG quote)

```
┌──────────────────────────────┐
│                              │
│   "La IA no te va a          │
│    reemplazar.               │
│    Pero alguien              │
│    que use IA sí."           │ ← Montserrat Bold 72px
│                              │   azul estratégico sobre blanco
│   — Alexander Cast           │ ← Inter Medium 28px gris oscuro
│                              │
│   @alexemprendee             │
└──────────────────────────────┘
```

Espacios en blanco generosos (mínimo 80 px de margen). Sin elementos decorativos.

---

## Color grading / post-producción de video

### Para Reels y demos

- **Tono general:** desaturado 15-20% (NO blanco quemado, NO azul saturado).
- **Temperatura:** ligeramente cálida (+200 K) para que la pantalla técnica no se sienta fría.
- **Contraste:** medio-alto, sombras profundas pero sin negros aplastados.
- **Highlights:** controlados — la pantalla del Mac no debe quemar.

### Pantallas / screen recordings

- Grabar en 4K, exportar en 1080p para evitar artefactos al hacer zoom.
- Cursor visible y suavizado (60 fps mínimo).
- Si se cubre datos sensibles: blur gaussiano, nunca cuadros negros sólidos.
- Velocidad: 1.5x cuando hay esperas de IA generando, regresar a 1x para el reveal.

---

## Brief tipo para editora — Pilar 2

```
PROYECTO: [Nombre del post]
PILAR: 2 — IA aplicada / Kreoon
FORMATO: [Carrusel / Reel / Quote / Screen-recording]
━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 PALETA
- Primario: Azul Estratégico #2B4C7E
- Acento: Amarillo Insight #F39C12
- Fondos: Blanco #FFFFFF / Gris Claro #ECF0F1
- (NO usar naranja energía ni rojo live — son del Pilar 3)

🅰️ TIPOGRAFÍA
- Títulos: Montserrat Bold
- Cuerpo: Inter Regular/Medium
- Datos/Prompts: Space Mono

📐 ELEMENTOS
- Screenshot anotado: [URL del recurso]
- Iconografía: line icons (Feather/Heroicons), 2px
- Diagrama de flujo: máximo 5 nodos
- Números de paso: estilo "hueco" amarillo + outline azul

✋ PROHIBIDO
- Renders 3D / hologramas
- Matrix code verde
- Más de 10 palabras por frame en Reel
- Texto sobre screenshot sin caja de fondo

🎬 RITMO (si aplica video)
- Demo: cuts cada 3-5s
- Tutorial: cuts cada 6-10s
- Captions integradas siempre (90% mira sin sonido)

🔗 BRANDING
- @alexemprendee en esquina inferior derecha
- Logo Kreoon solo en slide final si aplica (sutil, no más del 8% de área)
```

---

## Mood board de referencia

**Inspiración directa:**
- Riley Brown: ritmo de demo + reveal (replicar ritmo, NO estética californiana).
- Matt Wolfe: thumbnails YouTube limpios con screenshots anotados.
- Allie Miller: posts LinkedIn quote-style con espacios generosos.
- Cómousarapps: tutoriales paso a paso con números grandes.
- Pieter Levels: estética minimalista de hilos en X (texto puro, screenshots cuando aporta).

**Inspiración a NO copiar:**
- DotCSV (estética YouTube tradicional, demasiado estudio fijo).
- Bruno.ia1 (mucha decoración naranja/rojo que choca con paleta del pilar).

---

## Checklist pre-aprobación visual Pilar 2

- [ ] Paleta correcta (azul + amarillo + blanco/gris). Sin naranja/rojo del Pilar 3.
- [ ] Tipografía Montserrat / Inter / Space Mono.
- [ ] Screenshots con anotaciones limpias (flechas amarillas, sombra suave).
- [ ] Sin elementos prohibidos (matrix, holos, RGB).
- [ ] Texto legible en móvil pequeño (test en 360 px de ancho).
- [ ] Branding @alexemprendee presente.
- [ ] Logo Kreoon solo si el contenido lo justifica (slide final, máximo 8% de área).
- [ ] Espacios en blanco generosos.
- [ ] Iconografía line, no fill, grosor 2 px.
- [ ] Color grading desaturado 15-20%.

---

## Próximos pasos

1. Crear plantillas Figma con esta paleta + tipografías para entregar a la editora.
2. Construir biblioteca de iconos line ya en colores del pilar.
3. Generar 3 mood boards específicos (tutorial, demo, aforismo) en `db/visual-director/moodboards/`.
4. Cada brief de post pasa por este documento antes de entregarse.
