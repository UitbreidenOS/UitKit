# /optimize-costs Command

Conduct cloud cost audit, identify optimization opportunities, plan reserved instances, and design cost-efficient architecture.

## Input Parameters

Provide:
- **Current monthly spend** — Total cloud bill (e.g., "$50,000/month")
- **Cost breakdown** — By service (compute, storage, transfer) or top 10 services
- **Workload profile** — Always-on, peak hours, batch jobs, seasonal
- **Business constraints** — Cost target, performance SLO, growth rate
- **Current optimization level** — Baseline tools already in use (reservations, tagging, etc.)

## Output Deliverable

Complete cost optimization roadmap including:
1. **Cost audit summary** — Current spend breakdown, cost per unit (request, GB, etc.)
2. **Opportunity identification** — Top 5 optimization opportunities, estimated savings
3. **Reserved instance plan** — RI purchase recommendations with payback analysis
4. **Tagging strategy** — Cost allocation tags and implementation plan
5. **Cost governance** — Monthly review process, budgets, forecasting
6. **Implementation timeline** — Quick wins (1-2 weeks) vs. projects (4-12 weeks)
7. **Cost tracking dashboard** — KPIs and monitoring setup

## Example: SaaS Platform Cost Optimization

**Input:**
```
Current monthly spend: $85,000
Top services:
- EC2: $42,500 (50%)
- RDS: $17,000 (20%)
- S3: $12,750 (15%)
- Data transfer: $8,500 (10%)
- Other: $4,250 (5%)

Profile: 24/7 SaaS with 20% peak load surge
Constraints: Must maintain 99.95% uptime, budget target $50K/month
Currently using: On-demand instances only, no RIs
```

**Output:**

### 1. Cost Audit Summary

**Current state analysis:**

```
Compute (EC2): $42,500/month
├─ 200 × t3.xlarge on-demand: $0.1475/hour × 730h × 200 = $21,545
├─ 100 × m5.2xlarge on-demand: $0.384/hour × 730h × 100 = $28,032
└─ Utilization: CPU avg 35%, memory avg 40% (underutilized)

Database (RDS): $17,000/month
├─ db.r6g.4xlarge (8 vCPU, 128 GB): $3,000/month
├─ 2 read replicas: $4,000/month
├─ Backup storage: $2,000/month
├─ Data transfer (cross-AZ): $8,000/month
└─ Estimate: Over-provisioned for actual usage

Storage (S3): $12,750/month
├─ Standard storage (500 GB): $11,500/month
├─ Redundancy: All data replicated across 3 AZs
└─ Lifecycle: No archival, all data in standard storage

Data transfer: $8,500/month
├─ Inter-region: $4,000/month (EU users accessing US region)
├─ CloudFront: $3,000/month (static content)
├─ NAT Gateway: $1,500/month (outbound from private subnets)
└─ Opportunity: CDN not optimized

Total: $85,000/month
Cost per request: $85K / 10M requests = $0.0085/request
```

### 2. Opportunity Identification

| Opportunity | Current | Optimized | Monthly Saving | Effort |
|---|---|---|---|---|
| 1. Reserved instances (RI) | $42.5K | $25.5K | $17,000 | 1 week |
| 2. Spot instances | $28K | $10K | $18,000 | 2 weeks |
| 3. Database rightsizing | $17K | $10K | $7,000 | 2 weeks |
| 4. Storage lifecycle | $12.8K | $6.4K | $6,400 | 1 week |
| 5. Data transfer (CDN) | $8.5K | $5K | $3,500 | 2 weeks |
| **Total Savings** | **$85K** | **$56.9K** | **$28,100** | **2 months** |

**Target: $50K/month (41% reduction)**

### 3. Reserved Instance Plan

**Analysis:**

```
Baseline compute (runs 24/7):
- 200 × t3.xlarge: baseline server pool
- Utilization: 98% (critical path)
- Recommended: 3-year RI (50% discount)

Variable compute (spikes 20%):
- 100 × m5.2xlarge: handles peak load
- Utilization: 60% (not always needed)
- Recommended: 1-year RI (30% discount)

RI Savings Calculation:

t3.xlarge (200 units):
- On-demand: $0.1475/hour × 730 hours = $107.68/month
- 200 units × $107.68 = $21,536/month on-demand
- 3-year RI: $107.68 × 0.50 × 200 = $10,768/month
- Saving per unit: $107.68 - $53.84 = $53.84/month
- Total saving: $10,768/month

m5.2xlarge (100 units):
- On-demand: $0.384/hour × 730 hours = $280.32/month
- 100 units × $280.32 = $28,032/month on-demand
- 1-year RI: $280.32 × 0.70 × 100 = $19,622/month
- Saving: $8,410/month

Total RI saving: $10,768 + $8,410 = $19,178/month
```

**RI Purchase Plan:**

```
Action 1: Buy 200 × 3-year t3.xlarge RI (upfront: $64,704)
├─ Payback period: 6 months
├─ 3-year savings: $193,536
└─ Confidence: High (baseline, 98% utilization)

Action 2: Buy 100 × 1-year m5.2xlarge RI (upfront: $23,744)
├─ Payback period: 3 months
├─ 1-year savings: $100,920
└─ Confidence: Medium (peaks to 100, baseline 80)

Action 3: Evaluate Compute Savings Plans (flexible across families)
├─ Alternative: $48K/month commitment (vs. t3+m5)
├─ Benefit: Flexibility to change instance types
└─ Recommendation: Buy RIs first, track for next renewal

Total upfront investment: $88,448
Total 1-year savings: $294,456
ROI: 233% in year 1
```

### 4. Spot Instance Strategy

**Identify non-critical workloads:**

```
Baseline (critical): 200 × t3.xlarge on-demand
Peak load (non-critical): 100 × m5.2xlarge on-demand
└─ When not needed, these instances are idle
└─ Could tolerate 2-3 minute interruptions

Strategy: Run peak load on spot instances

Implementation:
- Target group with 2 weights:
  * On-demand: 70 weight (70 instances)
  * Spot: 100 weight (30 instances)
- If spot unavailable: Scale on-demand to compensate

Spot pricing: m5.2xlarge = $0.115/hour (vs. $0.384 on-demand)
Monthly cost:
- 30 × $0.115/hour × 730h = $2,523/month
- Current 30-instance cost: $8,410/month
- Saving: $5,887/month

Risk: Interruption → temporary 10% capacity loss
- Monitored: Auto-scale on-demand to compensate
- Duration: < 30 seconds typical
- Acceptable: Traffic reroutes during drain
```

### 5. Database Rightsizing

**Current:** db.r6g.4xlarge (8 vCPU, 128 GB) @ $3,000/month

**Analysis:**
```
CloudWatch metrics (1-month sample):
- Max CPU: 35%
- Max memory: 60% (77 GB of 128 GB)
- Connections: 450 (max capacity: 500)
- Storage: 50 GB (allocated 200 GB)

Conclusion: Over-provisioned for actual usage
```

**Target:** db.r6g.2xlarge (4 vCPU, 64 GB) @ $1,500/month

**Validation:**
```
Plan:
1. Create read replica on db.r6g.2xlarge
2. Monitor for 1 week (reads only)
3. Promote replica, promote backup (0 downtime)
4. Monitor for 2 weeks (full load)
5. If stable, keep; if degraded, revert to 4xlarge

Risk: Connection limit drops from 500 to 400
├─ Current usage: 450 connections
├─ Mitigated: Implement connection pooling (PgBouncer)
└─ Action: Deploy pooling before resize

Saving: $3,000 - $1,500 = $1,500/month baseline
Multiply: 2 read replicas at same size
- Read replica 1: $1,500/month
- Read replica 2: $1,500/month
- Total saving: $4,500/month
```

### 6. Storage Lifecycle Policy

**Current state:**
```
All 500 GB in standard storage @ $0.023/GB = $11,500/month
Stored indefinitely (no lifecycle)
```

**Proposed lifecycle:**

```
0-30 days:    Standard storage ($0.023/GB)  ← Most accessed
31-90 days:   Intelligent-Tiering ($0.0125/GB)
91-365 days:  Glacier ($0.004/GB)
365+ days:    Deep Archive ($0.00099/GB) or delete
```

**Data distribution estimate:**
```
Current (500 GB):
├─ Hot (0-30 days, 200 GB): $4,600/month
├─ Warm (31-90 days, 150 GB): $1,875/month
├─ Cold (91-365 days, 100 GB): $400/month
├─ Archive (365+, 50 GB): $50/month
└─ Total: $6,925/month (vs. $11,500 current)

Savings: $4,575/month (40%)
```

**Implementation (S3 Lifecycle Policy):**
```json
{
  "Rules": [
    {
      "Id": "move-to-ia",
      "Filter": {"Prefix": "data/"},
      "Transitions": [
        {
          "Days": 30,
          "StorageClass": "STANDARD_IA"
        },
        {
          "Days": 90,
          "StorageClass": "GLACIER"
        },
        {
          "Days": 365,
          "StorageClass": "DEEP_ARCHIVE"
        }
      ],
      "Expiration": {"Days": 2555}
    }
  ]
}
```

### 7. Data Transfer Optimization

**Current state:**
```
Inter-region (US → EU): $4,000/month
├─ 200 GB/month transferred
├─ Rate: $0.02/GB (expensive!)
└─ Cause: EU users querying US database

CloudFront: $3,000/month
├─ 200 GB/month cached
├─ Rate: $0.015/GB
└─ Static assets only

NAT Gateway: $1,500/month
├─ $32/month × 1 gateway
├─ Data processed: $0.045/GB × 32 GB
└─ Could add second AZ NAT
```

**Optimization plan:**

1. **Deploy read replicas in eu-west-1** (EU database)
   - Cost: +$1,500/month (RDS replica)
   - Saving: -$4,000/month (data transfer)
   - Net saving: $2,500/month
   - Complexity: Route53 geolocation, eventual consistency

2. **Expand CloudFront coverage**
   - Currently only static assets
   - Extend to API (30% cacheable)
   - Cost: +$500/month
   - Saving: -$1,500/month (reduced origin traffic)
   - Net saving: $1,000/month

3. **Optimize NAT Gateway**
   - Current: 1 NAT in 1 AZ
   - Cost: Underutilized ($32/month possible)
   - Could consolidate to single NAT
   - Saving: $0 (likely already optimal)

**Total data transfer saving: $3,500/month**

### 8. Cost Governance Setup

**Monthly cost review process:**

```
Week 1 (Cost Analysis):
├─ Forecast end-of-month spend
├─ Analyze variance from budget
├─ Identify anomalies (sudden spikes)
└─ Review cost per unit (requests, GB, etc.)

Week 2 (Optimization):
├─ Recommend RI purchases or adjustments
├─ Identify idle resources
├─ Plan rightsizing or shutdowns
└─ Adjust budgets if needed

Week 3 (Reporting):
├─ Finance: Budget vs. actual
├─ Engineering: Cost per service breakdown
├─ Leadership: Spend trends, forecast
└─ All: Cost optimization ideas (bottom-up)

Week 4 (Governance):
├─ Approve major changes (RIs, infrastructure)
├─ Track action item resolution
├─ Update cost estimates for new projects
└─ Training: Cost awareness for engineers
```

**Cost tracking dashboard:**

```
KPIs:
- Daily spend (vs. forecast)
- Cost per request (trend)
- Reserved instance utilization (>80%)
- On-demand vs. reserved ratio (target: 20/80)
- Top 5 cost drivers (monitor for spikes)
- Unused resources (idle instances, old snapshots)
```

### 9. Implementation Timeline

**Phase 1: Quick wins (Week 1-2)**
- [ ] Set up cost tagging (1 week)
- [ ] Configure S3 lifecycle policies (1 day)
- [ ] Purchase recommended RIs ($88K upfront)

**Phase 2: Architecture changes (Week 3-6)**
- [ ] Deploy spot instances for peak load (2 weeks)
- [ ] Implement connection pooling (1 week)
- [ ] Plan database migration to eu-west-1 read replicas (2 weeks)

**Phase 3: Optimization review (Week 7-8)**
- [ ] Measure actual savings vs. projections
- [ ] Fine-tune instance types and counts
- [ ] Document lessons learned
- [ ] Plan next optimization cycle

### 10. Cost vs. Performance Tradeoff

**Before optimization:**
```
Monthly cost: $85,000
Compute utilization: 35-40% (wasteful)
Requests/month: 10M
Cost per request: $0.0085
```

**After optimization:**
```
Monthly cost: $49,000 (42% reduction)
Compute utilization: 65-75% (better packed)
Requests/month: 10M (same)
Cost per request: $0.0049
Savings: $36,000/month ($432K/year)
```

**Performance impact:**
- Latency: No change (still <50ms p99)
- Availability: Improved (redundancy, geo-distribution)
- Throughput: No change (same hardware, better utilization)
- Reliability: Enhanced (RI commitment + monitoring)

---

**Success metrics:**
- Budget target achieved: $50K/month (41% reduction)
- RI utilization: >80%
- Cost per request: <$0.006
- Forecast accuracy: ±5% month-to-month
- Anomaly detection: Alert on >10% daily variance
