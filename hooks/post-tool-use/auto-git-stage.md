# Hook: Auto Git Stage

Automatically runs `git add` on files after Claude Code edits them. Keeps your staging area current without manual `git add` between edits.

## What it does

- Fires on `PostToolUse` after `Write` or `Edit` operations
- Automatically stages the modified file with `git add`
- Skips non-git directories gracefully
- Only stages files that are already tracked or new — never stages `.env` or gitignored files

## settings.json entry

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "bash ~/.claude/hooks/auto-git-stage.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook script: auto-git-stage.sh

```bash
#!/usr/bin/env bash
# PostToolUse hook: auto-stage files after Claude edits them
set -euo pipefail

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [[ "$TOOL_NAME" != "Write" && "$TOOL_NAME" != "Edit" ]]; then
  exit 0
fi

if [[ -z "$FILE_PATH" || ! -f "$FILE_PATH" ]]; then
  exit 0
fi

# Skip if not in a git repo
if ! git -C "$(dirname "$FILE_PATH")" rev-parse --git-dir &>/dev/null; then
  exit 0
fi

# Skip gitignored files (won't stage .env, node_modules, etc.)
if git -C "$(dirname "$FILE_PATH")" check-ignore -q "$FILE_PATH" 2>/dev/null; then
  exit 0
fi

git add "$FILE_PATH"
echo "✅ Staged: $FILE_PATH" >&2

exit 0
```

## Setup

```bash
mkdir -p ~/.claude/hooks
cp auto-git-stage.sh ~/.claude/hooks/auto-git-stage.sh
chmod +x ~/.claude/hooks/auto-git-stage.sh
```

## Workflow with auto-staging

With this hook active, your typical workflow becomes:
```
1. Ask Claude to implement a feature
2. Claude edits multiple files → all auto-staged
3. Review the diff: git diff --staged
4. Commit: git commit -m "feat: ..."
```

No `git add` steps needed between Claude's edits.

## Disable temporarily

```bash
CLAUDE_SKIP_AUTOSTAGE=1 claude "quick edit"
```

Add to the script: `[[ "${CLAUDE_SKIP_AUTOSTAGE:-false}" == "1" ]] && exit 0`
