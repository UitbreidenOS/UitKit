---
name: community-health-scorer
description: Generates weekly community health report. Measures member growth, churn rate, engagement rate, sentiment distribution, NPS trend, and top performers. Surfaces action items and health indicators.
allowed-tools: Airtable API, Read
effort: high
---

# Community Health Scorer

## When to activate

Weekly (recommended: Monday morning). You have member database with activity logs for the prior week and trailing 12 weeks for trend analysis. Activation requires: member list with timestamps for join, last activity, posts, comments, and sentiment scores.

## When NOT to use

Not for real-time metrics (this is weekly snapshot). Not without at least 4 weeks of baseline data. Not as the only health metric — supplement with qualitative feedback and member interviews.

## Health Metrics Framework

### 1. Growth Metrics

**Member Growth Rate:**
- Formula: (New members this week / Total members last week) × 100
- Target: 10% MoM for mature communities, 20% for early-stage

**Segments Growth:**
- How many new Advocates, Core, Contributors?
- Growth in high-value segments (Advocates) vs. low-value (Lurkers)?

### 2. Engagement Metrics

**Monthly Active Rate (MAR):**
- Formula: (Members with 1+ activity in past 30 days / Total members) × 100
- Target: >40%

**Weekly Active Rate (WAR):**
- Formula: (Members with 1+ activity in past 7 days / Total members) × 100
- Target: >15%

**Post/Comment Volume:**
- Total posts + comments this week
- Compare to trailing 4-week average
- Trend: increasing, stable, declining?

**Engagement per Member:**
- Average posts per active member
- Average comments per active member
- Lurker ratio (% read-only members)

### 3. Sentiment Metrics

**Sentiment Distribution:**
- % Very Positive (0.7 to 1.0)
- % Positive (0.3 to 0.6)
- % Neutral (-0.3 to 0.3)
- % Negative (-0.6 to -0.3)
- % Very Negative (-1.0 to -0.6)
- Target: 70%+ positive, <5% negative

**Sentiment Trend:**
- Week-over-week change in distribution
- Any spikes in negative sentiment (topic-driven)?

### 4. Churn & Retention Metrics

**Churn Rate:**
- Formula: (Members inactive 30+ days / Previous week total) × 100
- Target: <2% MoM

**Retention by Cohort:**
- % of 1-month-old members still active
- % of 3-month-old members still active
- % of 6-month-old members still active
- Target: 60%+ at 1m, 40%+ at 3m, 30%+ at 6m

**Reactivation Success Rate:**
- Formula: (Re-engaged members from orchestrator outreach / Total at-risk) × 100
- Target: >40%

### 5. Satisfaction Metrics

**NPS (Net Promoter Score):**
- Track from event surveys, community-wide survey
- Formula: (% Promoters (9–10) - % Detractors (0–6)) × 100
- Target: >50

**Response Time (to questions/comments):**
- Average time to first response from community (CM or peer)
- Target: <4 hours during business hours

**Member Feedback Sentiment:**
- Qualitative: themes from DMs, feedback, comments
- Look for: appreciation, frustration, feature requests, cultural fit

### 6. Content & Discussion Quality

**Top Discussions (by engagement):**
- Which threads had highest replies, reactions, views?
- What topics drive engagement? (signals community interests)

**Top Performers:**
- Which members posted most, received most engagement?
- Emerging Advocates from Contributor segment?

**Content Gaps:**
- Are members asking unanswered questions?
- Are there topics with high interest but low supply?

## Output Format

```
## Community Health Report — Week of [Date]

---

## Executive Summary

**Overall Health Score:** [X/100]
- Green: 70+ | Yellow: 50–69 | Red: <50

**Key Status:** [THRIVING / HEALTHY / CAUTION / AT RISK]

**Top Priority Action:** [One sentence describing biggest opportunity or risk]

---

## Growth Metrics

**New Members:** [X] (+X% WoW)
- Advocates: [X] | Core: [X] | Contributors: [X] | Lurkers: [X]
- Trend: [↑ increasing / → stable / ↓ declining]

**Total Members:** [X] (+X% vs. last week)

---

## Engagement Metrics

**Monthly Active Rate:** [X%] (Target: 40%+)
**Weekly Active Rate:** [X%] (Target: 15%+)

**Activity Volume:**
- Posts: [X] (+X% WoW)
- Comments: [X] (+X% WoW)
- Total interactions: [X]

**Engagement per Member:** [X posts/comments per active member/week]

---

## Sentiment Distribution

| Sentiment | % | Target | Status |
|---|---|---|---|
| Very Positive | [X%] | 20%+ | [✓ / ⚠ / ✗] |
| Positive | [X%] | 50%+ | [✓ / ⚠ / ✗] |
| Neutral | [X%] | 20–40% | [✓ / ⚠ / ✗] |
| Negative | [X%] | <5% | [✓ / ⚠ / ✗] |
| Very Negative | [X%] | <1% | [✓ / ⚠ / ✗] |

**Sentiment Trend:** [↑ improving / → stable / ↓ declining]

**Notable:** [Any spikes? Causation?]

---

## Churn & Retention

**Churn Rate:** [X%] (Target: <2% MoM)
- At-risk members (14+ days inactive): [X]
- High-risk (Advocates with 21+ days inactive): [X]

**Retention by Cohort:**
- 1-month cohort: [X%] still active
- 3-month cohort: [X%] still active
- 6-month cohort: [X%] still active

**Reactivation Wins:** [X members] returned this week from orchestrator outreach

---

## NPS & Satisfaction

**NPS Score:** [X] (Target: 50+)
- Promoters: [X%] (9–10)
- Passives: [X%] (7–8)
- Detractors: [X%] (0–6)

**Feedback Themes:**
- [Positive]: [Theme 1], [Theme 2]
- [Negative]: [Theme 1], [Theme 2]

**Response Time:** [X hours avg.] (Target: <4h)

---

## Top Performers & Discussion

**Top 5 Posts (by engagement):**
1. [Title] — [Author] — [Replies, Reactions]
2. [Title] — [Author] — [Replies, Reactions]
[...]

**Emerging Advocates (Contributors climbing to Core):**
- [Member Name] — [trend, why notable]

**Content Gaps:**
- [Question asked multiple times but unanswered]: [Topic]
- [High interest but low supply]: [Topic]

---

## Action Items

**Immediate (This Week):**
- [ ] [Priority action 1]
- [ ] [Priority action 2]

**Short-Term (This Month):**
- [ ] [Action 1]
- [ ] [Action 2]

**Longer-Term (Next Quarter):**
- [ ] [Action 1]

---

## Notes & Context

[Anything unusual this week? External events? Campaigns? Learnings?]
```

## Health Scoring Logic

**Green (70+):**
- MAR >40%, WAR >15%, Growth >5%
- Sentiment >65% positive, <5% negative
- Churn <2%, NPS >50
- Response time <4h
- Clear growth in Advocates, stable Core

**Yellow (50–69):**
- MAR 30–40%, WAR 10–15%, Growth 0–5%
- Sentiment 50–65% positive, 5–10% negative
- Churn 2–4%, NPS 30–50
- Response time 4–8h
- Core stable, Advocates slow growth

**Red (<50):**
- MAR <30%, WAR <10%, Growth negative
- Sentiment <50% positive, >10% negative
- Churn >4%, NPS <30
- Response time >8h
- Lurker ratio >50%, Advocate attrition

## Example Report

**Week of June 10–16, 2026**

**Executive Summary:**
Overall Health: 78/100 (GREEN - THRIVING)

**Growth:** 18 new members (+2.1% WoW). Strong in Core segment.
**Engagement:** MAR 44%, WAR 18% — both above targets.
**Sentiment:** 74% positive — best week in June.
**Churn:** 1.2% — healthy. Reactivated 5 at-risk members.
**NPS:** 58 (up from 52) — members appreciating new event cadence.

**Top Priority:** Launch monthly AMA series (high demand signal) + create #product-feedback channel (request from 3+ members).

---
