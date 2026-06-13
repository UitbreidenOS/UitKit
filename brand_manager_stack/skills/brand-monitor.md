---
name: brand-monitor
description: Real-time monitoring of brand mentions, competitor moves, and customer sentiment across web. Flags reputation risks, opportunities, and market shifts. Scheduled daily or triggered on demand.
allowed-tools: WebSearch, Exa
effort: medium
---

# Brand Monitor

## When to activate

Daily (scheduled) or on-demand when you need to check brand health, monitor competitor moves, or assess market sentiment. This skill scans the web for brand mentions, customer reviews, competitor announcements, and industry shifts. Flags risks and opportunities in real-time.

## When NOT to use

Not for competitive deep-dives — use Competitor Analyst for that. Not for one-time research — this is ongoing surveillance. Not without a defined brand name and 3–5 key competitor names.

## Monitoring Dimensions

**1. Brand Mentions**
Your company name mentioned online: news articles, blogs, social media, review sites, forums. Track volume, sentiment, and context. Flag negative or false claims immediately.

**2. Customer Reviews & Sentiment**
G2, Capterra, Reddit, Twitter, Product Hunt: What are customers saying about you? Positive/negative sentiment trends. Common complaints or praise patterns.

**3. Competitor Moves**
Announcements, funding, hiring, product launches, messaging changes, pricing updates. What are competitors doing? How does it affect your positioning?

**4. Market Trends & News**
Industry shifts, regulatory changes, analyst reports, trending topics. How do these affect your messaging? New opportunities or threats?

**5. Social Media Activity**
Mentions across Twitter, LinkedIn, Reddit. Who's talking about you or your competitors? Conversations to join? Influencers discussing your space?

## Output Format

Return monitoring report as:

```
# Brand Monitor Report

**Date:** [ISO date]
**Monitoring Period:** [Last 24 hours / Last week / Last month]

---

## Brand Mentions

**Volume:** X new mentions (↑/↓ vs. previous period)  
**Sentiment:** Positive X%, Neutral Y%, Negative Z%

### Positive Mentions
- [Mention 1]: [Source] — [Context]
- [Mention 2]: [Source] — [Context]

### Neutral Mentions
- [Mention 1]: [Source] — [Context]

### Negative Mentions ⚠️
- [Mention 1]: [Source] — [Context] — **Action needed?** [Risk assessment]

---

## Customer Sentiment & Reviews

**G2 Rating:** X.X/5 (↑/↓ vs. last check)  
**Capterra Rating:** X.X/5  
**Trending Feedback:**
- Positive: [Most common praise]
- Negative: [Most common complaint]

### Recent Reviews
- [Customer name]: X/5 — "[Quote about feature/issue]"

---

## Competitor Moves

| Competitor | Move | Date | Relevance to Us | Action? |
|---|---|---|---|---|
| [Name] | [Announcement/Launch/Pricing] | [Date] | [Affects our positioning?] | [Our response needed?] |

---

## Market News & Trends

- [Trend/News]: [Description] — [Impact on our messaging?]
- [Regulatory change]: [What changed] — [Compliance impact?]
- [Analyst report]: [Finding] — [Affects our positioning?]

---

## Opportunities Flagged

- [Opportunity 1]: [What we could capitalize on]
- [Opportunity 2]: [What we could capitalize on]

---

## Risks Flagged ⚠️

- [Risk 1]: [Potential issue] — **Severity:** [HIGH / MEDIUM / LOW] — **Action:** [What to do]
- [Risk 2]: [Potential issue] — **Severity:** [HIGH / MEDIUM / LOW] — **Action:** [What to do]

---

## Next Steps

1. [Action 1]
2. [Action 2]
3. [Action 3]

---

**Next Step:** Review report. Approve response plan or escalate risks to leadership.
```

## Example Report

**Brand Monitor Report**

**Date:** 2026-06-12
**Monitoring Period:** Last 7 days

---

## Brand Mentions

**Volume:** 18 new mentions (↑ 35% vs. previous week)  
**Sentiment:** Positive 72%, Neutral 17%, Negative 11%

### Positive Mentions
- TechCrunch: "Acme raises Series B funding" — [Link] — Coverage of growth
- Dev.to: "Acme API docs are the gold standard" — [Link] — Developer praise
- LinkedIn: "Using Acme for 3 months, best security decision we've made" — [Quote]

### Neutral Mentions
- Product Hunt: "Acme launches new feature" — [Link] — Feature announcement
- Hacker News: "Acme security-first architecture" — [Link] — Technical discussion

### Negative Mentions ⚠️
- Reddit r/devtools: "Acme pricing gets expensive at scale" — [Link] — **Action needed?** Monitor sentiment, respond if appropriate
- Twitter: "Acme support is slow; waiting 2 days for response" — [Link] — **Action needed?** Investigate support SLA

---

## Customer Sentiment & Reviews

**G2 Rating:** 4.6/5 (↑ from 4.5 last week)  
**Capterra Rating:** 4.4/5 (stable)

**Trending Feedback:**
- Positive: "API documentation," "responsive support," "transparent pricing"
- Negative: "Pricing at scale," "onboarding friction," "limited enterprise features"

### Recent Reviews
- Software engineer: 5/5 — "Best API docs I've ever used. Setup in 2 hours, not 2 weeks like our old vendor."
- Director of Engineering: 4/5 — "Love the product, but pricing gets steep above $1M revenue. Wish there was more enterprise customization."

---

## Competitor Moves

| Competitor | Move | Date | Relevance to Us | Action? |
|---|---|---|---|---|
| CompetitorA | Launched "Enterprise Security" bundle | June 8 | Directly targeting our message | Monitor pricing, consider messaging response |
| CompetitorB | Hired Chief Product Officer (ex-Google) | June 10 | Signals product investment | Could accelerate feature launches; monitor for new releases |
| CompetitorC | Announced $30M funding, "expanding into APAC" | June 11 | Market expansion, not direct threat | No action needed; opportunity to grow US presence |

---

## Market News & Trends

- **Regulatory change:** New data residency requirements for EU customers (effective Aug 2026) — **Impact:** May need to emphasize data residency in messaging for EMEA campaigns
- **Analyst report:** Gartner reports "security-first architecture is top 3 decision factor for engineering teams" — **Impact:** Validates our positioning; use in case studies
- **Industry trend:** "API-first development" gaining adoption — **Impact:** Position Acme as API-first; opportunity for new content angle

---

## Opportunities Flagged

- **Developer content**: Saw 3 mentions of "API docs are gold standard" — could expand developer marketing
- **APAC expansion**: CompetitorC investing heavily in APAC; we could grab market share in lesser-competitive EU
- **Data residency**: New regulation creates need for compliance content; opportunity for 3–4 blog posts/guides

---

## Risks Flagged ⚠️

- **Support SLA risk** ⚠️: Tweet about 2-day support wait time garnered 45 likes — **Severity: MEDIUM** — **Action:** Investigate actual SLA; publish response or escalate to support leadership
- **Pricing perception** ⚠️: Reddit comment about scaling costs got 30+ upvotes — **Severity: MEDIUM** — **Action:** Consider pricing communication campaign or transparent pricing guide
- **Competitor messaging** ⚠️: CompetitorA directly copying "enterprise security" messaging — **Severity: MEDIUM** — **Action:** Sharpen our differentiation; consider new messaging angle

---

## Next Steps

1. Respond to support SLA complaint with specific improvements
2. Publish blog post on "Transparent Pricing at Scale" to address cost concerns
3. Capitalize on "developer docs" praise with new developer marketing campaign
4. Create compliance/data residency content for EMEA campaigns (August launch)

---
