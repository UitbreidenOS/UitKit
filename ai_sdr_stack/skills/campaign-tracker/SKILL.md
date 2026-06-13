---
name: campaign-tracker
description: Produces a campaign performance summary from session-log.md entries. Reports open rates, reply rates, and meeting conversion rates per sequence. Flags top performers (reply rate >10%) and underperformers (reply rate <3%). Recommends one concrete change per underperforming sequence.
allowed-tools: Read, Write
effort: medium
---

# Campaign Tracker

## When to activate
When reviewing sequence performance — weekly cadence or after a batch of 10+ emails sent. Use to identify which hooks and triggers are converting and which need a rethink.

## When NOT to use
Do not use if fewer than 5 emails have been sent in a sequence — not enough data for meaningful analysis. Do not use to track individual email opens unless open tracking is explicitly enabled.

## Instructions

1. Read `session-log.md` and extract all activity entries for the specified time window (default: last 30 days) or a named sequence.
2. Calculate per-sequence metrics:
   - **Emails sent:** count of SENT status entries
   - **Replies received:** count of REPLIED status entries
   - **Meetings booked:** count of MEETING BOOKED entries
   - **Reply rate:** replies ÷ sent
   - **Meeting rate:** meetings ÷ replies
3. Flag sequences:
   - **Top performer:** reply rate >10%
   - **Underperformer:** reply rate <3% after 10+ sends
4. For each underperformer, recommend one specific change: different trigger type, different CTA format, different subject line approach, or different ICP segment.
5. Return the summary report.

## Output Format

```
CAMPAIGN PERFORMANCE REPORT
Period: [date range]
Total emails sent: [X] | Replies: [X] | Meetings: [X]
Overall reply rate: [X%] | Overall meeting rate: [X%]

--- TOP PERFORMERS ---
[Sequence name]: [X]% reply rate | [X] meetings | Trigger: [what worked]

--- UNDERPERFORMERS ---
[Sequence name]: [X]% reply rate | [X] sends
Recommendation: [one specific change]

--- NEXT ACTIONS ---
[ ] [Action 1]
[ ] [Action 2]
```

## Example

```
CAMPAIGN PERFORMANCE REPORT
Period: 2026-05-15 to 2026-06-12
Total emails sent: 47 | Replies: 6 | Meetings: 2
Overall reply rate: 12.8% | Overall meeting rate: 33%

--- TOP PERFORMERS ---
Series B SaaS sequence: 18% reply rate | 2 meetings | Trigger: funding round reference in subject line

--- UNDERPERFORMERS ---
Generic VP Sales sequence: 2% reply rate | 22 sends
Recommendation: Replace generic "saw your company is growing" hook with specific job posting signal — "You're hiring 3 AEs" — to improve specificity.

--- NEXT ACTIONS ---
[ ] Retire generic VP Sales sequence — rebuild with job posting trigger
[ ] Expand Series B SaaS sequence to 15 new accounts with recent funding
```

---
