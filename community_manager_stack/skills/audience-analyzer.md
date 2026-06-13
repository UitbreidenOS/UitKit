---
name: audience-analyzer
description: Segments community members by activity level, tenure, interests, and engagement patterns. Identifies lurkers, new members, contributors, power users, and alumni. Returns CSV export with member lifecycle stage, at-risk flag, and recommended next action.
allowed-tools: WebSearch, WebFetch, Write
effort: medium
---

## When to activate

Run weekly or whenever membership growth stalls. Before planning retention campaigns, targeted re-engagement, or moderation reviews. Essential input to `/analyze-community` command.

## When NOT to use

Not for individual member profiling without consent. Not as a surveillance tool. Not to shadowban or penalize members for low activity without human review. This is purely diagnostic and action-informing.

## Analysis Checklist

Execute in order:

1. **Import member data** — Get member list with: join_date, last_activity_date, post_count, comment_count, thread_starts, event_rsvps, profile_completeness
2. **Segment by lifecycle stage** — Classify each member using the Member Lifecycle Segments matrix (Lurker → New → Contributor → Power User → Alumni)
3. **Calculate activity score** — Sum: (post_count × 1) + (comment_count × 0.5) + (thread_starts × 2) + (event_attendance × 3) for a 0–100 scale
4. **Identify at-risk members** — Flag members with: (a) no activity in 14+ days, (b) last_activity was critical/negative moderation, (c) response rate to DMs <50%, (d) joining interest shift (e.g., role changed)
5. **Score engagement velocity** — Calculate 30-day activity trend: is member ramping up, plateauing, or declining?
6. **Identify power users** — Members with activity_score >75 or 50+ total posts who are active at least weekly
7. **Calculate community health** — % in each segment, average response time to new posts, engagement gap (active / total)
8. **Generate recommendations** — Suggest specific re-engagement campaigns, mentorship matchings, or escalations

## Segment Definitions

Use exact criteria:

| Segment | Criteria | Action |
|---|---|---|
| **Lurker** | joined 2+ weeks ago, 0 posts, reads only | Send onboarding re-offer; offer low-barrier first post prompt |
| **New Member** | joined <7 days ago OR <5 total posts | Welcome sequence; channel tour; intro thread |
| **Contributor** | 5–50 total posts, active in past 7 days | Feature content; invite to AMAs; recognize publicly |
| **Power User** | 50+ total posts, 2+ posts/week average | Offer moderator role; gather feedback; feature prominently |
| **Alumni** | 0 activity in 30+ days | Winback campaign; survey on why they left; offer to return |

## Output Format

Save as `community/member-analysis-{date}.csv`:

```
member_id,username,join_date,activity_score,lifecycle_stage,posts,comments,threads,events,last_active,days_inactive,at_risk_flag,engagement_velocity,recommended_action
1,jane_smith,2025-11-15,82,Power User,56,142,8,3,2026-06-12,0,false,+12%,Recognize in newsletter
2,alex_doe,2026-05-01,18,New Member,3,2,0,0,2026-06-11,1,false,+8%,Invite to intro thread
3,bob_wilson,2025-08-22,12,Lurker,0,0,0,0,2025-11-30,195,true,0%,Onboarding re-engage
```

## Segment Summary Report

Include in output:

```markdown
# Community Audience Analysis — [DATE]

**Total Members:** X
**Active Members (WAU):** X (Y%)
**Engaged Members (CAU):** X (Y%)

## By Lifecycle Stage

- **Lurkers:** X (Y%) — [Insight]
- **New Members:** X (Y%) — [Insight]
- **Contributors:** X (Y%) — [Insight]
- **Power Users:** X (Y%) — [Insight]
- **Alumni:** X (Y%) — [Insight]

## At-Risk Alerts

- [Count] members inactive 14+ days
- [Count] members with negative recent moderation
- [Count] members showing declining activity velocity

## Recommendations

1. [Specific action for largest at-risk segment]
2. [Specific action to accelerate contributor→power user conversion]
3. [Specific action to re-engage alumni]
```

## Example

# Community Audience Analysis — June 12, 2026

**Total Members:** 4,285
**Active Members (WAU):** 1,247 (29%)
**Engaged Members (CAU):** 847 (20%)

## By Lifecycle Stage

- **Lurkers:** 1,876 (44%) — Growing silent onboarding problem. New members not getting activated.
- **New Members:** 612 (14%) — On-ramp working; 38% converting to Contributor within 30 days.
- **Contributors:** 547 (13%) — Stable; good retention to Power User.
- **Power Users:** 178 (4%) — Highly engaged; retention 94% month-to-month.
- **Alumni:** 72 (2%) — 42 inactive 30+ days; 30 inactive 90+ days.

## At-Risk Alerts

- 128 members inactive 14+ days
- 8 members with negative recent moderation (not yet removed)
- 43 members showing declining activity velocity (month-over-month drop >30%)

## Recommendations

1. **Activate Lurkers:** Launch "First Post Fridays" challenge. Low-barrier prompt each Friday with recognition for first-time posters. Target: convert 20% of lurkers to contributors in 8 weeks.
2. **Accelerate Contributor→Power User:** Identify 15 contributors with growth trajectory; invite to internal Discord for feature feedback and content collaboration.
3. **Re-engage Alumni:** Winback email to 72 inactive members. Survey top 20 on why they left. Results inform product/moderation changes.

---
