---
name: engagement-tracker
description: Deep-dives on engagement KPIs: reply rate, response time, thread length, sentiment drift, growth trends. Compares current week/month to prior periods. Flags anomalies (sudden drops, spikes). Outputs visualization-ready data and alert list.
allowed-tools: WebSearch, Read, Write
effort: medium
---

## When to activate

Run weekly or when engagement metrics appear to decline. Before making moderation policy changes, platform updates, or content strategy pivots. Input from community analytics backend. Output to leadership dashboard and session log.

## When NOT to use

Not as a surveillance tool for individual members. Not to justify punitive actions without context. Not as the only input to strategy decisions; pair with sentiment analysis and qualitative feedback.

## Tracking Checklist

Execute in order:

1. **Collect engagement baseline** — Pull prior 4 weeks of data: weekly reply rate, avg response time (first reply to new post), thread length, new posts/day, comment threads/posts, members mentioning/week
2. **Calculate weekly metrics** — For current week: reply_rate, first_reply_latency, avg_thread_depth, posts_per_day, sentiment_score (0–100), new_members, weekly_active_users
3. **Compare to prior week + prior month + quarterly baseline** — Calculate % change for each metric. Flag anything >20% variance as anomaly.
4. **Identify inflection points** — If reply rate dropped sharply, when did it start? Correlate to: moderation action, feature change, announcement, external event (e.g., outage)
5. **Segment by channel/topic** — Do metrics vary by channel? Is #announcements less engaged than #general? Is #help under-resourced?
6. **Calculate health score** — 0–100 scale: (reply_rate × 0.3) + (response_time_inverse × 0.2) + (thread_depth × 0.2) + (growth_trend × 0.2) + (sentiment × 0.1)
7. **Flag at-risk thresholds** — Reply rate <50%, response time >24h, health score <60, sentiment score <50
8. **Generate alerts** — If thresholds breached, recommend immediate action

## Metrics Definitions

| Metric | Calculation | Healthy Range | Alert Threshold |
|---|---|---|---|
| **Reply Rate** | (threads with ≥1 reply / total new threads) × 100 | >65% | <50% |
| **First Reply Latency** | Avg minutes from post to first reply | <120 min | >480 min (8h) |
| **Thread Depth** | Avg total replies per thread | >5 | <3 |
| **Posts per Day** | Daily average new posts | >10 | <5 |
| **Comment:Post Ratio** | Total comments / total posts | >3:1 | <2:1 |
| **Weekly Active Users** | Unique members posting/reacting | growing | <3% MoM growth |
| **Sentiment Score** | % positive reactions / total reactions | >70% | <50% |
| **Response Time (Moderator)** | Avg minutes from report to action | <240 min (4h) | >1440 min (24h) |

## Weekly Report Template

```markdown
# Engagement Report — Week of [DATE]

**Health Score:** X/100 — [Status: Healthy / Caution / Critical]

---

## Key Metrics

| Metric | This Week | Last Week | Change | Status |
|---|---|---|---|---|
| Reply Rate | 68% | 71% | -3% | Stable |
| First Reply Latency | 115 min | 108 min | +7 min | Healthy |
| Thread Depth | 6.2 avg | 6.8 avg | -0.6 | Slight decline |
| Posts/Day | 18 | 21 | -14% | Declining |
| WAU | 842 | 801 | +5% | Growing |
| Sentiment Score | 72% | 75% | -3% | Stable |
| Response Time (Moderator) | 98 min | 132 min | -26% | Improved |

---

## Insights

[Analysis of what changed, why, and what it means for community health]

### Anomalies Detected

- Posts/day down 14% — Correlates with Monday outage (Jun 10, 2–4pm). Typical recovery pattern. No action needed.
- First reply latency +7 min — Within margin of error. No concern.

### By Channel

| Channel | Posts | Replies | Avg Depth | Reply Rate |
|---|---|---|---|---|
| #general | 54 | 189 | 3.5 | 93% |
| #help | 23 | 78 | 3.4 | 91% |
| #announcements | 8 | 34 | 4.3 | 88% |
| #introductions | 31 | 12 | 0.4 | 42% |

**Insight:** #introductions is under-engaged. Members introduce themselves but receive few replies. Consider: (a) pinning helpful reply template, (b) assigning ambassador to reply to intros, (c) making intros into discussion threads.

---

## Alerts

None this week. All metrics healthy.

---

## Recommendations

1. **Monitor posts/day recovery** — Watch for trend next week. If remains <15, investigate moderation impact or external headwinds.
2. **Boost #introductions engagement** — Assign 1 team member to reply to every new intro within 2h. Target: 70% reply rate within 2 weeks.
3. **Maintain response time velocity** — Moderator response time improved 26%. Document what changed and replicate.

---

## Forecast (Next 7 Days)

Based on trend extrapolation:
- Reply rate: Expect stable 65–70%
- Posts/day: Expect recovery to 18–20 as outage impact fades
- WAU: Expect 2–3% growth
- New members: Expect 40–50 based on historical trend
