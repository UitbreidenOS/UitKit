---
name: batch
description: "Parallel agent orchestration: decompose large tasks into independent units, spawn background agents in worktrees, each opens a PR"
updated: 2026-06-13
---

# Batch Skill

## When to activate
- Applying the same change across 10+ files (rename, refactor, migration)
- Running a large codebase audit (security scan, dependency check, test coverage)
- Generating boilerplate for many modules in parallel
- Any task where the work can be divided into independent, non-overlapping units

## When NOT to use
- Tasks with sequential dependencies (step B requires step A's output)
- Changes to a single file or a small number of related files
- Tasks that require shared context across all units (use a single agent instead)
- When you need to review and approve each change before the next starts

## Instructions

### The batch pattern

Standard Claude Code works sequentially: one task → one agent → one session. Batch mode breaks a large task into N independent units and processes them in parallel — each unit runs as a separate background agent in an isolated git worktree, making its changes and opening a PR.

```
Large task
    │
    ├── Unit 1 → worktree-1 → branch-1 → PR #1
    ├── Unit 2 → worktree-2 → branch-2 → PR #2
    ├── Unit 3 → worktree-3 → branch-3 → PR #3
    └── Unit N → worktree-N → branch-N → PR #N
```

### Activation prompt

```
/batch

Task: [describe the full task]
Files/scope: [list files or glob patterns, or describe the scope]
```

Claude will:
1. **Research phase** — read the codebase to understand patterns and scope
2. **Decomposition** — break the task into 5–30 independent units
3. **Plan review** — present the breakdown and wait for your approval
4. **Execution** — spawn one background agent per unit in an isolated worktree
5. **PRs** — each agent commits its changes and opens a PR against main

### Decomposition rules Claude follows
- Each unit must be **independent** — no shared state, no inter-unit dependencies
- Each unit must be **completable in one agent session** (~15–30 min of work)
- Each unit must have a **clear success criterion** (tests pass, lint passes)
- Units are sized to be **reviewable in one PR** (prefer small PRs over large ones)

### Good batch tasks

```bash
# Rename a function used across the codebase
/batch
Task: Rename `getUserById` to `findUserById` everywhere it's used.
Scope: src/**/*.ts, tests/**/*.ts

# Add type annotations to all Python modules
/batch
Task: Add full type annotations (PEP 484) to all functions in the services layer.
Scope: src/services/*.py

# Migrate API calls to new SDK
/batch
Task: Migrate all uses of the old `stripe.charges.create()` to `stripe.paymentIntents.create()`.
Scope: src/billing/**

# Security audit
/batch
Task: Audit every endpoint handler for missing authentication middleware.
Scope: routes/**/*.ts
Report findings per file — do not make changes.
```

### Monitoring progress

While agents run in the background, monitor with:
```bash
# Check worktree status
git worktree list

# Check open PRs
gh pr list --label batch

# See which agents are still running
claude agents
```

### Merging results

Once PRs are open:
1. Review each PR independently — they're small by design
2. Merge in any order (they're independent)
3. Clean up worktrees after all PRs are merged:
```bash
git worktree prune
```

### When a unit fails

If one agent's PR fails tests:
- The other agents continue — failures don't cascade
- Review the failing PR, fix manually or re-run that unit
- Use `git worktree remove worktree-N` to clean up and restart

## Example

**Task:** Add JSDoc comments to all exported functions in a 40-file TypeScript library.

**Claude's decomposition:**
```
Unit 1: src/auth/*.ts (6 files, ~15 functions)
Unit 2: src/billing/*.ts (5 files, ~12 functions)
Unit 3: src/api/users/*.ts (4 files, ~18 functions)
...
Unit 8: src/utils/*.ts (3 files, ~8 functions)
```

**After approval:** 8 background agents start in parallel. Each opens a PR titled `docs(jsdoc): add JSDoc to [module name]`. Total time: ~20 minutes instead of ~2.5 hours sequential.

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
