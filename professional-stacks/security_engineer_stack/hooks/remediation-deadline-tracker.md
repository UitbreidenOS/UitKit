# Remediation Deadline Tracker Hook

## Description
Tracks security remediation deadlines and alerts when milestones approach or expire. Fires on branch switch, commit, and periodic intervals to monitor outstanding vulnerability fixes.

## settings.json Entry

```json
{
  "hooks": {
    "remediationDeadlineTracker": {
      "enabled": true,
      "checkInterval": 3600,
      "warningDaysBeforeDue": 3,
      "script": "security_engineer_stack/hooks/remediation-deadline-tracker.sh"
    }
  }
}
```

## Hook Script

Location: `security_engineer_stack/hooks/remediation-deadline-tracker.sh`

```bash
#!/bin/bash
# remediation-deadline-tracker.sh
# Monitors and alerts on security remediation deadline status

set -e

# TODO: Implement deadline tracking logic
# - Load remediation metadata from security_engineer_stack/data/remediations.json
# - Compare deadline dates against current date
# - Generate alerts for approaching/overdue items
# - Log status to security_engineer_stack/logs/deadline-tracking.log

echo "Remediation deadline tracker stub"
```

## When This Fires

- On branch switch (check for deadline changes)
- After each commit (update deadline metadata if present)
- On configurable interval (default: hourly health check)

## Setup Instructions

1. Enable in `.claude/settings.json` or project settings
2. Ensure `security_engineer_stack/data/` directory exists
3. Create baseline `remediations.json` with initial tracked items
4. Configure warning threshold via `warningDaysBeforeDue`
