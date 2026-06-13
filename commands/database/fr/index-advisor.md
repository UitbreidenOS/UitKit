---
description: Recommander des indexes pour une table ou une charge de travail de requêtes basée sur le schéma et les patterns d'accès
argument-hint: "[nom de table, requête, ou fichier de schéma]"
---
Analyser le schéma de base de données et les patterns d'accès pour: $ARGUMENTS

Si $ARGUMENTS est un nom de table, localiser son schéma dans les migrations, modèles ORM, ou fichiers de schéma. Si c'est une requête, analyser les patterns d'accès de cette requête. Si c'est un chemin de fichier, le lire.

Effectuer cette analyse:

1. Cartographier les indexes actuels:
   - Lister tous les indexes existants (clé primaire, unique, composite, partiel, basé sur expression).
   - Identifier quels indexes sont redondants (préfixe couvert par un autre index).
   - Identifier les indexes inutilisés ou à faible sélectivité (p. ex., colonnes booléennes, énumérations à faible cardinalité).

2. Analyser la charge de travail des requêtes:
   - Si des requêtes sont fournies ou découvrables dans la base de code (appels de requête ORM, SQL brut), extraire leurs patterns WHERE, JOIN, ORDER BY, et GROUP BY.
   - Identifier les colonnes qui apparaissent régulièrement dans les prédicats de filtre.
   - Noter les requêtes de plage qui bénéficient d'indexes B-tree par rapport aux requêtes d'égalité uniquement.

3. Recommander de nouveaux indexes:
   - Pour chaque recommandation, indiquer:
     a. L'instruction CREATE INDEX exacte (utiliser CONCURRENTLY pour PostgreSQL si approprié).
     b. Quelles requêtes ou patterns d'accès il couvre.
     c. Impact de sélectivité estimé (cardinalité haute/moyenne/basse).
     d. Coût overhead d'écriture — les indexes qui réduisent le débit INSERT/UPDATE doivent être signalés.
   - Préférer les indexes composites aux indexes single-column multiples lorsque le pattern de requête le justifie.
   - Considérer les indexes partiels (clause WHERE) pour les conditions rares (p. ex., patterns de soft-delete, filtres de statut avec valeurs null/inactif dominantes).
   - Considérer les covering indexes (colonnes INCLUDE) pour éliminer les accès au tas de table pour les chemins de lecture actifs.

4. Signaler les indexes à supprimer:
   - Indexes dupliqués.
   - Indexes sur des colonnes jamais utilisées dans les filtres ou les joins.
   - Indexes qui sont remplacés par un index composite.

5. Produire un plan d'action priorisé: HIGH (gain immédiat, risque faible) / MEDIUM (utile, overhead d'écriture mineur) / LOW (marginal, évaluer sous charge).

Indiquer le moteur de base de données supposé à partir du contexte de syntaxe ou de configuration.
