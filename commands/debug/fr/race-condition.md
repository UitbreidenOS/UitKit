---
description: Identifier et corriger une condition de course dans du code concurrent ou asynchrone
argument-hint: "[file, function, or symptom description]"
---
Analyzer les conditions de course : $ARGUMENTS

Les conditions de course sont des bugs dépendant de l'ordre d'exécution. Traitez cela comme un problème de preuve, pas une supposition.

1. **Cartographier l'état partagé**
   - Énumérez chaque variable, structure de données ou ressource accédée par plus d'une goroutine/thread/chaîne asynchrone dans le code affecté
   - Pour chacun : identifiez tous les sites de lecture et tous les sites d'écriture
   - Notez si les accès sont gardés (lock, atomic, channel, mutex, semaphore) ou non gardés

2. **Identifier le type de risque**
   - Race lecture-écriture : un écrivain, un ou plusieurs lecteurs concurrents, pas de synchronisation
   - Race écriture-écriture : deux écrivains, pas de synchronisation
   - Check-then-act : condition vérifiée, puis action effectuée, avec une fenêtre entre les deux (TOCTOU classique)
   - Problème ABA : valeur vérifiée, modifiée en externe, remise à l'état initial — la vérification semble réussir mais l'état est erroné
   - Race d'initialisation : motif d'initialisation tardive sans garde once-guard

3. **Construire l'entrelacement** — écrivez l'entrelacement spécifique de thread/tâche qui cause le bug :
   ```
   Thread A                    Thread B
   lit x == 0
                               écrit x = 1
   écrit x = 0 (lecture obsolète)
   ```
   Si vous ne pouvez pas construire un entrelacement concret, vous n'avez pas trouvé la race.

4. **Vérifier les pièges spécifiques au langage**
   - JS/TS : les lacunes asynchrones entre les points `await` sont des fenêtres d'entrelacement — tout état partagé muté entre les await est suspect
   - Go : les lectures/écritures de map ne sont pas thread-safe ; les closures de goroutine capturant des variables de boucle
   - Python : le GIL ne protège pas les opérations composées ; `asyncio` lacunes entre les points `await`
   - Java/Kotlin : problèmes de visibilité (champs non-volatile), antipattern double-checked locking

5. **Proposer la correction** — adaptez la correction au risque :
   - Lecture-écriture / écriture-écriture : mutex, RWMutex, atomic CAS, ou channel
   - Check-then-act : déplacez la vérification à l'intérieur du lock, ou utilisez atomic compare-and-swap
   - Initialisation : `sync.Once`, `std::call_once`, initialisation au niveau du module, ou lock autour d'une initialisation tardive
   - Lacunes asynchrones : conservez tout l'état partagé dans des variables locales avant le premier await, ou utilisez des snapshots immuables

6. **Écrire un test de stress** — un test qui exécute le chemin concurrent sous haute contention (par exemple, 100 goroutines, boucle serrée) avec `-race` / thread sanitizer / Helgrind activé. Confirmez qu'il réussit correctement.

Résultat : la carte d'état partagée, l'entrelacement mauvais concret, la correction avec des édits file:line,
et le test. Ne suggérez pas « ajouter un délai » ou « réessayer » comme corrections — celles-ci masquent les races.
