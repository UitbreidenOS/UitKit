# Approval Gate Hook

## What This Hook Does
Blocks all outbound message sends until the human explicitly approves the draft. Fires before any Bash command that could trigger an email send, API call, or LinkedIn message dispatch. Claude must present the draft and receive a typed "APPROVE" before any send command executes.

## Settings.json Entry

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/approval-gate.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook Script: approval-gate.sh

```bash
#!/bin/bash
# Approval gate for AI SDR Stack
# Intercepts Bash commands that could send outbound messages
# Checks for APPROVED flag in session-log.md before allowing send

COMMAND=$(echo "$CLAUDE_TOOL_INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('command',''))" 2>/dev/null)

# Detect send-related commands
SEND_PATTERN="(send|smtp|curl.*mail|sendgrid|mailgun|hubspot.*send|linkedin.*message|outreach.*send)"

if echo "$COMMAND" | grep -iqE "$SEND_PATTERN"; then
  # Check for APPROVED flag in current session context
  if ! grep -q "\[APPROVED\]" session-log.md 2>/dev/null; then
    echo "BLOCKED: No approval found in session-log.md."
    echo ""
    echo "Before any outbound send, the draft must be reviewed and approved."
    echo "Present the full email draft to the human and receive explicit approval."
    echo "Log approval as: [APPROVED] Email to prospect@company.com — YYYY-MM-DD HH:MM"
    exit 1
  fi
fi
```

## Behavior

**On block:** Prints a clear block message with instructions for the approval workflow. The send command does not execute.

**On pass:** Silent — the Bash command runs normally.

## Setup Instructions

1. Create `.claude/hooks/` in your project root:
   ```bash
   mkdir -p .claude/hooks
   ```
2. Save the script as `.claude/hooks/approval-gate.sh`
3. Make it executable:
   ```bash
   chmod +x .claude/hooks/approval-gate.sh
   ```
4. Add the settings.json entry to `.claude/settings.json`
5. Restart Claude Code.

## Important Note
This hook is a safety net, not the primary approval mechanism. The primary gate is Claude's instruction never to send without approval. This hook catches cases where a send command is attempted without a logged approval.
