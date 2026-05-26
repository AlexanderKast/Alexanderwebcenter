# Humanizer — Guiones de Video Alexander Cast

**Fuente:** Adaptado de `content-humanizer` (Alireza Rezvani) + framework H.U.M.A.N.O
**Aplicación:** Exclusivo para guiones de video (Reels, TikTok, Shorts) de Alexander Cast
**No usar para:** textos escritos de posts — eso lo maneja `alexander-voice-adapter.md`

---

## Por qué los guiones necesitan humanizarse

Un guión de IA suena bien al leerlo. Suena a robot al grabarlo.

El problema no es el contenido — es el **ritmo**. La IA produce frases perfectamente balanceadas, transiciones limpias y estructuras simétricas que ningún colombiano habla en conversación real. Alexander no habla en tesis. Habla en pensamiento en voz alta.

**La prueba:** leer el guión en voz alta. Si puedes leerlo sin tropiezos, sin vacilaciones naturales, sin necesitar respirar — el guión está demasiado liso. Necesita fricción.

---

## Las 3 fases

### FASE 1 — Detectar: ¿Suena a guión?

Buscar estas señales en el texto:

**Señales rojas (🔴 reescribir):**
- Listas perfectamente paralelas: "Primero... Segundo... Tercero..." — estructura demasiado simétrica
- Transiciones de revista: "En ese sentido...", "Por lo tanto...", "De esta manera..."
- Conclusiones que resumen lo que ya se dijo: "Como vimos hoy..."
- Oraciones de la misma longitud una tras otra — todo se lee en el mismo tono
- Frases que empiezan con el sujeto siempre: "La IA hace X. La IA permite Y. La IA cambia Z."
- Promesas genéricas: "esto te va a cambiar el negocio", "el impacto es enorme"
- Autoridad vaga: "hay estudios", "los expertos dicen", "muchas empresas"

**Señales amarillas (🟡 ajustar):**
- Em-dash en más de 2 líneas del mismo guión
- Cierre que concluye en vez de aterrizar
- CTA que suena a anuncio: "¡No olvides comentar!" — Alexander no habla así
- Falta de pausa real después de una afirmación fuerte

**Señales verdes (✅ dejar):**
- Frases cortas que golpean solas
- Menciones de herramientas reales por nombre (Claude, n8n, Jarvis, Apify)
- Momentos de duda genuina
- Referencias a UGC Colombia, KREOON, LiveCake con contexto real

---

### FASE 2 — Humanizar: Romper la simetría

**Regla central:** un pensamiento hablado nunca es perfecto.

#### Técnica 1 — Asimetría de ritmo
Mezclar oraciones largas con golpes cortos. No alternar predeciblemente.

```
❌ IA:
"La IA analiza los datos de tu negocio. La IA detecta los problemas. La IA propone soluciones."

✅ Humanizado:
"La IA analiza los datos. Y ahí fue donde me sorprendí, parce."
[pausa]
"Encontró algo que yo llevaba meses ignorando."
```

#### Técnica 2 — Fricción natural
Alexander duda, corrige, o añade matiz. Eso es humano.

| Señal de guión | Versión hablada |
|---|---|
| "Es importante implementar IA" | "Mira, no sé si es para todo el mundo, pero a mí me cambió cómo trabajo." |
| "El resultado fue significativo" | "Y la verdad... fue mejor de lo que esperaba." |
| "Primero debes hacer X, luego Y" | "Lo primero que hice fue X. Aunque no sabía si iba a funcionar." |
| "Como podemos observar" | "O sea, lo que uno ve ahí es..." |
| "En conclusión" | [no usar — reemplazar con el remate emocional directo] |

#### Técnica 3 — Especificidad real
Reemplazar vaguedad con lo que Alexander realmente usa y vive.

```
❌ Genérico: "Uso herramientas de IA para automatizar mis procesos."
✅ Específico: "Tengo n8n corriendo en mi servidor. Se conecta con Jarvis, que es mi agente en WhatsApp."
```

```
❌ Genérico: "Mi agencia ha crecido gracias a la IA."
✅ Específico: "En UGC Colombia automatizamos el seguimiento de clientes. Cada brief, cada entrega."
```

#### Técnica 4 — El pensamiento interrumpido
En video, Alexander puede dejar algo sin completar. Crea tensión natural.

```
"Lo que encontramos fue..."
[pausa — mirada al lente]
"Mejor te lo muestro."
```

```
"No es que sea complicado. Es que..."
[pausa]
"Nadie te lo explica bien."
```

#### Técnica 5 — Voz paisa sin saturar
Usar expresiones de `voice-dna.md` en los momentos correctos, no en todos:

- Apertura suave: "Mira, te cuento algo..." / "Parce, esto es importante."
- Transición: "La cosa es así..." / "Y lo que pasa es que..."
- Remate: "A la final, lo que importa es..." / "Eso es todo."
- Cierre: "Nos vemos." + gesto todo bien ← siempre este, nunca "Dale pues"

No más de 2 expresiones paisas por guión. Si hay más, satura.

---

### FASE 3 — Voz Alexander: el check final

Antes de dar el guión por listo, responder estas preguntas:

**¿Suena como Alexander lo diría en una conversación real?**
- [ ] Si lo grabara ahora mismo, ¿sonaría natural o tendría que practicarlo mucho?
- [ ] ¿Hay al menos un momento donde dice algo que otros no dirían?
- [ ] ¿El cierre aterriza o simplemente termina?
- [ ] ¿Menciona algo concreto de su vida real (herramienta, negocio, momento)?
- [ ] ¿Hay al menos una pausa escrita donde el silencio habla?

**Perfil de voz de Alexander (para inyección):**
- Tipo: **Thoughtful Peer** — comparte el proceso, no solo la conclusión
- Ritmo: largo-corto-corto / largo-largo-corto — no uniforme
- Formalidad: contracciones naturales, coloquial elegante, jamás vulgar
- Humor: sutil, irónico, nunca forzado
- Relación con el lector: par — "lo estoy viviendo igual que tú"
- Lo que evita: hype, exclamaciones, certezas absolutas, predicar

---

## Señales de IA específicas en guiones de Alexander

Estas aparecen frecuentemente en los guiones generados. Detectarlas siempre:

| Señal encontrada | Problema | Fix |
|---|---|---|
| "Uno... Dos... Tres... Cuatro... Cinco..." (lista perfecta) | Demasiado estructurado — nadie habla así | Romper el orden, agregar "bueno, y otro que uso mucho es..." |
| "Sin el hype" en el hook | Correcto como idea, pero puede sonar a frase hecha | Reemplazar con el dato o la actitud — mostrar, no decir |
| "Esto es lo que quedó" | Cierre de resumen — suena a lista de compras | Reemplazar con impresión real: "y a mí con eso me alcanza." |
| Em-dashes en cada beat | Ritmo mecánico | Convertir a punto + nueva frase |
| "La cosa es así:" seguido de lista | Intro buena, lista mala | Convertir la lista en prosa fluida con pequeñas pausas |
| CTA "Comenta X y te cuento" | Correcto — pero verificar que el tono sea conversacional | "Comenta X abajo y te explico" no "¡Comenta!" |

---

## Cómo usar este skill en el workflow

**Posición en el workflow:** después de `alexander-voice-adapter.md`, antes de entregar.

```
copywriter → virality-checker → alexander-voice-adapter → humanizer → ENTREGA FINAL
```

**Cuándo aplicar solo la Fase 1 (detección):**
- Cuando el guión ya pasó por adapter pero Alexander dice "no suena a mí"
- Auditoría rápida antes de grabación

**Cuándo aplicar las 3 fases completas:**
- Guiones nuevos generados en batch (como los de referentes)
- Cualquier guión que no haya pasado por humanizer antes

---

## Ejemplo aplicado — P2-B antes y después

**Antes (IA puro):**
```
[9-50s] "Uno: Claude analiza mis reportes mensuales. No los lee — los interpreta.
Dos: n8n automatiza el seguimiento...
Tres: Jarvis — mi agente de WhatsApp —...
Cuatro: Perplexity me trae noticias...
Cinco: Apify revisa qué está funcionando..."
```

**Después (humanizado):**
```
[9-50s] "Lo primero que uso es Claude. No para escribir — para pensar conmigo.
Le meto mis reportes y me dice qué está mal. Eso antes me tomaba horas.

Después tengo n8n. Automatiza todo el seguimiento en UGC Colombia.
Cada brief, cada entrega — sin que yo tenga que recordarlo.

Y Jarvis, que es mi agente en WhatsApp. Vive en mi servidor.
No en ninguna app — en mi servidor. Eso también importa.

Perplexity para noticias. Apify para ver qué les funciona a mis referentes.
Eso es lo que uso yo."
```

**Qué cambió:**
- Lista numerada → flujo con respiros naturales
- "No los lee — los interpreta" → eliminado (demasiado formulaico)
- "Vive en mi servidor, no en ninguna plataforma externa" → simplificado y con énfasis real
- "Eso es lo que uso yo" → cierre de voz, no de lista
