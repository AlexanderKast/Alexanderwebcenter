# Playbook Visual Director — Reglas Transversales

**Para usar con:** los 4 archivos `pilar-N-visual.md` (específicos por pilar).
**Base:** extiende `agents/visual-director.md` con reglas observadas en los 50 referentes.

---

## Principios universales (aplican a TODO contenido Alexander Cast)

### 1. La cara de Alexander en cámara cuando sea posible
- **Talking head es el formato más confiable** para creators no-celebridad. Daniel Habif lo hace, Hormozi lo hace, Ramiro Cubria lo hace.
- Plano: medium close-up (de pecho a cabeza), eye-level, mirada a cámara.
- Distancia recomendada: 1-1.5m del lente con 35mm o 50mm equivalente.

### 2. Iluminación natural > ring light barato
- **Si hay ventana, ventana.** Ángulo 45° lateral, no frontal directo.
- Si no hay ventana: 1 softbox principal + 1 fill light suave.
- **Evitar:** ring light de YouTuber junior (deja "ojos de muñeca" reflejo circular). Si se usa, suavizar con difusor.

### 3. Audio > Video (no negociable)
- Lavalier o shotgun mic. NUNCA mic de cámara.
- Sin audio claro, ningún visual la salva. Daniel Habif lo cuida obsesivamente.

### 4. Branding sutil, no estridente
- @alexemprendee en esquina inferior derecha, opacidad 60-70%, fuente pequeña.
- NO watermarks gigantes. NO marcos elaborados.

### 5. Texto en pantalla siempre (90% de IG/TikTok ve sin sonido)
- Tamaño: ocupa ~⅓ de la altura del frame en momento clave.
- Tipografía: **Montserrat Bold** o **Poppins Bold** (como agents/visual-director.md).
- Contraste: blanco con sombra negra suave, o negro con borde blanco. Nunca sin contraste.
- Máximo 7-10 palabras por frame.

### 6. Captions automáticas activadas, pero corregidas
- LinkedIn y YouTube exigen subtítulos accesibles.
- Captions automáticas de IG/TikTok funcionan pero corregir errores ortográficos en español paisa (modismos suelen fallar).

---

## Paleta cross-pilar (heredada de visual-director.md)

| Pilar | Color primario | Color secundario | Acento |
|---|---|---|---|
| 1 — Mentalidad/Fe | Verde Crecimiento `#27AE60` + tonos tierra cálidos | Beige claro | Amarillo Insight `#F39C12` |
| 2 — IA aplicada | Azul Estratégico `#2B4C7E` + blanco | Gris claro `#ECF0F1` | Amarillo Insight `#F39C12` |
| 3 — Live Shopping | Naranja Energía `#E67E22` + Rojo LIVE `#FF0000` | Negro/fondo oscuro | Amarillo + blanco alto contraste |
| 4 — Contenido | Mix primarios (variable según tema) | Gris oscuro `#34495E` | Amarillo Insight para stats |

**Regla:** Cada post elige UN pilar (no mezclar paletas). Mantiene coherencia y reconocimiento de marca al hacer scroll.

---

## Formatos visuales y dimensiones (specs Alexander Cast)

| Formato | Plataforma | Aspect ratio | Px | Notas |
|---|---|---|---|---|
| Reel / TikTok | IG, TikTok, YT Short | 9:16 | 1080x1920 | Texto centrado, evitar bordes superiores e inferiores (UI corta) |
| Carrusel | IG | 4:5 | 1080x1350 | 8-10 slides, mantener jerarquía visual entre slides |
| Post imagen | IG | 4:5 | 1080x1350 | Texto centrado o regla de tercios |
| LinkedIn post visual | LinkedIn | 1.91:1 | 1200x627 | Conservador, profesional |
| YouTube long thumbnail | YouTube | 16:9 | 1280x720 | Cara de Alexander grande + 3 palabras max |
| Twitter/X header | X | 3:1 | 1500x500 | Branding mínimo |

---

## Tipografía (cross-pilar)

| Uso | Fuente | Peso | Tamaño relativo |
|---|---|---|---|
| Hooks en pantalla | Montserrat / Poppins | Bold | 80-120pt en frame 1080x1920 |
| Subtítulos / captions | Inter / Open Sans | Regular | 36-48pt |
| Stats / cifras | Roboto Mono / Space Mono | Bold | 100-150pt para números grandes |
| Quotes (Pilar 1) | Playfair Display | Italic | 60-80pt |
| Branding @alexemprendee | Inter | Regular | 24-32pt opacidad 60% |

---

## Composición — reglas universales

### Regla 1: Regla de tercios para sujetos
Alexander en cámara: ojos en el tercio superior, no centrado.

### Regla 2: Espacio negativo para texto
Mínimo 30% del frame es espacio en blanco/neutro para que el texto en pantalla respire.

### Regla 3: Jerarquía visual clara
1 elemento dominante por frame. NO competencia entre 2 textos grandes.

### Regla 4: Color "fuera de paleta" = error
Si un color no está en la paleta del pilar, no aparece. Excepción: producto físico (live shopping) mantiene su color natural.

### Regla 5: Coherencia entre slides de carrusel
- Misma paleta los 8-10 slides.
- Misma tipografía.
- Misma posición del branding.
- Variación solo en contenido y composición — NUNCA en estilo.

---

## Elementos prohibidos (anti-patterns universales)

| Elemento | Por qué prohibido |
|---|---|
| Texto neón / arcoiris | Genérico, gritón, look "creator junior" |
| Memes randoms sin propósito | Diluye mensaje |
| Logos animados al inicio | Pierdes 0-3s críticos del hook |
| Música épica genérica (Hans Zimmer-style) | Manipulativa, no calza con tono Alexander |
| Transiciones giratorias 3D | Look 2014, distrae |
| Watermarks gigantes | Anti-marca |
| Stock photos obvios | Pierdes autenticidad |
| Filtros saturación extrema | Look TikTok shop barato |
| Caps lock en TODO | Tono predicador (anti-voz Alexander) |
| Más de 3 emojis por frame | Ruido visual |

---

## Workflow Director → Editor (recomendado)

```
1. ALEXANDER → grabar voz/video crudo (ideally 1-shot, talking head)
2. CLAUDE (alexander-adapter) → revisa transcript, sugiere edits
3. VISUAL-DIRECTOR (skill) → genera brief con: pilar, paleta, plano, texto en pantalla, B-roll sugerido
4. EDITOR (humano o Claude+CapCut) → ejecuta brief
5. ALEXANDER → review final + aprobación
6. PUBLICACIÓN
```

**Brief estándar para editor (formato):**

```
PROYECTO: [Título corto del post]
PILAR: [1|2|3|4]
FORMATO: [Reel | Carrusel | Imagen | YT Short]
DURACIÓN OBJETIVO: [Xs]
HOOK: "[texto literal del hook]"
ESTRUCTURA: [referencia a db/estructuras/pilar-N-estructuras.md]

VISUALES:
- Plano apertura: [descripción]
- Cortes: [descripción de momentos clave]
- B-roll necesario: [lista]
- Texto en pantalla: [literal + timing]

EDICIÓN:
- Ritmo: [rápido | medio | lento]
- Música: [género/BPM]
- Transiciones: [tipos permitidos]
- Color grade: [estilo]

EXPORT:
- Formato final: [.mp4 H264, 30fps]
- Resolución: [1080x1920 | 1080x1350 | etc]
- Subtítulos quemados: [sí | no]
```

---

## Métricas de éxito visual (qué medir)

| Métrica | Objetivo |
|---|---|
| Retención primeros 3s | >70% |
| Retención completa video | >50% |
| Saved/Share rate | >2% (señal de valor visual claro) |
| Comentarios con "qué app/edición usas" | señal de visual destacable |
| Coherencia perfil al scroll | el feed completo se siente del mismo creator |

Si una métrica falla 2 posts seguidos en el mismo pilar, revisar la entrada correspondiente en `db/visual-director/pilar-N-visual.md` y ajustar.
