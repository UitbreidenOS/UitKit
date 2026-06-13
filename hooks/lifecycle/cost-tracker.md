# Hook: Cost Tracker

Estimates and logs token usage and cost per tool call, giving you a running total of session spend.

## Event
`PostToolUse` — fires after every tool call, async

## settings.json entry

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/cost-tracker.sh",
            "async": true
          }
        ]
      }
    ]
  }
}
```

## What it does

Reads token counts from the tool result payload and appends a cost estimate to `.claude/logs/costs.log`:

```
2026-05-13 10:23:45 | Write         | in:  1,240 | out:    45 | $0.0042 | session: $0.0312
2026-05-13 10:23:52 | Bash          | in:    890 | out:    12 | $0.0028 | session: $0.0340
```

Pricing is based on Sonnet 4.6 rates and is updated in the script header — edit `INPUT_COST_PER_MTK` and `OUTPUT_COST_PER_MTK` to match your model.

At session end, the final line shows total session cost. Rotate or clear the log between sessions as needed.

## Setup

```bash
cp hooks/lifecycle/cost-tracker.sh .claude/hooks/
chmod +x .claude/hooks/cost-tracker.sh
mkdir -p .claude/logs
echo ".claude/logs/" >> .gitignore
```


---
