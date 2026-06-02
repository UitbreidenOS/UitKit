---
name: sdr-lead-scorer
description: "Notation des leads par adéquation ICP et signaux d'intention pour les SDR : noter les prospects de 0 à 100 par rapport à votre profil client idéal, classer les listes par priorité, et expliquer le raisonnement derrière chaque score"
---

# Compétence de notation des leads SDR

## Quand activer
- Vous avez une liste de leads bruts (export Apollo, LinkedIn Sales Nav, liste de participants à un événement, formulaire entrant) et devez la prioriser
- Construction d'un système automatisé de routage des leads qui note les leads entrants avant l'attribution
- Actualisation trimestrielle de l'ICP — rescorer la base de données selon des critères mis à jour
- Vous souhaitez expliquer à votre manager pourquoi vous priorisez certains comptes
- Construction d'un modèle de notation des leads pour un nouveau produit ou segment de marché

## Quand NE PAS utiliser
- Recherche approfondie sur un seul compte — utilisez `/sdr-research-brief` pour cela (plus de détails)
- Notation du pipeline existant à des fins de prévision — utilisez `/commercial-forecaster`
- Notation de la santé des clients — utilisez la compétence `/customer-success`
- Quand vous avez moins de 10 leads — notez manuellement, inutile de construire un système

## Instructions

### Prompt de notation des leads (en lot)

```
Score these leads against my ICP.

My product: [what you sell in one line]
My ICP:
  - Company size: [X-Y employees]
  - Industries: [list]
  - Tech stack signals: [tools that indicate fit]
  - Roles to target: [specific titles]
  - Geographies: [countries/regions]
  - Negative signals (NOT a fit if): [list — e.g. B2C, <10 employees, competitor employee]

Lead list:
[PASTE LIST — name, title, company, company size, industry, tech stack if known]

For each lead, output:
| Lead | Company | ICP Score (0-100) | Tier | Top reason for score | Top disqualifier (if any) |
|---|---|---|---|---|---|

Tier definitions:
- A (80-100): Outreach immediately — perfect fit
- B (60-79): Good fit — sequence this week
- C (40-59): Marginal — low-touch sequence or nurture
- D (<40): Not a fit — exclude or archive

After the table:
- Total A-tier leads: [N]
- Biggest disqualifier in this list: [most common reason for low scores]
- Data gap: [what info would improve scoring accuracy]
```

### Constructeur de cadre de notation ICP

```
Build a lead scoring framework for [PRODUCT NAME].

Target market: [description]
Sales motion: [PLG / inside sales / field sales / partner-led]

Define the scoring model:

FIRMOGRAPHIC FIT (50 points total):
- Company size: [define ranges and point values]
  e.g. 50-200 employees: 20 pts | 200-500: 15 pts | 500-2000: 10 pts | else: 0 pts
- Industry: [list target industries and weights]
  e.g. SaaS: 15 pts | FinTech: 12 pts | eCommerce: 10 pts | else: 0 pts
- Geography: [regions and weights]
  e.g. US/UK/CA/AU: 10 pts | EU: 7 pts | ROW: 3 pts
- Tech stack overlap: [tools that indicate fit]
  e.g. Uses Salesforce: +5 | Uses HubSpot: +5 | Uses Segment: +5 (max 15 pts)

INTENT SIGNALS (30 points total):
- Active job postings for roles your product helps: [weight]
- Recent funding round (<90 days): [weight]
- New exec hire in relevant department: [weight]
- Product launch announcement: [weight]
- Technology change signals (moved from X to Y): [weight]
- G2/Capterra review activity: [weight]

CONTACT FIT (20 points total):
- Title match to decision-maker: [weights by title]
  e.g. VP Sales / CRO: 15 pts | Director Sales: 12 pts | Sales Manager: 8 pts
- Seniority: [weights]
- LinkedIn connection degree: 2nd degree: +5 | 3rd: +2 | None: 0

NEGATIVE SIGNALS (deductions):
- Competitor employee: -50
- B2C company: -30
- <10 employees: -20
- Opted out previously: -100 (never contact)
- Recently closed-lost (< 60 days): -20
```

### Notation automatisée des leads (modèle de code)

```typescript
import { generateObject } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { z } from 'zod'

const LeadScore = z.object({
  score: z.number().min(0).max(100),
  tier: z.enum(['A', 'B', 'C', 'D']),
  topReasons: z.array(z.string()).max(3),     // why this score
  disqualifiers: z.array(z.string()).max(3),  // red flags
  recommendedAction: z.enum([
    'outreach_immediately',
    'add_to_sequence_this_week',
    'add_to_nurture',
    'disqualify',
    'needs_more_data',
  ]),
  missingData: z.array(z.string()),           // what data would improve accuracy
  confidenceLevel: z.enum(['high', 'medium', 'low']),
})

async function scoreLead(lead: RawLead, icp: ICPDefinition): Promise<ScoredLead> {
  // First: rule-based hard filters (instant disqualification)
  if (icp.negativeSignals.competitorDomains.includes(getDomain(lead.email))) {
    return { ...lead, score: 0, tier: 'D', topReasons: ['Competitor employee'], recommendedAction: 'disqualify' }
  }

  if (lead.optedOut) {
    return { ...lead, score: 0, tier: 'D', topReasons: ['Opted out'], recommendedAction: 'disqualify' }
  }

  // Then: Claude-based scoring for nuanced fit
  const { object } = await generateObject({
    model: anthropic('claude-haiku-4-5-20251001'), // Haiku — fast and cheap for bulk scoring
    schema: LeadScore,
    system: `You are a B2B sales qualification expert. Score leads 0-100 against the ICP.
Be precise. Reference specific firmographic and intent data.
A score should reflect BOTH fit (will they buy?) AND timing (will they buy NOW?).`,
    prompt: `Score this lead against our ICP.

ICP: ${JSON.stringify(icp, null, 2)}

Lead:
- Name: ${lead.name}
- Title: ${lead.title}
- Company: ${lead.company}
- Employees: ${lead.employees}
- Industry: ${lead.industry}
- Tech stack: ${lead.techStack?.join(', ') ?? 'unknown'}
- Geography: ${lead.country}
- LinkedIn: ${lead.linkedInUrl ?? 'unknown'}
- Recent signals: ${lead.signals?.map(s => s.description).join('; ') ?? 'none identified'}
- Last contacted: ${lead.lastContactedDaysAgo ? `${lead.lastContactedDaysAgo} days ago` : 'never'}`,
  })

  return { ...lead, ...object }
}

// Batch scoring — process 100 leads concurrently (with rate limiting)
async function scoreLeadList(leads: RawLead[], icp: ICPDefinition): Promise<ScoredLead[]> {
  const BATCH_SIZE = 10
  const results: ScoredLead[] = []

  for (let i = 0; i < leads.length; i += BATCH_SIZE) {
    const batch = leads.slice(i, i + BATCH_SIZE)
    const scored = await Promise.all(batch.map(lead => scoreLead(lead, icp)))
    results.push(...scored)
    console.log(`Scored ${Math.min(i + BATCH_SIZE, leads.length)}/${leads.length}`)
    await new Promise(r => setTimeout(r, 500)) // rate limit
  }

  return results.sort((a, b) => b.score - a.score)
}
```

### Routage des leads entrants (notation en temps réel)

```typescript
// Webhook: fires when a new lead fills out a form
app.post('/webhooks/new-lead', async (req, res) => {
  const formData = req.body // email, company, name, form fields

  // 1. Enrich the lead
  const enriched = await enrichLead(formData.email) // Apollo/Clearbit

  // 2. Score against ICP
  const scored = await scoreLead(enriched, ICP_CONFIG)

  // 3. Route based on tier
  switch (scored.tier) {
    case 'A':
      // Immediate: assign to senior SDR, trigger Slack alert
      await assignToSDR(scored, 'senior', priority: 'immediate')
      await postSlackAlert('#sdr-hot-inbound', scored)
      break

    case 'B':
      // Today: add to SDR queue, auto-enrol in sequence
      await assignToSDR(scored, 'standard', priority: 'today')
      await enrolInSequence(scored.email, 'inbound-b-tier')
      break

    case 'C':
      // Nurture: marketing automation takes over
      await enrolInSequence(scored.email, 'nurture-long')
      break

    case 'D':
      // Disqualify: log reason, no outreach
      await markDisqualified(scored.email, scored.topReasons)
      break
  }

  // 4. Update CRM
  await upsertHubSpotContact(scored.email, {
    icp_score: scored.score,
    icp_tier: scored.tier,
    qualification_reason: scored.topReasons.join('; '),
    lead_source: 'inbound_form',
  })

  res.json({ ok: true, tier: scored.tier, score: scored.score })
})
```

### Interprétation du score ICP

```
SCORE 90-100 — Tout arrêter. Rechercher ce compte aujourd'hui.
Ces comptes ont une adéquation quasi parfaite ET des déclencheurs actifs.
Règle : prise de contact dans les 24 heures. Ces fenêtres se ferment.

SCORE 75-89 — Fort. Ajouter à la séquence cette semaine.
Bonne adéquation, incertitude sur le timing. Recherche 10 minutes.
Règle : dans la séquence dans les 3 jours ouvrables.

SCORE 60-74 — Solide. Ça vaut la peine, pas urgent.
Adéquation raisonnable, nécessite un déclencheur pour progresser.
Règle : ajouter à la séquence automatisée, prioriser quand des déclencheurs apparaissent.

SCORE 40-59 — Marginal. Contact minimal uniquement.
Quelques signaux ICP mais critères clés manquants.
Règle : séquence automatisée uniquement. Aucune recherche manuelle.

SCORE <40 — Pas un fit. Ne pas contacter.
Trop de critères ICP manquants. La prise de contact ferait perdre du temps à tout le monde.
Règle : archiver, ne pas mettre en séquence, ne pas appeler.
```

### Vérificateur de qualité des données (avant la notation)

```
Before scoring this lead list, assess data quality.

[PASTE LEAD LIST]

Output:
- Total leads: [N]
- Leads with email: [N] ([%])
- Leads with company size: [N] ([%])
- Leads with industry: [N] ([%])
- Leads with tech stack: [N] ([%])
- Leads with title: [N] ([%])

Data gaps that most affect scoring accuracy:
1. [Most common missing field + how it affects the score]
2. [Second most common]

Recommendation: 
- Enrich [X] leads via [Apollo / Clearbit / manual] before scoring
- Score immediately with available data: [Y leads]
- Cannot score reliably: [Z leads — reason]
```

## Exemple

**Utilisateur :** J'ai 47 leads entrants d'un webinaire. Notez-les et dites-moi lesquels appeler aujourd'hui.

**Entrée (exemple) :**
```
Jane Smith, VP Operations, Acme Corp, 450 employees, B2B SaaS, uses Salesforce + Slack
Bob Lee, IT Manager, Local Bakery, 12 employees, Food & Beverage, unknown stack
Carol Wu, Head of Sales Ops, TechCo, 800 employees, FinTech, uses HubSpot + Intercom
```

**Résultat :**
| Lead | Entreprise | Score | Tier | Raison | Action |
|---|---|---|---|---|---|
| Carol Wu | TechCo | 88 | A | FinTech + 800 employés + utilisatrice HubSpot + Head of Sales Ops = ICP parfait | Appeler aujourd'hui |
| Jane Smith | Acme Corp | 74 | B | Bonne taille et vertical SaaS, utilisatrice Salesforce, mais rôle Opérations = pas l'acheteur principal | Mettre en séquence cette semaine |
| Bob Lee | Local Bakery | 12 | D | <50 employés, mauvaise industrie, mauvais rôle | Disqualifier |

**Liste d'appels du jour (tier A) :** 8 leads → appeler avant 11h. Carol Wu est n°1.
**Séquences de la semaine (tier B) :** 23 leads → inscrire d'ici vendredi.
**Disqualifiés (tier D) :** 11 leads → archivés.

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous créons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
