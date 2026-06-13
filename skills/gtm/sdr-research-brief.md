---
name: sdr-research-brief
description: "30-second account dossier for SDRs: company snapshot, recent triggers, buying signals, stakeholder map, and personalised outreach angle — from a URL or company name"
updated: 2026-06-13
---

# SDR Research Brief Skill

## When to activate
- You need a full account brief before writing cold outreach
- You have a company name or URL and want triggers, signals, and stakeholders in under a minute
- Prepping for a cold call and need talking points + likely objections
- Building a target account list and want to prioritise by fit + timing
- Researching a company that just engaged with your content or booked a meeting

## When NOT to use
- You already have deep account context from a previous AE or in the CRM
- Bulk enrichment of 50+ accounts at once — use the `/lead-enrichment` skill instead
- Consumer/B2C targets — different signals and research methods
- When you only need email personalisation — use `/sdr-agent` directly

## Instructions

### Core account brief prompt

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

### Quick brief (CLI-style — under 10 seconds)

```
Quick SDR brief — [COMPANY]:
- What they do: [1 sentence]
- Trigger: [the most recent signal — fund raise, exec hire, job post]
- Who to contact: [name, title]
- Opening hook: [1 sentence referencing the trigger]
- Risk: [what might make them NOT a fit]
```

### Trigger research framework

Use this to find signals Claude can research:

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

### Stakeholder mapping prompt

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

### ICP scoring rubric (customise per product)

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

### Research output template

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

## Example

**User:** Give me an account brief on Vercel. I sell a B2B observability tool for frontend performance.

**Output:**
```markdown
# Account Brief: Vercel — June 2026

## Snapshot
Vercel is a cloud platform for frontend developers, used by 1M+ developers globally.
~1,200 employees. Series E ($150M, 2023). HQ: San Francisco. Stack: Next.js (own),
Turborepo, Datadog, PagerDuty, Segment.

## Why Now (Trigger)
NEW EXEC HIRE — VP of Platform Engineering hired from Cloudflare (LinkedIn, 14 days ago).
New platform leaders typically audit monitoring tools in first 90 days.
Relevance: Vercel's scale (millions of deploys/day) creates frontend latency
complexity their current stack (Datadog) doesn't optimise for.

## ICP Score: 88/100
- Size: 25/25 | Industry: 20/20 | Stack: 15/20 | Trigger: 25/25 | Access: 3/10

## Who to Contact
| Role | Name | Title | LinkedIn | Priority |
|---|---|---|---|---|
| Champion | [VP Platform] | VP Platform Engineering | [URL] | 1st |
| Economic Buyer | [CTO] | CTO | [URL] | 2nd |
| Blocker | [IT/Security] | Head of Security | [URL] | FYI |

## Outreach Angle
Hook: New VP Platform at your scale — Datadog doesn't show frontend latency by edge node
Subject A: "Frontend observability for Vercel's scale" / Subject B: "How [X] cut p95 latency 40%"
Opening: "Congrats on the VP Platform hire — teams at your scale usually find the first 90-day audit
uncovers gaps in frontend-specific observability that general APM tools like Datadog don't cover."
Likely objection: "We already have Datadog / we built this internally"
```

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
