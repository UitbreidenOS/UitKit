# RIPER Workflow

Five-phase structured agentic coding framework. Every phase has a strict mode, defined inputs, and a concrete artifact output. Moving to the next phase requires completing the current one.

---

## When to use

- Complex features where scope creep is a predictable risk
- Unfamiliar codebases where jumping to implementation too early causes expensive rework
- Tasks where correctness matters more than speed of the first attempt
- Any situation where a collaborator (human or agent) needs to review before work continues

---

## Phases

### 1. Research

**Mode declaration:** "I am in RESEARCH mode."

**What happens:** Gather information only. Read relevant files, check documentation, identify unknowns. Ask clarifying questions if needed. Do not propose solutions. Do not write any code.

**Prohibited in this phase:** Suggesting approaches, writing implementation code, editing files.

**Output:** A context summary — what was found, what is still unknown, and the concrete question the next phase must answer.

```
Context summary:
- Relevant files: [list]
- Current behaviour: [description]
- Unknown: [specific gaps]
- Question for Innovate phase: [precise question]
```

---

### 2. Innovate

**Mode declaration:** "I am in INNOVATE mode."

**What happens:** Brainstorm possible approaches based on the research output. List each approach with its trade-offs. No implementation. No code. No editing of project files.

**Prohibited in this phase:** Writing implementation code, selecting an approach, editing project files.

**Output:** A numbered list of approaches, each with pros, cons, and fit-for-context assessment.

```
Options:
1. [Approach] — pros: [...] cons: [...] fit: [high/medium/low]
2. ...
```

---

### 3. Plan

**Mode declaration:** "I am in PLAN mode."

**What happens:** Select one approach from the Innovate output and produce a step-by-step implementation plan. Every step must be atomic: one file change, one function, one database migration — not "implement the feature". Number every step. Identify any prerequisite steps.

**Gate:** The plan must be approved (by the user or a reviewing agent) before Phase 4 begins.

**Output:** A numbered checklist with no ambiguity.

```
Implementation plan:
[ ] 1. Create src/lib/export.ts with exportToCsv(rows: Row[]): string
[ ] 2. Add GET /api/export route in src/routes/export.ts calling exportToCsv
[ ] 3. Add Export button to OrdersTable component in src/components/OrdersTable.tsx
[ ] 4. Write unit tests in src/lib/export.test.ts covering empty, single-row, and multi-row cases
```

---

### 4. Execute

**Mode declaration:** "I am in EXECUTE mode."

**What happens:** Implement the plan exactly as written, one step at a time. Check off each step after completing it. Do not improvise. Do not add features not in the plan. If something unexpected is encountered — a file that doesn't exist, a type conflict, a missing dependency — stop, document the blocker, and return to Plan mode to resolve it.

**Prohibited in this phase:** Skipping steps, adding scope, making design decisions not covered by the plan.

**Blocker protocol:** If blocked, output:

```
BLOCKED at step N: [description of the issue]
Returning to PLAN mode to resolve.
```

Then update the plan to address the blocker and resume Execute.

**Output:** Working implementation with every plan step checked off.

---

### 5. Review

**Mode declaration:** "I am in REVIEW mode."

**What happens:** Compare the implementation to the original plan line by line. Identify any deviations (additions, omissions, or substitutions). Verify that every acceptance criterion from the Plan phase is met. Document findings.

**Output:** A review report.

```
Review report:
- Steps completed: [N/N]
- Deviations: [list or "none"]
- Requirements met: [yes / partial — details]
- Follow-up items: [list or "none"]
```

---

## Rules

1. Never skip phases. The sequence is always Research → Innovate → Plan → Execute → Review.
2. Declare mode explicitly at the start of each phase response.
3. In Execute: only do what the plan says. Unexpected findings return to Plan, not Innovate or Research.
4. Each phase produces a concrete artifact before the next begins.
5. Approval between Plan and Execute is required — either explicit user sign-off or a reviewing agent.

---

## Example

```
User: Use RIPER to add rate limiting to the API.

Claude: I am in RESEARCH mode.
[reads middleware stack, existing routes, request pipeline...]
Context summary: No rate limiting middleware present. express-rate-limit is already in package.json but unused. Unknown: per-route limits vs global. Question: should limits be global or per-route?

User: Per-route, 100 req/min for public endpoints, 1000 for authenticated.

Claude: I am in INNOVATE mode.
[lists approaches: middleware factory, decorator pattern, config-driven...]

User: Use the middleware factory approach.

Claude: I am in PLAN mode.
[produces numbered checklist of 6 steps...]

User: Approved.

Claude: I am in EXECUTE mode.
[implements step by step, checking off each...]

Claude: I am in REVIEW mode.
[compares to plan, confirms 6/6 steps complete, no deviations, requirements met]
```

---
