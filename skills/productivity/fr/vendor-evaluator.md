---
name: vendor-evaluator
description: "Cadre d'évaluation des fournisseurs : modèle RFI/RFP, grille de notation, matrice de comparaison, mémo de recommandation"
---

# Compétence Évaluateur de Fournisseurs

## Quand activer
- Évaluation de 2 fournisseurs ou plus pour toute décision significative concernant un logiciel, un service ou un prestataire
- Construction d'une grille de notation avant les démonstrations ou les appels de référence pour garantir une évaluation cohérente
- Rédaction d'un RFI ou RFP à envoyer à des fournisseurs potentiels
- Synthèse des propositions de fournisseurs dans une matrice de comparaison pour une décision
- Rédaction d'un mémo de recommandation de fournisseur pour la direction ou un conseil d'administration
- Réalisation d'un examen de renouvellement d'une relation fournisseur existante

## Quand NE PAS utiliser
- Achat d'un outil peu coûteux sans véritable alternative (par exemple, un seul outil SaaS à 50 $/mois) — achetez-le simplement
- Quand la décision est déjà prise et que vous la rationalisez — soyez honnête
- Négociation contractuelle juridique — c'est le rôle du service juridique avec le contexte fournisseur ; cette compétence aide à cadrer et comparer, pas à négocier
- Évaluation de candidats à un poste — utilisez plutôt une grille de recrutement

## Instructions

### Générateur de modèle RFP complet

```
Write an RFP (Request for Proposal) for the following procurement.

What we're buying: [describe — software, service, supplier, etc.]
Our company: [size, industry, relevant context]
Budget range: [or "not disclosed"]
Decision timeline: [when we need to decide]
Primary use case: [what problem this solves]
Current solution (if any): [what we're replacing or supplementing]
Must-have requirements: [non-negotiables]
Nice-to-have requirements: [differentiators]
Stakeholders who'll use it: [roles and team sizes]
Integration requirements: [what it must connect to]

Produce a complete RFP covering:

## Section 1: Company Overview and Project Scope
Brief description of our company and what we're trying to accomplish.

## Section 2: Requirements
2.1 Functional requirements (must-have)
2.2 Technical requirements (integrations, security, compliance)
2.3 Commercial requirements (pricing model, contract terms, SLA)

## Section 3: Questions for Vendors
At least 20 specific questions covering:
- Product capabilities and roadmap
- Implementation and onboarding
- Support and SLA
- Security and compliance (SOC2, GDPR, etc.)
- Pricing and total cost of ownership
- Customer references (ask for 2 in our industry)

## Section 4: Evaluation Criteria
State how we'll score responses (weights add to 100):
- Functional fit: [weight]%
- Technical fit: [weight]%
- Vendor stability and support: [weight]%
- Pricing and TCO: [weight]%
- Implementation risk: [weight]%

## Section 5: Proposal Format
What vendors must submit, by when, and to whom.

## Section 6: Timeline
Key dates: RFP sent, Q&A deadline, proposals due, demos, decision.
```

### Grille de notation des fournisseurs

```
Build a vendor scoring rubric for evaluating [CATEGORY] vendors.

Shortlisted vendors: [list names — e.g., Vendor A, Vendor B, Vendor C]
Decision criteria (give your weights or I'll suggest them):
- [Criterion 1]: [weight if known]
- [Criterion 2]: [weight if known]
- [add more as needed]

Output a scoring rubric with:

1. Criteria breakdown (weights must total 100)
   For each criterion:
   - What a score of 1 looks like (poor)
   - What a score of 3 looks like (acceptable)
   - What a score of 5 looks like (excellent)

2. Scoring sheet (fill in during demos/review)
   | Criterion | Weight | Vendor A | Vendor B | Vendor C |
   | [criterion] | [X]% | [score 1-5] | [score 1-5] | [score 1-5] |

3. Weighted total formula:
   Total = Σ (score × weight/100)
   Minimum acceptable score: [threshold — e.g., 3.5/5]

4. Knockout criteria (any vendor failing these is automatically disqualified):
   - [e.g., Must be SOC 2 Type II certified]
   - [e.g., Must support SSO via SAML]
   - [e.g., Must have < 4 hour response SLA for critical issues]
```

### Matrice de comparaison des fournisseurs

```
Build a vendor comparison matrix from the following proposals/demos.

Vendors evaluated: [list]
Evaluation criteria: [list or paste your scoring rubric]

For each vendor, here's what we learned:
Vendor A: [paste notes, proposal summary, or key facts]
Vendor B: [paste notes, proposal summary, or key facts]
Vendor C: [paste notes, proposal summary, or key facts]

Produce:

## Scoring Summary
| Criterion | Weight | Vendor A | Vendor B | Vendor C |
(populate with numeric scores 1-5 per criterion)

## Weighted Totals
Vendor A: [X.X/5]
Vendor B: [X.X/5]
Vendor C: [X.X/5]

## Head-to-Head Analysis
For each criterion where vendors differ by > 1 point:
- Who scored higher and why
- Whether the gap matters for our use case

## Risk Register
For each vendor:
- Top implementation risk
- Top commercial risk (lock-in, pricing model, startup risk)
- Mitigation recommendation

## Hidden Costs
What vendors typically don't include in headline pricing:
- Implementation/onboarding
- Training and change management
- Integrations (custom development)
- Annual price escalation clauses
- Overage fees

Estimate true 3-year TCO for each vendor.
```

### Mémo de recommandation de fournisseur

```
Write a vendor recommendation memo for our leadership team.

Decision: [what we're buying]
Options evaluated: [vendor names]
Recommended vendor: [your preference — or ask Claude to recommend]
Decision timeline: [when we need to decide to meet [DEADLINE]]

Include:
1. Executive summary (3 sentences: what we evaluated, who we recommend, why)
2. Evaluation process (how many vendors, what criteria, who participated)
3. Comparison summary (table: key criteria, scores, winner per criterion)
4. Recommendation rationale (top 3 reasons for the recommended vendor)
5. Risk acknowledgement (what could go wrong and how we'll mitigate it)
6. Next steps (contract negotiation, legal review, implementation kickoff)
7. Decision deadline and consequence of delay

Format: professional memo, suitable for a CEO or board. No jargon. 1 page max.
```

### Script de vérification des références

```
Generate a reference check script for [VENDOR NAME].

Our use case: [describe]
Our company context: [size, industry]
Reference contact: [their role at the reference company]

Questions to ask (30-minute call):
1. Context setter: "How long have you been using [Vendor], and what's your primary use case?"
2. Implementation: "How long did implementation take, and were there surprises?"
3. ROI: "Have you achieved the outcomes you expected? Any data you can share?"
4. Support: "When things go wrong, how responsive is their support team?"
5. Product quality: "What's the #1 thing you wish were better?"
6. Relationship: "Do you feel like a priority customer, or are you left to self-serve?"
7. Commercial: "Any pricing surprises at renewal? Did they negotiate?"
8. Recommendation: "Knowing what you know now, would you sign again?"
9. Red flag check: "Is there anything you'd want us to know before we sign?"

After the call, score the reference:
- Enthusiastic advocate: +2 (they offered to be a public reference)
- Positive but measured: +1 (satisfied, no regrets)
- Neutral: 0 (uses it, doesn't love it)
- Cautious: -1 (has concerns they'd want to share)
- Would not re-sign: -2 (walk away from this vendor)
```

### Cadre d'évaluation de renouvellement

```
Evaluate our existing vendor relationship with [VENDOR] for upcoming renewal.

Contract renewal date: [date]
Current annual spend: [$X]
Usage period: [X years]
Current satisfaction level: [1-5]

Review dimensions:
1. ROI achieved: Have we gotten the value we signed for? (quantify if possible)
2. Usage: Are we using the product? What % of licensed seats/features active?
3. Support quality: NPS or incidents — any pattern of poor support?
4. Product development: Has the vendor shipped meaningful improvements in the last year?
5. Market alternatives: Has the competitive landscape changed? Better options available?
6. Pricing: Is current pricing still market-competitive? What's the ask at renewal?

Outputs:
- Stay / Renegotiate / Replace recommendation
- Negotiation leverage points (if staying)
- Switching cost estimate (if replacing)
- 3 things to demand in renewal terms
```

### Référence de type grille de notation

```typescript
interface VendorCriterion {
  name: string
  weight: number        // must sum to 100 across all criteria
  knockout: boolean     // if true, vendor fails if score < threshold
  knockoutThreshold?: number  // minimum passing score (1-5 scale)
  description: string
  scoringGuide: {
    score1: string    // what poor looks like
    score3: string    // what acceptable looks like
    score5: string    // what excellent looks like
  }
}

interface VendorScore {
  vendorName: string
  scores: Record<string, number>  // criterion name → score (1-5)
  weightedTotal: number           // Σ(score × weight/100)
  passesKnockouts: boolean
  risks: string[]
  tcoYear3: number
}

// Standard criteria weights for SaaS evaluation
const DEFAULT_SAAS_WEIGHTS = {
  functionalFit: 30,
  technicalFit: 20,
  vendorStability: 15,
  pricing: 20,
  implementationRisk: 15,
}
```

## Exemple

**Utilisateur :** Nous choisissons entre trois systèmes HRIS — BambooHR, Rippling et Workday. Nous sommes une entreprise SaaS B2B de 200 personnes. Aidez-moi à les évaluer.

**Résultat :**

```
## Knockout Criteria (any failure = disqualify)
- SOC 2 Type II certification: All three pass
- HRIS + Payroll in single platform: BambooHR (payroll add-on, separate) — flag
- API access for HubSpot integration: All three pass
- US + EU payroll support: Workday (yes), Rippling (yes), BambooHR (US only) — eliminates BambooHR for EU

## Scoring Rubric (200-person B2B SaaS)
| Criterion | Weight | BambooHR | Rippling | Workday |
|---|---|---|---|---|
| Functional fit (HR, payroll, benefits) | 30% | 3.5 | 4.5 | 4.0 |
| Technical fit (integrations, API) | 20% | 3.0 | 4.5 | 3.5 |
| Ease of use (HR admin + employee) | 15% | 4.5 | 4.0 | 2.5 |
| Vendor stability & support | 15% | 3.5 | 3.5 | 5.0 |
| Pricing & TCO | 20% | 4.5 | 3.5 | 2.0 |

## Weighted Totals
- BambooHR: 3.70/5 (FAILS EU knockout)
- Rippling: 4.10/5
- Workday: 3.38/5

## Recommendation: Rippling
Reasons: Best functional coverage, strongest integrations, passes all knockouts.
Risk: Higher price escalation at renewal — negotiate a 3-year price cap clause.

## 3-Year TCO Estimate
- Rippling: $180k (including implementation)
- Workday: $420k (implementation cost is 2x first-year licence)
- BambooHR: Disqualified
```

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous construisons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
