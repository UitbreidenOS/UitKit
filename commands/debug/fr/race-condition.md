---
description: Identifier et corriger une condition de course dans du code concurrent ou asynchrone
argument-hint: "[fichier, fonction, ou description du symptôme]"
---
Analyser les conditions de course : $ARGUMENTS

Les conditions de course sont des bugs dépendant de l'ordre d'exécution. Traitez cela comme un problème de preuve, pas une supposition.

1. **Cartographier l'état partagé**
   - Lister chaque variable, structure de données, ou ressource accédée par plus d'une goroutine/thread/chaîne asynchrone dans le code affecté
   - Pour chacun : identifier tous les sites de lecture et tous les sites d'écriture
   - Noter si les accès sont gardés (verrou, atomic, canal, mutex, sémaphore) ou non gardés

2. **Identifier le type de risque**
   - Course lecture-écriture : un écrivain, un ou plusieurs lecteurs concurrents, pas de synchronisation
   - Course écriture-écriture : deux écrivains, pas de synchronisation
   - Vérifier-puis-agir : condition vérifiée, puis action exécutée, avec une fenêtre entre les deux (TOCTOU classique)
   - Problème ABA : valeur vérifiée, modifiée de l'extérieur, modifiée à nouveau — la vérification semble réussir mais l'état est incorrect
   - Course d'initialisation : motif d'initialisation paresseuse sans garde once

3. **Construire l'entrelacement** — écrire l'entrelacement spécifique thread/tâche qui cause le bug :
   ```
   Thread A                    Thread B
   lit x == 0
                               écrit x = 1
   écrit x = 0 (lecture obsolète)
   ```
   Si vous ne pouvez pas construire un entrelacement concret, vous n'avez pas trouvé la course.

4. **Vérifier les pièges spécifiques au langage**
   - JS/TS : les gaps asynchrones entre les points `await` sont des fenêtres d'entrelacement — tout état partagé muté à travers les awaits est suspect
   - Go : les lectures/écritures sur les maps ne sont pas thread-safe ; les closures de goroutines capturant des variables de boucle
   - Python : le GIL ne protège pas les opérations composées ; les gaps `asyncio` entre les points `await`
   - Java/Kotlin : problèmes de visibilité (champs non-volatile), antimodèle double-checked locking

5. **Proposer la correction** — adapter la correction au risque :
   - Lecture-écriture / écriture-écriture : mutex, RWMutex, atomic CAS, ou canal
   - Vérifier-puis-agir : déplacer la vérification à l'intérieur du verrou, ou utiliser atomic compare-and-swap
   - Initialisation : `sync.Once`, `std::call_once`, initialisation au niveau du module, ou un verrou autour de l'initialisation paresseuse
   - Gaps asynchrones : conserver tout l'état partagé dans des variables locales avant le premier await, ou utiliser des snapshots immuables

6. **Écrire un test de stress** — un test qui exécute le chemin concurrent sous forte contention (par exemple, 100 goroutines, boucle serrée) avec `-race` / thread sanitizer / Helgrind activé. Confirmer qu'il passe proprement.

Sortie : la carte de l'état partagé, le mauvais entrelacement concret, la correction avec des édits fichier:ligne, et le test. Ne suggérez pas « ajouter un délai » ou « réessayer » comme corrections — ceux-ci masquent les courses.
