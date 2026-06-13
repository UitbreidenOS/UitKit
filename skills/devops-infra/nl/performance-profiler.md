---
name: performance-profiler
description: "Performance-profiling: identificeer knelpunten, CPU/Memory/Disk optimaliseren, flamegraphs, continu benchmarking"
---

# Vaardigheid Performance Profiler

## Wanneer activeren
- Identificeer performance-knelpunten
- CPU, Memory, Disk optimaliseren
- Flamegraphs en traces analyseren
- Continu benchmarking instellen
- Performance-postmortem

## Wanneer NIET gebruiken
- Beveiligingsproblemen — use security skills
- Infrastructuurproblemen — use infrastructure skills
- Ontwerp-problemen — use architecture skills

## Instructies

```
Performance-profiler voor [service/applicatie].

Taal: [Python / Go / Node.js / Java / Rust]
Probleem: [hoge latency / high CPU / high Memory / Disk-traagheid]
Omgeving: [dev / staging / production]
Tools: [py-spy / pprof / clinic / JProfiler / flamegraphs]

Profiling-proces:
1. Baseline meten
2. Knelpunt met flamegraph isoleren
3. Hotspot-code identificeren
4. Optimisering implementeren
5. Nieuw resultaat benchmarken
6. Baseline vs geoptimaliseerd vergelijken

CPU-profiling: py-spy (Python), pprof (Go), clinic (Node.js)
Memory-profiling: Lekken, fragmentatie, lange levenscycli
Benchmarking: Before/After, progressive load tests, SLO (p50/p95/p99)

Optimalisatieplan voor mijn speci fiek knelpunt genereren.
```

---
