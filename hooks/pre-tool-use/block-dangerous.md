# Hook: Block Dangerous Commands

Intercepts `Bash` tool calls before they execute and blocks or warns on destructive shell patterns.

## Event
`PreToolUse` — fires before every tool call, matcher set to `Bash`

## settings.json entry

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/block-dangerous.sh",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

## What it does

Reads the `tool_input.command` field from the JSON payload on stdin and matches it against two pattern lists:

- **Blocked patterns** (exit 2 — hard block): `rm -rf /`, `rm -rf ~`, `mkfs`, `dd if=/dev/zero`, fork bomb, `chmod -R 777 /`
- **Warning patterns** (exit 1 — Claude sees warning, user decides): `rm -rf`, pipe to `bash`/`sh`, `sudo`, `git push --force`, `git reset --hard`, `DROP TABLE`, `TRUNCATE`

Exit code semantics:
- `0` — allow
- `1` — warn (Claude reports the warning and asks for confirmation)
- `2` — block (Claude refuses to run the command)

## Setup

```bash
cp hooks/pre-tool-use/block-dangerous.sh .claude/hooks/
chmod +x .claude/hooks/block-dangerous.sh
```

Then add the `settings.json` entry above to `.claude/settings.json` or `~/.claude/settings.json`.


---
