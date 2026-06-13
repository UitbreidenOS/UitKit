---
name: migration-architect
description: "Zero-downtime migration planning: database schema migrations (expand-contract), infrastructure cutovers, service replacements — phased plans, rollback strategies, and validation gates"
updated: 2026-06-13
---

# Migration Architect Skill

## When to activate
- Planning a database schema migration with zero downtime
- Designing a service cutover or system replacement
- Building a phased migration plan with explicit rollback paths
- Validating data compatibility before and after migration
- Infrastructure migration (cloud provider, hosting, database engine)

## When NOT to use
- npm/pip dependency upgrades — use the dependency-auditor skill
- Cloud architecture design without migration context — use the cloud architect skills
- Data pipeline ETL design — use the data-ml skills

## Instructions

### Database schema migration (expand-contract)

```
Plan a zero-downtime database schema migration.

Database: [PostgreSQL / MySQL / MongoDB / other]
Change: [describe — add column / rename column / change type / split table / add FK]
Current traffic: [requests/second, peak load]
Rollback requirement: [must be able to rollback / forward-only acceptable]

The expand-contract pattern (zero downtime, all production-safe):

PHASE 1 — EXPAND (deploy first, backwards-compatible):
Add new structure alongside existing:
- New column with NULL default (not NOT NULL — that would lock the table)
- New table alongside the old one
- New index (CREATE INDEX CONCURRENTLY — no table lock in PostgreSQL)

Example — adding a new NOT NULL column:
-- WRONG: blocks writes during migration
ALTER TABLE users ADD COLUMN verified_at TIMESTAMP NOT NULL DEFAULT NOW();

-- CORRECT: expand-contract approach
-- Step 1: Add nullable (no lock)
ALTER TABLE users ADD COLUMN verified_at TIMESTAMP;

-- Step 2: Backfill in batches (no lock, runs while traffic is live)
UPDATE users SET verified_at = created_at
WHERE id BETWEEN 1 AND 10000 AND verified_at IS NULL;
-- Repeat in batches of 10K rows with pg_sleep(0.01) between batches

-- Step 3: Add NOT NULL constraint (after backfill complete)
ALTER TABLE users ALTER COLUMN verified_at SET NOT NULL;
-- In PostgreSQL 12+: use NOT VALID constraint first, then VALIDATE CONSTRAINT separately

PHASE 2 — DUAL WRITE (both old and new schema):
Application writes to both old and new structure simultaneously.
Reads still use the old structure (rollback: just stop writing to new).

PHASE 3 — MIGRATE READS:
Switch application reads to the new structure.
Old structure still receives writes (allows rollback).

PHASE 4 — CONTRACT (remove old structure):
Remove the old column/table/index once 100% confirmed stable.
This is irreversible — confirm thoroughly before executing.

Timeline estimate:
- Simple column add: 1-2 hours including backfill
- Table split: 1-3 days for dual-write validation
- Index add (CONCURRENTLY): minutes to hours depending on table size

Generate the migration plan for my specific schema change.
```

### Service replacement cutover

```
Plan a service replacement with zero downtime.

Old service: [describe — monolith / legacy API / third-party dependency]
New service: [describe]
Traffic: [X requests/second, X users affected]
Rollback window: [how long can we roll back if something goes wrong?]

Strangler Fig pattern (safest for service replacement):

Phase 1 — Deploy new service alongside old (no traffic yet):
- New service deployed to production environment
- Internal testing only (staff, internal test accounts)
- Feature parity validated against old service API contract

Phase 2 — Shadow mode (both services receive traffic):
- All requests go to old service (production traffic)
- New service receives a copy of all requests (shadow traffic)
- Compare responses: old vs new — identify discrepancies
- Fix discrepancies in new service without affecting users

Phase 3 — Canary (small % to new service):
- 1% → 5% → 10% → 25% → 50% → 100% over days/weeks
- Monitor at each increment: error rate, latency, business metrics
- Rollback trigger: if error rate increases > [threshold] at any canary step

Phase 4 — Full cutover:
- 100% traffic to new service
- Old service kept on standby for [X days] (not decommissioned yet)
- Rollback: flip load balancer back to old service if needed

Phase 5 — Decommission:
- Old service decommissioned after [stability window]
- Old service data/state migrated or archived

Traffic splitting mechanisms:
- AWS: ALB weighted target groups
- GCP: Cloud Run traffic splitting (--traffic tag=new,25%)
- Azure: App Service deployment slots with traffic routing
- Kubernetes: Istio VirtualService weight-based routing
- nginx: upstream server weight

Generate the cutover plan for my specific services.
```

### Cloud infrastructure migration

```
Plan a cloud migration for [workload].

Source: [AWS / Azure / GCP / on-prem / co-location]
Target: [AWS / Azure / GCP]
Workloads: [describe — web app / database / storage / all]
Data volume: [X GB / TB]
Downtime tolerance: [zero downtime / maintenance window of X hours]

Migration phases:

PHASE 1 — ASSESS (2-4 weeks):
□ Inventory all workloads, dependencies, and data volumes
□ Identify migration blockers (proprietary formats, licences, compliance constraints)
□ Prioritise: start with stateless services (easiest), end with databases (hardest)
□ Document current state: architecture diagram, network topology, DNS records

PHASE 2 — PILOT (2-4 weeks):
□ Migrate 1 non-critical service to target cloud
□ Validate performance, cost, and operational patterns
□ Build and test CI/CD pipelines for target cloud
□ Train team on target cloud tooling

PHASE 3 — LIFT AND SHIFT (per workload):
For each stateless service:
□ Containerise if not already (Docker)
□ Deploy to target cloud in parallel (not replacing source yet)
□ Run acceptance tests
□ DNS cutover (low TTL first, then flip)
□ Monitor for [X days] before decommissioning source

PHASE 4 — DATABASE MIGRATION:
□ Set up replication from source to target database (ongoing sync)
□ Validate data integrity (row counts, checksums, spot-check queries)
□ Application cutover: point app at new database
□ Stop replication
□ Old database retained as backup for [X days]

PHASE 5 — DECOMMISSION:
□ All workloads validated on target cloud
□ Old cloud infrastructure terminated
□ DNS records cleaned up
□ Old cloud account closed

Common migration tools:
AWS → GCP: Migrate for Compute Engine (VMs), Database Migration Service (MySQL/PostgreSQL)
On-prem → AWS: AWS Application Migration Service, Database Migration Service
Any → Any: Terraform + Ansible (IaC-first migration), Velero for Kubernetes state

Generate the phased migration plan for my specific workloads.
```

### Rollback strategy

```
Design a rollback strategy for [migration].

Migration type: [schema change / service cutover / cloud migration / data migration]
Current phase: [which phase is in progress or planned]
Maximum acceptable downtime: [zero / X minutes / X hours]
Data change risk: [data could be mutated / data is read-only / both]

Rollback strategy by migration type:

SCHEMA MIGRATIONS:
Phase 1 (expand only): rollback = drop the new column/index/table. Safe, instant.
Phase 2 (dual write): rollback = stop writing to new structure, drop new. Safe.
Phase 3 (reads switched): rollback = switch reads back to old. Fast.
Phase 4 (contract): IRREVERSIBLE. Never execute without 48h of stability observation.

Rollback trigger conditions (decide before migration starts):
- Error rate increases > [X%] above baseline
- P99 latency increases > [X]% above baseline
- Business metric (conversions, revenue) drops > [X%]
- Any data integrity violation detected

SERVICE CUTOVERS:
Rollback mechanism: load balancer weight flip (seconds to execute)
Required: keep old service running in parallel for [minimum X days]
Decision point for decommission: [never before 7 days of stable traffic at 100%]

DATA MIGRATIONS:
Point-in-time recovery: take snapshot before migration starts (restore target)
Dual-write log: retain all writes during migration (can replay to old system)
Checksum validation: compare source and target record counts and checksums hourly

EMERGENCY ROLLBACK RUNBOOK for [this migration]:
1. Who can authorise rollback: [name/role]
2. Rollback command: [specific command or procedure]
3. How to verify rollback is complete: [specific check]
4. Post-rollback notification: [who to notify, how]
5. Post-mortem: [schedule within 48 hours]

Generate the rollback strategy and runbook for my migration.
```

## Example

**User:** We need to rename a column in our PostgreSQL orders table (user_id → customer_id). 2M rows, 500 req/sec. Zero downtime. How?

**Claude's migration plan:**

4-phase expand-contract, total elapsed time: ~3-5 days of parallel operation, 15 minutes of actual database work spread across 4 deploys.

**Phase 1 — Add new column (Deploy 1, 5 minutes):**
```sql
-- No lock on modern PostgreSQL (ADD COLUMN with default is instant for NULL default)
ALTER TABLE orders ADD COLUMN customer_id BIGINT;

-- Create index on new column concurrently (no table lock)
CREATE INDEX CONCURRENTLY idx_orders_customer_id ON orders(customer_id);
```

**Phase 2 — Backfill existing rows (run during off-peak, no lock):**
```sql
-- Batch update: 10K rows at a time with a small delay to avoid I/O spike
DO $$
DECLARE batch_size INT := 10000;
DECLARE last_id BIGINT := 0;
BEGIN
  LOOP
    UPDATE orders SET customer_id = user_id
    WHERE id > last_id AND customer_id IS NULL
    LIMIT batch_size
    RETURNING MAX(id) INTO last_id;
    EXIT WHEN NOT FOUND;
    PERFORM pg_sleep(0.01);
  END LOOP;
END $$;
```

**Phase 3 — Dual write (Deploy 2):**
Application writes both `user_id` AND `customer_id`. Reads still use `user_id`.
Run for 48 hours minimum. Confirm `customer_id` is fully populated and consistent.

**Phase 4 — Switch reads (Deploy 3):**
Application now reads from `customer_id`. Still writes both.
Monitor for 48 hours. Rollback: flip reads back to `user_id` (fast, safe).

**Phase 5 — Remove old column (Deploy 4, after 1 week stable):**
```sql
-- Only after confirming no code references user_id on orders table
ALTER TABLE orders DROP COLUMN user_id;
DROP INDEX idx_orders_user_id;
```

**Zero downtime guarantee:** Each step is a backwards-compatible deploy. Rollback at any step before Phase 5 = flip the deploy. After Phase 5 = forward-only (schedule a maintenance window if you hit issues — won't happen).

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
