---
description: Profileer een trage code path en identificeer de belangrijkste knelpunten met praktische oplossingen
argument-hint: "[file, function, endpoint, or operation description]"
---
Profileer en diagnose prestaties voor: $ARGUMENTS

Werk vanuit data. Speculeer niet over knelpunten voordat je hebt gemeten.

1. **Definieer het prestatiedoel**
   - Wat is de huidige gemeten latentie/doorvoer?
   - Wat is het aanvaardbare doel?
   - Wat is de representatieve werkbelasting (invoergrootte, gelijktijdigheid, gegevensstructuur)?

2. **Selecteer het juiste profileringstool voor de runtime**
   - Python: `cProfile` + `snakeviz`, `py-spy` voor live attach, `memray` voor toewijzingsprofilering
   - Node/JS: `--prof` + `node --prof-process`, Chrome DevTools CPU profile, `clinic.js`
   - Go: `pprof` (CPU, heap, goroutine, mutex, block profiles), `go test -bench -cpuprofile`
   - JVM: async-profiler, JFR, VisualVM
   - Rust: `cargo flamegraph`, `perf`, `samply`
   - C/C++: `perf`, `valgrind --tool=callgrind`, `gperftools`
   - Generic HTTP: `wrk`, `hey`, `k6` voor lasten; trace spans voor per-request breakdown

3. **Leg een profiel vast onder representatieve belasting**
   - Profileer niet tegen speelgoedinvoer — gebruik productie-schaal gegevens of een getrouwe benadering
   - Verwarm de caches/JIT voordat u vastlegt — meet steady state, niet cold start, tenzij cold start het probleem is
   - Leg minstens 30 seconden CPU-profiel vast om statistisch significante steekproeven te krijgen

4. **Lees het profiel — top-down**
   - Identificeer de top 3–5 functies op basis van self-time (CPU-cycli besteed binnen de functie, niet oproepen)
   - Identificeer de top oproepers van die hot functies — waar wordt het hot path ingevoerd?
   - Zoek naar verrassingen: serialisatie, regex-compilatie, lock contention, syscall frequentie

5. **Categoriseer elk knelpunt**
   - CPU-bound: algoritmische complexiteit, redundante berekening, strakke lussen die vermijdbaar werk doen
   - I/O-bound: N+1 queries, ontbrekende batch/pipeline, synchrone oproepen die async zouden kunnen zijn
   - Memory-bound: buitensporige toewijzing/GC-druk, grote object churn, cache misses door slechte gegevenslayout
   - Lock contention: threads serialiseren op een hot mutex — zoek naar alternatieve gegevensstructuren of sharding

6. **Stel gerichte fixes voor** — één fix per knelpunt, geordend op verwachte impact:
   - Inclusief geschatte speedup waar je er redelijkerwijze over kunt redeneren (bijv. "verwijdert O(n) scan per request")
   - Geef de voorkeur aan de eenvoudigste fix die het doel bereikt — vermijd voortijdige over-engineering
   - Markeer elke fix die waarneembaar gedrag verandert (caching, batching, async) ter controle

7. **Schrijf een micro-benchmark** — voor elke voorgestelde fix, schrijf je een benchmark die de
   specifieke bewerking meet voor en na, zodat de verbetering kan worden geverifieerd en niet terugvalt.

Output: de profileringscommando om uit te voeren, de belangrijkste knelpunten met file:line verwijzingen,
en de voorgestelde fixes in volgorde van prioriteit. Als je niet kunt profileren zonder de code uit te voeren, zeg dat
en geef de profileringscommando die de ontwikkelaar moet uitvoeren en rapporteren.
