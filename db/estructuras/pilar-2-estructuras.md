# Estructuras Narrativas — Pilar 2 (IA aplicada / Kreoon)

**Fecha de análisis:** 2026-05-05
**Base:** 12 referentes Tier 1 + scrapeo Riley Brown + patrones documentados.
**Uso:** plantillas de macroestructura para el agente `copywriter` antes de pasar por `alexander-adapter`.

---

## Resumen ejecutivo

Las 6 estructuras dominantes en Pilar 2 dividen el espacio en dos ejes:

- **Eje emocional:** descubrimiento (sorpresa) ↔ tutorial (didáctico).
- **Eje formato:** demo visual (Reel/TikTok) ↔ texto/aforismo (LinkedIn/X/carrusel).

Riley Brown domina el cuadrante "demo + sorpresa". Master Muñoz / Cómousarapps el cuadrante "tutorial + didáctico". Allie Miller el cuadrante "aforismo + insight B2B". Pieter Levels el cuadrante "build-in-public + cifras crudas".

---

## E1 — Demo + Stunned Reaction (Riley Brown)

**Origen:** @rileybrown.ai (5 posts top con +500K views cada uno).
**Formato dominante:** TikTok / Reel 60-120s.
**Compatibilidad Alexander:** 🟡 (suavizar la reacción).

### Esqueleto

```
[0-3s]   Hook visual: pantalla con la herramienta abierta
         + voz: "Mira esto" / "Esto no debería ser posible"
[3-15s]  Setup: explica en 1 frase qué va a hacer
[15-70s] Demo en pantalla: paso 1 → paso 2 → paso 3
         (cuts cada 3-5s, sin transiciones complejas)
[70-90s] Reveal: muestra el output final con reacción
         ("Oh my..", risa contenida, mirada incrédula)
[90s+]   Cierre: "Esto se llama X, link abajo" / pregunta
```

### Plantilla en voz Alexander

```
"Mira esto. Esto no debería ser posible.

Le dije a [herramienta] que [tarea].
Lo hizo en [tiempo].

[demo en pantalla, paso a paso]

A la final, lo que pasó fue [resultado].

Si quieres saber qué herramienta es, te dejo el nombre abajo."
```

### Reglas críticas

- La sorpresa la sostiene la **pantalla**, no la cara. Alexander no actúa sorprendido — narra tranquilo lo que se ve.
- Texto en pantalla refuerza el paso ("Paso 1: pegué mi prompt aquí").
- El "wow" llega solo si el output sorprende objetivamente. Si no, omitir y entregar como tutorial.

### Cuándo usar

- Lanzamiento de feature nueva de Kreoon que se vea bien en pantalla.
- Demo de un workflow IA que reduce tiempo de forma cuantificable.
- Caso real con cliente UGC Colombia donde la IA hizo algo "no obvio".

---

## E2 — Tutorial paso a paso (Master Muñoz / Cómousarapps / Bruno.ia1)

**Formato dominante:** Reel/TikTok 60-90s o YouTube Long 5-12 min.
**Compatibilidad Alexander:** ✅ (calza directo con voz didáctica).

### Esqueleto

```
[0-3s]   Hook problema: "Si tienes un negocio y haces X, gastas Y horas"
[3-10s]  Promesa concreta: "Con IA, esto baja a Z minutos"
[10-15s] Setup: "Solo necesitas [herramienta 1] + [herramienta 2]"
[15-50s] Pasos numerados (3-5 pasos, cada uno 5-10s)
         Texto en pantalla: "PASO 1", "PASO 2"...
[50-70s] Resultado: muestra el output final
[70-85s] Aterrizaje: "Funciona para [tipo de negocio LATAM]"
[85s+]   CTA suave: "Te dejo el prompt abajo" / "¿Lo aplicas?"
```

### Plantilla en voz Alexander

```
"Si tienes un negocio y todavía haces [tarea] manual,
estás dejando plata sobre la mesa.

Te muestro cómo lo hago yo en [tiempo]:

PASO 1: [acción concreta + screenshot]
PASO 2: [acción concreta + screenshot]
PASO 3: [acción concreta + screenshot]

A la final, lo que tomaba [tiempo viejo] ahora toma [tiempo nuevo].

¿Quieres el prompt? Comenta 'IA' y te lo paso."
```

### Reglas críticas

- Numerar los pasos en pantalla (no solo en voz).
- Cada paso debe ser **accionable hoy** — no "configura tu API" sin mostrar cómo.
- Mencionar herramienta gratuita primero, paga después (regla 80/20 Kreoon).

### Cuándo usar

- Cualquier post de "cómo hacer X con IA" para audiencia LATAM no-técnica.
- Lanzamientos de Kreoon donde se quiera mostrar workflow real.
- Carruseles educativos en IG.

---

## E3 — Comparativa antes/después (Bruno.ia1 / Cómousarapps)

**Formato dominante:** Reel/TikTok split-screen, carrusel IG.
**Compatibilidad Alexander:** ✅.

### Esqueleto

```
[0-3s]   Hook contraste: "Antes me tomaba 10 horas. Ahora 30 minutos."
[3-15s]  Lado A: muestra el proceso viejo (manual, lento)
         Texto pantalla: "ANTES: 10 horas, 5 errores"
[15-45s] Lado B: muestra el proceso nuevo (con IA)
         Texto pantalla: "DESPUÉS: 30 min, 0 errores"
[45-60s] Cierre: "La diferencia no es la IA. Es el sistema."
```

### Plantilla en voz Alexander

```
"Antes: 10 horas haciendo [tarea] a mano, con errores, frustrado.

Ahora: 30 minutos, con IA, mejor calidad.

[Split screen mostrando ambos procesos]

¿La diferencia? No es solo la IA.
Es tener el sistema correcto.

Mira, en UGC Colombia probamos esto en [contexto]. Funcionó."
```

### Reglas críticas

- Las cifras del antes/después deben ser **reales y verificables**.
- Mostrar siempre el lado A primero (la audiencia se identifica con el dolor).
- Cerrar con experiencia personal (UGC Colombia, Kreoon, SICOMMER) para autoridad.

### Cuándo usar

- Casos de implementación real con clientes.
- Posts de testimonio de Kreoon (con permiso).
- Posicionamiento contra competencia ("ChatGPT vs. Kreoon" en términos de output).

---

## E4 — Lista numerada + tool stack (Greg Isenberg / Matt Wolfe)

**Formato dominante:** Carrusel IG, hilo X, YouTube Long.
**Compatibilidad Alexander:** ✅ (con calibración de cantidad).

### Esqueleto

```
SLIDE/STEP 1: Hook lista — "5 herramientas de IA para [tarea]"
SLIDE 2-6:    Una herramienta por slide
              Estructura por slide:
                - Nombre + logo
                - Para qué sirve (1 frase)
                - Costo (gratis / pago)
                - Mi nivel de uso (diario / semanal / probé)
SLIDE 7:      Stack recomendado (combinación)
SLIDE 8:      Cierre + CTA
```

### Plantilla en voz Alexander

```
SLIDE 1:
"5 herramientas de IA que uso todas las semanas.
La #4 es la que casi nadie conoce."

SLIDE 2:
"1. [Nombre]
Para: [tarea]
Costo: [gratis/precio]
La uso para: [caso específico mío]"

[...repetir 2-6...]

SLIDE 7:
"Mi stack actual: [Tool A] + [Tool B] + [Tool C].
Lo demás es opcional."

SLIDE 8:
"¿Cuál usas tú? Cuéntame en comentarios.
Si quieres el detalle de cómo combino las 5,
te dejo un post largo abajo."
```

### Reglas críticas

- Máximo 5 herramientas (Greg Isenberg usa 10, pero Alexander baja para mantener especificidad LATAM).
- Cada herramienta debe tener un **caso real propio**, no ranking abstracto.
- Mencionar Kreoon máximo 1 vez en el stack (regla 80/20).

### Cuándo usar

- Carruseles de "stack" recurrentes (mensual / bimensual).
- Hilos en X dirigidos a indie hackers / emprendedores LATAM.
- Posicionar Kreoon dentro de un ecosistema, no como solución única.

---

## E5 — Aforismo IA (Allie Miller / Hormozi)

**Formato dominante:** Post estático IG, LinkedIn, X.
**Compatibilidad Alexander:** ✅ (calza con la marca paisa reflexiva).

### Esqueleto

```
LÍNEA 1: Aforismo declarativo (1 oración, contrarian)
LÍNEA 2: Pausa visual (espacio en blanco)
LÍNEA 3: Explicación corta (2-3 oraciones)
LÍNEA 4: Aterrizaje práctico (1 ejemplo)
LÍNEA 5: Cierre reflexivo o pregunta
```

### Plantilla en voz Alexander

```
"La IA no te va a reemplazar.
Pero alguien que use IA sí.

Lo digo sin drama.

En UGC Colombia ya pasamos de 10 horas a 2 horas
por estrategia con IA bien implementada.

No es magia. Es sistema.

¿Tú qué estás esperando para empezar?"
```

### Reglas críticas

- El aforismo debe **funcionar solo** (sin contexto adicional).
- Máximo 12 palabras en la línea 1.
- Aterrizaje obligatorio — sin él, suena a Hormozi vacío.
- Pregunta reflexiva, nunca CTA agresivo.

### Cuándo usar

- Post quote-style en IG (alta retención de saves).
- LinkedIn (formato dominante de Allie Miller).
- Cierre de carruseles largos (slide final).

---

## E6 — Build-in-public (Pieter Levels / Linus Ekenstam)

**Formato dominante:** Hilo X, post LinkedIn, carrusel IG.
**Compatibilidad Alexander:** ✅ (con calibración de honestidad — no exagerar cifras).

### Esqueleto

```
HOOK:    Cifra cruda + tiempo + método
         "$1.200 USD facturados hoy con [herramienta] en 4 horas"
PARTE 1: Contexto: qué problema resolví
PARTE 2: Stack: qué herramientas usé (con costos)
PARTE 3: Proceso: cómo lo armé (paso a paso resumido)
PARTE 4: Honestidad: qué falló, qué tuve que rehacer
PARTE 5: Aprendizaje: qué replicaría / qué no
CIERRE:  "Si quieres que comparta el detalle, dime"
```

### Plantilla en voz Alexander

```
"Hoy facturé $1.200 USD con una app que armé en una tarde con IA.

Te cuento sin filtro:

CONTEXTO: tenía un problema real en UGC Colombia
con [tarea]. Decidí probar a hacerlo yo.

STACK:
- [Tool 1]: $0/mes
- [Tool 2]: $20/mes
- [Tool 3]: $0 (free tier)

PROCESO:
1. [Paso resumido]
2. [Paso resumido]
3. [Paso resumido]

LO QUE NO FUNCIONÓ:
La primera versión se cayó dos veces. Tuve que cambiar
[componente] por [alternativa].

LO QUE APRENDÍ:
La IA no construye el negocio.
Construye más rápido lo que tú ya tienes claro.

¿Quieres que comparta el detalle? Comenta 'detalle' y te
mando el desglose."
```

### Reglas críticas

- **Honestidad obligatoria** — incluir lo que falló, no solo el flex.
- Cifras en USD si la audiencia es global, en COP/MXN si es LATAM.
- Nunca inflar resultados — la audiencia paisa detecta el "gurú falso" rápido.
- Permite mencionar Kreoon **dentro** del stack, no como producto principal.

### Cuándo usar

- Posts mensuales de transparencia financiera (estilo Pieter Levels).
- Casos de implementación real de Kreoon.
- Hilos en X para construir autoridad técnica.

---

## Tabla de selección rápida

| Estructura | Formato ideal | Pilar emocional | Alexander compat | Cuándo elegirla |
|---|---|---|---|---|
| E1 — Demo + reaction | Reel/TikTok | Sorpresa | 🟡 | Lanzamiento feature visual |
| E2 — Tutorial pasos | Reel/Long | Didáctico | ✅ | Educación LATAM |
| E3 — Antes/después | Split / Carrusel | Aspiracional | ✅ | Caso real con cifras |
| E4 — Lista + stack | Carrusel / Hilo | Curiosidad | ✅ | Posicionar ecosistema |
| E5 — Aforismo | Quote / LinkedIn | Reflexivo | ✅ | Saves + autoridad |
| E6 — Build-in-public | Hilo / Carrusel | Honestidad | ✅ | Transparencia + autoridad |

---

## Anti-patterns a evitar

- ❌ Demo sin output verificable (Riley Brown puede sostenerlo con su persona; Alexander no — perdería credibilidad).
- ❌ Tutorial con 8+ pasos (la atención muere — máximo 5).
- ❌ Aforismo sin aterrizaje (suena a Hormozi vacío, no a Alexander).
- ❌ Build-in-public solo con flex y sin fallos (la audiencia paisa lo detecta).
- ❌ Lista con +5 herramientas (saturación, mejor 5 bien explicadas).
- ❌ Comparativas con cifras inventadas (rompe el principio de honestización).

---

## Próximos pasos

1. Combinar estas estructuras con `db/hooks/pilar-2-hooks.json` para generar posts.
2. Cada output pasa por `agents/alexander-adapter` antes de entregarse.
3. Medir performance por estructura tras 4 semanas y ajustar la tabla de selección.
