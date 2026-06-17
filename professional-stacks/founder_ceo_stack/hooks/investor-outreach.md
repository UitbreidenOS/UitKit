# Hook: investor-outreach

## Trigger
Weekly or biweekly (configurable) outreach reminder and follow-up tracking

## Action
Auto-generate:
- List of investors due for follow-up (by stage and last contact date)
- Suggested outreach messages or templates
- Warm intro sources or relevant news hooks
- Calendar reminders for next check-in

## Configuration
```json
{
  "hook": "investor-outreach",
  "trigger": "schedule",
  "schedule": "0 9 * * 3",
  "model": "haiku"
}
```

## Output
- Structured follow-up list
- Sample email templates
- Calendar invite suggestions
- Integration with investor-tracker

## Notes
- Reduces manual tracking overhead
- Pulls from investor-tracker database
- Customizable outreach cadence by investor tier

---
**Last Updated:** June 2026
