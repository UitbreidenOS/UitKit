---
description: Générer des tests unitaires complets pour le fichier ou la fonction spécifiée
argument-hint: "[file-or-function]"
---
Vous écrivez des tests unitaires pour : $ARGUMENTS

Suivez ces étapes :

1. Lisez le fichier cible ou localisez la fonction nommée dans la base de code. Comprenez son interface publique, ses effets secondaires et ses dépendances.

2. Identifiez tous les cas de test nécessaires :
   - Chemin heureux (entrées valides typiques)
   - Conditions limites (vide, zéro, maximum, minimum, single-element)
   - Chemins d'erreur (entrée invalide, dépendances manquantes, exceptions levées)
   - Cas limites spécifiques à la logique métier

3. Détectez le framework de test existant et les conventions du projet (Jest, Pytest, Go testing, Vitest, RSpec, etc.). Faites correspondre exactement le style — même profondeur d'imbrication describe/it, même style d'assertion, mêmes modèles mock/stub déjà utilisés.

4. Écrivez des tests qui :
   - Sont isolés : aucun état mutable partagé entre les tests
   - Ont des noms descriptifs qui se lisent comme des spécifications ("retourne null quand l'utilisateur n'est pas trouvé", pas "cas de test 1")
   - Affirment un concept logique par test
   - Utilisent la structure arrange-act-assert
   - Simulez uniquement ce qui franchit une véritable limite (réseau, système de fichiers, BD, temps, aléatoire)

5. NE SIMULEZ PAS l'unité testée elle-même. N'écrivez PAS de tests qui testent uniquement la simulation.

6. Placez le fichier de test adjacent au fichier source en suivant les conventions du projet (par exemple, `__tests__/`, `.test.ts`, `_test.go`).

7. Après la rédaction, exécutez les tests et confirmez qu'ils passent. Si un test échoue, corrigez soit le test (si l'expectation était incorrecte), soit exposez clairement le bug dans l'implémentation.

N'écrivez pas de tests de placeholder. Ne laissez pas de commentaires `TODO`. Chaque test doit être complet et significatif.
