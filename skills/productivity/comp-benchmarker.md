---
name: comp-benchmarker
description: "Compensation benchmarking: market data analysis, salary band setting, equity guidelines, and offer letter generation for competitive hiring"
---

# Comp Benchmarker Skill

## When to activate
- Setting a salary range for a new role before you post the job
- A candidate has made a counter-offer and you need to know if it's in market
- Building or updating your compensation bands across the organisation
- A current employee asks for a market adjustment or salary review
- Generating a formal offer letter after a verbal offer is accepted
- Designing an equity program for the first time or refreshing an existing one
- Deciding between cash-heavy and equity-heavy comp structures for different candidate profiles

## When NOT to use
- Executive comp benchmarking (C-suite) — requires a specialised comp consultant and board approval process
- Benchmarking in highly regulated industries (finance, healthcare) where comp regulations apply — verify locally
- Legal compliance review of pay equity — use an employment attorney
- Benefits benchmarking — different data sources and analysis

## Instructions

### Salary band builder

```
Build salary bands for [role] at my company.

Role: [Job title]
Levels: [list — e.g., L1 / L2 / L3 / Senior / Staff / Principal]
Location: [City, Country / Remote — and whether you pay to local market or single national rate]
Company stage: [Seed / Series A-B / Series C+ / Public / SMB / Enterprise]
Industry: [SaaS / Fintech / Healthcare / E-commerce / Agency / etc.]
Hiring urgency: [can you wait 90 days for the right person, or do you need someone in 30 days?]

Compensation philosophy (choose one or describe your own):
- Lead the market (75th percentile+): we pay top of market to attract top talent
- Match the market (50th percentile): competitive but not the highest payer
- Below market cash, above market equity: common at early-stage startups
- Geographic differentiation: pay to local cost of living

Data sources to reference (in priority order):
1. Levels.fyi — software engineering and technical roles
2. Radford / Mercer — enterprise compensation surveys (if you have access)
3. Glassdoor / LinkedIn Salary Insights — directional, self-reported
4. Peer benchmarks — what are similar companies paying? (ask your VC, check AngelList)
5. Offer data from recent hires at your company (internal anchor)

Band structure (for each level):

| Level | Base Salary Range | Target Bonus | Equity Grant | OTE (if applicable) |
|---|---|---|---|---|
| [L1] | $[X] - $[Y] | [X%] | [X shares / X% of pool] | $[X] |
| [L2] | $[X] - $[Y] | [X%] | [X shares / X% of pool] | $[X] |
[continue]

Rules:
- No band should overlap by more than 20% with the level above/below (prevents compression)
- Midpoint = what a fully performing person at this level should earn
- Minimum = hire-in for someone new to the level or the company
- Maximum = where someone tops out before promotion to next level

Flag compensation risk areas:
- If [current employee salary] > band maximum: compression issue — address proactively
- If most offers are going to the top of the band: band is too low for current market
- If candidates are declining due to comp: provide data, not anecdotes, to leadership

Build the full band structure for [role] with market context.
```

### Offer package builder

```
Build a compensation offer for this candidate.

Role: [Title, level]
Candidate: [describe — years experience, current comp, competing offers if known]
Location: [City, Country]
My band for this role: [$X - $Y base]
Target in band: [bottom / midpoint / top — and why]

Candidate's current situation:
- Current base: $[X]
- Current bonus (expected): $[X]
- Current equity (unvested value): $[X] (this is what you're asking them to walk away from)
- Competing offer: [company, $X base, $X equity — if known]
- Notice period: [X weeks]

Your offer:

BASE SALARY: $[X]
Rationale: [why this number — X% premium on current, Y percentile of band, etc.]

BONUS / VARIABLE:
- Type: [annual target bonus / commission / spot bonus]
- Target: $[X] at [X%] of base on-target
- Structure: [how is it measured and paid?]

EQUITY:
- Type: [ISO options / RSUs / SAFEs at early stage]
- Grant size: [X shares / $X value at current 409A / X% of fully diluted]
- Vesting: [standard: 4-year, 1-year cliff — note if different]
- Current estimated value: $[X] (409A or FMV)
- Note if public: current value / note that it can go down
- Cliff and acceleration provisions (if any)

BENEFITS:
- Health: [100% / X% company-paid medical, dental, vision]
- 401K: [match X% up to Y%]
- PTO: [X days / unlimited / flexible]
- Equipment: [$X stipend / company equipment]
- Remote/flex: [describe policy]
- Other: [learning budget, parental leave, equity refresh policy]

START DATE: [proposed date, with flexibility for notice period]

OFFER EXPIRY: [give them 5-7 business days — reasonable, not pressuring]

Total compensation summary:
- Annual base: $[X]
- Target bonus: $[X]
- Equity (annual value estimate): $[X]
- Total cash target: $[X]
- Total comp including equity: $[X]

Competing offer analysis (if applicable):
If they have a competing offer at [competitor]:
[Compare your offer on cash, equity upside, risk, role quality, growth — not just the numbers]

Generate the full offer package and a comparison narrative for the candidate conversation.
```

### Equity guidelines

```
Design equity guidelines for [company / role level].

Company type: [Pre-seed / Seed / Series A / Series B / Series C+]
Option pool size: [X% of fully diluted shares]
Current valuation: $[X] (or 409A price: $[X/share])

Equity grant benchmarks by level and stage:

PRE-SEED / SEED (first 10-20 employees):
| Level | Range (% of fully diluted) |
|---|---|
| VP / C-suite | 0.5% - 2.0% |
| Senior IC / Director | 0.2% - 0.75% |
| Mid-level IC | 0.05% - 0.25% |
| Early-career / Junior | 0.01% - 0.1% |

SERIES A-B (20-100 employees):
| Level | Range (% of fully diluted) |
|---|---|
| VP / C-suite (new hire) | 0.15% - 0.75% |
| Director | 0.1% - 0.3% |
| Senior IC | 0.05% - 0.15% |
| Mid-level IC | 0.02% - 0.08% |
| Junior IC | 0.005% - 0.025% |

SERIES C+ (100+ employees, pre-IPO):
Shift to RSUs at dollar value targets (share price volatility makes % grants hard to compare):
| Level | Annual grant range |
|---|---|
| VP | $150K - $500K in RSUs |
| Director | $75K - $200K in RSUs |
| Senior IC | $40K - $100K in RSUs |
| Mid-level IC | $15K - $50K in RSUs |

Vesting standards:
- Standard: 4-year vest, 1-year cliff
- Accelerated vesting on acquisition (single trigger): unusual, but sometimes offered to executives
- Refresh grants: offer after 2 years for retained high-performers (prevents unvested cliff effect at year 4)

How to present equity to candidates:
Do not: "You'll get X,000 options worth $Y today."
Do: "At our current 409A of $X/share, your grant is worth $Y today. If we hit our [Series C / IPO] target of $Z/share, your grant is worth $W. That assumes [10x / 20x / specific milestone]."
Be honest about dilution risk at each future round.

Build equity guidelines for my company's stage and option pool.
```

### Offer letter generator

```
Generate an offer letter for [candidate] for [role].

Company: [Company name]
Candidate: [Full name]
Role: [Job title]
Department: [Department]
Reports to: [Manager name, title]
Start date: [date]
Location: [city / state / remote]

Compensation:
- Base salary: $[X] per [year / hour]
- Bonus: [target X% of base, paid [annually / quarterly], subject to performance]
- Equity: [X shares of common stock, 4-year vest, 1-year cliff, subject to board approval]

Benefits: [describe]

Employment type: [full-time / part-time / contract]
At-will employment: [yes / no — check jurisdiction]
Offer expiry date: [date]

Required attachments:
- Employee invention assignment and confidentiality agreement (PIIA/CIIA)
- Background check consent form (if applicable)
- I-9 employment eligibility verification

Produce a formal offer letter with:
- Professional tone — warm but formal
- All compensation details clearly stated
- Equity described with disclaimer that it's subject to board approval and 409A
- At-will clause (if applicable in this jurisdiction)
- Confirmation instructions — how to accept (email / DocuSign link)
- Expiry noted
- Contact for questions

Note: This is a template — review with legal counsel before sending. Employment law varies by jurisdiction.
```

## Example

**User:** I'm hiring a Senior Product Manager in London. My Series B startup, ~80 people. What should the salary band be and how do I structure the offer?

**Claude's benchmark:**

**Senior Product Manager — London — Series B**

**Market context (2025-2026):**
London PM market is tight, particularly for senior ICs with B2B SaaS experience. Series B companies typically position at 50th-65th percentile to stay competitive without burning through the option pool.

**Salary band — Senior PM, London:**
| Component | Range | Notes |
|---|---|---|
| Base salary | £85,000 - £115,000 | Midpoint ~£100K for a 5-7 year PM |
| Bonus (target) | 10-15% of base | Typically tied to company OKRs, not individual |
| Equity | 0.05-0.1% of fully diluted | ~£40-80K at current valuation if Series B is £80M |

**Where to place a specific candidate:**
- Transitioning in from a closely adjacent role or company: bottom of band (£85-90K)
- 5-7 years PM experience, domain match: midpoint (£95-105K)
- 8+ years, has led a product area with revenue accountability: top of band (£108-115K)
- Do not go above band — promote the comp philosophy, not individual negotiation

**Equity structure for this level (Series B):**
- 0.075% typical for a strong Senior PM hire
- At £80M valuation: ~£60K current value
- Vesting: 4 years, 1-year cliff — standard
- When presenting: "If we hit Series C at £250M, this grant is worth ~£190K"

**Competing against larger tech companies:**
If they have an Amazon/Google offer with RSUs, you cannot match on cash. Compete on: scope (they'll own a full product area, not a feature), speed (they'll ship in weeks not quarters), and upside (equity can be worth multiples of a public RSU).

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
