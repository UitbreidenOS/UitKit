# Bias Check Hook

## Description
Automatically runs bias detection checks on ML model code before commits, verifying for fairness issues, discriminatory patterns, and dataset bias concerns.

## When it fires
Before git commit (pre-commit hook)

## Setup

Add to `.claude/settings.json`:

```json
{
  "hooks": {
    "pre-commit": {
      "bias-check": {
        "enabled": true,
        "script": "mlai_engineer_stack/hooks/bias-check.sh"
      }
    }
  }
}
```

## Script
```bash
#!/bin/bash
# mlai_engineer_stack/hooks/bias-check.sh

# TODO: Implement bias detection logic
# - Scan staged files for model training code
# - Check for fairness constraints
# - Validate dataset composition documentation
# - Flag potential discriminatory feature engineering

echo "Bias check: stub"
```

## Configuration
- Configurable bias detection sensitivity levels
- Target files: `*.py` files in model/ and training/ directories
- Exception list for known-safe code patterns
