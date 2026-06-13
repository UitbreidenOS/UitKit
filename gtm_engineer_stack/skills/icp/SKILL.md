---
name: icp-qualifier
description: Qualifies a prospect against ICP — Director/VP/Founder/C-suite at SaaS or B2B, 10–500 employees. Returns a structured score with GO/NO-GO and dimension breakdown. Blocks disqualified prospects before any outreach.
allowed-tools: WebSearch, WebFetch, Read
effort: low
---

# ICP Qualifier

## When to activate
Before researching or writing for any new prospect. Always first. Use to gate all outreach decisions and prioritize pipeline velocity.

## When NOT to use
Skip if prospect already has an open CRM deal stage—you're requalifying, not qualifying. Skip for inbound leads who submitted a form (already qualified by intent). Skip if immediate context shows clear disqualification (startup, 3 person team, non-tech).

## Qualification Criteria

5 dimensions — 100 points total:

**Title Seniority (30 pts)**
- C-suite/Founder: 30
- VP: 25
- Director: 20
- Senior Manager: 15
- Manager or below: 5

**Company Size 10–500 (25 pts)**
- 50–500 employees: 25
- 10–49 employees: 15
- <10 or >500: 0

**Industry Fit (20 pts)**
- SaaS/B2B Tech/Fintech: 20
- Adjacent (Martech/HR Tech/Analytics): 12
- Other: 3

**Tech Stack Signals (15 pts)**
- Cloud-native + 10+ tools (multi-vendor, API-driven): 15
- Moderate (5–9 tools, mixed on-prem/cloud): 8
- Manual/offline/legacy monolith: 0

**Engagement Signals (10 pts)**
- Recent trigger—funding round/new hire/product launch in past 90 days: 10
- Older signal or weak trigger (6–12 months ago): 5
- No signal detected: 0

## Scoring & Decision

- **GO ≥60** — prioritize, move to next step
- **CAUTION 40–59** — proceed with explicit note on which dimension(s) failed; escalate if title or industry is weak
- **NO-GO <40** — stop, document blockers, do not outreach

## Output Format

```
ICP SCORE: [X]/100 — [GO / CAUTION / NO-GO]

Title: [X/30] — [reason]
Size: [X/25] — [reason]
Industry: [X/20] — [reason]
Tech stack: [X/15] — [reason]
Engagement: [X/10] — [reason]

DECISION: [Proceed / Proceed with caution (note: X) / Stop — reason]
```

## Example

**Prospect:** Sarah Chen, VP of Sales at Acme Analytics (180 employees, SaaS, Series A raised 6 weeks ago)

```
ICP SCORE: 90/100 — GO

Title: 25/30 — VP (not C-suite, but strong buyer)
Size: 25/25 — 180 employees (mid-market SaaS)
Industry: 20/20 — SaaS analytics vendor
Tech stack: 15/15 — AWS, Salesforce, Looker, Segment, Snowflake, Fivetran, dbt + custom APIs
Engagement: 5/10 — Series A closure 6 weeks ago; recent cap table change suggests buying cycle opening

DECISION: Proceed — strong fit across all dimensions; VP with fresh capital and team scaling pressure.
```

**Prospect:** Mike Rodriguez, Senior Manager of Ops at LocalFirst (8 employees, bootstrapped services firm, no recent signals)

```
ICP SCORE: 25/100 — NO-GO

Title: 15/15 — Senior Manager (not director+)
Size: 0/25 — 8 employees (below 10-employee floor)
Industry: 3/20 — Services (not SaaS/B2B tech)
Tech stack: 0/15 — Manual spreadsheets and email workflows
Engagement: 7/10 — None detected

DECISION: Stop — fails on size, industry, and tech stack. Not an ICP prospect.
```

---
