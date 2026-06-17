---
name: data-quality-auditor
description: Audits data quality at source and transformation layers. Identifies missing values, duplicates, outliers, referential integrity issues, and freshness gaps. Returns data quality scorecards and remediation steps.
allowed-tools: Read, Write, WebFetch
effort: high
---

## When to activate

When building or validating data pipelines, troubleshooting metric discrepancies, or establishing data quality baseline for a new data source. Run before promoting data to production or when quality regressions are suspected.

## When NOT to use

Not for ad-hoc data exploration — use for formal quality assessments. Not without access to raw data and transformation code. Not as a substitute for continuous monitoring (set up data quality tools for ongoing checks).

## Data Quality Audit Checklist

1. **Completeness** — How many NULLs per column; expected vs. actual row counts
2. **Uniqueness** — Duplicate rows; duplicate primary keys; cardinality drift
3. **Validity** — Data types match schema; values within expected ranges; formatting consistent
4. **Consistency** — Cross-table referential integrity; matching aggregations; conformed dimensions
5. **Accuracy** — Sample comparison to source systems; business logic correctness
6. **Timeliness** — Data freshness; latency from source to warehouse; SLA compliance
7. **Conformity** — Data matches business rules and definitions
8. **Anomalies** — Statistical outliers; sudden spikes or drops; unexpected patterns

## Quality Dimensions

**Completeness** — Are all expected rows present? How many NULLs in key columns?

**Uniqueness** — Are primary keys truly unique? Any duplicate rows?

**Validity** — Are values in valid ranges? Do data types match schema?

**Consistency** — Do foreign key relationships hold? Do aggregations match source?

**Accuracy** — Do spot-check samples match source systems? Do calculations match business definitions?

**Timeliness** — When was data last refreshed? Is it meeting SLA?

**Conformity** — Do column names follow naming conventions? Do values match allowed values?

## Data Quality Scorecard Template

```markdown
# Data Quality Scorecard

**Table:** [Table name]  
**Source System:** [Source]  
**Warehouse:** [DW name]  
**Assessment Date:** [date]  
**Owner:** [Name]  

---

## Quality Score

**Overall Quality Score: [X]/100**

| Dimension | Score | Status | Trend |
|-----------|-------|--------|-------|
| Completeness | 95 | ✓ Acceptable | ↑ Improving |
| Uniqueness | 100 | ✓ Acceptable | → Stable |
| Validity | 92 | ⚠ Warning | ↓ Declining |
| Consistency | 87 | ⚠ Warning | ↓ Declining |
| Accuracy | 98 | ✓ Acceptable | → Stable |
| Timeliness | 100 | ✓ Acceptable | → Stable |
| Conformity | 94 | ✓ Acceptable | → Stable |

**Overall Status:** ⚠ PASS WITH WARNINGS

---

## Completeness Assessment

| Column | Nulls | % Null | Expected | Status |
|--------|-------|--------|----------|--------|
| customer_id | 0 | 0% | 0% | ✓ Pass |
| email | 150 | 0.3% | <1% | ✓ Pass |
| phone | 5,000 | 10% | <5% | ⚠ Warning |
| address | 3,200 | 6.4% | <5% | ⚠ Warning |
| created_date | 0 | 0% | 0% | ✓ Pass |

**Issues:** Phone and address have elevated NULL rates (likely optional fields; verify business requirements)

---

## Uniqueness Assessment

| Column(s) | Duplicates | % Duplicate | Expected | Status |
|-----------|------------|-------------|----------|--------|
| customer_id (PK) | 0 | 0% | 0% | ✓ Pass |
| email | 42 | 0.08% | 0% | ⚠ Warning |
| phone + email | 120 | 0.24% | <0.1% | ⚠ Warning |

**Issues:** 42 duplicate emails detected (e.g., john@example.com appears 2x). 120 rows with duplicate phone+email pairs.

**Root Cause:** Email validation was disabled in source system for 2 weeks (June 1-14); allows duplicate signups.

**Remediation:** Contact source system team; implement email uniqueness constraint; deduplicate in staging layer.

---

## Validity Assessment

| Column | Data Type | Sample Values | Invalid | % Invalid | Status |
|--------|-----------|---------------|---------|-----------|--------|
| customer_id | INT | [1, 2, 3] | 0 | 0% | ✓ Pass |
| email | VARCHAR | [user@example.com, ...] | 156 | 0.31% | ⚠ Warning |
| phone | VARCHAR | [555-1234, +1.555.1234, ...] | 8,200 | 16.4% | ✗ Fail |
| age | INT | [25, 32, 41, ...] | 450 | 0.9% | ⚠ Warning |

**Issues:**
- Email: 156 invalid formats (missing @, spaces, etc.)
- Phone: 16.4% invalid formats (inconsistent formatting: some +1.555.1234, others 555-1234, some blank)
- Age: 450 values outside valid range (0-120)

**Root Cause:** Phone imported from multiple source systems with different formats; no normalization applied.

**Remediation:** Standardize phone format in staging layer; implement regex validation; audit age values >100.

---

## Consistency Assessment

### Referential Integrity

| Foreign Key | Records | Orphaned | % Orphaned | Status |
|-------------|---------|----------|-----------|--------|
| customer_id → dim_customers | 50M | 45K | 0.09% | ⚠ Warning |
| order_id → fct_orders | 50M | 0 | 0% | ✓ Pass |
| product_id → dim_products | 50M | 2,100 | 0.004% | ✓ Pass |

**Issues:** 45K orphaned customer_ids in fact table (customer deleted or not yet loaded in dim).

**Root Cause:** Data arrives out of order; customers arrive 12h after their orders sometimes.

**Remediation:** Add late-arriving dimension handling in dbt; keep inactive customers in dimension.

### Aggregation Consistency

```sql
-- Verify: SUM(transaction_amount) in warehouse = SUM(amount) in source
SELECT 
  SUM(transaction_amount) AS warehouse_total,
  SUM(amount) AS source_total,
  ABS(SUM(transaction_amount) - SUM(amount)) AS delta
FROM fact_transactions
LEFT JOIN source_raw_transactions
  USING (transaction_id)
WHERE DATE(transaction_date) = CURRENT_DATE - INTERVAL 1 DAY;
```

Result: Warehouse = $2.4M, Source = $2.4M, Delta = $0 ✓ Pass

---

## Accuracy Assessment

### Sample Validation

**Sample Size:** 100 random transactions (1% of daily volume)  
**Comparison:** Warehouse vs. source system  

| Field | Matches | Mismatches | % Match | Status |
|-------|---------|-----------|---------|--------|
| order_id | 100 | 0 | 100% | ✓ Pass |
| customer_id | 98 | 2 | 98% | ⚠ Warning |
| amount | 100 | 0 | 100% | ✓ Pass |
| currency | 100 | 0 | 100% | ✓ Pass |

**Issues:** 2 customer_id mismatches (customers merged in source system; old IDs not remapped).

---

## Timeliness Assessment

| Table | Last Refresh | Expected Refresh | Latency | SLA | Status |
|-------|--------------|------------------|---------|-----|--------|
| raw_transactions | 6:15 AM (today) | 6:00 AM | 15 min | 1h | ✓ Pass |
| stg_customers | 6:20 AM (today) | 6:00 AM | 20 min | 30 min | ⚠ Warning |
| fct_orders | 6:45 AM (today) | 6:00 AM | 45 min | 1h | ✓ Pass |

**Issues:** stg_customers taking 20 min (SLA is 30 min); trending upward.

**Root Cause:** dbt run-time increasing as table grows; query optimization needed.

**Remediation:** Profile dbt models; optimize stg_customers query; consider incremental load.

---

## Conformity Assessment

| Rule | Compliant | Non-Compliant | % Compliant | Status |
|------|-----------|---------------|-------------|--------|
| Column naming: snake_case | Yes | 0 | 100% | ✓ Pass |
| Allowed statuses | 49.9M | 100K | 99.8% | ⚠ Warning |
| Date format: YYYY-MM-DD | Yes | 0 | 100% | ✓ Pass |

**Issues:** 100K rows with invalid status values (e.g., "pending_review" instead of "pending", "approved").

---

## Anomaly Detection

### Statistical Analysis

**Field:** transaction_amount

| Statistic | Value | Expected | Status |
|-----------|-------|----------|--------|
| Mean | $1,240 | $1,200 | → |
| Median | $950 | $1,000 | → |
| Std Dev | $2,450 | $2,400 | → |
| Min | $0.01 | $1 | ⚠ Below threshold |
| Max | $125K | $50K | ⚠ Above threshold |

**Issues:** 156 transactions over $50K max (potential fraud or data entry errors).

**Remediation:** Investigate top 10 outliers; flag for manual review; consider dynamic threshold based on customer segment.

---

## Remediation Plan

| Issue | Priority | Owner | ETA | Status |
|-------|----------|-------|-----|--------|
| Duplicate emails | High | Data team | June 15 | In Progress |
| Phone format standardization | High | Data team | June 18 | Pending |
| Orphaned customer_ids | Medium | Analytics | June 20 | Pending |
| stg_customers performance | Medium | Analytics | June 22 | Pending |
| Transaction outlier investigation | Low | Finance | June 25 | Not started |

---

## Approval & Sign-Off

**Prepared by:** [Your name, title]  
**Reviewed by:** [Data owner, title]  
**Approved:** [ ] Ready for production  [ ] Needs remediation  

---


```

## Example

See Data Quality Scorecard Template above.

---
