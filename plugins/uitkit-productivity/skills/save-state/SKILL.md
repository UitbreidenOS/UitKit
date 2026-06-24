---
name: "save-state"
description: "Claude Code save state: workflow guidelines, best practices, instructions, and integration examples"
---

# Save State

## When to activate
Activate when the user has been working for a long session, token usage is getting high, the context window is near full, or the user is about to run the `/clear` command and wants to preserve their place. Invoked via `/save-state`.

## When NOT to use
Do not use at the very beginning of a session, for quick one-off queries, or if the user is just asking a general knowledge question.

## Instructions
1. Pause any file reading or external tool usage.
2. Review the entire conversation history of the current session.
3. Synthesize a hyper-condensed summary of the current working state.
4. Create or overwrite a file named `CLAUDE_STATE.md` in the project root (or current directory) with the following structure:
    *   **Current Goal:** 1-sentence description of the overarching objective.
    *   **Completed Work:** 2-3 bullet points of specific files modified, bugs fixed, or features implemented in this session.
    *   **Discovered Context:** 2-3 bullet points of crucial architectural facts learned (e.g., "The auth token is passed in the header `X-API-Key`, not a cookie" or "The database schema for Users uses UUIDs, not auto-incrementing integers").
    *   **Pending Tasks:** The immediate next 1-2 steps that need to be taken.
5. Instruct the user with exactly this message: *"State successfully saved to `CLAUDE_STATE.md`. You can now safely run the `/clear` command to reset your context window and save tokens. After clearing, simply prompt me with: 'Resume from CLAUDE_STATE.md'."*

## Example
User: `/save-state`
Claude: Synthesizing current context... 
[Writes CLAUDE_STATE.md]
State successfully saved to `CLAUDE_STATE.md`. You can now safely run the `/clear` command to reset your context window and save tokens. After clearing, simply prompt me with: 'Resume from CLAUDE_STATE.md'.