# DD Gate Hook

Enforces minimum due diligence depth before investment recommendation.

## When It Fires

Before any investment recommendation is issued (PreToolUse).

## What It Checks

1. Market analysis completed: TAM size, growth rate (CAGR), competitive landscape documented
2. Financial metrics documented: ARR/MRR, burn rate, runway, unit economics (CAC, LTV, payback, gross margin)
3. Team assessment completed: Founder background, key hires, skill gaps identified
4. Risk analysis documented: At least 3 risk factors assessed (execution, market, financial, operational)

## What It Enforces

- **BLOCKS** investment recommendations if market OR financial analysis missing
- **ALLOWS** recommendations if all four pillars complete
- **ESCALATES** to partner if recommendation conflicts with prior scoring (e.g., PASS score but GO recommendation)

## Settings Entry

```json
{
  "hooks": {
    "dd-gate": {
      "event": "PreToolUse",
      "script": ".claude/hooks/dd-gate.sh",
      "description": "Minimum DD depth gate — market + financial + team + risk analysis required"
    }
  }
}
```

## Script Template

```bash
#!/bin/bash

# dd-gate.sh — Enforce minimum DD depth before investment recommendation

dd_complete=$(grep -c "FINANCIAL ANALYSIS\|MARKET OPPORTUNITY\|RISK ANALYSIS" <<< "$CLAUDE_OUTPUT")

if [[ $dd_complete -lt 3 ]]; then
  echo "ERROR: Minimum DD depth not met."
  echo "Required: Market analysis, Financial analysis, Risk assessment"
  echo "Complete all three sections before issuing recommendation."
  exit 1
fi

exit 0
```
