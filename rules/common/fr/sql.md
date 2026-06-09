# Règles SQL

Appliquez ces règles lors de l'écriture de requêtes, de schémas ou de procédures stockées.

## Hygiène des requêtes

- Utilisez toujours des requêtes paramétrées — ne jamais interpoler les entrées utilisateur dans SQL
- Qualifiez les noms de colonnes lors de la jointure de plusieurs tables : `u.id` et non `id`
- Évitez `SELECT *` dans les requêtes de production ; nommez chaque colonne dont vous avez besoin
- Utilisez `EXPLAIN ANALYZE` avant de fusionner toute requête qui touche des tables volumineuses
- Gardez les requêtes lisibles : une clause par ligne pour tout ce qui dépasse un SELECT trivial

## Indexation

- Chaque clé étrangère doit avoir un index — la base de données ne l'ajoute pas automatiquement
- Indexez les colonnes qui apparaissent dans `WHERE`, `JOIN ON`, ou `ORDER BY` sur les chemins chauds
- Index composites : l'ordre des colonnes a de l'importance — mettez le filtre d'égalité ou de plus haute cardinalité en premier
- Ne surindexez pas les tables à forte écriture ; chaque index ralentit `INSERT`/`UPDATE`/`DELETE`
- Utilisez des index partiels pour les requêtes filtrées : `CREATE INDEX … WHERE deleted_at IS NULL`

## Conception du schéma

- Utilisez `NOT NULL` par défaut ; nullable uniquement quand l'absence a une signification distincte de zéro/vide
- Stockez les horodatages comme `TIMESTAMPTZ` (UTC) — jamais `TIMESTAMP WITHOUT TIME ZONE`
- Utilisez `BIGINT` ou `UUID` pour les clés primaires ; `SERIAL`/`INT` s'épuise sur les tables à haut volume
- Soft-delete avec `deleted_at TIMESTAMPTZ` quand l'historique des lignes est important ; hard-delete sinon
- Argent : stockez comme entier en cents (`BIGINT`) ou `NUMERIC(19,4)` — jamais `FLOAT`/`DOUBLE`

## Transactions

- Enveloppez les mutations multi-déclarations dans une transaction ; ne laissez jamais les écritures partielles possibles
- Gardez les transactions courtes — verrou détenu = latence pour chaque écrivain concurrent
- Utilisez `SELECT … FOR UPDATE` pour verrouiller les lignes que vous êtes sur le point de modifier, pas après coup
- Évitez les transactions qui s'étendent sur un cycle requête-réponse HTTP

## Migrations

- Les migrations sont additives ; ne modifiez jamais une migration qui s'est exécutée dans n'importe quel environnement
- Préférez les changements additifs (ajouter une colonne, ajouter une table) avant de supprimer les anciennes colonnes
- Ajoutez les nouvelles colonnes non nullables avec un `DEFAULT` ou en deux étapes : ajouter nullable → backfill → ajouter la contrainte
- Testez le rollback : chaque migration devrait avoir une étape `down` réversible

## Anti-modèles

- Pas de logique dans les requêtes d'application qui appartient aux contraintes : utilisez `CHECK`, `UNIQUE`, `FK`
- Pas de `NOT IN (subquery)` avec des colonnes nullables — elle retourne silencieusement zéro lignes sur NULL
- Pas de sous-requêtes corrélées à l'intérieur des boucles — batchez ou utilisez un `JOIN`/`CTE` à la place
- Pas de pagination `OFFSET` sur les grandes tables — utilisez basée sur le curseur (`WHERE id > :cursor`)
