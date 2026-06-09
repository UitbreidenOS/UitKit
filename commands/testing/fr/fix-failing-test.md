---
description: Diagnostiquer et corriger un test défaillant, en identifiant la cause racine avant de corriger
argument-hint: "[test-name-or-file]"
---
Corriger le test défaillant : $ARGUMENTS

N'apportez aucune modification au test ou à l'implémentation tant que vous n'avez pas diagnostiqué la cause racine.

Étape 1 — Exécutez le test défaillant en isolation et capturez la sortie d'erreur complète, y compris la trace de pile.

Étape 2 — Classifiez l'échec :
- Assertion non vérifiée : le comportement du code a changé ou l'assertion a été incorrecte dès le départ
- Problème de configuration/nettoyage : état partagé fuyant entre les tests, réinitialisation de mock manquante, mauvais ordre
- Problème d'environnement : variable env manquante, mauvais répertoire de travail, base de données/service non initialisé
- Erreur de type ou d'importation : signature modifiée, chemin du module incorrect, dépendance manquante
- Problème de synchronisation/asynchrone : promesse non résolue, await manquant, condition de concurrence

Étape 3 — Tracez l'échec jusqu'à sa source. Lisez l'implémentation en cours de test. Lisez les mocks ou les fixtures impliqués. Comprenez ce que le test avait initialement l'intention de vérifier.

Étape 4 — Déterminez qui en est responsable :
- Si l'implémentation présente un véritable bug introduit par un changement récent, corrigez l'implémentation et conservez le test.
- Si le test affirmait un comportement incorrect dès le départ, corrigez le test.
- Si le test affirme quelque chose qui est maintenant intentionnellement différent (spécification modifiée), mettez à jour le test et notez le changement de spécification.

Étape 5 — Appliquez la correction minimale. Ne refactorisez pas le code environnant. Ne modifiez pas les assertions non liées.

Étape 6 — Exécutez la suite de tests complète du module affecté pour confirmer qu'aucune régression n'a été introduite.

Rapport : classification de la cause racine, ce que vous avez modifié et pourquoi.
