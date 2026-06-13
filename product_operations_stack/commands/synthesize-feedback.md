---
description: Runs customer feedback synthesizer to aggregate feedback from multiple sources. Takes interviews, support tickets, reviews, and survey data. Returns categorized theme summary with top 5 requests, sentiment analysis, and segment breakdown.
---

# /synthesize-feedback

## What This Does

Aggregates and analyzes customer feedback from multiple sources: interviews, NPS surveys, support tickets, review sites (G2, Capterra), and customer conversations. Identifies recurring themes, quantifies feature request frequency, and maps feedback to customer segments. Returns a comprehensive summary with top 5 requests, pain points, and actionable insights.

## Steps Claude Follows

1. **Ask for:** Raw or processed feedback data (minimum 50 data points from 2+ sources)
2. **Run customer-feedback-synthesizer** — Extract themes, code feedback, count frequency, segment by customer type
3. **Identify top 5 feature requests** — Rank by frequency and intensity; show direct customer quotes
4. **Map pain points** — Show current product friction and which segments are affected
5. **Segment analysis** — Break down feedback by company size, industry, or use case
6. **Assess sentiment** — Identify what drives high/low NPS; correlation to features or pain points
7. **Provide recommendations** — Flag urgent gaps, competitive risks, and expansion opportunities
8. **Return summary** — Display themes, quotes, and prioritized action items

## Output Format

### Customer Feedback Summary
```
# Feedback Analysis

**Analysis Period:** [Start Date]–[End Date]
**Feedback Volume:** [X sources, Y total data points]
**Key Finding:** [Top insight]

## Top 5 Feature Requests
[Ranked by frequency and intensity, with customer quotes and impact]

## Pain Points
[Current product friction; which segments affected; adoption risk]

## Segment Breakdown
[How feedback differs across Enterprise, Mid-market, SMB, etc.]

## Sentiment & NPS Drivers
[What makes customers happy? What drives churn?]

## Recommended Actions (Priority Order)
1. [Urgent — blocking deals or causing churn]
2. [High — 5+ customers asking for this]
3. [Medium — emerging theme, monitor for growth]
```

## Next Actions

- **Validate with stakeholders** — Share top 5 requests with sales, CS, leadership; confirm alignment
- **Update roadmap** — Incorporate top requests into Q[X] prioritization
- **Track over time** — Re-run this analysis quarterly to spot trends and validate assumptions
- **Follow up with customers** — Dig deeper on low-frequency but high-intensity requests

## Tips

- Include both positive feedback (what's working) and negative feedback (what's broken)
- Segment feedback by customer type; Enterprise priorities often differ from SMB
- Use direct quotes in roadmap planning to make decisions stick with stakeholders
- Track which feedback leads to features; close the loop with customers when you build what they asked for

## Example Use Case

> "We collected feedback from 10 customer interviews, 45 NPS responses, and 60 support tickets. What should we prioritize?"

Claude runs `/synthesize-feedback` with your data. Returns:
- Top 5 feature requests ranked by frequency
- Direct customer quotes explaining why each matters
- Breakdown of how feedback differs across customer segments
- Estimated impact if you build each request (churn reduction, expansion potential)
- Analysis of competitors (tools customers compare you to, gaps you have)

---
