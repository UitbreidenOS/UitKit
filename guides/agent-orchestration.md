# Agent Orchestration Guide

How to delegate, parallelize, and specialize work using Claude Code's subagent system.

---

## What Subagents Are

A subagent is a separate Claude instance spawned by the parent session to handle a specific, bounded task. It gets:
- A fresh context window (no session history)
- A specific tool subset (if configured)
- A model selection (can differ from the parent)
- A prompt you write explicitly

The parent session continues. When the subagent finishes, it returns a result. The parent uses that result and moves on.

Subagents are not magic — they are a specific tool for specific problems. Used correctly, they reduce context bloat, enable parallelism, and allow model specialization. Used incorrectly, they add overhead for no benefit.

---

## When to Use a Subagent

Use a subagent when the task has **clear inputs** and **clear outputs** and is **independent of the current session state**.

**Good candidates:**
- Reviewing 10 files for security issues — self-contained, read-only, repeatable
- Running a specific search across the codebase to locate a pattern
- Generating boilerplate for a new module given a spec
- Analyzing a log file and returning a summary
- Writing tests for a function given its signature and behaviour description

**Bad candidates:**
- Tasks that require the full session context to do correctly
- Tasks where the output will immediately change what the parent session does next (just do it inline)
- Tasks that need back-and-forth — subagents are one-shot
- Anything where the overhead of spawning + prompting exceeds the work itself

---

## 1. Delegation Pattern

The simplest pattern: the parent identifies a bounded task and hands it off.

**Structure:**
```
Parent session:
  → Identifies task (e.g., "find all places where we use the deprecated API")
  → Writes a self-contained prompt
  → Spawns subagent with that prompt + relevant file paths
  → Subagent returns findings
  → Parent uses findings to continue
```

**Key rule:** The subagent prompt must be self-contained. It has no access to what the parent session has been doing. Brief it like a colleague who just walked into the room — include the context they need, nothing more.

**What to include in the subagent prompt:**
- What you're trying to accomplish and why
- The specific files or directories to look at
- What format you want the result in
- Any constraints or decisions already made

**What NOT to include:**
- The entire session history (defeats the purpose)
- Information the subagent doesn't need
- Open-ended questions (subagents are one-shot — make the task precise)

---

## 2. Parallelization Pattern

Multiple subagents running simultaneously on independent tasks. This is the highest-leverage use of the subagent system.

**When to parallelize:**
- You need the same operation applied to many files/modules (review, lint, test generation)
- Two genuinely independent tasks that both need to complete before you can proceed
- Research tasks that cover different areas (e.g., "search for auth patterns" + "search for error handling patterns" simultaneously)

**Using git worktrees for parallel code changes:**
```bash
git worktree add ../feature-branch-a feature-a
git worktree add ../feature-branch-b feature-b
```

Each subagent works in its own worktree — they can't conflict. The parent merges the results.

**Parallelization anti-patterns:**
- Parallelizing tasks that share state (both agents write to the same file — conflict)
- Spawning more agents than you have independent tasks (overhead without benefit)
- Parallel tasks where one depends on the output of the other (run sequentially instead)

---

## 3. Specialization Pattern (cavecrew)

Match the subagent's model and tool set to the nature of the task. Not every subagent needs Opus. Not every subagent needs all tools.

Inspired by the **cavecrew** pattern (source: [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman)):

| Role | Model | Tools | Use when |
|---|---|---|---|
| Investigator | Haiku 4.5 | Read, Bash (grep/find only) | Locating things in the codebase — read-only, fast |
| Builder | Sonnet 4.6 | Read, Edit, Write, Bash | Making surgical 1–2 file changes |
| Reviewer | Haiku 4.5 | Read | Reviewing a diff or a set of files for issues |
| Orchestrator | Opus 4.7 | All | Complex multi-step coordination, architecture decisions |

This pattern saves ~60% tokens compared to using Opus for every subagent task.

**Practical example:**
```
Parent (Sonnet): "Find all API endpoints that don't validate auth."
→ Investigator (Haiku): Searches the codebase. Returns list of 6 files + line numbers.
Parent (Sonnet): Reviews the list, decides which ones are real issues.
→ Builder (Sonnet): Fixes each real issue, one at a time.
→ Reviewer (Haiku): Confirms the fix looks correct before the parent moves on.
```

---

## 4. Context Handoff Pattern

When a session has accumulated significant context and you need to hand work off to a new agent without losing what was learned.

**Pre-handoff checklist:**
1. Save the current task state to `.claude/memory/session-state.md`
2. Document decisions made during the session
3. List files modified and why
4. Write the handoff prompt explicitly — include everything the next agent needs

**Handoff prompt structure:**
```
## Context
[What this project does, briefly]
[What we were working on]
[Decisions made during this session]

## Files modified
[List with brief reason for each change]

## Current state
[What's done, what's not done, what's blocking]

## Your task
[Specific, bounded task for the new agent]

## Constraints
[Decisions that were made and should not be revisited]
```

This is the same pattern used by the `handoff` skill in mattpocock/skills.

---

## 5. Hard vs Soft Dependencies

When orchestrating multiple agents or skills, some downstream tasks require upstream setup to work correctly. Others degrade gracefully.

**Hard dependency:** The downstream task explicitly fails without the upstream setup.
- Example: A skill that posts to GitHub Issues requires the issue tracker to be configured. If it's not, it should halt and tell the user to run the setup skill first.
- Signal this explicitly in the skill: "This skill requires setup — run `/setup` first if you haven't."

**Soft dependency:** The downstream task works but produces lower-quality output without upstream setup.
- Example: A code review skill that uses domain terminology from `CONTEXT.md`. Without `CONTEXT.md`, it still reviews code — just less precisely.
- Don't halt. Don't require setup. Degrade gracefully and note the gap.

Design your agent workflows to be honest about which dependencies are hard and which are soft.

---

## 6. Scope Control for Subagents

Every subagent should have an explicit scope limit. Without one, the subagent may take actions that conflict with the parent session or exceed what was intended.

**What to include in every subagent prompt:**
```
## Scope
- Read: yes
- Write/Edit: [specific files only OR no]
- Shell commands: [specific commands allowed OR none]
- Network: [yes/no]

## Do not
- Do not modify files outside [directory]
- Do not make git commits
- Do not install packages
```

This is especially important for builder-type subagents with write access.

---

## 7. Returning Results from Subagents

Subagents communicate back to the parent in two ways:
1. **Return message** — the final text response. Good for short structured results.
2. **Files** — the subagent writes its findings/output to a file. The parent reads it. Better for larger outputs that need to survive compaction.

**Prefer files for:**
- Lists of findings that the parent will iterate over
- Generated code that the parent will review
- Reports that will be referenced multiple times

**Prefer return messages for:**
- Simple yes/no answers
- Short structured data (a JSON object, a list of 3–5 items)
- Status reports ("task complete, 3 files modified: X, Y, Z")

---

## Quick Reference

| Goal | Pattern |
|---|---|
| Bounded, self-contained task | Delegation |
| Same task on many files | Parallelization |
| Read-only search/locate | Investigator (Haiku) |
| Surgical code change | Builder (Sonnet) |
| Diff/file review | Reviewer (Haiku) |
| Complex multi-step coordination | Orchestrator (Opus) |
| Session handoff | Context Handoff pattern |
| Task requires prior setup | Hard dependency — halt + instruct |
| Task works better with setup | Soft dependency — degrade gracefully |
| Large subagent output | Write to file, parent reads it |
| Small structured result | Return message |
| High token cost on simple tasks | Use cavecrew (Haiku + caveman) |

---

## 8. Background Session Isolation and Saga Pattern

**`worktree.bgIsolation` setting**
Background sessions normally move into a git worktree before editing files, preventing conflicts with your working copy. Disable this for repos where worktree creation is impractical:
```json
{
  "worktree": {
    "bgIsolation": "none"
  }
}
```
Set in `.claude/settings.json`. When disabled, background sessions edit the working copy directly — ensure no concurrent edits to the same files.

**Multi-agent saga pattern**
For distributed multi-step operations across agents, use the saga pattern: each step defines a compensating action. On failure at step N, execute compensating actions for steps N-1 down to 0 in reverse order.

```
Step 1: Create database record → Compensate: Delete record
Step 2: Call payment API → Compensate: Issue refund
Step 3: Send confirmation email → Compensate: Send cancellation email
```

Pass the compensation plan to each sub-agent so it knows how to roll back if it fails.

---

## Work With Us

Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products with developer communities and deliver B2B AI solutions. If you're designing multi-agent systems, autonomous workflows, or production-grade Claude Code orchestration — we've built this in production and can help you do the same.

**[uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)**
