# Disaster Recovery Planner

## When to activate

When designing disaster recovery strategies, backup procedures, and recovery runbooks. Use when:
- Defining RTO (recovery time) and RPO (recovery point) objectives
- Designing backup strategy (incremental, differential, continuous replication)
- Planning failover and switchover procedures
- Creating operational runbooks for specific disaster scenarios
- Validating recovery procedures through drills
- Planning geographic disaster recovery (cross-region failover)

## When NOT to use

- For routine operational procedures (use operational guides)
- For consensus protocol design (use consensus-protocol-designer)
- For failure mode analysis (use failure-mode-analyzer)
- For security disaster recovery (use security review)

## Instructions

Disaster recovery ensures systems can recover from catastrophic failures: entire node loss, data corruption, region outages, or operator error. The planner should:

1. **Define RTO and RPO targets**
   - RTO (Recovery Time Objective): how long can system be down? (seconds, minutes, hours)
   - RPO (Recovery Point Objective): how much data loss is acceptable? (zero loss, last 5 min, last hour)
   - Business impact: what revenue/reputation loss occurs per minute of downtime?
   - Constraints: infrastructure cost to achieve RTO/RPO, complexity tradeoffs

2. **Enumerate disaster scenarios**
   - Data center failure: entire region unreachable
   - Multiple simultaneous node failures: correlated failure (power outage, network failure)
   - Data corruption: bug in code writes bad data, replicas also corrupted
   - Operator error: accidental delete, wrong migration
   - Byzantine node: compromised node spreading bad data
   - Disk failure: hard drive dies, data unrecoverable locally
   - Cascade failure: one failure triggers others, system unavailable

3. **Design backup strategy**
   - Backup location: local disk, remote storage (S3, GCS), offline tape
   - Backup frequency: continuous replication (instant), hourly, daily
   - Backup scope: full database, incremental changes, transaction log
   - Backup retention: how long to keep old backups (7 days, 30 days, years)
   - Backup verification: periodically restore from backup to validate

4. **Design replication for DR**
   - Local replication: replicate within same datacenter (fast, not resilient to DC outage)
   - Cross-region replication: replicate to another region (slower latency, resilient to DC outage)
   - Async vs. sync: async faster but risk data loss, sync safer but slower writes
   - Quorum placement: how many replicas in each region? (e.g., 3/5 local, 0/5 remote)
   - Read replication lag: accept stale reads in remote region to improve write latency

5. **Design failover procedure**
   - Failover detection: how is primary failure detected? (heartbeat, explicit health check)
   - Failover trigger: automatic (script), semi-automatic (alert + button), manual
   - Failover timing: how long before failover is initiated? (RTO budget)
   - Switchover: if primary recovers later, how do you decide who is primary now?
   - Data reconciliation: if two regions both acted as primary, how to merge?

6. **Design recovery procedure**
   - Failed node recovery: restart process, replay log, catch up with leader
   - Corrupt data recovery: restore from backup, point-in-time recovery if available
   - Region failure recovery: promote replica in backup region to primary
   - Full cluster recovery: restore from full backup, bring up from scratch
   - Validation: verify data integrity after recovery

7. **Create runbooks for each scenario**
   - Step-by-step procedures (not flowcharts, literal steps)
   - Manual commands to execute (scripts preferred, but document the steps)
   - Verification steps (how to confirm recovery is successful)
   - Rollback procedures (if recovery goes wrong, how to undo)
   - Communication: who to notify, escalation chain

8. **Plan recovery drills**
   - Frequency: quarterly at minimum, monthly ideal
   - Scope: test full recovery procedure, not just partial
   - Documentation: document what fails, what works, update runbooks
   - Metrics: measure actual RTO in drill (should match target)
   - Team involvement: practice so operators know procedure by heart

Output should include:
- RTO/RPO targets with business justification
- Backup strategy specification (frequency, location, retention)
- Replication design for DR (cross-region, quorum)
- Failover/switchover procedures (automated or manual steps)
- Recovery runbooks for each disaster scenario
- Data validation procedures (consistency checks)
- Drill schedule and success criteria
- Monitoring and alerting for DR metrics

## Example

**Production Kafka Cluster Disaster Recovery**

**RTO/RPO Targets:**
```
RTO: 5 minutes (acceptable downtime for metrics pipeline)
RPO: 0 seconds (zero message loss, every message must be persisted before ack)
Business impact: $10k revenue per minute of downtime (2000 clients affected)
Infrastructure cost: $50k/month for cross-region replication (acceptable)
```

**Disaster Scenarios:**

| Scenario | Likelihood | Impact | RTO | RPO | Response |
|---|---|---|---|---|---|
| Single broker failure | High (weekly) | 1/3 throughput | 5 min | 0 sec | Auto-failover replica |
| Network partition | Medium (monthly) | Minority brokers unavailable | 5 min | 0 sec | Quorum prevents split-brain |
| Data center outage | Low (yearly) | 1/3 cluster offline | 15 min | 0 sec | Promote backup region |
| Disk failure | Medium (quarterly) | Loss of broker data | 30 min | 0 sec | Restore from backup, catch-up |
| Operator error (delete topic) | Low (yearly) | Lost 2 hours of data | 2 hours | 2 hours | Restore from backup |
| Byzantine node | Low (exploited system) | Bad data replicated | 1 hour | depends | Detect via consistency check, manual recovery |

**Backup Strategy:**

```
Local backup (same datacenter):
  - RAID-6 storage: 2 concurrent disk failures tolerated
  - Snapshot frequency: hourly (captured via filesystem snapshot)
  - Retention: 7 days (21 snapshots)
  - Restore time: 10 minutes (restore from snapshot + catch-up)

Remote backup (different region):
  - S3 nightly snapshot: daily incremental backup to AWS S3
  - Retention: 30 days
  - Restore time: 30 minutes (download from S3 + catch-up)

Transaction log replication:
  - Real-time: messages replicated to backup region before ack
  - Latency: +50ms write latency (network RTT to backup region)
  - Durability: 0 message loss (backup region always up-to-date)
```

**Replication Design (Kafka 3-broker cluster):**

```
Local (Primary Datacenter):
  - Broker 1, Broker 2, Broker 3 (in-sync replicas)
  - Quorum: 2/3 acknowledgments required for message ack
  - Failover: automatic to remaining brokers

Remote (Backup Datacenter):
  - Broker 4, Broker 5 (read replicas, not in quorum)
  - Replication lag: 50-200ms (network latency)
  - Failover: if primary datacenter fails, Broker 4/5 can be promoted (but lose 50-200ms of messages)

Message topology:
  Producer writes to partition leader in primary datacenter
  Leader acks after 2/3 local brokers acknowledge
  Simultaneously replicates to brokers 4/5 in backup (asynchronously)
  Consumer reads from any broker (if ok with stale reads)
```

**Single Broker Failure Recovery (Auto):**

```
T=0s: Broker 1 crashes
T=2s: Other brokers detect heartbeat timeout
T=5s: Controller marks Broker 1 as offline
T=10s: Controller starts partition rebalancing
  - Partitions with leader on Broker 1 elect new leader from replicas
  - Partitions rebalance followers to restore 3-way replication
T=30s: Rebalancing complete, system back to normal
RTO: 30 seconds
RPO: 0 (no message loss)
Operator action: NONE (fully automatic)
```

**Network Partition (Primary vs. Backup):**

```
T=0s: Network partition occurs
T=60s: Primary datacenter detects backup unreachable
T=65s: Backup detects primary unreachable
Primary datacenter actions:
  - Continues normal operation (quorum present locally)
  - Messages delivered to consumers normally
  - Replication to backup fails (network down)
Backup datacenter actions:
  - Monitors for primary recovery signal
  - Cannot promote brokers (would split-brain)
  - Clients in backup region: get "broker unreachable" errors
T=300s: Network healed, partition detection resolves
T=305s: Backup brokers catch up with primary (replicate 5 minutes of messages)
T=400s: System fully recovered
RTO: 400 seconds (6.7 min, exceeds 5 min target)
RPO: 0 (no loss, but inconsistent reads during partition)
Operator action: Monitor recovery, may need to restart backup brokers if stuck
```

**Data Center Failure Recovery (Manual Failover):**

```
Scenario: Primary datacenter power outage, expected down for 2+ hours
Decision: Promote backup datacenter to primary

Runbook:
1. Verify primary datacenter is truly offline (check multiple sources: network, DNS, ops dashboard)
2. On backup datacenter:
   ```bash
   # Step 1: Mark brokers as in-sync (they're currently read-only replicas)
   kafka-configs.sh --alter --entity-type brokers --entity-name 4,5 \
     --add-config replica.fetch.max.bytes=104857600
   
   # Step 2: Force leader election for all partitions
   kafka-leader-election.sh --bootstrap-server broker4:9092 \
     --election-type unclean \
     --all-topic-partitions
   ```
   (unclean election allows non-in-sync replicas to become leader, accepting some message loss)
3. Verify all partitions have leaders in backup datacenter
   ```bash
   kafka-topics.sh --bootstrap-server broker4:9092 --describe --under-replicated-partitions
   ```
4. Update client DNS/load balancer to point to backup datacenter brokers
5. Monitor consumer lag (some consumers may need restart if they connect to old broker)
6. Verify message flow: sample topics, check message rates

Data loss:
  - Messages replicated to backup before failure: 0 loss
  - Messages acked by primary but not yet replicated to backup: 50-200 messages lost (depends on replication lag)
  - Expected loss: 5-20 second window of messages

Validation:
  - Monitor all topics: no hanging consumers
  - Sample read from multiple partitions: verify no corruption
  - Check replication status: all partitions at ISR=3 (now using broker 4,5 + primary when recovered)

Re-integration (when primary recovers):
  - DON'T automatically promote primary back to leader (needs verification)
  - Manual check: compare broker 1 data with backup brokers
  - Decide: if broker 1 data is stale, wipe it and resync from backup
  - Explicitly promote brokers back to leader only after validation
```

**Operator Error Recovery (Accidental Topic Delete):**

```
Scenario: Operator runs: kafka-topics.sh --delete --topic important-topic

T=0s: Topic deleted from active cluster
T=5s: Alerts fire (consumer lag no longer updating)
T=10s: Operator realizes mistake, searches logs for confirmation
T=15s: Ops team decides to restore from backup
T=30s: Restore backup broker 4/5 from S3 snapshot (latest = 2 hours old)
  ```bash
  # Download backup from S3
  aws s3 cp s3://backup-bucket/kafka-broker4-snapshot-2026-06-15T10:00:00.tar.gz .
  tar xzf kafka-broker4-snapshot-2026-06-15T10:00:00.tar.gz -C /var/kafka/data
  ```
T=40s: Broker 4 restarts with restored data
T=50s: Verify important-topic exists with data from 2 hours ago
T=60s: Promote broker 4 as leader for important-topic partitions
T=90s: All brokers now have 3-way replication for important-topic
T=120s: Topic restored, clients can resume

Data loss: 2 hours of messages after backup time
RTO: 2 minutes (restore + restart + verification)
RPO: 2 hours (only have 2-hour-old backup)
Mitigation: increase snapshot frequency from hourly to 15-minute, reduce RPO to 15 minutes
```

**Disaster Recovery Drill (Quarterly):**

```
Objective: Practice failover procedure, measure actual RTO
Schedule: last Friday of each quarter, 4pm
Duration: 1 hour
Team: ops lead, 2 engineers on-call, 1 observer

1. Kill primary datacenter (simulate)
   - Operator: simulate network failure (block all traffic to primary DC)
   - Or: shutdown all brokers in primary DC
   
2. Measure time to failover
   - Start clock when primary goes down
   - Follow runbook: detect failure, promote backup, update DNS
   - Stop clock when consumer traffic stable in backup DC
   
3. Measure actual RTO
   - Target: 5 minutes
   - Actual: [measure in drill]
   - If > 5 min: identify slowdown, update runbook/automation
   
4. Verify data
   - Check for message loss (compare message counts before/after)
   - Verify no duplication
   - Verify no corruption
   
5. Restore to primary
   - Wait for primary DC to "recover" (restore from backup)
   - Promote back to primary
   - Verify 3-way replication restored
   
6. Document lessons learned
   - What went wrong?
   - What took longer than expected?
   - Update runbook, automation, alert thresholds

Success criteria:
  - [ ] RTO achieved (≤ 5 minutes)
  - [ ] RPO maintained (≤ 0 messages lost)
  - [ ] No operator confusion (runbook clear)
  - [ ] All checks passed (data valid)
```

**Monitoring & Alerting for DR Readiness:**

```
Key metrics:
  - Replication lag to backup region: alert if > 1 minute
  - Last backup timestamp: alert if > 2 hours old
  - Backup restore test: automated daily, alert if fails
  - Failover time estimate: calculate based on current metrics
  - Broker health: alert if unhealthy

Dashboard (visible to on-call):
  - Real-time replication lag (should be < 200ms)
  - Last successful backup time
  - Broker status (alive/dead)
  - Primary vs. backup synchronization status
  - Estimated RTO if failover triggered now
```
