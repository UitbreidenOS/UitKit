---
name: "plan-epic"
description: "Claude Code epic planner (action graph): workflow guidelines, best practices, instructions, and integration examples"
---

# Epic Planner (Action Graph)

## When to activate
Activate when starting a large, multi-file feature, refactor, or migration. It prevents hallucinations and context-loss by forcing Claude to map out dependencies before writing code. Invoked via `/plan-epic`.

## When NOT to use
Do not use for single-file edits, bug fixes, or minor UI adjustments.

## Instructions
1. Pause execution. Do not write any application code yet.
2. Create an `EPIC_GRAPH.md` file in the project root.
3. Use a strict Action Graph format to map out the execution plan. Every step MUST have defined **Preconditions** (what must be true before this starts) and **Postconditions** (what must be true when it finishes).
4. **Format:**
   ```markdown
   # Epic: [Name]

   ## Step 1: [Task Name]
   - **Agent/Role:** [e.g., Database Admin]
   - **Preconditions:** [e.g., None]
   - **Action:** [What specifically needs to be written/changed]
   - **Postconditions/Verification:** [e.g., Migration script runs without errors, schema matches ERD]

   ## Step 2: [Task Name]
   - **Agent/Role:** [e.g., Backend API Developer]
   - **Preconditions:** [e.g., Step 1 Postconditions met]
   - **Action:** [...]
   - **Postconditions/Verification:** [e.g., Unit tests pass with 90% coverage]
   ```
5. Ask the user to review and approve the `EPIC_GRAPH.md` before you begin executing Step 1.

## Example
User: `/plan-epic Implement Role-Based Access Control (RBAC)`
Claude: [Writes EPIC_GRAPH.md breaking the task into Database Schema, Middleware Logic, Controller Updates, and Frontend Gates]. "Please review the action graph. Should I proceed with Step 1?"