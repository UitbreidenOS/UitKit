---
description: Profilen Sie einen langsamen Code-Pfad und identifizieren Sie die Top-Bottlenecks mit umsetzbaren Fixes
argument-hint: "[file, function, endpoint, or operation description]"
---
Profilen und Diagnose für Leistung: $ARGUMENTS

Arbeiten Sie mit Daten. Spekulieren Sie nicht über Bottlenecks, bevor Sie messen.

1. **Definieren Sie das Performance-Ziel**
   - Was ist die aktuelle gemessene Latenz/Durchsatz?
   - Was ist das akzeptable Ziel?
   - Was ist die repräsentative Arbeitslast (Eingabegröße, Gleichzeitigkeit, Datenform)?

2. **Wählen Sie das richtige Profiling-Tool für die Laufzeit**
   - Python: `cProfile` + `snakeviz`, `py-spy` für Live-Attach, `memray` für Allocation-Profiling
   - Node/JS: `--prof` + `node --prof-process`, Chrome DevTools CPU-Profil, `clinic.js`
   - Go: `pprof` (CPU, Heap, Goroutine, Mutex, Block-Profile), `go test -bench -cpuprofile`
   - JVM: async-profiler, JFR, VisualVM
   - Rust: `cargo flamegraph`, `perf`, `samply`
   - C/C++: `perf`, `valgrind --tool=callgrind`, `gperftools`
   - Generisches HTTP: `wrk`, `hey`, `k6` für Last; Trace-Spans für Aufschlüsselung pro Anfrage

3. **Erfassen Sie ein Profil unter repräsentativer Last**
   - Profiling nicht gegen Spielzeugeingaben durchführen — verwenden Sie Produktionsskala-Daten oder eine treue Annäherung
   - Wärmen Sie die Caches/JIT vor der Erfassung auf — messen Sie Steady State, nicht Cold Start, es sei denn, Cold Start ist das Problem
   - Erfassen Sie mindestens 30 Sekunden CPU-Profil, um statistisch signifikante Samples zu erhalten

4. **Lesen Sie das Profil — von oben nach unten**
   - Identifizieren Sie die Top 3–5 Funktionen nach Self-Time (CPU-Zyklen, die in der Funktion verbracht werden, nicht in Callees)
   - Identifizieren Sie die Top-Aufrufer dieser heißen Funktionen — wo wird der Hot-Path betreten?
   - Suchen Sie nach Überraschungen: Serialisierung, Regex-Kompilierung, Lock-Contention, Syscall-Häufigkeit

5. **Kategorisieren Sie jeden Bottleneck**
   - CPU-gebunden: algorithmische Komplexität, redundante Berechnung, enge Schleifen mit vermeidbarer Arbeit
   - I/O-gebunden: N+1-Anfragen, fehlende Batch/Pipeline, synchrone Aufrufe, die asynchron sein könnten
   - Speicher-gebunden: excessive Allokation/GC-Druck, großes Objekt-Churn, Cache-Misses durch schlechte Datenlayout
   - Lock-Contention: Threads, die auf einen heißen Mutex serialisieren — suchen Sie nach alternativen Datenstrukturen oder Sharding

6. **Schlagen Sie gezielt Fixes vor** — ein Fix pro Bottleneck, in Prioritätsreihenfolge nach erwartetem Impact:
   - Fügen Sie geschätzte Speedups ein, wenn Sie dies begründen können (z.B. „entfernt O(n)-Scan pro Anfrage")
   - Bevorzugen Sie den einfachsten Fix, der das Ziel erreicht — vermeiden Sie vorzeitige Über-Engineering
   - Markieren Sie jeden Fix, der Observable Behavior ändert (Caching, Batching, Async) zur Überprüfung

7. **Schreiben Sie einen Micro-Benchmark** — für jeden vorgeschlagenen Fix einen Benchmark schreiben, der die
   spezifische Operation vor und nach misst, damit die Verbesserung überprüft werden kann und nicht rückgängig wird.

Ausgabe: der auszuführende Profilingbefehl, die Top-Bottlenecks mit file:line-Referenzen,
und die vorgeschlagenen Fixes in Prioritätsreihenfolge. Wenn Sie nicht profilen können, ohne den Code auszuführen, sagen Sie es
und geben Sie den Profilingbefehl an, den der Entwickler ausführen und berichten sollte.
