---
description: Break a goal or feature into scoped, sequenced tasks with effort estimates
argument-hint: "[goal or feature description]"
---
Break down the following into a sequenced task list: $ARGUMENTS

Produce a flat, ordered list of tasks. For each task:

```
[ ] <verb-first task title>
    Size: XS | S | M | L | XL   (XS=<1h, S=1-3h, M=3-8h, L=1-3d, XL=>3d)
    Depends on: <task number(s), or "none">
    Notes: <one line — key assumption, risk, or constraint. Omit if nothing notable.>
```

After the list, add a **Risks & Assumptions** section (3–6 bullets) covering:
- Unknowns that could blow up estimates
- External dependencies (APIs, other teams, infra)
- Scope boundaries — what is explicitly NOT included

Rules:
- Tasks must be independently completable by one person in one sitting (M or smaller preferred).
- If a task would be XL, split it.
- Order tasks so each one can start once its dependencies are done — no circular deps.
- Use implementation-level verbs: Write, Add, Refactor, Deploy, Test, Configure — not vague verbs like "Handle" or "Work on."
- Do not include tasks for project management overhead (standups, reviews) unless the request explicitly asks.
- If $ARGUMENTS is too vague to break down without guessing at scope, ask one clarifying question before proceeding.
- No marketing language. No "ensure seamless experience."

Output only the task list and risks section.
