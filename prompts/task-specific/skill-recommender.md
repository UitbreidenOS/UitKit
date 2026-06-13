# Prompt: Skill Recommender

## Purpose

Given a task description, returns a prioritized list of Claudient skills, agents, and hooks to activate for the best result — with reasoning for each recommendation.

## When to use

- Starting a new type of task and unsure which skill fits
- Combining multiple skills and want to know the right activation order
- Teaching a team member which skills exist and when to reach for them
- Building a workflow that needs skill composition

## The Prompt

```
I need to accomplish the following task:

TASK: [describe what you want to do — be specific about inputs, outputs, and constraints]

Based on this task, recommend which Claudient skills, agents, and hooks to use.

Structure your recommendation as:

## Primary skill
The single most relevant skill to activate first.
- Skill name and file path (e.g., `skills/productivity/adr-writer.md`)
- Why it matches this task specifically
- How to invoke it (slash command or natural language trigger)

## Supporting skills
Skills that complement the primary skill for this task. For each:
- Skill name and path
- What it adds that the primary skill doesn't cover
- Whether to run it before, after, or in parallel with the primary

## Agents to consider
Subagents worth spawning if the task is complex enough to delegate. For each:
- Agent name and path (e.g., `agents/code-reviewer.md`)
- What part of the task to hand off to it
- When to spawn it (immediately vs. after primary skill finishes)

## Hooks to enable
Any hooks from `hooks/` that would automate useful behavior for this task. For each:
- Hook name and what it does
- How to enable it (settings.json snippet)

## Activation order
A numbered sequence: do X first, then Y, then Z.

## What not to activate
Skills or agents that look relevant but would be wrong for this task — and why.

---
Use only skills, agents, and hooks that exist in the Claudient repository.
Do not invent skill names. If the right skill does not exist, say so and suggest what the user would need to create.
Keep recommendations concrete — explain the "why" for every item.
```

## Variables

| Variable | Description | Example |
|---|---|---|
| `TASK` | The specific task to accomplish | "Migrate a Flask app to FastAPI, keeping all existing tests passing" |

## Example

Task: "I need to do a pre-merge code review on a PR that touches auth and payment logic."

Output:
- **Primary skill:** `skills/productivity/code-review.md` — direct match for code review tasks
- **Supporting skills:** `skills/productivity/security-audit.md` — auth and payments require security lens; run after initial review
- **Agents:** `agents/security-reviewer.md` — spawn for the payment logic files specifically; these need expert security analysis beyond general review
- **Hooks:** `hooks/pre-commit-lint.md` — enable to auto-catch style issues so the review focuses on logic
- **Activation order:** 1) Run code-review skill on full diff → 2) Spawn security-reviewer agent on `src/auth/` and `src/payments/` → 3) Aggregate findings
- **What not to activate:** `skills/productivity/refactor.md` — refactoring during a security-sensitive PR review introduces unnecessary risk

---
