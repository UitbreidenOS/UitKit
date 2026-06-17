# Hook: governance-logging

## Trigger
Stop (session end) — Auto-log all financial analyses to session-log.md at end of session.

## What it does
Creates audit trail of all financial work: analyses run, models built, reports generated. Logs date, preparer, data sources, review status, key findings.

## Implementation
```json
{
  "hooks": {
    "stop": {
      "when": "finance-session",
      "then": "governance-logging"
    }
  }
}
```

## Logs
For each analysis/model:
- Date & time
- Type (budget variance, cash forecast, etc.)
- Period analyzed
- Preparer (Claude)
- Status (draft/reviewed/finalized)
- Key finding (1-2 sentences)
- Assumptions (critical drivers)
- Data sources used
- Next steps or review required

## Output
Appends structured entry to `session-log.md` for searchable audit trail and historical reference.

## Example
```
## 2026-06-13 14:30
**Analysis:** Cash Flow Forecast
**Period:** Jul 2026 – Jun 2027
**Status:** DRAFT
**Key Finding:** Base case shows 18-month runway; downside scenario drops to 12 months if revenue falls 20%.
**Assumptions:** Revenue $100K/mo base, 5% growth, OpEx constant.
**Data Sources:** May 2026 GL, revenue forecast (Jun 13)
**Next Steps:** CFO review of downside risk mitigation.
```
