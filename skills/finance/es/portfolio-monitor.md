---
name: portfolio-monitor
description: "Monitoreo de empresas del portafolio: sintetizar actualizaciones del consejo, rastrear KPIs contra el plan, identificar señales de inversión de seguimiento y señales de alerta, generar resúmenes del portafolio para LPs"
---

# Habilidad de Monitoreo de Portafolio

## Cuándo activar
- Sintetizar paquetes de actualización mensual o trimestral del consejo de empresas del portafolio
- Rastrear KPIs en múltiples empresas del portafolio e identificar anomalías
- Prepararse para una reunión del consejo e identificar los problemas clave en los que enfocarse
- Redactar resúmenes de empresas del portafolio para informes trimestrales de LPs
- Identificar desencadenantes de inversión de seguimiento o empresas que necesitan intervención
- Realizar una revisión de salud del portafolio antes del cierre de un fondo o una reunión de LPs

## Cuándo NO usar
- Monitoreo financiero en tiempo real que requiere integraciones de datos en vivo — esta habilidad es para revisiones periódicas de documentos que proporciones
- Auditoría de los estados financieros de empresas del portafolio — eso requiere un contador
- Tomar decisiones de inversión de seguimiento sin due diligence completa — esta habilidad identifica señales, no conclusiones

## Instrucciones

### Síntesis de actualización del consejo de una sola empresa

```
Synthesize this board update for a portfolio company. Flag issues, risks, and items requiring my attention.

COMPANY: [name]
PERIOD: [month/quarter]
FUND OWNERSHIP: [X]%
BOARD SEAT: [yes/no — observer/full]
INVESTMENT THESIS (1 sentence): [what we believed when we invested]

BOARD PACKAGE CONTENTS (paste or summarize):
[Paste the board deck summary, management letter, or key slides]

Synthesize into:

1. HEADLINE (2 sentences): Is this company on track, ahead, or behind? What's the one thing I need to know?

2. KPI SCORECARD vs. plan:
| Metric | Plan | Actual | Delta | Status |
|---|---|---|---|---|
| Revenue/ARR | $[X] | $[X] | [+/-X%] | [Green/Yellow/Red] |
| Gross margin | [X]% | [X]% | [+/-] | |
| Burn rate | $[X]M | $[X]M | [+/-] | |
| Runway | [X]mo | [X]mo | | |
| [Key metric 1] | [plan] | [actual] | | |
| [Key metric 2] | [plan] | [actual] | | |

3. GREEN FLAGS: What's going better than expected?

4. YELLOW FLAGS: What needs watching but isn't critical yet?

5. RED FLAGS: What could kill this company or require urgent intervention?

6. BOARD AGENDA PRIORITIES: Top 3 things I should drive discussion on at the next board meeting.

7. FOLLOW-ON SIGNAL: Is this company a candidate for follow-on investment? [Yes / No / Maybe — with rationale]

8. MY ACTION ITEMS: What do I personally need to do for this company this month?
```

---

### Consolidación de KPIs a nivel de portafolio

```
Generate a portfolio health dashboard from these company updates.

FUND: [fund name]
REPORTING PERIOD: [Q? 202?]
PORTFOLIO SIZE: [X] companies

For each company, I'll provide a brief update. Synthesize across the portfolio:

[Company 1 — name, stage, sector]:
- ARR/Revenue: $[X]M, [+/-X]% vs. plan
- Gross margin: [X]%
- Burn: $[X]M/month, [X] months runway
- Key flag: [one sentence — good or bad]

[Company 2]: [same format]
[Company N]: [same format]

Generate:

## Portfolio Health Dashboard — [Period]

### Summary Stats
- Portfolio companies: [N]
- Total revenue/ARR across portfolio: $[X]M
- Average runway: [X] months
- Companies ahead of plan: [N] / [N total]
- Companies behind plan (>10%): [N]
- Companies with <6 months runway: [N] — [list them]

### Traffic Light Summary
| Company | Status | Primary Flag |
|---|---|---|
| [A] | Green | [brief note] |
| [B] | Yellow | [brief note] |
| [C] | Red | [brief note] |

### Follow-On Candidates
[Companies showing breakout metrics worth investing more capital]

### Intervention Needed
[Companies that need active help — board changes, bridge, pivot, M&A]

### LP Update Framing
[2-3 sentences framing portfolio performance for LP communication — accurate, not spin]
```

---

### Preparación para reunión del consejo

```
Prepare me for a board meeting with [company name].

COMPANY: [name]
MEETING DATE: [date]
BOARD COMPOSITION: [list of members — other investors, independents, founders]
MY ROLE: [lead investor / board observer / co-investor]

RECENT HISTORY:
- Last board meeting highlights: [key topics, decisions made, action items]
- Progress on prior action items: [what was committed vs. delivered]

CURRENT STATE (from most recent board package):
[Paste key financials and update]

KNOWN TENSIONS:
[Any board dynamics, founder conflicts, prior disagreements — be honest]

Prepare:
1. PRE-READ SYNTHESIS: 5 bullets on the most important things to know walking in
2. MY AGENDA: The 3 topics I want to drive (not just respond to)
3. HARD QUESTIONS to ask management — direct, not political
4. POTENTIAL ASKS FROM THE TEAM: What will they ask me for?
5. RED LINES: What decisions should I push back on?
6. POST-MEETING ACTION ITEMS I should expect to own
```

---

### Análisis de desencadenantes de inversión de seguimiento

```
Analyze follow-on investment potential for [company name].

ORIGINAL INVESTMENT:
- Entry: $[X]M at $[X]M valuation ([date])
- Current stake: [X]%
- Current fair value: $[X]M (estimated)

CURRENT METRICS:
- ARR: $[X]M ([X]% YoY growth)
- Gross margin: [X]%
- NRR: [X]%
- Burn: $[X]M/month, [X] months runway
- Last round: [date and terms]

MARKET CONTEXT:
- Comps currently trading at: [X]x ARR
- Round environment: [active / tight / Series A drought / etc.]

FOLLOW-ON TRIGGERS (check applicable):
[ ] ARR milestone crossed (e.g., $1M → $5M → $10M ARR)
[ ] Product-market fit signals confirmed (NRR >120%, low churn)
[ ] Key hire made that unblocks next phase (enterprise sales leader, CFO)
[ ] New strategic customer signed that validates ICP
[ ] Competitive window closing — need to fund faster
[ ] Bridge round to extend runway to next milestone

DILUTION CALCULATION:
- If I invest $[X]M in a $[X]M round at $[X]M pre-money:
  - New stake: [X]%
  - Average cost basis: $[X]M per 1%
  - MOIC to target at exit at $[X]M: [X]x

Generate a follow-on recommendation: [invest / pass / wait for specific trigger] with rationale.
```

---

### Informe trimestral para LPs — sección de portafolio

```
Write the portfolio section of our quarterly LP report.

FUND: [fund name and vintage]
REPORTING PERIOD: [Q? 202?]
AUDIENCE: [institutional LPs / family offices / HNW individuals]

PORTFOLIO COMPANIES (provide for each):
[Company 1]:
- What they do: [1 sentence]
- Stage: [seed / Series A / growth]
- Our ownership: [X]%
- Key achievement this quarter: [milestone, customer, metric]
- Status: [on track / ahead / needs attention]

[Company N]: [same format]

FUND-LEVEL METRICS:
- Deployed capital: $[X]M / $[X]M total fund
- Fair value of portfolio: $[X]M ([X]x MOIC unrealized)
- Any realized exits this quarter: [yes / no — details]
- New investments this quarter: [X companies / $[X]M deployed]

Write the portfolio section:
1. Opening paragraph: how the portfolio performed vs. the fund thesis
2. Company-by-company highlights (2-3 sentences each — milestone focus, no spin)
3. Companies to watch (positive signals)
4. Portfolio support we've provided (intros, hires, customer referrals)
5. Fund deployment status

Tone: Professional, honest, detailed. LPs who read many of these will spot generic language. Lead with facts and let the facts do the work.
```

---

### Plantilla de escalada de señales de alerta

```
A portfolio company is showing concerning signals. Help me assess severity and plan a response.

COMPANY: [name]
OUR STAKE: [X]%
CURRENT SITUATION:
[Describe what you're seeing — missed numbers, management issues, market changes, etc.]

RED FLAG CHECKLIST:
[ ] Revenue declining for [X] consecutive months
[ ] Burn increasing without corresponding revenue growth
[ ] Runway under 6 months with no fundraise in progress
[ ] Key executive departure (CTO, VP Sales, CFO)
[ ] Customer churn spike (gross churn > [X]%)
[ ] Lost a major customer (>15% of revenue)
[ ] Founder conflict or co-founder departure
[ ] Regulatory issue or legal dispute
[ ] Market conditions change that invalidates core thesis

SEVERITY ASSESSMENT:
For each flagged item: [Severity: Critical / High / Medium] | [Time to resolve: weeks / months]

RESPONSE OPTIONS:
1. ACTIVE SUPPORT: What can I do as a board member to help? (intros, hires, customer referrals)
2. BRIDGE FINANCING: Is bridge capital warranted? At what valuation and terms?
3. MANAGEMENT CHANGE: Is this a management problem or a market problem?
4. M&A / SOFT LANDING: Is there an acqui-hire or strategic buyer to explore?
5. WRITE-DOWN: What would trigger a write-down of our position?

Generate an action plan with 30/60/90 day milestones.
```

## Ejemplo

**Usuario:** Tengo tres empresas del portafolio reportando para el Q1. Empresa A (SaaS, Serie A) alcanzó el 108% del plan de ARR con $4.2M ARR, NRR 118%, burn en línea. Empresa B (marketplace, semilla) falló al plan de GMV en un 22%, quemó 2x de lo esperado, 7 meses de runway. Empresa C (herramientas de desarrollo, semilla) en plan, consiguió el primer cliente empresarial, pero el CTO acaba de renunciar.

**Resultado esperado:** Panel de salud del portafolio con la Empresa A en Verde (por encima del plan, posible desencadenante de seguimiento), Empresa B en Rojo (plan fallido + problema de burn = intervención necesaria — acciones específicas: análisis de bridge, opciones de reducción de burn, conversación con el fundador), Empresa C en Amarillo (el triunfo empresarial es positivo pero la salida del CTO supone un reloj de 60 días sobre la continuidad del producto — agenda del consejo: plan de CTO interino, retención del fundador). Encuadre para LPs del trimestre: equilibrado, lidera con el triunfo de la Empresa A, aborda B y C con acciones específicas tomadas.

---
