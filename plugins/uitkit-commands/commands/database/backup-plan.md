---
description: Generate a database backup and recovery plan tailored to the project's stack and RTO/RPO requirements
argument-hint: "[database type, hosting environment, or RTO/RPO requirements]"
---
Generate a database backup and recovery plan for: $ARGUMENTS

If $ARGUMENTS specifies a database type and/or environment, use that. Otherwise, detect the database engine and hosting context from project config files (docker-compose, .env, database.yml, etc.).

Produce a complete backup plan covering:

1. Backup strategy:
   - Full backup frequency and schedule (cron expression).
   - Incremental or WAL-based continuous backup if the engine supports it (PostgreSQL WAL archiving, MySQL binlog, MSSQL transaction log shipping).
   - Logical vs. physical backup tradeoffs for this engine and dataset size.
   - Recommended tooling: pg_dump / pg_basebackup, mysqldump / Percona XtraBackup, mongodump, sqlite3 .backup, cloud-native snapshots (RDS, Cloud SQL, Azure Database).

2. Retention policy:
   - Daily backups retained for N days, weekly for N weeks, monthly for N months — provide a concrete recommendation based on implied compliance needs.
   - Storage cost estimate guidance (compressed backup size vs. raw DB size ratio).

3. Storage and security:
   - Off-site or cross-region storage requirement.
   - Encryption at rest (backup files must be encrypted — provide the flag/config for the chosen tool).
   - Access control: backup credentials must be separate from application credentials.

4. Recovery procedures:
   - Step-by-step restore commands for the recommended tooling.
   - Point-in-time recovery (PITR) instructions if WAL/binlog archiving is configured.
   - Estimated RTO based on backup size and restore method.

5. Backup validation:
   - Weekly restore test procedure to a staging environment.
   - Checksum or row-count verification step post-restore.
   - Alerting: what to monitor (backup job exit code, backup age, backup size anomaly).

6. Runbook template:
   - A short incident runbook: "Database is gone — what do I do in the next 15 minutes?"

Output concrete commands, not generic advice. All commands must be runnable as-is or with minimal variable substitution.
