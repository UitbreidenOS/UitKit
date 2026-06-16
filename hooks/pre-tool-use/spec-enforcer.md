# Spec-First Enforcer Hook

This hook ensures total architectural compliance. If Claude attempts to write code or run commands that violate the constraints defined in your `SPEC.md`, this hook intercepts and blocks the action, forcing Claude to rethink its approach.

## When it fires
Event: `PreToolUse`
Triggers before Claude executes `Bash`, `Replace`, or `WriteFile`.

## What it does
1. Checks if a `SPEC.md` or `HANDOFF.md` file exists in the project root.
2. Uses basic pattern matching (or an LLM-assisted fast check script) to look for violation keywords in the `$TOOL_ARGS`.
3. For example, if `SPEC.md` contains the constraint "NO_LODASH", and the `$TOOL_ARGS` contain `npm install lodash` or `import _ from 'lodash'`, the hook exits with a non-zero code.
4. Claude's execution is blocked, and the hook returns a severe warning: "You have violated the architectural specification."

## `settings.json` Configuration
Add this to your project's `.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "command": "bash .claude/hooks/spec-enforcer.sh \"$TOOL_NAME\" \"$TOOL_ARGS\"",
        "description": "Block actions violating SPEC.md"
      }
    ]
  }
}
```

## Setup Instructions
1. Copy the `spec-enforcer.sh` script to `.claude/hooks/spec-enforcer.sh`.
2. Make it executable: `chmod +x .claude/hooks/spec-enforcer.sh`.
3. Update your `.claude/settings.json` as shown above.