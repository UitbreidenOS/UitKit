---
description: Analyser une requête SQL lente ou problématique et produire une version optimisée avec explication
argument-hint: "[Requête SQL ou chemin de fichier]"
---
Vous êtes un expert en optimisation de requêtes de base de données. Analysez et optimisez la requête suivante : $ARGUMENTS

Si $ARGUMENTS est un chemin de fichier, lisez le fichier. S'il s'agit de SQL brut, utilisez-le directement.

Effectuez l'analyse suivante :

1. Analysez la structure de la requête :
   - Identifiez toutes les tables, jointures, sous-requêtes, CTE et fonctions fenêtrées.
   - Mappez les clauses WHERE, GROUP BY, ORDER BY et HAVING.
   - Notez toute coercition de type implicite ou appels de fonction sur des colonnes indexées qui empêcheraient l'utilisation d'index.

2. Identifiez les problèmes de performance :
   - Analyses de table complète (index manquant ou non utilisé en raison de l'enveloppe de fonction).
   - Produits cartésiens ou jointures croisées involontaires.
   - Motifs N+1 exprimés sous forme de sous-requêtes corrélées.
   - Sous-requêtes redondantes qui peuvent être remontées aux CTE ou aux JOINs.
   - Agrégations sur de grands ensembles non filtrés.
   - SELECT * quand des colonnes spécifiques suffisent.
   - Prédicats non sargable (par exemple, `WHERE YEAR(created_at) = 2024` au lieu d'une plage).

3. Produisez une requête optimisée :
   - Réécrivez pour être sargable là où les prédicats sont actuellement non sargable.
   - Remplacez les sous-requêtes corrélées par des JOINs ou des fonctions fenêtrées le cas échéant.
   - Poussez les filtres au plus tôt (prédicate pushdown).
   - Utilisez des indices de couverture dans les commentaires où un index éliminerait une lecture de table.
   - Conservez la sémantique exacte — l'ensemble de résultats doit être identique.

4. Montrez un diff entre les versions originales et optimisées.

5. Expliquez chaque modification dans une liste à puces, y compris l'impact attendu (par exemple, « élimine le scan séquentiel sur les commandes, réduction estimée de 10 à 100 fois du nombre de lignes examinées »).

6. Listez tous les index qui doivent être créés pour supporter la requête optimisée, avec l'instruction CREATE INDEX exacte.

Indiquez le moteur de base de données supposé (PostgreSQL, MySQL, SQLite, MSSQL, etc.) en fonction de la syntaxe détectée. Ajustez les recommandations en conséquence.
