---
name: icp-scoring
description: You are prospecting B2B SaaS companies and need to qualify leads against a defined ideal customer profile (ICP). Trigger this when: scoring a new l...
updated: 2026-06-13
---

# ICP Scoring

## When to activate

You are prospecting B2B SaaS companies and need to qualify leads against a defined ideal customer profile (ICP). Trigger this when: scoring a new lead for outreach tier, prioritizing a prospect list, deciding contact depth for a company, or validating fit before sales handoff.

## When NOT to use

- You already have a lead inside a customer success/retention workflow — use churn prevention frameworks instead.
- Prospect is already a customer or active opportunity in your CRM — this is for new prospecting only.
- You are doing lead generation sourcing (finding *which* companies to prospect) — this is for *qualifying* companies you've already identified.
- The target company has fewer than 10 employees or is in a hardline disqualifying vertical — scoring is pointless; mark as do-not-contact.

## Instructions

### 3-Layer ICP Definition

Every ICP is defined across three orthogonal dimensions. Score each independently, then combine.

**Layer 1: Firmographic Fit (0–40 points)**

Objective company attributes that determine structural ability to buy.

| Attribute | Target | Points |
|---|---|---|
| **Industry vertical** | Primary (e.g., SaaS, FinTech, Healthcare Tech) | 20 |
| Secondary fit (adjacent, proven use case) | 10 |
| Wrong vertical (disqualifier) | 0 |
| **Company headcount** | 50–500 | 15 |
| 25–49 or 501–1,000 | 8 |
| 10–24 or 1,001+ | 2 |
| Under 10 | 0 (hard disqualifier) |
| **Annual Recurring Revenue (ARR)** | $5M–$100M | 5 |
| $2M–$4.9M or $100M–$500M | 3 |
| Under $2M or over $500M | 0 |
| **Geography** | US, UK, Canada, Western Europe (primary) | Included above; secondary markets score at 80% |

*Firmographic ceiling: 40 points. A company perfect on all attributes scores 40.*

**Layer 2: Technographic Fit (0–30 points)**

Tech stack and infrastructure signals that indicate product fit or disqualification.

Score based on *presence* of signals (not absence). Check: public tech stacks (StackShare, LinkedIn, job posts, funding decks), GitHub public repos, job postings for tech roles, founding/funding announcements.

| Signal Type | Examples | Points |
|---|---|---|
| **Core fit** (your solution directly plugs into their stack) | Using Node.js, PostgreSQL, Kubernetes; hiring "DevOps Engineer"; publicly discussing microservices | 15 |
| **Secondary fit** (strong adjacency) | Cloud infrastructure (AWS, GCP, Azure); CI/CD mentions; data pipeline investments | 10 |
| **Weak signal** (general modern tech, not specific to your ICP) | Standard SaaS stack (React, Python, typical AWS); no red flags but no strong fit either | 5 |
| **Hard disqualifier** | Locked into competitor tech stack; legacy mainframe-only; using completely incompatible vendor | 0 |

*Select the highest-scoring signal category found. Technographic ceiling: 30 points.*

**Layer 3: Behavioural Signals (0–20 points)**

Recent momentum and growth signals indicating buying intent and budget allocation.

| Signal | Recency | Points |
|---|---|---|
| **Funding round** (Series A or later, not seed) | Last 12 months | 8 |
| 13–24 months ago | 5 |
| Over 24 months | 2 |
| **Hiring surge** (publicly posted 5+ role openings in your target department: engineering, data, product) | Last 30 days | 8 |
| 31–90 days ago | 5 |
| Over 90 days | 2 |
| **Expansion signals** (new office, new product launch, new market entry, new integration ecosystem) | Last 90 days | 4 |

*Behavioural ceiling: 20 points. Multiple signals are additive up to 20.*

### Recency Decay (0–10 points bonus/penalty)

All firmographic data becomes stale. Adjust final score based on data freshness.

| Data freshness | Adjustment |
|---|---|
| All ICP attributes verified in last 30 days | +10 |
| Verified 31–90 days ago | +5 |
| Verified 91–180 days ago | 0 |
| Over 180 days old (no recent verification) | –5 |

*Example: A 75-point lead with 6-month-old company size data becomes 70 points.*

### Complete Scoring Model: 0–100

**Formula:**
```
SCORE = Firmographic (0–40) + Technographic (0–30) + Behavioural (0–20) + Recency (–5 to +10)
RANGE: 0–100
```

### Hard Disqualifiers (Score = 0, skip all tiers)

Even if other dimensions score high, mark the lead **do-not-contact** if any apply:

1. **Competitor** — They build/sell a competing product.
2. **Existing customer** — Already in your customer base or active trial.
3. **Wrong industry vertical** — Outside your defined primary/secondary verticals (e.g., government contractor when you target SaaS).
4. **Headcount under 10** — Too small to have buying process or budget.
5. **Explicit disqualification signals** — Public statements against your category; using incompatible vendor exclusively; bankruptcy/layoff announcements indicating budget freeze.

### Tier Definitions & Action Playbooks

After scoring (and confirming no hard disqualifiers), route to outreach tier:

#### Tier 1 (80–100 points)
**Characteristics:** Perfect or near-perfect fit. ICP match on 2+ dimensions. Recent signals.

**Outreach playbook:**
- Manual deep research: Read last 3 earnings calls (if public), recent blog posts, CEO Twitter, LinkedIn hiring posts, recent funding announcement.
- Identify 2–3 specific, personalized hooks (e.g., "I noticed you posted 7 engineering roles last month; we help teams like yours reduce onboarding time by 40%").
- Personalized email sequence: 5-touch, 21-day cadence. Custom hook in email 1. Reference specific company milestone in email 3. Social touch (LinkedIn comment on recent post) as touch 4.
- Sales involvement: Assign to named account executive. Use full sales development playbook.

**Response rate benchmark:** 8–12% reply rate (with personalization).

#### Tier 2 (50–79 points)
**Characteristics:** Strong fit on 1 dimension, adequate fit on others. Clear ICP match but may lack recent momentum.

**Outreach playbook:**
- Template email with 1 personalization hook (e.g., "Your team hired 6 engineers last quarter; we help teams like [similar company] reduce [outcome]").
- Standard 3-touch sequence over 14 days: Email → 5-day wait → LinkedIn message → 3-day wait → Final email.
- No manual deep research; use public signals only (LinkedIn, StackShare, funding announcements).
- Light sales involvement: SDR only, no AE assignment.

**Response rate benchmark:** 4–6% reply rate.

#### Tier 3 (20–49 points)
**Characteristics:** Partial fit. Matches ICP on one dimension only, or weak signals across multiple dimensions.

**Outreach playbook:**
- Template email (no personalization). Single touch only.
- Batch-and-blast: Send in bulk campaigns. No follow-up sequence.
- Use for list-building and brand awareness, not direct sales.
- No sales involvement.

**Response rate benchmark:** 1–2% reply rate (expect low engagement).

#### Below 20 points
**Action:** Do not contact. Move to "nurture" segment for future campaigns only. Re-score quarterly.

---

### Scoring Prompt Template

Use this prompt structure to score a lead with Claude:

```
Score this company against our ICP using the attached 0–100 model.

COMPANY: [Company name]
INDUSTRY: [Industry]
HEADCOUNT: [Number] (source: [LinkedIn/PitchBook/etc])
ARR: [Estimated or public $] (source: [how you know])
GEOGRAPHY: [Country/region]

TECH STACK SIGNALS:
- [Tool/platform 1] (source: [job post/StackShare/GitHub])
- [Tool/platform 2]
- [Tool/platform 3]

BEHAVIOURAL SIGNALS:
- Funding: [Series X, $Y, date] (source: [Crunchbase/press release])
- Hiring: [Number of open roles in target department, dates posted] (source: [LinkedIn jobs])
- Expansion: [New market/office/product launch] (source: [announcement])

DATA FRESHNESS: All data verified [date range]

TASK:
1. Score each dimension independently (Firmographic, Technographic, Behavioural, Recency).
2. Identify any hard disqualifiers.
3. Return: TOTAL SCORE, TIER, RECOMMENDATION (contact depth + sequence type).
4. List the top 2 personalization hooks (if Tier 1 or 2).

Format response as:
---
**SCORE: [0-100]**
**TIER: [1/2/3/Do Not Contact]**
**DISQUALIFIERS:** [None / List any found]
**FIRMOGRAPHIC:** [X points] — [reasoning]
**TECHNOGRAPHIC:** [X points] — [reasoning]
**BEHAVIOURAL:** [X points] — [reasoning]
**RECENCY ADJUSTMENT:** [+/- X points]

**TOP PERSONALIZATION HOOKS:**
1. [Hook 1 — specific, time-bound]
2. [Hook 2 — specific, time-bound]

**RECOMMENDATION:** [Outreach playbook and next step]
---
```

---

## Example

### Scenario: Score TechVentures Inc. (Hypothetical FinTech SaaS)

**Raw data collected:**

| Attribute | Value | Source |
|---|---|---|
| Company | TechVentures Inc. | Crunchbase |
| Industry | FinTech (payment processing) | Website, LinkedIn |
| Headcount | 180 | LinkedIn Company Page (updated 2 weeks ago) |
| ARR | $18M | Crunchbase funding + burn calc |
| Geography | San Francisco, CA (US) | Company website |
| Tech stack | Python, PostgreSQL, AWS, Kubernetes, Node.js microservices | Job postings (Aug 2026), GitHub public repos |
| Funding | Series B, $45M, raised Mar 2026 | Crunchbase, TechCrunch |
| Hiring | 12 open Engineering roles (posted last 30 days) | LinkedIn jobs page |
| Expansion | Announced UK expansion (Jul 2025) | Company blog |
| Data verified | Jun 2026 | This scoring session |

### Scoring:

**FIRMOGRAPHIC (40 max):**
- Industry fit (FinTech primary vertical): 20 points
- Headcount (180, in 50–500 range): 15 points
- ARR ($18M, in $5M–$100M range): 5 points
- **Subtotal: 40 points** ✓

**TECHNOGRAPHIC (30 max):**
- Core fit: PostgreSQL + Python microservices on AWS/Kubernetes matches modern SaaS infrastructure (15 points).
- No disqualifying signals.
- **Subtotal: 15 points** ✓

**BEHAVIOURAL (20 max):**
- Funding (Series B, $45M, Mar 2026 = 3 months ago): 8 points
- Hiring surge (12 Engineering roles, posted <30 days): 8 points
- Expansion (UK office announced, but 11+ months ago): 2 points
- **Subtotal: 18 points** ✓

**RECENCY (±10):**
- All data verified in last 30 days: +10 points

---

### FINAL SCORE: 40 + 15 + 18 + 10 = **83 points**

### TIER: **Tier 1 (80–100)**

### DISQUALIFIERS: None

### RECOMMENDATION:

**Outreach Playbook — Tier 1:**

**Personalization Hooks:**
1. "You raised $45M in Series B (Mar 2026) and are hiring aggressively (12 engineering roles open). We help FinTech platforms scaling on AWS/Kubernetes reduce infrastructure complexity by 35%—directly relevant as you expand into UK and add headcount."
2. "You built on PostgreSQL + microservices, which is exactly where [our solution] provides the most value. Teams like Stripe and Wise use us to accelerate deployment cycles when scaling across regions."

**Email sequence (5 touches, 21 days):**
- **Day 1:** Personalized email. Subject: "[CTO name], TechVentures' growth trajectory + microservices stack." Include funding announcement callout + 1 personalization hook.
- **Day 6:** Follow-up email. "Did my previous email on UK expansion challenges land?"
- **Day 10:** LinkedIn message to CTO/VP Engineering (different messaging angle).
- **Day 14:** Value-add touch: Share relevant case study (FinTech company, similar ARR, scaling scenario).
- **Day 21:** Final breakup email. "Last chance: Let's talk about your Q3 infrastructure goals."

**Sales involvement:** Assign to named AE. Book 30-min discovery call target.

**Expected outcome:** 8–12% reply rate. Target for immediate sales qualification.

---

**End of scoring example. TechVentures Inc. is a go for outreach at Tier 1 intensity.**
