---
name: customer-feedback-synthesizer
description: "Turn 50-200+ reviews, survey responses, or support tickets into ranked pain points, feature requests, sentiment trends, and a concrete action plan"
updated: 2026-06-13
---

# Customer Feedback Synthesizer

## When to activate
- You have more reviews than you have time to read and need the themes fast
- Quarterly business review coming up and you need a data-backed customer summary
- You just launched a product or feature and want to know how it landed
- Preparing a customer report for your team, investors, or an advisory board

## When NOT to use
- You have fewer than 10 reviews — read them yourself, patterns need volume
- You need statistically rigorous NPS or CSAT analysis — use a dedicated survey tool for that
- You want a verbatim log of every complaint — this skill synthesizes, it does not archive

## Instructions

### What to give Claude

Paste your reviews directly. Copy from Google, Yelp, Trustpilot, App Store, or G2. Paste support ticket summaries. Paste open-ended survey responses. No formatting needed — just raw text, one review after another. Claude handles up to 200+ in a single pass.

If you exported a CSV, paste the review text column only. You do not need to clean it up.

Tell Claude:
- The time period the reviews cover (e.g., "last 3 months" or "since we launched in January")
- Your business type (restaurant, SaaS, retail, service) so Claude has context
- Any specific question you want answered (e.g., "why are our ratings dropping?" or "what do people want us to add?")

### What Claude produces

Claude outputs five things:

**1. Top 5 pain points** — ranked by how many reviews mention them, with a frequency count and the typical emotional intensity (frustrated vs. mildly annoyed vs. angry)

**2. Top 5 feature or product requests** — ranked by how many people asked, with the exact language customers use most often (useful for your own copy and roadmap pitches)

**3. Sentiment trend** — improving, stable, or declining — based on tone across the time period you provided. If you give Claude reviews from two periods, it compares them directly.

**4. Top 3 "what's working" highlights** — what customers praise most, which is as important as what they criticize. Useful for marketing copy and for knowing what not to change.

**5. Urgency matrix** — each pain point classified as:
- Critical: many people mention it, strong negative emotion, affects the core experience
- Important: frequent, moderate frustration, worth fixing this quarter
- Watch: occasional, mild, not worth acting on yet but worth tracking

### Suggested fixes

For each pain point in the critical and important tiers, ask Claude: "For each issue, suggest one concrete action I could take." Claude produces a short action per item — not a strategy deck, just the next move.

### Monthly cadence

Run this once per month. Save each output (copy it into a doc). After three months, paste all three outputs and ask Claude: "Are the critical issues from month one improving?" This tracks whether your fixes are actually working.

---

### Prompt template

```
I'm going to paste [number] reviews from [platform] covering [time period].
My business is a [type of business].

Please give me:
1. Top 5 pain points with frequency count and emotional intensity
2. Top 5 feature or product requests ranked by how many people asked
3. Sentiment trend: improving, stable, or declining
4. Top 3 things customers praise most
5. An urgency matrix classifying each pain point as critical, important, or watch
6. For critical and important items: one concrete action I could take for each

Here are the reviews:
[paste reviews]
```

## Example

You own a restaurant and paste 80 Google reviews from the last 3 months. You tell Claude your business is a casual sit-down restaurant.

Claude identifies:

Pain points:
1. Wait time (34 reviews, strong frustration) — Critical
2. Inconsistent portion sizes (18 reviews, moderate frustration) — Important
3. Parking (11 reviews, mild annoyance) — Watch
4. Noise level on weekends (9 reviews, moderate) — Watch
5. Limited vegetarian options (7 reviews, mild) — Watch

Feature requests:
1. Online ordering or reservations (22 reviews)
2. Larger portions on the lunch menu (14 reviews)
3. A loyalty program (8 reviews)

Sentiment trend: Declining — reviews from months 1-2 averaged warmer language; month 3 shows more frustration around wait times specifically, coinciding with your new weekend hours.

What's working: Staff friendliness (mentioned positively in 61 of 80 reviews), food quality on the core dishes, and value for money.

Urgency matrix actions:
- Wait time (Critical): Claude suggests adding a text notification system when tables are ready, and posting estimated wait times at the door
- Portion sizes (Important): Claude suggests standardizing the lunch plate with a documented portion guide for kitchen staff

Total time: under 2 minutes to get from raw paste to this output.

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
