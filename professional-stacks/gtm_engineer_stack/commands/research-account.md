---
description: Deep-researches a target account using Firecrawl and Exa. Returns structured brief with company snapshot, 90-day triggers, stakeholder map, ICP score, and best outreach hook. Saves to accounts/{slug}-brief.md.
---

# /research-account

## What This Does
Runs the account-researcher skill to comprehensively profile a target company. Gathers web presence, recent news, stakeholder information, and trigger signals. Scores the account against your ICP and flags readiness for outreach.

## Steps Claude Follows
1. Ask for: company name and URL
2. Run account-researcher skill — full research checklist (firmographics, web presence, recent signals, stakeholder identification)
3. Check trigger recency: flag if no triggers found in last 90 days (label: "LOW SIGNAL")
4. Run icp-qualifier on the company to generate ICP score breakdown
5. Save brief to accounts/{company-slug}-brief.md
6. Display the brief with a summary line: ICP score + trigger count + recommended next action

## Next Action Logic
- **GO** + strong triggers (3+, recent): "Ready for /write-sequence"
- **LIKELY** or **CAUTION**: "Proceed with caution — review ICP gaps before sequencing"
- **NO-GO**: "Does not meet ICP — confirm to override or find a different account"
- **LOW SIGNAL** (no triggers in 90 days): "No recent triggers found — sequence risk is higher; consider waiting for a signal"

## Output Format

### Account Brief
```
# [Company Name] — Research Brief

## Company Snapshot
- **Domain**: [url]
- **ICP Score**: [X/10] ([GO/LIKELY/CAUTION/NO-GO])
- **Trigger Count (90d)**: [X]
- **Last Updated**: [date]

## Firmographics
- Industry: [industry]
- Size: [employee count]
- Funding Stage: [if applicable]
- Headquarters: [location]

## Recent Triggers
[List top 3–5 recent news items, funding rounds, product launches, executive changes, growth signals with dates]

## Stakeholder Map
[Key decision-makers by role: CTO, VP Sales, CFO, etc. — with names/titles if found]

## ICP Alignment
[Breakdown of how company scores against each ICP criterion]

## Best Outreach Hook
[Single strongest angle for initial reach: e.g., "Recent Series B — likely scaling GTM", "New product launch — may need sales tooling"]
```

### Summary Line
```
ICP: [X/10] | Triggers: [X] (90d) | Signal: [STRONG/MODERATE/WEAK] | Next: [Recommended Action]
```
