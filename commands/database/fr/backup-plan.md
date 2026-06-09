---
description: Générer un plan de sauvegarde et de récupération de base de données adapté à la pile technologique du projet et aux exigences RTO/RPO
argument-hint: "[database type, hosting environment, or RTO/RPO requirements]"
---
Générer un plan de sauvegarde et de récupération de base de données pour : $ARGUMENTS

Si $ARGUMENTS spécifie un type de base de données et/ou un environnement, l'utiliser. Sinon, détectez le moteur de base de données et le contexte d'hébergement à partir des fichiers de configuration du projet (docker-compose, .env, database.yml, etc.).

Produisez un plan de sauvegarde complet couvrant :

1. Stratégie de sauvegarde :
   - Fréquence et calendrier de sauvegarde complète (expression cron).
   - Sauvegarde incrémentale ou continue basée sur WAL si le moteur la supporte (archivage WAL PostgreSQL, binlog MySQL, expédition du journal des transactions MSSQL).
   - Compromis entre sauvegarde logique et physique pour ce moteur et cette taille de dataset.
   - Outils recommandés : pg_dump / pg_basebackup, mysqldump / Percona XtraBackup, mongodump, sqlite3 .backup, snapshots natifs au cloud (RDS, Cloud SQL, Azure Database).

2. Politique de rétention :
   - Sauvegardes quotidiennes conservées pendant N jours, hebdomadaires pendant N semaines, mensuelles pendant N mois — fournissez une recommandation concrète basée sur les besoins de conformité implicites.
   - Conseil d'estimation des coûts de stockage (rapport taille de sauvegarde compressée vs taille DB brute).

3. Stockage et sécurité :
   - Exigence de stockage hors site ou multi-régions.
   - Chiffrement au repos (les fichiers de sauvegarde doivent être chiffrés — fournissez le drapeau/la configuration pour l'outil choisi).
   - Contrôle d'accès : les credentials de sauvegarde doivent être séparées des credentials de l'application.

4. Procédures de récupération :
   - Commandes de restauration étape par étape pour les outils recommandés.
   - Instructions de récupération à un point dans le temps (PITR) si l'archivage WAL/binlog est configuré.
   - RTO estimé basé sur la taille de sauvegarde et la méthode de restauration.

5. Validation de sauvegarde :
   - Procédure de test de restauration hebdomadaire vers un environnement de staging.
   - Étape de vérification par checksum ou comptage des lignes après restauration.
   - Alertes : ce qu'il faut surveiller (code de sortie du travail de sauvegarde, âge de la sauvegarde, anomalie de taille de sauvegarde).

6. Modèle de runbook :
   - Un court runbook d'incident : « La base de données a disparu — que dois-je faire dans les 15 prochaines minutes ? »

Produisez des commandes concrètes, pas des conseils génériques. Toutes les commandes doivent être exécutables telles quelles ou avec une substitution minimale de variables.
