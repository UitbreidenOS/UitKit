# Failure Prediction Integration with Claudient

How to use the failure prediction system within Claude Code workflows and Claudient infrastructure.

## Workflow Integration

### Pre-Execution Risk Check Hook

Add to `.claude/hooks/pre-task-execute.py`:

```python
#!/usr/bin/env python3
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.parent / "ml"))
from failure_prediction import FailurePredictor

def check_task_risk(task_type: str, parameters: dict) -> bool:
    """Check if task is too risky to execute."""
    predictor = FailurePredictor()
    prediction = predictor.predict(task_type, parameters)
    
    if prediction.failure_probability >= 0.60:
        print(f"ALERT: High-risk task detected")
        print(f"Failure probability: {prediction.failure_probability:.0%}")
        print(f"Risk factors: {', '.join(prediction.primary_risk_factors)}")
        print(f"\nRecommendation: {prediction.recommendation}")
        print(f"\nSuggested alternatives:")
        for alt in prediction.suggested_alternatives:
            print(f"  - {alt}")
        return False  # Block execution
    
    return True  # Allow execution
```

Configure in `settings.json`:

```json
{
  "hooks": {
    "preTaskExecute": {
      "script": ".claude/hooks/pre-task-execute.py",
      "on": ["*"],
      "block": true
    }
  }
}
```

## Skill Integration

Create `/skills/ml/task-risk-assessment.md`:

```markdown
# Task Risk Assessment

## When to activate
User asks about task failure risk, or runs high-risk operations (deploys, migrations, large-scale operations)

## When NOT to use
One-off scripts, simple utility commands with no failure history

## Instructions

1. Parse task type and parameters from user input
2. Call FailurePredictor.predict()
3. Return risk level and recommendations
4. If >60%, ask for manual confirmation before proceeding

## Example
User: "Deploy payment service to production with 2-hour timeout, no retries"
System: Predicts 75% failure probability
Recommendation: "Enable retry mechanism, reduce timeout to 30 minutes, increase memory"
```

## CLI Skill Integration

Alias in Claude Code:

```bash
/risk-check <task_type> --params <json_params>
```

Maps to:

```bash
python ~/Desktop/Claudient/ml/failure-prediction.py <task_type> --params <json_params>
```

## Analysis Pipeline

Generate nightly failure analysis:

```bash
#!/bin/bash
# scripts/nightly-risk-analysis.sh

echo "Generating failure prediction analysis..."

python ml/failure-prediction.py analysis \
  --export daily-risk-report.json

# Post results
echo "Risk Report: $(date)" >> ./.claude/logs/predictions.log
cat daily-risk-report.json >> ./.claude/logs/predictions.log
```

## Monitoring Integration

Log predictions to observability:

```python
import json
from datetime import datetime

def log_prediction(task_type, prediction):
    """Log prediction to monitoring system."""
    event = {
        "timestamp": datetime.now().isoformat(),
        "event_type": "task_risk_prediction",
        "task_type": task_type,
        "failure_probability": prediction.failure_probability,
        "risk_level": prediction.risk_level,
        "risk_factors": prediction.primary_risk_factors,
        "confidence": prediction.confidence_score
    }
    
    # Post to monitoring service
    monitoring.log_event(event)
```

## Emergency Override

For critical production tasks, allow override with manual approval:

```python
def execute_critical_task(task_type, parameters, approver_id=None):
    """Execute high-risk task with approval."""
    prediction = FailurePredictor().predict(task_type, parameters)
    
    if prediction.failure_probability >= 0.80:
        if not approver_id:
            raise PermissionError(f"Critical-risk task requires approval: {prediction.recommendation}")
        
        # Log override
        log_override({
            "task": task_type,
            "failure_probability": prediction.failure_probability,
            "approved_by": approver_id,
            "timestamp": datetime.now().isoformat()
        })
    
    return execute_task(task_type, parameters)
```

## Testing with Failure Prediction

Include risk assessment in test workflows:

```bash
# Run tests with failure prediction
python ml/failure-prediction.py integration_tests \
  --params '{"parallelism":8,"timeout_seconds":3600}' \
  && ./scripts/run-integration-tests.sh
```

Exit on high risk:

```bash
set -e
python ml/failure-prediction.py deploy_feature \
  --params '{"canary":false,"rollback":false}' \
  || exit 1
```

## Best Practices

1. **Log executions**: Always log task results to build history
2. **Regular exports**: Generate weekly risk reports
3. **Monitor predictions**: Compare predicted vs actual failures
4. **Iterate factors**: Adjust risk weights based on outcomes
5. **Redact secrets**: Never log sensitive parameters
6. **Version tracking**: Track prediction model changes

## Troubleshooting

### High confidence but wrong predictions
- Issue: Insufficient historical data
- Solution: Collect more execution history (30+ samples per task type)

### All tasks showing high risk
- Issue: Risk weights too aggressive
- Solution: Recalibrate factor_weights in `_calculate_adjusted_probability()`

### Predictions not improving over time
- Issue: Risk factors not correlated with actual failures
- Solution: Add domain-specific factors, review historical error categories

See FAILURE_PREDICTION.md for detailed guidance.
