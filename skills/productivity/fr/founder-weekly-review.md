---
name: founder-weekly-review
description: "Revue hebdomadaire du fondateur : santé de l'entreprise, suivi des OKR, état de l'équipe, priorités pour la semaine suivante"
---

# Compétence : Revue Hebdomadaire du Fondateur

## Quand activer
- Lors de votre revue d'entreprise de fin ou de début de semaine
- Pour vérifier l'avancement des OKR par rapport aux objectifs trimestriels
- Pour préparer l'agenda de votre réunion générale hebdomadaire ou du point de direction
- Pour décider où concentrer personnellement votre attention la semaine prochaine
- Pour détecter si l'équipe est surchargée, bloquée ou désalignée
- Pour rédiger un mémo de mise à jour interne hebdomadaire à destination de l'équipe

## Quand NE PAS utiliser
- Préparation du conseil d'administration — utilisez la compétence `/board-deck-builder`
- Mise à jour pour les investisseurs — utilisez la compétence `/investor-update`
- Décisions stratégiques ponctuelles — il s'agit d'un outil de cadence, pas d'un cadre de décision
- Analyse financière approfondie — utilisez `/financial-plan` ou `/dcf-model`

## Instructions

### Prompt de revue hebdomadaire principale

```
Run my weekly company review for week of [DATE].

Company stage: [Seed / Series A / Series B]
Team size: [N] people
Key OKRs this quarter: [list your 3-5 OKRs]

Available data (paste what you have — pick from the list):
- MRR / ARR: [current vs. last week]
- Pipeline: [new pipeline added, deals advanced, deals lost]
- Product: [features shipped, bugs resolved, uptime]
- Team: [new hires, departures, open roles, any flags]
- Customer: [churn, expansion, NPS, support volume]
- Burn: [cash out, burn rate vs. plan]

Produce:

## 1. Company health (traffic light: Green / Amber / Red + one sentence why)
- Revenue: [status]
- Pipeline: [status]
- Product: [status]
- Team: [status]
- Cash: [status]
- Overall: [status]

## 2. OKR check
For each OKR: status (on track / at risk / off track), actual vs. target, 1 sentence on why.

## 3. What worked this week (top 3)
Specific, not generic. Not "the team worked hard." What concretely moved forward?

## 4. What didn't (top 2-3 with root cause)
No blame. Just: what was expected to happen, what actually happened, and why.

## 5. Team pulse (1-2 signals)
Any signs of overload, disengagement, misalignment, or blocked work?
Source these from: 1:1 notes, Slack patterns, missed deadlines, direct asks.

## 6. My personal focus next week (CEO time allocation)
Based on company health above: where should the CEO spend time?
Options: customer calls, hiring, investor, product, team issues, fundraise, operational.
Recommended allocation: [top 2 priorities with % of week]

## 7. The one decision I need to make (or escalate)
The single most important thing that requires a CEO decision this week.
Not a list of 10 — one.
```

### Modèle de suivi des OKR

```
Track OKRs for [COMPANY] — [QUARTER].

Format each OKR as:

OBJECTIVE: [The qualitative goal]
- Key Result 1: [Metric target] | Current: [X] | Progress: [X%] | Status: [On Track / At Risk / Off Track]
- Key Result 2: [Metric target] | Current: [X] | Progress: [X%] | Status: [...]
- Key Result 3: [Metric target] | Current: [X] | Progress: [X%] | Status: [...]

For each at-risk or off-track KR:
Root cause: [what's causing the gap — be specific]
Owner action: [what the responsible person will do by when]
CEO action needed: [what I personally need to do, if anything]

Confidence score (1-5): how confident are you we close this KR by end of quarter?
1 = no chance without major intervention
3 = possible with focused effort
5 = on track, no concern

Example:
OBJECTIVE: Become the default choice for enterprise security teams
- KR1: $1.2M ARR | Current: $890K | Progress: 74% | Status: At Risk
  Root cause: Two enterprise deals slipped to Q4 (legal review delays)
  Owner action: Customer Success to compress legal cycle — template contract on Monday
  CEO: Call procurement leads directly at both accounts this week
  Confidence: 3/5

- KR2: 3 enterprise logos published as case studies | Current: 1 | Progress: 33% | Status: At Risk
  Root cause: Marketing hasn't prioritised — two customers agreed but paperwork stalled
  Owner action: Marketing to close both by Friday
  CEO: Not needed
  Confidence: 4/5

Run this for my OKRs and the data I provide.
```

### Évaluation de l'état de l'équipe

```
Assess team health from these signals.

Signals (share what you have):
- Any engineers who haven't shipped in 2+ weeks?
- Any 1:1 where someone flagged being blocked or burned out?
- Slack message patterns: is [person/team] unusually quiet?
- Recent departures or resignation conversations?
- Cross-functional friction (eng vs. product, sales vs. CS)?
- Anyone hired in last 90 days who seems to be struggling?

Team pulse dimensions:
1. Overload: is anyone carrying too much? Signs: missed deadlines, shorter Slack messages, skipped 1:1s
2. Misalignment: is the team clear on priorities? Signs: different people answering "what's the #1 thing" differently
3. Disengagement: is anyone checked out? Signs: minimum viable contribution, fewer ideas in meetings
4. Conflict: is there unresolved tension? Signs: passive escalations, "I thought they were handling that"
5. Uncertainty: is the team unclear on company direction? Signs: "what are we building toward?" questions in 1:1s

For each dimension: signal (Green/Amber/Red), evidence, and if Red — the one action to take this week.

Generate team pulse assessment from the signals I provide.
```

### Cadre d'allocation du temps du CEO

```
Allocate my week as CEO.

Company situation: [describe in 2-3 sentences — stage, biggest current challenge]
My available hours: [N] hours (after recurring meetings)

Current week forcing functions (must-dos):
- [Board meeting / investor call / all-hands / key hire interview / etc.]

Time buckets for a [Seed / Series A / Series B] CEO:

SEED (0-$1M ARR):
- Product: 40% — you are still building what customers need
- Customers: 30% — your job is sales and feedback loops
- Team: 20% — small team, high context needed
- Admin: 10% — fundraise, ops, legal

SERIES A ($1M-$5M ARR):
- Revenue: 35% — close enterprise deals, fix pipeline, hire sales
- Product: 25% — still close to product but delegating more
- Team: 25% — management layer forming, retain and hire leaders
- Investor: 15% — board prep, reporting, next round early signals

SERIES B ($5M+ ARR):
- Strategy: 30% — vision, positioning, market
- Revenue: 25% — large deals, GTM motion, partnership
- Team: 30% — executive team health, org design, culture
- Investor: 15% — board, next round, secondary

What should I be spending time on this week, given my situation?
Actual recommended hour allocation for each priority.
```

### Modèle de réunion générale hebdomadaire

```
Write the agenda and talking points for my weekly all-hands.

Duration: [20 / 30 / 45] minutes
Team size: [N]
Format: [async Loom + live Q&A / fully live / async memo only]

All-hands framework for startup founders:

1. COMPANY PULSE (3-5 min — data, not spin):
   - One metric that's the single best proxy for how we're doing this week
   - Is it better or worse than last week? Why?
   - Be specific: "$820K ARR, up $30K from last week — Acme deal closed Friday"
   - Not: "We're making progress!" or "Good week overall"

2. WINS OF THE WEEK (3-5 min — specific attribution):
   - Maximum 3 wins. One sentence each. Name the person/team.
   - "Maria shipped the CSV export that 4 enterprise customers were blocked on."
   - Not: "The team did amazing work this week across the board."

3. HONEST UPDATE ON WHERE WE'RE STRUGGLING (3-5 min):
   - The thing most founders don't say in all-hands — but should
   - Team respects candour, not positivity theatre
   - "We're behind on Series A pipeline. I'm spending next week on 8 investor calls."
   - Not: "Lots of exciting opportunities ahead!"

4. NEXT WEEK FOCUS — THE ONE THING (2 min):
   - What is the company's single most important move next week?
   - "This week: close the Stripe integration. Everything else is secondary."

5. TEAM SPOTLIGHT (optional, 2-3 min):
   - One person, one specific contribution, why it mattered

6. OPEN Q&A (remaining time):
   - No softball questions seeded — let real questions surface
   - If no questions: "What's the one thing you're most uncertain about?"

Generate my all-hands script with the data I provide.
```

## Exemple

**Utilisateur :** Semaine se terminant le 1er juin. ARR 890 k$ (en hausse de 22 k$). Clôture d'un contrat à 12 k$ ACV, perte d'un contrat à 8 k$ face à un concurrent. Livraison de la fonctionnalité de limitation du débit API. Un ingénieur était discret lors du 1:1 et a dit se sentir « sous pression ». OKR Q2 de 1,1 M$ ARR au 30 juin — désormais à risque. Trésorerie : 1,1 M$ restants, charge de 95 k$/mois.

**Résultat :**

```markdown
# Founder Weekly Review — Week Ending June 1

## Company Health
- Revenue: AMBER — $890K ARR, up $22K. On pace for $945K by June 30 vs. $1.1M target. Gap: $155K.
- Pipeline: AMBER — Net neutral week. One win, one loss. Competitive loss to review.
- Product: GREEN — API rate limiting shipped; unblocks enterprise customers.
- Team: AMBER — Signal of overload on engineering side (see below).
- Cash: RED — 11.6 months of runway at current burn. Below the 12-month threshold.
- Overall: AMBER. Revenue trajectory and cash position are the dual pressure points.

## OKR Check
- OKR: $1.1M ARR by June 30 | Current: $890K | Gap: $210K | 29 days left
  Status: AT RISK — would require ~$7K/day net new ARR from today.
  Root cause: Deal velocity is 2-3 weeks off plan. Three $40K+ deals expected in May slipped.
  CEO action: What happened to the three slipped deals? Call each next week.

## What Worked
1. API rate limiting shipped — 3 enterprise trials were blocked on this. Expect conversion signals.
2. Closed $12K ACV deal — first customer in the logistics vertical, new ICP signal.
3. Weekly all-hands attendance up to 94% (from 78%) — team is engaged.

## What Didn't
1. Lost $8K deal to [competitor]. Reason given: "better Slack integration." This is the third time
   this quarter we've lost on integration depth. Not a one-off — needs product decision.
2. Series A pipeline was supposed to be 15 qualified investors by now. Currently at 9.
   Root cause: Outbound investor outreach deprioritised in May during enterprise push.

## Team Pulse
- AMBER: One engineer flagged "stretched" in 1:1. Cross-check: have they missed sprint commitments?
  If yes — redistribute scope this week. If no — 1:1 to understand what "stretched" means to them.
- Review sprint allocation: who is carrying the most concurrent projects right now?

## CEO Priority Next Week
1. Close the three slipped $40K+ deals (calls Monday/Tuesday) — $120K ARR potential
2. Re-activate investor outreach — need 6 more qualified meetings before July

## The One Decision
Do we invest in Slack integration depth to stop losing deals on this, or do we challenge the loss
reason and see if integration is an excuse for a pricing/value objection?
Decision owner: CEO + CTO — due: Wednesday standup.
```

---
