---
description: Examinera un schéma de base de données pour détecter les défauts de conception, les problèmes de normalisation et la disponibilité en production
argument-hint: "[fichier de schéma ou nom(s) de table]"
---
Vous menez un examen de disponibilité en production d'un schéma de base de données. Cible d'examen: $ARGUMENTS

Si $ARGUMENTS est un chemin de fichier, lisez le fichier. S'il s'agit d'un nom de table ou d'une liste de noms, recherchez les définitions de schéma dans la base de code (migrations, modèles ORM, schema.sql, schema.rb, prisma.schema, etc.).

Examinez le schéma selon ces dimensions :

**Normalisation et intégrité des données**
- Identifiez les violations de 1NF, 2NF, 3NF. Notez les dénormalisations intentionnelles (pour les performances de lecture) par rapport à celles accidentelles.
- Détectez les colonnes stockant plusieurs valeurs (listes séparées par des virgules, tableaux JSON utilisés comme relations).
- Vérifiez que chaque table a une clé primaire claire.
- Vérifiez que les clés étrangères sont déclarées et non simplement implicites par convention de nommage.
- Vérifiez les contraintes UNIQUE manquantes sur les colonnes qui devraient être uniques.
- Détectez les colonnes nullables qui devraient être NOT NULL selon la sémantique métier.

**Pertinence des types de données**
- Signalez les colonnes de texte utilisées pour stocker des e-mails, des UUID, des adresses IP, du JSON, des montants monétaires ou des dates/heures — suggérez les types appropriés.
- Signalez INT utilisé pour les booléens (utiliser BOOLEAN), ou FLOAT pour la devise (utiliser DECIMAL/NUMERIC).
- Vérifiez la gestion des fuseaux horaires: TIMESTAMP vs TIMESTAMPTZ (PostgreSQL), DATETIME vs TIMESTAMP (MySQL).

**Nommage et cohérence**
- Vérifiez la cohérence des conventions de nommage (snake_case vs camelCase, noms de tables au pluriel vs au singulier).
- Identifiez les modèles de nommage de colonnes incohérents pour les champs courants (created_at vs createdAt vs create_time).

**Préoccupations d'évolutivité**
- Tables manquant d'un index sur les colonnes de clé étrangère.
- Tables sans stratégie de partitionnement évidente qui dépasseront probablement 10 millions de lignes.
- Modèle de suppression logicielle manquant où les suppressions physiques briseraient les exigences d'audit.
- VARCHAR sans limite de longueur raisonnable sur les colonnes susceptibles d'être indexées.

**Sécurité**
- Les colonnes qui semblent stocker des données sensibles (mot_de_passe, ssn, numero_carte, secret) sans convention de nommage indiquant qu'elles sont hachées/chiffrées.

Générez un rapport structuré avec des évaluations de sévérité (CRITIQUE / AVERTISSEMENT / SUGGESTION) pour chaque constatation, et un correctif concret pour chacune.
