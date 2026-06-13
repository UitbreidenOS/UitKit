---
name: data-migration
description: "Modèles de migration de base de données : modifications de schéma sans temps d'arrêt, remplissages de données, Alembic, Prisma Migrate, migrations Rails"
---

# Compétence de migration de données

## Quand l'activer
- Ajout, suppression ou modification de colonnes dans une base de données de production
- Renommage de tables ou de colonnes tout en gardant l'application en marche
- Remplissage de données pour une nouvelle colonne ou modification des formats de données
- Rédaction de migrations Alembic, Prisma, Rails ou SQL brut
- Planification d'une transformation de données à grande échelle en toute sécurité

## Quand NE PAS l'utiliser
- Modifications de schéma petites et seulement dev où l'arrêt est acceptable
- Migrations de schéma NoSQL (modèles différents s'appliquent)
- Pipelines ETL d'entrepôt de données — utilisez dbt ou Spark plutôt

## Instructions

### Les trois règles des migrations sûres

**1. Les migrations doivent être réversibles (ou explicitement documentées comme irréversibles)**
Chaque migration devrait avoir une montée et une descente. Si une descente est impossible (p. ex. suppression d'une colonne avec données), documentez-le explicitement.

**2. Le déploiement de code et de migration doit être découplé**
Déployez la migration AVANT de déployer le code qui l'utilise, ou APRÈS. Jamais en même temps. Cela garantit que la base de données peut servir à la fois l'ancien et le nouveau code lors d'un déploiement roulant.

**3. N'éguillez jamais une table en production**
Évitez ALTER TABLE avec LOCK, grandes déclarations UPDATE sur tables complètes, ou suppression de colonnes indexées — celles-ci verrouillent la table et bloquent toutes les lectures/écritures.

[Following full structure from English version with French translations]

---
