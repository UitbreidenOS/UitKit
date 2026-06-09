---
description: Recommander des index pour une table ou une charge de travail de requête basée sur le schéma et les modèles d'accès
argument-hint: "[table name, query, or schema file]"
---
Analyser le schéma de la base de données et les modèles d'accès pour: $ARGUMENTS

Si $ARGUMENTS est un nom de table, localisez son schéma dans les migrations, les modèles ORM ou les fichiers de schéma. S'il s'agit d'une requête, analysez les modèles d'accès de cette requête. S'il s'agit d'un chemin d'accès à un fichier, lisez-le.

Effectuez cette analyse:

1. Mappez les index actuels:
   - Lister tous les index existants (clé primaire, unique, composite, partiel, basé sur une expression).
   - Identifier les index redondants (couverts par un préfixe d'un autre index).
   - Identifier les index inutilisés ou de faible sélectivité (par exemple, colonnes booléennes, énumérés de faible cardinalité).

2. Analysez la charge de travail des requêtes:
   - Si des requêtes sont fournies ou découvrables dans la base de code (appels de requête ORM, SQL brut), extrayez leurs modèles WHERE, JOIN, ORDER BY et GROUP BY.
   - Identifier les colonnes qui apparaissent à plusieurs reprises dans les prédicats de filtre.
   - Notez toutes les requêtes de plage qui bénéficient des index B-tree par rapport aux requêtes d'égalité uniquement.

3. Recommandez de nouveaux index:
   - Pour chaque recommandation, indiquez:
     a. L'instruction CREATE INDEX exacte (utilisez CONCURRENTLY pour PostgreSQL le cas échéant).
     b. Quelles requêtes ou modèles d'accès il couvre.
     c. Impact estimé de sélectivité (cardinalité haute/moyenne/faible).
     d. Coût de surcharge d'écriture — les index qui nuisent au débit INSERT/UPDATE doivent être signalés.
   - Préférez les index composites aux index à colonne unique lorsque le modèle de requête le justifie.
   - Envisagez les index partiels (clause WHERE) pour les conditions éparses (par exemple, modèles de suppression logicielle, filtres d'état avec des valeurs null/inactives dominantes).
   - Envisagez les index couvrants (colonnes INCLUDE) pour éliminer les extractions de pile de table pour les chemins de lecture chauds.

4. Marquez les index à supprimer:
   - Index en double.
   - Index sur des colonnes jamais utilisés dans les filtres ou les jointures.
   - Index qui sont remplacés par un index composite.

5. Produisez un plan d'action priorisé: HIGH (victoire immédiate, risque faible) / MEDIUM (utile, léger surcharge d'écriture) / LOW (marginal, évaluer sous charge).

Indiquez le moteur de base de données supposé à partir du contexte de syntaxe ou de configuration.
