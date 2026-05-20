# Hook: Auto-Allow Read-Only Operations

Automatically approves read-only tool calls (Read, Glob, Grep, LS) without prompting. Eliminates the constant permission noise when Claude Code is exploring your codebase.

## What it does

- Intercepts `PreToolUse` events for read-only tools
- Automatically approves them without user prompt
- Still prompts for all write, delete, and shell operations
- Configurable — extend the allowlist for your team's safe operations

## settings.json entry

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Read|Glob|Grep|LS|TodoRead",
        "hooks": [
          {
            "type": "command",
            "command": "bash ~/.claude/hooks/auto-allow-readonly.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook script: auto-allow-readonly.sh

```bash
#!/usr/bin/env bash
# PreToolUse hook: auto-approve safe read-only operations
set -euo pipefail

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')

# Tools that are always safe to auto-allow
READONLY_TOOLS="Read|Glob|Grep|LS|TodoRead|WebSearch|WebFetch"

if echo "$TOOL_NAME" | grep -qE "^($READONLY_TOOLS)$"; then
  # Return approval signal — Claude proceeds without prompting
  echo '{"decision":"approve","reason":"Read-only operation auto-approved"}'
  exit 0
fi

# All other tools: let Claude Code handle normally (prompt user)
exit 0
```

## Setup

```bash
mkdir -p ~/.claude/hooks
cp auto-allow-readonly.sh ~/.claude/hooks/auto-allow-readonly.sh
chmod +x ~/.claude/hooks/auto-allow-readonly.sh
```

## Customising the allowlist

Add tools you trust to the `READONLY_TOOLS` pattern:
```bash
READONLY_TOOLS="Read|Glob|Grep|LS|TodoRead|WebSearch|WebFetch|GitStatus"
```

## Security note

This hook reduces friction for codebase exploration. It does NOT auto-allow:
- `Write`, `Edit`, `MultiEdit` — file modifications
- `Bash` — shell execution
- `Delete` — file deletion
- Any tool not in the explicit allowlist

Never add `Bash` to the allowlist without a command-level filter.
