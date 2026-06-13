---
name: adr-writer
description: "Write Architecture Decision Records in Nygard format. Triggers on architectural choices, approach comparisons, or undocumented past decisions."
updated: 2026-06-13
---

# ADR Writer

## When to activate

- Making a decision between two or more technical approaches (e.g., choosing an ORM, picking a caching strategy, selecting a queue system)
- After a decision was made verbally in a meeting or chat and needs formal documentation
- When the codebase shows an unusual pattern and there is no explanation for why it was chosen
- Before committing to a hard-to-reverse architectural change (database schema, authentication model, API versioning)
- When a decision affects multiple teams or services and needs a clear paper trail

## When NOT to use

- Implementation details that are easily changed without impact (variable naming, folder structure within a single module)
- Decisions that are purely stylistic with no trade-offs
- Third-party dependency version bumps unless they introduce breaking behavior
- Decisions that are fully reversible in under an hour with no downstream effects

## Instructions

### What qualifies as an ADR

A decision warrants an ADR if all three are true:
1. It is **hard to reverse** — undoing it takes significant effort or causes downstream impact
2. It would be **surprising without context** — a new developer reading the code would wonder why
3. A **real trade-off existed** — there was at least one plausible alternative considered and rejected

If unsure, write the ADR. The cost of documenting a non-event is low; the cost of missing documentation for a load-bearing decision is high.

### ADR format (Nygard)

```markdown
# ADR-[NNNN]: [Short Title in Noun Phrase Form]

**Date:** [YYYY-MM-DD]
**Status:** [Accepted | Superseded by ADR-NNNN | Deprecated]
**Supersedes:** [ADR-NNNN if applicable, else omit]

## Context

[2–4 sentences: what situation or problem forced this decision?
Include relevant constraints: team size, timeline, existing stack, external requirements.]

## Decision

[One sentence, active voice, present tense.
"We will use X for Y because Z." Not "It was decided that..."]

## Rationale

[Why this option over the alternatives?
Focus on the specific factors that made this the right choice for this context.
Avoid generic praise — "it's popular" is not rationale.]

## Alternatives Considered

| Option | Why rejected |
|---|---|
| [Alternative A] | [Specific reason it lost] |
| [Alternative B] | [Specific reason it lost] |

## Consequences

**Positive:**
- [What this makes easier or better]

**Negative:**
- [What this makes harder or introduces as new complexity]

**Neutral:**
- [Changes that are neither good nor bad, just different]

## Review Date

[Date 6–12 months from now, or the event that should trigger review: "Review when team exceeds 10 engineers" or "Review after first production incident involving X"]
```

### Storage and numbering

- Store in `docs/decisions/` or `docs/adr/` — pick one and never mix
- Filename: `ADR-0001-kebab-case-title.md`, `ADR-0002-...`
- Numbering is sequential and never reused — even if an ADR is deprecated
- When superseding an ADR: update the old ADR's Status to `Superseded by ADR-NNNN`, link the new ADR back to the old one

### Linking superseded ADRs

When a decision changes:
```markdown
# ADR-0007: Switch from REST to GraphQL for Client API

**Status:** Accepted
**Supersedes:** ADR-0003 (REST-first API design)
```

And update the old ADR:
```markdown
**Status:** Superseded by ADR-0007
```

### What NOT to include

- Implementation details (which library version, exact config values) — those belong in README or inline comments
- Team member names — use roles ("backend team", "CTO") if attribution is needed
- Predictions about the future — stick to what is known now
- Copy-pasted marketing text from a vendor's website

## Example

**Scenario:** The team chose Drizzle ORM over Prisma for a new TypeScript project.

**Generated ADR:**

```markdown
# ADR-0004: Drizzle ORM over Prisma for Data Access Layer

**Date:** 2026-05-23
**Status:** Accepted

## Context

Selecting an ORM for a new TypeScript API that will interact with PostgreSQL.
The project has a small team (2 engineers), tight performance requirements on
bulk insert operations, and an existing schema already defined as SQL migrations.
The team has prior experience with both options.

## Decision

We will use Drizzle ORM for all database access because it gives us type-safe
queries without a code generation step and does not abstract away raw SQL when
we need it.

## Rationale

Drizzle treats SQL as the source of truth, which aligns with our existing
hand-written migration files. Prisma's schema-first model would require
duplicating table definitions. On bulk insert benchmarks against our target
dataset size (500k rows/batch), Drizzle ran 2.3× faster in our prototype.
Prisma's generated client adds ~100ms cold start which matters in our
serverless deployment context.

## Alternatives Considered

| Option | Why rejected |
|---|---|
| Prisma 5 | Code generation step adds CI complexity; schema-first conflicts with our existing SQL migrations; slower cold start |
| Raw pg client | Too much boilerplate for query building; no type inference on query results |
| Kysely | Strong contender — rejected only because team has no prior Kysely experience and Drizzle's API is more familiar |

## Consequences

**Positive:**
- Query results are typed without a build step
- Direct SQL escape hatch available without leaving the ORM
- Smaller bundle size than Prisma

**Negative:**
- Drizzle's ecosystem is smaller than Prisma's — fewer community plugins
- Migration tooling (drizzle-kit) is less mature than Prisma Migrate

**Neutral:**
- Team must learn Drizzle's query builder syntax

## Review Date

2027-05-23, or if a Prisma 6 release significantly addresses the cold start issue.
```

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
