# Hook: Git Push Confirmation

Intercepts `git push` calls and requires explicit confirmation before proceeding, preventing accidental pushes to remote branches.

## Event
`PreToolUse` — fires before every Bash tool call, checks for `git push` in the command

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
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/git-push-confirm.sh",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
```

## What it does

When a `Bash` command contains `git push`, the hook:
1. Extracts the remote and branch from the command
2. Checks if the target is `main` or `master` — exits 2 (hard block) for force pushes to protected branches
3. Exits 1 (warning) for all other `git push` commands, giving Claude a message to surface to the user

Regular `git push` to feature branches: user sees a warning and can confirm.
Force push to main/master: always blocked.

## Setup

```bash
cp hooks/pre-tool-use/git-push-confirm.sh .claude/hooks/
chmod +x .claude/hooks/git-push-confirm.sh
```

Add the `settings.json` entry above. Can be combined with `block-dangerous.sh` — both run as separate entries in the `PreToolUse` array.


---
