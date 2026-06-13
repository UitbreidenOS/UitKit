# Performance Rules

Copy the relevant sections into your project's `CLAUDE.md`.

---

## Database

- Never run queries inside loops — batch with `IN (...)` or use a join
- Always paginate queries that can return unbounded results — no `SELECT *` without a `LIMIT`
- Add indexes before the query is slow in production, not after — analyze query plans during development
- Select only the columns you need — `SELECT *` fetches unused data and prevents index-only scans
- Use database-level aggregation (`COUNT`, `SUM`, `GROUP BY`) — do not load rows into memory to count them

## API and network

- Cache responses that are expensive to compute and change infrequently — set explicit TTLs
- Paginate list endpoints — return a maximum of N items per request with a cursor or offset
- Do not make N+1 queries — batch related data with DataLoader, `include`, or a join
- Avoid synchronous calls to external services in request handlers — use queues for non-critical work
- Set timeouts on all external HTTP calls — never let a slow dependency hang your server

## Memory

- Do not load large datasets into memory to process them — stream or paginate
- Release references when done — avoid accidental closures that prevent garbage collection
- Use generators/iterators for large sequences instead of building full lists in memory

## Measurement

- Profile before optimizing — never guess where the bottleneck is
- Measure in production-like conditions — local benchmarks are misleading
- Establish a baseline before making changes — without a baseline, you cannot confirm improvement
- Performance tests belong in CI — regression that passes code review but fails perf budget must be caught automatically

---
