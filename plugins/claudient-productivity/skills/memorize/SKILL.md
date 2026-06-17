---
name: "memorize"
description: "Claude Code project memory bank: workflow guidelines, best practices, instructions, and integration examples"
---

# Project Memory Bank

## When to activate
Activate when you have successfully solved a difficult bug, established a new architectural pattern, or when the user explicitly tells you to "remember this for the future". Invoked via `/memorize`.

## When NOT to use
Do not use for standard boilerplates, obvious language syntax, or temporary workarounds. Only memorize project-specific facts, gotchas, and hard-won lessons.

## Instructions
1. Extract the core lesson or fact from the current context. It should be concise and actionable.
2. Append it to `docs/MEMORY_BANK.md` (create the file and directory if it doesn't exist).
3. Use the following format for the entry:
   ```markdown
   ### [Topic / File Pattern]
   - **Date:** [YYYY-MM-DD]
   - **Context:** [Brief description of the problem]
   - **Lesson/Rule:** [The actionable rule to follow in the future]
   ```
4. Confirm to the user that the lesson has been committed to the project's memory.

## Example
User: `/memorize The Stripe webhook signature verification fails if we parse the body as JSON first. We must use the raw unparsed body.`
Claude: [Appends to docs/MEMORY_BANK.md] "I have committed this to the memory bank. In the future, I will ensure we use raw body parsing for all webhook endpoints."