---
description: Draft an Architecture Decision Record for a specific technical decision
argument-hint: "[decision topic]"
---
Draft an Architecture Decision Record (ADR) for: $ARGUMENTS

Before writing:
1. Check for an existing `docs/decisions/`, `docs/adr/`, or `adr/` directory to determine
   the numbering convention and file naming scheme in use. Match it exactly.
2. If an ADR template already exists in the repo, use it. Otherwise use the format below.
3. Read relevant source files to ground the "Context" and "Consequences" sections in
   actual code, not hypotheticals.

ADR format:

# ADR-NNN: [Title — noun phrase describing the decision, not the problem]

## Status
Proposed | Accepted | Deprecated | Superseded by ADR-NNN

## Date
YYYY-MM-DD

## Context
What situation, constraint, or requirement forced this decision?
Include: scale, team size, existing system constraints, external requirements.
Keep to facts — no advocacy here.

## Decision
State the decision in one sentence starting with "We will…".
Then explain the mechanism: what will be built, changed, or adopted, and how.

## Considered Alternatives
For each alternative considered:
- **Option name**: what it is, why it was considered, why it was rejected.
At least two alternatives. Do not list options that were never seriously considered.

## Consequences
**Positive:**
- Concrete, verifiable benefits (performance, simplicity, cost, team velocity).

**Negative:**
- Real tradeoffs accepted. Do not minimize them.

**Risks:**
- What could go wrong. What would trigger revisiting this decision.

## References
Links to relevant PRs, issues, benchmarks, or external docs that informed the decision.

Writing rules:
- Be precise and neutral. An ADR is a historical record, not a sales pitch.
- Write in past tense for accepted decisions, future tense for proposed.
- Avoid vague adjectives: "simple", "flexible", "scalable" mean nothing without evidence.
- If $ARGUMENTS is vague, ask one clarifying question before proceeding: what specific
  decision needs to be recorded, and what was chosen?
- Output the file to the correct ADR directory with the next available number.
  Confirm the full output path after writing.
