---
name: board-pack-builder
description: "Construire un dossier de conseil d'administration : données financières, tableau de bord KPI, initiatives stratégiques, risques, demandes — à partir de données brutes"
---

# Compétence Constructeur de Dossier CA

## Quand activer
- Préparer un dossier mensuel ou trimestriel pour le conseil d'administration à partir de données financières et de rapports de direction
- Transformer des données de feuilles de calcul brutes en un récit prêt pour le conseil avec contexte
- Structurer un deck pour le conseil d'administration pour des entreprises en Series A, B ou C
- Préparer des mises à jour investisseurs suivant un format de dossier CA
- Informer un CFO ou CEO sur ce qu'il faut inclure dans une prochaine réunion du conseil

## Quand NE PAS utiliser
- Communiqués de résultats de sociétés cotées — format différent et exigences de divulgation SEC
- E-mails de mise à jour investisseurs d'une page — utiliser un modèle plus léger
- Matériaux du conseil nécessitant une revue juridique avant distribution — Claude rédige, les avocats approuvent
- États financiers audités — Claude travaille à partir de comptes de gestion, pas de chiffres audités

## IMPORTANT

Tous les chiffres financiers dans les dossiers CA doivent être marqués `[VÉRIFIER]` jusqu'à confirmation avec les données source. Les dossiers CA sont des documents de prise de décision — présentez les données avec précision et signalez là où des estimations sont utilisées. Ne lissez jamais les chiffres ni n'omettez les écarts négatifs sans divulgation.

## Instructions

### Structure du dossier CA

```
Standard board pack — 7 sections:

1. Executive Summary (1 page)
   - Month/quarter snapshot: revenue, burn, runway, headline KPIs
   - What went well, what didn't, what we're doing about it
   - The 1-2 decisions the board needs to make today

2. Financial Dashboard (2-3 pages)
   - P&L: actuals vs. budget vs. prior period
   - Cash flow statement
   - Balance sheet highlights
   - Key financial ratios

3. KPI Dashboard (1-2 pages)
   - Operational metrics by function (growth, product, customer)
   - Trend charts (last 6-12 months)
   - Leading vs. lagging indicators

4. Business Update (2-3 pages)
   - GTM: pipeline, bookings, churn, NRR
   - Product: roadmap progress, key releases
   - Ops: headcount, key hires/departures

5. Strategic Initiatives (1-2 pages)
   - Progress on board-approved initiatives
   - Status: on track / at risk / delayed + reason

6. Risk Register (1 page)
   - Top 3-5 risks, likelihood, impact, owner, mitigation

7. Asks (1 page)
   - Decisions required from the board
   - Introductions or resources requested
   - Items for approval (budget reforecasts, option grants, etc.)
```

### Prompt principal de génération

```
Build a board pack for [COMPANY NAME] for [MONTH/QUARTER YEAR].

Company context:
- Stage: [Seed / Series A / B / C / growth]
- Industry: [sector]
- Business model: [SaaS / marketplace / services / hardware]
- Board composition: [investors + independents, brief list]
- Last board meeting: [date — what was discussed/committed to]

Financial data (paste raw or describe):
- Revenue: [actuals] vs. budget [X] vs. prior month/quarter [Y]
- Gross profit / gross margin: [%]
- Operating expenses: [by category if available]
- Net burn: [$X/month]
- Cash on hand: [$X as of [date]]
- Runway: [X months at current burn]

Key KPIs (provide actual numbers):
[List your key operational metrics with actuals]

Narrative context:
- 3 things that went well: [list]
- 2-3 things that underperformed: [list + brief reason]
- Biggest risk heading into next period: [describe]
- Decisions/asks for the board: [list]

Generate: all 7 sections with executive-level writing. Flag all figures with [VERIFY].
```

### Prompt du tableau de bord financier

```
Build the financial dashboard section of the board pack.

Raw data:
[Paste P&L table, or describe line items]

Instructions:
1. Format as a condensed management P&L:
   - Revenue (with MoM or QoQ growth %)
   - Cost of Revenue / Gross Profit / Gross Margin %
   - Operating expenses by major category (S&M, R&D, G&A)
   - EBITDA / Operating loss
   - Net burn
   
2. Add variance columns:
   - Actuals vs. Budget ($ and %)
   - Actuals vs. Prior Period ($ and %)
   - Note any variance > 10% with a brief explanation

3. Cash position section:
   - Opening cash balance
   - Cash in / cash out (operating, investing, financing)
   - Closing cash balance
   - Months of runway at current burn
   
4. Key ratios (calculate and flag for verification):
   - Gross margin %
   - LTV:CAC (if SaaS)
   - Burn multiple: Net burn / Net new ARR
   - Rule of 40: Revenue growth % + FCF margin %

All figures: [VERIFY] marker. Variance explanations should be factual, not defensive.
```

### Prompt du tableau de bord KPI

```
Build the KPI dashboard section.

Company type: [SaaS / marketplace / e-commerce / services]

GROWTH METRICS (provide actuals):
- MRR / ARR: [current] vs. [prior month] vs. [prior year]
- New MRR: [from new customers this period]
- Expansion MRR: [from upgrades/upsells]
- Churned MRR: [lost this period]
- Net Revenue Retention (NRR): [%]
- New customer count: [this period] vs. [prior]

PIPELINE (if sales-led):
- Pipeline value: [$X]
- Pipeline coverage ratio: [X:1 vs. revenue target]
- Win rate: [%]
- Average deal size: [$X]
- Sales cycle length: [X days]

PRODUCT / ENGAGEMENT:
- DAU/MAU: [X]
- Key activation metric: [what is it? what is the %?]
- Feature adoption: [key feature + usage %]
- NPS: [score + trend]

CUSTOMER SUCCESS:
- GRR (Gross Revenue Retention): [%]
- Churn rate: [% by count / by revenue]
- Time to value: [days from signup to first key outcome]
- Support tickets: [volume + resolution time]

Format as a 2-column dashboard: metric on left, sparkline description + current value + trend on right.
Mark any metric that is off-track vs. goal with [AT RISK].
```

### Suivi des initiatives stratégiques

```
Build the strategic initiatives section.

List each board-approved initiative:

Initiative 1: [Name]
- Goal: [what success looks like]
- Owner: [name, title]
- Timeline: [start → target completion]
- Status: [On Track / At Risk / Delayed / Complete]
- Progress update: [2-3 sentences — what happened this period]
- Next milestone: [specific next deliverable + date]
- If at risk / delayed: [root cause + recovery plan]

Initiative 2: [Name]
...

Board expectation check:
- Were there any commitments made at the last board meeting?
- Are we delivering on those commitments, or do we need to flag a change?
```

### Prompt du registre des risques

```
Build the risk register section.

For each risk, provide:
- Risk: [name]
- Category: [financial / operational / market / regulatory / people]
- Description: [1-2 sentences on what could happen]
- Likelihood: [High / Medium / Low]
- Impact: [High / Medium / Low]
- Owner: [who manages this risk]
- Mitigation: [what is being done]
- Status change vs. last board meeting: [New / Increasing / Stable / Decreasing]

Common risks to address for [stage] companies:
- Burn rate vs. fundraising timeline
- Key person dependency (CTO, top sales rep, etc.)
- Churn acceleration / NRR compression
- Competitor moves
- Regulatory or compliance exposure
- Hiring delays blocking roadmap
```

### Prompt du résumé exécutif

```
Write the executive summary for this board pack.

This is the first thing board members read. It must:
1. Convey the headline story in 150-200 words
2. Give 3 bullet points: what went well / what didn't / what we're doing about it
3. State clearly: what decisions the board needs to make today

Structure:
HEADLINE: One sentence on the period — were we on track, ahead, or behind?
FINANCIAL SNAPSHOT: [Revenue] | [Burn] | [Runway] | [ARR/MRR]

HIGHLIGHTS:
- [Win 1 — be specific, not vague]
- [Win 2]
- [Win 3]

CHALLENGES:
- [Challenge 1 + brief root cause]
- [Challenge 2]

WHAT WE'RE DOING:
- [Action 1 — owner + timeline]
- [Action 2]

BOARD ASKS TODAY:
1. [Decision or input needed]
2. [Introductions requested]
3. [Approvals required]

Tone: Factual, clear, no spin. Board members are sophisticated — they appreciate candour over polish.
If there is bad news, lead with it — don't bury it.
```

### Prompt de revue du dossier CA

```
Review this board pack draft and give feedback.

Check for:
1. Completeness — are all 7 sections present and substantive?
2. Accuracy — are all variance explanations consistent with the data?
3. Narrative clarity — can a board member form a clear view in 10 minutes?
4. Decision readiness — are the asks specific and actionable?
5. Risk disclosure — are negative trends disclosed without being buried?
6. Number consistency — do figures match across sections (revenue in exec summary must match P&L)?
7. Missing context — what questions will a board member ask that aren't answered?

Output: Section-by-section feedback + a list of 3-5 changes to make before distribution.
```

## Exemple

**Utilisateur :** Aidez-moi à construire un dossier CA. Nous sommes une SaaS Series B, 3,2 M$ d'ARR, 280 K$/mois de burn, 14 mois de piste de trésorerie. La croissance MoM de l'ARR était de 3,2 % contre 4,5 % de budget. Le NRR est de 108 %, le churn a légèrement augmenté à 1,8 % contre 1,4 % le mois précédent.

**Résultat attendu :**
```markdown
# Dossier CA — [Entreprise] — Juin 2026
[VÉRIFIER tous les chiffres ci-dessous avec les données source]

## Résumé Exécutif
Juin a été un mois mitigé. Le chiffre d'affaires a progressé à 3,2 M$ d'ARR (+3,2 % MoM) mais est resté en dessous de notre cible budgétaire de 4,5 % — un écart attribué à deux deals entreprise reportés au T3. Le churn a atteint 1,8 %, notre plus haut niveau depuis 6 mois, porté par trois churns de clients mid-market dans notre segment legacy. Le NRR reste solide à 108 %. Avec 3,9 M$ de trésorerie et 14 mois de piste, nous ne sommes pas en danger, mais la tendance du churn nécessite une discussion au conseil.

SNAPSHOT FINANCIER : 3,2 M$ ARR | 280 K$ net burn | 14 mois de piste | NRR 108 %

POINTS POSITIFS :
- Clôture de 420 K$ de nouvel ARR via 3 logos entreprise (plus grand deal de l'histoire de l'entreprise)
- Le produit a livré la fonctionnalité IA de workflow — 34 % des clients actifs ont activé en 30 jours
- Recrutement VP Customer Success — prise de poste le 14 juillet

DÉFIS :
- Deux deals entreprise (180 K$ d'ARR combinés) reportés au T3 — impact sur le nouveau MRR d'environ 40 %
- Taux de churn de 1,8 % contre 1,4 % précédemment — 3 churns de plans legacy, tous des clients pre-2024 sur des niveaux dépréciés
- L'équipe SDR à 60 % du quota — onboarding de la nouvelle recrue retardé

CE QUE NOUS FAISONS :
- Playbook CS pour les clients legacy lancé le 15 juin (responsable : VP CS entrant)
- Onboarding SDR accéléré — pleine productivité attendue en août
- Pipeline entreprise revu — les deux deals reportés confirmés pour clôture en T3

DEMANDES AU CONSEIL AUJOURD'HUI :
1. Avis sur la révision des prévisions : maintenir l'objectif d'ARR ou réviser à 4,1 M$ compte tenu de la couverture du pipeline ?
2. Approbation : attribution d'options pour VP CS (0,35 % totalement dilué, 4 ans d'acquisition, falaise d'1 an)
3. Introductions : CISOs d'entreprise dans les services financiers (pour nos comptes cibles du T3)
```

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous construisons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
