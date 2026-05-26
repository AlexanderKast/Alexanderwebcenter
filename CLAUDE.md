# GUÍA DE USO: Alexander Cast Content System

## Para Claude (AI Assistant)

Este documento explica cómo usar el sistema de creación de contenido para Alexander Cast.

---

## Inicio Rápido

### Cuando Alexander solicita contenido:

**Paso 1:** Leer `.clinerules` (routing principal)

**Paso 2:** Determinar tipo de solicitud:
- ¿Post único? → copywriter + alexander-adapter
- ¿Calendario? → strategist + pillar-distributor
- ¿Análisis? → analyst + content-analyzer
- ¿Visual? → visual-director
- ¿Unclear? → orchestrator (decide routing)

**Paso 3:** Cargar archivos relevantes:
```
SIEMPRE:
- core/identity.md
- core/voice-dna.md
- knowledge/virality-neuroscience.md
- news/latest-brief.md  ← si existe: noticias reales de la semana por pilar

SEGÚN PILAR:
- Pilar 1 → core/philosophy.md + skills/faith-business-integration.md
- Pilar 2 → skills/kreoon-showcase.md
- Pilar 3 → agents/live-shopping-educator.md

SEGÚN TAREA:
- Escribir → skills/viral-hooks.md + skills/storytelling.md
- Planear → skills/pillar-distributor.md
- Analizar → skills/content-analyzer.md
- Framework profundo → knowledge/applied-frameworks.md
```

**Paso 4:** Ejecutar agente(s) correspondiente(s)

**Paso 5:** **CRÍTICO** — Evaluar el borrador con `skills/virality-checker.md` (score mínimo 70/100)

**Paso 6:** **CRÍTICO** — Si es contenido escrito, SIEMPRE pasar por alexander-adapter antes de entregar

**Paso 7:** **CRÍTICO para guiones de video** — SIEMPRE pasar por `skills/humanizer.md` antes de entregar un guión. Sin este paso el guión suena a IA al grabarlo, aunque esté bien redactado. Workflow: `copywriter → virality-checker → alexander-adapter → humanizer → ENTREGA`

---

## Workflows Comunes

### Workflow 1: Crear Post Único

```
1. Load: core/voice-dna.md, skills/viral-hooks.md, knowledge/virality-neuroscience.md
2. Preguntar: ¿Qué pilar? ¿Qué tema específico?
3. Generate 3 hook options (viral-hooks skill) — elegir emoción de alta activación
4. User selects hook
5. Load: skills/storytelling.md (si narrativo)
6. agents/copywriter drafts copy usando arco emocional del pilar correspondiente
7. Evaluar borrador con skills/virality-checker.md → score mínimo 70/100
8. Si score < 70: ajustar categoría más débil y re-evaluar
9. Load: skills/alexander-voice-adapter.md
10. agents/alexander-adapter transforms copy
11. Output: Post final en voz de Alexander + Virality Score incluido

TIEMPO ESTIMADO: 8-12 min
```

---

### Workflow 2: Calendario Semanal

```
1. Load: skills/pillar-distributor.md
2. Revisar balance del mes anterior (si disponible)
3. agents/strategist propone distribución
4. Load: skills/trend-adaptation.md
5. Identificar trends relevantes para la semana
6. Load: skills/referent-researcher.md
7. Quick check de competencia
8. Output: Calendario con temas específicos por día

TIEMPO ESTIMADO: 10-15 min
```

---

### Workflow 3: Showcase Kreoon

```
1. Load: skills/kreoon-showcase.md
2. Determinar ángulo: ¿Workflow? ¿Caso? ¿Comparativa?
3. agents/copywriter drafts (recordar: 80% educación, 20% producto)
4. Incluir alternativa gratuita/manual
5. agents/alexander-adapter finaliza voz
6. Output: Post educativo con Kreoon como herramienta (no pitch)

TIEMPO ESTIMADO: 8-12 min
```

---

### Workflow 4: Contenido Fe + Negocios

```
1. Load: skills/faith-business-integration.md
2. Determinar: ¿Explícita o implícita?
3. Load: skills/storytelling.md
4. Identify momento personal relevante
5. agents/copywriter drafts historia
6. Verificar: ¿Predicando o compartiendo? (debe ser compartiendo)
7. agents/alexander-adapter ajusta tono (tranquilo, no emocional extremo)
8. Output: Post que integra fe naturalmente

TIEMPO ESTIMADO: 10-15 min
```

---

### Workflow 5: Framework Profundo

```
1. Load: knowledge/applied-frameworks.md
2. Consultar sección relevante (ver tabla al final del archivo)
3. Aplicar framework al agente correspondiente
4. Output: Contenido enriquecido con framework específico

TIEMPO ESTIMADO: 5 min adicionales sobre workflow base
```

---

## Checklist Pre-Output

Antes de entregar CUALQUIER contenido escrito:

**Neurociencia y viralidad:**
- [ ] ¿Virality Score ≥ 70/100? (skills/virality-checker.md — OBLIGATORIO)
- [ ] ¿Hook activa emoción de alta activación? (asombro, curiosidad, identificación)
- [ ] ¿Hay curiosity gap que se resuelve al final? (loop dopaminérgico)
- [ ] ¿El arco emocional sigue tensión→identificación→esperanza→resolución?
- [ ] ¿Tiene al menos 3 propiedades STEPPS?
- [ ] ¿Carga cognitiva baja? (frases cortas, ejemplos concretos, máx. 5 puntos)

**Voz y pilares:**
- [ ] ¿Pasó por alexander-adapter? (OBLIGATORIO)
- [ ] ¿Voz se siente auténtica? (paisa tranquilo, no forzado)
- [ ] ¿Hook detiene scroll? (test: ¿lo leerías tú?)
- [ ] ¿Pilar correcto asignado?
- [ ] ¿CTA suave? (no agresivo)
- [ ] ¿Valor claro? (audiencia aprende algo)
- [ ] Si menciona Kreoon: ¿80/20 educación/producto?
- [ ] Si menciona fe: ¿Auténtico, no preachy?
- [ ] ¿Sin expresiones vulgares? (gonorrea, sisas, etc.)
- [ ] ¿Párrafos cortos? (2-3 líneas max)

---

## Principios Críticos

### 1. Voz es No-Negociable

**MALO:**
"¡Hola amigos! Hoy les traigo un SUPER TIP sobre IA que les va a VOLAR la cabeza!! 🤯🚀"

**BUENO:**
"La mayoría usa IA mal. Te explico cómo hacerlo bien."

**Diferencia:** Segundo es tranquilo, directo, sin hype forzado.

---

### 2. Pilares Deben Balancear

Si Alexander pide 5 posts esta semana:
- NO: 5 posts de IA (desbalance)
- SÍ: 2 IA, 1 Live Shopping, 1 Mentalidad, 1 Contenido

**Usa pillar-distributor skill para verificar balance.**

---

### 3. Fe Sin Alienar

**MALO:**
"Si no tienes fe, nunca tendrás éxito en negocios."

**BUENO:**
"Mi fe me guía. Tal vez tú tienes otra brújula. Lo importante: que tengas valores que te anclen."

**Diferencia:** Segundo respeta diversidad, no impone.

---

### 4. Kreoon: Educar, No Vender

**MALO:**
"Compra Kreoon ahora! Link en bio!"

**BUENO:**
"Así automatizo research: Kreoon conecta Perplexity + estructura. También puedes hacerlo manual con este proceso [explica proceso]. Tú decides."

**Diferencia:** Segundo educa, ofrece alternativa, genera confianza.

---

## Manejo de Ambigüedad

### Si Alexander dice: "Crea contenido"

**NO asumir.** Preguntar:
```
Para crear el mejor contenido, necesito saber:
1. ¿Qué pilar? (Mentalidad/IA/Live Shopping/Contenido)
2. ¿Qué tema específico?
3. ¿Formato? (Post/Carrusel/Reel)
4. ¿Plataforma? (IG/TikTok/LinkedIn)
5. ¿Objetivo? (Educar/Inspirar/Vender/Posicionar)
```

---

### Si Alexander dice: "No se siente como yo"

**Acción:**
1. Re-load: core/voice-dna.md
2. Re-load: skills/alexander-voice-adapter.md
3. Aplicar 7 técnicas de adaptación:
   - Despojamiento (quitar fluff)
   - Paisización (expresiones naturales)
   - Honestización (directo, sin vueltas)
   - Experienciación (historia personal)
   - Fe-integración (valores implícitos)
   - Aterrizaje (ejemplos concretos)
   - Simplificación (cortar complejidad)
4. Re-output con voz corregida

---

## Obsidian Sync

### Cuándo sincronizar:

- Proyectos importantes
- Conversaciones largas con muchos outputs
- Calendarios mensuales
- Análisis de performance

### Cómo:

```bash
# Script automático
./scripts/obsidian-sync.sh

# Manual:
git add .
git commit -m "Sync: [descripción]"
git push origin main
```

**Nota:** El PAT de GitHub está guardado en `.env` — nunca se escribe en archivos rastreados por git.

---

## Casos Especiales

### Caso 1: Lanzamiento Kreoon

Durante lanzamiento:
- Pilar 2 sube temporalmente a 40-50%
- Pero SIEMPRE 80% educación / 20% producto
- Post-lanzamiento: volver a balance normal

---

### Caso 2: Trend Viral

Si trend es relevante:
1. Load: skills/trend-adaptation.md
2. Evaluar alineación con pilares
3. Aplicar filtro de voz Alexander
4. Adaptar (no copiar directo)

---

### Caso 3: Performance Bajo

Si contenido no funciona:
1. Load: skills/content-analyzer.md
2. Analizar qué falló (hook, contenido, voz)
3. Load: skills/referent-researcher.md
4. Ver qué está funcionando para competencia
5. Ajustar estrategia

---

### Caso 4: Necesita Framework Profundo

Si necesitas profundidad en neuroventas, storytelling, comportamiento humano, etc.:
1. Load: knowledge/applied-frameworks.md
2. Ir a sección correspondiente (ver tabla de consulta al final del archivo)
3. Aplicar framework al contenido

---

## Errores Comunes a Evitar

### ❌ Error 1: Output sin alexander-adapter
**Problema:** Copy genérico, no suena a Alexander
**Fix:** SIEMPRE pasar por adapter antes de entregar

### ❌ Error 2: Sobre-uso de un pilar
**Problema:** 5 posts seguidos de IA
**Fix:** Load pillar-distributor, verificar balance

### ❌ Error 3: Fe predicadora
**Problema:** "Dios quiere que seas rico"
**Fix:** Load faith-business-integration, aplicar balance explícito/implícito

### ❌ Error 4: Kreoon como venta hard
**Problema:** "Compra Kreoon ahora!"
**Fix:** Load kreoon-showcase, aplicar 80/20 regla

### ❌ Error 5: Voz forzada
**Problema:** "Parce gonorrea, esto está muy sisas"
**Fix:** Revisar voice-dna → expresiones permitidas vs. prohibidas

### ❌ Error 6: Ignorar applied-frameworks.md
**Problema:** Framework superficial cuando se necesita profundidad
**Fix:** Consultar knowledge/applied-frameworks.md antes de ejecutar

---

## Métricas de Éxito (Para Claude)

Sabes que estás haciendo bien cuando:

✅ Alexander dice: "Esto sí suena a mí"
✅ No necesita editar mucho el copy
✅ Pilares están balanceados naturalmente
✅ Contenido genera engagement (Alexander te lo dirá)
✅ Workflows son eficientes (outputs rápidos, calidad alta)

---

## Contacto para Mejoras

Si detectas:
- Proceso ineficiente
- Skill faltante
- Voz inconsistente

**Sugerir a Alexander:**
"Detecto que [problema]. Podríamos mejorar creando [solución]. ¿Te parece?"

---

## Version
Guide Version: 1.0
Last Updated: May 2026
