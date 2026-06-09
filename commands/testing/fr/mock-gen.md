---
description: Générer des mocks et des stubs type-safe pour un module ou une interface donné
argument-hint: "[module-path-or-interface-name]"
---
Générer les mocks et les stubs pour : $ARGUMENTS

1. Localisez la cible — trouvez le fichier de module, la classe ou l'interface nommée dans $ARGUMENTS. Lisez-le complètement pour comprendre la surface complète : toutes les fonctions exportées, les méthodes de classe et leurs signatures de type.

2. Détectez l'approche de mocking du projet :
   - Jest : `jest.fn()`, `jest.mock()`, mocks manuels dans `__mocks__/`
   - Pytest : `unittest.mock.MagicMock`, fixtures `pytest-mock`
   - Go : interface-based manual mocks ou structs générés de style `mockery`
   - TypeScript : préservez tous les types génériques ; n'utilisez pas `any`

3. Générez des mocks qui :
   - Implémentent l'interface complète — aucune méthode manquante
   - Sont type-safe (pas de casting, pas de `any` à moins que l'original n'en utilise)
   - Ont des valeurs de retour configurables par appel via les APIs de mock standard
   - Incluent une implémentation par défaut qui retourne des valeurs zéro / des structs vides afin que les tests se compilent sans configuration supplémentaire
   - Exposent le suivi des appels (nombre d'appels, arguments reçus) où le framework le supporte

4. Générez une factory ou fixture correspondante qui retourne un mock pré-configuré adapté aux scénarios de test courants. Nommez-la `make<Name>Mock` ou suivez la convention de nommage du projet.

5. Placez le mock au bon endroit selon les conventions du projet (`__mocks__/`, `mocks/`, `testutil/`, etc.). Si le projet n'a pas de convention, placez-le adjacent au fichier source.

6. Écrivez un exemple de test démontrant comment importer et utiliser le mock, y compris comment affirmer les appels reçus.

Sortie : le fichier de mock et le test d'exemple. Aucune méthode placeholder.
