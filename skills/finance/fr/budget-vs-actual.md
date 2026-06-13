---
name: budget-vs-actual
description: "Analyse budget vs réalisé : explication des écarts, identification des tendances, recommandations de révision des prévisions"
---

# Compétence Budget vs Réalisé

## Quand activer
- Réaliser une analyse mensuelle ou trimestrielle budget vs réalisé (BvA)
- Expliquer les écarts à la direction, au conseil d'administration ou aux investisseurs
- Identifier les tendances tôt pour permettre des corrections de cap
- Construire une révision des prévisions après un écart significatif par rapport au budget initial
- Produire une section de commentaire de gestion accompagnant les rapports financiers

## Quand NE PAS utiliser
- Préparation d'états financiers audités — requiert un comptable agréé
- Calcul fiscal — des ajustements différents s'appliquent, faites appel à un conseiller fiscal
- Prospectus destinés aux investisseurs — divulgation réglementée, nécessite une revue juridique
- Vous n'avez pas de base budgétaire — réalisez d'abord une session de planification financière (`/financial-plan`)

## IMPORTANT

Tous les chiffres d'écart doivent porter un marqueur `[VÉRIFIER]` jusqu'à confirmation avec les données source. Le commentaire de gestion n'est bon que si les données qui le sous-tendent le sont — signalez là où des estimations, des provisions ou des chiffres préliminaires ont été utilisés.

## Instructions

### Prompt principal d'analyse BvA

```
Run a budget vs. actuals analysis for [COMPANY] — [PERIOD: Month/Quarter/YTD].

Paste your data or provide these inputs:

REVENUE:
- Budget: $[X]
- Actual: $[X]
- Variance: $[X] ([X]% F/U) ← Claude will calculate if you provide budget + actual

COST OF REVENUE:
- Budget: $[X]
- Actual: $[X]

GROSS PROFIT:
- Budget: $[X]
- Actual: $[X]

OPEX BY LINE:
Sales & Marketing: Budget $[X] | Actual $[X]
R&D / Engineering: Budget $[X] | Actual $[X]
G&A: Budget $[X] | Actual $[X]
Other: Budget $[X] | Actual $[X]

EBITDA / OPERATING LOSS:
- Budget: $[X]
- Actual: $[X]

NET BURN (cash):
- Budget: $[X]
- Actual: $[X]

CONTEXT:
- Main reasons for variances (brief): [describe what you know]
- Any one-time items: [yes/no — describe]
- Prior month actuals (for trend): [optional]

Produce:
1. Variance summary table ($ and %)
2. Management commentary for each material variance (>5% or >$X threshold)
3. Trend analysis vs. prior period
4. Early warning signals
5. Reforecast recommendation
```

### Cadre d'analyse des écarts

```typescript
type VarianceDirection = 'FAVORABLE' | 'UNFAVORABLE'

interface LineItemVariance {
  name: string
  budget: number
  actual: number
  variance: number            // actual - budget (negative = favorable for costs)
  variancePct: number         // variance / budget * 100
  direction: VarianceDirection
  material: boolean           // true if abs(variancePct) > threshold (usually 5-10%)
  explanation: string         // root cause
  oneTimeItem: boolean        // if true, adjust run-rate for reforecast
  forwardImplication: string  // what this means for next period
}

// CONVENTION:
// Revenue: positive variance = favorable (actual > budget = beat)
// Costs: negative variance = favorable (actual < budget = underspend)
// Use F (favorable) / U (unfavorable) notation in tables

// MATERIALITY THRESHOLDS (customise):
// Large company: >5% AND >$50K
// Startup: >10% OR >$10K
// Always flag any line that is >20% regardless of dollar amount
```

### Générateur de tableau de variance

```
Generate a budget vs. actuals variance table for [PERIOD].

Format:

| Line Item | Budget | Actual | Variance $ | Variance % | F/U | Commentary |
|---|---|---|---|---|---|---|
| Revenue | $[X] | $[X] | $[X] | [X]% | F/U | [1-line explanation] |
| Cost of Revenue | $[X] | $[X] | $[X] | [X]% | F/U | [1-line explanation] |
| Gross Profit | $[X] | $[X] | $[X] | [X]% | F/U | — |
| **Gross Margin %** | [X]% | [X]% | [X]bps | — | F/U | — |
| Sales & Marketing | $[X] | $[X] | $[X] | [X]% | F/U | [1-line explanation] |
| R&D | $[X] | $[X] | $[X] | [X]% | F/U | [1-line explanation] |
| G&A | $[X] | $[X] | $[X] | [X]% | F/U | [1-line explanation] |
| EBITDA | $[X] | $[X] | $[X] | [X]% | F/U | — |
| Net Burn | $[X] | $[X] | $[X] | [X]% | F/U | — |

Rules:
- All $ in thousands (or millions if specified)
- Round to nearest $K
- Flag rows where |variance %| > [THRESHOLD]% with ⚠
- One-time items: add "(one-time)" to commentary
```

### Prompt de commentaire de gestion

```
Write management commentary for the following material variances.

REVENUE VARIANCE — $[X]K [F/U] ([X]%):
Context: [what happened — e.g. 2 deals slipped, pricing change, churn, seasonal]
Write commentary that: explains the root cause, quantifies the driver, distinguishes
recurring vs. one-time, and notes the forward implication.

Format:
"Revenue came in at $[X]K, $[X]K [below/above] budget ([X]%). The primary driver was
[root cause]. [Quantification]. [One-time vs. structural]. [Forward implication]."

OPEX VARIANCE — [Line Item] — $[X]K [F/U] ([X]%):
Context: [e.g. hiring slower than planned, vendor contract delayed, one-time consultant fee]
Write commentary using the same format.

Rules for good management commentary:
- Specific, not vague ("three enterprise deals slipped" not "slower sales")
- Quantify each driver ("representing $180K of the $240K shortfall")
- Separate recurring from one-time items explicitly
- Include the forward implication (does this variance persist into next month?)
- Do not be defensive — describe what happened and what's being done
```

### Prompt de révision des prévisions

```
Build a reforecast based on BvA results.

Original full-year budget:
[Paste or describe original annual budget by line]

Year-to-date actuals ([X] months):
[Paste YTD actuals]

Key changes to assumptions:
1. Revenue: [e.g. Q1 shortfall of $X was timing only — no structural change]
2. Headcount: [e.g. 2 hires delayed from Q1 to Q2 — impact $X/month in cost timing]
3. One-time items: [e.g. $X restructuring charge not in original budget]
4. Market conditions: [any change to the underlying assumptions]

Produce:
- Revised full-year forecast by quarter
- Variance to original budget (how much has the full-year changed and why)
- Best case / base case / downside scenario (3 scenarios)
- Revised cash runway at each scenario
- Key assumptions that drive the range between scenarios

Format the output as a reforecast narrative + supporting table.
Mark all reforecast figures [VERIFY].
```

### Prompt d'analyse des tendances

```
Run a 6-month trend analysis.

Provide data for the last 6 months (or as many as available):
[Month 1]: Revenue $X, Gross Margin X%, Net Burn $X, [Key KPI] X
[Month 2]: ...
...
[Month 6]: ...

Analyse:
1. Revenue trajectory: is growth accelerating, stable, or decelerating?
   - Calculate MoM growth rates
   - Identify inflection points

2. Margin trend: is gross margin expanding, contracting, or stable?
   - Flag if gross margin compresses >2pp in a month — investigate COGS

3. Burn trend: is burn increasing or decreasing relative to revenue?
   - Calculate burn multiple each month: net burn / net new ARR
   - A burn multiple >2x indicates inefficient growth

4. Leading indicators to watch:
   - Pipeline / bookings trend (leading → revenue with X months lag)
   - New customer count trend
   - Churn rate trend

5. Early warnings:
   - Any metric that has moved in the wrong direction for 2+ consecutive months
   - Any single-month outlier that could distort the trend

Output: trend table + 3-sentence commentary per metric.
```

### Modèle de commentaire CFO

```
Write the CFO financial summary for [PERIOD].

This 1-page section goes to the CEO, board, and investors. It must:
- Open with the headline verdict (on track, ahead, behind, and by how much)
- Cover: revenue, gross margin, burn, runway in one paragraph
- Explain the 2-3 most material variances in plain language
- State what the reforecast shows for the rest of the year
- End with any actions being taken and any decisions required

Length: 250-350 words. No bullet points — full sentences. Tone: direct, no spin.

Key figures:
[Paste your actual figures here]

Key variances to explain:
[List the 2-3 biggest variances and root causes]

Reforecast summary:
[What does the revised full-year look like?]
```

### Analyse de sensibilité

```
Run sensitivity analysis on the reforecast.

Base case assumptions:
- Revenue growth rate: [X]% MoM
- Gross margin: [X]%
- Monthly burn: $[X]K
- Cash on hand: $[X]K

Sensitivity 1 — Revenue downside (10% below base):
- Revised monthly revenue: $[X]K
- Impact on annual revenue: $[X]K
- Impact on runway (extra months of burn at lower revenue): [X] months

Sensitivity 2 — Burn increase (hired 2 positions earlier than planned):
- Additional monthly burn: $[X]K
- Runway impact: [X] months less

Sensitivity 3 — Combined (revenue miss + burn increase):
- Most conservative scenario
- Minimum runway: [X] months
- Break-even threshold: at what revenue level does the company become self-sustaining?

Format as a tornado chart description + scenario table.
[VERIFY] all sensitivity outputs against actual financial model.
```

## Exemple

**Utilisateur :** Effectuez une analyse BvA. Budget revenus 500 K$, réalisé 435 K$. Budget S&M 180 K$, réalisé 162 K$. Budget R&D 210 K$, réalisé 218 K$. Budget G&A 80 K$, réalisé 74 K$. Budget net burn 170 K$, réalisé 219 K$.

**Résultat attendu :**
```markdown
# Budget vs Réalisé — [Période]
[VÉRIFIER tous les chiffres ci-dessous]

## Résumé des Écarts

| Poste | Budget | Réalisé | Écart $ | Écart % | F/U |
|---|---|---|---|---|---|
| Revenus | 500 K$ | 435 K$ | (65 K$) | (13,0 %) | ⚠ U |
| Coût des revenus | [nécessaire] | [nécessaire] | — | — | — |
| Bénéfice brut | [calculé] | [calculé] | — | — | — |
| Ventes & Marketing | 180 K$ | 162 K$ | 18 K$ | 10,0 % | F |
| R&D | 210 K$ | 218 K$ | (8 K$) | (3,8 %) | U |
| G&A | 80 K$ | 74 K$ | 6 K$ | 7,5 % | F |
| Net Burn | 170 K$ | 219 K$ | (49 K$) | (28,8 %) | ⚠ U |

## Commentaire de Gestion

**Revenus — (65 K$) | (13,0 %) Défavorable [VÉRIFIER]**
Les revenus se sont établis à 435 K$ contre un budget de 500 K$, soit un déficit de 65 K$ (13 %).
[Cause racine nécessaire de la direction — ex. : "Deux deals entreprise totalisant 55 K$ ont glissé
au mois prochain, représentant 85 % du manque. Les 10 K$ restants reflètent des tailles de deals
moyennes plus faibles dans le segment PME."]
Implication prospective : Si les deals glissés se clôturent en [période suivante], les revenus YTD se rétablissent.
Si structurel, recommande une révision des prévisions à 480 K$ pour le mois prochain.

**Net Burn — (49 K$) | (28,8 %) Défavorable [VÉRIFIER]**
Le net burn de 219 K$ a dépassé le budget de 49 K$. Malgré des économies sur les charges opex en S&M (18 K$ F)
et G&A (6 K$ F), le déficit de revenus de 65 K$ a entraîné le dépassement du burn, avec une
compensation partielle par les économies de coûts. Burn multiple : [net burn 219 K$ / nouvel ARR net —
chiffre du nouvel ARR net nécessaire pour calculer].

**Ventes & Marketing — 18 K$ | 10,0 % Favorable [VÉRIFIER]**
S&M est venu 18 K$ en dessous du budget. Vérifiez s'il s'agit de : (a) événements/campagnes planifiés
retardés — décalage des coûts, impactera la période suivante ; ou (b) poste vacant — sous-dépense
structurelle. Distinguer avant de prévoir.

## Signal de Révision des Prévisions
Compte tenu du déficit de revenus et du burn élevé, une révision des prévisions est recommandée.
Fournissez le pipeline des [6 prochains mois] et le plan de recrutement pour un modèle de révision complet.
```

---
