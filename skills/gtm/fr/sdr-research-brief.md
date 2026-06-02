---
name: sdr-research-brief
description: "Dossier de compte en 30 secondes pour les SDR : aperçu de l'entreprise, déclencheurs récents, signaux d'achat, carte des parties prenantes et angle de prospection personnalisé — à partir d'une URL ou d'un nom d'entreprise"
---

# Compétence de brief de recherche SDR

## Quand activer
- Vous avez besoin d'un brief de compte complet avant d'écrire une prospection à froid
- Vous avez un nom d'entreprise ou une URL et souhaitez des déclencheurs, des signaux et des parties prenantes en moins d'une minute
- Préparation d'un appel à froid avec besoin de points de discussion + objections probables
- Construction d'une liste de comptes cibles et souhait de prioriser par adéquation + timing
- Recherche sur une entreprise qui vient d'interagir avec votre contenu ou de réserver un rendez-vous

## Quand NE PAS utiliser
- Vous avez déjà un contexte de compte approfondi d'un AE précédent ou dans le CRM
- Enrichissement en masse de 50+ comptes à la fois — utilisez plutôt la compétence `/lead-enrichment`
- Cibles grand public/B2C — signaux et méthodes de recherche différents
- Quand vous avez uniquement besoin de personnalisation d'email — utilisez `/sdr-agent` directement

## Instructions

### Prompt de brief de compte principal

```
Generate an SDR account brief for [COMPANY NAME / URL].

My product: [what you sell in one sentence]
My ICP: [ideal customer profile — size, industry, role, pain]

Produce:

## 1. Company snapshot (30 seconds)
- What they do (1 sentence, no jargon)
- Size: headcount, revenue estimate, funding stage
- HQ and main markets
- Tech stack signals (from job posts, BuiltWith, G2 reviews)
- Business model: PLG / sales-led / self-serve / enterprise

## 2. Recent triggers (why reach out NOW — not 6 months ago)
Scan for:
- Funding round in last 90 days → budget unlocked
- Exec hire (new VP Sales, CRO, CFO) → new buyer with mandate to change
- Product launch → scaling mode, new hiring
- Layoffs → efficiency mandate, cost-cutting
- Acquisition → integration pain, new tech stack needs
- Job posts for roles your product removes or improves

## 3. ICP fit score (0-100)
Score against these dimensions:
- Company size fit: [weight 25]
- Industry fit: [weight 20]
- Tech stack overlap: [weight 20]
- Trigger/timing: [weight 25]
- Decision-maker accessibility: [weight 10]

## 4. Stakeholder map
Identify 3 people to contact (Champion, Economic Buyer, Blocker):
- Name, title, LinkedIn URL (if public)
- Why they care about your product
- Best channel to reach them
- Recent activity or post to reference

## 5. Personalised outreach angle
- The ONE hook that makes this outreach relevant right now
- Suggested subject line (A/B variant)
- First sentence draft (not generic — reference specific trigger)
- Objection they will likely raise first
```

### Brief rapide (style CLI — moins de 10 secondes)

```
Quick SDR brief — [COMPANY]:
- What they do: [1 sentence]
- Trigger: [the most recent signal — fund raise, exec hire, job post]
- Who to contact: [name, title]
- Opening hook: [1 sentence referencing the trigger]
- Risk: [what might make them NOT a fit]
```

### Cadre de recherche de déclencheurs

Utilisez ceci pour trouver des signaux que Claude peut rechercher :

```typescript
interface TriggerSignal {
  type: 'funding' | 'exec_hire' | 'product_launch' | 'layoffs' | 'acquisition' | 'hiring_surge' | 'tech_change'
  recency: number // days ago
  relevance: number // 0-1, how relevant is this to your product
  hook: string // how to reference it in outreach
}

const TRIGGER_SOURCES = [
  'Crunchbase / TechCrunch — funding rounds',
  'LinkedIn — exec hires in last 90 days',
  'Company blog — product announcements',
  'LinkedIn Jobs — open roles (signal: 10+ eng roles = growth)',
  'G2 / Capterra reviews — what tools they use and hate',
  'Glassdoor — culture signals, tech stack mentions',
  'SEC filings — public companies only, use earnings calls for pain points',
  'Reddit/HN — if technical founders, check what they complain about',
]

// Priority order: funding > exec hire > product launch > layoffs > hiring surge > tech change
// Older than 90 days: deprioritise — timing has passed
```

### Prompt de cartographie des parties prenantes

```
Map the buying committee for [COMPANY] for a [PRODUCT CATEGORY] purchase.

Typical roles in this buying decision:
- Champion (uses the product daily, advocates internally)
- Economic Buyer (signs the contract, cares about ROI)
- Technical Evaluator (assesses security, integration, scalability)
- Blocker (legal, finance, IT — can kill deals)

For each role:
1. Who at [COMPANY] likely fills it? (name if findable on LinkedIn)
2. What do they care most about?
3. What objection do they raise?
4. What message gets them to say yes?

Output a table: Role | Name | Title | Pain | Message | Objection
```

### Grille de notation ICP (à personnaliser par produit)

```
ICP Scoring — [PRODUCT NAME]

COMPANY SIZE (25 pts):
- 50-500 employees: 25 pts
- 500-2000: 15 pts
- <50 or >2000: 5 pts

INDUSTRY (20 pts):
- Target verticals [list yours]: 20 pts
- Adjacent: 10 pts
- Outside: 0 pts

TECH STACK (20 pts):
- Uses [your integration partners]: +5 pts each, max 20
- Uses direct competitor: -10 pts (harder sale, but possible)

TRIGGER (25 pts):
- Funding in 90 days: 25 pts
- Exec hire in 90 days: 20 pts
- Product launch: 15 pts
- Hiring surge (>20% headcount growth): 15 pts
- No recent trigger: 5 pts

DECISION-MAKER ACCESS (10 pts):
- Direct LinkedIn connection to buyer: 10 pts
- 2nd-degree connection: 7 pts
- No connection: 3 pts

TOTAL: /100
- 80+: Priority 1 — personalised outreach immediately
- 60-79: Priority 2 — sequence within 2 weeks
- 40-59: Priority 3 — nurture
- <40: Not a fit — skip
```

### Modèle de résultat de recherche

```markdown
# Account Brief: [COMPANY] — [DATE]

## Snapshot
[Company] is a [description]. [Employees] employees. [Funding stage].
Primary market: [geography + segment]. Tech stack: [key tools].

## Why Now (Trigger)
[TRIGGER TYPE] — [specific event, date, source].
Relevance: [how this connects to your product/pain point].

## ICP Score: [X]/100
- Size: [X/25] | Industry: [X/20] | Stack: [X/20] | Trigger: [X/25] | Access: [X/10]

## Who to Contact
| Role | Name | Title | LinkedIn | Priority |
|---|---|---|---|---|
| Champion | [Name] | [Title] | [URL] | 1st |
| Economic Buyer | [Name] | [Title] | [URL] | 2nd |
| Blocker | [Name] | [Title] | [URL] | FYI |

## Outreach Angle
Hook: [the specific trigger-based hook]
Subject: [A version] / [B version]
Opening: [First sentence referencing the hook — not generic]
Likely objection: [What they'll push back on first]
```

## Exemple

**Utilisateur :** Donnez-moi un brief de compte sur Vercel. Je vends un outil d'observabilité B2B pour les performances frontend.

**Résultat :**
```markdown
# Account Brief: Vercel — Juin 2026

## Snapshot
Vercel est une plateforme cloud pour les développeurs frontend, utilisée par plus d'1 million de développeurs dans le monde.
~1 200 employés. Série E (150 M$, 2023). Siège : San Francisco. Stack : Next.js (propre),
Turborepo, Datadog, PagerDuty, Segment.

## Why Now (Trigger)
NOUVEAU RECRUTEMENT EXÉCUTIF — VP of Platform Engineering recruté chez Cloudflare (LinkedIn, il y a 14 jours).
Les nouveaux responsables de plateforme auditent généralement les outils de monitoring dans leurs 90 premiers jours.
Pertinence : La scale de Vercel (millions de déploiements/jour) crée une complexité de latence frontend
que leur stack actuelle (Datadog) n'optimise pas.

## ICP Score: 88/100
- Size: 25/25 | Industry: 20/20 | Stack: 15/20 | Trigger: 25/25 | Access: 3/10

## Who to Contact
| Rôle | Nom | Titre | LinkedIn | Priorité |
|---|---|---|---|---|
| Champion | [VP Platform] | VP Platform Engineering | [URL] | 1er |
| Economic Buyer | [CTO] | CTO | [URL] | 2ème |
| Blocker | [IT/Security] | Head of Security | [URL] | Pour info |

## Outreach Angle
Accroche : Nouveau VP Platform à votre échelle — Datadog ne montre pas la latence frontend par nœud edge
Objet A : « Observabilité frontend à l'échelle de Vercel » / Objet B : « Comment [X] a réduit la latence p95 de 40% »
Ouverture : « Félicitations pour le recrutement du VP Platform — les équipes à votre échelle trouvent généralement lors de l'audit des 90 premiers jours
des lacunes dans l'observabilité spécifique au frontend que les outils APM généraux comme Datadog ne couvrent pas. »
Objection probable : « Nous avons déjà Datadog / nous avons construit cela en interne »
```

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous créons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
