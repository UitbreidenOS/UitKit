---
name: account-researcher
description: Deep-researches a target account using Firecrawl (JS-rendered pages) and Exa (semantic signal search). Returns structured brief: company snapshot, 90-day triggers, stakeholder map, ICP score, best outreach hook. Saved to accounts/{slug}-brief.md.
allowed-tools: WebSearch, WebFetch, mcp__firecrawl__scrape, mcp__exa__search, Write
effort: medium
---

## When to activate

Before writing any sequence or preparing for any call. Requires ICP qualifier to have returned GO or CAUTION first. This skill transforms a qualified account into actionable intelligence — use it to uncover recent signals that create urgency and identify the exact person to reach first.

## When NOT to use

Not for general market research — use market-research skill instead. Not for competitor analysis — use battlecard skill. Not without ICP pre-qualification; if the account hasn't been vetted by icp-qualifier yet, run that first. Not as a marketing research tool; this is purpose-built for 1:1 outreach preparation.

## Research Checklist

Execute these seven steps in order. Mark each complete before moving to the next.

1. **Company website** — Scrape homepage and about page via Firecrawl to extract: founding year, HQ location, headcount (stated), mission/product one-liner
2. **Pricing page** — Firecrawl scrape to infer: ARR range, ICP (company size), feature set, go-to-market (self-serve vs. sales-led)
3. **LinkedIn Company page** — Scrape to find: recent hires (last 90 days, especially C-suite and VP-level), follower growth, recent posts
4. **Crunchbase** — Search for: last funding round (amount, lead, date), investor list, job posting history, executive team current state
5. **Exa signal scan** — Run all five query templates below; compile strongest signals (funding, hires, launches) with dates
6. **Recent job postings** — Search LinkedIn/company careers for: 10+ open roles in any function (hiring surge signal), role titles that indicate scaling priorities
7. **G2/Capterra (if applicable)** — Quick scan for: reviews mentioning pain points, recent feature requests, competitive alternatives users mention

## Trigger Signal Categories

Look for these six categories of signals. Each has different sales velocity and budget implications.

**Funding round** — Series A/B/C, seed, bridge, or secondary market activity. Signal: fresh capital = budget allocated, hiring planned, product roadmap shifting. Search for: "closed Series X funding," "raises $X million," "announces funding round."

**Executive hire** — New VP, C-level hire, or functional leader (Head of Sales, CMO, CFO). Signal: pain in that function + money to solve it + advocate inside. Search for: "promotes [name] to VP," "[name] joins as Chief," "appoints [name] as."

**Product launch** — New major feature, new product line, new AI/platform integration. Signal: company shifting strategy, needing new tech stack, messaging change incoming. Search for: "[company] launches," "[company] announces [product]," "[company] releases."

**Market expansion** — Entry into new geography, new customer segment, vertical expansion. Signal: go-to-market reset, need for localized tooling, hiring in new markets. Search for: "[company] enters [region]," "[company] expands to," "[company] launches in."

**Partnership announced** — Integration, channel partnership, or strategic alliance. Signal: tech stack direction, buying patterns shifting, co-selling opportunity. Search for: "[company] partners with," "[company] integrates with," "[company] announces partnership."

**Hiring surge** — 10+ open roles in one function, or rapid headcount growth visible. Signal: scaling pain, operational overload, immediate buying impulse. Search for: "[company] hiring," "[company] open roles," LinkedIn company page job postings spike.

## Exa Queries to Run

Copy-paste these five query templates and run them in sequence. Replace [company] with target account name.

1. `[company] funding 2025` — Captures recent capital events, investor news, growth signals
2. `[company] [exec name] joins as` — Targeted search for specific executive hires (fill in name from LinkedIn if known)
3. `[company] launches` — Product announcements, feature releases, new offerings
4. `[company] expands to` — Geographic or segment expansion moves
5. `[company] hiring [VP/Head of Sales/Marketing]` — Function-specific hiring signals (rotate the function based on your ICP)

Run searches in this order. Each result should have a URL and publication date — record the date as this signals recency of trigger.

## Account Brief Output

Save your findings as `accounts/{company-slug}-brief.md`. Use this template:

```markdown
# {Company Name} — Account Brief

**Prepared:** {date}
**ICP Qualification:** {GO/CAUTION from icp-qualifier}
**Research Priority:** {High/Medium/Low}

---

## Company Snapshot

{3 sentences: what they do, company size (employees), stage/funding status}

---

## Triggers Found (90-day window)

- {Trigger 1} — {Date} — Signal strength: **Strong/Medium/Weak**
- {Trigger 2} — {Date} — Signal strength: **Strong/Medium/Weak**
- {Trigger 3} — {Date} — Signal strength: **Strong/Medium/Weak**

{If no triggers found in 90-day window, note: "No active triggers in past 90 days. Account stable. Lower priority for outreach window."}

---

## Stakeholder Map

| Role | Name | Title | LinkedIn | Notes |
|------|------|-------|----------|-------|
| Champion | {Name} | {Title} | {URL or "TBD"} | {Reason they'd champion: problem area, recent hire signal, etc.} |
| Economic Buyer | {Name} | {VP Finance / CFO / COO} | {URL or "TBD"} | {Budget owner in this function} |
| Blocker | {Name} | {Title} | {URL or "TBD"} | {Who might resist or delay: legacy system owner, process owner, etc.} |

---

## ICP Score

{Copy-paste the score and summary from icp-qualifier output}

---

## Best Outreach Hook

{1 sentence — specific, references strongest trigger, implies urgency}

Example: "Since Meridian Analytics closed their Series B in March, they've been aggressively building out their revenue operations team — perfect time to pitch Outreach for sales automation."

---

## Research Notes

{Any additional context: company culture signals, competitive landscape, missing data flagged for follow-up}
```

## Example

# Meridian Analytics — Account Brief

**Prepared:** June 12, 2026
**ICP Qualification:** GO
**Research Priority:** High

---

## Company Snapshot

Meridian Analytics is a Series B SaaS company providing AI-driven customer analytics for mid-market e-commerce and CPG brands. They have ~240 employees across San Francisco HQ and Dublin engineering center. Founded in 2018, they focus on predictive churn modeling and cohort analysis.

---

## Triggers Found (90-day window)

- Series B funding closed, $22M raised, led by Sequoia — March 15, 2026 — Signal strength: **Strong**
- New CRO hired: former Salesforce VP of Enterprise Sales, Sarah Chen — April 8, 2026 — Signal strength: **Strong**
- New VP of Marketing hired: from Amplitude, Jason Rodriguez — April 22, 2026 — Signal strength: **Strong**
- Expansion announcement: entering EMEA market, Dublin office expansion to 50 engineers — May 2, 2026 — Signal strength: **Medium**
- Product launch: released AI-powered revenue operations suite, targeting series B SaaS companies — May 18, 2026 — Signal strength: **Medium**

---

## Stakeholder Map

| Role | Champion | Title | LinkedIn | Notes |
|------|----------|-------|----------|-------|
| Champion | Amy Kapoor | VP Product | linkedin.com/in/amykapoor | Former user of similar tools; responsible for RFx decisions and integrations |
| Economic Buyer | Sarah Chen | CRO | linkedin.com/in/sarahchen-salesforce | New hire from Salesforce; controls sales ops budget and vendor selection |
| Blocker | Michael Torres | Chief Technology Officer | linkedin.com/in/mtorres-eng | May prioritize in-house development; history of building vs. buying |

---

## ICP Score

Meridian Analytics scores **8.5/10** on ICP fit:
- Company Size: 240 employees ✓ (target 150-500)
- Stage: Series B with fresh capital ✓ (target Series A-C)
- Use Case: Revenue operations / sales efficiency ✓ (core buyer segment)
- Geography: US + EMEA expansion ✓ (expanding market)
- Growth rate: Hiring 40+ new roles this year ✓ (high growth signal)
- Estimated ARR: $8-12M range ✓ (target $5M+)

Minor concerns: CTO historically resists third-party tools; integration with custom analytics stack may require scope expansion.

---

## Best Outreach Hook

"Sarah, congrats on the CRO role at Meridian — with your Series B momentum and the new AI analytics suite launch, now's the perfect time to implement a unified revenue operations platform to scale your go-to-market motion."

---

## Research Notes

- Sarah Chen (new CRO) is the warmest buyer — hire date and mandate align perfectly with sales ops tooling
- Dublin expansion suggests international complexity; pitch should include multi-region deployment experience
- Product launch timing suggests they're building the tech roadmap now — ideal window for integration partnerships
- Michael Torres (CTO) has published blog posts favoring in-house solutions; early briefing with business case needed to position outsourcing
- No obvious competitors in Meridian's tech stack per LinkedIn headcount analysis; opportunity to be category-first in their workflow

---
