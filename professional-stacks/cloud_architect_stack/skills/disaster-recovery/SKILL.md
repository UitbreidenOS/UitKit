# Disaster Recovery Planning

## When to activate

When designing recovery strategies, defining RTO/RPO targets, planning backup approaches, or designing failover systems.

## When NOT to use

For non-critical systems where data loss is acceptable, or development/testing environments.

## Instructions

Disaster recovery (DR) is insurance. The goal is to minimize data loss (RPO) and downtime (RTO) while balancing cost. Follow this framework:

### 1. Define Requirements

Every system needs RTO and RPO targets:

**RTO (Recovery Time Objective):** How long can the system be down?
- Critical production: 15 minutes - 1 hour
- Important services: 1-4 hours
- Non-critical: 24+ hours
- Development: No requirement

**RPO (Recovery Point Objective):** How much data loss is acceptable?
- Critical production: < 5 minutes (near real-time)
- Important services: < 1 hour
- Non-critical: < 24 hours
- Development: No requirement

**SLO relationship:**
```
99.9% uptime = 43 minutes downtime/month
 99.95% uptime = 21 minutes downtime/month
 99.99% uptime = 4 minutes downtime/month
```

### 2. Failure Scenarios

Design recovery for these scenarios:

**a) Data corruption/deletion**
- Backups restore clean state
- RPO = time since last backup
- RTO = time to restore

**b) Single instance failure**
- Other instances take over immediately
- Data replicated elsewhere
- RTO = seconds (automatic failover)
- RPO = near-zero (continuous replication)

**c) Zone/region outage**
- Failover to different zone or region
- DNS or load balancer redirects traffic
- RTO = minutes (detect + route)
- RPO = depends on replication lag

**d) Application bug or ransomware**
- Restore from clean backup
- Quarantine affected system
- Investigate root cause before restoring

### 3. Backup Strategy

**Backup pyramid:**

```
Frequency  Retention  Purpose
Daily      7 days     Quick recovery from recent failures
Weekly     4 weeks    Recovery from week-ago corruption
Monthly    12 months  Regulatory/compliance requirement
Yearly     7 years    Long-term archive
```

**Implementation:**

```
Database backups:
- Automated daily snapshots (AWS RDS automated backup)
- Cross-region copy within 24 hours
- Retention: 35 days (API limit)
- Test restore: weekly

Application data backups:
- S3 versioning (protects accidental delete)
- S3 cross-region replication (protects region outage)
- Compliance archive (move to Glacier after 90 days)

Backup cost (100 GB database):
- Daily snapshots: $20/month
- Cross-region copy: $30/month
- Retention: $10/month
- Total: $60/month for backup peace of mind
```

### 4. Replication Strategy

**Synchronous replication (RPO = 0):**
- All writes replicated before returning to client
- Slower (wait for replica acknowledgment)
- Zero data loss
- Use for: Critical financial data

Example: RDS Multi-AZ synchronous replication
```
Client write → Primary (us-east-1a) → Secondary (us-east-1b) → Return success
Latency impact: ~10-50ms additional
```

**Asynchronous replication (RPO = seconds/minutes):**
- Writes return to client, replicate in background
- Faster, but short data loss window
- Use for: Most applications

Example: S3 cross-region replication
```
Client write → us-east-1 S3 → Return success → Async copy to eu-west-1
Replication lag: < 15 minutes (typically < 1 minute)
```

**Event-driven replication (RPO = app-specific):**
- Application sends events to queue, replicated async
- Application controls what to replicate
- Use for: Selective replication (not all data critical)

### 5. Failover Process

**Automatic failover (no human intervention):**

```
1. Health check detects primary failure
   └─ 3 consecutive failed checks = 30 seconds
2. DNS/load balancer redirects to secondary
   └─ 30-60 second propagation delay
3. Secondary becomes primary
   └─ Any pending replication caught up
4. Alert sent to operations team
   └─ "Primary region failed, now running secondary"
5. Investigate primary, bring back online

Downtime: 30-90 seconds
Data loss: Depends on replication lag (0-5 minutes)
```

**Manual failover (planned maintenance):**

```
1. Announce maintenance window
2. Stop writing to primary
3. Verify secondary caught up
4. Point DNS to secondary
5. Resume operations
6. Perform maintenance on primary
7. Verify primary, resume replication
8. Switch back (or stay on secondary)

Downtime: 5-30 minutes (planned)
Data loss: 0 (we waited for replication)
```

### 6. Multi-Region Architecture

**Active-Passive (One region active, one standby):**

```
┌─────────────────┬─────────────────┐
│   us-east-1     │   eu-west-1     │
│   ACTIVE        │   STANDBY       │
├─────────────────┼─────────────────┤
│ App (running)   │ App (stopped)    │
│ Database        │ Database replica │
│ Write traffic   │ Read-only        │
│ RTO: 5 min      │                  │
│ RPO: 1 min      │                  │
└─────────────────┴─────────────────┘

Cost: ~1.5× single region (data replication overhead)
Failover: Detect primary failure, start secondary, update DNS
```

**Active-Active (Both regions active):**

```
┌─────────────────┬─────────────────┐
│   us-east-1     │   eu-west-1     │
│    ACTIVE       │    ACTIVE       │
├─────────────────┼─────────────────┤
│ App (running)   │ App (running)    │
│ Database        │ Database         │
│ Write traffic   │ Write traffic    │
│ RTO: 0s         │ (Bi-directional │
│ RPO: 0s         │  sync)          │
└─────────────────┴─────────────────┘

Cost: ~2× single region
Complexity: High (eventual consistency, conflict resolution)
Benefit: No failover needed, already running secondary
Use case: Global applications requiring <100ms latency
```

### 7. Disaster Recovery Runbook

**Template for critical system:**

```
# DR Runbook: [System Name]

## Detection
- RTO target: [minutes]
- Monitoring alert: [Condition that triggers DR]
- Escalation: [Who gets paged]

## Immediate Actions (0-5 minutes)
1. Confirm primary failure (not network blip)
2. Page oncall engineer
3. Assess data loss window (log replication lag)
4. Decision: failover or restore?

## Failover Procedure (5-30 minutes)
1. Update DNS to secondary region
   ```bash
   aws route53 change-resource-record-sets \
     --hosted-zone-id Z1234567890ABC \
     --change-batch file://failover.json
   ```
2. Verify secondary is healthy
   ```bash
   curl https://api.example.com/health
   ```
3. Alert customers of incident
4. Monitor error rates, latency
5. Log all actions in incident tracker

## Recovery Procedure (30+ minutes)
1. Investigate primary failure (logs, metrics)
2. Determine if fixable or requires full rebuild
3. If fixable: fix primary, resync, failback
4. If rebuild: launch new infrastructure, resync
5. Validate primary before resuming writes
6. Failback to primary (or stay on secondary)

## Post-Incident (24 hours)
1. Full RCA (root cause analysis)
2. Identify preventive actions
3. Update runbook based on lessons learned
4. Schedule architecture review

## Key Contacts
- On-call: @engineer-name
- Manager: @manager-name
- Customer support: support@example.com
- Executive escalation: @cto-name

## Tools & Access
- SSH key: [location]
- AWS console: [IAM role]
- Database admin: [connection string]
- Slack escalation: #incident-response
```

### 8. Testing & Validation

**Backup restore test (quarterly):**

```bash
# Restore from backup to isolated environment
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier prod-backup-test \
  --db-snapshot-identifier prod-snapshot-2026-06-15

# Validate data
mysql -h prod-backup-test.xxx.rds.amazonaws.com \
  -u admin -p -e "SELECT COUNT(*) FROM users;"

# Cleanup
aws rds delete-db-instance \
  --db-instance-identifier prod-backup-test \
  --skip-final-snapshot
```

**Failover drill (monthly):**

```
1. Schedule 30-minute maintenance window
2. Simulate primary region failure
   └─ Stop primary database (don't delete)
3. Failover to secondary
4. Verify traffic routes correctly
5. Measure failover time (target: < 5 min)
6. Restore primary, resync
7. Document findings

Example result:
- Detection time: 45 seconds
- DNS propagation: 30 seconds
- Total RTO: 75 seconds (meets 5-min target)
- Data loss: 0 (replication caught up)
- Finding: CloudWatch alarm delay, need to tune thresholds
```

**Chaos engineering (advanced):**

```
Use tools like LitmusChaos or Netflix Chaos Monkey:
- Randomly kill instances
- Simulate network partition
- Introduce latency
- Test system resilience
```

### 9. Cost vs. Availability Tradeoff

| Strategy | RTO | RPO | Cost Multiplier | Use Case |
|----------|-----|-----|-----------------|----------|
| Backups only | 4 hours | 24 hours | 1.1× | Non-critical, can tolerate downtime |
| Async replication | 15 min | 5 min | 1.5× | Important services |
| Sync replication | 5 min | 0 min | 2× | Critical production |
| Active-active | 0 min | 0 min | 2.5× | Global SaaS, zero downtime required |

**Decision framework:**
- Single instance + daily backups: $2K/month, RTO=4h
- Multi-AZ with RTO=15min: $3K/month
- Multi-region active-passive: $5K/month
- Difference: $2-3K for 3h 45m of additional safety

### 10. Compliance & Audit

Track for compliance:

- [ ] RTO/RPO targets documented
- [ ] Backup policy defined and implemented
- [ ] Backups tested quarterly
- [ ] Failover drill completed (monthly/quarterly)
- [ ] Incidents logged and analyzed
- [ ] Recovery time measured (actual vs. target)
- [ ] DR runbook kept current
- [ ] Team trained on DR procedures

---

## Example

### E-commerce Platform DR Plan

**System:** Order processing database (critical)

**Requirements:**
- RTO: 15 minutes (peak orders 10K/hour, loss is revenue impact)
- RPO: 5 minutes (acceptable order loss: ~800 orders = $30K worst case)
- SLO: 99.95% uptime

**Current state (risky):**
```
Single region, single database
- Backups: Daily, local only
- RTO if failure: 4+ hours (restore from daily backup)
- RPO: 24 hours
- Risk: Entire day of orders lost
```

**Proposed solution (meets requirements):**
```
Multi-AZ RDS with async replication:
- Primary: us-east-1a
- Secondary: us-east-1b (automatic failover)
- Backup: Daily + cross-region copy
- Replication: Asynchronous, lag < 1 minute
- RTO: 5 minutes (failover detection + DNS)
- RPO: 1 minute (replication lag)
```

**Architecture:**
```
ALB (multi-AZ) → RDS Multi-AZ
├─ Primary (us-east-1a)
├─ Secondary (us-east-1b, read-only)
└─ Backup (daily snapshot, copied to us-west-2)

Route 53 health check:
- Test primary endpoint every 30 seconds
- If 3 consecutive failures: failover to secondary
- CloudWatch alarm notifies operations
```

**Failover timeline:**
```
T+0s:    Primary database fails
T+30s:   Health check detects failure (3 checks × 10s each)
T+45s:   RDS automatic failover initiates
T+90s:   Secondary promoted to primary
T+120s:  Route 53 updates DNS
T+150s:  Traffic reroutes (DNS TTL = 30s, some clients cached)
Total RTO: 150 seconds (meets 15-min target)
```

**Testing:**
```
Quarterly drill:
1. Stop primary RDS instance
2. Measure failover time
3. Verify orders still processing
4. Check for data loss
5. Document findings
6. Restore primary
7. Brief team on results

Monthly backup restore:
1. Restore from snapshot to test environment
2. Validate data integrity
3. Confirm restore time < 15 minutes
```

**Cost:**
```
Single-region baseline:   $1,500/month
Multi-AZ premium:         +$400/month
Cross-region backup:      +$200/month
Total DR cost:            $2,100/month
Protection: $0 loss vs. $30K+ exposure
ROI: Infinitely positive
```

---

**Version:** 1.0  
**Last updated:** 2026-06-15
