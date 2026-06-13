---
name: "/goal — Autonomous Task Completion"
description: "User wants Claude to keep working on a task without stopping to check in; user wants to set a completion condition and walk away; user asks about autonomous operation or keeping Claude running until a"
---

# /goal — Autonomous Task Completion

## When to activate
User wants Claude to keep working on a task without stopping to check in; user wants to set a completion condition and walk away; user asks about autonomous operation or keeping Claude running until a specific outcome is reached.

## When NOT to use
Simple single-step tasks where one response is sufficient; tasks where the user wants Claude to pause and confirm after every action; interactive debugging sessions where back-and-forth is the point.

## Instructions

**Syntax:**
```
/goal <completion condition>
```

The condition is evaluated after every assistant turn. Claude keeps working — writing code, running commands, seeing failures, adjusting — until the condition holds, then stops and reports.

**Writing good conditions:**

Natural language works. The condition should be observable and unambiguous:

- `All tests pass` — Claude runs the test suite, fixes failures, reruns, until green
- `The PR is created` — Claude finishes the work and opens a PR
- `The migration runs without errors` — Claude applies the migration, checks for errors, fixes schema issues
- `tsc --noEmit exits 0` — Claude resolves TypeScript errors until the compiler is clean
- `CHANGELOG.md exists and has today's date` — Claude writes the changelog file

**Bad conditions to avoid:**
- Subjective: "looks good", "is clean" — not verifiable by Claude
- Open-ended: "keep improving the code" — no stopping condition
- Time-based: "run for one hour" — not an outcome

**Combine with effort level** for maximum autonomy:
```
/goal All tests pass
/effort xhigh
```

**Interrupting:** Send any message to interrupt, or delete `.claude/goal` to cancel. The goal state persists across context compactions — Claude remembers the goal even after the context window compresses.

**Background sessions:** Works with `claude --bg`. Set the goal, close your terminal, come back when it's done.

**What happens in each turn:**
1. Claude takes actions (edits files, runs commands)
2. Evaluates: does the condition hold?
3. If no — continues
4. If yes — stops and reports what was done

## Example

```
/goal All TypeScript errors are resolved and tsc --noEmit exits 0
```

Claude runs `tsc --noEmit`, reads the error list, fixes each error, runs again, sees remaining errors, fixes those, runs again — loop continues until zero errors. Then stops and reports: "Resolved 14 TypeScript errors across 6 files. `tsc --noEmit` exits clean."

---
