# Hook: Large Output Detector

Warns Claude when a tool output exceeds a configurable character threshold. Prevents large shell outputs, file reads, or search results from flooding the context window. Claude receives the warning and can choose to summarize, paginate, or ask the user before including the full output in its response.

## Event
`PostToolUse` — fires after every tool call, no matcher (covers all tools)

## settings.json entry

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash ~/.claude/hooks/output-size-warn.sh",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

## What it does

Reads the `tool_output` field from the PostToolUse JSON payload on stdin and measures its character length. If the output exceeds the threshold, the hook prints a structured warning message back to Claude via stdout. Claude then sees the warning alongside the tool output and can decide how to handle it.

The hook always exits 0 — it is advisory only and never blocks execution.

**Default threshold:** 50,000 characters. Override with the `OUTPUT_SIZE_WARN_THRESHOLD` env var.

**Log file:** `~/.claude/hooks/output-size.log` — records timestamp, tool name, output size, and threshold for every oversized output.

**Warning format returned to Claude:**

```
Large output detected (83,241 chars, threshold 50,000). Consider summarizing key points rather than including the full output in your response. Ask the user if they want the full output or a summary.
```

## Script

Save to `~/.claude/hooks/output-size-warn.sh`:

```bash
#!/usr/bin/env bash
# output-size-warn.sh — PostToolUse hook
# Warns Claude when tool output exceeds the size threshold.

set -euo pipefail

LOG_FILE="${HOME}/.claude/hooks/output-size.log"
THRESHOLD="${OUTPUT_SIZE_WARN_THRESHOLD:-50000}"

# Read full stdin payload
PAYLOAD=$(cat)

# Extract tool_output value using Python (handles JSON escaping reliably)
OUTPUT=$(python3 - <<PYEOF
import json, sys
try:
    data = json.loads("""${PAYLOAD/\"/\\\"}""")
    val = data.get("tool_output", "")
    if not isinstance(val, str):
        val = json.dumps(val)
    print(val, end="")
except Exception:
    pass
PYEOF
) || OUTPUT=""

CHAR_COUNT=${#OUTPUT}

if (( CHAR_COUNT <= THRESHOLD )); then
  exit 0
fi

# Extract tool name for log
TOOL_NAME=$(python3 - <<PYEOF
import json, sys
try:
    data = json.loads("""${PAYLOAD/\"/\\\"}""")
    print(data.get("tool_name", "unknown"), end="")
except Exception:
    print("unknown", end="")
PYEOF
) || TOOL_NAME="unknown"

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Write to log
mkdir -p "$(dirname "$LOG_FILE")"
printf '%s\t%s\t%d chars\tthreshold %d\n' \
  "$TIMESTAMP" "$TOOL_NAME" "$CHAR_COUNT" "$THRESHOLD" >> "$LOG_FILE"

# Format numbers with commas via Python for readability
FORMATTED=$(python3 -c "print(f'{${CHAR_COUNT}:,}'), print(f'{${THRESHOLD}:,}')" 2>/dev/null \
  || echo "${CHAR_COUNT} ${THRESHOLD}")
COUNT_FMT=$(python3 -c "print(f'{${CHAR_COUNT}:,}')" 2>/dev/null || echo "$CHAR_COUNT")
THRESH_FMT=$(python3 -c "print(f'{${THRESHOLD}:,}')" 2>/dev/null || echo "$THRESHOLD")

# Print warning for Claude to see
cat <<WARNING
Large output detected (${COUNT_FMT} chars, threshold ${THRESH_FMT}). Consider summarizing key points rather than including the full output in your response. Ask the user if they want the full output or a summary.
WARNING

exit 0
```

### Simplified pure-Python version

If you prefer a single Python script over bash (avoids shell quoting edge cases with complex JSON payloads):

Save to `~/.claude/hooks/output-size-warn.py`:

```python
#!/usr/bin/env python3
"""
Large output detector — PostToolUse hook.
Warns Claude when tool output exceeds the size threshold.
"""

import json
import os
import sys
from datetime import datetime, timezone

THRESHOLD = int(os.environ.get("OUTPUT_SIZE_WARN_THRESHOLD", "50000"))
LOG_PATH = os.path.expanduser("~/.claude/hooks/output-size.log")


def main():
    try:
        payload = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        sys.exit(0)

    tool_name = payload.get("tool_name", "unknown")
    tool_output = payload.get("tool_output", "")
    if not isinstance(tool_output, str):
        tool_output = json.dumps(tool_output)

    char_count = len(tool_output)
    if char_count <= THRESHOLD:
        sys.exit(0)

    # Log the event
    timestamp = datetime.now(timezone.utc).isoformat()
    os.makedirs(os.path.dirname(LOG_PATH), exist_ok=True)
    with open(LOG_PATH, "a") as f:
        f.write(f"{timestamp}\t{tool_name}\t{char_count:,} chars\tthreshold {THRESHOLD:,}\n")

    # Warn Claude
    print(
        f"Large output detected ({char_count:,} chars, threshold {THRESHOLD:,}). "
        "Consider summarizing key points rather than including the full output in your response. "
        "Ask the user if they want the full output or a summary."
    )
    sys.exit(0)


if __name__ == "__main__":
    main()
```

To use the Python version instead, update the `settings.json` command to:

```json
"command": "python3 ~/.claude/hooks/output-size-warn.py"
```

## Setup

```bash
mkdir -p ~/.claude/hooks

# Bash version
cp hooks/post-tool-use/output-size-warn.sh ~/.claude/hooks/
chmod +x ~/.claude/hooks/output-size-warn.sh

# Or Python version
cp hooks/post-tool-use/output-size-warn.py ~/.claude/hooks/
chmod +x ~/.claude/hooks/output-size-warn.py
```

Add the `settings.json` entry to `~/.claude/settings.json` or `.claude/settings.json`.

To adjust the threshold for a specific project, set the env var in `.claude/settings.json`:

```json
{
  "env": {
    "OUTPUT_SIZE_WARN_THRESHOLD": "25000"
  }
}
```

Review logged oversized outputs with:

```bash
cat ~/.claude/hooks/output-size.log
```

---
