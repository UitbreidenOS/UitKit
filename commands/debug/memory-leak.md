---
description: Diagnose and locate a memory leak given a symptoms description or code path
argument-hint: "[symptom description, file, or function name]"
---
Investigate a memory leak based on: $ARGUMENTS

Work through this systematically. Do not guess — trace allocation paths.

1. **Establish the leak signature**
   - Is heap usage growing unboundedly, or is it a one-time spike that never frees?
   - Is the leak process-wide or isolated to a subsystem (e.g., a request handler, a worker thread)?
   - Note the language/runtime — GC languages (JS, Python, Go, JVM) leak differently than manual-memory languages (C, C++, Rust unsafe).

2. **Identify candidate sites** — scan the code path in $ARGUMENTS for:
   - Long-lived collections (caches, registries, event listener maps) that grow without eviction
   - Closures or lambdas capturing large objects that outlive their useful scope
   - Circular references that defeat reference-counting GCs (Python, Swift, ObjC)
   - Finalizers or destructors that are never called (resource handles, file descriptors, sockets)
   - `static` or module-level state accumulated across requests/calls
   - Buffers or streams allocated but never closed/drained

3. **Instrument for verification** — before claiming it's fixed:
   - Add a heap snapshot or allocation counter at the suspected site
   - Write a loop that exercises the suspect path N times and assert heap growth is bounded
   - In GC languages, force a collection before measuring to avoid false positives

4. **Pinpoint the retaining reference** — follow the reference chain from the leaked object back to a GC root:
   - What holds a reference to the leaked object?
   - Is it intentional (cache) or unintentional (forgotten listener, stale closure)?

5. **Propose the fix** — once you have the retaining reference:
   - Bounded cache with LRU/TTL eviction
   - Explicit deregister/cleanup call in a finally/defer/destructor
   - WeakRef or WeakMap where strong ownership is unneeded
   - Scope reduction so the object is freed at end of block

6. **Write a regression test** — a test that allocates/frees N times and asserts peak RSS or
   object count stays flat. Flaky leak tests are worse than none; make it deterministic.

Output: the suspected leak site(s) with file:line references, the retaining reference chain,
and the proposed fix. If you cannot confirm without running the code, say so explicitly.
