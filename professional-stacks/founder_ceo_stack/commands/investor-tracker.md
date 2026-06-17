# Command: investor-tracker

## Purpose
Log, organize, and track investor interactions and follow-ups. Integrates with session notes and calendar.

## Usage
```
/investor-tracker [--action log|list|summary] [--filter stage|geography|tier]
```

## Actions
- `log` — Record new investor interaction (name, stage, sentiment, next step, date)
- `list` — Show current pipeline with status
- `summary` — Weekly/monthly summary (outreach, meetings, commitments)

## Output
- Structured investor log (name, fund, check size, stage, last contact, next action)
- Follow-up reminders
- Funnel status (initial contact → warm lead → pitch → term sheet)

## Notes
- Connect to CRM MCP tool for automated logging
- Pair with `pre-meeting-prep` hook for automatic context before calls

---
**Last Updated:** June 2026
