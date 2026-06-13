---
name: "contract-review"
description: "AI contract review: risk flagging (GREEN/YELLOW/RED), NDA triage, vendor contract checks, indemnity and limitation analysis — Claude Legal Plugin patterns"
---

# Contract Review Skill

## When to activate
- Reviewing a vendor contract, SaaS agreement, or NDA for red flags
- Flagging missing clauses that should be in a contract
- Comparing contract terms against a set of acceptable positions
- Triaging a batch of NDAs to identify which need lawyer attention
- Understanding what a specific clause means in plain language

## When NOT to use
- Jurisdiction-specific legal advice — Claude identifies issues, a lawyer advises
- Court filings, litigation documents, or regulatory submissions
- Real-time legal decisions — Claude assists human review, doesn't replace it

## IMPORTANT: AI limitations on contracts

Claude can identify patterns, flag issues, and explain clauses. It cannot: give legal advice, interpret jurisdiction-specific law, or guarantee it has caught every issue. Always have a lawyer review high-value contracts.

## Instructions

### The review framework (GREEN / YELLOW / RED)

```typescript
type RiskLevel = 'GREEN' | 'YELLOW' | 'RED'

interface ContractIssue {
  clause:       string        // The specific clause text
  section:      string        // Where in the document (e.g. "Section 8.2")
  risk:         RiskLevel
  issue:        string        // What the problem is
  impact:       string        // What could happen
  suggestion:   string        // How to fix it
}

// RED  = blocking — must fix before signing
// YELLOW = negotiate — push back but not a dealbreaker
// GREEN = acceptable — standard market terms
```

### Reviewing a contract with Claude

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

### NDA triage

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

### Common red flags to check

```typescript
const RED_FLAG_PATTERNS = [
  {
    name: 'Uncapped indemnification',
    check: (text: string) => /indemnif.*without.*limit|unlimited.*indemnif/i.test(text),
    impact: 'Unlimited financial exposure — you could owe far more than the contract value',
  },
  {
    name: 'No limitation of liability',
    check: (text: string) => !/(limitation|limit).*liability/i.test(text),
    impact: 'No cap on damages — any breach could result in unlimited liability',
  },
  {
    name: 'Automatic renewal without notice',
    check: (text: string) => /auto.*renew.*without.*notice|renew.*unless.*cancel/i.test(text),
    impact: 'Could be locked in for another term without realising',
  },
  {
    name: 'IP ownership over your inputs',
    check: (text: string) => /intellectual property.*all.*work|assign.*all.*ip/i.test(text),
    impact: 'You may lose ownership of materials you create',
  },
  {
    name: 'Unilateral modification',
    check: (text: string) => /reserves.*right.*modify|may.*change.*terms.*without.*notice/i.test(text),
    impact: 'Vendor can change terms without your consent',
  },
  {
    name: 'Governing law in unfavourable jurisdiction',
    check: (text: string, ourJurisdiction: string) => {
      const match = text.match(/governed by.*law.*of ([\w\s]+)/i)
      return match ? !match[1].includes(ourJurisdiction) : false
    },
    impact: 'Disputes must be resolved under foreign law — expensive and inconvenient',
  },
]
```

### Batch contract processing

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

  // Sort by risk — lawyer reviews highest risk first
  return {
    results: results.sort((a, b) => a.risk === 'HIGH' ? -1 : 1),
    highRiskCount: results.filter(r => r.risk === 'HIGH').length,
  }
}
```

### Clause explanation (plain language)

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

## Example

**User:** Review a vendor SaaS agreement (PDF/text), flag all RED issues we must fix, YELLOW issues to negotiate, and summarise what's missing — output as a structured report.

**Expected output:**
```
CONTRACT REVIEW REPORT
Overall Risk: HIGH

🔴 RED (3 issues — must fix before signing)
  Section 12.1 — Uncapped indemnification
  Clause: "Customer shall indemnify Vendor for all claims, losses, and expenses..."
  Issue: No cap on indemnification — unlimited financial exposure
  Fix: Add "not to exceed the fees paid in the 12 months preceding the claim"

🟡 YELLOW (2 issues — negotiate)
  Section 8.3 — Auto-renewal with 60-day notice requirement
  ...

🟢 GREEN (8 clauses — acceptable standard terms)

MISSING CLAUSES:
  - No data processing agreement (required under GDPR)
  - No SLA for uptime guarantees
  - No data deletion clause on termination

RECOMMENDATION: Do not sign until RED issues resolved. Send back with redlines.
```

---
