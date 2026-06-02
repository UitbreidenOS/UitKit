---
name: sdr-territory-mapper
description: "Analyse de territoire SDR : cartographier la couverture des comptes, identifier les espaces blancs, prioriser par densité ICP et concentration de signaux déclencheurs, construire des plans de territoire et des rapports de couverture"
---

# Compétence de cartographie de territoire SDR

## Quand activer
- Planification d'une nouvelle affectation de territoire pour un SDR ou un AE
- Audit de votre territoire actuel pour identifier les espaces blancs et les comptes non contactés
- Planification trimestrielle du territoire et alignement des effectifs
- Identification des segments ou géographies ayant la plus forte densité ICP
- Présentation d'un plan de territoire à votre manager ou lors d'un QBR
- Rééquilibrage des territoires après des changements d'équipe ou un pivot de marché

## Quand NE PAS utiliser
- Recherche sur un compte individuel — utilisez `/sdr-research-brief` pour cela
- Prévision RevOps complète — utilisez `/revenue-operations` pour les métriques de pipeline
- Segmentation des clients pour CS — fonction et signaux différents
- TAM/SAM/SOM pour les decks investisseurs — utilisez `/pitch-deck` pour cela

## Instructions

### Bilan de santé du territoire

```
Run a territory health check for [TERRITORY — e.g. "Mid-Market EMEA, 200-1000 employees, SaaS verticals"].

My product: [what you sell]
My ICP: [company size, industry, tech stack, role targeted]
Territory data available: [CRM export / Apollo list / LinkedIn Sales Navigator export / manual list]

[PASTE ACCOUNT LIST OR DATA]

Analyse:

## 1. Coverage summary
- Total accounts in territory: [N]
- Accounts contacted at least once: [N] ([%])
- Accounts never contacted: [N] — these are the whitespace
- Accounts in active sequence: [N]
- Accounts with open opportunities: [N]
- Accounts closed-won: [N]
- Accounts closed-lost: [N] → eligible for re-engagement in [X months]?

## 2. ICP density by segment
Break down accounts by:
- Company size bucket (50-200 / 200-500 / 500-1000 / 1000+)
- Industry vertical
- Geography (country/region)
Identify: which segment has the highest ICP density AND lowest coverage = priority whitespace

## 3. Trigger signal concentration
Which segment has the most accounts with active triggers right now?
(Funding, exec hires, product launches, hiring surges)
These are your highest-probability targets this month.

## 4. Priority account list
Top 25 accounts to focus on this quarter:
Ranked by: ICP score × trigger recency × contact accessibility
| Rank | Account | ICP Score | Trigger | Last Contact | Priority |
|---|---|---|---|---|---|

## 5. Territory gaps
- Segments you're underpenetrated in
- Industries with no coverage
- Geographies with accounts but no outreach
- Roles you haven't targeted (only emailing VP Sales but not CTO)

## 6. Recommended weekly cadence
Based on territory size and pipeline targets:
- Accounts to research per day: [N]
- New outreach to start per week: [N]
- Follow-ups per day: [N]
- Calls per day target: [N]
```

### Prompt de cartographie de densité ICP

```
Map ICP density across my target market.

ICP definition:
- Industry: [list]
- Company size: [X-Y employees]
- Geography: [region/country]
- Tech stack signals: [tools that indicate fit]
- Roles to target: [titles]

Data source: [Apollo export / LinkedIn Sales Nav / CRM / manual]

[PASTE DATA]

Output:
1. Heat map by segment — where is ICP density highest?
2. Underserved segments — high ICP density, low existing coverage
3. Oversaturated segments — high competition, diminishing returns
4. Recommended: where to allocate 80% of outreach effort this quarter
```

### Prompt d'identification des espaces blancs

```
Identify whitespace in my territory.

[PASTE CRM EXPORT OR ACCOUNT LIST]
[PASTE ACCOUNTS ALREADY TOUCHED IN LAST 6 MONTHS]

Whitespace = accounts that:
1. Match ICP criteria
2. Have NOT been contacted in the last 6 months
3. Have at least one active trigger signal (funding, hiring, exec hire)

Output:
- Total whitespace accounts: [N]
- Top 20 whitespace accounts ranked by ICP score + trigger recency
- How to approach: cold, warm (mutual connection), or research-first
```

### Document de plan de territoire (pour revue manager)

```
Write a quarterly territory plan for Q[X] [YEAR].

Territory: [definition]
SDR/AE: [name]
Quota: [$ or meeting target]
Previous quarter performance: [attainment %]

Generate:

## Territory Overview
[1 paragraph — what the territory is and why it's a good market]

## ICP Analysis
[Which companies in territory are best fit and why]

## Top Accounts (Priority 1)
[Top 10 accounts — why each is a priority, trigger signal, contact strategy]

## Coverage Plan
[Weekly activity breakdown — research, new outreach, follow-ups, calls]

## Pipeline Projection
[Expected meetings booked, conversion to pipeline, projected revenue contribution]

## Resource Needs
[What support is needed — marketing campaigns, content, introductions, tools]

## Risks and Mitigations
[What could go wrong and the contingency]
```

### Modèle de notation des comptes pour la priorisation du territoire

```typescript
interface TerritoryAccount {
  company: string
  employees: number
  industry: string
  techStack: string[]
  lastContactedDaysAgo: number | null
  triggerSignals: TriggerSignal[]
  linkedInConnections: number // 2nd-degree connections
  crmStatus: 'never_contacted' | 'in_sequence' | 'opportunity' | 'closed_lost' | 'closed_won'
}

function scoreTerritoryAccount(account: TerritoryAccount, icp: ICPCriteria): number {
  let score = 0

  // ICP fit (50 points)
  score += scoreCompanySize(account.employees, icp.sizeRange) * 0.2    // max 20
  score += scoreIndustry(account.industry, icp.industries) * 0.15       // max 15
  score += scoreTechStack(account.techStack, icp.techStack) * 0.15     // max 15

  // Timing (30 points)
  const recentTriggers = account.triggerSignals.filter(t => t.recencyDays <= 90)
  score += Math.min(30, recentTriggers.length * 10)

  // Accessibility (10 points)
  score += Math.min(10, account.linkedInConnections * 2)

  // Contact recency penalty (10 points)
  if (account.lastContactedDaysAgo === null) {
    score += 10 // Never contacted — fresh territory = bonus
  } else if (account.lastContactedDaysAgo > 180) {
    score += 7  // Eligible for re-engagement
  } else if (account.lastContactedDaysAgo > 90) {
    score += 3
  } else {
    score -= 10 // Recently contacted — reduce priority
  }

  // CRM status adjustment
  if (account.crmStatus === 'closed_lost') score += 5  // Can re-engage
  if (account.crmStatus === 'closed_won') score -= 50  // Never cold outreach existing customers

  return Math.max(0, Math.min(100, score))
}

function buildTerritoryPriorityList(
  accounts: TerritoryAccount[],
  icp: ICPCriteria,
  topN: number = 25
): TerritoryAccount[] {
  return accounts
    .map(account => ({ account, score: scoreTerritoryAccount(account, icp) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .map(({ account }) => account)
}
```

### Identification des opportunités de ré-engagement

```
Identify closed-lost accounts eligible for re-engagement.

[PASTE CRM EXPORT OR CLOSED-LOST LIST]

Re-engagement criteria:
- Lost the deal more than [90/180] days ago
- Lost reason is NOT: "never a fit" / "wrong company" / "opted out"
- Company has a new trigger signal since the deal closed
- OR: new decision-maker has joined since the deal closed

Output:
- Eligible accounts: [N]
- Top 10 re-engagement targets ranked by: new trigger strength + time since loss
- Suggested approach: [cold restart / warm email referencing history / new contact only]
- Subject line suggestion for re-engagement email
```

## Exemple

**Utilisateur :** Planification du territoire T3. J'ai l'EMEA mid-market SaaS, 200-1000 employés. Mon export CRM montre 847 comptes, dont seulement 312 ont été contactés au cours des 6 derniers mois. Aidez-moi à prioriser.

**Résultat :**

**Résumé de couverture :**
- 847 comptes au total | 312 contactés (37%) | **535 comptes en espace blanc** (63%)
- Séquences actives : 89 comptes
- Opportunités ouvertes : 23 comptes
- Comptes perdus éligibles au ré-engagement : 67 comptes (perdus il y a 90+ jours avec de nouveaux déclencheurs)

**Répartition par priorité :**
- Priorité 1 (score ICP 80+, déclencheur récent) : 48 comptes → 100% de la prospection semaines 1-2
- Priorité 2 (score ICP 60-79, pas de déclencheur) : 127 comptes → prospection semaines 3-6
- Priorité 3 (score ICP 40-59) : 360 comptes → séquence à contact minimal uniquement
- Déprioritiser (score <40) : 312 comptes → exclure ce trimestre

**Zone chaude d'espace blanc :** FinTech basée au Royaume-Uni (100-500 employés) — 34 comptes non contactés avec forte densité ICP, 12 avec des déclencheurs de financement au cours des 60 derniers jours. C'est votre cible de sprint T3.

**Plan hebdomadaire :**
- Lun-Mar : 8 nouveaux comptes recherchés + séquence démarrée
- Mer-Jeu : 15 suivis + 20 appels
- Ven : Revue du pipeline + préparation de la semaine suivante
- Objectif : 12 nouveaux rendez-vous réservés / mois → 36 rendez-vous / trimestre

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous créons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
