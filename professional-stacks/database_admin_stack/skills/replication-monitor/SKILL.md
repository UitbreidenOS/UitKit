---
name: replication-monitor
description: Monitors database replication health (streaming, logical, multi-region) and diagnoses lag, conflicts, and failover readiness.
allowed-tools: Read, Write, Bash
effort: low
---

# Replication Monitor

## When to activate
When replication lag exceeds acceptable thresholds, during failover testing, when setting up new replicas, or during routine weekly health checks.

## When NOT to use
Skip if replication lag is under 1 second and all replicas report healthy. Skip for single-node development databases.

## Instructions

1. Check replication status: `pg_stat_replication` for PostgreSQL, `SHOW REPLICA STATUS` for MySQL.
2. Measure lag: write lag (sent vs flush), replay lag (flush vs replay), byte lag.
3. Identify lag sources: large transactions, DDL operations, network saturation, disk I/O on replica.
4. Test failover: simulate primary failure, measure time-to-promote, verify data consistency.
5. Check for replication conflicts: long-running reads blocking WAL apply, hot standby feedback issues.

## Example

```
REPLICATION STATUS: prod-primary → 2 replicas

Replica: prod-replica-1 (us-east-1)
  State: streaming ✅
  Write lag: 120ms | Replay lag: 180ms
  Byte lag: 2.4MB
  Conflicts: 0

Replica: prod-replica-2 (us-west-2)
  State: streaming ✅
  Write lag: 450ms | Replay lag: 620ms    ⚠️
  Byte lag: 18MB
  Conflicts: 3 (long-running analytics queries)

Action: Cancel 3 conflicting queries on replica-2 or increase
        max_standby_streaming_delay to 30s.
```
