# Recursive Reflection Hook

This hook automates self-healing code quality checks. After Claude Code makes edits to any file in the workspace, this hook intercepts the flow to run automated verification tests, lints, or static analysis checks. If failures are detected, it structures the output to prompt Claude to reflect on its own code changes, identify the logical fallacy, and self-heal before proceeding.

## When it fires
Event: `PostToolUse`
Triggers after Claude Code executes the `Replace` or `WriteFile` tools.

## What it does
1. Identifies the modified file and its programming language.
2. Triggers the relevant test suite (e.g. `npm test`, `pytest`, `cargo test`) or a specialized quality gate script.
3. If failures occur, the hook intercepts the test runner stdout/stderr, extracts the core failure stack, and formats it as a "Judge Audit" feedback request.
4. It instructs Claude to reflect on the failure, write a brief diagnosis of the root cause, and then issue a correction.
5. This creates an autonomous self-healing loop without human intervention.

## `settings.json` Configuration
Add this to your project's `.claude/settings.json`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "command": "bash .claude/hooks/recursive-reflection.sh \"$TOOL_NAME\" \"$TOOL_ARGS\"",
        "description": "Self-healing test reflection"
      }
    ]
  }
}
```

## Setup Instructions
1. Copy the `recursive-reflection.sh` script to `.claude/hooks/recursive-reflection.sh`.
2. Make it executable: `chmod +x .claude/hooks/recursive-reflection.sh`.
3. Update your `.claude/settings.json` as shown above.
