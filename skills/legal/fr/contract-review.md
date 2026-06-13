---
name: contract-review
description: "AI contract review: risk flagging (GREEN/YELLOW/RED), NDA triage, vendor contract checks, indemnity and limitation analysis — Claude Legal Plugin patterns"
---

> 🇫🇷 Version française. [English version](../contract-review.md).

# Compétence Révision de Contrats

## Quand activer
- Réviser un contrat fournisseur, un accord SaaS ou un NDA pour les signaux d'alarme
- Identifier les clauses manquantes qui devraient figurer dans un contrat
- Comparer les termes du contrat par rapport à un ensemble de positions acceptables
- Trier un lot de NDAs pour identifier ceux nécessitant l'attention d'un avocat
- Comprendre ce que signifie une clause spécifique en langage clair

## Quand NE PAS utiliser
- Conseils juridiques spécifiques à une juridiction — Claude identifie les problèmes, un avocat conseille
- Dépôts judiciaires, documents de contentieux ou soumissions réglementaires
- Décisions juridiques en temps réel — Claude assiste la révision humaine, ne la remplace pas

## IMPORTANT : Limites de l'IA sur les contrats

Claude peut identifier des modèles, signaler des problèmes et expliquer des clauses. Il ne peut pas : donner des conseils juridiques, interpréter le droit spécifique à une juridiction, ou garantir qu'il a détecté tous les problèmes. Faites toujours réviser les contrats à haute valeur par un avocat.

## Instructions

### Le cadre de révision (VERT / JAUNE / ROUGE)

```typescript
type RiskLevel = 'GREEN' | 'YELLOW' | 'RED'

interface ContractIssue {
  clause:       string        // Le texte spécifique de la clause
  section:      string        // Emplacement dans le document (ex. "Section 8.2")
  risk:         RiskLevel
  issue:        string        // Quel est le problème
  impact:       string        // Ce qui pourrait arriver
  suggestion:   string        // Comment le corriger
}

// ROUGE   = bloquant — doit être corrigé avant la signature
// JAUNE   = à négocier — pousser à réviser mais pas un point de rupture
// VERT    = acceptable — termes standards du marché
```

### Réviser un contrat avec Claude

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

### Triage de NDA

```typescript
async function triageNDA(ndaText: string): Promise<NDATriage> {
  const { object } = await generateObject({
    model: anthropic('claude-opus-4-7'),
    schema: z.object({
      ndaType:            z.enum(['mutual', 'one_way_us', 'one_way_them']),
      term:               z.string(),          // "2 ans", "indéfini"
      scopeIssues:        z.array(z.string()), // définitions trop larges
      exclusions:         z.array(z.string()), // ce qui est exclu de la confidentialité
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

### Signaux d'alarme courants à vérifier

```typescript
const RED_FLAG_PATTERNS = [
  {
    name: 'Indemnisation non plafonnée',
    check: (text: string) => /indemnif.*without.*limit|unlimited.*indemnif/i.test(text),
    impact: 'Exposition financière illimitée — vous pourriez devoir bien plus que la valeur du contrat',
  },
  {
    name: 'Pas de limitation de responsabilité',
    check: (text: string) => !/(limitation|limit).*liability/i.test(text),
    impact: 'Pas de plafond sur les dommages — toute violation pourrait entraîner une responsabilité illimitée',
  },
  {
    name: 'Renouvellement automatique sans préavis',
    check: (text: string) => /auto.*renew.*without.*notice|renew.*unless.*cancel/i.test(text),
    impact: 'Pourrait être bloqué pour une autre période sans s\'en rendre compte',
  },
  {
    name: 'Propriété IP sur vos contributions',
    check: (text: string) => /intellectual property.*all.*work|assign.*all.*ip/i.test(text),
    impact: 'Vous pourriez perdre la propriété des matériaux que vous créez',
  },
  {
    name: 'Modification unilatérale',
    check: (text: string) => /reserves.*right.*modify|may.*change.*terms.*without.*notice/i.test(text),
    impact: 'Le fournisseur peut modifier les termes sans votre consentement',
  },
  {
    name: 'Droit applicable dans une juridiction défavorable',
    check: (text: string, ourJurisdiction: string) => {
      const match = text.match(/governed by.*law.*of ([\w\s]+)/i)
      return match ? !match[1].includes(ourJurisdiction) : false
    },
    impact: 'Les litiges doivent être résolus selon un droit étranger — coûteux et peu pratique',
  },
]
```

### Traitement par lots de contrats

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

  // Trier par risque — l'avocat révise les risques les plus élevés en premier
  return {
    results: results.sort((a, b) => a.risk === 'HIGH' ? -1 : 1),
    highRiskCount: results.filter(r => r.risk === 'HIGH').length,
  }
}
```

### Explication de clause (en langage clair)

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

## Exemple

**Utilisateur :** Réviser un accord SaaS fournisseur (PDF/texte), identifier tous les problèmes ROUGES à corriger, les problèmes JAUNES à négocier, et résumer ce qui manque — sortie sous forme de rapport structuré.

**Résultat attendu :**
```
RAPPORT DE RÉVISION DE CONTRAT
Risque global : ÉLEVÉ

🔴 ROUGE (3 problèmes — à corriger avant signature)
  Section 12.1 — Indemnisation non plafonnée
  Clause : "Customer shall indemnify Vendor for all claims, losses, and expenses..."
  Problème : Pas de plafond sur l'indemnisation — exposition financière illimitée
  Correction : Ajouter "not to exceed the fees paid in the 12 months preceding the claim"

🟡 JAUNE (2 problèmes — à négocier)
  Section 8.3 — Renouvellement automatique avec préavis de 60 jours
  ...

🟢 VERT (8 clauses — termes standards acceptables)

CLAUSES MANQUANTES :
  - Pas d'accord de traitement des données (requis par le RGPD)
  - Pas de SLA pour les garanties de disponibilité
  - Pas de clause de suppression des données à la résiliation

RECOMMANDATION : Ne pas signer avant que les problèmes ROUGES soient résolus. Renvoyer avec des modifications surlignées.
```

---
