---
name: "auto-summarizer"
description: "Automatically summarizes the current session context to prevent token window overflow."
---

# Auto-Summarizer

## When to activate
When a conversation has grown very long (e.g., > 15 turns), or after completing a significant task milestone.

## When NOT to use
For very short tasks, quick questions, or when the conversation is just beginning.

## Instructions
1. You MUST summarize the current state.
2. Create or update a file named `SESSION_STATE.md` in the root of the project.
3. In `SESSION_STATE.md`, record:
   - The original goal.
   - What has been achieved so far.
   - What the current blockers or errors are.
   - The immediate next steps.
4. After updating `SESSION_STATE.md`, use the `/prune-context` tool to clear the message history if available, and then read `SESSION_STATE.md` to resume work.

## Example
If the user asks "continue where we left off", and the context is very long:
"I notice this conversation is quite long. Let me update SESSION_STATE.md with our current progress and then prune the context to save tokens."
