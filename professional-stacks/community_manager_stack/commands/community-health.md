---
description: Generates weekly community health report. Shows member growth, churn, engagement rate, sentiment distribution, top posts, at-risk members, and action items.
---

# /community-health

## What This Does

Runs the community-health-scorer skill to generate a comprehensive weekly health report. Aggregates all key metrics: growth, engagement, sentiment, churn, satisfaction, and content insights.

## Steps Claude Follows

1. Ask for: week ending date (defaults to today)
2. Run community-health-scorer skill — full metric calculation (growth, engagement, sentiment, churn, NPS, content analysis)
3. Fetch trailing 12 weeks of data for trend analysis
4. Score overall health (Green/Yellow/Red)
5. Identify top 3 action items
6. Generate report with all metrics, trends, and recommendations
7. Save to session-log.md

## Next Action Logic

- **Green (70+):** Celebrate momentum, maintain cadence, invest in new initiatives.
- **Yellow (50–69):** Review engagement trends, address churn signals, strengthen weak area.
- **Red (<50):** Urgent intervention needed — community at risk, escalate to leadership.

## Output Format

### Health Score Summary

```
Overall Health: [X/100] ([GREEN / YELLOW / RED])
Status: [THRIVING / HEALTHY / CAUTION / AT RISK]
Top Priority: [One sentence]
```

### Key Metrics

```
Member Growth: [+X%] (Target: 10%+)
Monthly Active Rate: [X%] (Target: 40%+)
Engagement Rate: [X%] (Target: 15%+)
Churn Rate: [X%] (Target: <2%)
Sentiment: [X% positive] (Target: 70%+)
NPS: [X] (Target: 50+)
```

### Trends (4-week comparison)

```
Growth: [↑ / → / ↓]
Engagement: [↑ / → / ↓]
Sentiment: [↑ / → / ↓]
Churn: [↑ / → / ↓]
```

### Top Discussions & Themes

```
Most Engaged Post: [Title] ([replies])
Emerging Topic: [Topic] ([interest level])
Content Gap: [Topic] ([demand but low supply])
```

### At-Risk Members

```
High-Risk (Advocates inactive 14+ days): [X]
Medium-Risk (Core inactive 7+ days): [X]
Reactivation Success Rate: [X%]
```

### Action Items

```
IMMEDIATE (This Week):
- [ ] [Action 1]
- [ ] [Action 2]

SHORT-TERM (This Month):
- [ ] [Action 1]
- [ ] [Action 2]

LONGER-TERM (Next Quarter):
- [ ] [Action 1]
```

## When to Use

- Every Monday morning (weekly health check)
- Before making major decisions (event planning, policy changes)
- Before community leadership meetings
- When investigating a specific concern (engagement drop, sentiment decline)
- For reporting to stakeholders

## Example

**Week of June 10–16, 2026**

**Output:**

```
OVERALL HEALTH: 78/100 (GREEN — THRIVING)

KEY METRICS:
- Member Growth: +2.1% (18 new members) ✓
- Monthly Active Rate: 44% (Target: 40%+) ✓
- Weekly Active Rate: 18% (Target: 15%+) ✓
- Engagement Rate: 2.3 posts/member/week ✓
- Churn Rate: 1.2% (Target: <2%) ✓
- Sentiment: 74% positive, 2% negative ✓
- NPS: 58 (Target: 50+) ✓

TRENDS (4-week):
- Growth: ↑ (consistent increase)
- Engagement: ↑ (new event series driving activity)
- Sentiment: ↑ (best week in June)
- Churn: → (stable)

TOP DISCUSSIONS:
1. "Scaling from 5 to 50 engineers" — 47 replies (highest engagement)
2. "Remote hiring best practices" — 32 replies (growing interest)
3. "Leadership lessons from Series A" — 28 replies (new evergreen topic)

EMERGING ADVOCATES:
- alex_kumar (Contributors → Core) — 8 helpful comments this week
- priya_singh (Lurkers → Contributors) — First 2 posts, both well-received

CONTENT GAPS:
- "Product roadmapping at hypergrowth" — requested 3 times, no answers
- "#product-feedback channel" — requested by 5+ members

AT-RISK MEMBERS:
- HIGH-RISK: michael_torres (Advocate, 9d inactive) — schedule check-in
- MEDIUM-RISK: 3 Core members (5–7d inactive) — send re-engagement sequence

REACTIVATION SUCCESS:
- Sent 5 re-engagement sequences last week
- 3 members returned (60% success rate) ✓

ACTION ITEMS:

IMMEDIATE:
- [ ] Direct check-in with michael_torres (Advocate at-risk)
- [ ] Launch monthly AMA series (high demand signal)
- [ ] Create #product-feedback channel (requested 5+ times)

SHORT-TERM:
- [ ] Develop "Product Roadmapping" content series
- [ ] Send re-engagement sequences to 3 at-risk Core members
- [ ] Feature alex_kumar and priya_singh (emerging advocates)

LONGER-TERM:
- [ ] Build member mentorship program (Advocates → Contributors)
- [ ] Expand event cadence (currently 1x/month, demand suggests 2x)
- [ ] Create "Playbook" series (evergreen content from top discussions)

---

Next report: June 17–23, 2026
```

---
