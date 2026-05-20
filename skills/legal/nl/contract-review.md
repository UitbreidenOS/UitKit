---
name: contract-review
description: "AI-contractbeoordeling: risicovlaggen (GREEN/YELLOW/RED), NDA-selectie, leveranciercontractcontrole, schadevergoeding en aansprakelijkheidsbeperkingsanalyse — Claude Legal Plugin-patronen"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../contract-review.md).

# Skill voor Contractbeoordeling

## Wanneer activeren
- Beoordeling van een leveranciercontract, SaaS-overeenkomst of NDA op rode vlaggen
- Vlaggen van ontbrekende clausules die in een contract horen
- Vergelijking van contracttermijnen met een reeks aanvaardbare standpunten
- Selectie van een batch NDA's om te identificeren welke juridische aandacht nodig hebben
- Begrijpen wat een specifieke contractclausule in eenvoudig Nederlands betekent

## Wanneer NIET te gebruiken
- Rechtshulp specifiek voor jurisdictie — Claude identificeert problemen, een advocaat geeft advies
- Gerechtelijke indieningen, gerechtelijke documenten of regelgevingsinzendingen
- Realtime juridische besluiten — Claude assisteert menselijke beoordeling, vervangt het niet

## BELANGRIJK: AI-beperkingen bij contracten

Claude kan patronen identificeren, problemen vlaggen en clausules uitleggen. Het kan niet: juridisch advies geven, rechtsnormen voor specifieke jurisdicties uitleggen, of garanderen dat alle problemen zijn opgemerkt. Laat altijd een advocaat hoog-waardige contracten beoordelen.

## Instructies

### Het beoordelingskader (GREEN / YELLOW / RED)

```typescript
type RiskLevel = 'GREEN' | 'YELLOW' | 'RED'

interface ContractIssue {
  clause:       string        // De specifieke clausuletekst
  section:      string        // Waar in het document (bijv. "Sectie 8.2")
  risk:         RiskLevel
  issue:        string        // Wat het probleem is
  impact:       string        // Wat zou kunnen gebeuren
  suggestion:   string        // Hoe het op te lossen
}

// RED  = blokkering — moet vóór ondertekening worden opgelost
// YELLOW = onderhandelen — terugdrukken maar geen dealbreaker
// GREEN = acceptabel — standaard marktvoorwaarden
```

### Beoordeling van een contract met Claude

```typescript
import { generateObject } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { z } from 'zod'
import fs from 'fs'

const IssueSchema = z.object({
  section:    z.string(),
  clause:     z.string(),
  risk:       z.enum(['RED', 'YELLOW', 'GREEN']),
  issue:      z.string(),
  impact:     z.string(),
  suggestion: z.string(),
})

const ReviewSchema = z.object({
  summary:          z.string(),
  overallRisk:      z.enum(['HIGH', 'MEDIUM', 'LOW']),
  issues:           z.array(IssueSchema),
  missingClauses:   z.array(z.string()),
  recommendation:   z.string(),
})

async function reviewContract(contractPath: string, context: ReviewContext) {
  const contractText = fs.readFileSync(contractPath, 'utf-8')

  const { object } = await generateObject({
    model: anthropic('claude-opus-4-7'),
    schema: ReviewSchema,
    system: `You are a contract review assistant. Your job is to identify risks, flag problematic clauses, and note missing protections. Be specific and cite exact clause language. Focus on practical business impact, not legal technicalities.`,
    prompt: `Review this ${context.contractType} contract from a ${context.ourRole} perspective.

Our key concerns: ${context.concerns.join(', ')}
Our position: ${context.companySize}, ${context.industry}

CONTRACT:
${contractText}

Flag all issues with GREEN/YELLOW/RED risk ratings. RED = blocking/unacceptable, YELLOW = negotiate, GREEN = acceptable.`,
  })

  return object
}
```

### NDA-selectie

```typescript
async function triageNDA(ndaText: string): Promise<NDATriage> {
  const { object } = await generateObject({
    model: anthropic('claude-opus-4-7'),
    schema: z.object({
      ndaType:            z.enum(['mutual', 'one_way_us', 'one_way_them']),
      term:               z.string(),          // "2 years", "indefinite"
      scopeIssues:        z.array(z.string()), // overly broad definitions
      exclusions:         z.array(z.string()), // what's excluded from confidentiality
      redFlags:           z.array(z.string()),
      requiresLawyerReview: z.boolean(),
      summary:            z.string(),
    }),
    prompt: `Triage this NDA. Identify: type (mutual/one-way), term, any overly broad scope definitions, missing standard exclusions (public info, prior knowledge, independent development), and any unusual restrictions on disclosure.

NDA TEXT:
${ndaText}`,
  })

  return object
}
```

### Veelvoorkomende rode vlaggen om te controleren

```typescript
const RED_FLAG_PATTERNS = [
  {
    name: 'Onbeperkte schadevergoeding',
    check: (text: string) => /indemnif.*without.*limit|unlimited.*indemnif/i.test(text),
    impact: 'Onbeperkte financiële blootstelling — u kunt veel meer schuldig zijn dan de contractwaarde',
  },
  {
    name: 'Geen aansprakelijkheidsbeperkingen',
    check: (text: string) => !/(limitation|limit).*liability/i.test(text),
    impact: 'Geen plafond op schadevergoeding — elke schending kan leiden tot onbeperkte aansprakelijkheid',
  },
  {
    name: 'Automatische verlenging zonder kennisgeving',
    check: (text: string) => /auto.*renew.*without.*notice|renew.*unless.*cancel/i.test(text),
    impact: 'Kan voor nog een termijn worden vergrendeld zonder het te merken',
  },
  {
    name: 'IP-eigendom over uw invoer',
    check: (text: string) => /intellectual property.*all.*work|assign.*all.*ip/i.test(text),
    impact: 'U kunt eigendom verliezen van materialen die u maakt',
  },
  {
    name: 'Eenzijdige wijziging',
    check: (text: string) => /reserves.*right.*modify|may.*change.*terms.*without.*notice/i.test(text),
    impact: 'Leverancier kan voorwaarden zonder uw toestemming wijzigen',
  },
  {
    name: 'Toepasselijk recht in ongunstige jurisdictie',
    check: (text: string, ourJurisdiction: string) => {
      const match = text.match(/governed by.*law.*of ([\w\s]+)/i)
      return match ? !match[1].includes(ourJurisdiction) : false
    },
    impact: 'Geschillen moeten onder vreemd recht worden opgelost — duur en onpraktisch',
  },
]
```

### Batchverwerking van contracten

```typescript
async function processContractBatch(contracts: ContractFile[]): Promise<BatchReport> {
  const results = []

  for (const contract of contracts) {
    console.log(`Reviewing: ${contract.name}`)

    const review = await reviewContract(contract.path, {
      contractType: contract.type,
      ourRole: 'customer',
      concerns: ['IP ownership', 'data protection', 'liability', 'termination'],
      companySize: 'startup',
      industry: 'SaaS',
    })

    results.push({
      contract: contract.name,
      risk:     review.overallRisk,
      redCount: review.issues.filter(i => i.risk === 'RED').length,
      summary:  review.summary,
      requiresLawyer: review.overallRisk === 'HIGH',
    })
  }

  // Sorteren op risico — advocaat controleert eerst hoogste risico
  return {
    results: results.sort((a, b) => a.risk === 'HIGH' ? -1 : 1),
    highRiskCount: results.filter(r => r.risk === 'HIGH').length,
  }
}
```

### Clausuleverklaring (eenvoudige taal)

```typescript
async function explainClause(clauseText: string): Promise<string> {
  const { text } = await generateText({
    model: anthropic('claude-opus-4-7'),
    prompt: `Explain this contract clause in plain language. What does it mean for a non-lawyer? What are the practical implications?

CLAUSE: "${clauseText}"

Explain in 2-3 sentences as if speaking to a business owner, not a lawyer.`,
  })
  return text
}
```

## Voorbeeld

**Gebruiker:** Controleer een SaaS-leveranciersakkoord (PDF/tekst), vlag alle RED-problemen die we moeten oplossen, YELLOW-problemen om over te onderhandelen, en samenvatting wat er ontbreekt — uitvoer als gestructureerd rapport.

**Verwachte uitvoer:**
```
CONTRACTBEOORDELINGSRAPPORT
Algemeen risico: HOOG

🔴 RED (3 problemen — moeten vóór ondertekening worden opgelost)
  Sectie 12.1 — Onbeperkte schadevergoeding
  Clausule: "Klant zal Leverancier schadevergoeding betalen voor alle vorderingen, verliezen en kosten..."
  Probleem: Geen plafond op schadevergoeding — onbeperkte financiële blootstelling
  Oplossing: Voeg toe "niet te overschrijden de vergoedingen betaald in de 12 maanden voorafgaand aan de vordering"

🟡 YELLOW (2 problemen — onderhandelen)
  Sectie 8.3 — Automatische verlenging met 60-daagse opzeggingseis
  ...

🟢 GREEN (8 clausules — acceptabele standaardvoorwaarden)

ONTBREKENDE CLAUSULES:
  - Geen gegevensverwerkingsovereenkomst (vereist onder GDPR)
  - Geen SLA voor uptime-garanties
  - Geen gegensdeletingclausule bij beëindiging

AANBEVELING: Niet ondertekenen tot RED-problemen zijn opgelost. Met redlines terugsturen.
```

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — wij bouwen AI-producten en B2B-oplossingen met ontwikkelaargemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
