# Cloud Cost Optimization

## When to activate

When conducting cost audits, planning reserved instance purchases, analyzing rightsizing opportunities, or designing cost-efficient cloud architectures.

## When NOT to use

For one-off cost checks or when cost is not a primary constraint of the architecture.

## Instructions

Cost optimization requires systematic analysis, not guessing. Follow this framework:

### 1. Cost Audit Methodology

Analyze costs in 4 dimensions:

**a) Compute (50% of spend typically)**
- Instance type, size, utilization
- Reserved instances (RI) / Savings Plans (SP) coverage
- Spot instances for interruptible workloads
- Idle or underutilized instances

**b) Storage (20% typically)**
- Object storage (S3, Blob, GCS) usage and lifecycle
- Database storage (RDS, Cosmos, Firestore)
- Backup and snapshot retention
- Redundancy and replication

**c) Data Transfer (20% typically)**
- Inter-region transfer costs
- CDN vs. direct download tradeoffs
- NAT Gateway charges
- CloudFront, Azure CDN, Cloud CDN usage

**d) Managed Services (10% typically)**
- Lambda, Functions invocations and duration
- Database managed service overhead
- Message queue costs (SQS, Pub/Sub)
- Monitoring and logging (CloudWatch, Monitor, Logging)

### 2. Reserved Instance (RI) Analysis

**Framework:**

1. **Identify baseline compute** — What instances run 24/7, year-round?
2. **Calculate RI payback** — If I commit for 1 year, when do I break even?
3. **Right-size before buying** — Ensure instance is right size; RI for undersized instance is waste
4. **Blend RI + On-Demand** — Use RIs for baseline, On-Demand for spikes
5. **Track RI utilization** — Aim for >80% to justify the commitment

**RI ROI Calculation:**

```
On-Demand annual cost:    500 instances × $730/year × $1 = $365,000
1-year RI (40% discount): 500 instances × $730/year × 0.6 = $219,000
Payback period: $219,000 ÷ ($365,000/12) = 7.2 months

Decision: Buy 1-year RIs if confidence high on compute needs
Decision: Buy 3-year RIs if needs are very stable (30-50% additional discount)
```

**RI Purchasing Strategy (AWS):**

| Workload Type | Recommendation | Rationale |
|---|---|---|
| Production baseline (24/7) | 3-year RI | 50% discount, locked commitment |
| Semi-production (16h/day) | 1-year RI | Balances discount vs. flexibility |
| Ephemeral/testing | Spot instances | 70% discount, interruption acceptable |
| Variable peak load | On-Demand | No commitment, pay as you go |

**Savings Plans (more flexible):**
- Compute Savings Plans: 1-3 year commitment, discount applies across instance families
- Example: "I commit to $2000/month compute spend" applies across t3, m5, c5, etc.

### 3. Spot Instance Strategy

Spot instances cost 70% less but can be interrupted. Use for:

- Batch jobs with checkpointing
- Stateless application servers behind autoscaling
- Data processing (Spark, Hadoop)
- CI/CD pipeline runners
- Development/testing

Do NOT use for:
- Databases requiring data persistence
- Single-instance applications
- Real-time critical services

**Implementation:**
```
Primary fleet: 3× on-demand m5.xlarge + 2× spot m5.xlarge
Target group weight: On-Demand=60%, Spot=40%
Fallback: If spot unavailable, autoscale on-demand
Expected savings: 40% × 70% = 28% reduction
```

### 4. Tagging Strategy

Mandatory tags for cost allocation:

```
Project:      [project-name]
Environment:  [dev/staging/prod]
Owner:        [team/person]
CostCenter:   [cost-center-code]
Application:  [app-name]
ManagedBy:    [terraform/manual/cloudformation]
```

Query costs by tag:
```bash
# AWS
aws ce get-cost-and-usage \
  --time-period StartDate=2026-01-01,EndDate=2026-06-30 \
  --granularity MONTHLY \
  --metrics "UnblendedCost" \
  --group-by Type=DIMENSION,Key=TAG_Environment

# Result: Dev costs separate from Prod
```

### 5. Storage Lifecycle Policies

**S3/Blob Lifecycle:**
```
Current (0-30 days):        Standard storage ($0.023/GB)
Archive (31-90 days):       Infrequent access ($0.0125/GB)
Cold (91-365 days):         Glacier ($0.004/GB)
Delete (>365 days):         Remove
```

**Cost impact:** 100 TB data
- All standard: $2,300/month
- Tiered lifecycle: $800/month first month, then $400/month
- **Annual savings: $19,200**

**Implementation:**
```json
{
  "Rules": [
    {
      "Id": "transition-to-ia",
      "Filter": {"Prefix": "logs/"},
      "Transitions": [
        {
          "Days": 30,
          "StorageClass": "STANDARD_IA"
        },
        {
          "Days": 90,
          "StorageClass": "GLACIER"
        }
      ],
      "Expiration": {"Days": 365}
    }
  ]
}
```

### 6. Compute Rightsizing

**Process:**

1. **Identify underutilized instances** — CloudWatch metrics: CPU <20%, memory <40%
2. **Right-size before commitment** — Move t3.xlarge to t3.medium before buying RI
3. **Test smaller size** — Stage change, validate performance
4. **Measure savings** — Track price difference

**Example:**
```
Current:  m5.2xlarge (8 vCPU, 32 GB RAM) = $0.384/hour
Analysis: Peak CPU = 35%, peak memory = 28%
New:      m5.xlarge (4 vCPU, 16 GB RAM) = $0.192/hour
Savings:  $0.192/hour × 730 hours/month = $140/month ($1,680/year)
Risk:     Validate under peak load before fully committing
```

### 7. Data Transfer Costs

**Inter-region transfer:** $0.02/GB expensive. Minimize by:
- Using same region when possible
- Caching (CloudFront, CDN)
- Replicating only critical data

**Example cost:**
```
Scenario A: Single region + read from other regions
- Daily read: 1 TB from us-west-2 to eu-west-1
- Cost: 30 TB × $0.02/GB = $600/month

Scenario B: Multi-region read replicas
- Database replication: $200/month (RDS)
- Local reads: $0 data transfer
- Total: $200/month
- Savings: $400/month ($4,800/year)
```

### 8. Managed Service Optimization

**Lambda cost optimization:**
- Analyze execution time distribution
- Batch invocations to reduce function calls
- Increase memory (faster execution, reduced duration cost)
- Use reserved capacity for predictable baseline

**RDS cost optimization:**
- Right-size instance type
- Use read replicas instead of scaling vertically
- Enable automated backups (cheaper than manual)
- Use Aurora for variable workloads (pay per request)

**Cache optimization:**
- ElastiCache for hot data vs. querying database repeatedly
- CloudFront for static assets
- TTL tuning: balance freshness vs. requests

### 9. Cost Monitoring Dashboard

Create dashboard tracking:

```
Metric                    Target          Frequency
Daily spend              $X ±10%         Daily
RI utilization           >80%            Weekly
Top 5 cost drivers       [List]          Weekly
Cost per request         $[X] ±5%        Weekly
Reserved vs. On-Demand   [Ratio]         Monthly
Month-to-date vs budget  <100%           Daily
```

### 10. Cost Governance

**Monthly review process:**

1. **Forecast** — Project end-of-month spend
2. **Analyze variance** — Why is spend up/down vs. projection?
3. **Recommend** — RIs to buy, instances to rightsize, savings to implement
4. **Track** — Measure actual savings vs. projected
5. **Report** — Share with finance and engineering leadership

---

## Example

### Cost Optimization Project: SaaS Platform

**Baseline Analysis:**
```
Month 1 Spend: $85,000
- Compute: $42,500 (50%)
- Storage: $17,000 (20%)
- Data transfer: $17,000 (20%)
- Managed services: $8,500 (10%)
```

**Optimization Plan:**

1. **Reserved Instances** ($42,500 → $25,500)
   - Identify baseline compute: 200× t3.xlarge (24/7)
   - Buy 1-year RIs at 40% discount
   - Savings: $17,000/month

2. **Spot Instances** ($8,500 → $3,000)
   - Move ephemeral jobs to spot (70% discount)
   - Maintain availability with fallback to on-demand
   - Savings: $5,500/month

3. **Storage Lifecycle** ($17,000 → $8,500)
   - Implement S3 lifecycle: Standard → IA → Glacier
   - Archive logs older than 90 days
   - Savings: $8,500/month

4. **Data Transfer Reduction** ($17,000 → $12,000)
   - Enable CloudFront for static assets
   - Migrate cross-region reads to read replicas
   - Savings: $5,000/month

**Total Projected Savings:**
- $17,000 (RI) + $5,500 (spot) + $8,500 (storage) + $5,000 (transfer) = **$36,000/month**
- Baseline: $85,000 → Optimized: $49,000 (42% reduction)

**Implementation Timeline:**
- Week 1: Buy 1-year RIs for identified baseline
- Week 2: Implement S3 lifecycle policies
- Week 3: Configure CloudFront for static assets
- Week 4: Migrate batch jobs to spot instances
- Week 5: Monitor and adjust

**Tracking:**
```
Month 2 (post-optimization):
- Target: $49,000 (42% reduction)
- Actual: $51,200 (actual reduction: 40%)
- Variance: +$2,200 (within 5% tolerance)
- Next month actions: Fine-tune RI allocation, test spot interruption handling
```

---

**Version:** 1.0  
**Last updated:** 2026-06-15
