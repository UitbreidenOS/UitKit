---
name: backup-strategy
description: Designs database backup and recovery strategies including full/incremental/log backups, point-in-time recovery, retention policies, and disaster recovery testing schedules.
allowed-tools: Read, Write, Bash
effort: medium
---

# Backup Strategy

## When to activate
Designing or auditing backup policies for any database. When asked about RPO/RTO targets, backup schedules, retention windows, or disaster recovery readiness. Also use after any production incident involving data loss.

## When NOT to use
Skip if backups are already configured and passing automated restore tests. Skip for ephemeral/dev databases where data loss is acceptable.

## Instructions

1. Identify the database engine (PostgreSQL, MySQL, MongoDB, etc.), version, hosting (managed vs self-hosted), and current backup setup.
2. Determine RPO (Recovery Point Objective) and RTO (Recovery Time Objective) requirements from the business.
3. Design backup tiers:
   - **Full backup:** Weekly or daily depending on data volume
   - **Incremental/differential:** Between full backups
   - **WAL/binlog/archive logs:** Continuous for point-in-time recovery
4. Define retention policy: daily (7 days), weekly (4 weeks), monthly (12 months), yearly (compliance).
5. Specify offsite/cloud storage (S3, GCS, Azure Blob) with encryption at rest.
6. Schedule automated restore tests: weekly for critical databases, monthly for non-critical.
7. Document the runbook for emergency recovery.

## Example

**Scenario:** PostgreSQL 16 on AWS RDS, 500GB, e-commerce production database.

```
BACKUP STRATEGY: PostgreSQL 16 / RDS Multi-AZ

RPO: 5 minutes (continuous WAL archiving)
RTO: 30 minutes (automated failover + PITR)

Schedule:
  - Automated snapshots: Daily at 03:00 UTC (retained 35 days)
  - WAL continuous archiving: to S3 with 5-min granularity
  - Manual snapshot: before every schema migration

Retention:
  - Daily: 7 days
  - Weekly: 4 weeks
  - Monthly: 12 months (compliance)

Storage: S3 with SSE-KMS encryption, cross-region replication to us-east-1

Restore testing: Every Monday 06:00 UTC — automated PITR to staging
Alerting: SNS on backup failure, >1hr since last WAL archive
```
