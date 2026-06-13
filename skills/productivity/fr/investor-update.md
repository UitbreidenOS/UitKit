---
name: investor-update
description: "Email de mise à jour mensuelle pour les investisseurs : MRR, burn, points positifs, points négatifs, demande — en 10 minutes"
---

# Compétence : Mise à Jour Investisseurs

## Quand activer
- Rédaction de votre email de mise à jour mensuelle pour les investisseurs
- Préparation d'une note de progrès intermédiaire à destination d'un investisseur principal
- Suivi après une réunion du conseil d'administration avec du contexte écrit
- Annonce de mauvaises nouvelles aux investisseurs avec le bon ton et la bonne structure
- Demande d'introductions ou d'aide spécifiques aux investisseurs sans être vague

## Quand NE PAS utiliser
- Présentation formelle au conseil d'administration — utilisez `/board-deck-builder`
- Premier pitch à un nouvel investisseur — utilisez `/pitch-deck`
- Documents juridiques / SAFe / de financement — pas une compétence de modèles
- Compte-rendu trimestriel de la réunion du conseil — format et profondeur différents

## Instructions

### Prompt de mise à jour mensuelle standard pour les investisseurs

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

### Modèles de tableaux de métriques

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

### Formulation des points positifs et négatifs

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

### La section « demande »

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

### Modèles de mises à jour difficiles

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

## Exemple

**Utilisateur :** Mise à jour de juin. MRR 87 k$ (contre 79 k$ en mai). Burn de 92 k$. 710 k$ en trésorerie. Deux victoires : signature de Rethink Inc (6 k$ MRR), livraison de l'intégration des paiements. Un point négatif : perte du co-fondateur CTO — je dois en informer les investisseurs avec précaution. Pipeline de levée de fonds : 4 réunions investisseurs réservées pour le Series A.

**Résultat :**

**Objet :** Mise à jour de juin — 87 k$ MRR, transition CTO, début des conversations Series A

---

Bonjour à tous,

Rapide mise à jour de juin. Beaucoup de choses en cours.

| Métrique | Juin | Mai | Variation |
|---|---|---|---|
| MRR | 87 000 $ | 79 000 $ | +10,1 % |
| Burn mensuel | 92 000 $ | 88 000 $ | |
| Trésorerie restante | 710 000 $ | | ~7,7 mois |
| Clients payants | 14 | 12 | +2 |

**Points positifs**

- Signature de Rethink Inc à 6 k$ MRR — notre deuxième client dans la logistique. Le secteur convertit mieux que prévu.
- Livraison de l'intégration des paiements — 3 clients étaient bloqués sur ce point ; des conversations d'expansion sont attendues en juillet.
- 4 réunions investisseurs Series A réservées pour juillet. Conversations préliminaires, pas encore de processus formel.

**Points négatifs**

- Notre CTO et co-fondateur, Jamie, quitte l'entreprise fin juillet. C'est mutuel et planifié — Jamie retourne en Europe et nous avons eu cette conversation depuis avril. Nous avons structuré une transition de 60 jours, l'équipe est stable, et je suis actuellement en train d'interviewer des CTO fractionnels pour couvrir les 6 prochains mois pendant le recrutement d'un remplaçant permanent. Heureux d'en discuter en direct si utile.
- La piste de trésorerie est plus serrée que je le voudrais à 7,7 mois. Nous sommes en mode révision des coûts et visons 9+ mois d'ici août grâce à une combinaison d'accélération des revenus et d'un report de recrutement.

**Demande**

- Connaissez-vous de bons leaders en ingénierie (VP Eng / CTO, expérience startup 50-150 personnes, idéalement SaaS ou fintech) qui pourraient vouloir rejoindre une startup en phase précoce ? Nous construisons le pipeline maintenant.
- Series A : si vous connaissez des partners dans des fonds seed ou early-stage axés fintech qui écrivent activement des chèques de 3-5 M$, une introduction en juillet serait bien venue au début de nos conversations.

À bientôt,
[Nom]

---
