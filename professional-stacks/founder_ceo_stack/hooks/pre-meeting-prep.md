# Hook: pre-meeting-prep

## Trigger
Before board meetings, investor 1-on-1s, or customer review calls (calendar-based or manual activation)

## Action
Auto-generate brief with:
- Investor/participant profile and history
- Prior commitments and asks
- Key metrics to share
- Potential questions and talking points
- Risk flags or concerns to address

## Configuration
```json
{
  "hook": "pre-meeting-prep",
  "trigger": "before-event",
  "filters": {
    "keywords": ["board", "investor", "pitch"],
    "lead_time_minutes": 15
  }
}
```

## Output
- Markdown brief (1-2 pages)
- Integrated into notification or saved to session
- Optional: calendar event notes update

## Notes
- Requires calendar integration or manual "remind me about meeting"
- Pulls from investor-tracker and prior notes
- Customize based on meeting type

---
**Last Updated:** June 2026
