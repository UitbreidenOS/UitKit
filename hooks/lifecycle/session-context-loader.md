# Hook: Session Context Loader

Injects project-specific context at the start of every Claude Code session. Outputs today's date, current git branch, recent commits, working-tree status, active environment name, and the contents of any `.claude/session-context.md` file found in the project root.

## Event
`SessionStart` — fires once when the Claude Code session initialises

## settings.json entry

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash ~/.claude/hooks/session-context-loader.sh",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
```

## What it does

Collects the following at session start and returns them as a single JSON context injection:

| Field | Source |
|---|---|
| `date` | `date +%Y-%m-%d` |
| `branch` | `git branch --show-current` |
| `recent_commits` | `git log --oneline -5` |
| `git_status` | `git status --short` (first 10 lines) |
| `environment` | `$NODE_ENV` or `$ENVIRONMENT` env var |
| `custom_context` | `.claude/session-context.md` if present |

All git commands are wrapped with `2>/dev/null` so the hook works in non-git directories without noise. If no git repo is detected, those fields are omitted from the output.

Claude receives the injected context before processing any user message in the session, giving it accurate situational awareness from the first token.

## Script

Save to `~/.claude/hooks/session-context-loader.sh`:

```bash
#!/usr/bin/env bash
# session-context-loader.sh — SessionStart hook
# Injects date, git state, environment, and custom context into the session.

set -euo pipefail

# --- Date ---
TODAY=$(date +%Y-%m-%d)

# --- Git state (silent if not a git repo) ---
BRANCH=$(git branch --show-current 2>/dev/null || echo "")
COMMITS=$(git log --oneline -5 2>/dev/null || echo "")
STATUS=$(git status --short 2>/dev/null | head -10 || echo "")

# --- Environment name ---
ENV_NAME="${NODE_ENV:-${ENVIRONMENT:-${APP_ENV:-""}}}"

# --- Custom context file ---
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
CONTEXT_FILE="$PROJECT_DIR/.claude/session-context.md"
CUSTOM_CONTEXT=""
if [[ -f "$CONTEXT_FILE" ]]; then
  CUSTOM_CONTEXT=$(cat "$CONTEXT_FILE")
fi

# --- Build context string ---
CONTEXT="Session started: $TODAY"

if [[ -n "$BRANCH" ]]; then
  CONTEXT="$CONTEXT
Branch: $BRANCH"
fi

if [[ -n "$COMMITS" ]]; then
  CONTEXT="$CONTEXT
Recent commits:
$COMMITS"
fi

if [[ -n "$STATUS" ]]; then
  CONTEXT="$CONTEXT
Working tree:
$STATUS"
fi

if [[ -n "$ENV_NAME" ]]; then
  CONTEXT="$CONTEXT
Environment: $ENV_NAME"
fi

if [[ -n "$CUSTOM_CONTEXT" ]]; then
  CONTEXT="$CONTEXT
---
$CUSTOM_CONTEXT"
fi

# --- Output JSON context injection ---
python3 - <<PYEOF
import json, sys
context = """$CONTEXT"""
print(json.dumps({"context": context.strip()}))
PYEOF
```

## Setup

```bash
mkdir -p ~/.claude/hooks
cp hooks/lifecycle/session-context-loader.sh ~/.claude/hooks/
chmod +x ~/.claude/hooks/session-context-loader.sh
```

Add the `settings.json` entry to `~/.claude/settings.json` or `.claude/settings.json`.

To add project-specific notes that load automatically every session, create `.claude/session-context.md` in the project root:

```markdown
## Project Notes
- Auth service runs on port 3001
- Use `pnpm` not `npm`
- Staging DB is read-only before 9am UTC
```

This file is read fresh every session — update it as the project evolves. The hook works with and without git. Fields with no data are omitted from the injected context rather than left blank.

---
