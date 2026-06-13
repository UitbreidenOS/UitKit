---
name: investor-update
description: "Correo electrónico de actualización mensual para inversores: MRR, quema de caja, puntos destacados, puntos bajos, solicitud — listo en 10 minutos"
---

# Habilidad de Actualización para Inversores

## Cuándo activar
- Al redactar el correo electrónico mensual de actualización para inversores
- Al preparar una nota de progreso a mitad de mes para un inversor principal
- Al hacer un seguimiento después de una reunión del consejo con contexto escrito
- Al comunicar malas noticias a los inversores con el tono y la estructura adecuados
- Al solicitar presentaciones específicas o ayuda a los inversores sin ser vago

## Cuándo NO usar
- Presentación formal para el consejo — usa `/board-deck-builder`
- Primera presentación a un nuevo inversor — usa `/pitch-deck`
- Documentos legales / SAFe / de financiación — no es una habilidad de plantillas
- Narrativa de la reunión trimestral del consejo — formato y profundidad diferentes

## Instrucciones

### Prompt estándar de actualización mensual para inversores

```
Write my monthly investor update for [MONTH YEAR].

Company: [name]
Stage: [Seed / Series A / Series B]
Investors receiving this: [list types — angels, seed fund, Series A lead, etc.]

Data for this month:
- MRR / ARR: [current] vs. [last month] vs. [same month last year if available]
- New MRR: [churned MRR, expansion MRR, new logo MRR]
- Burn: [monthly burn] | Cash remaining: [$X] | Runway: [X months]
- Headcount: [current] vs. [last month]
- Key wins: [list 3-5 bullet points]
- Key challenges: [list 2-3 bullet points — honest, not buried]
- Ask: [1-3 specific things investors can help with]

Tone: direct, confident, transparent. No spin. Investors have seen hundreds of these.
Length: 300-500 words. If they want more, they'll ask.
Format: email-ready, subject line included.

Framework:
1. Subject line: [Month] Update — [1 punchy metric or narrative signal]
2. One-line state of the company (the honest summary)
3. Metrics table (5-7 rows max — only metrics you track every month)
4. Highlights (3-5 bullets — specific, attributable, concrete)
5. Lowlights (2-3 bullets — honest, with root cause and what you're doing)
6. Ask (1-3 specific, actionable requests — never "any intros would be great")
7. One-line close

Generate the update with my data.
```

### Plantillas de tabla de métricas

```
Build the metrics table for my investor update.

Stage-appropriate metrics to include:

SEED (pre-PMF):
| Metric | This Month | Last Month | MoM Change |
|---|---|---|---|
| MRR | $X | $X | +X% |
| Paying customers | X | X | +X |
| Monthly burn | $X | $X | |
| Runway | X months | | |
| Top customer ACV | $X | | |
| Activation rate | X% | X% | |

SERIES A (scaling):
| Metric | This Month | Last Month | Target | Status |
|---|---|---|---|---|
| ARR | $X | $X | $X | ✅/🟡 |
| MoM growth | X% | X% | X% | |
| NRR | X% | X% | >110% | |
| New ARR | $X | $X | | |
| Gross margin | X% | X% | >70% | |
| Monthly burn | $X | $X | | |
| Runway | X months | | >18m | |
| Headcount | X | X | | |

SERIES B (efficiency):
| Metric | This Month | Last Month | YoY | Target |
|---|---|---|---|---|
| ARR | $X | $X | +X% | $X |
| NRR | X% | X% | | >120% |
| Burn multiple | Xx | Xx | | <1.5x |
| CAC payback | X months | | | <12m |
| Gross margin | X% | X% | | >75% |
| Runway | X months | | | >24m |

Only include metrics you track every month — never invent data or estimate without flagging it.
```

### Encuadre de puntos destacados y puntos bajos

```
Write highlights and lowlights for the investor update.

Highlights:
- Specific is good. Generic is noise.
- "Signed Acme Corp ($28K ACV, 2-year contract, first FSI logo)" not "Closed another enterprise deal"
- Attribute to people: "Maria shipped the new onboarding in 6 days, cutting time-to-value by 40%"
- Include signal even when not certain: "Three enterprise pilots converting faster than our previous cohort — too early to call, but we're watching"

Lowlights:
- Every investor update must have a lowlights section. Without one, investors assume you're hiding things.
- 2-3 bullets. Ordered: biggest issue first.
- Format: [what happened] → [why it happened] → [what you're doing about it]
- Never blame external factors without acknowledging internal ones
- Never end a lowlight without a next action

Examples of good lowlights:
"Sales cycle is lengthening — average days to close grew from 31 to 47. Root cause: we're moving upmarket faster than our legal docs and procurement playbook can support. We're hiring a RevOps lead in Q3 to fix this."

"We lost our Head of Engineering to a bigger offer. Transition plan in place — two senior ICs are covering for 60 days while we recruit. We have two strong candidates in the final stage."

"Customer churn spiked from 1.2% to 2.8% in June — concentrated in 4 customers in the retail vertical. Common thread: implementation didn't stick. We've started a dedicated CS check-in program for all retail customers."

Write highlights and lowlights from my data in this format.
```

### La sección de solicitud

```
Write the ask for my investor update.

Rule: Never say "any intros would be appreciated." Be specific.

Good ask format:
"I'm looking for [specific type of intro]: [who you're trying to reach], [why now], [what a warm intro would enable], [do you know anyone?]"

Ask categories:

INTRO ASK:
"Looking for intros to VPs of Engineering at Series B SaaS companies with 50-200 engineers — specifically in fintech or healthcare. We have three enterprise deals where a peer reference from a similar-stage company would accelerate the decision. Do you know 2-3 people who might be willing to take a call?"

HIRING HELP:
"We're recruiting a Head of Revenue — 5+ years of SaaS sales leadership, comfortable selling $80K-$200K ACV, ideally from a PLG-to-enterprise transition company. Know anyone? We're offering [comp range]."

INVESTOR INTRO:
"Starting early conversations with Series A leads for a Q4 raise. We're looking to meet [fund type — enterprise SaaS specialists, Midwest-focused, etc.]. If you know a partner at [firm names], an intro now would help us get ahead of the round. Happy to send a one-pager first."

ADVICE ASK:
"We're deciding between [Option A] and [Option B] for [decision]. Have you seen founders navigate this before? Would value a 20-min call to talk through it."

CUSTOMER INTRO:
"Trying to break into [vertical]. Looking for decision-makers at [company type / role]. Do you have any contacts at [specific companies or types of companies]?"

Rule: Maximum 3 asks per update. Investors will help with 1-2 things; more than that and none get done.

Write my ask section from the context I provide.
```

### Plantillas de actualización en situaciones difíciles

```
Write a difficult investor update for [situation].

Templates by situation:

MISSED MONTH:
Subject: [Month] Update — Missed Target, Here's Why and What's Changing

We missed our [MRR/ARR] target this month. [Current: $X vs. target: $X — a $X miss.]

Diagnosis (not excuses):
The primary driver was [specific cause]. We identified this [when] and have [action taken].

What's changed:
[Specific change 1 — e.g., tightened ICP definition, changed commission structure, shifted to outbound-first]
[Specific change 2]

Our [next month] target is [$X]. Here's why it's achievable: [data-backed reason, not optimism].

Ask: [specific]

---

FUNDRAISE DELAY:
Subject: [Month] Update — Adjusting Fundraise Timeline

We are pushing our [Series X] timeline from [original date] to [new date].

Reason: [honest — market conditions / metrics need more time / lead investor asked for more data / changed strategy]

Impact on runway: We have [X months] of runway at current burn. This gives us sufficient time to run the process properly. [If tight: we are also taking [cost action] to extend runway to [new runway] months.]

Plan: [what we're doing between now and the raise — what milestones we'll hit first]

Ask: [specific — any warm intros to [fund type] would materially help]

---

PIVOT / STRATEGIC CHANGE:
Subject: [Month] Update — Changing Direction on [X]

We are making a significant change that I want you to hear from me directly, not from the market.

What's changing: [the specific change — product direction, ICP, go-to-market, pricing model]
Why: [the specific evidence that drove this — customer data, conversion rates, competitive signal]
What stays the same: [the core thesis, the team, the market opportunity]
Timeline: [when the change takes effect, what the first 60-day plan looks like]
Runway impact: [does this extend or compress runway?]

I'm available to talk through this — just reply or book time here: [calendar link]

---

Generate my difficult update for the specific situation I'm facing.
```

## Ejemplo

**Usuario:** Actualización de junio. MRR $87K (era $79K en mayo). Quemamos $92K. Tenemos $710K en efectivo. Dos victorias: firmamos con Rethink Inc ($6K MRR), lanzamos la integración de pagos. Un punto bajo: perdimos al cofundador CTO — necesito comunicárselo a los inversores con cuidado. Pipeline de ronda: 4 reuniones con inversores reservadas para Series A.

**Resultado:**

**Asunto:** Actualización de junio — $87K MRR, Transición de CTO, Conversaciones de Series A en marcha

---

Hola a todos,

Breve actualización de junio. Muchas cosas en marcha.

| Métrica | Junio | Mayo | Cambio |
|---|---|---|---|
| MRR | $87,000 | $79,000 | +10,1% |
| Quema mensual | $92,000 | $88,000 | |
| Efectivo disponible | $710,000 | | ~7,7 meses |
| Clientes de pago | 14 | 12 | +2 |

**Puntos destacados**

- Firmamos con Rethink Inc a $6K MRR — nuestro segundo cliente en logística. El vertical está convirtiendo mejor de lo esperado.
- Lanzamos la integración de pagos — 3 clientes estaban bloqueados en esto; esperamos conversaciones de expansión en julio.
- Reservamos 4 reuniones con inversores de Series A para julio. Conversaciones iniciales, aún no hay un proceso formal.

**Puntos bajos**

- Nuestro CTO y cofundador, Jamie, se va a finales de julio. Es mutuo y planificado — Jamie regresa a Europa y hemos tenido esta conversación desde abril. Hemos estructurado una transición de 60 días, el equipo está estable y actualmente estoy entrevistando CTOs fraccionados para cubrir los próximos 6 meses mientras reclutamos un reemplazo permanente. Puedo hablar de esto en directo si resulta útil.
- La pista de aterrizaje está más ajustada de lo que me gustaría con 7,7 meses. Estamos en modo de revisión de costes y apuntamos a 9+ meses para agosto mediante una combinación de aceleración de ingresos y un retraso en una contratación.

**Solicitud**

- ¿Conoces a buenos líderes de ingeniería (VP Eng / CTO, experiencia en startups de 50-150 personas, idealmente SaaS o fintech) que quieran unirse en una etapa temprana? Estamos construyendo el pipeline ahora.
- Series A: si conoces a socios en fondos seed o de etapa temprana enfocados en fintech que estén escribiendo cheques activos de $3-5M, una presentación en julio sería oportuna mientras iniciamos conversaciones.

Hablamos pronto,
[Nombre]

---
