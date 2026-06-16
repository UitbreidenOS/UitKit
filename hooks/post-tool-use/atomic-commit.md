# Atomic Commit Hook

This hook brings Aider-style micro-versioning to Claude Code. It automatically commits files after Claude successfully edits them and runs passing tests, ensuring you can instantly revert any AI mistakes without manually untangling files.

## When it fires
Event: `PostToolUse`
Triggers after Claude Code executes `Bash` (specifically looking for successful test runs) or `WriteFile`/`Replace`.

## What it does
1. After Claude edits a file, the hook checks if there are unstaged changes.
2. If tests were run and passed (exit code 0), or if the hook is configured to commit aggressively on every file write, it automatically runs `git add <file>` and `git commit -m "Auto (Claude): updated <file>"`.
3. This creates a clean, atomic Git history where every single AI edit is an isolated commit.

## `settings.json` Configuration
Add this to your project's `.claude/settings.json`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "command": "bash .claude/hooks/atomic-commit.sh \"$TOOL_NAME\" \"$TOOL_ARGS\"",
        "description": "Auto-commit successful edits"
      }
    ]
  }
}
```

## Setup Instructions
1. Copy the `atomic-commit.sh` script to `.claude/hooks/atomic-commit.sh`.
2. Make it executable: `chmod +x .claude/hooks/atomic-commit.sh`.
3. Update your `.claude/settings.json` as shown above.