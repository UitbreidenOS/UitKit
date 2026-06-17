---
name: client-analyzer
description: Profiles a B2B company across 5 dimensions: financial position, organizational structure, technology stack, competitive landscape, and stated pain points. Produces a 1–2 page diagnostic summary with firmographic data, org chart sketch, tech inventory, competitor positioning, and prioritized pain points.
allowed-tools: WebSearch, WebFetch, Read
effort: medium
---

# Client Analyzer

## When to activate
At the start of any new engagement. Use this before designing strategy or structuring deals. Also use when re-engaging an existing client after 6+ months to capture changes in financials, leadership, or market position.

## When NOT to use
Skip if the client has already been profiled in the current engagement session. Skip if client provides a complete internal profile document — extract firmographics directly instead.

## Instructions

1. **Financial Position** (research for last 12 months)
   - ARR or annual revenue (if public, use SEC filings; if private, use Crunchbase, PitchBook, or client disclosure)
   - YoY growth rate
   - Funding stage and capital raised (if applicable)
   - Key financial metrics: gross margin, rule of 40, burn rate (if private)

2. **Organizational Structure**
   - Total headcount
   - Key executives: CEO, CFO, CTO, SVP Sales, SVP Product
   - Reporting lines: sales/marketing/product/ops/finance
   - Any recent exec departures or hires

3. **Technology Stack**
   - Customer-facing: product category, languages, platforms
   - Infrastructure: cloud provider, on-premise, hybrid
   - Tooling: 5–10 key tools in use (CRM, data warehouse, analytics, collaboration, etc.)
   - Integration patterns: APIs, webhooks, ETL pipelines

4. **Competitive Landscape**
   - Top 3–5 direct competitors; market share (if available)
   - Differentiation vs. competitors: product, go-to-market, pricing
   - Market position: leader, challenger, niche player
   - Pricing vs. competitors: premium, parity, discount

5. **Pain Points** (from job postings, earnings calls, LinkedIn activity, recent news)
   - Scaling pain: sales velocity, product development, ops efficiency
   - Market pain: new market entry, customer concentration, churn, CAC
   - Organizational pain: talent, processes, tech debt, reporting structure
   - Strategic pain: fundraising readiness, M&A positioning, market fit validation

## Output Format

```markdown
# [Company Name] — Client Profile

**Date:** YYYY-MM-DD
**Engagement Type:** [Strategic Advisory / Deal Structuring / Transformation]

---

## Financial Position

- **ARR:** $X–$Y (growth: +Z% YoY)
- **Stage:** [Series X / Profitable / Pre-revenue]
- **Capital Raised:** $X total funding
- **Key Metrics:**
  - Gross Margin: X%
  - Rule of 40: X
  - CAC Payback: X months (if SaaS)

---

## Organizational Structure

- **Headcount:** X
- **CEO:** [Name], [background]
- **CFO:** [Name]
- **CTO:** [Name]
- **SVP Sales:** [Name]
- **SVP Product:** [Name]

---

## Technology Stack

**Product:** [Category], [Languages], [Platforms]
**Infrastructure:** [Cloud / On-prem], [Key providers]
**Key Tools:** [CRM], [Data warehouse], [Analytics], [Collaboration], [Monitoring]

---

## Competitive Landscape

| Competitor | Market Position | Pricing | Key Differentiation |
|---|---|---|---|
| [Comp 1] | [Leader / Challenger] | $X/mo | [Angle] |
| [Comp 2] | [Leader / Challenger] | $X/mo | [Angle] |
| [Comp 3] | [Niche / Regional] | $X/mo | [Angle] |

**[Company] Position:** [Leader / Challenger / Niche], [Specific differentiation]

---

## Pain Points (Prioritized)

1. **[Primary Pain]** (High Impact, Urgent)
   - Signal: [Evidence from news, job posting, etc.]
   - Business impact: $X opportunity or X% efficiency gain
   
2. **[Secondary Pain]** (Medium Impact)
   - Signal: [Evidence]
   - Business impact: [X opportunity]
   
3. **[Tertiary Pain]** (Lower Priority)
   - Signal: [Evidence]
   - Business impact: [X opportunity]

---

## Engagement Recommendation

**Client Fit Score:** X/100 (based on revenue stage, growth rate, problem clarity, exec alignment)
**Recommended Engagement:** [Strategic Advisory / Deal Structuring / Transformation]
**Engagement Length:** [30 / 60 / 90 days]
**Estimated Scope:** [$X consulting fee range]

---

## Next Steps

1. Discovery call: Validate pain points and executive alignment
2. Confirm engagement scope and timeline
3. Identify primary stakeholders and sponsor
```

## Example

**Client:** Acme SaaS (Series B, $15M ARR, 120 employees)

**Pain Points Identified:**
1. Sales velocity stalling (growth declining from 40% to 28% YoY) → GTM optimization needed
2. Tech debt accumulating → Product velocity declining → Hiring slowdown
3. Churn rate increasing to 8% annually → Customer success process gaps

**Recommendation:** 60-day strategic advisory on GTM repositioning and product roadmap alignment.

