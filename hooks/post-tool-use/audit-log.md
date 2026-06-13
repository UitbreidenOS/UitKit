# Hook: Audit Log

Records every tool call to a structured JSONL log file for review, compliance, and debugging.

## Event
`PostToolUse` — fires after every tool call completes

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
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/audit-log.sh",
            "async": true
          }
        ]
      }
    ]
  }
}
```

Empty `matcher` means it fires for every tool, not just Bash. `async: true` means it runs in the background without blocking Claude.

## What it does

Appends a JSON line to `.claude/logs/audit.log` for every tool call:

```json
{"timestamp":"2026-05-13T10:23:45Z","tool":"Write","input":{"file_path":"/src/app.py"},"exit_code":0}
```

Fields logged: `timestamp`, `tool_name`, `tool_input` (sanitized — secrets stripped), `exit_code`, `duration_ms`.

Useful for:
- Auditing what Claude changed during a session
- Debugging unexpected file modifications
- Compliance requirements that mandate change logging

## Setup

```bash
cp hooks/post-tool-use/audit-log.sh .claude/hooks/
chmod +x .claude/hooks/audit-log.sh
mkdir -p .claude/logs
echo ".claude/logs/" >> .gitignore
```


---
