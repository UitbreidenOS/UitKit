---
name: design-strategy
description: Design a 90-day strategic roadmap with 3 phases (Foundation / Build / Scale), milestones, resource requirements, success metrics, and dependency mapping. Returns a 3–5 page roadmap document with phase details, checkpoint calendar, and risk flags.
aliases: [create-roadmap, roadmap-design]
---

# /design-strategy

## Usage

```
/design-strategy [client name]
```

## What It Does

Builds a detailed 90-day strategic roadmap after opportunities have been identified. Creates:

1. **Phase 1: Foundation (Weeks 1–4)**
   - Establish governance and steering committee
   - Validate opportunity business cases and assumptions
   - Lock baseline metrics
   - Build change management plan

2. **Phase 2: Build (Weeks 5–8)**
   - Pilot top opportunity (quick win)
   - Develop 2–3 additional opportunities in parallel
   - Monitor early signals and adjust approach
   - Stakeholder updates (weekly tactical, bi-weekly strategic)

3. **Phase 3: Scale (Weeks 9–12)**
   - Scale pilot across organization
   - Complete launches of secondary opportunities
   - Plan roadmap for strategic bets (Tier 2)
   - Review outcomes against success metrics

## When to Use

Run `/design-strategy` after:
- Client analysis is complete (`/analyze-client`)
- Opportunities have been identified and prioritized
- Client has approved the opportunity list
- Executive sponsor is assigned

## Example

```
/design-strategy Acme SaaS
```

**Output:** 90-day roadmap including:
- **Executive Summary:** 3-paragraph overview of strategy and expected impact
- **Phase 1 Details:** Governance setup, deep dive on opportunities 1–3, baseline metrics, change plan
- **Phase 2 Details:** Opportunity 1 pilot with early wins, development of opportunities 2–3
- **Phase 3 Details:** Opportunity 1 scaling, opportunities 2–3 launches, Tier 2 planning
- **Milestones Calendar:** Week-by-week timeline with owners and success criteria
- **Resource Requirements:** FTE allocation by function; external consultant costs; budget
- **Success Metrics:** Phase-by-phase definition of done; financial impact targets
- **Risk Register:** Key risks, mitigation strategies, contingency triggers
- **Checkpoint Calendar:** Monthly executive reviews with decision gates
- **Appendices:** Detailed workstreams, dependency maps, stakeholder roles

## Related Skills

- `opportunity-identifier` — Identify 5–7 opportunities before running this command
- `strategy-designer` — Full skill documentation with detailed instructions
- `risk-assessor` — Identify and mitigate risks; run in parallel
- `/structure-deal` — Define commercial terms for engagement once strategy approved
- `/execute-sequence` — Launch Phase 1 implementation after strategy sign-off

## Output Format

The command generates:
- 3–5 page strategic roadmap document (markdown or PDF)
- Executive summary + 3 detailed phase plans
- Resource requirements and budget summary
- Risk register with contingency triggers
- Month-by-month checkpoint calendar
- Sign-off block for sponsor, CFO, CTO

## Next Steps

After `/design-strategy`:
1. Client reviews roadmap internally
2. Sponsor presents to board/leadership
3. Steering committee established
4. Resource commitments confirmed
5. Phase 1 kickoff scheduled (typically 1 week after approval)

