# Hook: Permission Request Audit

Fires on `PermissionRequest` to write every permission ask — tool name, arguments, and decision context — to a structured audit log. Useful for compliance review, debugging over-permissive sessions, and understanding what Claude attempted during a long run.

## What it does

Reads the `PermissionRequest` payload from stdin and appends a JSON-lines record to `.claude/logs/permission-audit.jsonl`. Each record contains:

- `timestamp` — ISO-8601 UTC
- `session` — session ID
- `tool` — the tool Claude is requesting permission to use
- `input_summary` — first 200 characters of the tool input (sanitised — secrets detected by pattern are redacted)
- `event` — always `"permission_request"` for easy filtering

Example JSONL line:
```json
{"timestamp":"2026-06-03T10:22:01Z","session":"abc123","event":"permission_request","tool":"Bash","input_summary":"git push origin main --force"}
```

The script also emits the full payload to stderr (visible in Claude's debug output) without affecting the permission decision — exit 0 always, so this hook is purely observational.

## When it fires

`PermissionRequest` — fires before Claude Code shows the user a permission prompt for any tool call that requires explicit approval.

## settings.json entry

```json
{
  "hooks": {
    "PermissionRequest": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/permission-request-audit.sh",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

Set `matcher` to a specific tool name (e.g. `"Bash"`) to audit only shell calls.

## Script

`permission-request-audit.sh`

```bash
#!/usr/bin/env bash
# permission-request-audit.sh
# Fires on PermissionRequest — writes a JSONL audit record for every permission ask

set -euo pipefail

LOG_DIR="${CLAUDE_PROJECT_DIR:-$HOME}/.claude/logs"
LOG_FILE="$LOG_DIR/permission-audit.jsonl"

mkdir -p "$LOG_DIR"

PAYLOAD=$(cat)
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
SESSION="${CLAUDE_SESSION_ID:-unknown}"

if command -v jq &>/dev/null; then
  TOOL=$(echo "$PAYLOAD"  | jq -r '.tool_name // .tool // "unknown"')
  RAW_INPUT=$(echo "$PAYLOAD" | jq -r '.tool_input | tostring' | head -c 200)
else
  TOOL=$(echo "$PAYLOAD"  | grep -o '"tool_name":"[^"]*"' | cut -d'"' -f4 || echo "unknown")
  RAW_INPUT=$(echo "$PAYLOAD" | head -c 200)
fi

# Redact common secret patterns before writing
INPUT_SUMMARY=$(echo "$RAW_INPUT" \
  | sed 's/[A-Za-z0-9_\-]\{20,\}/[REDACTED]/g' \
  | sed 's/sk-[A-Za-z0-9]\+/[REDACTED]/g' \
  | sed 's/ghp_[A-Za-z0-9]\+/[REDACTED]/g')

# Write JSONL record
printf '{"timestamp":"%s","session":"%s","event":"permission_request","tool":"%s","input_summary":"%s"}\n' \
  "$TIMESTAMP" "$SESSION" "$TOOL" \
  "$(echo "$INPUT_SUMMARY" | sed 's/"/\\"/g')" \
  >> "$LOG_FILE"

# Always allow — this hook is audit-only
exit 0
```

## Setup

```bash
cp hooks/permission/permission-request-audit.sh .claude/hooks/
chmod +x .claude/hooks/permission-request-audit.sh
mkdir -p .claude/logs
```

To run the audit as a **blocking** gate (require manual approval for every sensitive tool), change exit 0 to exit 1 for the tools you want to force-prompt. To hard-block, exit 2.

## Notes

- `.jsonl` format makes it easy to stream into analytics: `jq -s '.' .claude/logs/permission-audit.jsonl` or import into any log aggregator.
- The redaction regex is intentionally broad. Tune the `sed` patterns to match your project's secret formats.
- Pair with `permission-denied-alert` to get notified when permission is ultimately refused after the audit fires.
- Rotate the log file regularly; a busy session can generate hundreds of records.

---


📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
