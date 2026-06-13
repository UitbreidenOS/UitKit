---
description: Générer un fichier de migration de base de données à partir d'une description de modification de schéma ou d'une différence
argument-hint: "[description du changement de schéma]"
---
Vous générez une migration de base de données. L'utilisateur a fourni : $ARGUMENTS

Déduisez le cadre de migration cible du projet (Alembic, Flyway, Liquibase, migrations Django, Rails ActiveRecord, Prisma, Knex, TypeORM, Sequelize, ou SQL brut). En cas d'ambiguïté, vérifiez les fichiers de configuration ou les fichiers de migration existants dans le répertoire avant de poser une question.

Étapes :
1. Examinez les migrations existantes pour déterminer la convention de nommage, le format d'horodatage et la structure des fichiers.
2. Identifiez l'état du schéma actuel à partir des migrations existantes ou des fichiers de schéma.
3. Générez la migration avec :
   - Un chemin `up` (migration progressive) qui est idempotent si possible (utilisez les gardes IF NOT EXISTS, IF EXISTS).
   - Un chemin `down` (restauration) qui inverse complètement le chemin `up`.
   - Des limites de transaction explicites si le cadre supporte les DDL transactionnels.
   - Des contraintes de colonne (NOT NULL, DEFAULT, CHECK) qui correspondent à ce qui a été demandé.
   - La création d'index aux côtés de toute nouvelle clé étrangère.
4. Si la modification implique de renommer une colonne ou une table, générez une migration en deux phases : ajouter la nouvelle, remplir les données, supprimer l'ancienne — à moins que l'utilisateur ne demande explicitement un renommage en une seule phase.
5. Signalez toute opération destructive (DROP COLUMN, DROP TABLE, rétrécissement de type) avec un bloc de commentaire commençant par `-- DESTRUCTIVE:` et recommandez une stratégie de déploiement correspondante (feature flag, double écriture, etc.).
6. Affichez le contenu du fichier de migration avec le nom de fichier correct suivant les conventions existantes.
7. Pour les tables volumineuses, signalez les opérations qui nécessitent des verrous ACCESS EXCLUSIVE (ALTER TABLE sur PostgreSQL) et suggérez des alternatives CONCURRENTLY si disponibles.

Ne générez pas de modifications de modèle ORM sauf demande explicite. Concentrez-vous uniquement sur l'artefact de migration.
