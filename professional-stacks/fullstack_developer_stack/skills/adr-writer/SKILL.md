# ADR Writer

## When to activate
When an architectural decision needs to be documented. Use this to create a lightweight, one-page ADR for decisions like library adoption, data flow changes, authentication redesigns, performance optimizations, or API contract changes. Triggered whenever a PR modifies system architecture or introduces constraints that affect future decisions.

## When NOT to use
Do not use for bug fixes, internal refactorings, or documentation-only changes. Do not use for minor feature additions that don't affect system design. ADRs are exclusively for architectural decisions — changes that constrain or enable future choices.

## Instructions

1. **Gather context.** Understand what decision is being made, why it matters, and who it affects (current team, future maintainers, dependent services).

2. **State the decision in one sentence.** Use active voice: "We will adopt X because Y." Avoid hedging.

3. **Write the rationale.** Explain the problem being solved, why this decision addresses it, and why it beats the alternatives. Include measurable criteria if applicable (e.g., latency targets, cost, team velocity).

4. **List alternatives considered.** Name 2–3 realistic alternatives. For each, list 1–2 pros and 1–2 cons. Keep descriptions concise.

5. **Describe consequences.** Split into positive (what gets easier, what we gain) and negative (what gets harder, what risks emerge, new constraints). Be honest about trade-offs.

6. **Set status.** Use one of:
   - **Accepted**: Decided and already implemented or ready to implement.
   - **Proposed**: Under review; decision not yet final.
   - **Superseded**: Replaced by another ADR (link to its number).

7. **Return the complete ADR.** Follow the format below exactly.

## Output Format

```
# ADR [#]: [Decision Title]

**Status:** Accepted / Proposed / Superseded
**Date:** YYYY-MM-DD
**Author:** [Name]

## Decision
[One sentence. What are we deciding?]

## Rationale
[2–3 paragraphs. Why this decision? What problem does it solve? Why is this better than alternatives?]

## Alternatives Considered
1. **[Alternative 1]:** [Pro 1], [Pro 2]. [Con 1], [Con 2].
2. **[Alternative 2]:** [Pro 1], [Pro 2]. [Con 1], [Con 2].
3. **[Alternative 3]:** [Pro 1], [Pro 2]. [Con 1], [Con 2].

## Consequences

### Positive
- [Consequence 1: what becomes easier/better]
- [Consequence 2: what becomes easier/better]

### Negative
- [Risk 1: what becomes harder/risky]
- [Risk 2: what becomes harder/risky]

## Related Decisions
- [Link to related ADRs if any]
```

## Example

```
# ADR 3: Use PostgreSQL for transactional data, Redis for cache

**Status:** Accepted
**Date:** 2026-06-01
**Author:** Alice Engineer

## Decision
We will use PostgreSQL as the primary transactional database and Redis as the cache layer for frequently accessed data.

## Rationale
Our current monolithic database is a bottleneck at scale. We need to separate transactional guarantees from caching. PostgreSQL provides ACID compliance and complex queries; Redis provides sub-millisecond read latency for hot data. Load testing shows we hit the ceiling at 10k concurrent users; we're already at 8k and growing 20% month-over-month.

## Alternatives Considered
1. **Single-database approach (continue with current setup):** Simpler to maintain, no new infrastructure. Hits scaling ceiling at 10k concurrent users; we're already at 8k and approaching that limit.
2. **MongoDB + cache:** Easier schema migrations, JSON-native. Lacks multi-document transactions; risky for payments and orders.
3. **PostgreSQL + Memcached:** Memcached is simpler, less operational overhead. Redis offers richer data structures (sorted sets, streams) that we'll need for leaderboards and event logs.

## Consequences

### Positive
- Sub-millisecond reads for hot data (99th percentile <5ms vs. 150ms today)
- ACID guarantees for financial transactions
- Unbounded horizontal scaling of read-heavy workloads
- Supports future event-streaming use cases (Redis streams)

### Negative
- Cache invalidation complexity (new failure mode; requires careful TTL strategy)
- Requires dual-write strategy during migration (risk window of ~1 week)
- Team must learn Redis operations (training time, ~40 hours for full depth)
- Higher operational complexity (two systems to monitor, upgrade, and back up)

## Related Decisions
- ADR 2: Async task queue (depends on this decision; queues cache worker status in Redis)
- ADR 4: Cache invalidation strategy (defines TTL and eviction policies)
```
