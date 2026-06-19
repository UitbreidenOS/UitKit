---
name: "prune-context"
description: "Claude Code context pruner: slash command to summarize session and reset token bloat"
---

# Context Pruner

## When to activate
Activate when the user runs the `/prune-context` command, or when session token consumption is high, or when the context window is getting bloated in a long session.

## When NOT to use
Do not use at the beginning of a session, or for simple queries that do not require state persistence or context reduction.

## Instructions
1. Pause current tasks and review the conversation history of the active session.
2. Summarize the session into a highly condensed, token-efficient state:
   - **Active Objective**: The current high-level goal you are working on.
   - **Completed in Session**: A concise bulleted list of completed changes, tests, and files.
   - **Key Architectural Context**: Crucial project details, APIs, or files discovered during the session.
   - **Next Steps**: Explicit checklist of what needs to be done next.
3. Write this summary to `.claude/pruned_context.md`.
4. Output the summary in the chat so the user can see it.
5. Instruct the user to run the `/clear` command to reset the context window and wipe the token bloat.
6. Provide the command or text they should input after clearing to resume: *"Please run `/clear` now to reset memory. Once cleared, prompt me with: 'Resume from `.claude/pruned_context.md`' to restore this state."*

## Example
User: `/prune-context`
Claude:
Starting context pruning to reduce token bloat.
[Claude writes summary to .claude/pruned_context.md]

### Current Session Snapshot
- **Active Objective**: Restructure README documentation and add fail-fast enforcer rules.
- **Completed**: Created `rules/common/fail-fast.md` and `hooks/post-tool-use/fail-fast.sh`.
- **Key Context**: The compiler is run via `npm test` and require specific git authoring config.
- **Next Steps**: Implement Plan-First pre-tool-use hook.

State saved to `.claude/pruned_context.md`. 
Please run `/clear` now to reset memory and clear token bloat. Once cleared, prompt me with: `Resume from .claude/pruned_context.md` to restore this state.
