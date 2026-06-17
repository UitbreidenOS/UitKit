# Performance Analyzer

## When to activate

- User reports slow load times, memory bloat, or high CPU usage in frontend or backend
- Profiling data (flame graphs, heap snapshots, Chrome DevTools traces) is available for analysis
- Need to identify bottlenecks before optimization work begins
- Comparing performance metrics across revisions or deployments
- Investigating N+1 queries, excessive re-renders, or memory leaks

## When NOT to use

- Premature optimization without profiling data — gather metrics first
- General code review or functionality fixes — use code-review skill instead
- Architectural redesigns that don't have performance as the primary driver
- Performance estimation for speculative/unbuilt features — focus on measured behavior only

## Instructions

### Core approach

1. **Collect baseline metrics** — Request or generate profiling data:
   - Browser: Chrome DevTools Performance tab, Lighthouse, WebPageTest
   - Node.js backend: node --prof, clinic.js, autocannon for load testing
   - Database: query EXPLAIN plans, slow query logs, index usage stats
   - Runtime: memory snapshots, CPU profiles, GC logs

2. **Identify hot paths** — Locate the 20% of code causing 80% of the cost:
   - Look at call stacks in flame graphs — stack height = overhead, width = duration
   - Check sampling profilers for functions dominating CPU time
   - Scan slow query logs for queries running repeatedly or with poor selectivity
   - Use DevTools Network tab to identify large/slow assets and cascading requests

3. **Root cause analysis** — For each bottleneck, determine the cause:
   - **Algorithmic**: O(n²) loop, bad sorting, inefficient tree traversal
   - **I/O bound**: blocking database queries, network waterfalls, sync file reads
   - **Memory pressure**: memory leaks, unnecessary object retention, oversized caches
   - **Concurrency**: thread pool exhaustion, lock contention, async bottlenecks
   - **Resource waste**: unused CSS/JS, oversized images, redundant computations

4. **Recommend specific fixes** — Prioritize by impact and effort:
   - For queries: add indexes, reduce result sets, use query plans
   - For rendering: batch updates, memoize expensive computations, virtualize lists
   - For assets: code-split, lazy load, minify/compress, use CDN
   - For algorithms: use appropriate data structures, cache results, parallelize
   - For I/O: connection pooling, request batching, concurrent operations

5. **Validate improvements** — Re-measure after each fix:
   - Use same profiling tool and conditions as baseline
   - Track metrics: response time, throughput, memory peak, CPU usage
   - Calculate improvement: (old - new) / old * 100%
   - Watch for regressions in other metrics (e.g., reducing latency via caching increases memory)

### Anti-patterns to avoid

- Focusing on micro-optimizations without profiling evidence
- Optimizing for the wrong metric (e.g., chasing lowest latency when throughput matters more)
- Recommending algorithmic changes without understanding current bottleneck
- Ignoring trade-offs (speed vs. memory, consistency vs. scalability)
- Measuring without controlling variables (network conditions, cache state, load level)

## Example

**Scenario**: User reports a Next.js page takes 4.5 seconds to load. They provide a Lighthouse report showing poor CLS and LCP.

**Analysis workflow**:

1. **Review Lighthouse trace**: Identify that main thread is blocked for 2.8s on JavaScript execution, images load sequentially.

2. **Inspect Performance tab flame graph**: Discover 1.2s in `getStaticProps` data fetch (N+1 queries for product variants), 0.9s in JSON parsing on client, 0.7s in component render.

3. **Database query analysis**: Run EXPLAIN on the variant query — full table scan, no index on product_id. Adding composite index (product_id, sku) reduces query from 180ms to 12ms.

4. **Bundle analysis**: Use webpack-bundle-analyzer — discover 340KB of unused icon library included in main bundle. Tree-shake unused icons, reduces JS by 120KB.

5. **Image optimization**: Replace JPEG product images with WebP, lazy-load below-fold images, reduce LCP image payload from 850KB to 220KB.

6. **Validation**: Re-run Lighthouse after changes:
   - LCP: 4.5s → 1.2s (73% improvement)
   - FID: 180ms → 45ms (75% improvement)
   - CLS: 0.12 → 0.03 (75% improvement)

**Output**: Prioritized list of fixes with measured impact per change, implementation guidance for each fix, metrics to monitor going forward.
