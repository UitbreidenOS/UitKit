---
name: self-eval
description: "Honest work evaluation: score completed tasks on ambition and execution quality, run devil's advocate reasoning, and detect score inflation — avoid the 'everything is a 4/5' trap"
updated: 2026-06-13
---

# Self-Eval Skill

## When to activate
- After completing a task or feature to assess quality honestly
- When Claude says "done" but you want an unbiased quality check
- At the end of a work session to review what was actually accomplished
- Before merging a PR to sanity-check the work quality
- When you want a structured retrospective on a Claude Code session

## When NOT to use
- External code review — use the pr-review skill (peer review, not self-assessment)
- Security audit — use the security-auditor prompt
- Performance benchmarking — use the performance-profiler skill

## Instructions

### Two-axis quality assessment

```
Evaluate the quality of [completed work].

Work to evaluate: [describe what was built or done]
Context: [what was the goal, what constraints existed]

TWO-AXIS SCORING:

AXIS 1 — AMBITION (how hard was this task?):
- LOW: Routine, well-understood problem. Standard patterns. Low risk of being wrong.
  Examples: CRUD endpoint, config change, dependency update, typo fix
- MEDIUM: Requires design choices. Multiple valid approaches. Some complexity.
  Examples: new feature with edge cases, refactoring a module, adding auth
- HIGH: Novel problem. Significant design decisions. High risk of subtle errors.
  Examples: distributed system component, security-critical feature, performance optimisation

AXIS 2 — EXECUTION QUALITY (how well was it done?):
- POOR: Incomplete, has bugs, or misses requirements
- ADEQUATE: Correct but brittle, missing error cases, or lacks robustness
- STRONG: Correct, handles edge cases, clear, maintainable, tested

SCORE MATRIX (cannot override — derived from axes):
| Ambition → | LOW | MEDIUM | HIGH |
|---|---|---|---|
| POOR execution | 1/5 | 2/5 | 2/5 |
| ADEQUATE execution | 2/5 | 3/5 | 4/5 |
| STRONG execution | 3/5 | 4/5 | 5/5 |

Note: LOW ambition caps at 3/5 regardless of execution quality. 
A flawlessly executed trivial task is still a 3.

DEVIL'S ADVOCATE REASONING (mandatory before finalising):
1. Argue for a HIGHER score than your initial assessment: what did this do well?
2. Argue for a LOWER score: what did this miss, oversimplify, or get wrong?
3. Resolve the tension: given both arguments, what's the honest score?

OUTPUT FORMAT:
Task: [description]
Ambition: LOW / MEDIUM / HIGH — [1-sentence rationale]
Execution: POOR / ADEQUATE / STRONG — [1-sentence rationale]
Score: [X/5]
What was done well: [specific]
What was missed or could be better: [specific, honest]
```

### Session retrospective

```
Run a retrospective on [this Claude Code session / work period].

Session summary: [what was worked on, what was delivered]

Session evaluation:

DELIVERED vs. INTENDED:
- What was the goal at the start?
- What was actually completed?
- What was started but not finished?
- What was discovered that changed the plan?

QUALITY AUDIT (for each major output):
- [Output 1]: Ambition [X], Execution [X], Score [X/5]
- [Output 2]: Ambition [X], Execution [X], Score [X/5]

PROCESS REFLECTION:
- Where did work get blocked or slow?
- Where did context or requirements need clarification?
- What would have made this session more effective?

HONEST ASSESSMENT:
Did this session accomplish what it set out to do? (yes / partially / no)
What is the single most important thing to do differently next time?

Output: structured retrospective with honest scores and one concrete improvement.
```

### Score inflation detection

```
Check for score inflation in [assessment].

Common inflation patterns (flag if present):
- Everything scores 4/5 or higher (statistically improbable)
- "Strong" execution claimed without evidence of edge case handling
- "High" ambition claimed for routine patterns
- No "what could be better" identified (nothing is perfect)
- Devil's advocate arguments that were too easily dismissed

Calibration questions:
- Would a senior engineer reviewing this call it "strong"?
- Are there error paths that weren't tested?
- Is the code understandable without the author explaining it?
- Does it handle the expected edge cases (empty, null, max values)?
- Will it work the same way in 6 months without modifications?

A calibrated scoring distribution for a week of work:
- ~20% of tasks: 1-2/5 (trivial or incomplete)
- ~50% of tasks: 3/5 (routine work, executed adequately)
- ~25% of tasks: 4/5 (meaningful work, well done)
- ~5% of tasks: 5/5 (genuinely hard problem, excellent execution)

If your distribution is skewed heavily toward 4-5, recalibrate downward.
```

## Example

**User:** I just added a new endpoint `POST /api/users` with email validation. Score it honestly.

**Claude's self-evaluation:**

**Task:** Add `POST /api/users` endpoint with email validation.

**Ambition: LOW**
Creating a CRUD endpoint with email validation is one of the most common patterns in web development. Standard Express/Fastify patterns, standard Zod validation, well-understood problem. No novel design decisions required.

**Execution: Before the devil's advocate check:**
Initial instinct: STRONG (it works, it has validation, it returns the right status codes)

**Devil's advocate — argue for LOWER:**
- Was duplicate email handling tested? If someone POSTs the same email twice, does it return 409 or does it throw a 500 from a DB unique constraint violation?
- Was rate limiting added to prevent abuse of the signup endpoint?
- Was the password (if any) hashed with bcrypt/argon2, not stored plaintext?
- Were the error messages checked to not expose internals ("duplicate key value violates unique constraint users_email_key")?

**Devil's advocate — argue for HIGHER:**
- It handles the happy path correctly
- Email format validation prevents obvious malformed inputs
- Returns proper 201 status code

**Resolution:** Without seeing error handling for duplicates and security considerations checked, this is ADEQUATE, not STRONG. Standard patterns executed but with likely gaps in edge cases.

**Score: 2/5** (LOW ambition × ADEQUATE execution)

What was done well: correct HTTP semantics, proper validation library used
What could be better: duplicate email handling, rate limiting, error message sanitisation, test coverage for failure cases

---
