# Stakeholder Sync Reminder Hook

## What This Hook Does
Reminds the PM to run the stakeholder-summarizer skill and distribute 1-page summaries to each function (eng, sales, support, exec) before the feature launches. Fires on Stop (session end).

## Settings.json Entry

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/stakeholder-sync-reminder.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook Script: stakeholder-sync-reminder.sh

```bash
#!/bin/bash
# Stakeholder sync reminder for PM Stack
# Checks if stakeholder summaries were created

if [ ! -f "session-log.md" ]; then
  exit 0
fi

# Check if any PRD was finalized today
TODAY=$(date "+%Y-%m-%d")
PRD_FINALIZED=$(grep -c "$TODAY" session-log.md || echo 0)

if [ "$PRD_FINALIZED" -gt 0 ]; then
  echo ""
  echo "STAKEHOLDER COMMUNICATION CHECKLIST"
  echo "---"
  echo "You finalized a PRD today. Before launch, distribute:"
  echo ""
  echo "- [ ] /stakeholder-summarizer — generate 4 one-pagers"
  echo "- [ ] Engineering summary sent to tech lead + team"
  echo "- [ ] Sales summary sent to sales leadership + reps"
  echo "- [ ] Support summary sent to support team + documentation"
  echo "- [ ] Executive summary sent to leadership for context"
  echo ""
  echo "Timing: Do this 2 weeks before estimated launch date."
  echo ""
fi
```

## Behavior

**On match:** Prints a checklist reminding PM to communicate with stakeholders.

**On no match:** Silent — no PRD finalized today.

## Setup Instructions

1. Save as `.claude/hooks/stakeholder-sync-reminder.sh`
2. Make executable: `chmod +x .claude/hooks/stakeholder-sync-reminder.sh`
3. Add the settings.json entry to `.claude/settings.json`
4. Restart Claude Code.
