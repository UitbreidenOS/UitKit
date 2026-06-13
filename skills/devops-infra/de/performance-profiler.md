---
name: performance-profiler
description: "Performance-Profiling: Engpässe identifizieren, CPU/Memory/Disk-Optimierung, Flamegraphs, kontinuierliches Benchmarking"
---

# Fähigkeit Performance Profiler

## Wann aktivieren
- Identifizieren von Performance-Engpässen
- CPU, Memory, Disk optimieren
- Flamegraphs und Traces analysieren
- Kontinuierliches Benchmarking einrichten
- Performance-Postmortem

## Quand NE PAS l'utiliser
- Sicherheitsprobleme — use security skills
- Infrastruktur-Probleme — use infrastructure skills
- Design-Probleme — use architecture skills

## Anweisungen

```
Performance-Profiler für [Service/Application].

Sprache: [Python / Go / Node.js / Java / Rust]
Problem: [hohe Latenz / high CPU / high Memory / Disk-Langsamkeit]
Umgebung: [dev / staging / production]
Tools: [py-spy / pprof / clinic / JProfiler / flamegraphs]

Profiling-Prozess:
1. Baseline messen
2. Engpass mit Flamegraph isolieren
3. Hotspot-Code identifizieren
4. Optimierung implementieren
5. Neues Ergebnis benchmarken
6. Baseline vs optimiert vergleichen

CPU-Profiling: py-spy (Python), pprof (Go), clinic (Node.js)
Memory-Profiling: Leckagen, Fragmentation, lange Lebenszyklen
Benchmarking: Before/After, progressive load tests, SLO (p50/p95/p99)

Optimierungsplan für meinen spezifischen Engpass generieren.
```

---
