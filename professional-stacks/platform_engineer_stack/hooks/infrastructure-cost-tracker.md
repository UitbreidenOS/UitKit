# Infrastructure Cost Tracker Hook

## Purpose

Automatically logs infrastructure cost changes and resource utilization after deployments, enabling cost tracking, budget monitoring, and optimization identification.

## settings.json Configuration

```json
{
  "hooks": {
    "postToolUse": {
      "infrastructure-cost-tracker": {
        "shell": "bash",
        "script": "platform_engineer_stack/hooks/infrastructure-cost-tracker.sh",
        "filter": {
          "toolNames": ["CompatBash07a2a1"],
          "commandPatterns": [
            "terraform apply",
            "kubectl scale",
            "helm upgrade",
            "aws ec2",
            "gcloud compute"
          ]
        }
      }
    }
  }
}
```

## Hook Behavior

This hook fires AFTER infrastructure changes are applied successfully. It:

1. **Detects infrastructure changes** — terraform apply, scaling operations, etc.
2. **Calculates resource changes** — What was added/removed/modified?
3. **Estimates cost impact** — Monthly cost change for new resources
4. **Logs to tracking system:**
   - Timestamp of change
   - What changed (e.g., "Scaled from 3 to 5 replicas")
   - Cost delta (e.g., "+$200/month")
   - Resource type and quantity
   - Tags/labels for categorization
5. **Updates cost dashboard** — Feeds data to cost monitoring system
6. **Alerts on anomalies** — Warns if cost increases unexpectedly

## Example Flow

```
User: kubectl scale deployment api-service --replicas=5

Deployment successful. Now tracking cost...

✓ Previous: 3 x t3.large (on-demand) = $90/month
✓ Current:  5 x t3.large (on-demand) = $150/month
✓ Delta:    +$60/month

Logged to cost tracker:
- Timestamp: 2026-06-15T14:30:00Z
- Service: api-service
- Change: Replica count 3→5
- Resource: t3.large EC2 instances
- Cost delta: +$60/month
- Reason: Manual scaling to handle load spike
- Forecast: Will expire 2026-06-17 (temporary)

Cost updated in dashboard:
- Monthly infrastructure cost: $8,523 (was $8,463)
- Alert: Budget approaching limit ($9,000)
```

## Implementation

Hook script: `platform_engineer_stack/hooks/infrastructure-cost-tracker.sh`

**Script responsibilities:**

1. Parse deployment output (resource IDs, counts, types)
2. Query cloud provider pricing APIs
3. Calculate monthly cost estimates
4. Log to cost tracking database
5. Update dashboards
6. Check against budget thresholds
7. Send cost alerts if needed

## Cost Tracking Format

```json
{
  "timestamp": "2026-06-15T14:30:00Z",
  "deployment": {
    "type": "kubectl_scale",
    "service": "api-service",
    "namespace": "production"
  },
  "changes": [
    {
      "resource_type": "kubernetes_pod",
      "resource_name": "api-service",
      "previous_count": 3,
      "current_count": 5,
      "unit_cost": "$20/month",
      "cost_delta": "+$40/month"
    }
  ],
  "estimated_monthly_delta": "+$60/month",
  "affected_budget": "compute",
  "justification": "Load increase from 1000 to 1500 req/sec",
  "forecast": {
    "temporary": true,
    "expected_duration": "2 days",
    "reversal_planned": "2026-06-17"
  },
  "commit_hash": "abc123def456",
  "deployed_by": "engineer@company.com"
}
```

## Cost Monitoring Rules

### Budget Alerts

```bash
# Monthly budget: $10,000
# Alert when:
# - Spending > $9,000 (90% of budget)
# - Week-over-week increase > 10%
# - Single deployment adds > $500/month

# Query: Sum all cost_delta entries for current month
# If sum > 9000, send alert to team lead
```

### Anomaly Detection

```bash
# Alert if:
# - Replica count increased but load didn't (wasted resources)
# - Multiple expensive instance types provisioned (maybe wrong choice)
# - Data transfer costs spiking (possible data leak)
# - Unused resources detected (forgotten test infrastructure)
```

### Cost Attribution

```bash
# Tag all resources for cost allocation:
# - Service: api-service, user-service, admin-service
# - Environment: production, staging, development
# - Cost center: engineering, marketing, finance
# - Owner: team-name

# Query cost by any tag combination
# Example: "Cost of api-service in production: $2,500/month"
```

## Reporting

**Daily Cost Report:**
```
Infrastructure Cost Summary - 2026-06-15

Month-to-date: $4,523
Average/day: $301
Forecast (30 days): $9,030 (90% of budget)

Recent Changes:
- 06-15 14:30 api-service scale 3→5: +$60/month
- 06-14 10:15 add read replica: +$120/month
- 06-12 16:45 upgrade database: +$200/month

Top cost drivers:
1. Compute (EC2/Kubernetes pods): $5,000 (55%)
2. Database (RDS, backups): $3,000 (33%)
3. Storage (S3, EBS): $800 (9%)
4. Network (data transfer): $200 (2%)

Optimization opportunities:
- Switch 2 instances to reserved capacity: -$300/month
- Compress logs before S3 storage: -$50/month
- Use spot instances for batch jobs: -$100/month
```

**Cost by Service:**
```
api-service:     $3,000/month (35%)
user-service:    $2,500/month (28%)
batch-processor: $1,500/month (17%)
admin-service:   $800/month (9%)
other:           $400/month (4%)
```

## Integration Points

1. **Slack notifications** — Post cost changes to #infrastructure-costs
2. **Dashboards** — Grafana/DataDog dashboard showing cost trends
3. **Budget system** — Integration with company expense tracking
4. **Alerts** — PagerDuty alert if budget at risk
5. **GitOps** — Log changes to git for audit trail

## Status

Stub — structure defined, implementation pending. Script should:
- Query cloud provider APIs (AWS, GCP, Azure)
- Calculate costs based on resource changes
- Log to database or file
- Post to Slack/dashboards

---
