---
name: sdr-lead-scorer
description: "Puntuación de leads por ajuste al ICP y señales de intención para SDRs: puntúa prospectos de 0 a 100 frente a tu perfil de cliente ideal, clasifica listas por prioridad y explica el razonamiento detrás de cada puntuación"
---

# Habilidad de Puntuación de Leads para SDR

## Cuándo activar
- Tienes una lista de leads en bruto (exportación de Apollo, LinkedIn Sales Nav, lista de asistentes a eventos, formulario de inbound) y necesitas priorizarla
- Construyendo un sistema automatizado de enrutamiento de leads que puntúa los leads entrantes antes de la asignación
- Actualización trimestral del ICP — volver a puntuar la base de datos con criterios actualizados
- Quieres explicarle a tu gerente por qué estás priorizando ciertas cuentas
- Construyendo un modelo de puntuación de leads para un nuevo producto o segmento de mercado

## Cuándo NO usar
- Investigación profunda de una sola cuenta — usa `/sdr-research-brief` para eso (más detalle)
- Puntuación del pipeline existente para fines de pronóstico — usa `/commercial-forecaster`
- Puntuación de salud del cliente — usa la habilidad `/customer-success`
- Cuando tienes menos de 10 leads — puntúalos manualmente, no es necesario construir un sistema

## Instrucciones

### Prompt de puntuación de leads (por lotes)

```
Puntúa estos leads frente a mi ICP.

Mi producto: [lo que vendes en una línea]
Mi ICP:
  - Tamaño de empresa: [X-Y empleados]
  - Industrias: [lista]
  - Señales de tech stack: [herramientas que indican ajuste]
  - Roles a targetear: [títulos específicos]
  - Geografías: [países/regiones]
  - Señales negativas (NO es un ajuste si): [lista — p.ej. B2C, <10 empleados, empleado de competidor]

Lista de leads:
[PEGAR LISTA — nombre, cargo, empresa, tamaño de empresa, industria, tech stack si se conoce]

Por cada lead, produce:
| Lead | Empresa | Puntuación ICP (0-100) | Nivel | Principal razón de puntuación | Principal descalificador (si hay) |
|---|---|---|---|---|---|

Definiciones de nivel:
- A (80-100): Contactar inmediatamente — ajuste perfecto
- B (60-79): Buen ajuste — secuenciar esta semana
- C (40-59): Marginal — secuencia de bajo contacto o nurture
- D (<40): No es un ajuste — excluir o archivar

Al final de la tabla:
- Total de leads de nivel A: [N]
- Mayor descalificador en esta lista: [razón más común para puntuaciones bajas]
- Brecha de datos: [qué información mejoraría la precisión de la puntuación]
```

### Constructor de marco de puntuación de ICP

```
Construye un marco de puntuación de leads para [NOMBRE DEL PRODUCTO].

Mercado objetivo: [descripción]
Movimiento de ventas: [PLG / ventas internas / ventas de campo / liderado por socios]

Define el modelo de puntuación:

AJUSTE FIRMOGRÁFICO (50 puntos en total):
- Tamaño de empresa: [define rangos y valores de puntos]
  p.ej. 50-200 empleados: 20 pts | 200-500: 15 pts | 500-2000: 10 pts | resto: 0 pts
- Industria: [lista de industrias objetivo y pesos]
  p.ej. SaaS: 15 pts | FinTech: 12 pts | eCommerce: 10 pts | resto: 0 pts
- Geografía: [regiones y pesos]
  p.ej. US/UK/CA/AU: 10 pts | UE: 7 pts | resto del mundo: 3 pts
- Superposición de tech stack: [herramientas que indican ajuste]
  p.ej. Usa Salesforce: +5 | Usa HubSpot: +5 | Usa Segment: +5 (máx 15 pts)

SEÑALES DE INTENCIÓN (30 puntos en total):
- Ofertas de empleo activas para roles que tu producto ayuda: [peso]
- Ronda de financiación reciente (<90 días): [peso]
- Nueva contratación ejecutiva en departamento relevante: [peso]
- Anuncio de lanzamiento de producto: [peso]
- Señales de cambio tecnológico (pasó de X a Y): [peso]
- Actividad de reseñas en G2/Capterra: [peso]

AJUSTE DE CONTACTO (20 puntos en total):
- Título alineado con tomador de decisiones: [pesos por título]
  p.ej. VP Ventas / CRO: 15 pts | Director Ventas: 12 pts | Gerente Ventas: 8 pts
- Nivel de seniority: [pesos]
- Grado de conexión en LinkedIn: 2º grado: +5 | 3º: +2 | Ninguno: 0

SEÑALES NEGATIVAS (deducciones):
- Empleado de competidor: -50
- Empresa B2C: -30
- <10 empleados: -20
- Optó por no contactar previamente: -100 (nunca contactar)
- Cerrado-perdido recientemente (< 60 días): -20
```

### Puntuación automatizada de leads (patrón de código)

```typescript
import { generateObject } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { z } from 'zod'

const LeadScore = z.object({
  score: z.number().min(0).max(100),
  tier: z.enum(['A', 'B', 'C', 'D']),
  topReasons: z.array(z.string()).max(3),     // why this score
  disqualifiers: z.array(z.string()).max(3),  // red flags
  recommendedAction: z.enum([
    'outreach_immediately',
    'add_to_sequence_this_week',
    'add_to_nurture',
    'disqualify',
    'needs_more_data',
  ]),
  missingData: z.array(z.string()),           // what data would improve accuracy
  confidenceLevel: z.enum(['high', 'medium', 'low']),
})

async function scoreLead(lead: RawLead, icp: ICPDefinition): Promise<ScoredLead> {
  // First: rule-based hard filters (instant disqualification)
  if (icp.negativeSignals.competitorDomains.includes(getDomain(lead.email))) {
    return { ...lead, score: 0, tier: 'D', topReasons: ['Competitor employee'], recommendedAction: 'disqualify' }
  }

  if (lead.optedOut) {
    return { ...lead, score: 0, tier: 'D', topReasons: ['Opted out'], recommendedAction: 'disqualify' }
  }

  // Then: Claude-based scoring for nuanced fit
  const { object } = await generateObject({
    model: anthropic('claude-haiku-4-5-20251001'), // Haiku — fast and cheap for bulk scoring
    schema: LeadScore,
    system: `You are a B2B sales qualification expert. Score leads 0-100 against the ICP.
Be precise. Reference specific firmographic and intent data.
A score should reflect BOTH fit (will they buy?) AND timing (will they buy NOW?).`,
    prompt: `Score this lead against our ICP.

ICP: ${JSON.stringify(icp, null, 2)}

Lead:
- Name: ${lead.name}
- Title: ${lead.title}
- Company: ${lead.company}
- Employees: ${lead.employees}
- Industry: ${lead.industry}
- Tech stack: ${lead.techStack?.join(', ') ?? 'unknown'}
- Geography: ${lead.country}
- LinkedIn: ${lead.linkedInUrl ?? 'unknown'}
- Recent signals: ${lead.signals?.map(s => s.description).join('; ') ?? 'none identified'}
- Last contacted: ${lead.lastContactedDaysAgo ? `${lead.lastContactedDaysAgo} days ago` : 'never'}`,
  })

  return { ...lead, ...object }
}

// Batch scoring — process 100 leads concurrently (with rate limiting)
async function scoreLeadList(leads: RawLead[], icp: ICPDefinition): Promise<ScoredLead[]> {
  const BATCH_SIZE = 10
  const results: ScoredLead[] = []

  for (let i = 0; i < leads.length; i += BATCH_SIZE) {
    const batch = leads.slice(i, i + BATCH_SIZE)
    const scored = await Promise.all(batch.map(lead => scoreLead(lead, icp)))
    results.push(...scored)
    console.log(`Scored ${Math.min(i + BATCH_SIZE, leads.length)}/${leads.length}`)
    await new Promise(r => setTimeout(r, 500)) // rate limit
  }

  return results.sort((a, b) => b.score - a.score)
}
```

### Enrutamiento de leads entrantes (puntuación en tiempo real)

```typescript
// Webhook: fires when a new lead fills out a form
app.post('/webhooks/new-lead', async (req, res) => {
  const formData = req.body // email, company, name, form fields

  // 1. Enrich the lead
  const enriched = await enrichLead(formData.email) // Apollo/Clearbit

  // 2. Score against ICP
  const scored = await scoreLead(enriched, ICP_CONFIG)

  // 3. Route based on tier
  switch (scored.tier) {
    case 'A':
      // Immediate: assign to senior SDR, trigger Slack alert
      await assignToSDR(scored, 'senior', priority: 'immediate')
      await postSlackAlert('#sdr-hot-inbound', scored)
      break

    case 'B':
      // Today: add to SDR queue, auto-enrol in sequence
      await assignToSDR(scored, 'standard', priority: 'today')
      await enrolInSequence(scored.email, 'inbound-b-tier')
      break

    case 'C':
      // Nurture: marketing automation takes over
      await enrolInSequence(scored.email, 'nurture-long')
      break

    case 'D':
      // Disqualify: log reason, no outreach
      await markDisqualified(scored.email, scored.topReasons)
      break
  }

  // 4. Update CRM
  await upsertHubSpotContact(scored.email, {
    icp_score: scored.score,
    icp_tier: scored.tier,
    qualification_reason: scored.topReasons.join('; '),
    lead_source: 'inbound_form',
  })

  res.json({ ok: true, tier: scored.tier, score: scored.score })
})
```

### Interpretación de la puntuación de ICP

```
PUNTUACIÓN 90-100 — Deja todo. Investiga esta cuenta hoy.
Estas cuentas tienen un ajuste casi perfecto Y desencadenantes activos.
Regla: contactar en 24 horas. Estas ventanas se cierran.

PUNTUACIÓN 75-89 — Sólido. Añadir a la secuencia esta semana.
Buen ajuste, algo de incertidumbre de momento. Investiga 10 minutos.
Regla: en secuencia en 3 días hábiles.

PUNTUACIÓN 60-74 — Firme. Vale la pena trabajar, sin urgencia.
Ajuste razonable, necesita un desencadenante para subir.
Regla: añadir a secuencia automatizada, priorizar cuando aparezcan desencadenantes.

PUNTUACIÓN 40-59 — Marginal. Solo bajo contacto.
Algunas señales de ICP pero faltan criterios clave.
Regla: solo secuencia automatizada. Sin investigación manual.

PUNTUACIÓN <40 — No es un ajuste. No contactar.
Faltan demasiados criterios del ICP. El contacto desperdiciaría el tiempo de todos.
Regla: archivar, no secuenciar, no llamar.
```

### Verificador de calidad de datos (antes de puntuar)

```
Antes de puntuar esta lista de leads, evalúa la calidad de los datos.

[PEGAR LISTA DE LEADS]

Resultado:
- Total de leads: [N]
- Leads con email: [N] ([%])
- Leads con tamaño de empresa: [N] ([%])
- Leads con industria: [N] ([%])
- Leads con tech stack: [N] ([%])
- Leads con cargo: [N] ([%])

Brechas de datos que más afectan la precisión de la puntuación:
1. [Campo faltante más común + cómo afecta la puntuación]
2. [Segundo más común]

Recomendación: 
- Enriquecer [X] leads mediante [Apollo / Clearbit / manual] antes de puntuar
- Puntuar inmediatamente con datos disponibles: [Y leads]
- No se puede puntuar de forma confiable: [Z leads — razón]
```

## Ejemplo

**Usuario:** Tengo 47 leads entrantes de un webinar. Puntúalos y dime a cuáles llamar hoy.

**Entrada (muestra):**
```
Jane Smith, VP Operaciones, Acme Corp, 450 empleados, B2B SaaS, usa Salesforce + Slack
Bob Lee, Gerente de TI, Local Bakery, 12 empleados, Alimentos y Bebidas, stack desconocido
Carol Wu, Head of Sales Ops, TechCo, 800 empleados, FinTech, usa HubSpot + Intercom
```

**Resultado:**
| Lead | Empresa | Puntuación | Nivel | Razón | Acción |
|---|---|---|---|---|---|
| Carol Wu | TechCo | 88 | A | FinTech + 800 empleados + usuario de HubSpot + Head of Sales Ops = ICP perfecto | Llamar hoy |
| Jane Smith | Acme Corp | 74 | B | Buen tamaño y vertical SaaS, usuario de Salesforce, pero rol de Operaciones = no es el comprador principal | Secuenciar esta semana |
| Bob Lee | Local Bakery | 12 | D | <50 empleados, industria incorrecta, rol incorrecto | Descalificar |

**Lista de llamadas de hoy (nivel A):** 8 leads → llamar antes de las 11am. Carol Wu es #1.
**Secuencias de esta semana (nivel B):** 23 leads → inscribir antes del viernes.
**Descalificados (nivel D):** 11 leads → archivados.

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
