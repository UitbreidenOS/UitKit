# RPI — Research, Plan, Implement

The RPI workflow is a 3-phase multi-agent process for feature development. Each phase has defined agents, a concrete output artifact, and a gate that must pass before the next phase starts. The goal is to eliminate the two most common causes of wasted engineering effort: building the wrong thing (skipped research) and building it wrong (skipped planning).

---

## When to use RPI vs just starting to code

**Use RPI for:**
- New features that will take more than 1 day
- Changes that touch multiple systems or teams
- Work in an unfamiliar codebase
- Cross-cutting concerns (auth, caching, observability) where getting the architecture wrong is expensive to fix

**Skip RPI for:**
- Hotfixes and incident response
- Configuration changes with no logic impact
- Tasks estimated under 2 hours
- Pure refactors within a single well-understood file

The overhead of RPI is roughly 20–30% of total time. For anything under 2 hours, the overhead exceeds the benefit.

---

## Folder Structure

```
rpi/
└── {feature-slug}/
    ├── RESEARCH.md        ← Phase 1 output
    ├── plan/
    │   ├── pm.md          ← User stories
    │   ├── ux.md          ← User flows
    │   └── eng.md         ← File-by-file implementation plan
    ├── PLAN.md            ← Phase 2 summary (gate artifact)
    └── IMPLEMENT.md       ← Phase 3 decision log
```

All RPI artifacts live under `rpi/{feature-slug}/`. Do not scatter research and plan documents across the codebase.

---

## Phase 1: Research

### Agents

- **requirement-parser**: extracts functional and non-functional requirements from the feature request, identifies ambiguities, and produces a structured requirements list
- **codebase-explorer** (Explore tool): maps the relevant parts of the codebase — existing patterns, entry points, dependencies, similar features already implemented
- **product-manager**: reviews the requirement list and codebase findings, then renders a GO/NO-GO verdict

### What gets produced

`rpi/{feature-slug}/RESEARCH.md` — structured document containing:

```markdown
# Research: {Feature Name}

## Requirements
### Functional
- [list]
### Non-functional
- [latency, security, scale, etc.]

## Ambiguities
- [open questions that need answers before planning]

## Codebase Findings
- [relevant files, patterns, existing abstractions]
- [similar features and how they were built]
- [potential conflict points]

## GO / NO-GO
**Verdict:** GO | NO-GO
**Rationale:** [3–5 sentences]
**Blockers (if NO-GO):** [what must be resolved before re-evaluating]
```

### What makes a good GO/NO-GO

The PM agent evaluates four dimensions:

| Dimension | GO signal | NO-GO signal |
|-----------|-----------|--------------|
| Market need | Clear user need, backed by data or explicit request | Vague or assumed need |
| Technical feasibility | Existing patterns support it; no unknown blockers | Requires tech not yet validated |
| Scope clarity | Requirements are specific and bounded | Open-ended or expanding scope |
| Resource cost | Fits sprint capacity | Requires more than available capacity |

A NO-GO is not a rejection — it is a hold. The blockers section defines what resolves it.

---

## Phase 2: Plan

**Gate:** RESEARCH.md must exist with a GO verdict. Never plan without research. Never implement without a plan.

### Agents

- **product-manager**: converts requirements into user stories with acceptance criteria (`plan/pm.md`)
- **ux-agent**: maps user flows end-to-end, identifies edge cases, defines empty states and error states (`plan/ux.md`)
- **engineering-agent**: produces a file-by-file implementation plan — every file that will be created or modified, in the order changes should happen, with a description of each change (`plan/eng.md`)
- **cto-advisor**: reviews the engineering plan for architecture quality, scalability concerns, and alignment with existing patterns — approves or requests revision

### Output structure

**`plan/pm.md`:**
```markdown
# User Stories

## Story 1: {title}
As a {role}, I want {capability} so that {benefit}.

**Acceptance criteria:**
- [ ] criterion 1
- [ ] criterion 2
```

**`plan/ux.md`:**
```markdown
# User Flows

## Happy path
[step-by-step flow]

## Edge cases
- [empty state: what user sees]
- [error state: what user sees]
- [loading state]
```

**`plan/eng.md`:**
```markdown
# Engineering Plan

## Files to create
1. `src/features/payments/charge.ts` — new charge handler implementing X interface
2. `src/api/routes/payments.ts` — new route, delegates to charge handler

## Files to modify
3. `src/api/router.ts` — register new payments route
4. `src/types/index.ts` — add ChargeRequest and ChargeResponse types

## Implementation order
Execute in the order listed. File 4 (types) before files 1 and 2.

## Dependencies
- Requires: Stripe SDK already installed (verify first)
- Creates: no new external dependencies
```

**`PLAN.md`** — a 1-page summary consolidating all three plan documents. The CTO advisor sign-off goes here. This is the gate artifact.

### Gate rule

Implementation does not begin until `PLAN.md` exists and the CTO advisor has approved it. If the advisor requests changes, revise `plan/eng.md` and regenerate `PLAN.md`. No exceptions — starting implementation before PLAN.md is signed off is the primary source of rework in agentic development.

---

## Phase 3: Implement

**Gate:** PLAN.md must be signed off.

### How to follow eng.md

Execute changes in the exact order listed in `plan/eng.md`. Do not reorder based on what seems convenient — the order reflects dependency sequencing and build stability at each step.

For each file:
1. Read the description in eng.md
2. Implement the change
3. Run any relevant tests
4. Check off the file in eng.md (mark `[x]`)

### Code-reviewer gate

After completing 3–5 files (or at a natural boundary like completing a layer), spawn a code-reviewer agent to check the completed work against the acceptance criteria in pm.md and the engineering plan in eng.md. Do not wait until full implementation to review — finding issues late is expensive.

The reviewer outputs a simple pass/fail with specific line-level feedback. On failure, fix before continuing.

### Decision log

`IMPLEMENT.md` captures decisions made during implementation that deviate from the plan or resolve ambiguities not addressed in planning:

```markdown
# Implementation Log: {Feature Name}

## Decisions

### [2026-05-23] Changed charge handler interface
Plan specified X interface. During implementation found X conflicts with existing session middleware.
Decision: used Y interface instead. Updated plan/eng.md to reflect change.

### [2026-05-23] Added retry logic not in plan
Found Stripe SDK throws intermittent 503s. Added exponential backoff (3 retries).
No plan change needed — this is additive and within scope.
```

Decisions that change the scope or design should be flagged back to the engineering agent for a plan revision before implementing. Decisions that are purely implementation details go in IMPLEMENT.md without requiring a plan update.

---

## Adapting RPI for Solo vs Team

| Phase | Solo | Team |
|-------|------|------|
| Research | Run requirement-parser + explorer; skip PM if feature is your own | All agents; PM agent output reviewed by a human PM |
| Plan | Skip UX agent for backend-only features | All agents; eng.md reviewed by a second engineer |
| Implement | Single engineer follows eng.md | Assign files to engineers by eng.md section; reviewer agent runs after each section |

The core rule stays the same in both cases: no skipping phases and no implementation without a signed-off plan. Solo development is not a reason to skip research — it is the primary reason to be more disciplined about it.

---
