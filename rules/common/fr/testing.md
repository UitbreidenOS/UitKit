> 🇫🇷 This is the French translation. [English version](../testing.md).

# Règles de Tests

Copiez les sections pertinentes dans le `CLAUDE.md` de votre projet.

---

## Ce qu'il faut tester

- Tester le comportement via les APIs publiques — pas les détails d'implémentation internes
- Les tests doivent survivre au refactoring : si renommer une fonction privée casse les tests, les tests sont incorrects
- Tester les cas limites : entrées null/vides, valeurs aux bornes, chemins d'erreur
- Ne pas tester le code du framework ou les builtins du langage

## Structure des tests

- Une assertion logique par test — si un test vérifie plusieurs choses non liées, le diviser
- Les noms de tests décrivent CE QUE fait le système, pas COMMENT : `"returns 404 when user not found"` pas `"test findUser"`
- Arrange → Act → Assert — un bloc chacun, sans interleaving
- Pas de logique conditionnelle dans les tests — si vous avez besoin d'un `if`, écrire deux tests

## Mocking

- Ne pas mocker les modules internes — mocker uniquement aux frontières du système (APIs externes, bases de données, système de fichiers)
- Ne jamais mocker la classe/module en cours de test
- Les tests d'intégration doivent toucher la vraie base de données — utiliser une base de données de test, pas des mocks
- Si un test unitaire nécessite 5+ mocks, le code n'est probablement pas bien structuré

## Couverture

- La couverture est un plancher, pas une cible — 80% de couverture avec de mauvais tests est pire que 60% avec de bons tests
- Chaque nouvelle fonctionnalité nécessite au moins un test de chemin heureux et un test de chemin d'erreur
- Chaque correction de bug nécessite un test de régression qui aurait détecté le bug

## Données de test

- Utiliser des factories ou des fixtures — ne jamais coder en dur des IDs d'utilisateurs, des emails ou des UUIDs dans les tests
- Les tests doivent être isolés — pas d'état mutable partagé entre les tests
- Les tests doivent être déterministes — pas de données aléatoires, pas d'assertions dépendantes du temps sans mocker l'horloge
- Nettoyer après chaque test — tronquer les tables, réinitialiser les mocks, supprimer les fichiers créés

---
