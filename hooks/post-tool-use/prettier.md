# Hook: Auto-Prettier

Runs Prettier on any file written or edited by Claude, keeping formatting consistent without a separate format step.

## Event
`PostToolUse` — fires after `Write` and `Edit` tool calls

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
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/prettier.sh",
            "async": true
          }
        ]
      }
    ]
  }
}
```

Matcher `Write|Edit` limits this to file-writing tools only — no overhead on Bash or Read calls.

## What it does

Extracts the `file_path` from the tool input JSON, checks if Prettier supports that file extension (`.ts`, `.tsx`, `.js`, `.jsx`, `.json`, `.css`, `.md`), and runs:

```bash
npx prettier --write "$FILE_PATH"
```

Runs async so it doesn't block Claude's next action. If Prettier isn't installed or fails, the hook exits silently — it never blocks Claude.

## Requirements

- Node.js ≥ 18
- `prettier` in the project's `node_modules` or globally installed
- A `.prettierrc` or `prettier.config.js` in the project root (optional — uses Prettier defaults otherwise)

## Setup

```bash
cp hooks/post-tool-use/prettier.sh .claude/hooks/
chmod +x .claude/hooks/prettier.sh
npm install --save-dev prettier   # if not already installed
```


---
