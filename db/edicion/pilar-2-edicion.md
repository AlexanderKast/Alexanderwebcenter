# Edición / Post-producción — Pilar 2 (IA aplicada / Kreoon)

**Fecha:** 2026-05-05
**Base:** análisis de Riley Brown (TikTok), Matt Wolfe (YouTube), Master Muñoz (Reels), Cómousarapps (Reels), DotCSV (mixto), Bruno.ia1, Aldo Bartra (YouTube long), Greg Isenberg (X video).
**Objetivo:** reglas concretas de ritmo, captions, música, transiciones y duración para cualquier video del pilar IA aplicada.

---

## Resumen ejecutivo

| Variable | Demos rápidos | Tutoriales pausados |
|---|---|---|
| Cuts | 1 cada 3 s | 1 cada 8 s |
| Velocidad screen-rec | 1.5x en esperas, 1x en reveal | 1x estándar |
| Música | Tech / lo-fi 70-90 BPM | Lo-fi 60-75 BPM, casi imperceptible |
| Captions | Obligatorias, sincronizadas | Obligatorias, animadas |
| Duración óptima | TikTok 60-90s · Short 30-45s | Reel IG 60-120s · YT Long 5-15 min |
| Transición | Cut directo + zoom-in en click clave | Cut + fade técnico ocasional |

---

## Ritmo y estructura de cuts

### Demos visuales (E1 — Demo + Stunned reaction)

- **Cut promedio:** 1 cada 3 segundos.
- **Estructura:**
  - 0-3s: hook visual + voz (1 cut).
  - 3-15s: setup en cámara (2-3 cuts cortos).
  - 15-70s: demo en pantalla (cut cada 3-5s, sincronizado con cada acción).
  - 70-90s: reveal del output con sostenida de 4-5s (sin cut, deja respirar).
- **Regla clave:** el reveal final NO se corta. El "wow" necesita ese segundo extra de pantalla quieta.

### Tutoriales paso a paso (E2)

- **Cut promedio:** 1 cada 8 segundos.
- **Estructura:**
  - 0-3s: hook problema (1 cut, plano medio).
  - 3-15s: promesa + setup (2 cuts, cámara + insert de pantalla).
  - 15-70s: 3-5 pasos numerados, cada paso 8-12s con 1-2 cuts internos.
  - 70-85s: cierre con resultado.
- **Regla clave:** cada paso entra con un **fade técnico** (0.3s) o un **slide-in del número** del paso. No cortes secos entre pasos.

### Aforismos / quotes en video (E5)

- **Cut promedio:** 1 cada 5-7 segundos.
- **Duración total:** 15-30s.
- **Estructura:**
  - 0-3s: aforismo en pantalla + voz Alexander.
  - 3-15s: explicación corta a cámara (1-2 cuts).
  - 15-25s: aterrizaje práctico.
  - 25-30s: cierre con CTA suave.

### Build-in-public (E6) en formato video

- Más cercano al tutorial. Cut cada 7-10s.
- Insertos de pantalla con cifras / dashboard / código.
- Duración: 60-180s en TikTok / Reel; 5-12 min en YouTube Long.

---

## Screen recording

### Configuración de captura

- **Resolución:** 4K (3840×2160) → exportar en 1080p para Reel/TikTok / 1440p para YouTube.
- **Frame rate:** 60 fps (cursor suave + panel de movimientos).
- **Cursor:** visible siempre, agrandado 1.3x si la herramienta lo permite.
- **Audio del sistema:** silenciado (notificaciones), narración por separado en voiceover.

### Tratamiento del screen recording en post

- **Velocidad:**
  - Esperas de la IA generando: 1.5x o 2x (con timer visible "0.5x speed" en pantalla para honestidad).
  - Click clave / output: 1x estándar.
  - Reveal final: 1x con +1s de sostenida.
- **Zoom-in:** sobre clicks clave o áreas pequeñas. Easing suave (ease-in-out 0.5s), nunca zoom brusco.
- **Mascarillas:** si hay datos sensibles, blur gaussiano (radio 30-40 px), no cuadros negros.
- **Color grading:** desaturado 10-15% para que la pantalla no compita con la cara de Alexander.

### Buenas prácticas de UX en pantalla

- Cerrar todas las pestañas que no aporten al demo.
- Pantalla en modo "Do Not Disturb" (sin notificaciones).
- Cursor centrado al inicio del recording (evitar saltos visuales).
- Si se escribe un prompt: typing automatizado o re-grabar para evitar errores de tecleo.

---

## Voiceover

### Captura

- Mic: condensador (Shure SM7B / similar) con pop filter.
- Tono: tranquilo paisa, ritmo pausado (130-150 palabras/min, no más).
- **No actuar emoción** que la pantalla no sostenga. Si el output no impresiona, narrar plano.

### Mezcla

- Nivel: -3 dB a -6 dB picos.
- Compresión suave (ratio 3:1, threshold -18 dB).
- De-esser activado.
- Reverberación: NO. Estudio seco.
- Música siempre 12-15 dB por debajo de la voz.

---

## Captions / Texto en pantalla

**Regla absoluta:** 90% de la audiencia consume sin sonido. Sin captions, no hay video.

### Configuración

- **Fuente:** Montserrat Bold o Poppins SemiBold (consistente con el pilar).
- **Tamaño:**
  - TikTok / Reel (1080×1920): 80-100 px de alto.
  - YouTube Long (1920×1080): 56-72 px.
- **Color:** blanco con outline azul estratégico `#2B4C7E` de 4-6 px, o caja de fondo amarillo insight con texto azul (para resaltar palabra clave).
- **Posición:** centrado vertical, 35-40% desde el bottom (zona segura sin tapar UI de la app).
- **Animación:** word-by-word o frase completa con fade-in 0.15s. Nunca rebotes ni efectos de carrusel.

### Reglas de redacción

- **Máximo 7-10 palabras por frame.** Si la frase es más larga, partirla.
- **Resaltar máximo 1 palabra por frame** (color amarillo o caja).
- **No mayúsculas continuas** salvo en hooks ("MIRA ESTO" puntual permitido).
- **Sincronizar con audio** dentro de ±100 ms.

### Ejemplos

```
Audio: "Le pedí a esta herramienta que me hiciera un análisis de mercado."
Frame 1: "Le pedí a esta herramienta"
Frame 2: "que me hiciera un"
Frame 3: "ANÁLISIS DE MERCADO"   ← amarillo insight
```

---

## Música

### Estilo aprobado

- **Géneros:** tech ambient · lo-fi · electronic minimalista · indie electronic suave.
- **BPM:** 60-90 (lo-fi) para tutoriales pausados; 80-100 (electronic minimal) para demos.
- **Energía:** baja-media. Nunca épica, nunca trap, nunca EDM con drops.

### Reglas de uso

- Música siempre presente pero **subordinada** a la voz (-12 a -15 dB respecto al voiceover).
- Loops largos (30-60s) para evitar repeticiones obvias.
- En el reveal del output (frame 70-90s de un demo): permitir que la música suba 3 dB para crear pequeño punch.
- En aforismos / quotes: silencio musical en la frase clave (1-2s) para dar peso.

### Bibliotecas recomendadas

- Epidemic Sound (categorías: Lo-Fi, Tech & Science).
- Artlist (categorías: Ambient, Corporate Tech).
- YouTube Audio Library para Shorts (filtro "Inspirational" + "Calm").

### Anti-patterns

- ❌ Música épica orquestal (estilo "transformación de vida").
- ❌ Drops EDM antes del reveal.
- ❌ Trap / drill / reggaetón en posts de IA aplicada (rompe el tono Pilar 2).
- ❌ Música con voz cantada (compite con el voiceover).

---

## Transiciones

### Aprobadas

| Transición | Cuándo | Duración |
|---|---|---|
| Cut directo | Default entre planos del mismo escenario | 0 s |
| Fade técnico (cross-dissolve) | Cambio de "modo" (cámara → pantalla) | 0.3-0.5 s |
| Zoom-in suave (ease in-out) | Sobre click clave o reveal | 0.5-1 s |
| Slide-in de número de paso | Entrada a paso nuevo en tutorial | 0.4 s |
| Whip cut | Excepcional, máximo 1 por video, en cambio de tema fuerte | 0.2 s |

### Prohibidas

- ❌ Giros 3D, cubos, page-turns.
- ❌ Glitch effects (sí encajan en estética de Riley Brown, pero no en la nuestra).
- ❌ Speed ramps exagerados.
- ❌ Flashes blancos / strobes.
- ❌ Transiciones con sonidos "swoosh" (compiten con voz).

---

## Texto en pantalla — guía operativa

### Capas obligatorias en cada video

1. **Hook caption** (0-3s): el hook escrito tal cual lo dice la voz, máximo 8 palabras.
2. **Captions sincronizadas** (toda la duración).
3. **Title cards** (en tutoriales): "PASO 01", "PASO 02"...
4. **Branding** (último 1-2s): @alexemprendee.

### Capas opcionales

- **Cifra destacada** (cuando aparece un número clave): caja azul estratégico con número en Space Mono blanco.
- **Tag de herramienta** (cuando se nombra una tool): logo + nombre en esquina superior derecha, sale a los 3-5s.
- **Subtítulo de paso**: una frase corta bajo el número del paso explicando qué se hace.

### Anti-patterns de texto

- ❌ Más de 2 capas de texto simultáneas (saturación).
- ❌ Texto sobre el screenshot sin caja de fondo (ilegible).
- ❌ Tipografías diferentes a las del pilar (Montserrat / Inter / Space Mono).
- ❌ Animaciones de texto barrocas (rebotes, rotaciones).

---

## Duración óptima por plataforma

| Plataforma | Demo (E1) | Tutorial (E2) | Aforismo (E5) | Build-in-public (E6) |
|---|---|---|---|---|
| TikTok | 60-90 s | 60-90 s | 15-30 s | 60-120 s |
| Reel IG | 60-90 s | 60-120 s | 15-30 s | 60-90 s |
| YouTube Short | 30-45 s | 45-60 s | 15-30 s | 45-60 s |
| YouTube Long | — | 5-15 min | — | 8-20 min |
| LinkedIn video | 30-60 s | 60-90 s | 15-30 s | 60-90 s |

### Notas por plataforma

- **TikTok:** primeros 1-2s deben tener movimiento — el algoritmo penaliza el plano fijo de apertura.
- **Reel IG:** legibilidad es prioridad — captions más grandes que en TikTok.
- **YouTube Short:** loop limpio (último frame conecta con el primero) sube retención.
- **YouTube Long:** chapters obligatorios cada 60-90s con título corto (ej. "Paso 1 — Estructura del prompt").
- **LinkedIn:** primer frame debe funcionar como thumbnail estático (LinkedIn lo usa por defecto).

---

## Pipeline de producción sugerido

```
1. Guion de voz (con timing) → revisado por alexander-adapter
2. Brief visual → revisado contra db/visual-director/pilar-2-visual.md
3. Grabación voz (estudio seco)
4. Grabación cámara (plano medio + insertos)
5. Screen recording (4K, 60fps)
6. Edit ensamble (sincroniza voz + cámara + pantalla)
7. Captions automáticas (Descript / CapCut) + revisión manual
8. Color grading (desaturado 10-15%, calidez +200K)
9. Música + mezcla (-12 a -15 dB bajo la voz)
10. Master final (peak -1 dB, LUFS -14 para IG, -16 para YT)
11. QA: ver en móvil 360px ancho con sonido apagado
12. Export: 1080p H.264 (Reel/TikTok), 1440p (YT Short), 4K (YT Long)
```

---

## Checklist pre-publicación

- [ ] Captions presentes en 100% del video.
- [ ] Hook caption en frame 0-3s.
- [ ] Cut promedio respeta el ritmo del tipo (3s demo / 8s tutorial).
- [ ] Música 12-15 dB bajo la voz, sin cortes bruscos.
- [ ] Sin transiciones prohibidas (3D, glitch, swoosh).
- [ ] Color grading desaturado 10-15%.
- [ ] Datos sensibles en pantalla blureados (no cuadros negros).
- [ ] Branding @alexemprendee en último frame.
- [ ] Loop limpio (Shorts).
- [ ] Test en móvil 360px sin sonido — ¿se entiende? Si no, rehacer captions.
- [ ] Duración dentro del rango óptimo de la plataforma.

---

## Tabla de selección rápida

| Si el contenido es... | Ritmo | Música | Duración |
|---|---|---|---|
| Demo de tool sorprendente | 1 cut/3s + reveal sostenido | Electronic min 80-100 BPM | 60-90s |
| Tutorial 3-5 pasos | 1 cut/8s + slide-in pasos | Lo-fi 60-75 BPM | 60-120s |
| Aforismo / quote | 1 cut/5-7s + silencio en frase clave | Lo-fi muy bajo | 15-30s |
| Build-in-public con cifras | 1 cut/7-10s + insertos pantalla | Tech ambient 70-85 BPM | 60-180s |
| Comparativa antes/después | 1 cut/5s + split-screen | Electronic min 80-100 BPM | 30-60s |
| Lista 5 herramientas | 1 cut/10s por tool + fade técnico | Lo-fi 70-80 BPM | 60-120s |

---

## Próximos pasos

1. Crear preset de exportación en Premiere/CapCut/Final Cut con estas specs.
2. Armar biblioteca de música pre-aprobada (10-15 pistas) en `db/edicion/biblioteca-musica/`.
3. Plantillas de captions con tipografía y colores listos para CapCut / Descript.
4. Calibrar con la editora una primera ronda de 3 videos y ajustar la tabla.
