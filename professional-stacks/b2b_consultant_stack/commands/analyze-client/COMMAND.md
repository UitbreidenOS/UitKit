---
name: analyze-client
description: Profile a B2B company across financials, org structure, technology stack, competitive landscape, and pain points. Returns a diagnostic summary with firmographics, org chart, tech inventory, competitor positioning, and prioritized pain points.
aliases: [profile-client, client-profile]
---

# /analyze-client

## Usage

```
/analyze-client [company name]
```

## What It Does

Profiles a B2B company across 5 dimensions to understand their situation before designing strategy:

1. **Financial Position** — ARR/revenue, growth rate, funding stage, key financial metrics
2. **Organizational Structure** — Headcount, exec team, reporting lines, recent changes
3. **Technology Stack** — Product category, infrastructure, tools, integrations
4. **Competitive Landscape** — Direct competitors, market position, differentiation, pricing
5. **Pain Points** — Scaling, market, org, strategic challenges (ranked by impact)

## When to Use

Run `/analyze-client` at the start of any new engagement to:
- Validate client fit before committing resources
- Identify key opportunities for strategy work
- Establish baseline for measuring engagement impact
- Brief leadership on client situation

## Example

```
/analyze-client Acme SaaS
```

**Output:** 1–2 page client profile with:
- Financial snapshot: $20M ARR, +28% growth, Series B
- Org structure: 85 employees; CEO (John), CFO (Sarah), SVP Sales (Mike)
- Tech stack: AI-powered prospecting platform; built on Python + React; uses Salesforce, Snowflake, Segment
- Competitors: Competitor A (market leader, $200M ARR), Competitor B (challenger, $50M)
- Top 3 pain points: (1) Sales velocity slowing, (2) Tech debt, (3) Churn rising
- Recommendation: 60-day strategic advisory on GTM + product optimization

## Related Skills

- `client-analyzer` — Full skill documentation with detailed instructions
- `/design-strategy` — Build 90-day roadmap after client analysis
- `/structure-deal` — Create commercial terms once scope is agreed

## Output Format

The command generates a structured diagnostic report with:
- **Header:** Client name, date, engagement type recommendation
- **Financial Section:** ARR, growth rate, funding, key metrics
- **Org Section:** Headcount, executives, reporting structure
- **Tech Section:** Product, infrastructure, tools, integrations
- **Competitive Section:** Competitor matrix, market position
- **Pain Points:** Ranked list with business impact estimates
- **Recommendation:** Engagement type and length
- **Next Steps:** Discovery call, scope, stakeholder identification

