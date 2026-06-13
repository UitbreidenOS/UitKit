---
description: Profiler un chemin de code lent et identifier les principaux goulots d'étranglement avec des corrections exploitables
argument-hint: "[fichier, fonction, endpoint, ou description d'opération]"
---
Profiler et diagnostiquer les performances pour : $ARGUMENTS

Travaillez à partir des données. Ne spéculez pas sur les goulots d'étranglement avant de mesurer.

1. **Définir l'objectif de performance**
   - Quelle est la latence/débit actuellement mesurés ?
   - Quel est l'objectif acceptable ?
   - Quelle est la charge de travail représentative (taille d'entrée, concurrence, forme des données) ?

2. **Sélectionner le bon outil de profilage pour le runtime**
   - Python : `cProfile` + `snakeviz`, `py-spy` pour l'attachement en direct, `memray` pour le profilage des allocations
   - Node/JS : `--prof` + `node --prof-process`, Chrome DevTools CPU profile, `clinic.js`
   - Go : `pprof` (profils CPU, heap, goroutine, mutex, block), `go test -bench -cpuprofile`
   - JVM : async-profiler, JFR, VisualVM
   - Rust : `cargo flamegraph`, `perf`, `samply`
   - C/C++ : `perf`, `valgrind --tool=callgrind`, `gperftools`
   - HTTP générique : `wrk`, `hey`, `k6` pour la charge ; trace spans pour décomposition par requête

3. **Capturer un profil sous charge représentative**
   - Ne profilez pas sur des entrées jouets — utilisez des données à l'échelle de production ou une approximation fidèle
   - Réchauffez les caches/JIT avant la capture — mesurez l'état stable, pas le démarrage à froid, à moins que ce ne soit le problème
   - Capturez au moins 30 secondes de profil CPU pour obtenir des échantillons statistiquement significatifs

4. **Lire le profil — de haut en bas**
   - Identifiez les 3–5 fonctions principales selon le self-time (cycles CPU dépensés à l'intérieur de la fonction, pas des callees)
   - Identifiez les principaux appelants de ces fonctions hot — où le chemin hot est-il entré ?
   - Cherchez des surprises : sérialisation, compilation regex, contention de verrous, fréquence d'appels système

5. **Catégoriser chaque goulot d'étranglement**
   - CPU-bound : complexité algorithmique, calcul redondant, boucles serrées faisant un travail évitable
   - I/O-bound : requêtes N+1, batch/pipeline manquant, appels synchrones qui pourraient être asynchrones
   - Memory-bound : allocation excessive/pression GC, churn d'objets volumineux, cache misses dues à la mauvaise disposition des données
   - Lock contention : threads sérialisant sur un hot mutex — cherchez des structures de données alternatives ou du sharding

6. **Proposer des corrections ciblées** — une correction par goulot d'étranglement, ordonnées par impact attendu :
   - Incluez l'accélération estimée où vous pouvez la raisonner (ex. : « supprime le scan O(n) par requête »)
   - Préférez la correction la plus simple qui atteint l'objectif — évitez l'sur-ingénierie prématurée
   - Signalez toute correction qui change le comportement observable (caching, batching, async) pour révision

7. **Écrire un micro-benchmark** — pour chaque correction proposée, écrivez un benchmark qui mesure l'opération
   spécifique avant et après, afin que l'amélioration puisse être vérifiée et ne régresse pas.

Output : la commande de profilage à exécuter, les principaux goulots d'étranglement avec références file:line,
et les corrections proposées par ordre de priorité. Si vous ne pouvez pas profiler sans exécuter le code, dites-le
et fournissez la commande de profilage que le développeur doit exécuter et faire un rapport.
