---
description: Profiler un chemin de code lent et identifier les principaux goulots avec des correctifs actionnables
argument-hint: "[file, function, endpoint, or operation description]"
---
Profiler et diagnostiquer les performances pour : $ARGUMENTS

Travaillez à partir de données. Ne spéculez pas sur les goulots avant de mesurer.

1. **Définir la cible de performance**
   - Quelle est la latence/débit actuel mesuré ?
   - Quel est l'objectif acceptable ?
   - Quel est la charge de travail représentative (taille d'entrée, concurrence, forme des données) ?

2. **Sélectionner le bon outil de profilage pour le runtime**
   - Python: `cProfile` + `snakeviz`, `py-spy` pour attach en direct, `memray` pour le profilage d'allocation
   - Node/JS: `--prof` + `node --prof-process`, Chrome DevTools profil CPU, `clinic.js`
   - Go: `pprof` (CPU, heap, goroutine, mutex, block profiles), `go test -bench -cpuprofile`
   - JVM: async-profiler, JFR, VisualVM
   - Rust: `cargo flamegraph`, `perf`, `samply`
   - C/C++: `perf`, `valgrind --tool=callgrind`, `gperftools`
   - HTTP générique: `wrk`, `hey`, `k6` pour la charge; trace spans pour la ventilation par requête

3. **Capturer un profil sous charge représentative**
   - Ne profilez pas avec des données fictives — utilisez des données à l'échelle de production ou une approximation fidèle
   - Réchauffez les caches/JIT avant de capturer — mesurez l'état stable, pas le démarrage à froid, sauf si le démarrage à froid est le problème
   - Capturez au moins 30 secondes de profil CPU pour obtenir des échantillons statistiquement significatifs

4. **Lire le profil — de haut en bas**
   - Identifier les 3–5 fonctions principales par self-time (cycles CPU dépensés dans la fonction, pas les callees)
   - Identifier les appelants principaux de ces fonctions chaudes — où le hot path est-il entré ?
   - Cherchez les surprises : sérialisation, compilation regex, contention de verrous, fréquence des appels système

5. **Catégoriser chaque goulot**
   - CPU-bound: complexité algorithmique, calculs redondants, boucles serrées faisant du travail évitable
   - I/O-bound: requêtes N+1, batch/pipeline manquant, appels synchrones qui pourraient être asynchrones
   - Memory-bound: allocation excessive/pression GC, churn d'objets volumineux, cache misses dues à une mauvaise disposition des données
   - Lock contention: threads sérialisant sur un mutex chaud — cherchez des structures de données alternatives ou du sharding

6. **Proposer des correctifs ciblés** — un correctif par goulot, ordonnés par impact attendu :
   - Incluez l'accélération estimée quand vous pouvez la raisonner (par exemple, « supprime le scan O(n) par requête »)
   - Préférez le correctif le plus simple qui atteint l'objectif — évitez l'over-engineering prématuré
   - Signalez tout correctif qui change le comportement observable (caching, batching, async) pour révision

7. **Écrire un micro-benchmark** — pour chaque correctif proposé, écrivez un benchmark qui mesure l'opération
   spécifique avant et après, afin que l'amélioration puisse être vérifiée et ne régressera pas.

Output: la commande de profilage à exécuter, les principaux goulots avec références file:line,
et les correctifs proposés dans l'ordre de priorité. Si vous ne pouvez pas profiler sans exécuter le code, dites-le
et fournissez la commande de profilage que le développeur doit exécuter et signaler.
