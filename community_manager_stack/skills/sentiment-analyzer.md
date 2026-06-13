---
name: sentiment-analyzer
description: Real-time sentiment tracking via post reactions, comment tone, and member language. Flags mood shifts, emerging frustrations, celebration moments, and topic trends. Surfaces crisis signals (misinformation, harassment spikes). Weekly sentiment report with mood trajectory and alerts.
allowed-tools: Read, Write
effort: medium
---

## When to activate

Daily (automated alert-driven). Before/after major announcements. When engagement metrics shift. Input: member posts, comments, reactions, moderation reports. Output: sentiment score (0–100), trend, alerts, topic tags.

## When NOT to use

Not to shadowban members based on sentiment score. Not as a substitute for human judgment. Not to assume correlation without context.

## Sentiment Analysis Checklist

Execute in order:

1. **Gather sentiment signals** — Collect: positive reactions (likes, thumbs up), negative reactions (angry, sad), comment tone (positive/neutral/negative), moderation reports, member feedback
2. **Calculate sentiment baseline** — For past week: % positive reactions, % negative reactions, % neutral. Compare to prior week and prior month.
3. **Identify emerging frustrations** — Are certain topics appearing in multiple removal reports? Are specific features getting criticism? Are moderation decisions creating backlash?
4. **Tag trending topics** — What are members talking most about? Categorize: Product feedback, Feature request, Celebration, Complaint, Question, Discussion.
5. **Measure reply positivity ratio** — When members reply to posts, is tone constructive or dismissive? Are debates healthy or turning heated?
6. **Score conversation health** — 0–100 scale: positive_ratio (40%) + constructive_tone (30%) + psychological_safety (20%) + respect (10%)
7. **Detect crisis signals** — Watch for: misinformation spreading, harassment campaigns, privacy concerns, safety threats, member exit announcements
8. **Segment by channel/member type** — Does sentiment vary by channel? Do power users feel differently than new members?
9. **Generate alerts** — If sentiment drops >15%, engagement sentiment turns negative, or crisis signals detected, flag for immediate review
10. **Log trends** — Track sentiment trajectory weekly. Is community becoming more positive, neutral, or negative?

## Sentiment Scoring Framework

| Signal Type | Positive | Neutral | Negative | Weight |
|---|---|---|---|---|
| **Reaction emoji** | Thumbs up, heart, celebration | Like, clap | Angry, sad | 20% |
| **Comment tone** | Helpful, encouraging, curious | Factual, informative | Dismissive, sarcastic, hostile | 30% |
| **Language** | "Thanks," "love," "brilliant," "helped me" | "Interesting," "thanks for sharing," "noted" | "Dumb," "broken," "terrible," "hate" | 25% |
| **Report type** | Celebrations, questions, ideas | Feedback | Harassment, spam, misinformation | 15% |
| **Psychological safety** | "Safe to disagree," "questions valued" | "Standards met" | "Intimidated," "can't speak," "unwelcome" | 10% |

**Score = (Positive weight × 100) - (Negative weight × 100)**

## Weekly Sentiment Report Template

```markdown
# Community Sentiment Report — Week of [DATE]

**Overall Sentiment Score:** 72/100 — [Status: Positive / Neutral / Negative]
**Trend:** [Stable / Improving / Declining] (compare to prior week)

---

## Sentiment Breakdown

| Signal | This Week | Last Week | Change |
|---|---|---|---|
| Positive reactions | 68% | 70% | -2% |
| Negative reactions | 8% | 6% | +2% |
| Neutral reactions | 24% | 24% | — |
| Constructive tone | 85% | 87% | -2% |
| Psychological safety score | 76/100 | 78/100 | -2 |

---

## Top Trending Topics (This Week)

| Topic | Mentions | Sentiment | Status |
|---|---|---|---|
| Feature X launch | 32 | 81% positive | Celebration |
| Bug report: Y | 18 | 45% negative | Concern |
| Career advice thread | 24 | 92% positive | Healthy discussion |
| Moderation decision Z | 12 | 35% negative | Frustration |

---

## Emerging Frustrations

- **Moderation perception:** 2 members report feeling unfairly treated in [decision Z]. Consider transparency post or appeal review.
- **Feature parity concern:** 4+ members asking when [feature] lands on [platform]. Clarity needed from product team.
- **Onboarding friction:** New members asking "how do I X" repeatedly; FAQ section may be unclear.

---

## Celebration Moments

- [Power user name] celebrated promotion — 28 reactions, heartfelt responses.
- [Member] shared win on [achievement] — 35 reactions, inspired others to share wins too.

---

## Alerts (Requiring Action)

- Sentiment on [topic] dropped 24% this week. Monitor for escalation.
- 3 removal reports for same member type of offense; moderation consistency check needed.
- Misinformation thread on [topic] — 6 upvotes before removal. Fact-check effort underway.

---

## Channel Health Snapshot

| Channel | Sentiment Score | Trend | Primary Vibe |
|---|---|---|---|
| #general | 74 | Stable | Helpful, collaborative |
| #help | 71 | Stable | Supportive, solution-focused |
| #announcements | 68 | Declining | Mixed excitement + concerns |
| #introductions | 85 | Improving | Welcoming, encouraging |

---

## Recommendations

1. **Boost #announcements sentiment:** Pair feature announcements with known benefits for end users. Include feedback loop ("What would help you use this?").
2. **Clarify feature roadmap:** Product team to post ETA on [feature] by [date]. Reduces speculation.
3. **Review moderation transparency:** Post decision log weekly. Shows consistency, builds trust.
```

## Crisis Signal Checklist

Monitor for:
- **Misinformation spike:** Same false claim in 3+ threads. Fact-check immediately.
- **Harassment campaign:** 2+ coordinated negative comments directed at 1 member or group.
- **Privacy breach signal:** Members mentioning leaked data, screenshots of private info, or account compromise.
- **Safety threat:** Any mention of violence, self-harm, threats, or illegal activity. Escalate to legal/safety immediately.
- **Mass member exit:** 5+ members posting "I'm leaving because..." in short timeframe.
- **Toxic tone shift:** Language becomes hostile, respectful debate turns into personal attacks, psychological safety drops >20 points.

---
