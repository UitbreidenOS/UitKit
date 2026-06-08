---
description: Profile a slow code path and identify the top bottlenecks with actionable fixes
argument-hint: "[file, function, endpoint, or operation description]"
---
Profile and diagnose performance for: $ARGUMENTS

Work from data. Do not speculate about bottlenecks before measuring.

1. **Define the performance target**
   - What is the current measured latency/throughput?
   - What is the acceptable target?
   - What is the representative workload (input size, concurrency, data shape)?

2. **Select the right profiling tool for the runtime**
   - Python: `cProfile` + `snakeviz`, `py-spy` for live attach, `memray` for allocation profiling
   - Node/JS: `--prof` + `node --prof-process`, Chrome DevTools CPU profile, `clinic.js`
   - Go: `pprof` (CPU, heap, goroutine, mutex, block profiles), `go test -bench -cpuprofile`
   - JVM: async-profiler, JFR, VisualVM
   - Rust: `cargo flamegraph`, `perf`, `samply`
   - C/C++: `perf`, `valgrind --tool=callgrind`, `gperftools`
   - Generic HTTP: `wrk`, `hey`, `k6` for load; trace spans for per-request breakdown

3. **Capture a profile under representative load**
   - Do not profile against toy inputs — use production-scale data or a faithful approximation
   - Warm the caches/JIT before capturing — measure steady state, not cold start, unless cold start is the problem
   - Capture at least 30 seconds of CPU profile to get statistically significant samples

4. **Read the profile — top-down**
   - Identify the top 3–5 functions by self-time (CPU cycles spent inside the function, not callees)
   - Identify the top callers of those hot functions — where is the hot path entered?
   - Look for surprises: serialization, regex compilation, lock contention, syscall frequency

5. **Categorize each bottleneck**
   - CPU-bound: algorithmic complexity, redundant computation, tight loops doing avoidable work
   - I/O-bound: N+1 queries, missing batch/pipeline, synchronous calls that could be async
   - Memory-bound: excessive allocation/GC pressure, large object churn, cache misses from poor data layout
   - Lock contention: threads serializing on a hot mutex — look for alternative data structures or sharding

6. **Propose targeted fixes** — one fix per bottleneck, ordered by expected impact:
   - Include estimated speedup where you can reason about it (e.g., "removes O(n) scan per request")
   - Prefer the simplest fix that achieves the target — avoid premature over-engineering
   - Flag any fix that changes observable behavior (caching, batching, async) for review

7. **Write a micro-benchmark** — for each proposed fix, write a benchmark that measures the
   specific operation before and after, so the improvement can be verified and won't regress.

Output: the profiling command to run, the top bottlenecks with file:line references,
and the proposed fixes in priority order. If you cannot profile without running the code, say so
and provide the profiling command the developer should run and report back.
