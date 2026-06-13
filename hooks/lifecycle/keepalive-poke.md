# Keep-Alive Poke Hook

Automatically sends a continuation message when Claude stops, keeping long autonomous sessions running without manual intervention. Controlled by a feature-flag file and a hard cap on continuations to prevent infinite loops.

---

## What it does

When a `Stop` event fires (Claude finishes a turn and halts), this hook checks for a `.claude/keepalive` flag file. If the file is present, it reads the continuation message from it and outputs a `continue` payload — Claude picks this up and keeps going. A counter file tracks how many continuations have fired; when it reaches the configured maximum the hook exits silently and the session stops naturally.

**Fires on:** `Stop`

---

## settings.json

```json
{
  "hooks": {
    "Stop": [{
      "hooks": [{"type": "command", "command": "bash ~/.claude/hooks/keepalive-poke.sh"}]
    }]
  }
}
```

---

## Script: `~/.claude/hooks/keepalive-poke.sh`

```bash
#!/usr/bin/env bash
set -euo pipefail

FLAG_FILE=".claude/keepalive"
COUNTER_FILE=".claude/keepalive-count"
MAX_CONTINUATIONS=10

# Feature flag — if the file doesn't exist, do nothing
if [[ ! -f "$FLAG_FILE" ]]; then
  exit 0
fi

# Read continuation message (default if file is empty)
MESSAGE=$(cat "$FLAG_FILE")
MESSAGE="${MESSAGE:-Continue with the next task.}"

# Read and increment counter
COUNT=0
if [[ -f "$COUNTER_FILE" ]]; then
  COUNT=$(cat "$COUNTER_FILE" 2>/dev/null || echo "0")
  COUNT=$(( COUNT + 0 ))  # ensure numeric
fi

if (( COUNT >= MAX_CONTINUATIONS )); then
  echo "keepalive-poke: reached max continuations ($MAX_CONTINUATIONS). Stopping." >&2
  # Remove flag so next Stop doesn't re-trigger until re-enabled
  rm -f "$FLAG_FILE" "$COUNTER_FILE"
  exit 0
fi

# Increment counter
echo $(( COUNT + 1 )) > "$COUNTER_FILE"

# Output the continue payload for Claude Code
printf '{"continue": true, "message": "%s"}\n' "$MESSAGE"
```

---

## Setup

**Enable:**
```bash
mkdir -p .claude
echo "Continue with the next task." > .claude/keepalive
```

**Customise message:**
```bash
echo "Check the CI status and fix any failures." > .claude/keepalive
```

**Disable (immediately):**
```bash
rm .claude/keepalive
```

**Reset counter:**
```bash
rm -f .claude/keepalive-count
```

**Change max continuations:** edit `MAX_CONTINUATIONS` in the script. The default is 10. For overnight runs, 50 is a reasonable upper bound.

---

## Notes

- Add `.claude/keepalive` and `.claude/keepalive-count` to `.gitignore` — these are local runtime files, not project config.
- The counter file persists across sessions. Reset it manually if you want to re-use the same project directory for a new run.
- This hook is intentionally dumb — it does not inspect what Claude did or whether it succeeded. Pair it with an error-detection hook if you need to stop on failure.

---
