---
description: Write an Architectural Decision Record (ADR) documenting a design choice, its rationale, alternatives considered, and consequences. Use when adopting a framework, changing data architecture, redesigning authentication, or establishing conventions that affect future development decisions.
---

# /write-adr

## When to activate

When you need to document an architectural decision made during development — selecting a framework, adopting a pattern, choosing between competing solutions, or establishing a convention that affects the codebase structure or future decisions.

## When NOT to use

- For minor implementation details (use inline comments instead)
- For bug fixes or refactoring work (ADRs document *strategic* choices, not tactical ones)
- For decisions already well-documented in code comments or design specs
- When the decision is still under discussion (wait until consensus exists)

## Instructions

### ADR Structure

An ADR file should live in `docs/adr/` and follow the naming convention: `YYYY-MM-DD-short-title.md` (e.g., `2026-06-13-use-react-hooks.md`).

Use this template:

```markdown
# YYYY-MM-DD: Decision Title

## Status
[Proposed | Accepted | Deprecated | Superseded by ADR XXXX]

## Context
[Describe the problem or situation that prompted this decision. Include constraints, alternatives considered, and the reasoning behind why this decision mattered at the time.]

## Decision
[State the architectural decision clearly and concisely. What was chosen and why.]

## Rationale
[Explain the advantages of this decision relative to alternatives. Why this choice serves the project's goals.]

## Consequences
Positive: [What becomes easier or better as a result?]
Negative: [What becomes harder? What trade-offs were accepted?]

## Alternatives Considered
[List other options evaluated and why they were rejected, with brief pros/cons for each.]

## Related ADRs
[Reference any ADRs this decision depends on or conflicts with.]
```

### Writing Process

1. **Identify the decision.** Be specific — "use React" is too broad; "use React with hooks instead of class components" is clear.
2. **Gather context.** What problem did this solve? What constraints existed? What alternatives existed?
3. **Document the choice.** Write it in past tense, as if the decision has been made.
4. **Explain trade-offs.** ADRs are most valuable when they capture why something was chosen *over* something else.
5. **Date and name the file.** Use today's date: `YYYY-MM-DD-short-title.md`. Use the next sequential ADR or date-based naming depending on project convention.
6. **Review with team.** Treat ADRs as team documentation — discuss with stakeholders before finalizing.

### Tips

- **Concise but complete.** ADRs should be readable in 2-3 minutes but thorough enough to explain the decision to someone new to the project.
- **Avoid blame.** ADRs document decisions, not people. Use neutral language.
- **Link decisions.** If one ADR depends on or supersedes another, reference it explicitly.
- **Update status over time.** When a decision becomes obsolete, mark it "Superseded by ADR XXXX" rather than deleting it.
- **Keep it anchored.** Ground decisions in measurable concerns: performance, security, team expertise, timeline, maintenance cost.

## Example

```markdown
# 2026-06-10: Use SQLAlchemy 2.0 for ORM in FastAPI service

## Status
Accepted

## Context
We migrated the API layer from Django to FastAPI for better async support and lower latency. Django ORM is tightly coupled to Django's request-response cycle and doesn't integrate well with FastAPI's async request handlers. We evaluated SQLAlchemy 2.0, Tortoise ORM, and raw SQL as alternatives. The team needed a solution that would work with async code paths and could be shared with background workers.

## Decision
We adopted SQLAlchemy 2.0 with async support (`sqlalchemy[asyncio]`) for all database operations. This provides a single ORM across the API layer, background tasks, and any future async services.

## Rationale
SQLAlchemy 2.0 provides comprehensive async support, a mature ecosystem with extensive documentation, strong typing support for FastAPI integration, and excellent performance in async contexts. It has wider adoption than Tortoise ORM and avoids the maintenance burden of raw SQL for this project's scale. The query API is more expressive than Django ORM and better suited to complex analytical queries.

## Consequences
Positive:
- Full async database support, improving API response latency under load (measured 40% improvement on typical queries)
- Seamless integration with FastAPI's dependency injection via SQLAlchemy's sessionmaker
- Can share database models between API service and async background workers
- Strong typing support reduces bugs and improves IDE autocomplete

Negative:
- Lost Django admin convenience; had to build a custom admin dashboard (3-day effort)
- Team members needed to learn SQLAlchemy's query syntax; took ~1 week for full competency
- SQLAlchemy's async API is newer and has fewer StackOverflow answers than Django ORM

## Alternatives Considered
- **Django ORM**: Rejected — designed for synchronous request-response, lacks async-first patterns; would require wrapper code and harm performance
- **Tortoise ORM**: Rejected — simpler learning curve but smaller community, fewer extensions, weaker typing support
- **Raw SQL**: Rejected — full control but high maintenance burden for a project this size; increases cognitive load for team

## Related ADRs
- 2026-06-01: Migrate API layer to FastAPI (parent decision)
- 2026-06-05: Move to async task queue for background jobs (dependent)
```
