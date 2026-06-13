---
name: performance-profiler
description: "Profilage de performance : identification des goulots, optimisations CPU/mémoire/disque, flamegraphs, benchmarking continu, analyse post-mortem"
---

# Compétence Profileur de Performance

## Quand l'activer
- Identifier les goulots d'étranglement de performance
- Optimiser CPU, mémoire, utilisation disque
- Analyser les flamegraphs et les traces
- Mettre en place le benchmarking continu
- Post-mortem de performance

## Quand NE PAS l'utiliser
- Problèmes de sécurité — utiliser les compétences de sécurité
- Problèmes d'infrastructure — utiliser les compétences d'infrastructure
- Problèmes de conception — utiliser les compétences d'architecture

## Instructions

```
Profileur de performance pour [service/application].

Langage : [Python / Go / Node.js / Java / Rust]
Problème : [latence haute / haute utilisation CPU / haute mémoire / lenteur disque]
Environnement : [dev / staging / production]
Outils : [py-spy / pprof / clinic / JProfiler / flamegraphs]

Processus de profilage :
1. Mesurer l'état actuel (baseline)
2. Isoler le goulot d'étranglement avec flamegraph
3. Identifier le code hotspot
4. Implémenter optimisation
5. Benchmarquer le nouveau résultat
6. Comparer baseline vs optimisé

Profilage CPU :
- py-spy pour Python, pprof pour Go, clinic pour Node.js
- Chercher les fonctions avec temps cumulé le plus haut

Profilage mémoire :
- Fuites mémoire, fragmentation
- Objets à longue durée de vie, allocations pendant opérations critiques

Benchmarking :
- Bench de performance avant/après
- Tests de charge progressifs
- SLO : p50, p95, p99 latency

Générer plan d'optimisation pour mon goulot spécifique.
```

---
