# Claudient Capacity Planning Guide

**Version:** 1.0  
**Last Updated:** June 2026  
**Audience:** DevOps, SRE, Platform Engineers, Enterprise Operators

This document provides infrastructure recommendations, scaling guidance, performance curves, and hardware sizing for deploying Claudient at scale—whether as a local plugin, enterprise marketplace, or cloud-hosted platform.

---

## Table of Contents

1. [Overview](#overview)
2. [System Requirements](#system-requirements)
3. [Recommended Limits](#recommended-limits)
4. [Performance Curves](#performance-curves)
5. [Scaling Architecture](#scaling-architecture)
6. [Cloud Deployment Sizing](#cloud-deployment-sizing)
7. [Load Testing & Benchmarks](#load-testing--benchmarks)
8. [Monitoring & Alerts](#monitoring--alerts)
9. [Failure Modes & Recovery](#failure-modes--recovery)

---

## Overview

Claudient ships as:

- **Local Plugin** (~50–500 MB) — single developer machine
- **Enterprise Marketplace** — multi-tenant, internal usage (50–500 users)
- **Public Plugin Marketplace** — open-source, distributed (50k–500k concurrent sessions)
- **Hybrid SaaS** — managed service with cloud deployment

Each tier has distinct capacity requirements.

---

## System Requirements

### Minimum (Single Developer)

| Resource | Requirement | Notes |
|----------|-------------|-------|
| **CPU** | 2 cores @ 2.0 GHz | Modern x86-64 or ARM |
| **RAM** | 4 GB | Node.js runtime + skills/agents loaded in memory |
| **Disk** | 500 MB free | Plugins, agents, skills, caches |
| **Network** | Broadband (1 Mbps+) | Claude API calls, MCP server connections |
| **OS** | macOS 12+, Linux (glibc 2.28+), Windows 11+ WSL2 | |

### Recommended (Small Team / Startup)

| Resource | Requirement | Notes |
|----------|-------------|-------|
| **CPU** | 4 cores @ 2.5 GHz | Per seat; handle parallel agent spawning |
| **RAM** | 8 GB | Local plugin + skills hotload, agent context cache |
| **Disk** | 2 GB SSD | Skill library, logs, model weights cache |
| **Network** | 10 Mbps / user | API latency tolerance: <100ms P99 |
| **OS** | macOS 12+, Ubuntu 20.04 LTS+, RHEL 8+ | |

### Production (Enterprise / Platform)

| Resource | Requirement | Notes |
|----------|-------------|-------|
| **CPU** | 8–32 cores (CPU-optimized) | Load-balanced pool; 1 vCPU per 10–50 concurrent sessions |
| **RAM** | 32–128 GB | Distributed cache (Redis/Memcached), model context, skill registry |
| **Disk** | 100+ GB NVMe SSD | Persistent skill registry, audit logs, model weights, hot cache |
| **Network** | 1–10 Gbps | Low-latency upstream (Claude API, MCP servers) |
| **Database** | PostgreSQL 14+ or Managed Service | Audit log, user sessions, usage telemetry |
| **Message Queue** | RabbitMQ, Kafka, or AWS SQS | Agent task queue, hook delivery |
| **Cache Layer** | Redis 6.0+, Memcached, or Elasticache | Session state, skill metadata, hot models |
| **Logging** | ELK, Datadog, CloudWatch, Splunk | Structured JSON logs, real-time parsing |

---

## Recommended Limits

### Rate Limits (API Gateway)

| Tier | Requests/min | Concurrent Sessions | Agents/min | Max Skill Size |
|-----|--------------|-------------------|-----------|-----------------|
| **Free / Local** | Unlimited | 1–5 | 10 | 50 MB |
| **Team (50–200 users)** | 6,000 | 50–200 | 500 | 200 MB |
| **Enterprise (200–5k users)** | 30,000 | 500–2,000 | 5,000 | 500 MB |
| **Platform (5k+ users)** | 60,000–300,000 | 2,000–20,000 | 10,000–50,000 | 1 GB |

### Storage Limits

| Component | Local | Team | Enterprise | Platform |
|-----------|-------|------|-----------|----------|
| **Skill Registry** | 500 MB | 2 GB | 10 GB | 50+ GB |
| **Agent Definitions** | 50 MB | 500 MB | 2 GB | 10 GB |
| **Session Cache (7d TTL)** | 100 MB | 5 GB | 50 GB | 500+ GB |
| **Audit Logs (90d retention)** | 1 GB | 50 GB | 500 GB | 5 TB |
| **Model Weights / Embeddings** | — | 5 GB | 20 GB | 100+ GB |

### Context Window Limits

| Model | Max Tokens | Recommended Headroom | Notes |
|-------|-----------|---------------------|-------|
| **Claude 3.5 Haiku** | 200k | 50k | Budget tier; skill auto-loading |
| **Claude 3.5 Sonnet** | 200k | 50k | Balanced (default); agent context |
| **Claude 3 Opus** | 200k | 50k | Premium; complex workflows |

**Headroom rationale:** Leave 25–50% unused to accommodate hooks, MCP tool schemas, conversation history, and future prompt injection.

### Concurrency Limits

| Level | Max Concurrent Sessions | Max Agents per Session | Max Hooks per Event | Recommended Timeout |
|-------|------------------------|-----------------------|-------------------|-------------------|
| **Single Dev** | 1–5 | 2–3 | 5 | 5 min |
| **Team (50 users)** | 50–100 | 5–10 | 20 | 10 min |
| **Enterprise (1k users)** | 500–1,000 | 10–20 | 50 | 15 min |
| **Platform (10k users)** | 2,000–10,000 | 20–50 | 100 | 20 min |

---

## Performance Curves

### Skill Loading Time

**Scenario:** Claude Code loads skills from disk/registry on first invocation.

```
Concurrent Skills | Load Time (ms) | Memory (MB) | Notes
1–10             | 50–200        | 5–50       | Cached in memory
11–50            | 200–500       | 50–200     | Lazy-load from disk
51–200           | 500–2000      | 200–500    | Registry lookup overhead
201–500          | 2000–5000     | 500–1500   | Distributed load needed
500+             | >5000         | >1500      | Must use CDN / edge cache
```

**Optimization:** Pre-cache top 100 skills; lazy-load others.

### Agent Spawn Time

**Scenario:** Each agent spawn = new Claude session, context load, and tool injection.

```
Concurrent Agents | Spawn Time (ms) | Context Load (ms) | Total (ms) | Queuing (ms)
1–3              | 500–1000       | 500–1000         | 1–2s      | 0
4–10             | 1000–2000      | 1000–1500        | 2–3.5s    | 0–1s
11–50            | 2000–5000      | 1500–2500        | 3.5–7.5s  | 1–3s
51–200           | >5000          | >2500            | >7.5s     | 3–10s
200+             | N/A            | N/A              | N/A       | >10s (reject)
```

**Optimization:** Implement agent spawn queue; limit to 50 concurrent; use session pooling.

### Hook Execution Latency

**Scenario:** Hooks execute on `PreToolUse`, `PostToolUse`, `PreCompact`, `Notification`.

```
Hook Count per Event | P50 (ms) | P95 (ms) | P99 (ms) | Max Payload (KB)
1–5                 | 10–50    | 50–100   | 100–200  | 1 MB
6–20                | 50–150   | 150–300  | 300–500  | 5 MB
21–50               | 150–500  | 500–1000 | 1000+    | 10 MB
50+                 | >500     | >1000    | >2000    | Fail / skip
```

**Optimization:** Parallelize hooks; implement timeout (default 5s); drop expired hooks.

### API Latency (Upstream)

**Scenario:** Time from request dispatch to Claude API response (excluding tool calls).

```
Scenario                | P50 (ms) | P95 (ms) | P99 (ms) | Timeout | Notes
Simple query            | 200–500  | 500–1500 | 1500–3000 | 30s   | <10k tokens
Complex multi-agent     | 1000–3000| 3000–8000| 8000–15000| 60s   | >10k tokens, tool chains
Streaming response      | 100–300  | 300–800  | 800–2000 | 30s   | Token-by-token delivery
Tool use (avg)          | 500–1500 | 1500–4000| 4000–10000| 60s   | Nested tool calls
```

**SLA Target:** P95 < 2s for interactive sessions.

### Database Query Performance

**Scenario:** PostgreSQL on audit logs, session state, usage telemetry.

```
Query Type               | P50 (ms) | P95 (ms) | Notes
Session lookup (PK)      | 1–5      | 5–20     | Indexed on user_id, session_id
Audit log range (7d)     | 50–200   | 200–500  | Full table scan without index
Usage aggregation (30d)  | 100–500  | 500–2000 | GROUP BY + ORDER BY
Skill registry lookup    | 5–20     | 20–50    | Cached in-memory after first hit
```

**Optimization:** Index on (user_id, created_at); use read replicas for analytics.

---

## Scaling Architecture

### Single-Tier (Local Plugin)

```
Developer Machine
├── Claude Code (CLI / IDE)
├── Local skill cache (~500 MB)
├── SQLite session db (~100 MB)
└── MCP server tunnels
    ├── OpenAI API (fallback)
    ├── PostgreSQL / MySQL (local)
    └── Git (local)
```

**Capacity:** 1–5 concurrent sessions, ~50–100 skills.

### Two-Tier (Team / Startup)

```
┌─ Load Balancer (HAProxy / nginx)
│
├─ Application Server (Node.js, 4 instances)
│  ├── Skill registry (in-memory, shared)
│  ├── Agent orchestrator
│  └── Hook runner
│
├─ Cache Layer (Redis 6GB)
│  ├── Session state (TTL: 7d)
│  ├── Skill metadata (TTL: 24h)
│  └── Agent results (TTL: 1h)
│
├─ Database (PostgreSQL 10GB)
│  ├── Audit logs
│  ├── User sessions
│  └── Usage telemetry
│
└─ MCP Proxy (connection pooling)
   ├── Claude API
   ├── External services (Stripe, GitHub, Slack, etc.)
   └── Internal databases
```

**Capacity:** 50–200 concurrent users, 200–400 skills, 5–10 agents/sec.  
**Estimated Cost:** $2k–$5k/month (GCP / AWS).

### Three-Tier (Enterprise)

```
┌─ Edge CDN (Cloudflare / CloudFront)
│  └─ Static skill registry, guide docs, agent definitions
│
├─ API Gateway (Kong / AWS API Gateway)
│  ├─ Rate limiting (6k–30k req/min)
│  ├─ Request routing
│  └─ Authentication (OAuth2 / SAML)
│
├─ Application Tier (Kubernetes cluster)
│  ├─ API Servers (12–24 pods)
│  │  ├── Skill registry (local + sync from DB)
│  │  ├── Agent orchestrator
│  │  └── Hook runner
│  ├─ Worker Pool (Celery / RQ, 24–48 pods)
│  │  ├── Long-running agents
│  │  ├── Hook execution
│  │  └── Batch skill compilation
│  └─ Session Manager (6–12 pods)
│     └── User session state, context cache
│
├─ Data Layer
│  ├─ PostgreSQL (primary + read replicas)
│  │  ├── Audit logs (time-series partitioned)
│  │  ├── User sessions
│  │  ├── Skill registry
│  │  └── Usage telemetry
│  ├─ Redis Cluster (64GB+, 6 nodes)
│  │  ├─ Session cache (prime)
│  │  ├─ Skill metadata (secondary)
│  │  └─ Rate limit counters
│  ├─ Message Queue (Kafka)
│  │  ├─ Hook events
│  │  ├─ Agent task queue
│  │  └─ Audit log stream
│  └─ Time-Series DB (InfluxDB / TimescaleDB)
│     └── Performance metrics, usage curves
│
├─ Search & Analytics (Elasticsearch / OpenSearch)
│  ├─ Audit log indexing
│  ├─ Skill search
│  └─ User behavior analysis
│
└─ Observability
   ├─ Logging (ELK / Datadog)
   ├─ Metrics (Prometheus + Grafana)
   ├─ Tracing (Jaeger / Lightstep)
   └─ Alerting (PagerDuty / Opsgenie)
```

**Capacity:** 500–2,000 concurrent users, 500+ skills, 50+ agents/sec.  
**Estimated Cost:** $15k–$50k/month.

### Four-Tier (Platform / SaaS)

```
┌─ Global CDN (Multi-region edge)
│  ├─ North America
│  ├─ Europe
│  ├─ Asia-Pacific
│  └─ Skill registry + guide docs (latency <50ms)
│
├─ Regional Deployments (3–5 regions)
│  │
│  ├─ API Gateway (regional)
│  │  ├── Request routing
│  │  ├── Rate limiting per tenant
│  │  ├── Authentication (OAuth2 + MFA)
│  │  └── DDoS mitigation
│  │
│  ├─ Kubernetes Cluster (3–5 zones per region)
│  │  ├─ API Servers (30–60 pods)
│  │  ├─ Worker Pool (60–120 pods)
│  │  │  └── Auto-scale on queue depth
│  │  ├─ Session Manager (15–30 pods)
│  │  └─ Webhook Dispatcher (10–20 pods)
│  │
│  ├─ Regional Data Stores
│  │  ├─ PostgreSQL (HA + multi-region failover)
│  │  ├─ Redis Cluster (256GB+ in hot regions)
│  │  └─ S3-compatible object storage (skill registry)
│  │
│  └─ Regional Monitoring (local metrics collection)
│
├─ Global Services
│  ├─ Master Database (multi-master replication)
│  ├─ Global Cache (DynamoDB / Bigtable)
│  ├─ Message Queue (multi-region Kafka)
│  ├─ User directory (Okta / Auth0)
│  └─ Billing system (Stripe / custom)
│
└─ Observability (Centralized)
   ├─ Metrics aggregation (Datadog / Splunk)
   ├─ Distributed tracing (Jaeger + Elasticsearch)
   ├─ Log aggregation (ELK / Splunk Enterprise)
   ├─ Synthetic monitoring (Pingdom / Datadog Synthetics)
   └─ Incident management (PagerDuty / Opsgenie)
```

**Capacity:** 5,000–50,000+ concurrent users, 5,000+ skills, 500+ agents/sec.  
**Estimated Cost:** $100k–$500k+/month.

---

## Cloud Deployment Sizing

### AWS Deployment (Enterprise)

#### Compute

```yaml
API Servers:
  Instance Type: t4g.xlarge or c6i.2xlarge (x86)
  Count: 12–24 (auto-scaling 8–40)
  vCPU: 4, RAM: 16 GB each
  Cost: ~$0.15–$0.40/hour per instance

Worker Pool:
  Instance Type: c6i.4xlarge or c7g.4xlarge
  Count: 24–48 (auto-scaling 16–96)
  vCPU: 16, RAM: 32 GB each
  Cost: ~$0.60–$1.20/hour per instance

Session Manager:
  Instance Type: r6i.2xlarge (memory-optimized)
  Count: 6–12
  vCPU: 8, RAM: 64 GB each
  Cost: ~$0.50–$0.75/hour per instance
```

#### Storage

```yaml
Database (RDS PostgreSQL):
  Instance: db.r6i.4xlarge (HA multi-AZ)
  Storage: 500 GB–2 TB provisioned IOPS
  Backup: Automated daily + point-in-time recovery
  Cost: ~$4–$8/hour + storage

Cache (ElastiCache Redis):
  Node Type: cache.r6g.xlarge (16 GB)
  Nodes: 6 (with automatic failover)
  Cost: ~$1.50–$2.50/hour per node

S3 (Skill Registry + Audit Logs):
  Storage: 100 GB–1 TB
  Lifecycle: Archive to Glacier after 90d
  Cost: ~$0.023/GB/month

TimeSeriesDB (Managed):
  Type: ElastiCache for Redis with time-series module
  Cost: ~$2–$5/hour
```

#### Networking

```yaml
Load Balancer (ALB):
  Type: Application Load Balancer (multi-AZ)
  Cost: ~$0.0225/hour + data processing

NAT Gateway:
  Count: 2 (1 per AZ for high availability)
  Cost: ~$0.045/hour per gateway

Data Transfer:
  Inbound: Free
  Outbound (to internet): ~$0.09/GB
  InterAZ: ~$0.01/GB (keep in-region)
  Inter-region: ~$0.02/GB

CloudFront CDN:
  Cost: ~$0.085/GB (outbound data transfer)
```

#### Observability

```yaml
CloudWatch:
  Logs ingestion: ~$0.50/GB
  Metrics: ~$0.30/custom metric/month
  Estimated: ~$500–$2k/month

X-Ray (Distributed Tracing):
  Cost: ~$0.50/million traces recorded
  Estimated: ~$100–$500/month

Cost Estimator (Enterprise):
  Compute: ~$8k–$12k/month
  Storage: ~$1k–$3k/month
  Network: ~$500–$2k/month
  Observability: ~$1k–$3k/month
  ────────────────────────────
  Total: ~$11k–$20k/month
```

### GCP Deployment (Platform)

#### Compute

```yaml
GKE Cluster:
  Machine type: n2-standard-4 (4 vCPU, 16 GB RAM)
  Node pool 1 (API): 12–24 nodes
  Node pool 2 (Workers): 24–48 nodes (auto-scale)
  Node pool 3 (Memory): 6–12 n2-highmem-8 nodes
  Zonal: 3 zones (us-central1-a, -b, -c)
  Cost: ~$0.15–$0.35/hour per node

Workload Identity:
  Service accounts with OIDC federation
  Cost: Included
```

#### Storage

```yaml
Cloud SQL (PostgreSQL):
  Machine: db-custom-8-32768 (8 vCPU, 32 GB)
  Storage: 500 GB–2 TB (SSD)
  HA configuration (multi-zone)
  Automated backups
  Cost: ~$2–$4/hour + storage

Memorystore (Redis):
  Tier: Standard (6 GB–256 GB)
  Replication: High availability
  Node: 6 nodes (6 GB each = 36 GB)
  Cost: ~$0.25/GB/month (~$9/month per GB)

Cloud Storage:
  Storage: 100 GB–1 TB (Multi-regional)
  Lifecycle policies (auto-archive)
  Cost: ~$0.020/GB/month

Datastore / Firestore:
  Session storage, user metadata
  Cost: ~$0.06/100k reads, ~$0.18/100k writes
```

#### Networking

```yaml
Load Balancer (HTTP/S):
  Type: Application Load Balancer
  Cost: ~$0.025/hour + data processing

Cloud CDN:
  Cost: ~$0.085/GB (outbound cache hits)
  ~$0.20/GB (cache misses)

Cloud Interconnect:
  For on-premises hybrid connectivity
  Cost: ~$0.30/hour per 10 Gbps port
```

#### Observability

```yaml
Cloud Logging:
  Ingestion: ~$0.50/GB
  Analysis: Included (first 7d free)

Cloud Trace (Distributed Tracing):
  Cost: Included in GCP

Cloud Monitoring:
  Custom dashboards: Free
  Alerting policies: Free
  Estimated: ~$200–$800/month

Cost Estimator (Platform):
  Compute: ~$12k–$18k/month
  Storage: ~$2k–$5k/month
  Network: ~$1k–$3k/month
  Observability: ~$500–$1.5k/month
  ────────────────────────────
  Total: ~$16k–$27k/month
```

### Azure Deployment (Enterprise/Platform)

#### Compute

```yaml
AKS Cluster:
  VM size: Standard_D4s_v3 (4 vCPU, 16 GB)
  Node pools: 3 (API, Workers, Memory)
  Count: 12–24 + 24–48 + 6–12 nodes
  Availability zones: 3
  Cost: Pay-per-node (~$0.15–$0.35/hour)

Virtual Machines (Spot for non-critical):
  Use Azure Spot VMs for 60–70% cost savings
```

#### Storage

```yaml
Azure Database for PostgreSQL:
  SKU: Standard_B4ms (4 vCPU, 16 GB)
  Storage: 500 GB–2 TB (Premium SSD)
  Geo-redundant backup
  Cost: ~$0.40–$0.60/hour

Azure Cache for Redis:
  SKU: Premium (4 GB–1.2 TB)
  Cluster: 6 nodes (6 GB each)
  Cost: ~$0.80/hour per node

Blob Storage:
  Storage: 100 GB–1 TB (Cool tier for archives)
  Cost: ~$0.015/GB/month (Cool), ~$0.04/GB/month (Hot)

Table Storage / Cosmos DB:
  Session state, metadata
  Cost: ~$1.25/100k RUs provisioned
```

#### Networking

```yaml
Application Gateway:
  Cost: ~$0.025/hour (entry-level) + data processing

CDN (Azure Front Door):
  Cost: ~$0.085/GB outbound
```

#### Observability

```yaml
Log Analytics Workspace:
  Ingestion: ~$0.60/GB
  Analysis/Kusto queries: Included

Application Insights:
  Cost: ~$1.70/GB after 1 GB free/month
  Synthetic monitoring: Included

Cost Estimator (Enterprise):
  Compute: ~$10k–$15k/month
  Storage: ~$1.5k–$3k/month
  Network: ~$500–$1.5k/month
  Observability: ~$500–$1.5k/month
  ────────────────────────────
  Total: ~$13k–$21k/month
```

---

## Load Testing & Benchmarks

### Test Scenarios

#### Scenario 1: Concurrent Skill Loading

```bash
# Tool: Apache JMeter / k6
concurrent_users: 100
ramp_up: 60 seconds
duration: 300 seconds
endpoint: /api/skills/load
payload: skill_id, user_id

Expected Results (P95):
- Load time: <500 ms
- Error rate: <1%
- CPU usage: 40–60%
- Memory: <80% of allocated
```

#### Scenario 2: Agent Spawn Burst

```bash
concurrent_agents: 50
spawn_rate: 10/sec
context_size: 50k tokens
duration: 120 seconds

Expected Results (P95):
- Spawn latency: <5s
- Queue time: <2s
- Agent success rate: >99%
- CPU peak: <90%
```

#### Scenario 3: Hook Execution Storm

```bash
hooks_per_event: 50
event_rate: 100/sec
hook_timeout: 5 seconds
duration: 60 seconds

Expected Results (P95):
- Execution time: <500ms
- Drop rate: <0.1%
- Memory: <75% of allocated
- DB connection pool saturation: <80%
```

#### Scenario 4: Sustained Load (24h)

```bash
concurrent_sessions: 500
active_users: 80% of concurrent
skill_invocations/min: 200–500
agent_spawns/min: 20–50
duration: 24 hours

Expected Results:
- Uptime: >99.9% (max 8.6s downtime)
- P95 latency: Consistent within +/- 10%
- Memory leak: <5% per 6 hours
- DB growth: ~50–100 MB/hour (audit logs)
- CPU throttling: 0 events
```

### Benchmark Suite

Run these benchmarks before each release:

```bash
# Cold start (empty cache)
/benchmark skill-loading --count 500 --concurrency 50
/benchmark agent-spawn --count 100 --concurrency 10
/benchmark hook-execution --count 1000 --concurrency 50

# Warm cache (pre-loaded)
/benchmark skill-loading --count 500 --concurrency 50 --cached
/benchmark agent-spawn --count 100 --concurrency 10 --cached

# Memory profile
/benchmark memory-leak-detect --duration 60min --interval 1min

# Database performance
/benchmark db-query --type range-audit --range 7d --concurrency 20
/benchmark db-query --type skill-registry-lookup --iterations 100000
```

**Pass/Fail Criteria:**
- P95 latency within ±10% of baseline
- Error rate < 1%
- Memory growth < 5% per hour
- CPU utilization < 80% @ concurrency limit

---

## Monitoring & Alerts

### Key Metrics

#### Application

```yaml
Skill Metrics:
  - skill_load_time_ms (P50, P95, P99)
  - skill_load_errors_total (count)
  - skill_cache_hit_rate (%)
  - active_skills_loaded (gauge)

Agent Metrics:
  - agent_spawn_time_ms (P50, P95, P99)
  - agent_spawn_queued_seconds (wait time)
  - agents_active_concurrent (gauge)
  - agent_success_rate (%)
  - agent_failure_reasons (breakdown)

Hook Metrics:
  - hook_execution_time_ms (P50, P95, P99)
  - hooks_executed_total (count)
  - hook_timeout_errors (count)
  - hook_drop_rate (%)

API Metrics:
  - api_request_latency_ms (P50, P95, P99)
  - api_request_rate (req/sec)
  - api_error_rate (%)
  - concurrent_sessions (gauge)
```

#### Infrastructure

```yaml
Compute:
  - cpu_utilization (%)
  - memory_utilization (%)
  - disk_io_ops (IOPS)
  - network_in_out (Mbps)

Database:
  - db_query_time_ms (P50, P95, P99)
  - db_connection_pool_utilization (%)
  - db_replication_lag_ms
  - db_size_gb (growth rate)

Cache:
  - redis_memory_utilization (%)
  - redis_hit_rate (%)
  - redis_key_evictions_total
  - redis_command_latency_ms (P95)

Message Queue:
  - queue_depth (messages)
  - queue_processing_rate (msg/sec)
  - queue_lag_seconds (oldest message age)
```

### Alert Rules

```yaml
Critical (Page On-Call):
  - P95 API latency > 5s
  - Uptime < 99%
  - Error rate > 5%
  - Concurrent sessions queue depth > 1000
  - DB replication lag > 60s

Warning (Notify Team):
  - P95 API latency > 2s
  - Error rate > 1%
  - Skill load failures > 10/min
  - Agent spawn queue depth > 100
  - Cache hit rate < 70%
  - Database disk usage > 80%

Info (Dashboard Only):
  - Agent spawn latency trending upward
  - Hook timeout rate increasing
  - Memory growth > 2% per hour
  - Concurrent sessions nearing limit (90% of max)
```

### Dashboards

Create Grafana dashboards for:

1. **Operational Overview**
   - Requests/sec, error rate, P95 latency
   - Concurrent sessions, queue depth
   - Uptime %

2. **Skill Performance**
   - Top 20 slowest skills
   - Skill load time by domain
   - Cache hit rate

3. **Agent Health**
   - Agent spawn rate, success rate
   - Queue depth, wait time
   - Agent timeout rate

4. **Infrastructure**
   - CPU, memory, disk utilization per node
   - Network I/O
   - Database replication status

5. **Cost**
   - Hourly spend (cloud provider)
   - Cost per user / per request
   - Resource utilization efficiency

---

## Failure Modes & Recovery

### Graceful Degradation

| Failure | Symptom | Mitigation |
|---------|---------|-----------|
| Skill registry unavailable | Skill load fails | Use cached skills (LRU cache, 24h TTL) |
| Agent queue overflowed | Agent spawn rejected | Queue rejection with 429 error; retry after backoff |
| Hook execution timeout | Hooks dropped silently | Log dropped hooks; alert after 10/min threshold |
| Database read replica lag | Stale session data | Fail-over to primary (temporary latency spike) |
| Cache (Redis) failure | Cache misses on all keys | Fall-back to direct DB queries (increased latency) |
| MCP server disconnection | Tool unavailable | Return error to user; log for ops investigation |
| API rate limit hit (Claude) | Requests queued or rejected | Queue bursts; implement exponential backoff |

### Recovery Procedures

#### Redis Outage (Cache Layer)

1. **Detection** (automated via health check)
   - Redis command timeout > 5s for 2 consecutive checks

2. **Immediate Actions**
   - Drain connections from failed node
   - Start cache rebuild from source-of-truth (DB)
   - Alert ops team

3. **Recovery**
   ```bash
   # Manual intervention if auto-recovery fails
   redis-cli shutdown
   systemctl restart redis-server
   # Populate from DB
   /scripts/rebuild-cache.py --source=postgresql --ttl=24h
   ```

4. **Validation**
   - Hit rate should return to >70% within 2 min
   - Latency should normalize within 5 min

#### Database Failover (Primary → Replica)

1. **Detection**
   - Primary connection timeout > 10s
   - Replication lag > 300s

2. **Automatic Actions**
   - DNS points to read replica
   - New primary elected (multi-master setup)

3. **Manual Actions**
   ```bash
   # Promote replica
   gcloud sql instances promote-replica [replica-name]
   # Verify replication to new replica
   gcloud sql instances describe [new-primary]
   ```

4. **Post-Incident**
   - Investigate primary failure root cause
   - Restore original primary as new replica
   - Rebuild replication chain

#### Kubernetes Pod Crash Loop

1. **Detection**
   - Pod restart count > 3 in 5 min
   - CrashLoopBackOff status

2. **Automated Recovery**
   - Pod evicted and rescheduled
   - Node drain if multiple pods affected

3. **Manual Investigation**
   ```bash
   kubectl logs [pod-name] --tail 100
   kubectl describe pod [pod-name]
   kubectl get events -n default
   ```

4. **Common Causes & Fixes**
   - Out of memory → Increase resource limits
   - Disk full → Clear logs, increase volume
   - Config error → Fix and redeploy
   - Dependency unavailable → Check service connectivity

#### High Latency (P95 > 2s)

1. **Diagnosis**
   - Check CPU utilization on all nodes
   - Check database query performance
   - Check network latency to Claude API
   - Check cache hit rate

2. **Quick Fixes**
   - Increase pod replicas (if CPU-bound)
   - Restart cache layer (if hit rate low)
   - Check MCP server connections (disconnect stuck clients)

3. **Longer-Term**
   - Profile slow operations
   - Add database indexes
   - Optimize skill loading (pre-cache)

---

## Compliance & Multi-Tenancy

### Audit Logging

```yaml
Audit Log Format (all fields required):
  timestamp: ISO-8601
  user_id: Unique identifier
  session_id: Correlation ID
  action: skill_load | agent_spawn | hook_executed | api_call
  resource: skill_name | agent_id | hook_name | endpoint
  result: success | error | timeout
  error_code: If failed
  latency_ms: Execution time
  context_tokens: Tokens used
  tenant_id: For multi-tenant deployments

Retention:
  Production: 90 days (with daily backups to S3 Glacier)
  Development: 7 days
  
Encryption:
  In-transit: TLS 1.2+
  At-rest: AES-256 (DB encryption)
```

### Multi-Tenant Isolation

```yaml
Isolation Layer:
  - Request context includes tenant_id (OIDC claim or header)
  - All queries filtered by tenant_id
  - Separate cache keys per tenant
  - Rate limits per tenant (not global)
  - Audit logs tagged with tenant_id

Database Schema:
  CREATE TABLE sessions (
    session_id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    user_id UUID NOT NULL,
    created_at TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    INDEX (tenant_id, created_at)
  );

Security:
  - Row-level security (RLS) on all tables
  - Tenant admins cannot query other tenants
  - Separate encryption keys per tenant (optional, high-security)
```

---

## Recommendations Summary

### For Local Development
- 4 GB RAM, 2-core CPU sufficient
- SQLite for local state
- No special scaling needed

### For Small Teams (50–200 users)
- 2-tier: Load balancer + app servers + PostgreSQL + Redis
- 4 app servers, 6 GB Redis, 100 GB PostgreSQL
- ~$2k–$5k/month on AWS

### For Enterprise (500–2,000 users)
- 3-tier: API Gateway + app/worker pools + PostgreSQL + Redis cluster
- 12 API servers, 24 workers, 64 GB Redis, 500 GB PostgreSQL
- Kubernetes + observability stack
- ~$15k–$50k/month

### For Platform / SaaS (5,000+ users)
- 4-tier: Global CDN + multi-region deployment + managed services
- Auto-scaling Kubernetes, managed databases, regional caching
- Distributed tracing, centralized logging, incident management
- $100k–$500k+/month

---

## References

- [Claude API Rate Limits](https://docs.anthropic.com/en/docs/resources/rate-limits) — Token budget, request limits
- [Kubernetes Horizontal Pod Autoscaling](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) — Auto-scaling configuration
- [PostgreSQL Performance Tuning](https://www.postgresql.org/docs/current/performance-tips.html)
- [Redis Sentinel vs Cluster](https://redis.io/docs/management/sentinel/) — High availability patterns
- [Designing Data-Intensive Applications](https://dataintensive.net/) — Distributed system principles

---

**Last Reviewed:** June 2026  
**Next Review:** December 2026  
**Owner:** Platform Engineering Team  
**Emergency Contact:** devops@claudient.io
