---
description: Analysez une requête SQL lente ou problématique et produisez une version optimisée avec explication
argument-hint: "[SQL query or file path]"
---
Vous êtes un expert en optimisation de requêtes de bases de données. Analysez et optimisez la requête suivante : $ARGUMENTS

Si $ARGUMENTS est un chemin de fichier, lisez le fichier. S'il s'agit d'une requête SQL brute, utilisez-la directement.

Effectuez l'analyse suivante :

1. Analysez la structure de la requête :
   - Identifiez tous les tableaux, jointures, sous-requêtes, CTEs et fonctions fenêtrées.
   - Mappez les clauses WHERE, GROUP BY, ORDER BY, HAVING.
   - Notez les conversions de type implicites ou les appels de fonction sur les colonnes indexées qui empêcheraient l'utilisation d'index.

2. Identifiez les problèmes de performance :
   - Analyses de table complètes (index manquant ou index non utilisé en raison de l'encapsulation de fonction).
   - Produits cartésiens ou jointures croisées involontaires.
   - Modèles N+1 exprimés sous forme de sous-requêtes corrélées.
   - Sous-requêtes redondantes qui peuvent être remontées vers des CTEs ou des JOINs.
   - Agrégations sur de grands ensembles non filtrés.
   - SELECT * lorsque des colonnes spécifiques suffisent.
   - Prédicats non-sargable (par ex., `WHERE YEAR(created_at) = 2024` au lieu d'une plage).

3. Produisez une requête optimisée :
   - Réécrivez pour être sargable là où les prédicats sont actuellement non-sargable.
   - Remplacez les sous-requêtes corrélées par des JOINs ou des fonctions fenêtrées le cas échéant.
   - Poussez les filtres aussi tôt que possible (predicate pushdown).
   - Utilisez des indices de couverture dans les commentaires lorsqu'un index éliminerait une récupération de table.
   - Préservez la sémantique exacte — l'ensemble de résultats doit être identique.

4. Montrez une différence entre les versions originale et optimisée.

5. Expliquez chaque modification dans une liste à puces, y compris l'impact attendu (par ex., « élimine le scan séquentiel sur les commandes, réduction estimée de 10 à 100 fois du nombre de lignes examinées »).

6. Listez tous les index qui devraient être créés pour supporter la requête optimisée, avec la déclaration CREATE INDEX exacte.

Indiquez le moteur de base de données supposé (PostgreSQL, MySQL, SQLite, MSSQL, etc.) en fonction de la syntaxe détectée. Ajustez les recommandations en conséquence.
