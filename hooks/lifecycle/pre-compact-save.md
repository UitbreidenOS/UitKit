# Hook: Pre-Compact Save

Saves session state to a temporary file before Claude Code compacts the conversation history, preserving context that would otherwise be lost.

## Event
`PreCompact` — fires before the context compaction step

## settings.json entry

```json
{
  "hooks": {
    "PreCompact": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/pre-compact-save.sh",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
```

`PreCompact` has no `matcher` field — it always fires before compaction.

## What it does

Before Claude compacts the conversation, this hook:
1. Writes the current working directory, open files, and recent bash commands to `.claude/tmp/session-state.md`
2. The file is included in the compaction summary prompt, helping Claude retain what it was working on

Output format:
```markdown
# Session State (pre-compact snapshot)
**Time:** 2026-05-13T10:45:00Z
**CWD:** /Users/dev/myproject
**Recent files touched:** src/api/users.py, tests/test_users.py
**Last command:** pytest tests/ -x
```

## Why this matters

Without this hook, compaction can cause Claude to lose track of which files it was editing, what tests were passing, and what the current task was. This hook gives the compaction model a structured anchor.

## Setup

```bash
cp hooks/lifecycle/pre-compact-save.sh .claude/hooks/
chmod +x .claude/hooks/pre-compact-save.sh
mkdir -p .claude/tmp
echo ".claude/tmp/" >> .gitignore
```


---
