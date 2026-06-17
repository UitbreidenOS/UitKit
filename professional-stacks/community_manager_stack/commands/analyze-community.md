# /analyze-community

Run weekly to segment audience, identify engagement gaps, surface at-risk members, and recommend re-engagement campaigns.

## What It Does

Executes the audience-analyzer skill to:
- Classify members by lifecycle stage (Lurker → New → Contributor → Power User → Alumni)
- Calculate activity scores (0–100) for each member
- Identify 20–30 at-risk members (inactive 14+ days, recent moderation, declining engagement)
- Recommend specific re-engagement campaigns (onboarding re-offer, power user recognition, winback email)
- Generate community health snapshot (% in each segment, engagement gaps, conversion rates)

**Output:** CSV export with member_id, lifecycle_stage, activity_score, at_risk_flag, and recommended action. Markdown summary report with insights and recommendations.

## Usage

```
/analyze-community
```

## Outputs

1. **member-analysis-{date}.csv** — Full member roster with segmentation
2. **Community Audience Analysis — {date}.md** — Summary report with recommendations, alerts, and health snapshot

## SOP

Run once per week, ideally Monday morning. Review alerts before standup. Assign recommended actions to team. Track month-over-month trends in segment sizes (are lurkers growing? Is contributor conversion rate improving?).

## Related Skills

- `audience-analyzer` — Performs the segmentation analysis
- `sentiment-analyzer` — Complements with mood/health context
- `engagement-tracker` — Provides engagement KPI baseline
