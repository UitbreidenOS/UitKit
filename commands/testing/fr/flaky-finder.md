---
description: Identifier et corriger les sources d'instabilité dans les tests existants
argument-hint: "[fichier de test ou répertoire]"
---
Analyser les tests pour détecter l'instabilité dans : $ARGUMENTS

Étapes :

1. Lire le fichier cible ou tous les fichiers de test sous le répertoire cible.

2. Scanner les motifs d'instabilité suivants et noter chaque occurrence avec le chemin du fichier et le numéro de ligne :

   **Problèmes de synchronisation**
   - Appels `sleep`/`wait` fixes au lieu d'attentes basées sur les conditions
   - Assertions immédiatement après les opérations asynchrones sans attendre
   - Délais d'attente codés en dur qui peuvent différer selon les environnements CI et locaux

   **Dépendance de l'ordre**
   - Tests qui modifient l'état partagé au niveau du module ou global sans nettoyage
   - Configuration `beforeAll` que les tests ultérieurs dépendent mais ne déclarent pas
   - Fichiers de test qui supposent un ordre d'exécution au sein d'une suite

   **Non-déterminisme**
   - Utilisation de `Math.random()`, `Date.now()`, ou `new Date()` dans les assertions sans mocking
   - Appels réseau vers des points de terminaison réels (pas d'intercepteurs/mocks)
   - Lectures du système de fichiers sans fixtures — chemins qui diffèrent selon l'environnement

   **Contention de ressources**
   - Tests parallèles écrivant dans les mêmes lignes de base de données ou fichiers
   - Conflits de port dans les tests de démarrage de serveur
   - Rollbacks de transaction ou teardown manquants

   **Fragilité des sélecteurs (UI/E2E)**
   - Sélecteurs de classe CSS qui codent le style visuel et non la sémantique
   - Expressions XPath dépendantes de la profondeur du DOM
   - Correspondances de contenu textuel qui échouent avec les changements d'i18n ou de copie

3. Pour chaque trouvaille, fournir :
   - Catégorie de motif (ci-dessus)
   - Localisation exacte (fichier:ligne)
   - Cause profonde en une phrase
   - Un correctif concret — afficher l'extrait de code avant/après

4. Après catalogage, appliquer les correctifs à tous les problèmes qui sont sans ambiguïté sûrs à modifier (par exemple, remplacer `sleep(500)` par une attente correcte, ajouter un nettoyage `afterEach` manquant).

5. Pour les correctifs nécessitant des décisions de conception (par exemple, introduire une base de données de test, ajouter un serveur simulé), décrivez l'approche mais ne l'implémentez pas sans confirmation.

6. Terminer avec un décompte : X trouvailles, Y auto-corrigées, Z nécessitent une action manuelle.
