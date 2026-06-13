---
name: analytics-troubleshooter
description: Diagnoses analytics pipeline issues — missing data, metric mismatches, slow queries, failed dbt runs. Traces through data lineage to identify root cause and prescribes fixes.
allowed-tools: Read, Write, WebFetch
effort: high
---

## When to activate

When stakeholders report metric discrepancies, dashboards show stale data, dbt jobs fail, or query performance degrades. Use to quickly diagnose and fix production issues without lengthy investigation.

## When NOT to use

Not for preventive monitoring — use data quality tools for continuous checks. Not for architectural redesigns — use data-modeling skill if fundamental structure needs rework. Not without access to logs and query execution plans.

## Troubleshooting Checklist

1. **Define the symptom** — What is broken (missing data, wrong numbers, slow load, failed job)?
2. **Scope the impact** — Which tables, metrics, or dashboards affected; how long has it been broken?
3. **Check data freshness** — When was each upstream table last updated; any delays?
4. **Review lineage** — Trace data flow from source → staging → marts → dashboard
5. **Validate SQL** — Run source and transformation queries independently; compare results
6. **Inspect logs** — Check dbt Cloud, ETL tool, database query logs for errors
7. **Compare to baseline** — Verify expected row counts, volumes, and timing
8. **Test the fix** — Run corrected query; validate output matches expectation
9. **Document and deploy** — Update code; re-run pipeline; confirm resolution

## Root Cause Categories

**Data source issue** — Raw data late, incomplete, or malformed at ingestion.

**Transformation logic bug** — SQL or dbt logic incorrect (wrong join, bad filter, calculation error).

**Dependency failure** — Upstream table failed to load; cascading downstream failures.

**Refresh timing** — Job didn't run; ran late; partial data loaded; cache not cleared.

**Performance regression** — Query or data volume grew; missing index; execution plan changed.

**Schema mismatch** — Column renamed or dropped; new required column introduced; data type mismatch.

## Troubleshooting Runbook Template

```markdown
# Analytics Troubleshooting Runbook

**Issue:** [What is broken]  
**Reported:** [Date/time]  
**Severity:** [Critical / High / Medium / Low]  
**Status:** [Investigating / In Progress / Resolved]  

---

## Symptom

**What users see:** [Dashboard shows incorrect numbers / query times out / data missing]  
**When:** [Time range; frequency — sporadic or constant]  
**Impact:** [Which dashboards/metrics affected; how many users impacted]  

**Example:**
- Dashboard: Monthly Revenue Report
- Expected value (MTD May 2026): $2.4M
- Actual value: $1.8M (missing 25%)
- Last known good: May 31, 2026 at 6:00 AM
- Detected: June 1, 2026 at 9:00 AM

---

## Investigation Steps

### 1. Check Data Freshness

\`\`\`sql
SELECT 
  table_name,
  MAX(last_updated_ts) AS last_refresh,
  DATEDIFF(hour, MAX(last_updated_ts), CURRENT_TIMESTAMP()) AS hours_since_refresh
FROM metadata_tables
WHERE table_name IN ('fct_orders', 'fact_transactions', 'dim_customers')
GROUP BY table_name
ORDER BY hours_since_refresh DESC;
\`\`\`

**Result:**
| Table | Last Refresh | Hours Since |
|-------|--------------|-------------|
| fct_orders | 2026-06-01 06:00 AM | 27h ⚠ |
| fact_transactions | 2026-06-01 06:00 AM | 27h ⚠ |
| dim_customers | 2026-06-01 06:00 AM | 27h ⚠ |

**Finding:** All tables stale by 27 hours (expected: <24h). Likely cause: failed refresh job.

### 2. Check dbt Cloud Logs

**dbt Cloud run history:**
- Last run: June 1, 2026 at 5:58 AM — Status: ✓ Success (took 45 min)
- Current run (scheduled June 2, 6 AM): Still running (now 10 AM, +4h overdue)

**Job logs:** See query timeout on `mart_daily_metrics` model

\`\`\`
[10:15 AM] Running model 'marts/mart_daily_metrics'
[10:15 AM] SELECT ... FROM fct_orders LEFT JOIN dim_date
[10:42 AM] Query timeout (>1800s). Killed.
[10:42 AM] FAILURE
\`\`\`

**Finding:** dbt job hung on mart_daily_metrics; query timeout. Missing data in mart = no downstream refresh.

### 3. Analyze the Problematic Query

\`\`\`sql
-- marts/mart_daily_metrics
SELECT 
  DATE(order_date) AS order_date,
  COUNT(*) AS order_count,
  SUM(order_amount) AS daily_revenue
FROM fct_orders
INNER JOIN dim_date ON fct_orders.order_date_id = dim_date.date_id
GROUP BY DATE(order_date)
ORDER BY order_date DESC;
\`\`\`

**Issues identified:**
- No date filter (scans all history, not just recent)
- INNER JOIN on dim_date (overkill for aggregation; could use raw date column)
- ORDER BY descending (forces full sort; not needed for mart)

**Estimated rows:** 180M rows scanned (3+ years of orders)

### 4. Check Table Sizes

\`\`\`sql
SELECT 
  table_name,
  row_count,
  size_gb
FROM metadata_table_sizes
WHERE table_name IN ('fct_orders', 'dim_date')
ORDER BY size_gb DESC;
\`\`\`

**Result:**
| Table | Rows | Size |
|-------|------|------|
| fct_orders | 180M | 85 GB |
| dim_date | 3.6K | <1 GB |

**Finding:** fct_orders grew to 180M rows; query now scans 85GB = timeout.

### 5. Compare to Baseline

**Baseline (May 2026):**
- fct_orders: 160M rows
- mart_daily_metrics run time: 6 min
- Refresh SLA: <30 min

**Current (June 2026):**
- fct_orders: 180M rows (+12% growth)
- mart_daily_metrics run time: timeout >30 min
- Refresh SLA: breached

**Finding:** Data growth + unoptimized query = performance regression.

---

## Root Cause

**Primary:** mart_daily_metrics query not optimized for 180M rows in fct_orders  
**Secondary:** No monitoring alert when query exceeds SLA threshold  
**Tertiary:** dbt job killed after timeout; no fallback or retry mechanism  

---

## Fix

### Immediate (Fix the query)

\`\`\`sql
-- Optimized: filter to recent data only
SELECT 
  order_date,
  COUNT(*) AS order_count,
  SUM(order_amount) AS daily_revenue
FROM fct_orders
WHERE order_date >= CURRENT_DATE - INTERVAL 2 YEARS  -- Limit to 2-year lookback
GROUP BY order_date
ORDER BY order_date DESC;
\`\`\`

**Improvements:**
- Removed unnecessary JOIN to dim_date
- Added date filter to reduce scan from 85GB to ~3GB
- Removed ORDER BY (not needed for insertion; BI tools sort anyway)

**Expected run time:** 6 min (vs. timeout)

### Intermediate (Index optimization)

\`\`\`sql
-- Add clustered index on order_date for faster filtering
CREATE CLUSTERED INDEX idx_fct_orders_date 
ON fct_orders (order_date);
\`\`\`

### Long-term (Monitoring & alerting)

1. Add query timeout threshold alert to dbt Cloud (30 min)
2. Implement automated retry with exponential backoff
3. Partition fct_orders by order_date for faster pruning
4. Add query performance baseline test in dbt (assert run time <10 min)

---

## Validation

### Before/After Comparison

**Before:**
\`\`\`sql
SELECT COUNT(*) FROM fct_orders; -- 180M rows scanned
-- Run time: timeout (>30 min)
\`\`\`

**After:**
\`\`\`sql
SELECT COUNT(*) FROM fct_orders WHERE order_date >= CURRENT_DATE - INTERVAL 2 YEARS; -- 8M rows
-- Run time: 2 min
\`\`\`

**Result:** Query now completes; 98% scan reduction.

### Dashboard validation

**Dashboard:** Monthly Revenue Report  
**Before:** $1.8M (stale — 27h old)  
**After:** $2.4M (fresh — 6 min old)  
**Status:** ✓ RESOLVED

---

## Deployment

1. **Create PR** — Update marts/mart_daily_metrics.sql with fix
2. **Test locally** — Run dbt run -s mart_daily_metrics in dev
3. **Deploy to prod** — Merge PR; dbt Cloud job runs 6 AM UTC next day
4. **Monitor** — Watch dbt Cloud logs for successful run; check dashboard for correct values
5. **Document** — Add query performance baseline test; link to this runbook in model YAML

---

## Prevention

- Add dbt test for query run time: `assert run_time < 10 minutes`
- Set up Slack alerts for dbt job timeout
- Implement query performance tracking dashboard
- Quarterly review of query costs and performance (especially marts)
- Document expected row volumes and growth rates for each fact table

---

## Timeline

| Action | Time | Owner |
|--------|------|-------|
| Identified issue | 2026-06-02 9:00 AM | Data team |
| Root cause analysis | 2026-06-02 10:30 AM | Analytics team |
| Query optimization | 2026-06-02 11:00 AM | Analytics engineer |
| Testing | 2026-06-02 11:30 AM | QA |
| Deployment to prod | 2026-06-02 12:00 PM | DevOps |
| Verification | 2026-06-02 1:00 PM | Analytics team |
| **Status:** RESOLVED | 2026-06-02 1:15 PM | ✓ |

---


```

## Example

See Troubleshooting Runbook Template above.

---
