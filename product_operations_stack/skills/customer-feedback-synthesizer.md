---
name: customer-feedback-synthesizer
description: Aggregates customer feedback from multiple sources (interviews, surveys, support tickets, reviews). Identifies themes, sentiment, and feature requests. Returns categorized summary with top 5 demands and customer segment signals.
allowed-tools: Read, Write, WebSearch
effort: high
---

# Customer Feedback Synthesizer

## When to activate

During regular customer research cadence or ahead of product roadmap planning. You have access to multiple feedback sources: interview transcripts, NPS comments, support ticket summaries, review sites, or survey responses. Activation requires raw or semi-processed feedback data spanning at least 50 data points and covering multiple customer segments.

## When NOT to use

Not for marketing copy or testimonial selection. Not for individual customer support issues. Not without a minimum volume of feedback (at least 50 data points across 2+ sources). Not for predicting future customer behavior beyond stated feedback. Not for strategic forecasting beyond theme validation.

## Synthesis Framework

**Data Sources to Include:**
- Customer interviews (recorded or transcript)
- NPS surveys and comments
- Support ticket summaries
- Review sites (G2, Capterra, etc.)
- Customer advisory board notes
- Churn interview feedback
- Feature request submissions

**Theme Extraction:**
1. **Unmet need:** Repeated request for functionality or capability
2. **Pain point:** Friction in current workflow or feature
3. **Sentiment driver:** What creates satisfaction or dissatisfaction
4. **Comparison:** How customers compare you to alternatives
5. **Segment signal:** Does feedback differ by company size, industry, or use case?

**Quantification (where possible):**
- Frequency: How many customers mention this?
- Intensity: How strongly do they feel about it?
- Segment concentration: Does this come from a specific customer type?
- Timeline: Is this a recurring theme or new concern?

## Analysis Checklist

1. **Read all raw feedback** and annotate themes manually
2. **Cluster themes** by category (feature request, pain point, competitor comparison, etc.)
3. **Count frequency** per theme; note high-frequency themes
4. **Segment by customer type** (size, industry, stage); identify patterns
5. **Extract direct quotes** (2–3 per top theme) for validation
6. **Assess intensity** (mild request vs. critical blocker)
7. **Identify new themes** (first mention this period vs. recurring)
8. **Cross-reference** with support data and churn interviews

## Output Format

```markdown
# Customer Feedback Synthesis

**Analysis Period:** [Start Date]–[End Date]
**Feedback Volume:** [X sources, Y total data points]
**Date Analyzed:** [Today's date]

---

## Top 5 Feature Requests

### 1. [Feature/Capability Name]
**Frequency:** [X customers mentioned, Y% of feedback]
**Intensity:** [CRITICAL / HIGH / MEDIUM / LOW]
**Segment Concentration:** [Which customer types? e.g., Enterprise, SaaS >$50M ARR]

**Direct Quotes:**
- "Direct customer quote here explaining the request"
- "Another customer quote with specific use case"

**Why This Matters:** [1–2 sentence business impact]
**Estimated Impact:** [If built, what % retention/expansion lift?]

---

### 2. [Feature/Capability Name]
**Frequency:** [X customers mentioned, Y%]
**Intensity:** [CRITICAL / HIGH / MEDIUM / LOW]
**Segment Concentration:** [Segment details]

**Direct Quotes:**
- [Quote 1]
- [Quote 2]

**Why This Matters:** [Business impact]
**Estimated Impact:** [Potential retention/expansion lift]

---

[Repeat for top 5]

---

## Pain Points (Current Product)

| Pain Point | Frequency | Affected Segment | Workaround? | Impact |
|---|---|---|---|---|
| [Specific friction in workflow] | [X mentions] | [Segment] | Yes / No | [Churn risk / adoption blocker] |

**Insight:** [Top pain point and recommended action]

---

## Competitor Comparisons

**Tools Customers Mention Alongside Us:**
- Tool A: [Why customers compare] — [Your advantage / gap]
- Tool B: [Why customers compare] — [Your advantage / gap]
- Tool C: [Why customers compare] — [Your advantage / gap]

**Win vs. Competitor:** [What causes customers to pick us over alternatives?]
**Loss vs. Competitor:** [What causes customers to pick alternatives instead?]

---

## Sentiment & NPS Drivers

**Detractors (0–6):** Top reason for low score
- [Theme 1]: [X detractors mentioned this]
- [Theme 2]: [X detractors mentioned this]

**Promoters (9–10):** Top reason for high score
- [Theme 1]: [X promoters mentioned this]
- [Theme 2]: [X promoters mentioned this]

**NPS Opportunity:** [What single change would most improve detractor → promoter conversion?]

---

## Segment Breakdown

### Enterprise (>1,000 employees)
**Top Request:** [Feature]
**Top Pain Point:** [Pain point]
**Sentiment:** [Average sentiment, key driver]
**Churn Risk:** [HIGH / MEDIUM / LOW]

### Mid-Market (100–1,000 employees)
**Top Request:** [Feature]
**Top Pain Point:** [Pain point]
**Sentiment:** [Average sentiment, key driver]
**Churn Risk:** [HIGH / MEDIUM / LOW]

### SMB (<100 employees)
**Top Request:** [Feature]
**Top Pain Point:** [Pain point]
**Sentiment:** [Average sentiment, key driver]
**Churn Risk:** [HIGH / MEDIUM / LOW]

---

## New Themes (This Period vs. Historical)

**Emerging Request (First time this period):**
- [Theme] — [Context, why it's new or accelerating]

**Recurring Request (Consistent demand):**
- [Theme] — [Historical frequency, current mentions]

---

## Recommended Actions

1. **Urgent (Address in Q3):** [Top 1–2 requests causing churn or unmet need]
2. **High Priority:** [Requests from 5+ customers or key accounts]
3. **Medium Priority:** [Emerging themes or competitive gaps]
4. **Monitor:** [Requests from <3 customers; revisit if frequency increases]

---
```

## Example

# Customer Feedback Synthesis

**Analysis Period:** April 1–May 31, 2026
**Feedback Volume:** 12 customer interviews, 45 NPS responses, 60 support tickets
**Date Analyzed:** June 1, 2026

---

## Top 5 Feature Requests

### 1. Custom Role-Based Access Control (RBAC)
**Frequency:** 18 customers mentioned (28% of feedback)
**Intensity:** CRITICAL
**Segment Concentration:** Enterprise (95%), Mid-market with compliance needs (60%)

**Direct Quotes:**
- "We can't deploy this until you support custom roles. Our security team won't allow broad admin access." — Director of Security, Acme Corp
- "Every customer we pitch asks why they can't restrict who can edit billing settings. It's costing us deals." — VP Sales

**Why This Matters:** Blocking 5–7 enterprise deals; unmet compliance requirement; key competitive gap vs. [Competitor A]
**Estimated Impact:** 8–12% enterprise new ARR, 5% retention improvement

---

### 2. Audit Logging & Compliance Dashboard
**Frequency:** 14 customers mentioned (22%)
**Intensity:** CRITICAL
**Segment Concentration:** Enterprise (90%), heavily regulated industries (Finance, Healthcare, Legal)

**Direct Quotes:**
- "We need to pass SOC 2 Type II audit this Q3. Your lack of detailed audit logs is a blocker." — Compliance Officer, FinTech Startup
- "Why can't I see who changed what and when? I need this for HIPAA compliance." — Operations Manager, Healthcare Provider

**Why This Matters:** Compliance blocker; SOC 2 / HIPAA / PCI concerns; preventing $500k+ deal closures
**Estimated Impact:** 12–15% enterprise new ARR; 3% churn reduction (compliance-related)

---

### 3. API Rate Limit Increases
**Frequency:** 11 customers mentioned (17%)
**Intensity:** HIGH
**Segment Concentration:** Mid-market and Enterprise (70%), Integration-heavy use cases (80%)

**Direct Quotes:**
- "We're integrating with Zapier and hitting your rate limits. We need 10x higher limits." — Engineering Manager, SaaS Company
- "Our API calls are capped at 1,000/hour. We need at least 5,000." — CTO, E-commerce Platform

**Why This Matters:** Expansion blocker; integrations are core use case; customers scaling usage hitting limits
**Estimated Impact:** 6–8% expansion bookings from mid-market

---

### 4. Mobile App (iOS/Android)
**Frequency:** 8 customers mentioned (12%)
**Intensity:** MEDIUM
**Segment Concentration:** SMB (70%), remote-first teams (80%)

**Direct Quotes:**
- "We'd use this way more if I could check status on my phone. Currently stuck to desktop." — Manager, Remote Sales Team
- "Mobile app would help us during sales calls when we're on the go." — VP Sales, SMB SaaS

**Why This Matters:** Adoption enabler; competitive gap vs. [Competitor B]; SMB expansion opportunity
**Estimated Impact:** 3–5% SMB expansion; 10% engagement lift if built

---

### 5. Bulk Import & Export
**Frequency:** 7 customers mentioned (11%)
**Intensity:** MEDIUM
**Segment Concentration:** Mid-market and Enterprise (70%), existing data migration challenges

**Direct Quotes:**
- "Migrating from [Legacy Platform] is painful because we can't bulk import our config." — Operations Manager
- "We need to export reports in bulk for our CFO weekly reviews." — Finance Manager

**Why This Matters:** Onboarding friction; churn risk during migrations; manual workaround burden
**Estimated Impact:** 4–6% faster onboarding; 2% churn reduction (migration-related)

---

## Pain Points (Current Product)

| Pain Point | Frequency | Affected Segment | Workaround? | Impact |
|---|---|---|---|---|
| Slow load times in large workspaces | 13 mentions | Enterprise | Manual data pruning | Adoption friction, support overhead |
| Confusing permission model | 9 mentions | Enterprise | Call support for help | Churn risk, support load |
| Limited reporting templates | 8 mentions | Mid-market | Manual spreadsheets | Engagement blocker |
| No offline mode | 5 mentions | Mobile-heavy use cases | Workaround with cached data | Friction in field use |

**Insight:** Performance and access control are top pain points blocking Enterprise expansion. Recommend prioritizing RBAC + performance optimization.

---

## Competitor Comparisons

**Tools Customers Mention:**
- **[Competitor A]:** RBAC built-in — customers see us as lacking compliance features
- **[Competitor B]:** Mobile app + better API docs — SMB customers prefer for mobile flexibility
- **[Competitor C]:** Real-time collaboration — Enterprise customers cite faster teamwork

**Win vs. Competitor:** Our pricing and simplicity; users love our UX and customer support
**Loss vs. Competitor:** Compliance features, mobile, advanced API; customers switching for security requirements

---

## Segment Breakdown

### Enterprise (>1,000 employees)
**Top Request:** Custom RBAC
**Top Pain Point:** Audit logging gaps
**Sentiment:** 7.2/10 (would be 8.5 with compliance features)
**Churn Risk:** MEDIUM (if compliance requirements remain unmet)

### Mid-Market (100–1,000 employees)
**Top Request:** API rate increases
**Top Pain Point:** Slow performance at scale
**Sentiment:** 7.8/10
**Churn Risk:** LOW-MEDIUM

### SMB (<100 employees)
**Top Request:** Mobile app
**Top Pain Point:** Confusing permission model (simpler for SMB, but still complaint)
**Sentiment:** 8.1/10
**Churn Risk:** LOW

---

## Recommended Actions

1. **Urgent (Q3 roadmap):** Build custom RBAC + basic audit logging (enterprise blocker, 5+ deals at risk)
2. **High Priority:** Increase API rate limits to 5,000/hour (expansion blocker, mid-market focus)
3. **Medium Priority:** Optimize performance for large workspaces + improve permission UX
4. **Monitor:** Mobile app demand; revisit if SMB expansion strategy changes

---
