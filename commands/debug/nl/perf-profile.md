---
description: Een trage code path profileren en de grootste bottlenecks met bruikbare fixes identificeren
argument-hint: "[bestand, functie, endpoint, of operatiebeschrijving]"
---
Performance profileren en diagnosticeren voor: $ARGUMENTS

Werk met gegevens. Speculeer niet over bottlenecks voordat je hebt gemeten.

1. **Definieer het performancedoel**
   - Wat is de huidige gemeten latentie/doorvoer?
   - Wat is het acceptabele doel?
   - Wat is de representatieve werkbelasting (inputgrootte, concurrency, data shape)?

2. **Selecteer het juiste profiling tool voor de runtime**
   - Python: `cProfile` + `snakeviz`, `py-spy` voor live attach, `memray` voor allocation profiling
   - Node/JS: `--prof` + `node --prof-process`, Chrome DevTools CPU profile, `clinic.js`
   - Go: `pprof` (CPU, heap, goroutine, mutex, block profiles), `go test -bench -cpuprofile`
   - JVM: async-profiler, JFR, VisualVM
   - Rust: `cargo flamegraph`, `perf`, `samply`
   - C/C++: `perf`, `valgrind --tool=callgrind`, `gperftools`
   - Generieke HTTP: `wrk`, `hey`, `k6` voor load; trace spans voor per-request breakdown

3. **Capture een profile onder representatieve belasting**
   - Profileer niet tegen toy inputs — gebruik productie-schaal data of een getrouwe benadering
   - Warm de caches/JIT op voordat je capture — meet steady state, niet cold start, tenzij cold start het probleem is
   - Capture minstens 30 seconden CPU profile om statistisch significante samples te krijgen

4. **Lees de profile — top-down**
   - Identificeer de top 3–5 functies naar self-time (CPU-cycli besteed in de functie, niet in callees)
   - Identificeer de top callers van die hot functions — waar wordt de hot path ingevoerd?
   - Zoek naar verrassingen: serialisatie, regex compilatie, lock contention, syscall frequentie

5. **Categoriseer elke bottleneck**
   - CPU-bound: algoritmische complexiteit, redundante berekening, tight loops met vermijdbare werk
   - I/O-bound: N+1 queries, ontbrekende batch/pipeline, synchrone calls die async zouden kunnen zijn
   - Memory-bound: excessive allocation/GC pressure, grote object churn, cache misses door slechte data layout
   - Lock contention: threads serialiseren op een hot mutex — zoek naar alternatieve data structures of sharding

6. **Stel gerichte fixes voor** — één fix per bottleneck, gerangschikt naar verwachte impact:
   - Voeg geschatte speedup toe waar je het kunt beredeneren (bijv. "verwijdert O(n) scan per request")
   - Geef de voorkeur aan de eenvoudigste fix die het doel bereikt — vermijd premature over-engineering
   - Markeer elke fix die observable gedrag verandert (caching, batching, async) voor review

7. **Schrijf een micro-benchmark** — voor elke voorgestelde fix, schrijf een benchmark die de specifieke operatie voor en na meet, zodat de verbetering kan worden geverifieerd en niet zal regresseren.

Output: de profiling command om uit te voeren, de grootste bottlenecks met file:line referenties,
en de voorgestelde fixes in prioriteitvolgorde. Als je niet kunt profileren zonder de code uit te voeren, zeg dan en geef de profiling command die de developer zou moeten uitvoeren en rapporteer terug.
