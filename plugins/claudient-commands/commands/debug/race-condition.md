---
description: Identify and fix a race condition in concurrent or async code
argument-hint: "[file, function, or symptom description]"
---
Analyze for race conditions: $ARGUMENTS

Race conditions are ordering-dependent bugs. Treat this as a proof problem, not a guess.

1. **Map the shared state**
   - List every variable, data structure, or resource accessed by more than one goroutine/thread/async chain in the affected code
   - For each: identify all read sites and all write sites
   - Note whether accesses are guarded (lock, atomic, channel, mutex, semaphore) or unguarded

2. **Identify the hazard type**
   - Read-write race: one writer, one or more concurrent readers, no synchronization
   - Write-write race: two writers, no synchronization
   - Check-then-act: condition checked, then action taken, with a window between them (classic TOCTOU)
   - ABA problem: value checked, changed externally, changed back — check appears to pass but state is wrong
   - Initialization race: lazy-init pattern without a once-guard

3. **Construct the interleaving** — write out the specific thread/task interleaving that causes the bug:
   ```
   Thread A                    Thread B
   reads x == 0
                               writes x = 1
   writes x = 0 (stale read)
   ```
   If you cannot construct a concrete interleaving, you have not found the race.

4. **Check for language-specific traps**
   - JS/TS: async gaps between `await` points are interleaving windows — any shared state mutated across awaits is suspect
   - Go: map reads/writes are not concurrent-safe; goroutine closures capturing loop variables
   - Python: GIL does not protect compound operations; `asyncio` gaps between `await` points
   - Java/Kotlin: visibility issues (non-volatile fields), double-checked locking antipattern

5. **Propose the fix** — match the fix to the hazard:
   - Read-write / write-write: mutex, RWMutex, atomic CAS, or channel
   - Check-then-act: move the check inside the lock, or use atomic compare-and-swap
   - Initialization: `sync.Once`, `std::call_once`, module-level init, or a lock around lazy init
   - Async gaps: hold all shared state in local variables before the first await, or use immutable snapshots

6. **Write a stress test** — a test that runs the concurrent path under high contention (e.g., 100 goroutines,
   tight loop) with `-race` / thread sanitizer / Helgrind enabled. Confirm it passes cleanly.

Output: the shared state map, the concrete bad interleaving, the fix with file:line edits,
and the test. Do not suggest "add a delay" or "retry" as fixes — those mask races.
