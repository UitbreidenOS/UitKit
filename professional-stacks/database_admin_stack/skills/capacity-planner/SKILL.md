---
name: capacity-planner
description: Analyzes database resource utilization (CPU, memory, disk, connections) and forecasts growth to plan capacity upgrades before performance degrades.
allowed-tools: Read, Write, Bash
effort: medium
---

# Capacity Planner

## When to activate
When database resource utilization exceeds 70% on any metric, when planning for expected traffic growth, before seasonal peaks (Black Friday, product launches), or when storage is projected to fill within 90 days.

## When NOT to use
Skip for databases running under 40% utilization with no expected growth change. Skip if auto-scaling is already configured and tested.

## Instructions

1. Collect current metrics: CPU avg/p95, memory usage, disk I/O, connection count, storage used/total, replication lag.
2. Identify growth trends: weekly storage growth rate, monthly connection growth, seasonal traffic patterns.
3. Forecast time-to-capacity for each resource at current growth rate.
4. Flag any resource projected to hit 85% within 90 days.
5. Recommend actions: vertical scaling (instance upgrade), horizontal scaling (read replicas, sharding), query optimization, archival/cleanup, or connection pooling.
6. Estimate cost impact of each recommendation.

## Example

**Scenario:** PostgreSQL on 8 vCPU / 32GB, 400GB of 500GB used.

```
CAPACITY REPORT: prod-db-01

Current (30-day avg):
  CPU: 62% avg / 89% p95          ⚠️
  Memory: 78% (25GB/32GB)         ⚠️
  Disk: 400GB/500GB (80%)         ⚠️
  Connections: 180/200 max         ⚠️
  Replication lag: <1s             ✅

Forecast:
  Disk at 85% in: 18 days (growing 2.1GB/day)
  Connections at 85% in: 34 days
  CPU p95 >90% in: 12 days

Recommendations:
  1. IMMEDIATE: Add PgBouncer connection pooler (reduces connections 60%)
  2. THIS WEEK: Archive orders older than 2 years to cold storage (-80GB)
  3. THIS MONTH: Upgrade to 16 vCPU / 64GB instance
  4. Add read replica for analytics queries (offloads 30% CPU)
```
