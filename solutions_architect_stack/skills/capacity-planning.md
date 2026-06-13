---
name: capacity-planning
description: Forecasts infrastructure and resource needs based on projected growth. Calculates server count, database sizing, network bandwidth, and cost projections. Outputs capacity roadmap with spending milestones.
allowed-tools: Write
effort: medium
---

# Capacity Planning

## When to activate

After solution architecture is approved and before infrastructure provisioning. Triggered by: known growth trajectory, customer SLA requirements, or periodic review (quarterly). Essential before year-end planning or major feature launches. Run whenever user projections or load profile change significantly.

## When NOT to use

Not for existing systems in steady state (use monitoring and alerting instead). Not without load testing data (estimate conservatively if missing). Not for small POCs that will be rebuilt. Not if you have <3 months of production data (too early to extrapolate).

## Planning Checklist

1. **Current Load Profile**
   - [ ] Peak throughput (req/sec, transactions/sec)
   - [ ] Concurrent users (current and realistic peak)
   - [ ] Data volume (stored data, growth rate per month)
   - [ ] Data retention policy (how long kept)
   - [ ] Backup/archival needs

2. **Growth Projections**
   - [ ] User growth forecast (conservative, realistic, aggressive)
   - [ ] Data growth forecast (documents, transactions, logs)
   - [ ] Seasonality (peaks in certain months?)
   - [ ] Planned feature launches (will they increase load?)
   - [ ] Geographic expansion (multi-region needs?)

3. **Performance Requirements**
   - [ ] Latency targets (p50, p95, p99)
   - [ ] Throughput targets (concurrent users, req/sec)
   - [ ] Availability SLA (uptime %, downtime tolerance)
   - [ ] Data consistency requirements (strong vs. eventual)

4. **Resource Consumption Model**
   - [ ] CPU per request (profile via load test)
   - [ ] Memory per request (session size, cache needs)
   - [ ] Storage per record (database, logs, backups)
   - [ ] Network per request (payload size, bandwidth)
   - [ ] Database connections (pool size per req/sec)

5. **Cost Model**
   - [ ] Compute costs (servers, containers, serverless)
   - [ ] Database costs (managed service, licensing, backups)
   - [ ] Network costs (ingress/egress, CDN)
   - [ ] Storage costs (primary, backup, archive)
   - [ ] Operational costs (monitoring, support, licenses)

## Output Format

### Capacity Roadmap

**Current State** (as of [date])

| Metric | Value |
|---|---|
| Daily Active Users | 10,000 |
| Peak Throughput | 500 req/sec |
| Stored Data | 500 GB |
| Concurrent Connections | 5,000 |
| API Latency (p99) | 200 ms |
| Database Size | 250 GB |

**Growth Projections** (3-year horizon)

| Period | Users | Throughput (req/sec) | Stored Data | Infrastructure |
|---|---|---|---|---|
| **Today (M0)** | 10K | 500 | 500 GB | 4x app servers, 1x db |
| **6 months (M6)** | 25K | 1,200 | 1.2 TB | 8x app servers, 1x db (scaled) |
| **1 year (M12)** | 50K | 2,500 | 2.5 TB | 16x app servers, 2x db (replica) |
| **2 years (M24)** | 150K | 7,500 | 7 TB | 32x app servers, 4x db (sharded) |
| **3 years (M36)** | 300K | 15,000 | 15 TB | 64x app servers, 8x db (distributed) |

**Bottleneck Analysis**

At each milestone, what will become the constraint?

| Milestone | Bottleneck | Mitigation | Cost Impact |
|---|---|---|---|
| **M0→M6** | Database connections | Add connection pooling | +$2K/mo |
| **M6→M12** | Compute (CPU on app servers) | Add load balancer, scale out | +$5K/mo |
| **M12→M24** | Database query performance | Sharding, replication | +$10K/mo |
| **M24→M36** | Network bandwidth | Multi-region, CDN | +$15K/mo |

**Server Sizing** (per component)

**Application Servers**
- Current: 4x [size] instances
- M6: 8x [size] instances
- M12: 16x [size] instances

Reasoning: Each server handles ~125 req/sec. At M12 (2,500 req/sec), need 20 servers (over-provisioned by 1.25x for redundancy).

**Database**
- Current: 1x PostgreSQL [size], 500 GB storage
- M6: 1x PostgreSQL (scaled up), 1.2 TB storage
- M12: 1x primary + 1x replica, 2.5 TB storage
- M24: Sharded (3 shards), 7 TB storage

Reasoning: Single server can handle ~5K req/sec if well-tuned. At M24 (7.5K req/sec), sharding is required to maintain <100ms latency.

**Cache Layer** (Redis or Memcached)
- Current: 1x Redis [size], 50 GB heap
- M12: 1x Redis (scaled up), 200 GB heap
- M24: Redis cluster (3 nodes), 500 GB total

**CDN & Static Serving**
- Current: CloudFront, 10 GB/month bandwidth
- M12: CloudFront, 50 GB/month bandwidth
- M24: Multi-region edge, 200 GB/month bandwidth

**Cost Projections**

| Period | Compute | Database | Network | Storage | Monitoring | Total/Month |
|---|---|---|---|---|---|---|
| **M0** | $4K | $2K | $500 | $1K | $500 | $8K |
| **M6** | $8K | $4K | $1K | $2K | $1K | $16K |
| **M12** | $16K | $8K | $2K | $4K | $2K | $32K |
| **M24** | $32K | $16K | $5K | $8K | $4K | $65K |
| **M36** | $64K | $32K | $10K | $15K | $8K | $129K |

**Cost per User** (unit economics)
- M0: $0.80/user/month
- M12: $0.64/user/month
- M24: $0.43/user/month

(Cost decreases with scale due to spreading fixed costs and improving efficiency.)

**Contingency Plans**

**If Growth Exceeds Projections (2x faster):**
- Implement aggressive caching (database queries halved)
- Move non-critical services to async queues
- Fast-track sharding implementation
- Consider serverless for traffic spikes

**If Growth Stalls:**
- Defer sharding/multi-region (save ~$30K/mo)
- Right-size instances (move from large to medium)
- Consolidate underutilized services
- Reduce monitoring/alerting complexity

**Optimization Opportunities**

| Opportunity | Current Cost | Optimized Cost | Savings | Implementation |
|---|---|---|---|---|
| Database indexing | $8K | $6K | $2K/mo | Q3 |
| Query optimization | $8K | $6K | $2K/mo | Q3 |
| Connection pooling | $2K | $1K | $1K/mo | Q2 |
| Compression (API responses) | $1K | $0.5K | $0.5K/mo | Q2 |
| Aggressive caching | $2K | $1K | $1K/mo | Q4 |

**Scaling Strategy by Component**

**Vertical Scaling** (bigger servers)
- Pros: Simple, less operational overhead
- Cons: Limited ceiling, expensive, eventual downtime for upgrades
- Best for: Small teams, low traffic, early stage

**Horizontal Scaling** (more servers)
- Pros: Unlimited, resilient, cost-efficient at scale
- Cons: More complex, requires load balancing, stateless design
- Best for: High traffic, growth trajectory, distributed systems

**Recommendation:** Start vertical (M0–M6), transition to horizontal after M6.

**Monitoring & Metrics** (for continuous capacity management)

Track weekly:
- Actual vs. projected user growth
- Actual vs. projected load (req/sec, data volume)
- Resource utilization (CPU, memory, disk, network)
- Cost actuals vs. budget

Capacity review quarterly:
- Update growth projections based on new data
- Adjust scaling timeline if needed
- Identify and implement optimizations
- Report to finance on cost efficiency

---
