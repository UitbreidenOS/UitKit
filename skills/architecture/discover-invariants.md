---
name: discover-invariants
description: "Claude Code invariant discovery (cultural adaptation): workflow guidelines, best practices, instructions, and integration examples"
updated: 2026-06-17
---

# Invariant Discovery (Cultural Adaptation)

## When to activate
Activate when onboarding into a new repository, after a massive git merge, or when explicitly invoked via `/discover-invariants`.

## When NOT to use
Do not use in brand new repositories with less than 50 commits.

## Instructions
1. **Analyze History:** Use `Bash` to run `git log -p -n 100` to analyze the last 100 successful PRs or commits.
2. **Pattern Matching:** Look for consistent patterns in the diffs that represent unwritten rules:
   - **Styling:** "Are they using arrow functions or traditional functions?" "Do they always sort imports alphabetically?"
   - **Logic:** "Do they always use try/catch for async operations?" "Is there a specific way they handle logging?"
   - **Testing:** "Do they use Jest or Vitest?" "What is the standard naming for test files?"
   - **Safety:** "Are they avoiding specific libraries or native methods?"
3. **Draft the Invariants:** Synthesize these patterns into a list of "Discovered Invariants."
4. **Update Constitution:** Ask the user: "I've discovered 5 unwritten rules your team consistently follows. Shall I add these to your `CONSTITUTION.md` to ensure I adhere to them in the future?"
5. If approved, append the rules to `CONSTITUTION.md` in the standard Spec Kit format.

## Example
User: `/discover-invariants`
Claude: Analyzing history... I noticed: 1. Your team always uses early-return for error handling. 2. You use Joi for schema validation in every controller. 3. All service functions must be stateless. Shall I add these to your project Constitution?
