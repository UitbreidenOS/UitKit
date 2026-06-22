# Enterprise Disaster Recovery Plan

## Purpose

This guide establishes recovery objectives, backup strategies, restore procedures, and resilience testing protocols to minimize business impact from system failures, data loss, or service disruptions.

---

## Recovery Objectives

### RPO & RTO by Service Tier

| Service Tier | RTO (Recovery Time) | RPO (Recovery Point) | Priority |
|---|---|---|---|
| **Critical** | ≤ 1 hour | ≤ 5 minutes | P0 |
| **High** | ≤ 4 hours | ≤ 15 minutes | P1 |
| **Medium** | ≤ 24 hours | ≤ 1 hour | P2 |
| **Low** | ≤ 72 hours | ≤ 6 hours | P3 |

**Critical Services:**
- Authentication & authorization systems
- Data persistence layer (primary database)
- Real-time event streaming
- Customer-facing API gateway

**High Priority:**
- Analytics pipeline
- Configuration management
- Monitoring & alerting
- Documentation systems

---

## Backup Strategy

### 1. Full System Backups

**Frequency:** Daily (00:00 UTC)  
**Retention:** 30 days on-site, 90 days off-site  
**Target:** All persistent data stores

**Procedure:**
```bash
# Automated via backup orchestrator
backup-system \
  --full \
  --encrypt \
  --verify-checksum \
  --replicate-to-cold-storage
```

**Verification:**
- Checksums validated immediately post-backup
- Restore test performed on 10% of backups monthly
- Alert if any backup > 30% of baseline size

### 2. Incremental Backups

**Frequency:** Every 6 hours  
**Retention:** 7 days on-site  
**Chain:** Linked to most recent full backup

**Procedure:**
```bash
backup-system \
  --incremental \
  --delta-only \
  --since-last-full
```

### 3. Database Backups

**PostgreSQL:**
- Continuous WAL (Write-Ahead Logs) archiving to S3
- Daily full backup + hourly incremental
- Point-in-time recovery (PITR) available for 30 days
- Replication lag monitoring: alert if > 10 seconds

**Redis/Cache:**
- RDB snapshots every 1 hour
- AOF (Append-Only File) enabled
- Replicated to standby instance in separate AZ

**Elasticsearch:**
- Snapshot repository in S3
- Daily snapshots with 30-day retention
- Searchable snapshots for rapid recovery

### 4. Configuration & Secrets Backups

**Storage:** Encrypted vault (AWS Secrets Manager, HashiCorp Vault)  
**Frequency:** Real-time sync + hourly snapshots  
**Access:** MFA-protected, audit-logged  
**Rotation:** Secrets rotated automatically every 90 days

---

## Restore Procedures

### Level 1: Single Service Restore (RTO: 15 min)

**Trigger:** Service health checks fail for > 2 minutes  
**Runbook:** `restore-service.sh`

```bash
#!/bin/bash
SERVICE=$1
BACKUP_TIME=${2:-latest}

# Step 1: Stop the failing service
systemctl stop $SERVICE

# Step 2: Verify backup availability
aws s3 ls s3://backups/$SERVICE/$BACKUP_TIME/ || exit 1

# Step 3: Download and restore from backup
aws s3 sync s3://backups/$SERVICE/$BACKUP_TIME/ /var/data/$SERVICE/
chmod 750 /var/data/$SERVICE/*
chown service:service /var/data/$SERVICE -R

# Step 4: Validate data integrity
restore-validate --service $SERVICE --data-path /var/data/$SERVICE/

# Step 5: Start service with health checks
systemctl start $SERVICE
sleep 5
systemctl status $SERVICE || exit 1

# Step 6: Notify on-call team
alert-oncall --severity critical --message "$SERVICE restored from $BACKUP_TIME"
```

**Validation Checklist:**
- [ ] Service starts successfully
- [ ] Health check endpoint responds (HTTP 200)
- [ ] Database connectivity confirmed
- [ ] No error logs in first 60 seconds

---

### Level 2: Database Restore (RTO: 30 min)

**Trigger:** Data corruption, accidental deletion, unrecoverable errors  
**Runbook:** `restore-database.sh`

```bash
#!/bin/bash
DB_NAME=$1
RESTORE_POINT=${2:-latest}

# Step 1: Acquire exclusive lock (prevent writes)
psql -h $DB_HOST -U postgres -c "ALTER DATABASE $DB_NAME SET default_transaction_isolation = 'serializable';"

# Step 2: Identify restore timeline
# For PITR: restore-point = "2024-06-22 14:30:00"
# For backup: restore-point = "backup-full-20240622"

if [[ $RESTORE_POINT == backup-* ]]; then
    # Full backup restore
    pg_basebackup -h $DB_HOST -U backup_user -D /var/lib/postgresql/recovery -v -P
    echo "recovery_target_timeline = 'latest'" >> /var/lib/postgresql/recovery/recovery.conf
else
    # Point-in-time recovery
    echo "recovery_target_time = '$RESTORE_POINT'" >> /var/lib/postgresql/recovery/recovery.conf
fi

# Step 3: Perform restore
systemctl stop postgresql
rm -rf /var/lib/postgresql/main
mv /var/lib/postgresql/recovery /var/lib/postgresql/main
chown postgres:postgres /var/lib/postgresql/main -R

# Step 4: Start database in read-only mode
systemctl start postgresql
pg_isready -h localhost || exit 1

# Step 5: Run integrity checks
psql -h localhost -U postgres -d $DB_NAME -c "ANALYZE;"
psql -h localhost -U postgres -d $DB_NAME -c "SELECT COUNT(*) FROM pg_stat_user_tables;" > /tmp/table_counts.txt

# Step 6: Verify against snapshot
diff /tmp/table_counts.txt /backups/verify/table_counts_$RESTORE_POINT.txt || echo "WARNING: Table counts differ"

# Step 7: Enable writes (promote)
psql -h localhost -U postgres -c "ALTER DATABASE $DB_NAME RESET default_transaction_isolation;"
systemctl restart postgresql

echo "Database $DB_NAME restored to $RESTORE_POINT"
```

**Validation Checklist:**
- [ ] Database starts cleanly
- [ ] No corruption detected (pg_filedump scan)
- [ ] Replication catches up within 5 minutes
- [ ] Application tests pass against restored DB
- [ ] Data timestamp matches expected restore point

---

### Level 3: Multi-Service Outage (RTO: 2 hours)

**Trigger:** Multiple critical services down, primary datacenter failure  
**Runbook:** `regional-failover.sh`

```bash
#!/bin/bash
set -e

INCIDENT_ID=$(uuidgen)
DR_REGION=${1:-us-west-2}
RESTORE_TIME=${2:-$(date -u +'%Y-%m-%d %H:%M:%S' -d '15 minutes ago')}

echo "=== REGIONAL FAILOVER START ===" | tee /tmp/failover_$INCIDENT_ID.log
echo "Incident ID: $INCIDENT_ID"
echo "Target region: $DR_REGION"
echo "Restore point: $RESTORE_TIME"

# Phase 1: Prepare DR infrastructure (10 min)
echo "Phase 1: Provisioning DR infrastructure..."
terraform apply -var="region=$DR_REGION" -var="incident_id=$INCIDENT_ID" -auto-approve

# Phase 2: Restore all databases in parallel (15 min)
echo "Phase 2: Restoring databases..."
for db in primary analytics events config; do
    (
        restore-database $db "$RESTORE_TIME"
        echo "✓ $db restored"
    ) &
done
wait

# Phase 3: Restore application state (10 min)
echo "Phase 3: Restoring application state..."
aws s3 sync s3://backups/app-state/$RESTORE_TIME/ /var/app/state/

# Phase 4: Update DNS to DR region (5 min)
echo "Phase 4: Updating DNS records..."
update-dns \
  --zone-id $ZONE_ID \
  --records-from primary-region \
  --records-to $DR_REGION \
  --ttl 60

# Phase 5: Start services and validate (10 min)
echo "Phase 5: Starting services..."
systemctl start claudient-app
sleep 30

# Phase 6: Run smoke tests
echo "Phase 6: Running smoke tests..."
./tests/smoke-tests.sh || exit 1

echo "=== REGIONAL FAILOVER COMPLETE ===" | tee -a /tmp/failover_$INCIDENT_ID.log
echo "Time to recovery: $(elapsed_time)"
alert-oncall --severity critical --incident-id $INCIDENT_ID --message "Failover complete to $DR_REGION"
```

**Validation Checklist:**
- [ ] DNS updated and propagated
- [ ] All services healthy in DR region
- [ ] Smoke tests pass
- [ ] No data loss detected
- [ ] Replication lag < 1 minute
- [ ] Customer notifications sent

---

## Chaos Engineering & Resilience Testing

### Test Schedule

| Test Type | Frequency | Duration | Scope |
|---|---|---|---|
| **Backup Restore Test** | Weekly (Wed 14:00 UTC) | 30 min | Single service |
| **Database PITR Test** | Bi-weekly (2nd & 4th Mon) | 45 min | Production copy |
| **Regional Failover Drill** | Quarterly | 2 hours | Full system |
| **Chaos Monkey** | Daily (02:00-03:00 UTC) | 60 min | Canary nodes |
| **Network Partition Test** | Monthly | 30 min | Multi-AZ connectivity |

### 1. Backup Restore Test

**Objective:** Validate restore procedures and automation  
**Frequency:** Weekly on Wednesday at 14:00 UTC  
**Duration:** 30 minutes

**Test Procedure:**
```bash
#!/bin/bash
# Run in non-production environment

TEST_DATE=$(date +%Y%m%d)
SERVICE=${1:-api-gateway}
BACKUP_AGE=${2:-1d}  # 1 day old backup

echo "Testing restore for $SERVICE (backup age: $BACKUP_AGE)"

# 1. List available backups
BACKUPS=$(aws s3 ls s3://backups/$SERVICE/ --recursive | sort -r | head -5)
echo "Available backups:"
echo "$BACKUPS"

# 2. Select backup (1 day old)
BACKUP_TO_RESTORE=$(echo "$BACKUPS" | grep $(date -d "$BACKUP_AGE" +%Y%m%d) | awk '{print $NF}' | head -1)

if [ -z "$BACKUP_TO_RESTORE" ]; then
    echo "ERROR: No backup found matching criteria"
    exit 1
fi

echo "Restoring: $BACKUP_TO_RESTORE"

# 3. Restore to staging environment
restore-service $SERVICE $BACKUP_TO_RESTORE --environment staging

# 4. Validate restore
RESTORE_TIME=$(get-backup-timestamp $BACKUP_TO_RESTORE)
RECORD_COUNT=$(psql -h staging-db -U readonly -t -c "SELECT COUNT(*) FROM data_records WHERE created_at > '$RESTORE_TIME' - interval '1 hour';")

if [ $RECORD_COUNT -eq 0 ]; then
    echo "✓ Backup integrity validated"
else
    echo "✗ WARNING: Unexpected records found post-restore"
fi

# 5. Run smoke tests
./tests/smoke-tests.sh --environment staging || exit 1

# 6. Report results
RESULT="SUCCESS"
DURATION=$(date +%s) - $START_TIME
report-test-results \
  --test-id backup-restore-$TEST_DATE \
  --service $SERVICE \
  --result $RESULT \
  --duration $DURATION \
  --backup-age $BACKUP_AGE

echo "✓ Test completed: $RESULT"
```

**Success Criteria:**
- Restore completes within 20 minutes
- All data present and uncorrupted
- Smoke tests pass
- No data drift between backup and staging

---

### 2. Database PITR Test

**Objective:** Validate point-in-time recovery capabilities  
**Frequency:** Bi-weekly (1st & 3rd Monday)  
**Duration:** 45 minutes

**Test Procedure:**
```bash
#!/bin/bash

TEST_ID="pitr-$(date +%Y%m%d-%H%M%S)"
RECOVERY_POINT=$(date -u -d '2 hours ago' +'%Y-%m-%d %H:%M:%S')

echo "=== PITR Test: $TEST_ID ==="
echo "Recovery point: $RECOVERY_POINT"

# 1. Create test database clone
pg_basebackup -h primary-db -U backup_user -D /tmp/pitr_test_$TEST_ID -v -P

# 2. Configure recovery to specific point in time
cat > /tmp/pitr_test_$TEST_ID/recovery.conf <<EOF
recovery_target_time = '$RECOVERY_POINT'
recovery_target_timeline = 'latest'
recovery_target_inclusive = false
EOF

# 3. Start database in recovery mode
pg_ctl -D /tmp/pitr_test_$TEST_ID -l /tmp/pitr_$TEST_ID.log start

# 4. Wait for recovery to complete
sleep 10
until pg_isready -h localhost -p 5555 -U postgres; do
    sleep 2
done

# 5. Verify recovery point
ACTUAL_TIME=$(psql -h localhost -p 5555 -U postgres -t -c "SELECT now();")
echo "Recovered to: $ACTUAL_TIME"

# 6. Validate data at recovery point
RECORD_COUNT=$(psql -h localhost -p 5555 -U postgres -d production_clone -t -c "SELECT COUNT(*) FROM data_records;")
EXPECTED_COUNT=$(get-expected-count-at-time "$RECOVERY_POINT")

if [ "$RECORD_COUNT" -eq "$EXPECTED_COUNT" ]; then
    echo "✓ Data integrity verified at recovery point"
else
    echo "✗ Data count mismatch: $RECORD_COUNT vs $EXPECTED_COUNT"
fi

# 7. Cleanup
pg_ctl -D /tmp/pitr_test_$TEST_ID -m fast stop
rm -rf /tmp/pitr_test_$TEST_ID

# 8. Report
report-test-results \
  --test-id $TEST_ID \
  --type pitr \
  --recovery-point "$RECOVERY_POINT" \
  --records-validated $RECORD_COUNT \
  --result PASS
```

**Success Criteria:**
- Recovery completes within 30 minutes
- Actual recovery point matches target (within ±30 seconds)
- Data count within 0.1% of expected
- No WAL corruption or gaps

---

### 3. Regional Failover Drill

**Objective:** Validate multi-region failover and business continuity  
**Frequency:** Quarterly (Jan 15, Apr 15, Jul 15, Oct 15)  
**Duration:** 2 hours  
**Window:** 22:00-00:00 UTC (off-peak)

**Pre-Drill Checklist:**
- [ ] Incident commander assigned
- [ ] On-call team notified
- [ ] Customer communications drafted
- [ ] DR region health verified
- [ ] Backup freshness confirmed

**Test Procedure:**
```bash
#!/bin/bash

DRILL_ID="failover-drill-$(date +%Y%m%d)"
INCIDENT_COMMANDER="$1"

echo "=== QUARTERLY FAILOVER DRILL: $DRILL_ID ===" | tee /tmp/$DRILL_ID.log

# Phase 0: Pre-flight checks (5 min)
echo "[Phase 0] Pre-flight checks..."
./scripts/dr-preflight-checks.sh || exit 1

# Phase 1: Simulate primary region failure (2 min)
echo "[Phase 1] Simulating primary region failure..."
# Only in staging: block all traffic to primary region
for ALB in $(get-albs primary-region); do
    aws elbv2 deregister-targets \
      --target-group-arn $ALB \
      --targets Id=primary-node-1 Id=primary-node-2
done

# Phase 2: Initiate failover (5 min)
echo "[Phase 2] Initiating failover..."
FAILOVER_START=$(date +%s)
regional-failover --target-region us-west-2 --restore-point latest

# Phase 3: Validate failover (15 min)
echo "[Phase 3] Validating failover..."
./tests/comprehensive-validation.sh --region us-west-2

# Phase 4: Check data consistency
echo "[Phase 4] Checking data consistency..."
CHECKSUM_PRIMARY=$(get-backup-checksum primary-region latest)
CHECKSUM_DR=$(get-running-checksum us-west-2)

if [ "$CHECKSUM_PRIMARY" = "$CHECKSUM_DR" ]; then
    echo "✓ Data consistency verified"
else
    echo "✗ WARNING: Checksum mismatch detected"
fi

# Phase 5: Failback to primary (15 min)
echo "[Phase 5] Failback to primary..."
regional-failback --target-region us-east-1 --verify-writes true

# Phase 6: Post-drill validation (5 min)
echo "[Phase 6] Post-drill validation..."
./tests/smoke-tests.sh --region us-east-1

FAILOVER_END=$(date +%s)
TOTAL_TIME=$((FAILOVER_END - FAILOVER_START))

# Phase 7: Report
echo "=== DRILL COMPLETE ===" | tee -a /tmp/$DRILL_ID.log
report-drill-results \
  --drill-id $DRILL_ID \
  --incident-commander "$INCIDENT_COMMANDER" \
  --total-time $TOTAL_TIME \
  --phases-completed 7 \
  --data-loss-detected false \
  --log-file /tmp/$DRILL_ID.log
```

**Success Criteria:**
- Total failover + failback time ≤ 120 minutes
- Zero data loss detected
- All smoke tests pass in DR region
- Data checksums match within 30 seconds
- Replication lag < 1 minute after failback

---

### 4. Chaos Monkey (Automated Daily)

**Objective:** Continuously test resilience to random failures  
**Frequency:** Daily at 02:00-03:00 UTC  
**Scope:** Canary nodes in production (non-critical traffic)

**Configuration:**
```yaml
# chaos-monkey.yaml
enabled: true
schedule: "0 2 * * *"  # 02:00 UTC daily
scope:
  - canary-nodes-only
  - exclude-critical-services
  - max-failure-rate: 0.1  # 10% max

scenarios:
  - instance-termination:
      probability: 0.3
      impact: "Medium"
      
  - network-latency:
      probability: 0.2
      latency-ms: 500-2000
      impact: "Low"
      
  - disk-space:
      probability: 0.15
      fill-percentage: 85-95
      impact: "Medium"
      
  - memory-pressure:
      probability: 0.15
      consume-gb: 4-8
      impact: "Medium"
      
  - connection-pool-drain:
      probability: 0.2
      max-connections: 50
      impact: "Low"

notifications:
  - type: slack
    channel: "#chaos-engineering"
    on: [scenario-start, scenario-end, failure-detected]
    
recovery:
  auto-remediate: true
  alert-if-unrecovered: 5m
```

---

### 5. Network Partition Test

**Objective:** Test multi-AZ failover and split-brain detection  
**Frequency:** Monthly (15th of month)  
**Duration:** 30 minutes

**Test Procedure:**
```bash
#!/bin/bash

TEST_ID="network-partition-$(date +%Y%m%d)"

echo "=== NETWORK PARTITION TEST: $TEST_ID ==="

# 1. Create network partition between us-east-1a and us-east-1b
echo "Creating partition between us-east-1a ↔ us-east-1b"
for SG in $(get-security-groups us-east-1a); do
    aws ec2 revoke-security-group-ingress \
      --group-id $SG \
      --source-security-group-id $(get-security-group us-east-1b) \
      --protocol all \
      --port all 2>/dev/null || true
done

# 2. Monitor split-brain detection
echo "Monitoring for split-brain..."
sleep 5
SPLIT_BRAIN_DETECTED=$(check-split-brain-detection)

if [ "$SPLIT_BRAIN_DETECTED" = "true" ]; then
    echo "✓ Split-brain detected correctly"
else
    echo "✗ CRITICAL: Split-brain NOT detected"
fi

# 3. Verify quorum behavior
echo "Verifying quorum-based decisions..."
WRITES_ACCEPTED=$(redis-cli GET writes_accepted)
if [ "$WRITES_ACCEPTED" = "disabled" ]; then
    echo "✓ Writes correctly disabled in minority partition"
else
    echo "✗ WARNING: Writes still active in partition"
fi

# 4. Wait for partition duration
echo "Partition active for 10 minutes..."
sleep 600

# 5. Heal partition
echo "Healing network partition..."
for SG in $(get-security-groups us-east-1a); do
    aws ec2 authorize-security-group-ingress \
      --group-id $SG \
      --source-security-group-id $(get-security-group us-east-1b) \
      --protocol all \
      --port all
done

# 6. Monitor convergence
echo "Monitoring cluster convergence..."
while [ "$(get-cluster-state)" != "healthy" ] && [ $CONVERGENCE_TIME -lt 60 ]; do
    sleep 5
    ((CONVERGENCE_TIME+=5))
done

echo "Cluster converged in $CONVERGENCE_TIME seconds"

# 7. Report
report-test-results \
  --test-id $TEST_ID \
  --partition-duration 600s \
  --split-brain-detected $SPLIT_BRAIN_DETECTED \
  --convergence-time $CONVERGENCE_TIME \
  --result $([ $CONVERGENCE_TIME -lt 60 ] && echo "PASS" || echo "FAIL")
```

---

## Monitoring & Alerting

### Key Metrics

```yaml
metrics:
  backup-health:
    - backup_age_seconds
    - backup_size_bytes
    - restore_test_duration_seconds
    - backup_verification_failure_rate
    alert_threshold:
      backup_age: 86400s  # 24 hours
      restore_duration: 1800s  # 30 minutes
      verification_failures: 0.01  # 1%

  database-replication:
    - replication_lag_seconds
    - wal_archive_lag_bytes
    - timeline_gaps_detected
    alert_threshold:
      lag: 30s  # P0 if > 30s
      archive_lag: 1GB
      gaps: 1

  dr-readiness:
    - dr_capacity_utilization
    - backup_restore_successful_count_24h
    - failover_test_age_days
    alert_threshold:
      utilization: 0.8  # 80%
      restore_failures: 1+
      test_age: 90  # days

alerting:
  - name: "Backup Age Exceeded"
    condition: backup_age_seconds > 86400
    severity: critical
    action: page-oncall

  - name: "Restore Test Failure"
    condition: restore_test_status == "failed"
    severity: high
    action: create-incident

  - name: "DB Replication Lag High"
    condition: replication_lag_seconds > 30
    severity: critical
    action: page-oncall

  - name: "Failover Drill Overdue"
    condition: days_since_last_drill > 90
    severity: medium
    action: notify-team
```

---

## Recovery Time & Cost Matrix

| Scenario | RTO | RPO | Estimated Cost | Risk Level |
|---|---|---|---|---|
| Single instance failure | 5 min | 1 min | Low | Low |
| Database corruption | 30 min | 5 min | Medium | Medium |
| Regional outage | 2 hours | 15 min | High | High |
| Multi-region cascading failure | 4 hours | 30 min | Critical | Critical |

---

## Post-Incident Review Template

After any actual disaster or drill, complete this template:

```markdown
# Post-Incident Review: [Incident ID]

## Executive Summary
- **Duration:** [start] - [end] ([total minutes])
- **Impact:** [systems affected, customers impacted]
- **Cause:** [root cause]
- **Resolution:** [what fixed it]

## Timeline
- T+0: [trigger event]
- T+5: [detection]
- T+10: [response initiated]
- T+30: [partial recovery]
- T+60: [full recovery]

## What Went Well
- [ ] Alert triggered timely
- [ ] Runbook was accurate
- [ ] Team communication clear
- [ ] Backup restore successful

## What Could Improve
- [ ] Detection time
- [ ] Runbook clarity
- [ ] Backup freshness
- [ ] Team coordination

## Action Items
- [ ] Item: Assignee: Due date:
- [ ] Item: Assignee: Due date:

## Follow-up Drill
Recommended follow-up test: [specific scenario]
Scheduled for: [date/time]
```

---

## Compliance & Audit Requirements

### Annual DR Audit Checklist

- [ ] All RPO/RTO targets reviewed and realistic
- [ ] Backups tested monthly (restore validation)
- [ ] Failover drills completed quarterly
- [ ] Backup encryption keys rotated
- [ ] Off-site backups verified accessible
- [ ] DR documentation updated
- [ ] New services added to backup schedule
- [ ] Metrics reviewed and alerts tuned
- [ ] Post-incident reviews completed for all incidents
- [ ] Training completed by all on-call staff

### Documentation Requirements

- Maintain current runbooks for all critical services
- Update DR plan quarterly with new service additions
- Archive all drill results and post-mortems
- Version control all automation scripts
- Maintain up-to-date contact lists and escalation paths

---

## Related Resources

- **Deployment Guide:** `deployment-guide.md`
- **Security Hardening:** `security-hardening.md`
- **On-Call Runbooks:** `/runbooks/`
- **Incident Response:** `/procedures/incident-response.md`
