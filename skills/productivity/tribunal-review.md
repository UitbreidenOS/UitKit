---
name: tribunal-review
description: "Claude Code tribunal pr review system: workflow guidelines, best practices, instructions, and integration examples"
updated: 2026-06-17
---

# Tribunal PR Review System

## When to activate
Activate when the user asks you to "review this code", "review my PR", or invoked via `/tribunal-review`.

## When NOT to use
Do not use if the user just asks "why is this line failing?" (simple bug fix). This is for holistic, comprehensive code reviews before committing or merging.

## Instructions
1. Gather the code to be reviewed. If the user hasn't provided it, use `git diff HEAD` or read the specific files they mention.
2. You will act as the Orchestrator for the Tribunal. Do not review the code yourself.
3. Use the `Agent` tool to sequentially spawn three adversarial reviewers against the exact same code diff:
   - **Step 1:** Spawn `security-hacker`. Save its output.
   - **Step 2:** Spawn `performance-junkie`. Save its output.
   - **Step 3:** Spawn `senior-pedant`. Save its output.
4. Synthesize the outputs from all three agents into a single, brutal, high-signal PR comment. 
5. **Format:**
   ```markdown
   # ⚖️ The Tribunal Review

   ### 🛡️ Security Audit (The Hacker)
   [Insert security output]

   ### ⚡ Performance Audit (The Junkie)
   [Insert performance output]

   ### 📐 Standards Audit (The Pedant)
   [Insert standards output]
   ```
6. Ask the user if they would like you to automatically fix the raised issues.

## Example
User: `/tribunal-review Check the changes in auth.js`
Claude: [Spawns 3 agents in the background]. 
Here is the Tribunal Review: The Hacker found a potential timing attack in the password compare. The Junkie cleared it. The Pedant noted you left a `console.log` in production. Shall I fix these?