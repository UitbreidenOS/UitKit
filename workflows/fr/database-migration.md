# Flux de travail de migration de base de données

Processus sûr et étape par étape pour planifier et exécuter les modifications de schéma de base de données sans temps d'arrêt.

## Quand utiliser

Utilisez ce flux de travail pour toute modification de base de données qui:
- Modifie une table existante (ajouter/renommer/supprimer colonne, changer le type)
- Affecte une table avec > 100K lignes
- Nécessite un nouvel index sur une grande table
- Modifie une contrainte ou une clé étrangère
- Implique le déplacement ou la division de données entre les tables

Ignorez ce flux de travail pour: nouvelles tables sur de nouvelles fonctionnalités sans données existantes.

## Phase 1: Planification (avant d'écrire du SQL)

**Répondez d'abord à ces questions:**

1. Qu'est-ce qui change exactement?
   - Ajout/renommage/suppression de colonne/changement de type/changement de contrainte/index?

2. Combien de données sont affectées?
   ```sql
   SELECT COUNT(*) FROM affected_table;  -- nombre de lignes
   SELECT pg_size_pretty(pg_total_relation_size('affected_table'));  -- taille de la table
   ```

3. Quelle est la fréquence d'utilisation de cette table?
   ```sql
   -- Vérifier les modèles d'accès (PostgreSQL)
   SELECT seq_scan, idx_scan, n_tup_upd, n_tup_del
   FROM pg_stat_user_tables WHERE relname = 'affected_table';
   ```

4. Cela peut-il être fait sans temps d'arrêt?
   - AJOUTER une colonne nullable: oui
   - AJOUTER une colonne NOT NULL sans valeur par défaut: nécessite expand-contract
   - SUPPRIMER une colonne: oui (si le code ne l'utilise plus)
   - RENOMMER une colonne: nécessite expand-contract
   - CRÉER un index: oui, avec CONCURRENTLY
   - CHANGER un type de colonne: risqué — vérifiez si une conversion de données est nécessaire

5. Le code d'application est-il compatible avec l'ancien et le nouveau schéma?
   - Déployer le code d'abord, puis migrer (la nouvelle colonne peut être null jusqu'à remplissage)
   - Ou migrer d'abord, puis déployer (seulement si la migration est purement additive)

## Phase 2: Écrire la migration

**Utilisez le modèle expand-contract pour tout changement révolutionnaire:**

```sql
-- PHASE EXPAND (déployer ceci en premier, l'ancien code fonctionne toujours):
ALTER TABLE users ADD COLUMN display_name VARCHAR(255);

-- REMPLISSAGE (exécuter hors ligne, pas de verrou):
-- Par lots pour éviter le verrouillage:
UPDATE users SET display_name = username 
WHERE display_name IS NULL AND id BETWEEN 1 AND 10000;
-- ... répéter pour toutes les plages d'ID

-- PHASE CONTRACT (après que le code est mis à jour et le remplissage est terminé):
-- Ajouter des contraintes uniquement après le remplissage:
ALTER TABLE users ALTER COLUMN display_name SET NOT NULL;
-- Supprimer l'ancienne colonne uniquement après avoir confirmé que rien ne la lit:
ALTER TABLE users DROP COLUMN username;
```

**Écrivez la restauration:**
```sql
-- Chaque migration doit avoir une restauration documentée
-- Restauration pour ce qui précède:
ALTER TABLE users ADD COLUMN username VARCHAR(255);
UPDATE users SET username = display_name WHERE username IS NULL;
ALTER TABLE users ALTER COLUMN username SET NOT NULL;
ALTER TABLE users DROP COLUMN display_name;
```

## Phase 3: Tester

```bash
# 1. Tester sur une copie des données de production (pas seulement une base de données de développement)
pg_dump $PROD_DB | psql $STAGING_DB

# 2. Mesurer le temps de migration en staging
time psql $STAGING_DB < migration.sql

# 3. Tester la restauration en staging
time psql $STAGING_DB < rollback.sql

# 4. Vérifier l'intégrité des données après la migration
psql $STAGING_DB -c "SELECT COUNT(*) FROM affected_table WHERE new_column IS NULL;"
```

**Critères d'acceptation avant d'exécuter en production:**
- [ ] La migration s'exécute en < 30 secondes (ou utilise CONCURRENTLY et n'est pas bloquante)
- [ ] La restauration testée et confirmée pour fonctionner
- [ ] Intégrité des données validée (nombre de lignes, vérifications nulles, vérifications de contraintes)
- [ ] Application testée avec l'ancien et le nouveau schéma (pendant la transition)

## Phase 4: Exécution en production

**Liste de vérification pré-migration:**
- [ ] Sauvegarde effectuée au cours des dernières 24 heures (ou en faire une maintenant)
- [ ] Heure creuse sélectionnée (éviter les heures de pointe)
- [ ] L'équipe d'ingénierie en attente pendant 30 minutes après la migration
- [ ] Script de restauration prêt à coller immédiatement
- [ ] Tableaux de bord de surveillance ouverts

**Exécution:**
```bash
# 1. Exécuter la migration
psql $PROD_DB < migration.sql

# 2. Vérifier immédiatement
psql $PROD_DB -c "SELECT COUNT(*) FROM affected_table;"
psql $PROD_DB -c "\d affected_table"  # confirmer le schéma

# 3. Surveiller pendant 10 minutes
# Vérifier: taux d'erreur, latence des requêtes, CPU DB
```

**Si quelque chose ne semble pas correct:**
```bash
# Exécuter la restauration immédiatement
psql $PROD_DB < rollback.sql
# Puis enquêter en staging avant de réessayer
```

## Phase 5: Post-migration

- [ ] Nettoyage: supprimer les colonnes ou index temporaires utilisés pendant la migration
- [ ] Mettre à jour la documentation si elle existe
- [ ] Archiver les fichiers de migration avec l'historique des versions
- [ ] Si la migration était complexe: écrire une note de post-mortem pour l'équipe

## Contenu connexe

- `/rules/common/database-migrations` — règles qui s'appliquent à toutes les migrations
- `/skills/devops-infra/migration-architect` — migrations complexes multi-systèmes
- `/skills/database/postgresql` — modèles spécifiques à PostgreSQL

---
