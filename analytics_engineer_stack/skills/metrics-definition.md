---
name: metrics-definition
description: Defines business metrics with precision — formula, grain, calculation window, data source, and edge cases. Creates a metrics registry with unambiguous specifications to prevent dashboard drift and calculation mismatches.
allowed-tools: Read, Write
effort: medium
---

## When to activate

When building a metrics layer, creating KPI definitions for stakeholders, or reconciling dashboard metric discrepancies. Run before implementing metrics in dbt, a semantic layer, or dashboard tool. Use whenever a business metric needs a single source of truth.

## When NOT to use

Not for ad-hoc metric exploration — this skill is for canonical, production metrics. Not without stakeholder alignment on what the metric should measure. Not for exploratory analysis without clear business context.

## Metrics Definition Checklist

1. **Identify the metric** — What business outcome does it measure (revenue, churn, DAU, NPS)?
2. **Define the formula** — Explicit SQL or calculation steps; no ambiguity
3. **Set the grain** — Atomic level (daily, user-level, transaction-level)
4. **Specify the window** — MTD, YTD, rolling 30 days, point-in-time?
5. **Document the source** — Which fact table, dimension, or raw table?
6. **List edge cases** — Nulls, outliers, data quality issues, cancellations, refunds
7. **Specify SLA** — Latency requirement (real-time, hourly, daily, weekly)
8. **Owner & stakeholders** — Who owns the metric; who consumes it

## Metric Types

**Fact metric** — Counts or sums directly from raw events (transactions, page views, sign-ups). Example: total_revenue, order_count.

**Ratio metric** — Quotient of two other metrics (conversion_rate = conversions / visitors). Risk: division by zero edge cases.

**Derived metric** — Calculated from other metrics or dimensions (net_revenue = gross_revenue - refunds - discounts).

**Cohort metric** — Grouped by cohort dimension, tracked over time (cohort_retention = active_users_this_month / users_in_cohort).

**Derived time-series metric** — Change over time (month_over_month_growth = (current_month - prior_month) / prior_month).

## Metrics Registry Template

```markdown
# Metrics Registry

**Team:** [Team name]  
**Last Updated:** [date]  
**Owner:** [Name, role]  

---

## Metric: [Metric Name]

**Business Definition:** [One sentence — what does this metric measure and why?]

**Formula:**
\`\`\`sql
SELECT 
  SUM(transaction_amount) AS metric_value
FROM fact_transactions
WHERE DATE(transaction_date) >= '2026-01-01'
  AND DATE(transaction_date) < '2026-02-01'
  AND transaction_status = 'completed'
\`\`\`

**Grain:** [Monthly / Daily / User-level / Transaction-level]  
**Calculation Window:** [Calendar month / Rolling 30 days / Fiscal quarter]  
**Data Source:** [fact_transactions] from [Data warehouse name]  
**Latency:** [Real-time / Hourly / Daily / Weekly]  
**Owner:** [Name]  
**Stakeholders:** [Teams/roles that consume this metric]

---

## Edge Cases & Handling

| Case | Value | Treatment |
|------|-------|-----------|
| Refunded transactions | Negative amount | Included in sum (net revenue) |
| Cancelled orders | NULL status | Excluded (WHERE status = 'completed') |
| Multi-currency | EUR, GBP, JPY | Converted to USD at transaction_date rate |
| Free trial users | $0 | Excluded (WHERE subscription_type != 'trial') |

---

## Calculation Example

**Period:** January 2026  
**Expected Output:** ~$2.4M

**Debug Query:**
\`\`\`sql
SELECT 
  transaction_date,
  COUNT(*) AS tx_count,
  SUM(transaction_amount) AS daily_revenue
FROM fact_transactions
WHERE DATE(transaction_date) >= '2026-01-01'
  AND DATE(transaction_date) < '2026-02-01'
  AND transaction_status = 'completed'
GROUP BY transaction_date
ORDER BY transaction_date;
\`\`\`

---

## Implementation

**In dbt:** Create a metric node in `schema.yml`:

\`\`\`yaml
metrics:
  - name: total_revenue
    label: Total Revenue
    model: fact_transactions
    description: "Sum of all completed transactions in USD"
    calculation_method: sum
    expression: transaction_amount
    filters:
      - field: transaction_status
        operator: '='
        value: 'completed'
    time_grains: [day, month, quarter, year]
\`\`\`

**In semantic layer:** Register metric in [Tool name] with refresh cadence and permissions.

---

## Reconciliation

**Dashboard vs. Report mismatch?** Check:
1. Calculation window (MTD vs. calendar month vs. rolling)
2. Data freshness (real-time vs. 1-day lag)
3. Filter differences (active users vs. all users)
4. Dimension slice (country filter, subscription type, etc.)

---

### [Metric 2 Name]

**Business Definition:** [definition]  
**Formula:** [SQL]  
**Grain:** [grain]  
... (repeat template)

---


```

## Example

# Metrics Registry

**Team:** Analytics  
**Last Updated:** June 12, 2026  
**Owner:** Alice Chen, Senior Analytics Engineer  

---

## Metric: Monthly Recurring Revenue (MRR)

**Business Definition:** Total predictable revenue from active subscriptions at month-end, excluding one-time purchases and trials.

**Formula:**
```sql
SELECT 
  DATE_TRUNC('month', DATE(snapshot_date))::DATE AS month_end,
  SUM(monthly_subscription_amount) AS mrr
FROM dim_subscriptions
WHERE snapshot_date = DATE_TRUNC('month', DATE(snapshot_date)) + INTERVAL '1 month' - INTERVAL '1 day'
  AND subscription_status = 'active'
  AND subscription_type NOT IN ('trial', 'free')
GROUP BY DATE_TRUNC('month', DATE(snapshot_date));
```

**Grain:** Monthly (aggregated across all active subscriptions at month-end)  
**Calculation Window:** Calendar month (measured at last day of month)  
**Data Source:** dim_subscriptions from Data warehouse  
**Latency:** Daily (snapshot taken nightly)  
**Owner:** Alice Chen  
**Stakeholders:** Finance, Product, Executive Leadership  

---

## Edge Cases & Handling

| Case | Value | Treatment |
|------|-------|-----------|
| Trial subscriptions | $0 or small | Excluded (subscription_type != 'trial') |
| Cancelled mid-month | Prorated | Counted if active on month-end snapshot |
| Annual plans | $X/12 | Stored in monthly_subscription_amount column |
| Paused subscriptions | $0 | Excluded (subscription_status = 'active') |

---

## Calculation Example

**Period:** May 2026  
**Expected Output:** ~$1.8M

**Debug Query:**
```sql
SELECT 
  subscription_id,
  customer_id,
  monthly_subscription_amount,
  subscription_status,
  subscription_type
FROM dim_subscriptions
WHERE snapshot_date = '2026-05-31'
  AND subscription_status = 'active'
  AND subscription_type NOT IN ('trial', 'free')
LIMIT 100;
```

---

## Implementation

**In dbt:**
```yaml
metrics:
  - name: monthly_recurring_revenue
    label: MRR
    model: dim_subscriptions
    description: "Total monthly recurring revenue from active subscriptions"
    calculation_method: sum
    expression: monthly_subscription_amount
    filters:
      - field: subscription_status
        operator: '='
        value: 'active'
      - field: subscription_type
        operator: not_in
        value: ['trial', 'free']
    time_grains: [month, quarter, year]
```

---
