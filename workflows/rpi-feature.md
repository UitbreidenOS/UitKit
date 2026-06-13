# RPI Feature Workflow

Research, Plan, Implement — a three-phase, multi-agent workflow for shipping features with rigorous scope control. Each phase produces a concrete artifact and must complete before the next begins.

---

## When to use

- Feature requests where the surface area is unclear at the start
- Work that crosses multiple files or services
- Any task where a bad plan is more expensive than the time spent planning
- Situations where multiple perspectives (PM, UX, Engineering) should be reconciled before a single line of code is written

---

## Phases

### Phase 1 — Research (`/rpi:research`)

**Input:** raw feature request (one sentence to a paragraph)

**Agents:**
- **Explore agent** — reads the existing codebase for patterns relevant to the request: similar features, data models, API shapes, existing abstractions
- **Research agent** — investigates any external dependencies: third-party APIs, libraries, documentation, breaking changes
- **Product manager agent** — synthesises explore and research findings into a structured requirements document and issues a GO/NO-GO recommendation with explicit rationale

**Gate:** Phase 2 cannot start until the PM agent has issued a GO recommendation. If NO-GO is returned, the output explains why and suggests a revised request.

**Output:** `rpi/{feature-slug}/RESEARCH.md`

```markdown
# Research: {feature-slug}

## Requirements
[Structured list derived from the raw request]

## Codebase findings
[Relevant existing patterns, entry points, models]

## External findings
[APIs, libraries, compatibility notes]

## Recommendation
GO / NO-GO

## Rationale
[Why — specific, not generic]
```

---

### Phase 2 — Plan (`/rpi:plan`)

**Pre-condition:** `rpi/{feature-slug}/RESEARCH.md` exists and contains a GO recommendation.

**Agents (run in parallel):**
- **PM agent** — writes user stories and acceptance criteria from the requirements
- **UX agent** — maps the user flow, edge cases, error states, and accessibility considerations
- **Engineering agent** — produces a technical design: files to create or modify, data model changes, API contract, estimated complexity

**Review:**
- **CTO advisor agent** — reads all three artifacts and reviews for architectural concerns, consistency, and missing cross-cutting concerns (auth, observability, migrations). Returns a list of unresolved concerns if any; the parallel agents address them before PLAN.md is finalised.

**Gate:** Phase 3 cannot start until PLAN.md is written and the CTO advisor has returned no unresolved concerns.

**Output:**
- `rpi/{feature-slug}/plan/pm.md`
- `rpi/{feature-slug}/plan/ux.md`
- `rpi/{feature-slug}/plan/eng.md`
- `rpi/{feature-slug}/PLAN.md` (consolidated summary, one page)

---

### Phase 3 — Implement (`/rpi:implement`)

**Pre-condition:** `rpi/{feature-slug}/PLAN.md` exists.

**Process:**
1. Read PLAN.md to extract the ordered list of file changes from the engineering plan
2. Implement one component at a time following the sequence in `eng.md`
3. After each major component (not each file), delegate to the **code reviewer agent** — it checks the component against the acceptance criteria in `pm.md` and the technical design in `eng.md`
4. The reviewer either approves the component or returns specific change requests; address all change requests before moving to the next component
5. On completion, write the decisions log

**Output:** working implementation + `rpi/{feature-slug}/IMPLEMENT.md`

```markdown
# Implementation log: {feature-slug}

## Decisions
[List of implementation decisions that deviated from the plan, with justification]

## Deferred
[Anything explicitly deferred to a follow-up]

## Completed
[Final component checklist with reviewer approval noted]
```

---

## Directory layout

```
rpi/
  {feature-slug}/
    RESEARCH.md
    PLAN.md
    IMPLEMENT.md
    plan/
      pm.md
      ux.md
      eng.md
```

---

## Example

```
User: /rpi:research "add CSV export to the orders table"

→ RESEARCH.md written, GO issued

User: /rpi:plan

→ plan/pm.md, ux.md, eng.md written; CTO review passed; PLAN.md written

User: /rpi:implement

→ Implementation proceeds component by component with code review gates
```

---
