# Hook: weekly-digest

## Trigger
Every Monday morning (or custom schedule) for weekly operations summary

## Action
Auto-compile:
- Key metrics (MoM/WoW revenue, burn, headcount, product)
- Action items from prior week + status
- Top 3 priorities for current week
- Investor activity and follow-ups due
- Team/hiring updates
- Risk flags or concerns

## Configuration
```json
{
  "hook": "weekly-digest",
  "trigger": "schedule",
  "schedule": "0 8 * * 1",
  "model": "haiku"
}
```

## Output
- Markdown digest (1 page)
- Optional: Slack/email delivery
- Integrated into session log

## Notes
- Lightweight and scannable
- Pulls from session notes, investor tracker, and metrics dashboard
- Model set to Haiku for speed

---
**Last Updated:** June 2026
