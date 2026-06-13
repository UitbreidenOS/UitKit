---
name: stakeholder-report
description: "Informe de datos semanal y mensual para partes interesadas: métricas clave, tendencias, análisis de causa raíz, elementos de acción — estructurado para audiencias ejecutivas y multifuncionales"
---

# Habilidad: Informe para Partes Interesadas

## Cuándo activar
- Redactar el informe de datos semanal o mensual para liderazgo, junta o partes interesadas multifuncionales
- Traducir análisis brutos en un documento listo para la toma de decisiones — no solo un volcado de datos
- Necesita presentar tanto lo que ocurrió como por qué, no solo métricas
- Preparar la sección analítica de una revisión de negocio, QBR o paquete de junta
- Comunicar hallazgos de datos a una audiencia mixta (técnica y no técnica)

## Cuándo NO usar
- Actualizaciones de paneles en vivo — configúrelas en su herramienta BI
- Exportaciones de datos brutos — las partes interesadas no necesitan ver CSV
- Artículos de investigación estadística — esto es comunicación empresarial, no análisis académico
- Análisis exploratorio puntual — use `/sql` o `/pandas-polars` para trabajo ad hoc

## Instrucciones

### Informe semanal para partes interesadas

```
Write a weekly data report for [audience: leadership team / department heads / board].

COMPANY/TEAM: [name]
WEEK OF: [date range]
REPORT AUTHOR: [your name/team]

HEADLINE METRICS (vs. last week and vs. target):

Growth:
- [Metric 1]: [value] ([+/-X%] WoW, [+/-X%] vs. target)
- [Metric 2]: [value] ([+/-X%] WoW, [+/-X%] vs. target)

Revenue:
- [Metric]: [value] ([change])

Engagement / Product:
- [Metric]: [value] ([change])

Efficiency:
- [Metric]: [value] ([change])

WHAT HAPPENED THIS WEEK (events that explain the numbers):
- [Event 1: product release, campaign, incident, partner deal, etc.]
- [Event 2]

ANALYSIS:
- Root cause of biggest positive movement: [describe]
- Root cause of biggest negative movement: [describe]
- Any anomalies that don't fit the pattern: [describe or "none"]

DECISIONS NEEDED THIS WEEK:
[List any decisions that the data is informing — what should the team do differently?]

NEXT WEEK PREVIEW:
- Metrics to watch: [which metrics are most likely to move next week and why]
- Planned changes that will affect data: [releases, campaigns, etc.]

Generate a report in narrative + data format. Lead with a one-paragraph executive summary. Use headers for each section. Include specific data points. Avoid vague language ("relatively good" → "14% above plan"). Total length: 600-800 words.
```

---

### Informe mensual para partes interesadas

```
Write a monthly data report. More detailed than weekly — includes trends, cohort analysis, and forward-looking commentary.

MONTH: [Month Year]
AUDIENCE: [leadership / board / investors / all-hands]

EXECUTIVE SUMMARY:
- Month in one sentence: [the most important thing that happened]
- Month vs. plan: [on track / ahead / behind — primary driver]

MONTHLY METRICS (vs. last month and vs. same month last year):

[Metric] | [This month] | [Last month] | [MoM %] | [Last year] | [YoY %] | [vs. plan]
Revenue | $[X]M | $[X]M | [+/-X%] | $[X]M | [+/-X%] | [+/-X%]
[Metric 2] | ... | ... | ... | ... | ... | ...
[Continue for each KPI]

TREND ANALYSIS:
- 3-month trend on [most important metric]: [describe direction and rate of change]
- 12-month trend on [revenue or primary KPI]: [describe]
- Leading indicators for next month: [what do early signals say about next month?]

ROOT CAUSE ANALYSIS — WINS:
[For the biggest positive movement: what drove it, is it repeatable, what should we do more of?]

ROOT CAUSE ANALYSIS — MISSES:
[For the biggest miss: what caused it, is it one-time or structural, what's the plan?]

COHORT INSIGHTS (if applicable):
[New user cohort performance, retention curves, LTV by acquisition source]

FORECAST UPDATE:
- Revised Q[?] forecast: $[X]M (was $[X]M, change due to: [reason])
- Annual forecast: $[X]M ([X]% above/below original plan)
- Key assumption changes: [what changed in the model]

ACTIONS AND OWNERS:
| Action | Owner | Due Date | Success Metric |
|---|---|---|---|
| [Action 1] | [Name] | [Date] | [How we measure it] |
| [Action 2] | [Name] | [Date] | [How we measure it] |

Generate the full monthly report. Narrative tone — not a bullet dump. Each section should connect to the next.
```

---

### Sección de análisis de causa raíz

Esta es la sección más valiosa y difícil de redactar. Use este prompt para estructurarla:

```
Write a root cause analysis for [metric name] [increasing/decreasing] by [X%] in [period].

SYMPTOM:
[Metric] changed from [X] to [X] — a [X%] [increase/decrease].
This was [expected / unexpected / partially expected].

DATA I HAVE:
- Segment breakdown: [how does this metric break down by [channel / cohort / geography / product line]?]
- Correlation with other metrics: [what moved at the same time?]
- Timeline: [when exactly did it start moving? Was it gradual or sudden?]

HYPOTHESES (list in order of likelihood):
1. [Most likely cause] — supported by: [what data supports this]
2. [Second hypothesis] — supported by: [data]
3. [Third hypothesis] — supported by: [data]

WHAT I'VE RULED OUT:
- [Hypothesis X] — because [evidence against it]

CONCLUSION:
- Primary cause: [your best assessment]
- Confidence: [High / Medium / Low]
- How to verify: [what analysis would confirm this]
- Recommended action: [what to do about it]
- Expected impact of action: [X% improvement in metric over X weeks]

Write this as a 300-word RCA section ready to drop into a stakeholder report.
```

---

### Resumen de datos para la junta directiva

```
Write the data/metrics section of a board update.

BOARD MEETING: [date]
REPORTING PERIOD: [quarter or month]
COMPANY STAGE: [seed / Series A / growth / pre-IPO]

HEADLINE METRICS vs. PLAN:
[Paste your key metrics with plan comparison]

Key items boards care about (by stage):

SEED/SERIES A:
- Revenue/ARR and growth rate vs. plan
- Burn rate and runway
- Key product or customer milestones
- Hiring vs. plan

GROWTH STAGE:
- Revenue, gross margin, and unit economics trends
- CAC and payback period — improving or deteriorating?
- NRR — expansion vs. churn
- Path to profitability (if relevant)

PRE-IPO:
- GAAP vs. non-GAAP metrics
- Rule of 40 position
- Quarterly guidance and variance explanation

Write the metrics section:
1. 2-sentence performance summary (honest — boards see through spin)
2. Key metrics table with vs. plan
3. 3 bullets: what drove performance (positive and negative)
4. 1 forward-looking sentence: revised forecast or key watch item for next quarter

Under 300 words. No jargon. Lead with facts.
```

---

### Paquete de datos para la revisión trimestral de negocio (QBR)

```
Write the data package for a quarterly business review with [audience: customers / internal leadership / partners].

QUARTER: Q[?] [Year]
TYPE: [Internal QBR / Customer QBR / Partner QBR]

INTERNAL QBR (leadership team):
- Quarter performance vs. OKRs
- Top 3 wins with data
- Top 3 misses with root cause
- Revised annual forecast
- Resource recommendations for next quarter

CUSTOMER QBR (for a SaaS customer success review):
Customer: [name]
- Usage metrics: [DAUs, key features used, adoption vs. contracted seats]
- Value delivered: [outcomes they achieved — quantify where possible]
- Upcoming roadmap features relevant to them
- Renewal risk level: [Green / Yellow / Red]
- Recommended next steps for their account

PARTNER QBR:
- Joint pipeline generated: $[X]M
- Joint wins: [N] customers, $[X]M ARR
- Pipeline at risk: [N] deals, reasons
- Co-marketing performance
- Recommended investments for next quarter

Generate the appropriate QBR data package based on the type selected.
```

---

### Sección de glosario de métricas

Cuando sus partes interesadas no saben qué significan las métricas:

```
Generate a plain-English metrics glossary for our stakeholder report.

METRICS TO DEFINE:
[List your metrics]

For each metric:
- Name: [official name]
- Plain English: [what it measures in one sentence — no jargon]
- Why it matters: [why this metric tells us whether the business is healthy]
- How it's calculated: [formula or brief description]
- Target range: [what "good" looks like for our business]
- What causes it to move: [the main drivers]

Keep each definition under 80 words. Write for a non-technical executive who is smart but not a data analyst.
```

## Ejemplo

**Usuario:** Informe mensual para el equipo de liderazgo. Ingresos de octubre: 2,1 M$ (el plan era 2,0 M$, +5%). Crecimiento MoM: +12%. YoY: +47%. Churn: 2,1% (era 1,8% el mes pasado). NRR: 108% (era 112% el mes pasado). Evento principal: un cliente empresarial dio de baja su contrato a mediados de mes (representaba el 8% del ARR). Nuevos logos ganados: 14 (el mejor mes de la historia). Audiencia: CEO, CFO, VP de Ventas, VP de Producto.

**Resultado esperado:** Informe mensual completo que se abre con "Octubre fue un mes récord en nuevos negocios, parcialmente compensado por el mayor evento de churn de clientes empresariales hasta la fecha." La sección de ingresos muestra 2,1 M$ frente a un plan de 2,0 M$. Análisis de causa raíz del churn: la salida del cliente empresarial impulsó el descenso del NRR del 112% al 108% — un evento estructural, no de tendencia. El récord de nuevos logos es una señal genuina. Tabla de acciones: análisis post-mortem de la cuenta perdida (VP Customer Success, 7 de nov.), refinamiento del ICP para descartar clientes con perfil de riesgo similar (VP Producto + VP Ventas, 14 de nov.). Lista de seguimiento: pipeline de renovaciones empresariales para el T4.

---
