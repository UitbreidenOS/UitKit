# /plan-recovery Command

Design disaster recovery plan including RTO/RPO targets, backup strategy, failover procedures, and recovery testing schedule.

## Input Parameters

Provide:
- **System criticality** — Critical (SaaS revenue), important (support tools), non-critical (dev/test)
- **Current state** — Existing backups, replication, failover capabilities
- **Business constraints** — RTO/RPO targets, budget for DR, acceptable data loss/downtime
- **Compliance requirements** — HIPAA, SOC2, PCI-DSS backup audit requirements
- **Scale** — Database size, data volume, number of services, geographic reach

## Output Deliverable

Complete disaster recovery plan including:
1. **RTO/RPO targets** — Achievable recovery time and data loss windows
2. **Backup strategy** — Frequency, retention, location, testing schedule
3. **Replication architecture** — Sync vs. async, cross-region setup
4. **Failover procedure** — Step-by-step runbook for automated and manual failover
5. **Recovery testing** — Quarterly drill schedule, restore validation procedures
6. **Cost analysis** — Backup + replication infrastructure costs
7. **Incident response** — Detection, containment, recovery, post-incident procedures

## Example: Mission-Critical Database Recovery Plan

**Input:**
```
System: Order processing database (critical, revenue-impacting)
Current state: Single-region RDS, daily automated backups
RTO target: 15 minutes (acceptable peak loss: 150 orders = ~$15K)
RPO target: 5 minutes (acceptable loss: ~25 orders)
Compliance: PCI-DSS (backup audit, 1-year retention required)
Scale: 50 GB database, 100 GB/month backups, 10 read replicas
```

**Output:**

### 1. RTO/RPO Requirements

**Business impact analysis:**

```
Scenario 1: 1-hour outage
├─ Lost orders: 600 (at peak)
├─ Revenue impact: $60,000
├─ Customer frustration: High
├─ SLA violation: Yes (99.95% SLO = 21 min acceptable)
└─ Acceptance: Unacceptable

Scenario 2: 15-minute outage
├─ Lost orders: 150
├─ Revenue impact: $15,000
├─ Customer experience: Minimal (automatic retry)
├─ SLA impact: Tolerable (stays within annual budget)
└─ Acceptance: Acceptable

Scenario 3: 5-minute data loss
├─ Lost orders: 25
├─ Revenue impact: $2,500
├─ Compliance: PCI-DSS requires recovery, reachable
└─ Acceptance: Acceptable

Final targets:
- RTO: 15 minutes maximum (detect + failover + propagate)
- RPO: 5 minutes maximum (replication lag tolerance)
```

### 2. Backup Strategy

**Multi-tier backup approach:**

```
Tier 1: Automated daily backups (7-day retention)
├─ Trigger: 2:00 AM UTC every day
├─ Duration: ~30 minutes (for 50 GB database)
├─ Location: AWS RDS automated backup (regional)
├─ Cost: $500/month (backup storage)
├─ Recovery: 10 minutes (RDS restore)
├─ Use case: Recover from accidental deletion, corruption <7 days old

Tier 2: Cross-region backup copy (30-day retention)
├─ Trigger: Automatic snapshot copy (starts after daily backup)
├─ Duration: ~1 hour (for first copy, then incremental)
├─ Location: us-west-2 region (separate data center)
├─ Cost: $300/month (cross-region transfer + storage)
├─ Recovery: 15 minutes (cross-region restore + DNS switch)
├─ Use case: Recover from region-level outage, data loss <30 days

Tier 3: Monthly compliance backup (12-month retention)
├─ Trigger: Manual backup on 1st of each month
├─ Duration: ~30 minutes
├─ Location: S3 Glacier (archive storage)
├─ Cost: $150/month (archive storage)
├─ Recovery: 24 hours (Glacier retrieval + restore)
├─ Use case: Compliance audit, historical data recovery
└─ Retention: 12 months minimum (PCI-DSS requirement)

Total backup cost: $950/month
```

**Backup retention policy:**

```
Daily snapshots (7 days):
├─ Mon 2AM → Fri 2AM + Sat 2AM, Sun 2AM = 3 + 2 = 5 daily
├─ Keep oldest 1, delete others
└─ Rolling window: Keep latest 7 days worth

Weekly snapshots (4 weeks):
├─ Every Sunday 2AM → Keep 4 snapshots (most recent 4 Sundays)
└─ Delete daily snapshots >7 days old

Monthly snapshots (12 months):
├─ 1st of month 2AM → Keep 12 snapshots (Jan-Dec)
└─ Copy to Glacier for 12-month minimum

Compliance tracking:
├─ Backup completion email daily
├─ Missing backup alert (> 25 hours without backup)
└─ Monthly audit: Verify backups exist and are valid
```

### 3. Replication Architecture

**Multi-AZ with cross-region failover:**

```
Primary region (us-east-1):
├─ Primary database (us-east-1a)
│  └─ Synchronous replication to
├─ Secondary database (us-east-1b) [standby, read-only]
│  └─ RTO if primary fails: 30 seconds (automatic failover)
│  └─ RPO if primary fails: 0 (synchronous replication)
│
└─ Asynchronous replication to
   └─ Tertiary database (us-west-2) [backup, reads only]
      └─ RTO if region fails: 5 minutes (DNS switch)
      └─ RPO if region fails: 5 minutes (replication lag)

Diagram:
┌─────────────────────────────────────┐
│     us-east-1 (primary)             │
│ ┌─────────────────────────────────┐ │
│ │ Primary (us-east-1a)            │ │
│ │ WRITES / READS                  │ │
│ │ ↓ (sync replication)            │ │
│ │ Secondary (us-east-1b)          │ │
│ │ READS ONLY                      │ │
│ └─────────────────────────────────┘ │
│            ↓ (async)                 │
│ ┌─────────────────────────────────┐ │
│ │ Cross-region copy (us-west-2)   │ │
│ │ READS ONLY (lag: 5 min)         │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘

Route 53 (DNS):
├─ Primary: api-us-east-1.example.com → Primary (us-east-1a)
├─ Failover: api-us-east-1.example.com → Secondary (us-east-1b) if primary down
└─ Geo-DNS: api-eu.example.com → us-west-2 (for EU customers)
```

**Replication configuration:**

```hcl
# Multi-AZ with automatic failover
resource "aws_rds_cluster" "prod" {
  cluster_identifier      = "prod-cluster"
  engine                  = "aurora-postgresql"
  availability_zones      = ["us-east-1a", "us-east-1b", "us-east-1c"]
  db_subnet_group_name    = aws_db_subnet_group.prod.name
  
  # Replication
  backup_retention_period = 30  # Daily backups, 30-day retention
  backup_window           = "02:00-03:00"  # 2 AM UTC
  
  # Failover behavior
  preferred_backup_window = "02:00-03:00"
  preferred_maintenance_window = "sun:03:00-sun:04:00"
  
  # Encryption
  storage_encrypted       = true
  kms_key_id             = aws_kms_key.prod.arn
  
  # Monitoring
  enable_cloudwatch_logs_exports = ["postgresql"]
  enabled_cloudwatch_logs_exports = ["postgresql"]
}

# Cross-region backup (us-west-2)
resource "aws_rds_cluster" "dr" {
  provider                = aws.us-west-2
  restore_to_point_in_time {
    source_cluster_identifier = aws_rds_cluster.prod.arn
    restore_type             = "copy-on-write"
  }
  
  # Read-only replica
  copy_tags_to_snapshot   = true
}
```

### 4. Failover Procedures

**Automatic failover (zero manual intervention):**

```
Failure detection (CloudWatch):
├─ Primary database is unreachable
├─ Health check fails 3 times (30 seconds)
├─ RDS detects failure, initiates automatic failover
└─ Duration: 30-60 seconds

Failover execution:
├─ Secondary (us-east-1b) promoted to primary
├─ Promotion duration: ~30 seconds
├─ Establish new endpoints
└─ Start accepting writes

DNS update (Route 53):
├─ Health check detects primary failure
├─ Route 53 updates DNS to point to secondary
├─ DNS propagation: 30-60 seconds (depends on TTL)
└─ Clients redirect to new primary

Application reconnection:
├─ Connection pooling detects connection failure
├─ Reconnect to new primary endpoint (from DNS)
├─ Resume operations
└─ Duration: 10-30 seconds (depends on client)

Total RTO: 30s (failover) + 60s (DNS) + 30s (reconnect) = 2 minutes
Data loss: 0 (synchronous replication)

Monitoring & alerting:
├─ Incident alert: "Primary RDS failed, failover to secondary"
├─ PagerDuty: Wake up on-call engineer
├─ Slack: Alert #incidents channel
└─ CloudWatch: Log all failover events
```

**Manual failover (planned maintenance):**

```
Planned maintenance on primary (e.g., patching, upgrade):

Step 1: Announce maintenance window (24 hours advance)
├─ Update status page
├─ Alert key customers
├─ Prepare runbooks

Step 2: Prepare for failover
├─ Verify secondary is healthy and caught up
├─ Verify backup is recent
├─ Verify DNS health check is working

Step 3: Execute failover
├─ Issue RDS command: Failover cluster
│  aws rds failover-db-cluster --db-cluster-identifier prod-cluster
├─ Monitor: Failover takes ~1-2 minutes
├─ Verify: Read/write operations on secondary
└─ Duration: 5-10 minutes

Step 4: Perform maintenance on original primary
├─ Apply patches/updates
├─ Restart instance
├─ Duration: 30-60 minutes

Step 5: Verify and failback
├─ Verify original primary is healthy
├─ Issue RDS command: Failback to original primary
│  aws rds failover-db-cluster --db-cluster-identifier prod-cluster
├─ Verify: Operations on original primary
└─ Duration: 5-10 minutes

Step 6: Post-maintenance validation
├─ Run smoke tests
├─ Verify replication lag is 0
├─ Update on-call runbooks with findings

Total downtime: ~15 minutes (acceptable, planned)
Data loss: 0 (controlled failover)
```

### 5. Recovery Testing

**Quarterly disaster recovery drill:**

```
Schedule: Last Saturday of each quarter (Q1, Q2, Q3, Q4)
Duration: 2-3 hours
Scope: Full system recovery (database + application)
Participants: DevOps team, on-call engineer, manager
Success criteria: RTO/RPO targets met

Drill procedure:

Step 1 (30 min): Setup
├─ Announce drill (Slack, status page: "MAINTENANCE MODE")
├─ Pause all customer traffic (if simulating region outage)
├─ Take snapshot of current state (for rollback if needed)

Step 2 (60 min): Simulate failure
├─ Primary region failure: Stop primary RDS instance
├─ Measure: Time from failure to secondary taking over
├─ Validate: Secondary is receiving writes correctly
├─ Measure: DNS failover time (should be <2 min)

Step 3 (60 min): Restore from backup
├─ Restore from daily backup to test environment
├─ Measure: Time to restore (target: <10 min)
├─ Validate: Data integrity, record count matches
├─ Verify: No data loss beyond RPO target

Step 4 (30 min): Recovery
├─ Failback to primary (re-promote original primary)
├─ Measure: Time to failback
├─ Validate: Replication catches up (0 lag)
├─ Resume production traffic

Post-drill documentation:
├─ Actual RTO: [X minutes] vs. target [15 minutes]
├─ Actual RPO: [Y minutes] vs. target [5 minutes]
├─ Issues encountered: [List]
├─ Improvements needed: [List]
├─ Runbook updates: [Changes made]
├─ Team training: [Observations about readiness]

Example result:
┌─────────────────────────────────────┐
│ Drill Results (Q2 2026)              │
├─────────────────────────────────────┤
│ Failure detection: 45 seconds        │
│ Failover execution: 35 seconds       │
│ DNS propagation: 50 seconds          │
│ Application reconnection: 20 seconds │
│ Total RTO: 150 seconds (2.5 min)    │
│ Target: 15 minutes ✓ PASS            │
│                                       │
│ Data loss: 0 bytes                   │
│ Target: 5 minutes ✓ PASS             │
│                                       │
│ Issues found:                        │
│ - Health check timeout too long (30s) │
│ - DNS TTL too high (60s), reduce to 10s
│ - On-call runbook missing DNS step   │
│                                       │
│ Actions:                             │
│ - Reduce health check to 10s         │
│ - Update Route 53 TTL to 10 seconds  │
│ - Update runbook, re-train team      │
│ - Schedule next drill: Q3            │
└─────────────────────────────────────┘
```

**Monthly backup validation:**

```
Every 1st of month: Restore daily backup to isolated environment

Procedure (15 minutes):
├─ Pick random backup from past 7 days
├─ Restore to non-production environment
├─ Query sample tables (verify data integrity)
├─ Check record counts match expected
├─ Delete restored database
└─ Document: Backup size, restore time, data integrity

Result logged:
Date: 2026-06-15
Backup ID: rds-snapshot-2026-06-14-02-00
Restore time: 8 minutes 32 seconds
Data integrity: PASS (12.5M rows, expected 12.5M)
Status: HEALTHY
Tester: @devops-engineer
```

### 6. Cost Analysis

**Disaster recovery infrastructure costs:**

```
Backup storage (daily, 7-day retention):
├─ 7 snapshots × 50 GB each = 350 GB
├─ Cost: 350 GB × $0.023/GB = $8/month
└─ Data transfer to cross-region: $0/month (first GB free)

Cross-region backup (30-day retention):
├─ 30 snapshots × 50 GB each = 1,500 GB
├─ Cost: 1,500 GB × $0.023/GB = $35/month
└─ Data transfer: 50 GB/day × $0.02/GB = $30/month

Monthly archive (Glacier, 12-month retention):
├─ 12 backups × 50 GB each = 600 GB
├─ Cost: 600 GB × $0.004/GB = $2.40/month
└─ Data transfer to Glacier: $5/month (one-time monthly)

Multi-AZ replication (synchronous):
├─ Primary: $1 per unit-hour = $730/month
├─ Secondary (read replica): $0.50 per unit-hour = $365/month
├─ Cost: Included in RDS (no additional charge for synchronous)

Cross-region read replica (asynchronous):
├─ Replica: $730/month (50 GB database)
└─ Data transfer: 50 GB/month × $0.02/GB = $1,000/month

Monitoring (CloudWatch, Route 53):
├─ CloudWatch: $10/month (extra metrics)
├─ Route 53 health checks: $50/month (1 check)
└─ Total: $60/month

Total DR monthly cost: $1,040/month
Total backup monthly cost: $50/month

Combined: $1,090/month (1.3% of $85K total infrastructure cost)

ROI: Protects $15K+ per hour of downtime
Insurance value: "Pay $1K/month to avoid $15K+ loss"
```

### 7. Incident Response Procedures

**When backup/recovery is needed:**

```
Detection phase:
├─ CloudWatch alert: "Backup failed"
├─ Or: "Data corruption detected"
├─ Or: Customer reports: "Missing orders"

Assessment phase (15 minutes):
├─ Verify issue scope (which data affected?)
├─ Determine data loss window
├─ Calculate recovery impact (how many rows lost?)
├─ Decide: Failover vs. restore from backup?

Recovery options:

Option A: Point-in-time restore (if corruption detected)
├─ Restore to known-good state (1-2 hours ago)
├─ Downtime: 10-20 minutes (restore time)
├─ Data loss: Last 1-2 hours of transactions
├─ Use case: Accidental deletion, bad deployment

Option B: Failover to secondary (if primary fails)
├─ Secondary takes over (2-5 minutes)
├─ Downtime: 2-5 minutes
├─ Data loss: 0-5 minutes (replication lag)
├─ Use case: Primary instance failure

Option C: Restore from cross-region backup (if region down)
├─ Restore from us-west-2 backup to new primary
├─ Downtime: 15-30 minutes (restore + switchover)
├─ Data loss: 5-30 minutes (depends on backup age)
├─ Use case: Entire region down

Communication:
├─ Customer alert: "We detected a problem and are recovering"
├─ Status page: Update every 5 minutes
├─ Slack #incidents: Real-time updates
├─ PagerDuty: Escalate if >15 min

Recovery execution:
├─ Run recovery procedure from runbook
├─ Test restored data: "Does it look right?"
├─ Failback: Return to primary (if applicable)
├─ Validation: Replication caught up? No data loss?

Post-incident:
├─ RCA: Why did this happen?
├─ Action items: Prevent recurrence
├─ Documentation: Update runbooks
├─ Customer notification: Explain what happened
├─ Team debrief: What went well? What to improve?
```

### 8. Compliance Checklist

**Before production deployment:**

- [ ] RTO/RPO targets defined and documented
- [ ] Backup policy defined and automated
- [ ] Cross-region replication configured
- [ ] Failover procedure tested
- [ ] Restore time measured (<15 minutes)
- [ ] Data integrity validated post-restore
- [ ] Runbook written and accessible 24/7
- [ ] Team trained on recovery procedures
- [ ] On-call engineer familiar with runbook
- [ ] Quarterly drill scheduled and completed
- [ ] Monitoring alerts configured
- [ ] Cost estimated and approved
- [ ] Compliance audit scheduled (annual)

---

**Success metrics:**

Track quarterly:
- Backup completion rate: 100%
- Backup validation rate: 100% monthly
- Recovery drill completion: 100%
- RTO actual vs. target: <15 minutes
- RPO actual vs. target: <5 minutes
- Mean time to recovery (MTTR): <30 minutes
- Customer impact incidents: Minimize
