---
name: performance-profiler
description: "Profiling de rendimiento: identifique cuellos de botella, optimización CPU/Memory/Disk, flamegraphs, benchmarking continuo"
---

# Habilidad Performance Profiler

## Cuándo activar
- Identifique cuellos de botella de rendimiento
- Optimice CPU, Memory, Disk
- Analice flamegraphs y traces
- Establezca benchmarking continuo
- Post-mortem de rendimiento

## Cuándo NO usar
- Problemas de seguridad — use security skills
- Problemas de infraestructura — use infrastructure skills
- Problemas de diseño — use architecture skills

## Instrucciones

```
Performance profiler para [servicio/aplicación].

Lenguaje: [Python / Go / Node.js / Java / Rust]
Problema: [alta latencia / alto CPU / alta Memory / Disk lento]
Entorno: [dev / staging / producción]
Herramientas: [py-spy / pprof / clinic / JProfiler / flamegraphs]

Proceso de profiling:
1. Medir baseline
2. Aislar cuello de botella con flamegraph
3. Identificar código hotspot
4. Implementar optimización
5. Benchmarquear nuevo resultado
6. Comparar baseline vs optimizado

CPU-profiling: py-spy (Python), pprof (Go), clinic (Node.js)
Memory-profiling: Fugas, fragmentación, ciclos de vida largos
Benchmarking: Before/After, progressive load tests, SLO (p50/p95/p99)

Genere plan de optimización para mi cuello de botella específico.
```

---
