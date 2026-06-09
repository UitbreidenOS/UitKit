---
description: Générer un fichier de migration de base de données à partir d'une description de changement de schéma ou d'une diff
argument-hint: "[description of schema change]"
---
Vous générez une migration de base de données. L'utilisateur a fourni : $ARGUMENTS

Déduisez le cadre de migration cible du projet (Alembic, Flyway, Liquibase, migrations Django, Rails ActiveRecord, Prisma, Knex, TypeORM, Sequelize, ou SQL brut). Si ambigù, vérifiez les fichiers de configuration ou les fichiers de migration existants dans le dépôt avant de demander.

Étapes :
1. Examinez les migrations existantes pour déterminer la convention de nommage, le format d'horodatage et la structure des fichiers.
2. Identifiez l'état du schéma actuel à partir des migrations existantes ou des fichiers de schéma.
3. Générez la migration avec :
   - Un chemin d'accès `up` (migration directe) qui est idempotent si possible (utilisez les gardes IF NOT EXISTS, IF EXISTS).
   - Un chemin d'accès `down` (retour) qui inverse complètement le chemin d'accès `up`.
   - Limites de transaction explicites si le cadre supporte les DDL transactionnelles.
   - Contraintes de colonne (NOT NULL, DEFAULT, CHECK) qui correspondent à ce qui a été demandé.
   - Création d'index aux côtés des nouvelles clés étrangères.
4. Si le changement implique le renommage d'une colonne ou d'une table, générez une migration en deux phases : ajouter nouveau, remplir les données, supprimer l'ancien — sauf si l'utilisateur demande explicitement un renommage en une seule phase.
5. Signalez toute opération destructive (DROP COLUMN, DROP TABLE, réduction de type) avec un bloc de commentaire commençant par `-- DESTRUCTIVE:` et recommandez une stratégie de déploiement correspondante (drapeau de fonctionnalité, double écriture, etc.).
6. Affichez le contenu du fichier de migration avec le nom de fichier correct suivant les conventions existantes.
7. Pour les grandes tables, signalez les opérations qui nécessitent des verrous ACCESS EXCLUSIVE (ALTER TABLE sur PostgreSQL) et suggérez les alternatives CONCURRENTLY si disponibles.

Ne générez pas de changements de modèle ORM sauf demande. Concentrez-vous uniquement sur l'artefact de migration.
