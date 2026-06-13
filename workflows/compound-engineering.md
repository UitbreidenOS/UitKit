# Compound Engineering

Error-to-lesson transformation that makes future Claude Code sessions progressively smarter. Every mistake made in a session becomes a structured entry in `LESSONS.md`. Future sessions load this file and avoid the same errors without being told.

---

## When to use

- Any long-running project with recurring Claude Code sessions
- Codebases with non-obvious conventions or foot-guns that keep tripping Claude up
- Teams using Claude Code on a shared repo — lessons written once apply to all contributors
- Any situation where you find yourself correcting the same class of mistake more than once

---

## Core idea

Knowledge compounds. A single mistake, once documented, is never repeated. Ten sessions in, Claude enters the codebase aware of every pitfall that was discovered in the nine before it. The cost is seconds per lesson; the payoff is cumulative.

---

## Structure

### `LESSONS.md` — append-only log

Lives at the project root (or wherever CLAUDE.md lives). Referenced in CLAUDE.md so it is loaded at the start of every session:

```markdown
<!-- In CLAUDE.md -->
@LESSONS.md
```

### Lesson entry format

```markdown
## [Date] — [Brief title]
**Mistake:** [What went wrong — specific, not "Claude made an error"]
**Root cause:** [Why it happened — missing context, wrong assumption, ambiguous convention]
**Correct approach:** [What to do instead — concrete and actionable]
**Context:** [Scope — is this codebase-specific, language-specific, or universal?]
```

---

## Workflow

### During a session

When Claude makes a mistake and corrects it, write the lesson immediately:

```
"Update LESSONS.md: tried to import UserService from lib/users — correct path is services/users/UserService.ts (barrel exports not used in this project)."
```

Claude appends the entry in the standard format. The lesson is live for the rest of the session and all future sessions.

### At session end (optional but high-value)

Before closing a long session, ask Claude to review the session for undocumented mistakes:

```
"Review this session for any mistakes that aren't yet in LESSONS.md and add entries for them."
```

Claude scans the conversation, identifies corrections and course changes, and adds structured entries for each. This takes 30–60 seconds and captures lessons that slipped by in the flow of work.

### At session start

Because CLAUDE.md references `@LESSONS.md`, Claude reads the full lessons log before responding to the first message. No manual loading required.

---

## Example LESSONS.md

```markdown
# Lessons

## 2026-05-10 — Prisma schema location
**Mistake:** Looked for schema.prisma in the project root.
**Root cause:** Default Prisma assumption — project uses a non-standard layout.
**Correct approach:** Schema lives at infra/db/schema.prisma. Client config points there via prisma.schema in package.json.
**Context:** This project only.

## 2026-05-14 — API response envelope
**Mistake:** Returned { data: result } directly from route handlers.
**Root cause:** Generic REST convention assumed. This API uses { ok: true, payload: result }.
**Correct approach:** All route handlers must return the standard envelope. See src/lib/response.ts helpers.
**Context:** This project only.

## 2026-05-18 — Test database
**Mistake:** Tests were writing to the development database.
**Root cause:** DATABASE_URL not overridden in test setup.
**Correct approach:** vitest.setup.ts sets process.env.DATABASE_URL to TEST_DATABASE_URL. Check that TEST_DATABASE_URL is set before running tests.
**Context:** This project only.
```

---

## Rules

- **Append-only.** Never delete or overwrite entries. If a lesson is superseded, add a new entry noting the correction and date.
- **Specific, not generic.** "Don't make assumptions" is not a lesson. "API responses use `{ ok, payload }` not `{ data }`" is a lesson.
- **Context scope is required.** Mark whether the lesson applies to this codebase, this language, or universally. This prevents overfitting on project-specific conventions.
- **Write immediately.** Lessons written at the moment of correction are more accurate than retrospective summaries.

---
