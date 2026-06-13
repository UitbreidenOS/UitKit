---
name: portfolio-monitor
description: "Suivi des sociétés en portefeuille : synthétiser les mises à jour de conseil, suivre les KPI par rapport au plan, signaler les déclencheurs de suivi d'investissement et les signaux d'alerte, générer des résumés de portefeuille prêts pour les LP"
---

# Compétence Surveillance de Portefeuille

## Quand activer
- Synthétiser les paquets de mise à jour mensuels ou trimestriels des sociétés en portefeuille
- Suivre les KPI sur plusieurs sociétés en portefeuille et détecter les anomalies
- Se préparer pour une réunion de conseil et identifier les enjeux clés sur lesquels se concentrer
- Rédiger des résumés de sociétés en portefeuille pour les rapports trimestriels LP
- Identifier les déclencheurs d'investissement de suivi ou les sociétés nécessitant une intervention
- Réaliser un bilan de santé du portefeuille avant une clôture de fonds ou une réunion LP

## Quand NE PAS utiliser
- Surveillance financière en temps réel nécessitant des intégrations de données en direct — ceci est destiné à la revue périodique de documents que vous fournissez
- Audit des finances des sociétés en portefeuille — cela requiert un comptable
- Prendre des décisions d'investissement de suivi sans diligence complète — cette compétence détecte des signaux, pas des conclusions

## Instructions

### Synthèse de la mise à jour CA d'une seule société

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

### Tableau de bord KPI agrégé du portefeuille

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

### Préparation de la réunion de conseil

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

### Analyse des déclencheurs d'investissement de suivi

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

### Rapport trimestriel LP — section portefeuille

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

### Modèle d'escalade des signaux d'alerte

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

## Exemple

**Utilisateur :** J'ai trois sociétés en portefeuille qui reportent pour le T1. La société A (SaaS, Series A) a atteint 108 % du plan ARR à 4,2 M$ d'ARR, NRR 118 %, burn en ligne. La société B (marketplace, seed) a manqué le plan GMV de 22 %, brûlé 2x l'attendu, 7 mois de piste. La société C (dev tools, seed) dans le plan, a signé son premier client entreprise, mais le CTO vient de démissionner.

**Résultat attendu :** Tableau de bord de santé du portefeuille avec la société A en Vert (en avance sur le plan, déclencheur potentiel de suivi d'investissement), la société B en Rouge (plan manqué + problème de burn = intervention nécessaire — actions spécifiques : analyse du bridge, options de réduction du burn, conversation avec le fondateur), la société C en Jaune (la victoire entreprise est positive mais le départ du CTO est une horloge de 60 jours sur la continuité produit — agenda CA : plan CTO intérimaire, rétention du fondateur). Cadrage LP pour le trimestre : équilibré, présente en tête la victoire de la société A, aborde B et C avec les actions spécifiques prises.

---
