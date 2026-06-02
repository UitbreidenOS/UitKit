---
name: dashboard-narrator
description: "Traduce datos y gráficos de paneles a narrativas en lenguaje claro: hallazgos clave, anomalías, recomendaciones — redactado para partes interesadas no técnicas que no leen gráficos"
---

# Habilidad: Narrador de Paneles

## Cuándo activar
- Una parte interesada necesita un resumen escrito de lo que muestra el panel — no solo un enlace al mismo
- Preparar una revisión de negocio semanal o mensual y necesitar una narrativa que acompañe a los gráficos
- Su equipo de liderazgo no está leyendo los paneles y necesita llevarles los datos
- Tiene múltiples métricas que sintetizar en una historia coherente, no una lista de números
- Traducir un panel complejo de múltiples métricas a un informe ejecutivo

## Cuándo NO usar
- Análisis de causa raíz que requiera consultas SQL sobre datos brutos — use `/sql` para eso
- Construir el panel en sí — use su herramienta BI (Looker, Tableau, Metabase)
- Análisis estadístico o pruebas de hipótesis — use `/pandas-polars` o `/sql`
- Alertas de datos en tiempo real — configúrelas en el sistema de alertas de su herramienta BI

## Instrucciones

### Prompt principal de narración de paneles

```
Translate this dashboard data into a plain-English narrative for a non-technical audience.

DASHBOARD: [name and what it tracks — e.g., "Weekly Business Review", "Growth Metrics", "Product Health"]
AUDIENCE: [who will read this — executive team / board / department head / investors]
REPORTING PERIOD: [this week / this month / Q? 202?]
COMPARISON PERIOD: [vs. last week / last month / same period last year]

METRICS (paste your data):
[For each metric provide: name, current value, prior period value, target/plan if applicable]

Example format:
- Weekly Active Users: 48,200 (↑ 3.1% vs. last week, target: 50,000, -3.6% vs. target)
- Revenue: $1.24M (↑ 8.4% vs. last week, ↑ 22% vs. same week last year)
- Conversion rate: 3.2% (↓ 0.4pp vs. last week — previously 3.6%)
- Customer churn: 1.8% monthly (↑ 0.3pp vs. last month — highest in 6 months)
- CAC: $142 (↓ 12% vs. last month — improving)
- LTV/CAC: 4.1x (stable)
- NPS: 42 (down from 48 last quarter)

CONTEXT I KNOW:
[Any business events that explain the data — product launch, marketing campaign, pricing change, seasonality, incident]

Write:
1. HEADLINE (1 sentence): What is the overall state of the business this period?
2. WINS (2-3 bullets): What improved and why it matters
3. CONCERNS (2-3 bullets): What deteriorated, the magnitude, and whether it's a trend or one-off
4. ANOMALIES (if any): Anything that doesn't fit the pattern — investigate flags
5. RECOMMENDATION: 1-2 actions the team should take based on this data
6. WATCH LIST: Metrics to monitor closely next period

Keep it under 400 words. Write for a CEO who reads it in 90 seconds.
```

---

### Detección y explicación de anomalías

```
I have an anomaly in my dashboard data. Help me describe it clearly and investigate possible causes.

METRIC: [metric name]
EXPECTED VALUE: [what it typically is or what the plan says]
ACTUAL VALUE: [what it is this period]
MAGNITUDE: [X% above/below expected, X standard deviations from 30-day average]
DURATION: [when it started — one-off spike or sustained change?]

SURROUNDING CONTEXT (paste nearby metrics that might be correlated):
[Other metrics from the same time period]

Possible causes to investigate:
1. [business event — did something change operationally?]
2. [data quality — could this be a tracking or logging issue?]
3. [seasonal or external — is there a known pattern or external factor?]
4. [upstream dependency — did a data source or pipeline change?]

Write:
1. A plain-English description of the anomaly (1-2 sentences) that a non-technical stakeholder can understand
2. The 3 most likely explanations, ranked by probability
3. How to determine which explanation is correct (what to check)
4. Whether this requires urgent action or monitoring
```

---

### Síntesis de múltiples gráficos (revisión de negocio semanal)

```
I have multiple dashboards to synthesize into a single weekly business review narrative.

BUSINESS CONTEXT:
- Company: [brief description]
- Stage: [seed / Series A / growth / established]
- Primary business model: [SaaS / marketplace / ecommerce / etc.]
- Current strategic priority: [growth / profitability / retention / expansion]

DASHBOARD 1 — GROWTH:
[Paste metrics: new users, signups, MQLs, trials, demo requests]

DASHBOARD 2 — REVENUE:
[Paste metrics: MRR/ARR, expansion, contraction, churn, NRR]

DASHBOARD 3 — PRODUCT:
[Paste metrics: DAU/WAU/MAU, activation rate, feature usage, NPS]

DASHBOARD 4 — UNIT ECONOMICS (if applicable):
[Paste metrics: CAC, LTV, payback period, gross margin]

EVENTS THIS WEEK:
[Product releases, campaigns, incidents, external news]

Write a single coherent business review narrative that:
1. Opens with the overall business health (1 sentence verdict)
2. Tells the story across growth → revenue → product → efficiency in logical sequence
3. Highlights the 2-3 most important things happening across all dashboards
4. Flags any contradictions (e.g., "activation improved but NPS dropped — worth investigating")
5. Ends with what to watch next week

Target: 500 words max. Readable in 3 minutes. No bullet points for bullets' sake — narrative prose with embedded data points.
```

---

### Adaptación según la audiencia

Ajuste el resultado en función de quién lo lee:

**Para el CEO:**
```
Frame the dashboard narrative for a CEO.
Focus on: Is the business on track? Where should we focus? Any urgent decisions?
Skip: Technical metric definitions, methodology notes.
Lead with the verdict, support with 3 data points, end with recommended action.
```

**Para la junta directiva:**
```
Frame the dashboard narrative for a board update.
Focus on: Progress vs. plan, key risks, capital efficiency.
Format: 3 bullets — what went well, what didn't, what we're doing about it.
Include: Comparison to plan/target, not just period-over-period.
Avoid: Operational detail they don't need to approve or decide on.
```

**Para un equipo funcional (marketing, producto, ventas):**
```
Frame the dashboard narrative for the [marketing / product / sales] team.
Focus on: Metrics they own and can act on.
Include: Specific actions they should take based on what the data shows.
Tone: Direct, action-oriented. They want to know what to do, not just what happened.
```

---

### Patrones de traducción de gráficos a palabras

Use estos patrones al describir tipos de gráficos específicos:

```
Describe a trend line chart:
"[Metric] [direction: rose / fell / remained stable] from [X] to [X] over [period], 
a [magnitude: sharp / gradual / modest] [increase/decrease] of [X%]. 
[If trend): The [upward/downward] trend began in [month] and has [continued / reversed / plateaued]."

Describe a bar chart comparison:
"[Category A] outperformed [Category B] by [X%] ([A: X] vs. [B: X]). 
[Category C] showed the largest [increase/decrease], [up/down] [X%] vs. [prior period]."

Describe a funnel:
"Of [X] [top of funnel], [X]% ([N]) reached [Stage 2], and [X]% ([N]) converted to [final stage]. 
The largest drop-off occurs at [stage], where [X]% [of those who reached this stage] did not proceed."

Describe a distribution / histogram:
"The median [metric] is [X], with [X]% of [entities] falling between [X] and [X]. 
The [right/left] tail indicates [X]% of [entities] with values above/below [threshold]."
```

---

### Lista de verificación de calidad de los hallazgos

Antes de enviar una narrativa de panel, verifique:

```
Review this dashboard narrative for quality.

Does it:
[ ] Lead with the most important finding, not the most obvious one?
[ ] Quantify every claim (not "revenue grew" — "revenue grew 14%")?
[ ] Distinguish between correlation and causation?
[ ] Separate facts from interpretations (facts: "churn rose 0.3pp"; interpretation: "likely due to...")?
[ ] Flag what we don't know or can't explain from the data?
[ ] End with a specific action, not a vague "we should monitor this"?
[ ] Avoid jargon the audience won't understand?

If any item fails, rewrite those sections.
```

## Ejemplo

**Usuario:** Panel semanal — WAUs: 48.200 (+3,1% WoW, el objetivo era 50K). Tasa de conversión: 3,2% (era 3,6% la semana pasada). Ingresos: 1,24 M$ (+8,4% WoW). Churn: 1,8% (era 1,5% el mes pasado). NPS: 42 (era 48 el trimestre pasado). Nueva función de producto lanzada el martes. Audiencia: CEO y equipo ejecutivo.

**Resultado esperado:** Frase veredicto de apertura ("El crecimiento se acelera en ingresos, pero las señales de conversión y retención requieren atención"). Logros: fuerte crecimiento de ingresos, tendencia positiva de WAU. Preocupaciones: la caída de la tasa de conversión coincide con el lanzamiento del martes — la nueva función puede estar perturbando el flujo de registro; el aumento del churn es incipiente, pero hay que seguir la tendencia durante 3 meses. Recomendación: prueba A/B del nuevo flujo de incorporación frente a la versión anterior; programar análisis de cohortes de churn para identificar si un segmento específico está impulsando el 1,8%. Lista de seguimiento: tasa de conversión y churn durante las próximas 2 semanas.

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
