---
description: Diagnoses analytics pipeline issues — missing data, metric mismatches, slow queries, failed dbt runs. Traces through data lineage to identify root cause and prescribes fixes.
---

# /diagnose-issue

## What This Does

Runs the analytics-troubleshooter skill to quickly root-cause production issues. Traces data lineage from source → staging → marts → dashboard, checks freshness, inspects logs, and identifies why metric values are wrong or data is missing.

## Steps Claude Follows

1. Ask for: What's broken (metric mismatch, slow query, missing data, dbt failure), which tables/dashboards affected, when it started
2. Run analytics-troubleshooter skill — data freshness check, lineage trace, log inspection, SQL validation
3. Check upstream tables for delayed/incomplete data
4. Compare current values to baseline (expected row counts, volumes)
5. Identify root cause (data source issue, transformation bug, dependency failure, refresh timing, schema mismatch)
6. Prescribe fix (SQL update, dbt change, rerun, index creation) with test plan
7. Return troubleshooting runbook with timeline and prevention steps

## Next Action Logic

- **Data freshness issue:** "Upstream table delayed by Xh; re-run ETL job; check source system"
- **SQL bug:** "Query logic incorrect; apply fix; test in dev; deploy to prod"
- **Performance issue:** "Query timeout due to missing index; add clustered index; re-run dbt job"
- **Dependency failure:** "Upstream transformation failed; check dbt logs; fix root cause; re-run pipeline"
- **Schema mismatch:** "Column renamed/dropped; update downstream references; validate schema consistency"

## Output Format

### Troubleshooting Runbook

```
# Analytics Troubleshooting Runbook

## Symptom
[What is broken; when discovered; impact]

## Investigation Steps
1. Check data freshness
2. Review job logs (dbt Cloud, ETL tool)
3. Analyze problematic query
4. Compare to baseline (expected values)
5. Trace through lineage

## Root Cause
[Primary, secondary, tertiary causes]

## Fix
### Immediate (fix the query/data)
[SQL change or dbt fix]

### Intermediate (optimization)
[Index creation, partitioning]

### Long-term (prevent recurrence)
[Monitoring, alerts, architecture changes]

## Validation
[How to verify the fix works]

## Deployment
[Steps to release fix to production]

## Prevention
[Monitoring and alerting setup]

## Timeline
[When each action was taken; resolution time]
```

## Examples

### Example 1: Monthly Revenue Dashboard Shows Wrong Number

**Symptom:**
- Dashboard: Monthly Revenue Report (May 2026) shows $1.8M
- Expected: $2.4M (25% discrepancy)
- Detected: June 1, 9 AM
- Impact: Finance team questions revenue report; affects forecast accuracy

**After `/diagnose-issue`:**

**Root Cause:** fct_orders table stale by 27 hours; dbt job hung on mart_daily_metrics query timeout

**Fix (immediate):**
- Optimize mart_daily_metrics query (remove unnecessary joins, add date filter)
- Re-run dbt job manually
- Dashboard updates to correct value ($2.4M)

**Result:** Issue resolved in 1.5 hours; dashboard accurate

### Example 2: dbt Job Failing Every Morning

**Symptom:**
- dbt Cloud job scheduled 6 AM UTC every day
- Last 4 days: failed with error "Query timeout"
- Status: stg_customers model timing out
- Impact: All downstream models blocked; no data refresh

**After `/diagnose-issue`:**

**Root Cause:** stg_customers query runtime increasing; table now 12B rows; missing index on join column

**Fix (immediate):**
- Add clustered index on `user_id` column in stg_customers
- Re-run dbt job; now completes in 8 min (vs. timeout)

**Fix (intermediate):**
- Profile query; identify where to add additional indexes
- Consider incremental load strategy for future growth

**Result:** dbt job now succeeds consistently; SLA met

### Example 3: Churn Metric Mismatch Across Dashboards

**Symptom:**
- Dashboard A shows churn rate: 3.2%
- Dashboard B shows churn rate: 4.1% (same period)
- Both reference "churn" metric; discrepancy undermines trust
- Detected: Stakeholder escalation

**After `/diagnose-issue`:**

**Root Cause:** Two different SQL definitions of churn
- Dashboard A: Customers inactive for 60+ days = churned
- Dashboard B: Customers who explicitly cancelled = churned
- Difference: 8,000 customers in grace period (inactive but not cancelled)

**Fix (immediate):**
- Define canonical churn metric (60+ days inactive)
- Update Dashboard B to use same definition
- Update metrics registry with unambiguous formula

**Result:** Both dashboards now aligned; single source of truth

---
