---
name: structure-deal
description: Create a commercial term sheet for consulting engagement, M&A transaction, partnership, or investment. Returns a 2–3 page term sheet with pricing model, payment schedule, SLAs, warranties, termination, and risk allocation.
aliases: [create-terms, term-sheet, pricing-model]
---

# /structure-deal

## Usage

```
/structure-deal [deal type] [client name]
```

## Deal Types Supported

- `consulting-engagement` — Advisory services contract
- `m-and-a` — Merger or acquisition term sheet
- `partnership` — Strategic partnership agreement
- `investment` — Funding round term sheet

## What It Does

Structures commercial terms for your engagement with the client:

1. **Pricing Model** — Fixed fee, value-based, time & materials, or hybrid
2. **Payment Schedule** — Upfront, milestone-based, or performance-linked
3. **Deliverables** — Define what you're committing to deliver and by when
4. **SLAs** — Response time, availability, reporting cadence
5. **Warranties & Liability** — What you guarantee and what risks each party bears
6. **Termination** — How either party can exit; remedies for breach
7. **IP Ownership** — Who owns deliverables and methodologies

## When to Use

Run `/structure-deal` when:
- Engagement scope and deliverables are finalized
- Client has approved the strategic roadmap
- You're ready to negotiate commercial terms
- Internal stakeholders (finance, legal) need to review terms

## Example: Consulting Engagement

```
/structure-deal consulting-engagement Acme SaaS
```

**Output:** 2–3 page term sheet including:
- **Executive Summary:** Engagement overview, investment, expected outcomes
- **Scope & Deliverables:** 5 key deliverables with due dates and success criteria
- **Pricing Model:** Fixed fee ($150K) for 90-day strategic advisory
- **Payment Schedule:** 25% upfront, 25% at weeks 4 & 8, 25% at completion
- **SLAs:** 24–48 hour response time; monthly briefings; 5 ad-hoc hours/month included
- **Warranties:** Confidentiality, independence, expertise, effort commitment
- **Client Obligations:** Access to team, timely decisions, dedicated sponsor
- **Termination:** Either party can terminate with 15 days notice; early termination fees apply
- **IP Ownership:** Deliverables owned by client; you retain methodology
- **Signature Block:** Authorized signers from both parties

---

## Pricing Model Options

### A. Fixed Fee (Recommended for Consulting)
- **Best for:** Well-defined scope, clear deliverables
- **Price:** $X for 90-day engagement
- **Payment:** 25% upfront, 50% at milestones, 25% on completion
- **Example:** $150K total for 90-day strategy advisory

### B. Value-Based (Outcome-Linked)
- **Best for:** Quantifiable outcomes (revenue, cost savings)
- **Price:** Base fee ($X) + success bonus (10% of incremental value, capped at $Y)
- **Advantage:** Aligns incentives; client feels lower risk
- **Example:** $100K base + 10% of incremental revenue, capped at $500K

### C. Hybrid (Fixed + Variable)
- **Best for:** Mixed risk, partially defined scope
- **Price:** Base fee ($X) + hourly overage ($Y/hour) for additional work
- **Example:** $100K fixed for 90 days, then $250/hour for additional consulting

---

## Related Skills

- `deal-structurer` — Full skill documentation with detailed instructions
- `/analyze-client` — Understand client situation before pricing
- `/design-strategy` — Finalize scope before structuring commercial terms
- `/log-engagement` — Track signed deals and payment milestones

## Output Format

The command generates a structured term sheet with:
- 2–3 pages (markdown or PDF)
- Executive summary + key terms section
- Detailed deliverables and success metrics
- Pricing and payment schedule
- SLAs and service levels
- Warranties, liability, and risk allocation
- Termination and dispute resolution
- IP ownership and confidentiality
- Signature block and appendices (team bios, case studies, timeline)

## Negotiation Tips

**If client pushes back on price:**
1. Quantify impact (revenue, cost savings, efficiency gains)
2. Offer value-based alternative: lower base fee, success bonus
3. Break into phases; price each phase separately
4. Offer discounted rate for extension/follow-on work

**If client wants undefined scope:**
1. Define fixed scope + change request process
2. Include contingency budget (10–15% of fee)
3. Offer hourly rate for out-of-scope work
4. Set quarterly scope reviews and adjust as needed

**If client delays payment:**
1. Require 50% upfront to start work
2. Include late payment interest (1.5% per month)
3. Add 15-day cure period before termination

## Next Steps

After `/structure-deal`:
1. Client legal/finance reviews term sheet
2. Negotiate and revise as needed
3. Finalize and execute by both parties
4. Collect upfront payment
5. Begin Phase 1 of engagement

