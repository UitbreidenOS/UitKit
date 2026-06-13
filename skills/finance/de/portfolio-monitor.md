---
name: portfolio-monitor
description: "Portfolio-Unternehmensüberwachung: Board-Updates synthetisieren, KPIs gegen Plan verfolgen, Follow-on-Auslöser und Warnsignale erkennen, LP-gerechte Portfolio-Zusammenfassungen erstellen"
---

# Portfolio-Monitor Skill

## Wann aktivieren
- Synthese monatlicher oder vierteljährlicher Board-Update-Pakete von Portfoliounternehmen
- KPI-Tracking über mehrere Portfoliounternehmen hinweg und Erkennung von Anomalien
- Vorbereitung auf ein Vorstandsmeeting und Identifizierung der wichtigsten zu behandelnden Themen
- Erstellung von Portfoliounternehmen-Zusammenfassungen für vierteljährliche LP-Berichte
- Identifizierung von Follow-on-Investitionsauslösern oder Unternehmen, die Unterstützung benötigen
- Durchführung einer Portfolio-Gesundheitsüberprüfung vor einem Fund-Close oder einem LP-Meeting

## Wann NICHT verwenden
- Echtzeit-Finanzüberwachung, die Live-Datenintegrationen erfordert — dieser Skill dient der periodischen Überprüfung von Dokumenten, die du bereitstellst
- Prüfung von Finanzdaten der Portfoliounternehmen — das erfordert einen Buchhalter
- Treffen von Follow-on-Investitionsentscheidungen ohne vollständige Due Diligence — dieser Skill erkennt Signale, zieht keine Schlussfolgerungen

## Anweisungen

### Synthese eines einzelnen Unternehmens-Board-Updates

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

### KPI-Rollup auf Portfolio-Ebene

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

### Vorbereitung auf das Vorstandsmeeting

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

### Follow-on-Investitionsauslöser-Analyse

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

### LP-Quartalsbericht — Portfolio-Abschnitt

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

### Warnsignal-Eskalationsvorlage

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

## Beispiel

**Benutzer:** Ich habe drei Portfoliounternehmen, die für Q1 berichten. Unternehmen A (SaaS, Series A) erreichte 108 % des ARR-Plans bei 4,2 Mio. USD ARR, NRR 118 %, Burn auf Kurs. Unternehmen B (Marketplace, Seed) verfehlte den GMV-Plan um 22 %, verbrennt 2x das Erwartete, 7 Monate Runway. Unternehmen C (Dev Tools, Seed) plangemäß, hat erstes Enterprise-Kunden gewonnen, aber der CTO hat gerade gekündigt.

**Erwartete Ausgabe:** Portfolio-Gesundheits-Dashboard mit Unternehmen A als Grün (über Plan, potenzieller Follow-on-Auslöser), Unternehmen B als Rot (verfehlter Plan + Burn-Problem = Intervention erforderlich — konkrete Maßnahmen: Bridge-Analyse, Burn-Reduktionsoptionen, Gründergespräch), Unternehmen C als Gelb (Enterprise-Gewinn ist positiv, aber CTO-Abgang ist eine 60-Tage-Uhr für die Produktkontinuität — Vorstandsagenda: Interim-CTO-Plan, Gründerbindung). LP-Framing für das Quartal: ausgewogen, führt mit dem Gewinn von Unternehmen A, adressiert B und C mit konkreten ergriffenen Maßnahmen.

---
