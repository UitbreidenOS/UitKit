---
name: performance-profiler
description: "Application performance profiling: identify CPU hotspots, memory leaks, slow queries, N+1 problems — Node.js, Python, and database performance analysis"
updated: 2026-06-13
---

# Performance Profiler Skill

## When to activate
- Application is slow and you don't know why
- CPU usage is unexpectedly high under load
- Memory usage grows over time (potential leak)
- Database queries are taking too long
- A specific endpoint or function is slow under profiling
- Preparing for a load test and need a performance baseline

## When NOT to use
- Network latency from third-party APIs — instrument at the boundary, then the problem is upstream
- Infrastructure sizing — that's capacity planning, not profiling
- Frontend performance — use browser DevTools Lighthouse, not backend profiling

## Instructions

### Node.js profiling

```
Profile a Node.js application for performance bottlenecks.

Symptom: [high CPU / high memory / slow response times / event loop lag]
Environment: [Node version, Express/Fastify/NestJS/other]
Deployment: [single process / cluster / container]
Load profile: [concurrent users, requests/second]

Step 1 — Identify the bottleneck type:

CPU-bound (high CPU, slow responses):
  node --prof app.js                    # Run with V8 profiler
  node --prof-process isolate-*.log     # Process the profile
  Look for: functions consuming >5% of CPU

Event loop lag (slow intermittently, not under CPU):
  Use: clinic.js or autocannon
  npx clinic doctor -- node app.js
  npx autocannon -c 100 -d 30 http://localhost:3000/api/endpoint
  Look for: blocking synchronous operations in async context

Memory leak (RSS grows over time, never drops):
  node --expose-gc app.js               # Enable manual GC
  Take heap snapshots at intervals:
  const v8 = require('v8')
  v8.writeHeapSnapshot()                # Call via endpoint
  Load in Chrome DevTools → Memory → compare snapshots
  Look for: retained objects that shouldn't be retained

Async bottleneck (slow I/O):
  Use: async_hooks to trace context propagation
  Or: OpenTelemetry auto-instrumentation (traces each await)

Step 2 — Fix by category:
- Synchronous CPU work in hot path → Worker threads or off-load to queue
- N+1 database queries → batch with DataLoader or join
- Unbounded caches → LRU cache with max size
- Large JSON serialisation → use fast-json-stringify
- Missing indexes → check query plan (EXPLAIN ANALYZE)

Produce: top 3 bottlenecks found + specific fix for each.
```

### Python profiling

```
Profile a Python application for performance issues.

Framework: [FastAPI / Django / Flask / Celery / script]
Symptom: [slow endpoint / high CPU / memory growth / slow task]

Step 1 — CPU profiling:

Quick profile (built-in):
  python -m cProfile -o profile.stats app.py
  python -m pstats profile.stats
  # Sort by cumulative time: sort cumulative → stats 20

Flame graph (better visualisation):
  pip install py-spy
  py-spy record -o profile.svg --pid [PID]
  # Or for a script: py-spy record -o profile.svg -- python script.py
  Open SVG in browser → widest bars are hotspots

Step 2 — Memory profiling:
  pip install memory-profiler
  @memory_profiler.profile
  def my_function():
      ...
  # Shows line-by-line memory usage

For leaks:
  pip install tracemalloc
  tracemalloc.start()
  # ... code ...
  snapshot = tracemalloc.take_snapshot()
  top_stats = snapshot.statistics('lineno')
  # Top allocations by line

Step 3 — Django/FastAPI specific:
  - Django: django-debug-toolbar → SQL panel → find N+1 queries
  - FastAPI: add middleware to log request timing per endpoint
  - Celery: use flower dashboard to spot slow tasks

Step 4 — Fix by category:
- Hot loop with pure Python → NumPy vectorise or Cython
- ORM N+1 → select_related / prefetch_related (Django) or joinedload (SQLAlchemy)
- Repeated computation → functools.lru_cache or Redis cache
- Blocking I/O in async → ensure await is used, not sync calls

Generate: cProfile report interpretation + top 3 fixes.
```

### Database query profiling

```
Profile and optimise slow database queries.

Database: [PostgreSQL / MySQL / MongoDB / SQLite]
ORM: [SQLAlchemy / Django ORM / Prisma / raw SQL]
Symptom: [slow endpoint / high DB CPU / query timeout]

Step 1 — Find slow queries:

PostgreSQL:
  -- Enable slow query log (pg_stat_statements):
  CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
  SELECT query, mean_exec_time, calls, total_exec_time
  FROM pg_stat_statements
  ORDER BY mean_exec_time DESC LIMIT 20;

MySQL:
  SET GLOBAL slow_query_log = 'ON';
  SET GLOBAL long_query_time = 1;  -- log queries > 1s
  SHOW GLOBAL STATUS LIKE 'Slow_queries';

Step 2 — Analyse with EXPLAIN:
  EXPLAIN ANALYZE SELECT ...;
  Look for:
  - "Seq Scan" on large tables → missing index
  - Nested Loop on large result sets → rewrite as hash join
  - Rows estimate wildly off → run ANALYZE to update statistics
  - "Filter" removing most rows → index on the filter column

Step 3 — N+1 detection:
  If running same query in a loop (ORM) → one query per row = N+1
  Fix: JOIN in single query or batch load
  SQLAlchemy: use .options(joinedload(Model.relation))
  Prisma: use include: { relation: true }
  Django: select_related() for FK, prefetch_related() for M2M

Step 4 — Index strategy:
  Single column: CREATE INDEX idx_name ON table(column);
  Composite: CREATE INDEX idx_name ON table(col1, col2);  -- order matters
  Partial: CREATE INDEX idx_name ON table(col) WHERE status = 'active';
  Check existing indexes: SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'X';

Analyse my specific query and return: query plan interpretation + index recommendation.
```

### Load testing and benchmarking

```
Set up a load test and establish a performance baseline.

Endpoint or flow to test: [URL or user journey]
Target: [X requests/second, or X concurrent users]
Acceptable p99 latency: [< X ms]
Tool preference: [k6 / autocannon / Artillery / Locust / wrk]

k6 script template:
  import http from 'k6/http';
  import { check, sleep } from 'k6';

  export let options = {
    stages: [
      { duration: '2m', target: 100 },   // Ramp up
      { duration: '5m', target: 100 },   // Sustained load
      { duration: '2m', target: 0 },     // Ramp down
    ],
    thresholds: {
      http_req_duration: ['p(99)<500'],  // 99% under 500ms
      http_req_failed: ['rate<0.01'],    // Error rate < 1%
    },
  };

  export default function () {
    let res = http.get('https://your-api.com/endpoint');
    check(res, { 'status was 200': (r) => r.status == 200 });
    sleep(1);
  }

Baseline metrics to capture before any optimisation:
□ p50, p95, p99, p999 latency
□ Requests/second at target concurrency
□ Error rate under load
□ CPU and memory at peak load
□ Database connection pool usage

After fixes: rerun same test and compare. Only ship if p99 improved by ≥ 20%.

Generate the k6 script for my endpoint with the correct options.
```

## Example

**User:** Our Node.js API endpoint `/api/reports/generate` takes 8-12 seconds under load (50 concurrent users). CPU spikes to 90%. What's wrong?

**Claude's diagnosis:**

8-12 seconds + 90% CPU at 50 concurrent users is a synchronous CPU-bound problem in the Node.js event loop — not I/O.

**Step 1 — Confirm with clinic.js:**
```bash
npm install -g clinic
clinic doctor -- node server.js
# Then run load: autocannon -c 50 -d 30 http://localhost:3000/api/reports/generate
```

**Likely culprits for "generate report" endpoints:**
1. **JSON.stringify on a large dataset** — blocks the event loop for hundreds of ms. Fix: stream the response or use `fast-json-stringify`.
2. **Synchronous PDF/Excel generation** in the request handler — pdfkit, exceljs can block for 2-10s per report. Fix: move to a background worker thread via `worker_threads`.
3. **N+1 ORM queries** — if the report aggregates data across related models, check your ORM for nested loops.

**Recommended fix:**
```javascript
// Move CPU work to worker thread
const { Worker } = require('worker_threads');
app.get('/api/reports/generate', async (req, res) => {
  const worker = new Worker('./workers/report-generator.js', {
    workerData: { reportParams: req.query }
  });
  worker.on('message', (result) => res.json(result));
});
```

This alone typically reduces p99 from 10s → 1-2s at 50 concurrent users.

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
