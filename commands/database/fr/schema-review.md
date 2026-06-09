---
description: Examinez un schéma de base de données pour détecter les défauts de conception, les problèmes de normalisation et évaluer la préparation pour la production
argument-hint: "[schema file or table name(s)]"
---
Vous effectuez un examen de préparation pour la production d'un schéma de base de données. Cible d'examen : $ARGUMENTS

Si $ARGUMENTS est un chemin de fichier, lisez le fichier. S'il s'agit d'un nom de table ou d'une liste de noms, recherchez les définitions de schéma dans la base de code (migrations, modèles ORM, schema.sql, schema.rb, prisma.schema, etc.).

Examinez le schéma selon ces dimensions :

**Normalisation et intégrité des données**
- Identifiez les violations de 1NF, 2NF, 3NF. Notez les dénormalisations intentionnelles (pour la performance de lecture) par rapport à celles accidentelles.
- Détectez les colonnes qui stockent plusieurs valeurs (listes séparées par des virgules, tableaux JSON utilisés comme relations).
- Vérifiez que chaque table possède une clé primaire claire.
- Vérifiez que les clés étrangères sont déclarées et non seulement implicites dans la convention de nommage.
- Vérifiez les contraintes UNIQUE manquantes sur les colonnes qui devraient être uniques.
- Détectez les colonnes nullables qui devraient être NOT NULL selon la sémantique métier.

**Appropriateness des types**
- Signalez les colonnes de chaîne utilisées pour stocker les adresses e-mail, UUID, adresses IP, JSON, montants en devises ou datetimes — suggérez les types appropriés.
- Signalez INT utilisé pour booléen (utilisez BOOLEAN), ou FLOAT utilisé pour la monnaie (utilisez DECIMAL/NUMERIC).
- Vérifiez la gestion des fuseaux horaires : TIMESTAMP vs TIMESTAMPTZ (PostgreSQL), DATETIME vs TIMESTAMP (MySQL).

**Nommage et cohérence**
- Vérifiez la cohérence des conventions de nommage (snake_case vs camelCase, noms de tables au pluriel vs au singulier).
- Identifiez les modèles de nommage de colonnes incohérents pour les champs courants (created_at vs createdAt vs create_time).

**Préoccupations de scalabilité**
- Tables manquant un index sur les colonnes de clé étrangère.
- Tables sans stratégie de partitionnement évidente qui dépasseront probablement 10M de lignes.
- Modèle de soft-delete manquant là où les suppressions dures interrompraient les exigences d'audit.
- VARCHAR sans limite de longueur raisonnable sur les colonnes susceptibles d'être indexées.

**Sécurité**
- Colonnes qui semblent stocker des données sensibles (password, ssn, card_number, secret) sans convention de nommage indiquant qu'elles sont hachées/chiffrées.

Produisez un rapport structuré avec des évaluations de gravité (CRITICAL / WARNING / SUGGESTION) pour chaque conclusion, et une correction concrète pour chacune.
