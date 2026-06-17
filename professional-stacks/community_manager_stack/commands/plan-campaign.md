# /plan-campaign

Draft quarterly or annual content calendar aligned with product roadmap, community interests, and seasonal engagement patterns.

## What It Does

Executes the content-calendar-planner skill to:
- Define content pillars (Product Updates, Best Practices, Customer Stories, Industry News, Community Wins)
- Schedule feature announcements (beta launch, GA, deep-dive, office hours)
- Plan 2–4 AMAs per quarter with speaker, date, and promotion timeline
- Map seasonal moments (holidays, annual events, industry conferences)
- Build promotion timeline (3 weeks out: announce, 1 week: email, daily: reminders)
- Estimate lift metrics (new signups, engagement rate, AMA attendance)

**Output:** Interactive markdown calendar with week-by-week breakdown, major initiative grid, success metrics, and promotion timeline.

## Usage

```
/plan-campaign [quarter] [year]
```

Example:
```
/plan-campaign Q3 2026
```

## Outputs

1. **Content Calendar — Q{X} {Year}.md** — Week-by-week plan with themes, content types, owners, and promotion dates
2. **Major Initiatives Grid** — AMA schedule, feature announcements, events, estimated attendance
3. **Promotion Timeline** — T-3 weeks to T+1 for each major initiative

## SOP

Plan quarterly in last month of prior quarter (Q3 planning happens in Q2, June). Involve product team (feature dates), power users (topic requests), and content team (capacity). Share calendar with community at start of quarter ("Here's what we have planned for you"). Adjust weekly based on feedback and engagement data.

## Related Skills

- `content-calendar-planner` — Builds the calendar and timeline
- `event-coordinator` — Handles detailed event planning (for AMAs and workshops)
- `engagement-tracker` — Provides baseline metrics for forecasting
