# Hook: pre-commit-validation

Runs before committing pipeline code.

## settings.json

```json
{
  "hooks": {
    "pre-commit-validation": {
      "script": "hooks/pre-commit-validation.sh",
      "when": "before_commit"
    }
  }
}
```

## Behavior

Validates DAG syntax, checks SQL for common errors, ensures lineage is documented.

## Implementation

(Script stub — syntax checks and linting)
