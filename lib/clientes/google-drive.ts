/* eslint-disable @typescript-eslint/no-explicit-any */
import { google } from 'googleapis';
import { BrandIntakeData } from '@/types/clientes/brand';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

interface DriveFile {
  fileId: string;
  fileName: string;
  webViewLink: string;
}

async function uploadFile(drive: ReturnType<typeof google.drive>, name: string, body: string): Promise<DriveFile> {
  const file = await drive.files.create({
    requestBody: { name, parents: [process.env.GOOGLE_DRIVE_FOLDER_ID!] },
    media: { mimeType: 'text/markdown', body },
    fields: 'id, name, webViewLink',
  });
  return { fileId: file.data.id!, fileName: file.data.name!, webViewLink: file.data.webViewLink! };
}

export async function uploadToGoogleDrive(data: BrandIntakeData) {
  oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  const drive = google.drive({ version: 'v3', auth: oauth2Client });
  const ts = Date.now();

  const [intake, estrategia, voz] = await Promise.all([
    uploadFile(drive, `INTAKE-${data.nombreMarca}-${ts}.md`, generateCompleteIntake(data)),
    uploadFile(drive, `ESTRATEGIA-${data.nombreMarca}-${ts}.md`, generateStrategyBrief(data)),
    uploadFile(drive, `VOZ-${data.nombreMarca}-${ts}.md`, generateVoiceGuide(data)),
  ]);

  return { intake, estrategia, voz };
}

function generateCompleteIntake(data: BrandIntakeData): string {
  const now = new Date().toLocaleString('es-CO', {
    timeZone: 'America/Bogota',
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const sofisticacionLabels = [
    'Completamente novato',
    'Conoce conceptos básicos',
    'Experiencia básica',
    'Nivel intermedio',
    'Avanzado',
    'Experto',
  ];

  const formalidadLabel =
    data.nivelFormalidad <= 3
      ? 'Muy casual, cercano'
      : data.nivelFormalidad <= 5
      ? 'Casual profesional'
      : data.nivelFormalidad <= 7
      ? 'Profesional pero cálido'
      : 'Formal / corporativo';

  const objetivoDesc: Record<string, string> = {
    awareness: 'Alcance, visibilidad, reconocimiento de marca',
    leads: 'Generación de prospectos calificados',
    ventas: 'Conversión directa, revenue',
    comunidad: 'Construcción de comunidad, engagement',
  };

  const tipoLabel =
    data.tipo === 'personal'
      ? 'Marca Personal'
      : data.tipo === 'producto'
      ? 'Producto'
      : 'Servicio / Empresa';

  return `# INTAKE COMPLETO: ${data.nombreMarca}

**Fecha:** ${now}
**Tipo:** ${tipoLabel}

---

## 1. IDENTIDAD CORE

- **Nombre:** ${data.nombreMarca}
- **Industria / Nicho:** ${data.industriaNicho}
- **Ubicación:** ${data.ubicacionGeografica}
- **Idiomas:** ${data.idiomas.join(', ')}
- **Años de experiencia:** ${data.anosExperiencia}
- **Diferenciador único:** ${data.expertiseDiferenciador}
${data.comoPierciben ? `\n**Cómo quieren que los perciban:**\n${data.comoPierciben}` : ''}

---

## 2. AUDIENCIA TARGET

**Perfil demográfico:**
${data.perfilDemografico}

**Problema principal:**
${data.problemaPrincipal}

**Resultado deseado:**
${data.resultadoDeseado}

**Nivel de sofisticación:** ${data.nivelSofisticacion}/5 — ${sofisticacionLabels[data.nivelSofisticacion] ?? ''}

**Objeciones principales:**
${data.objecionesPrincipales.map((o, i) => `${i + 1}. ${o}`).join('\n')}

**Competencia directa:**
${data.competenciaDirecta.map((c, i) => `${i + 1}. ${c}`).join('\n')}

**Ventaja competitiva:**
${data.ventajaCompetitiva}

**Costo de no actuar:**
${data.costoNoActuar}

**Error principal del cliente:**
${data.errorPrincipal}

**A quién NO puede ayudar:**
${data.aQuienNoAyudo}

---

## 3. PROPUESTA DE VALOR

**Qué ofrece:**
${data.queOfrece}

**Promesa realista:**
${data.promesaRealista}

- **Precio / Inversión:** ${data.precioInversion}
- **Formato de entrega:** ${data.formatoEntrega}
${data.garantia ? `- **Garantía:** ${data.garantia}` : ''}

**No promete:**
${data.noPromete}

${data.resultadosClientes ? `**Resultados reales con clientes:**\n${data.resultadosClientes}` : ''}

---

## 4. VOZ Y TONO

**Estilo comunicacional:**
${data.estiloComuncacional}

- **Formalidad:** ${data.nivelFormalidad}/10 — ${formalidadLabel}
- **Humor:** ${data.usoHumor}
${data.regionalismos ? `- **Regionalismos:** ${data.regionalismos}` : ''}
${data.temasSensibles ? `\n**Temas sensibles:**\n${data.temasSensibles}` : ''}

**Expresiones naturales (${data.expresionesNaturales.length}):**
${data.expresionesNaturales.map((e, i) => `${i + 1}. "${e}"`).join('\n')}

**Prohibiciones (${data.prohibiciones.length}):**
${data.prohibiciones.map((p, i) => `${i + 1}. NO: ${p}`).join('\n')}

---

## 5. PILARES DE CONTENIDO

**Mensaje central:**
${data.mensajeCentral}

${data.pilares.map((p, i) => `${i + 1}. **${p.nombre}** — ${p.porcentaje}%`).join('\n')}

Total: ${data.pilares.reduce((s, p) => s + p.porcentaje, 0)}%

---

## 6. FILOSOFIA Y VALORES

**Creencias fundamentales:**
${data.creenciasFundamentales.map((c, i) => `${i + 1}. ${c}`).join('\n')}

**Qué rechaza:**
${data.queRechaza.map((r, i) => `${i + 1}. ${r}`).join('\n')}

**Límites éticos:**
${data.limitesEticos.map((l, i) => `${i + 1}. ${l}`).join('\n')}

**Propósito de marca:**
${data.propositoMarca}

${data.historiaOrigen ? `**Historia de origen:**\n${data.historiaOrigen}\n` : ''}
${data.historiaBatallas ? `**Batallas más duras:**\n${data.historiaBatallas}\n` : ''}
${data.historiaLogros ? `**Mejores logros:**\n${data.historiaLogros}` : ''}

---

## 7. OBJETIVOS Y METRICAS

- **Objetivo:** ${data.objetivoPrincipal.toUpperCase()} — ${objetivoDesc[data.objetivoPrincipal] ?? ''}
- **KPI crítico:** ${data.kpiCritico}
- **Frecuencia:** ${data.frecuenciaContenido}
- **Plataformas:** ${data.plataformas.join(', ')}
- **Tiempo / semana:** ${data.recursosDisponibles.tiempoPorSemana}h
${data.recursosDisponibles.presupuesto ? `- **Presupuesto:** ${data.recursosDisponibles.presupuesto}` : ''}
${data.recursosDisponibles.equipo ? `- **Equipo:** ${data.recursosDisponibles.equipo}` : ''}
- **Timeline:** ${data.timeline}

---

## 8. CONTEXTO ESPECIAL

${data.productosSecundarios?.length ? `**Productos / servicios secundarios:**\n${data.productosSecundarios.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n` : ''}
${data.colaboraciones?.length ? `**Colaboraciones activas:**\n${data.colaboraciones.map((c, i) => `${i + 1}. ${c}`).join('\n')}\n` : ''}
${data.temporadasEventos?.length ? `**Temporadas / eventos clave:**\n${data.temporadasEventos.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n` : ''}
${data.restricciones?.length ? `**Restricciones:**\n${data.restricciones.map((r, i) => `${i + 1}. ${r}`).join('\n')}\n` : ''}
${data.integracionesNecesarias?.length ? `**Integraciones necesarias:**\n${data.integracionesNecesarias.map((r, i) => `${i + 1}. ${r}`).join('\n')}\n` : ''}
${data.figurasReferencia ? `**Figuras de referencia:**
- Hero Influencer: ${data.figurasReferencia.heroInfluencer || 'No especificado'}
- Competidores directos: ${data.figurasReferencia.competidoresDirectos?.join(', ') || 'Ninguno'}
- Creadores de industria: ${data.figurasReferencia.creadoresIndustria?.join(', ') || 'Ninguno'}` : ''}

---

## ARQUITECTURA RECOMENDADA

**Agentes:**
${evaluateAgents(data)}

**Presupuesto estimado:** ~${estimateTokenBudget(data)} tokens

---

*Generado por Brand Architect System — Alexander Cast · Digital Business*
`;
}

function evaluateAgents(data: BrandIntakeData): string {
  const agents = ['Orchestrator', 'Strategist', 'Copywriter', 'Analyst'];
  const visualPlatforms = ['Instagram', 'TikTok', 'YouTube', 'Pinterest'];
  if (data.plataformas.some((p) => visualPlatforms.includes(p))) agents.push('Visual Director');
  if (['awareness', 'comunidad'].includes(data.objetivoPrincipal)) agents.push('Virality Engineer');
  if (['YouTube', 'Blog', 'LinkedIn'].some((p) => data.plataformas.includes(p))) agents.push('SEO Optimizer');
  return agents.map((a, i) => `${i + 1}. ${a}`).join('\n');
}

function estimateTokenBudget(data: BrandIntakeData): number {
  let budget = 800;
  const agentsCount =
    4 +
    (data.plataformas.some((p) => ['Instagram', 'TikTok', 'YouTube'].includes(p)) ? 1 : 0) +
    (['awareness', 'comunidad'].includes(data.objetivoPrincipal) ? 1 : 0) +
    (data.plataformas.some((p) => ['YouTube', 'Blog', 'LinkedIn'].includes(p)) ? 1 : 0);
  budget += agentsCount * 400;
  const skillsCount = 3 + Math.min(data.pilares.length * 2, 10);
  budget += skillsCount * 800;
  budget += data.pilares.length * 300;
  return budget;
}

function contentSeeds(pilar: { nombre: string; porcentaje: number }, data: BrandIntakeData): string {
  const n = pilar.nombre.toLowerCase();
  const audiencia = data.perfilDemografico.split('\n')[0].trim() || 'tu audiencia';
  const error = data.errorPrincipal || 'el problema principal';
  const resultado = data.resultadoDeseado || 'el resultado deseado';

  let carrusel: string;
  let reel: string;
  let story: string;

  if (/educac|aprend|tip|enseñ|form|curso|conocim/i.test(n)) {
    carrusel = `"Los 5 errores que comete ${audiencia} — y cómo evitarlos"`;
    reel = `"Esto es lo que nadie te dice sobre ${pilar.nombre} (y deberías saber)"`;
    story = `"¿Sabes realmente qué es ${pilar.nombre}? (test rápido)"`;
  } else if (/inspir|motiva|historia|transform|camb|logr/i.test(n)) {
    carrusel = `"De ${error} a ${resultado}: el proceso real, sin filtros"`;
    reel = `"El momento exacto en que todo cambió para mí (historia real)"`;
    story = `"¿Qué te frena para llegar a ${resultado}? (respóndeme)"`;
  } else if (/camara|proceso|detras|behind|making|real|dia a dia/i.test(n)) {
    carrusel = `"Así es un día real trabajando en ${data.nombreMarca}"`;
    reel = `"Lo que pasa detrás de ${resultado} que nadie muestra"`;
    story = `"Mostrando mi proceso sin editar — ¿qué preguntas tienes?"`;
  } else if (/venta|product|servic|ofrec|invers|compra|client/i.test(n)) {
    carrusel = `"${resultado} sin ${error}: así funciona el método"`;
    reel = `"¿Por qué ${audiencia} no logra ${resultado}? La respuesta te va a sorprender"`;
    story = `"Si quieres ${resultado}, esto es lo que necesitas (desliza)"`;
  } else {
    carrusel = `"${pilar.nombre}: lo que deberías saber si quieres ${resultado}"`;
    reel = `"El mayor mito sobre ${pilar.nombre} que te está costando resultados"`;
    story = `"Pregúntame cualquier cosa sobre ${pilar.nombre}"`;
  }

  return `### ${pilar.nombre} — ${pilar.porcentaje}% del contenido\n\n- **Carrusel:** ${carrusel}\n- **Reel:** ${reel}\n- **Story / Interacción:** ${story}`;
}

function platformToneGuidance(platforms: string[], formalidad: number): string {
  const toneLabel = formalidad <= 3 ? 'muy casual y cercano' : formalidad <= 5 ? 'casual profesional' : formalidad <= 7 ? 'profesional pero cálido' : 'formal y corporativo';
  const lines: string[] = [];

  const guides: Record<string, string> = {
    Instagram: `Tono ${toneLabel}. Captions cortos (máx. 150 palabras), emoji solo si el estilo lo permite, CTAs directos al final.`,
    TikTok: `Tono más casual, incluso si la marca es formal. Hook en los primeros 2 segundos. Lenguaje conversacional, habla directo a cámara.`,
    LinkedIn: `Tono más estructurado. Párrafos cortos, pensamiento claro, experiencias con aprendizaje explícito. Evita clickbait.`,
    YouTube: `Tono de conversación larga. Intro de gancho (<30s), desarrollo profundo, cierre con invitación a suscribirse.`,
    'Twitter/X': `Máx. 280 caracteres. Opinión directa o dato sorprendente. Threads para ideas largas.`,
    Pinterest: `Tono aspiracional. Describe beneficios, usa palabras como "cómo", "guía", "ideas para".`,
    Blog: `Tono ${toneLabel} pero estructurado. H2/H3 claros, párrafos de max. 3 líneas, conclusión accionable.`,
    Podcast: `Tono conversacional. Narración en primera persona. Anécdotas personales para ilustrar conceptos.`,
  };

  for (const p of platforms) {
    if (guides[p]) lines.push(`**${p}:** ${guides[p]}`);
  }

  return lines.length > 0 ? lines.join('\n\n') : `Aplica tono ${toneLabel} adaptado a cada plataforma.`;
}

function generateStrategyBrief(data: BrandIntakeData): string {
  const now = new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota', dateStyle: 'full', timeStyle: 'short' });
  const tipoLabel = data.tipo === 'personal' ? 'Marca Personal' : data.tipo === 'producto' ? 'Producto' : 'Servicio / Empresa';
  const creencia0 = data.creenciasFundamentales[0] ?? data.mensajeCentral;
  const objetivo: Record<string, string> = { awareness: 'Alcance y reconocimiento', leads: 'Generación de leads', ventas: 'Conversión directa', comunidad: 'Comunidad y engagement' };

  const seeds = data.pilares.map((p) => contentSeeds(p, data)).join('\n\n');

  return `# ESTRATEGIA DE MARCA: ${data.nombreMarca}

**Tipo:** ${tipoLabel}
**Fecha:** ${now}

---

## POSICIONAMIENTO CENTRAL

> "Para ${data.perfilDemografico.split('\n')[0].trim() || 'su audiencia ideal'} que enfrenta ${data.problemaPrincipal.slice(0, 80)}…
> **${data.nombreMarca}** es la única opción que ${data.ventajaCompetitiva.slice(0, 100)},
> porque ${creencia0.slice(0, 120)}."

---

## ESENCIA DE MARCA

| Campo | Valor |
|-------|-------|
| Quién | ${data.nombreMarca} |
| Nicho | ${data.industriaNicho} |
| Diferenciador | ${data.expertiseDiferenciador} |
| Propósito | ${data.propositoMarca} |
| Mensaje central | ${data.mensajeCentral} |
${data.comoPierciben ? `| Cómo quiere ser percibido | ${data.comoPierciben} |` : ''}

---

## AUDIENCIA IDEAL

- **Perfil:** ${data.perfilDemografico}
- **Su mayor problema:** ${data.problemaPrincipal}
- **Lo que realmente quiere:** ${data.resultadoDeseado}
- **Costo de no actuar:** ${data.costoNoActuar}
- **Error más común:** ${data.errorPrincipal}
- **A quién NO sirves:** ${data.aQuienNoAyudo}
${data.objecionesPrincipales.length ? `\n**Objeciones frecuentes:**\n${data.objecionesPrincipales.map((o, i) => `${i + 1}. ${o}`).join('\n')}` : ''}

---

## PROPUESTA DE VALOR

- **Qué ofrece:** ${data.queOfrece}
- **Promesa realista:** ${data.promesaRealista}
- **Precio / Inversión:** ${data.precioInversion}
- **Formato:** ${data.formatoEntrega}
${data.garantia ? `- **Garantía:** ${data.garantia}` : ''}
- **No promete:** ${data.noPromete}
${data.resultadosClientes ? `\n**Resultados reales con clientes:**\n${data.resultadosClientes}` : ''}

---

## PILARES DE CONTENIDO Y SEMILLAS

Total distribuido: ${data.pilares.reduce((s, p) => s + p.porcentaje, 0)}%

${seeds}

---

## OBJETIVO Y MÉTRICAS

- **Objetivo:** ${data.objetivoPrincipal.toUpperCase()} — ${objetivo[data.objetivoPrincipal] ?? ''}
- **KPI crítico:** ${data.kpiCritico}
- **Plataformas:** ${data.plataformas.join(', ')}
- **Frecuencia:** ${data.frecuenciaContenido}
- **Tiempo disponible:** ${data.recursosDisponibles.tiempoPorSemana}h/semana
- **Timeline:** ${data.timeline}
${data.recursosDisponibles.presupuesto ? `- **Presupuesto:** ${data.recursosDisponibles.presupuesto}` : ''}

---

## AGENTES RECOMENDADOS

${evaluateAgents(data)}

---

*Brand Architect System — Alexander Cast · Digital Business*
`;
}

function generateVoiceGuide(data: BrandIntakeData): string {
  const now = new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota', dateStyle: 'full', timeStyle: 'short' });
  const formalidadLabel = data.nivelFormalidad <= 3 ? 'Muy casual, cercano' : data.nivelFormalidad <= 5 ? 'Casual profesional' : data.nivelFormalidad <= 7 ? 'Profesional pero cálido' : 'Formal / corporativo';

  const copyExamples = data.pilares
    .slice(0, 4)
    .map((p) => {
      const expresion = data.expresionesNaturales[0] ?? 'conecta con tu audiencia';
      return `### ${p.nombre}\n\n**Hook de carrusel:**\n> "${p.nombre.charAt(0).toUpperCase() + p.nombre.slice(1)}: ${data.errorPrincipal ? 'el error que te cuesta ' + p.nombre.toLowerCase() : 'lo que necesitas saber'}"\n\n**Apertura de Reel:**\n> "Si todavía crees que ${data.errorPrincipal ? data.errorPrincipal.toLowerCase().slice(0, 50) : 'esto no te afecta'}… esto es para ti."\n\n**Caption de Instagram:**\n> [Inicio con una pregunta o dato] + ${expresion} + [Desarrollo en 3-4 líneas] + [CTA: guardar / comentar / DM]`;
    })
    .join('\n\n---\n\n');

  return `# GUÍA DE VOZ Y TONO: ${data.nombreMarca}

**Fecha:** ${now}

---

## PERSONALIDAD DE MARCA

| Dimensión | Valor |
|-----------|-------|
| Estilo comunicacional | ${data.estiloComuncacional} |
| Nivel de formalidad | ${data.nivelFormalidad}/10 — ${formalidadLabel} |
| Uso del humor | ${data.usoHumor} |
${data.regionalismos ? `| Regionalismos | ${data.regionalismos} |` : ''}

${data.temasSensibles ? `**Temas a manejar con cuidado:**\n${data.temasSensibles}` : ''}

---

## EXPRESIONES NATURALES (${data.expresionesNaturales.length})

Frases que suenan auténticas a ${data.nombreMarca}:

${data.expresionesNaturales.map((e, i) => `${i + 1}. "${e}"`).join('\n')}

---

## PROHIBICIONES — LO QUE NUNCA VA (${data.prohibiciones.length})

${data.prohibiciones.map((p, i) => `${i + 1}. âŒ ${p}`).join('\n')}

---

## EJEMPLOS DE COPY POR PILAR

${copyExamples}

---

## TONO POR PLATAFORMA

${platformToneGuidance(data.plataformas, data.nivelFormalidad)}

---

## FILTRO DE AUTENTICIDAD

Antes de publicar cualquier contenido, verificar:

1. ¿${data.nombreMarca} realmente diría esto con sus propias palabras?
2. ¿Contiene alguna de las ${data.prohibiciones.length} frases o palabras prohibidas?
3. ¿Refleja el estilo: *${data.estiloComuncacional.slice(0, 80)}*?
4. ¿Usa al menos una expresión natural de la lista de ${data.expresionesNaturales.length} expresiones?

---

*Brand Architect System — Alexander Cast · Digital Business*
`;
}

export function getAuthUrl(): string {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/drive.file'],
  });
}

export async function getTokensFromCode(code: string) {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

