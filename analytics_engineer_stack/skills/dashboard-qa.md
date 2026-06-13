---
name: dashboard-qa
description: Audits BI dashboards for accuracy, consistency, and UX. Validates metric calculations, color consistency, drill-down logic, and data freshness. Returns QA report with issues and fixes.
allowed-tools: Read, Write, WebFetch
effort: medium
---

## When to activate

Before publishing a dashboard to stakeholders, after deploying new metrics, or when troubleshooting discrepancies between dashboard and source data. Use to catch calculation errors, missing filters, and user experience issues before handoff.

## When NOT to use

Not for initial dashboard design — use after the dashboard is built. Not for data quality audits on underlying tables — use sql-optimizer or data validation tools. Not without access to both the dashboard and underlying queries.

## Dashboard QA Checklist

1. **Metric accuracy** — Verify each dashboard metric against source query; compare with expected values
2. **Granularity match** — Check that filters (date, segment, geography) match the intended audience
3. **Freshness** — Confirm data refresh schedule; flag stale data (>24h old)
4. **Color consistency** — Ensure colors match brand guidelines; verify meaning (red=bad, green=good)
5. **Drill-down logic** — Test that clicking drills down to next granularity without data jumps
6. **Null handling** — Check that NULLs are displayed clearly (not confused with zeros)
7. **Mobile responsiveness** — Verify dashboard works on mobile if intended
8. **Documentation** — Ensure filters, metrics, and drill-targets are labeled clearly
9. **Access control** — Confirm only intended users can view sensitive data
10. **Performance** — Check load time; flag slow queries that need optimization

## QA Report Template

```markdown
# Dashboard QA Report

**Dashboard Name:** [Name]  
**URL / Tool:** [Looker / Tableau / Superset / etc.]  
**Owner:** [Name]  
**QA Date:** [date]  
**Status:** [PASS / PASS WITH WARNINGS / FAIL]  

---

## Executive Summary

[1-2 sentences: overall assessment, critical issues if any]

---

## Metric Accuracy Audit

| Metric | Dashboard Value | Source Query Value | Match | Issue |
|--------|-----------------|-------------------|-------|-------|
| Total Revenue (MTD) | $2.4M | $2.4M | ✓ | None |
| New Customers | 1,200 | 1,245 | ✗ | Filter mismatch (trial users) |
| Churn Rate | 3.2% | 3.2% | ✓ | None |

**Issues Found:** [X] — see Issues section below

---

## Data Freshness

| Data Source | Last Refresh | Expected Refresh | Status |
|-------------|--------------|------------------|--------|
| fact_orders | 6 AM UTC (today) | Daily 6 AM | ✓ On time |
| dim_customers | 6 AM UTC (today) | Daily 6 AM | ✓ On time |
| fact_subscriptions | 9 PM UTC (yesterday) | Daily 9 PM | ✗ Overdue by 6h |

---

## UX & Design Audit

| Item | Expected | Actual | Status | Fix |
|------|----------|--------|--------|-----|
| Color scheme (SOP) | Blue/teal | Orange/red | ✗ | Update colors in tool |
| Filter labels | Clear + placeholder | Cryptic codes | ✗ | Rename filters |
| Drill-down path | Chart → Detail table | No drill available | ✗ | Enable drill-through |
| Mobile responsive | Works on mobile | Cut off on mobile | ✗ | Adjust layout |

---

## Issues Found

### Critical

1. **New Customers metric mismatch** (Severity: High)
   - **Issue:** Dashboard shows 1,200; source query shows 1,245
   - **Root Cause:** Dashboard filter excludes trial users; source includes them
   - **Impact:** Discrepancy reported to leadership; credibility damage
   - **Fix:** Add "exclude trials" filter to dashboard; document in notes
   - **ETA:** 1 day

### High

2. **Subscription data 6 hours stale** (Severity: High)
   - **Issue:** fact_subscriptions last refreshed at 9 PM yesterday; now 3 AM next day
   - **Root Cause:** dbt job failed silently; no alert triggered
   - **Impact:** Subscription metrics are 9 hours out of date
   - **Fix:** Investigate dbt Cloud job; re-run manually; add Slack alert
   - **ETA:** 2 hours

### Medium

3. **Color scheme inconsistency** (Severity: Medium)
   - **Issue:** Dashboard uses orange/red; brand guideline is blue/teal
   - **Root Cause:** Original designer used default palette; no brand review
   - **Impact:** Dashboard doesn't match other company dashboards
   - **Fix:** Update color scheme in [Tool]; document in brand style guide
   - **ETA:** 1 day

### Low

4. **Mobile layout cuts off charts** (Severity: Low)
   - **Issue:** Dashboard not responsive; unusable on phones
   - **Root Cause:** Hard-coded widths; no responsive design applied
   - **Impact:** Mobile users see partial charts
   - **Fix:** Enable responsive layout in [Tool] settings
   - **ETA:** 0.5 days

---

## Test Cases

### Metric: Total Revenue (MTD)

**Test 1: Date range filter**
- Filter: May 2026
- Expected: $2.4M
- Actual: $2.4M
- Status: ✓ PASS

**Test 2: Segment filter**
- Filter: Premium customers only
- Expected: $1.8M (75% of total)
- Actual: $1.8M
- Status: ✓ PASS

**Test 3: Drill-down to daily view**
- Click on Total Revenue bar
- Expected: Breaks down to daily granularity
- Actual: No drill-through available
- Status: ✗ FAIL

---

## Color & UX Checklist

- [ ] Primary metric color: bright, distinct from background
- [ ] Negative values: red or clear indicator
- [ ] Positive values: green or neutral
- [ ] Neutral/context: gray
- [ ] Legend: clear, labels match data
- [ ] Font sizes: readable at dashboard zoom level
- [ ] Borders: minimal, not cluttered
- [ ] Whitespace: adequate, not cramped

**Status:** [ X ] 4 items need fixes

---

## Documentation

**Metric definitions:** [Link to metrics registry]  
**Source tables:** [Link to data model]  
**Refresh schedule:** [Daily 6 AM UTC]  
**Owner:** [Name, email]  
**Stakeholders:** [Teams viewing this dashboard]

---

## Sign-Off

**Prepared by:** [Your name]  
**Approved by:** [Dashboard owner or manager]  
**Date:** [date]  

**Approval:** [ ] Ready for production  [ ] Needs fixes before production

---


```

## Example

See QA Report Template above — adapt with actual dashboard names and metrics.

---
