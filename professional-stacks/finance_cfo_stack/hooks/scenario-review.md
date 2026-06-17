# Hook: scenario-review

## Trigger
PreOutput — Before any scenario table or forecast is presented to user.

## What it does
Validates scenario logic before output; ensures base/upside/downside ranges are plausible and internally consistent.

## Implementation
```json
{
  "hooks": {
    "preOutput": {
      "when": "scenario-modeling",
      "then": "scenario-review"
    }
  }
}
```

## Checks
- Base case: Is it the most likely outcome based on historical data?
- Upside: Is the positive driver realistic? (e.g., +20% revenue growth — justified by what?)
- Downside: Is the downside plausible? (e.g., -20% revenue due to customer churn or market shift — specified?)
- Range: Are scenarios within 1–2 standard deviations of mean?
- Consistency: Do all three scenarios share the same cost structure and balance sheet?

## Output
Approve scenarios (all plausible) or Request revision (explain issues found). Do not output until scenarios pass review.

## Example
Check: Upside assumes 40% revenue growth (vs. historical 25% avg). Is this justified by product roadmap, sales pipeline, or market expansion? Flag if not explained.
