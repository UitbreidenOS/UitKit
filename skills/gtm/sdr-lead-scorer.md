---
name: sdr-lead-scorer
description: "ICP fit + intent signal lead scoring for SDRs: score prospects 0-100 against your ideal customer profile, rank lists by priority, and explain the reasoning behind each score"
updated: 2026-06-13
---

# SDR Lead Scorer Skill

## When to activate
- You have a raw lead list (Apollo export, LinkedIn Sales Nav, event attendee list, inbound form) and need to prioritise it
- Building an automated lead routing system that scores inbound leads before assignment
- Quarterly ICP refresh — rescore the database against updated criteria
- You want to explain to your manager why you're prioritising certain accounts
- Building a lead scoring model for a new product or market segment

## When NOT to use
- Single-account deep research — use `/sdr-research-brief` for that (more detail)
- Scoring existing pipeline for forecast purposes — use `/commercial-forecaster`
- Customer health scoring — use `/customer-success` skill
- When you have <10 leads — just score manually, no need to build a system

## Instructions

### Lead scoring prompt (batch)

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

### ICP scoring framework builder

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

### Automated lead scoring (code pattern)

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

### Inbound lead routing (real-time scoring)

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

### ICP score interpretation

```
SCORE 90-100 — Drop everything. Research this account today.
These accounts have near-perfect fit AND active triggers.
Rule: outreach within 24 hours. These windows close.

SCORE 75-89 — Strong. Add to sequence this week.
Good fit, some timing uncertainty. Research 10 minutes.
Rule: in sequence within 3 business days.

SCORE 60-74 — Solid. Worth working, not urgent.
Reasonable fit, needs a trigger to move up.
Rule: add to automated sequence, prioritise when triggers appear.

SCORE 40-59 — Marginal. Low-touch only.
Some ICP signals but key criteria missing.
Rule: automated sequence only. No manual research.

SCORE <40 — Not a fit. Do not contact.
Missing too many ICP criteria. Outreach would waste everyone's time.
Rule: archive, do not sequence, do not call.
```

### Data quality checker (before scoring)

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

## Example

**User:** I have 47 inbound leads from a webinar. Score them and tell me which to call today.

**Input (sample):**
```
Jane Smith, VP Operations, Acme Corp, 450 employees, B2B SaaS, uses Salesforce + Slack
Bob Lee, IT Manager, Local Bakery, 12 employees, Food & Beverage, unknown stack
Carol Wu, Head of Sales Ops, TechCo, 800 employees, FinTech, uses HubSpot + Intercom
```

**Output:**
| Lead | Company | Score | Tier | Reason | Action |
|---|---|---|---|---|---|
| Carol Wu | TechCo | 88 | A | FinTech + 800 employees + HubSpot user + Head of Sales Ops = perfect ICP | Call today |
| Jane Smith | Acme Corp | 74 | B | Good size and SaaS vertical, Salesforce user, but Operations role = not primary buyer | Sequence this week |
| Bob Lee | Local Bakery | 12 | D | <50 employees, wrong industry, wrong role | Disqualify |

**Today's call list (A-tier):** 8 leads → call before 11am. Carol Wu is #1.
**This week's sequences (B-tier):** 23 leads → enrol by Friday.
**Disqualified (D-tier):** 11 leads → archived.

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
