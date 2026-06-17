---
name: prd-outliner
description: Writes a complete product requirements document (2–4 pages) from a feature brief. Sections: problem statement, solution, personas, use cases, acceptance criteria (testable), success metrics (with baseline and target), dependencies, risks, competitive context, and non-scope. All acceptance criteria are outcome-focused, not effort-focused. All success metrics have specific numeric targets.
allowed-tools: Read, Write, WebSearch, WebFetch
effort: high
---

# PRD Outliner

## When to activate
When a feature concept, user problem, or business opportunity is ready to move from pitch to detailed specification. Use this to create a complete PRD that can be handed to engineering, design, and other stakeholders for review.

## When NOT to use
Do not use for bug fixes or minor refinements — those don't need a full PRD. Do not use if the problem is not yet clearly defined. Do this skill only after problem definition is complete.

## Instructions

1. Start with the problem statement. Interview the requesting stakeholder and/or customer data to define: who is affected, what is the current friction, what is the business impact of that friction. One paragraph max.
2. Define the solution in one paragraph. This is the proposed way to solve the problem. Keep it short; details come in the use cases.
3. Create 2–3 user personas affected by this feature. Each has a name, role, and one-sentence goal.
4. Describe 2–3 use cases from each persona's perspective. "As a [persona], I want [action] so that [outcome]."
5. Write acceptance criteria. These must be testable — you could write an automated test for each one. Use "can," "will," "does" — not "should," "might," "ideally."
6. Define success metrics. Each metric has: (a) baseline — where you are now, (b) target — where you want to go, (c) measurement plan — how you'll track it.
7. List dependencies: what from engineering (API, database schema), design, data, or third parties is needed.
8. Identify 2–4 risks and specific mitigation steps for each.
9. Competitive context: how are competitors solving this? What's your differentiation?
10. Non-scope: what is NOT in this PRD. This prevents scope creep.

## Output Format

```
# [Feature Name] — PRD

## Problem Statement
[1 paragraph, max 150 words. Who, what friction, business impact.]

## Solution Overview
[1 paragraph, max 100 words. What we're building and why.]

## User Personas
- **[Persona 1]** — [role] — Goal: [one-sentence goal]
- **[Persona 2]** — [role] — Goal: [one-sentence goal]

## Use Cases
[2–3 per persona. "As a [persona], I want [action] so that [outcome]."]

## Success Metrics
| Metric | Baseline | Target | Measurement Plan |
|---|---|---|---|
| [Metric 1] | [current] | [goal] | [how we measure] |
| [Metric 2] | [current] | [goal] | [how we measure] |

## Acceptance Criteria
- [ ] [Can do X] (testable)
- [ ] [Will show Y] (observable)
- [ ] [Does not Z] (boundary condition)

## Dependencies
- Engineering: [APIs, schema, integrations needed]
- Design: [Components, flows, brand resources needed]
- Data: [Analytics events, dashboards needed]
- Third-party: [APIs, vendors needed]

## Risks & Mitigations
| Risk | Impact | Mitigation |
|---|---|---|
| [Risk 1] | High/Med/Low | [Specific mitigation step] |

## Competitive Context
[How competitors solve this. Your differentiation in 2–3 sentences.]

## Non-Scope
[Explicitly list 2–3 things NOT in this PRD.]
```

---
