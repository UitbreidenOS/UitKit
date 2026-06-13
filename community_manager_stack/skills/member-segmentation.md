---
name: member-segmentation
description: Scores members 0–100 across 4 dimensions (engagement level, tenure, contribution quality, churn risk). Returns GO/CAUTION/INACTIVE decision and recommended engagement strategy.
allowed-tools: Read, Airtable API
effort: medium
---

# Member Segmentation

## When to activate

Before any engagement action (onboarding, re-engagement, mentorship invitation, event invitation). You have member data available (email, join date, post count, last activity date, comment sentiment scores). Activation requires a data point — at minimum, email and join date.

## When NOT to use

Not for bulk scoring >100 members without aggregation. Not without baseline member data (join date, engagement history). Not for real-time classification of every message. Not as a substitute for direct member feedback on preferences.

## Segmentation Dimensions

**Dimension 1: Engagement Level (0–25 pts)**
- 90th+ percentile (daily posts/comments): 25 pts — **Advocates**
- 70–90th percentile (2–3x/week): 15 pts — **Core**
- 40–70th percentile (monthly): 10 pts — **Contributors**
- <40th percentile (read-only): 5 pts — **Lurkers**

**Dimension 2: Tenure (0–25 pts)**
- 6+ months: 25 pts
- 3–6 months: 15 pts
- 1–3 months: 10 pts
- <1 month: 5 pts

**Dimension 3: Contribution Quality (0–25 pts)**
- Helps others, high-quality posts, mentoring: 25 pts
- Regular posts, positive sentiment: 15 pts
- Occasional comments, neutral tone: 10 pts
- Lurks, minimal contribution: 5 pts

**Dimension 4: Churn Risk (0–25 pts)**
- No activity in 14d+: -10 pts (subtract)
- Negative sentiment on >2 posts: -5 pts
- Declining engagement trend (week-over-week): -5 pts
- Stopped engaging in favorite channels: -5 pts
- No response to mentions (2+): -5 pts
- Active engagement, responsive: +25 pts

**Decision Rule:**
- **85+ (Advocates):** Prioritize for mentorship, speaking, early feature access.
- **60–84 (Core):** Regular engagement, event invitations, feedback solicitation.
- **40–59 (Contributors):** Welcome participation, onboarding support.
- **20–39 (Lurkers):** Gentle first-post encouragement, low-friction participation.
- **<20 (Inactive):** Churn risk — flag for 30-day check-in or escalate.

## Input Data Required

1. Member email or ID
2. Join date
3. Post count (lifetime)
4. Comment count (lifetime)
5. Last activity date
6. Comment sentiment distribution (% positive/neutral/negative)
7. Channels followed
8. Response rate to @mentions

## Output Format

```
## [Member Name] — Segmentation Score

**Overall Score:** [0–100]

**Segment:** [Advocates / Core / Contributors / Lurkers / Inactive]

**Breakdown:**
- Engagement Level: [X/25] ([daily posts / 2-3x/week / monthly / read-only])
- Tenure: [X/25] ([6m+ / 3-6m / 1-3m / <1m])
- Contribution Quality: [X/25] ([mentors others / regular posts / occasional / lurks])
- Churn Risk: [X/25] ([active / at-risk / high-risk / inactive])

**Key Signals:**
- Posts: [X] | Comments: [X] | Sentiment: [X% positive, X% neutral, X% negative]
- Last Activity: [date] | Response Rate: [X%]
- Favorite Channels: [list]

**Churn Risk Assessment:**
- [HEALTHY / CAUTION / HIGH RISK] — Reasoning: [why score dropped / stabilized / improved]

**Recommended Action:**
- [For Advocates]: Invite to [opportunity]; offer mentorship role
- [For Core]: Solicit feedback; invite to events; feature recent post
- [For Contributors]: Send low-friction engagement ask (reaction, poll)
- [For Lurkers]: "First post" encouragement; recommend #new-members channel
- [For Inactive]: Send personalized re-engagement message; offer specific value
```

## Segmentation Strategy by Action

**Onboarding:** Score new members on day 1 (baseline: tenure 5 pts, engagement 5 pts). Re-score on day 7.

**Re-engagement:** Prioritize Lurkers and early Contributors (score 20–40) for low-friction asks.

**Mentorship/Speaking:** Target Advocates only (score 85+).

**Event Invitations:** Invite Advocates first (guaranteed attendance), then Core (high probability).

**Feedback Solicitation:** Ask Advocates/Core first; expand to Contributors if topic-specific.

## Example

**Member:** jane.doe@company.com (joined 2025-11-15)
- Posts: 47 | Comments: 123 | Sentiment: 82% positive, 15% neutral, 3% negative
- Last Activity: 2026-06-10 (3d ago)
- Favorite Channels: #engineering, #career-advice, #product-feedback

**Score Breakdown:**
- Engagement: 23/25 (top 15%, posts 3-4x/week)
- Tenure: 25/25 (6m 27d)
- Quality: 24/25 (helps others regularly, high-quality advice)
- Churn Risk: 24/25 (active, engaged, no red flags)

**Overall: 96/100 — ADVOCATE**

**Recommended Action:** Invite to speaker series on [topic]; offer peer mentor opportunity.

---
