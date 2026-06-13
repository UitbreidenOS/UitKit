# Ultraplan — Deep Planning Mode

Ultraplan is an extended planning mode that instructs Claude to think exhaustively before acting. It reads the codebase, maps dependencies, identifies risks, and produces a comprehensive plan before touching any code. The goal is to get the plan right the first time on work where a wrong plan is expensive to unwind.

---

## How to Activate

**Slash command:**
```
/ultraplan
```

Then describe the task. Ultraplan takes over for the planning phase.

**CLI flag:**
```bash
claude --ultraplan "Add multi-tenant support to the billing module"
```

**Combined with effort:**
```bash
claude --ultraplan --effort xhigh "Migrate auth from JWT to session-based"
```

---

## What Ultraplan Does Differently from `/plan`

| | `/plan` | `/ultraplan` |
|---|---|---|
| **File reads** | Referenced files only | All files in the affected path + their dependencies |
| **Pattern check** | None | Reads existing patterns before proposing new ones |
| **Dependency mapping** | Implicit | Explicit dependency graph in the output |
| **Risk assessment** | None | Dedicated risk section with mitigations |
| **Rollback plan** | None | Explicit rollback steps for each phase |
| **Token cost** | ~1× | ~3–5× |
| **Output length** | Short | Long (comprehensive) |

Ultraplan's research phase is what justifies the cost. It reads the actual codebase before planning — not just the files you mention, but the files those files import, the tests that cover them, the migration history if relevant, and the existing patterns it should match.

---

## Ultraplan Output Structure

A completed Ultraplan produces a document with these sections in order:

**1. Context Summary**
What Ultraplan found during its research phase — key files, existing patterns, relevant prior decisions.

**2. Risk Assessment**
Risks ranked by severity. Each risk has: description, likelihood, impact, and proposed mitigation.

**3. Dependency Map**
Which components depend on what. Highlights circular dependencies, shared state, and external integrations that the change touches.

**4. Ordered Steps**
The implementation plan in sequence. Each step specifies: what changes, which files, what to test after this step, and whether a partial commit is appropriate here.

**5. Rollback Plan**
How to undo each phase if something goes wrong — specific git commands, feature flag toggles, or migration reversals.

---

## When to Use

- **Complex features spanning multiple files** — especially when you're not sure what depends on what
- **Unfamiliar codebases** — before touching code you haven't read before, Ultraplan's research phase builds the context you'd spend hours building manually
- **High-stakes changes** — auth system rewrites, database schema migrations, public API changes, anything where a wrong approach means significant rework
- **Features estimated at more than one day** — the planning investment pays off faster the longer the implementation

---

## When NOT to Use

- **Simple tasks** — a single-function bug fix doesn't need a dependency map
- **Hotfixes** — you already know what's broken; plan overhead slows you down
- **Exploratory / spike work** — when you're prototyping to learn, you want to iterate fast, not plan exhaustively upfront
- **Well-understood changes** — if you've made this type of change ten times in this codebase, you don't need Ultraplan's research phase
- **Cost-sensitive sessions** — at 3–5× token cost, Ultraplan on trivial tasks wastes budget

---

## Effort Integration

`--effort` controls how deeply Claude thinks within each turn. Ultraplan + effort compound:

```bash
# Maximum depth: Ultraplan's broad research + maximum per-turn reasoning
claude --ultraplan --effort xhigh "Refactor the payment processing module"
```

| Combination | Use for |
|---|---|
| `--ultraplan` alone | Standard complex features |
| `--ultraplan --effort high` | Architecture decisions, unfamiliar codebases |
| `--ultraplan --effort xhigh` | Migration planning, security-critical changes |

Avoid `--ultraplan --effort low` — you're trading away the research depth that makes Ultraplan valuable.

---

## Cost Trade-off

Ultraplan spends tokens on research upfront. The break-even point is roughly:

- If the plan saves 1 hour of debugging or rework: break even at ~$2–5 of extra tokens
- If the plan prevents a wrong architectural decision: break even at ~$10–50 of extra tokens

For features estimated at more than one day of work, Ultraplan is almost always worth it. For half-day tasks, it depends on how well you know the codebase.

---

## Combining Ultraplan with RIPER

The RIPER framework (Research → Implement → Probe → Evaluate → Reflect) maps cleanly to Ultraplan:

- **Research** → Ultraplan's research phase (file reading, pattern identification)
- **Implement** → Execute the ordered steps from the Ultraplan output
- **Probe** → Run tests after each step as specified in the plan
- **Evaluate** → Check against Ultraplan's risk assessment — did any predicted risks materialize?
- **Reflect** → Review the rollback plan; update if implementation diverged from plan

Run Ultraplan before entering RIPER's Implement phase. The Ultraplan output becomes the Implement-phase brief.

```
/ultraplan
[describe the feature]

[review the plan]

/riper implement
[execute the plan step by step]
```

---
