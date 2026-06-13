---
description: Comprehensive QA audit of a BI dashboard. Validates metric accuracy, color consistency, drill-down logic, data freshness, and mobile responsiveness. Returns QA report with issues and fixes.
---

# /audit-dashboard

## What This Does

Runs the dashboard-qa skill to thoroughly audit a BI dashboard before stakeholder handoff. Validates every metric against source queries, checks data freshness, confirms UX best practices, and flags discrepancies or performance issues.

## Steps Claude Follows

1. Ask for: Dashboard name/URL, BI tool (Looker/Tableau/Superset), list of metrics shown, and access to source queries
2. Run dashboard-qa skill — metric accuracy audit, freshness check, UX review, mobile responsiveness test
3. Validate each metric against source query; flag calculation mismatches
4. Check color scheme against brand guidelines
5. Test drill-down and filter logic; confirm no data jumps
6. Verify data refresh schedule; flag stale data (>24h old)
7. Return QA report with pass/fail status and detailed remediation steps

## Next Action Logic

- **PASS:** "Dashboard is production-ready. No issues found."
- **PASS WITH WARNINGS:** "2-3 minor issues; fix before publishing (ETA <1 day)"
- **FAIL:** "Critical issues found; do not publish until resolved (ETA 1-3 days)"

## Output Format

### QA Audit Report

```
# Dashboard QA Report

## Executive Summary
[1-2 sentences on overall status]

## Metrics Accuracy Audit
[Table comparing dashboard value vs. source query value]

## Data Freshness
[When each data source was last refreshed; any delays]

## UX & Design Audit
[Color scheme, filter labels, drill-down logic, mobile responsiveness]

## Issues Found
### Critical
- Issue 1 (high impact, must fix)
- Issue 2 (high impact, must fix)

### High
- Issue 3 (affects metrics or user experience)

### Medium
- Issue 4 (cosmetic or documentation issue)

## Remediation Plan
[Prioritized list of fixes with ETA and owner]

## Sign-Off
[ ] Ready for production  [ ] Needs fixes  [ ] Hold for stakeholder input
```

## Examples

### Example 1: Monthly Revenue Dashboard

**Dashboard:** Executive Monthly Revenue Report  
**Tool:** Looker  
**Status:** PASS WITH WARNINGS

**Issues Found:**
1. **High:** Total Revenue metric mismatch ($2.4M vs. $1.8M, 25% discrepancy)
   - Root cause: Dashboard filter excludes trial users; source includes them
   - Fix: Update filter in dashboard; add note to metric definition
   - ETA: 2 hours

2. **Medium:** Subscription data stale (27h old, should be <24h)
   - Root cause: dbt job failed silently; no alert triggered
   - Fix: Investigate dbt Cloud job; re-run; add Slack alert for failures
   - ETA: 1 hour

3. **Low:** Color scheme doesn't match brand guidelines
   - Root cause: Original designer used default palette
   - Fix: Update colors to blue/teal per brand standards
   - ETA: 2 hours

**Recommendation:** Publish with warning labels on stale data; deploy fixes within 24 hours

### Example 2: Sales Pipeline Dashboard

**Dashboard:** Deal Pipeline & Forecast  
**Tool:** Tableau  
**Status:** FAIL

**Critical Issues:**
1. **Deal stage distribution mismatch:** Dashboard shows 50 deals in "Proposal" stage; source query shows 38
   - Root cause: Custom stage mapping in Tableau different from source definition
   - Fix: Align Tableau mapping to source system; validate with Sales team
   - ETA: 2 days (requires Sales team input)

2. **Drill-down broken:** Clicking on pipeline stage does nothing (no drill configured)
   - Root cause: Drill-through not enabled in Tableau
   - Fix: Configure drill-through to deal details
   - ETA: 4 hours

3. **Mobile breaks:** Dashboard cuts off on phone screens
   - Root cause: Hard-coded widths; not responsive
   - Fix: Enable responsive design in Tableau
   - ETA: 2 hours

**Recommendation:** Do NOT publish until issues 1 and 2 are resolved

---
