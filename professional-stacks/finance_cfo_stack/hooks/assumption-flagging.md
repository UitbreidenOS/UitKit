# Hook: assumption-flagging

## Trigger
PostToolUse — After any financial model or forecast is built.

## What it does
Surfaces all key assumptions in models and reports; highlights sensitivity to changes in critical drivers.

## Implementation
```json
{
  "hooks": {
    "postToolUse": {
      "when": "financial-modeling",
      "then": "assumption-flagging"
    }
  }
}
```

## Checks
- Extract all assumptions: revenue growth %, cost ratios, headcount growth, FX, pricing changes.
- Identify top 3–5 drivers with highest impact on outcome.
- Show sensitivity: impact of ±10% change in each driver.
- Flag low-confidence assumptions (e.g., "assumes 2 major customers renew — unconfirmed").

## Output
Assumption summary table with impact ranking and sensitivity analysis. Highlight any assumptions outside historical norms.

## Example
Assumption: Revenue grows 30% YoY (historical avg: 25%; range: 15–35%).
Impact: Top 3 drivers = 85% of outcome (revenue, COGS %, payroll growth).
Sensitivity: +/- 10% revenue = $500K P&L impact; +/- 5% COGS = $300K impact.
