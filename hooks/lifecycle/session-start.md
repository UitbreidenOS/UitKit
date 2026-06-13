# Hook: Session Start

Runs setup tasks when a Claude Code session begins — prints a welcome banner, checks for uncommitted changes, and reminds Claude of the project context.

## Event
`Notification` — fires on session start (and other lifecycle notifications)

## settings.json entry

```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "session_start",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/session-start.sh",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

## What it does

On session start:
1. Prints project name and current branch to stdout (visible in Claude's context)
2. Runs `git status --short` — if there are uncommitted changes, outputs a summary
3. Checks for a `.claude/session-notes.md` file and prints it if present (use this for per-project reminders)

Example output injected into context:
```
=== Session Start: myproject (branch: feature/auth) ===
Uncommitted changes: 3 files (M src/auth.py, M tests/test_auth.py, ?? .env.local)
Session notes: Working on JWT refresh token implementation. Tests failing on line 42.
```

## Setup

```bash
cp hooks/lifecycle/session-start.sh .claude/hooks/
chmod +x .claude/hooks/session-start.sh
```

Optionally create `.claude/session-notes.md` with notes for Claude at the start of each session. Update it as context changes.


---
