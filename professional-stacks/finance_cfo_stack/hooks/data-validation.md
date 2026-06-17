# Hook: data-validation

## Trigger
PreToolUse — Before any financial data is parsed or analyzed.

## What it does
Validates data quality: completeness, consistency, outliers, formula integrity. Flags issues and pauses proceeding until human review.

## Implementation
```json
{
  "hooks": {
    "preToolUse": {
      "when": "financial-analysis",
      "then": "data-validation"
    }
  }
}
```

## Checks
- Completeness: Are all expected periods/categories present?
- Consistency: Do calculations balance (e.g., revenue = fees + other)?
- Outliers: Are any values >3 standard deviations from mean?
- Formula integrity: Do formulas reference correct cells/ranges?

## Output
Green light (data OK) or Red flag: List issues found and request human confirmation before proceeding.

## Example
If AR data has 3 months missing, flag: "AR data incomplete for Mar–May. Proceed? (Y/N)"
