# Session Learning Capture

End-of-session workflow that extracts lessons, decisions, and discoveries from a Claude Code session and persists them before the context window closes. Prevents knowledge evaporation between sessions.

---

## When to use

- At the end of any session lasting more than 30 minutes
- After making an architectural decision during a coding session
- When you solved a non-obvious problem and want future Claude sessions to benefit from the solution
- Before closing a long autonomous session to preserve what was learned
- Any time you find yourself thinking "I'll remember this" — you won't, and neither will Claude

---

## Phases

### Phase 1 — Session summary

Start this phase before the context gets too compressed.

```
We're ending this session. Before we close:

Summarize what happened in this session:
1. What was the original goal?
2. What was actually built or changed?
3. What approaches were tried and abandoned — and why?
4. What non-obvious things did we discover? (gotchas, undocumented behavior, constraints)
5. What is still unfinished and what is the next concrete step?

Keep it factual. No padding.
```

Review the summary for accuracy before proceeding. Correct anything Claude got wrong about what was decided.

---

### Phase 2 — Rule extraction

```
Based on this session summary, identify instructions that should be added to CLAUDE.md.

A rule belongs in CLAUDE.md if:
- It is specific to this project (not general programming advice)
- Claude would make a different decision without being told
- It came from a real decision made in this session

For each candidate rule:
  - Proposed text (one or two lines, directive tone)
  - Section of CLAUDE.md where it belongs
  - Why it would matter in a future session

Do not propose rules that are already present in CLAUDE.md.
Do not propose generic advice ("write clean code", "handle errors").
```

Review each proposed rule. Accept, reject, or edit each one. Do not add rules you don't agree with — Claude will follow them literally in future sessions.

---

### Phase 3 — Architecture decision capture

```
Did this session involve any architecture decisions?

A decision qualifies as an ADR if:
- It was hard to reverse (or costly to change later)
- The reasoning wouldn't be obvious to someone reading the code
- There was a real alternative that was considered and rejected

For each qualifying decision:
  - Decision title (one line)
  - Context (what problem forced this decision)
  - Decision made (one sentence, active voice)
  - Alternatives that were rejected and why
  - Consequences (what this makes easier, what it makes harder)

If no ADR-worthy decisions were made, say so explicitly.
```

If ADRs are identified, generate them using the ADR format from `skills/productivity/adr-writer.md` and save to `docs/decisions/`.

---

### Phase 4 — LESSONS.md update

```
Update LESSONS.md with what was learned in this session.

If LESSONS.md does not exist, create it with this structure:
# Lessons Learned
A living record of non-obvious things discovered during development.

## [Date] — [Session topic in 5 words]
### What we learned
[2–5 bullets of concrete, specific findings]
### What to do next time
[1–3 actionable takeaways]

If LESSONS.md exists, append a new dated entry — do not rewrite existing entries.

Important: only include things that were genuinely non-obvious.
Do not pad with things that went according to plan.
```

---

### Phase 5 — Confirmation before writing

Show the user a summary of all proposed writes before touching any file:

```
Here is what I am about to write:

1. CLAUDE.md additions: [list accepted rules]
2. New ADR files: [list file paths and one-line summaries]
3. LESSONS.md additions: [preview the new entry]

Confirm to proceed, or tell me what to change.
```

Only write files after explicit user confirmation. Never silently update CLAUDE.md.

---

## Example

Session: "Debugged why Prisma queries were timing out in production"

Phase 1 summary: discovered that Prisma's connection pool defaults to 5 connections, production load required 20, fix was `DATABASE_CONNECTION_LIMIT=20` in env + `connection_limit=20` in the database URL.

Phase 2 rule extraction:
- Proposed CLAUDE.md rule: "Always check `DATABASE_CONNECTION_LIMIT` when debugging slow DB queries in production — the Prisma default pool of 5 is too small for any real workload."
- Section: `## Database`

Phase 3 ADR: no architecture-level decision, just a configuration fix → no ADR.

Phase 4 LESSONS.md entry:
```
## 2026-05-23 — Prisma connection pool too small
### What we learned
- Prisma defaults to 5 DB connections regardless of plan or server size
- Pool exhaustion looks like slow queries, not connection errors
- Fix is `connection_limit=N` in the DATABASE_URL, not application code
### What to do next time
- Set connection_limit explicitly in DATABASE_URL on every new project
- Monitor `pg_stat_activity` for idle connections before assuming query performance issues
```

---
