---
name: lead-scorer
description: Scores a prospect 0–100 against the AI SDR ICP matrix across 4 dimensions: role seniority, company size, industry fit, and tech stack signals. Returns GO (≥60) / CAUTION (40–59) / NO-GO (<40) with a dimensional breakdown and a one-line decision rationale. Blocks research and outreach for NO-GO prospects unless human overrides.
allowed-tools: WebSearch, WebFetch, Read
effort: low
---

# Lead Scorer

## When to activate
Before researching any new prospect. Use this as the first gate — before account research, before writing any email, before any outreach decision. Also use when re-evaluating an existing prospect after a role change or company event.

## When NOT to use
Skip if the prospect already has an open opportunity in CRM with a deal stage (they've already been qualified). Skip for inbound leads who submitted a demo form — intent signals override ICP scoring. Skip if a human has already manually overridden NO-GO with written justification.

## Instructions

1. Gather basic firmographic data on the prospect: title, company name, employee count, industry, and any visible tech stack signals (job postings, G2 reviews, LinkedIn tech listings).
2. Score each dimension independently:

**Role Seniority (25 pts)**
- C-suite (CEO, CTO, CFO, COO), Founder, Owner: 25
- VP, SVP, EVP: 20
- Director: 15
- Senior Manager: 8
- Manager, IC: 3

**Company Size (25 pts)**
- 50–500 employees: 25
- 20–49 employees: 15
- <20 or 501–1000: 5
- >1000: 0

**Industry Fit (25 pts)**
- SaaS, B2B Tech, Fintech, Cloud Infrastructure: 25
- Adjacent: Martech, HR Tech, Sales Tools, Analytics, DevTools: 15
- Professional services, consulting (tech-adjacent): 8
- Non-tech, consumer, government, non-profit: 0

**Tech Stack Signals (25 pts)**
- Cloud-native + 10+ tools, API-driven, multi-vendor: 25
- Moderate: 5–9 tools, mixed cloud/on-prem: 15
- Minimal: <5 tools, spreadsheet-heavy: 5
- Manual / legacy monolith / no visible tech: 0

3. Sum scores. Apply decision rule:
   - **GO ≥60:** Proceed to account research.
   - **CAUTION 40–59:** Flag the weak dimensions. Proceed only with a specific angle for the gap.
   - **NO-GO <40:** Stop. Output the score and blocking reasons. Do not begin research unless human overrides.

4. Output the score block (see Output Format).

## Output Format

```
LEAD SCORE: [X]/100 — [GO / CAUTION / NO-GO]

Seniority:  [X/25] — [title] ([reason])
Size:       [X/25] — [employee count] ([reason])
Industry:   [X/25] — [industry] ([reason])
Tech Stack: [X/25] — [signal summary]

DECISION: [Proceed to research / Proceed with caution — note weak dimensions / Stop — blocking reasons]
```

## Example

**Prospect:** Maria Santos, VP of Revenue Operations, Growfast (220 employees, SaaS analytics, uses Salesforce + Gong + Outreach + Snowflake + dbt + 6 other tools, Series B raised 8 weeks ago)

```
LEAD SCORE: 90/100 — GO

Seniority:  20/25 — VP RevOps (strong buyer, not C-suite)
Size:       25/25 — 220 employees (mid-market SaaS)
Industry:   25/25 — SaaS analytics (core ICP)
Tech Stack: 20/25 — 10+ tools, cloud-native (Salesforce, Gong, Outreach, Snowflake, dbt)

DECISION: Proceed to research — strong fit. Fresh Series B capital signals active budget cycle. RevOps buyer likely evaluating stack consolidation.
```

---
