# Cloud Cost Audit Routine

Monitors cloud spending — identifies cost spikes, unused resources, and optimization opportunities.

---

## Schedule

Weekly on Monday morning.

---

## Steps

1. **Fetch billing data.** Pull cost breakdown by service from AWS Cost Explorer / GCP Billing / Azure Cost Management.
2. **Detect anomalies.** Flag services with >20% cost increase vs. previous week.
3. **Find waste.** Identify unused resources: idle EC2 instances, unattached EBS volumes, orphaned snapshots, oversized RDS.
4. **Check budgets.** Compare current spend vs. monthly budget. Project end-of-month cost.
5. **Recommendations.** Right-size suggestions, reserved instance opportunities, spot instance candidates.
6. **Generate report.** Weekly cost summary with trend chart data.

---

## Configuration

```yaml
schedule: "weekly Monday 08:00"
inputs:
  - AWS Cost Explorer / GCP Billing API
  - Resource inventory
  - Budget thresholds
output:
  - cost-report-YYYY-MM-DD.md
  - Slack alert if over budget
  - Optimization recommendations
```

---

Built with [Claudient](https://github.com/UitbreidenOS/Claudient) · [Claude Code](https://claude.com/claude-code)
