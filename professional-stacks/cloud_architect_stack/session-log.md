# Architecture Session Log

A record of cloud architecture design decisions, reviews, and discussions.

---

## Format

Each session entry captures:
- **Date** — When the architecture was designed/reviewed
- **System** — What was designed (application name, workload type)
- **Decision** — Key architectural choice made
- **Rationale** — Why this decision (constraints, tradeoffs, alternatives)
- **Cost Impact** — Estimated monthly cost
- **Risk/Mitigation** — Known limitations and how we address them
- **Status** — Design, review, deployed, sunset

---

## Session Template

```
### [Date] — [System Name]

**Decision:** [What architectural choice was made?]

**Rationale:**
- Constraint 1: [e.g., "Must support 10K RPS, 99.99% SLO"]
- Constraint 2: [e.g., "HIPAA compliance required"]
- Constraint 3: [e.g., "Budget $5K/month max"]

**Alternatives considered:**
- Option A: [Description] — Rejected because [reason]
- Option B: [Description] — Rejected because [reason]
- Option C: [Description] — Selected because [reason]

**Architecture:**
[Brief topology description or reference to diagram]

**Cost estimate:**
- Compute: $X/month
- Storage: $Y/month
- Data transfer: $Z/month
- Managed services: $W/month
- **Total: $[X+Y+Z+W]/month**

**Risk & Mitigation:**
- Risk 1: [What could go wrong?] → Mitigated by [how]
- Risk 2: [What could go wrong?] → Mitigated by [how]

**RTO/RPO:**
- RTO: [minutes]
- RPO: [seconds/minutes]
- Backup location: [cross-region / same-region]

**Status:** [Design / Review / Deployed / Sunset]

**Notes:** [Additional context, action items, follow-ups]
```

---

## Example Sessions

### 2026-06-15 — Customer Portal Microservices

**Decision:** Migrate from monolithic Rails app to containerized microservices on EKS.

**Rationale:**
- Constraint 1: Must scale to 50K concurrent users (currently hitting limits at 5K on t3.xlarge)
- Constraint 2: Release cycle needs to go from 2 weeks to 2 days
- Constraint 3: Cloud budget is $50K/month (currently $8K on EC2)

**Alternatives considered:**
- Option A: Vertical scaling (larger EC2 instances) — Rejected: hits compute limit, becomes expensive fast
- Option B: Auto-scaled ASG with RDS replica — Rejected: doesn't solve release cycle or operational complexity
- Option C: EKS with microservices architecture — Selected: enables independent scaling, faster deploys, modern observability

**Architecture:**
```
ALB → EKS (3-node per AZ, 2 AZs) → RDS (Aurora PostgreSQL, read replicas)
                                 → ElastiCache (Redis)
                                 → S3 (object storage)
```

**Cost estimate:**
- EKS control plane: $73/month
- Compute (6 m5.2xlarge): $4,200/month
- RDS (db.r6g.2xlarge, 2 read replicas): $2,800/month
- ElastiCache (cache.r6g.xlarge): $800/month
- Data transfer: $1,500/month
- **Total: $9,373/month** (well within $50K budget)

**Risk & Mitigation:**
- Risk: Team not experienced with Kubernetes → Mitigated by: EKS managed control plane, CloudFormation templates, runbook training
- Risk: Database scaling becomes bottleneck → Mitigated by: Read replicas, caching strategy, query optimization
- Risk: Increased monitoring complexity → Mitigated by: CloudWatch Container Insights, Prometheus, ELK stack

**RTO/RPO:**
- RTO: 5 minutes (EKS self-healing + ALB redirect to secondary AZ)
- RPO: 1 minute (RDS backup frequency)
- Backup location: Cross-region Aurora replication to us-west-2

**Status:** Deployed (2026-05-20)

**Notes:** 
- Team completed EKS bootcamp (2026-04-15)
- Service mesh (Istio) deferred to Q4 2026
- Cost tracking in CloudWatch Dashboards updated
- Quarterly DR drill scheduled for 2026-08-15

---

### 2026-06-10 — Data Lake Redesign

**Decision:** Move from Hadoop/Spark cluster to serverless data pipeline (Glue + Athena + S3).

**Rationale:**
- Constraint 1: Job failures require manual intervention; need 24/7 operations support
- Constraint 2: Data volume growing 50% annually; cluster capacity unpredictable
- Constraint 3: SQL team wants to query raw data without Spark expertise

**Alternatives considered:**
- Option A: Keep Hadoop, add managed YARN → Rejected: still requires operations overhead, complex tuning
- Option B: Databricks (managed Spark) → Rejected: higher cost ($40K/month vs. $8K for Glue), vendor lock-in concerns
- Option C: AWS Glue + Athena → Selected: serverless scaling, SQL-native, integrates with data catalog, lower cost

**Architecture:**
```
S3 (raw data) → Glue ETL jobs → S3 (processed parquet) → Athena → QuickSight
            → Glue Data Catalog (metadata)
```

**Cost estimate:**
- Glue jobs (100 DPU-hours/month): $4,800/month
- S3 storage (100 TB): $2,300/month
- Athena queries (100 TB scanned): $500/month
- **Total: $7,600/month** (down from $12K on Hadoop)

**Risk & Mitigation:**
- Risk: Glue job timeout on large transformations → Mitigated by: Job bookmarks, partitioned reads, DPU scaling
- Risk: Athena performance degrades with data volume → Mitigated by: Parquet format, columnar storage, partition projection
- Risk: Data consistency on partial job failure → Mitigated by: Idempotent job design, step functions for orchestration

**RTO/RPO:**
- RTO: 30 minutes (re-run failed Glue job)
- RPO: Daily (full daily load cycle)
- Backup location: S3 cross-region replication

**Status:** Design (in review)

**Notes:**
- Data eng team needs Glue job writing training (2026-06-20)
- Athena cost optimization via partition pruning (action item)
- Hadoop cluster sunset scheduled for 2026-09-30

---

### 2026-06-05 — EU Data Residency Compliance

**Decision:** Replicate production workload to eu-west-1 (Ireland) for GDPR compliance.

**Rationale:**
- Constraint 1: EU customers require data residency in EU
- Constraint 2: SLO: 99.95% (18-minute annual downtime allowed)
- Constraint 3: RTO: 1 hour, RPO: 15 minutes

**Alternatives considered:**
- Option A: Single region eu-west-1 (Ireland) → Rejected: doesn't meet 99.95% SLO without cross-region, too much risk
- Option B: Multi-region active-active → Rejected: complexity/cost too high for this workload
- Option C: Multi-region active-passive (failover) → Selected: meets SLO, acceptable complexity, reasonable cost

**Architecture:**
```
Primary (us-east-1) ←→ Secondary (eu-west-1)
  - RDS sync replication
  - S3 cross-region replication
  - Route 53 failover routing
  - SQS dead-letter queues in primary only
```

**Cost estimate:**
- Additional eu-west-1 infrastructure: $18K/month
- Cross-region data transfer: $3K/month
- **Total additional: $21K/month**

**Risk & Mitigation:**
- Risk: Network latency on cross-region writes → Mitigated by: Async replication, SQS for event delivery
- Risk: Failover DNS propagation delay → Mitigated by: TTL=60 seconds, Route 53 health checks
- Risk: Data inconsistency during failover → Mitigated by: Application idempotency, distributed tracing

**RTO/RPO:**
- RTO: 5 minutes (Route 53 detects primary failure, routes to secondary)
- RPO: 5 minutes (RDS sync lag, S3 eventual consistency)
- Failover testing: Monthly

**Status:** Deployed (2026-06-01)

**Notes:**
- EU naming convention documented in runbook
- Customer notification process for failover events defined
- Quarterly compliance audit scheduled with DPO

---

## Metrics & Tracking

### Cost Tracking

| Quarter | System | Estimated | Actual | Variance | Owner |
|---------|--------|-----------|--------|----------|-------|
| Q2 2026 | Customer Portal | $9,373 | $9,521 | +$148 (+1.6%) | @platform-team |
| Q2 2026 | Data Lake | TBD | TBD | TBD | @data-eng-team |
| Q2 2026 | EU Compliance | $21,000 | TBD | TBD | @infra-team |

### Deployment Status

| System | Go-live | Incidents | MTTR | SLO Achievement |
|--------|---------|-----------|------|-----------------|
| Customer Portal | 2026-05-20 | 0 | N/A | 100% |
| Data Lake | Planned 2026-07-01 | - | - | - |
| EU Compliance | 2026-06-01 | 1 | 3m | 100% |

---

**Last updated:** 2026-06-15
