# The Historian Hook (Zero-Drift Docs)

This hook watches for changes to critical files and automatically triggers a background update to the project's documentation, ensuring your `README.md` and `ARCHITECTURE.md` never fall out of sync with your code.

## When it fires
Event: `PostToolUse`
Triggers after Claude Code modifies a file.

## What it does
1. Checks the modified file path. If the file is inside a core directory (e.g., `src/db/`, `src/api/`, or `src/core/`), it assumes an architectural change occurred.
2. Appends a note to a temporary `DOCS_QUEUE.md` file.
3. When the user eventually runs `/compact` or ends the session, a separate routine (or the user manually invoking `/historian`) processes `DOCS_QUEUE.md` and rewrites `ARCHITECTURE.md` to reflect the new reality.

## `settings.json` Configuration
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "command": "bash .claude/hooks/historian.sh \"$TOOL_NAME\" \"$TOOL_ARGS\"",
        "description": "Log architectural changes for docs update"
      }
    ]
  }
}
```