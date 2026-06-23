# Failure Prediction System

Predictive failure analysis module for Claude Code task execution. Analyzes task parameters and historical execution data to predict failure probability before execution. Alerts when failure risk exceeds 60% and suggests actionable alternatives.

## Overview

The failure prediction system uses:
- **Historical execution data** from task history database
- **Parameter analysis** to identify risk factors
- **Statistical models** to compute failure probability
- **Machine learning** concepts for pattern recognition

## Quick Start

### Python API

```python
from ml.failure_prediction import FailurePredictor

predictor = FailurePredictor()

# Predict failure for a task
prediction = predictor.predict(
    task_type="deploy_service",
    parameters={
        "service": "api",
        "timeout_seconds": 3600,
        "max_retries": 0
    }
)

# Check result
if prediction.failure_probability >= 0.60:
    print(f"ALERT: {prediction.recommendation}")
    for alt in prediction.suggested_alternatives:
        print(f"  - {alt}")
```

### CLI

```bash
# Predict failure
python ml/failure-prediction.py deploy_service \
  --params '{"timeout_seconds":3600,"max_retries":0}'

# Log an execution
python ml/failure-prediction.py deploy_service \
  --log "deploy-001" \
  --params '{"service":"api"}' \
  --status failure \
  --error timeout \
  --duration 3600

# Export analysis report
python ml/failure-prediction.py dummy_type --export analysis.json
```

## Core Concepts

### Risk Factors

The predictor identifies seven categories of risk factors:

1. **Complexity** - More parameters (>10) = higher risk
2. **Timeouts** - Long timeout windows (>1 hour) prone to issues
3. **Retry Policy** - Missing retry configuration significantly increases risk
4. **Resource Constraints** - Low memory allocation (<512MB) = stress failures
5. **Dependency Chains** - High dependency counts (>5) increase failure surface
6. **Recurring Errors** - Historical error patterns weighted heavily
7. **Retry History** - High average retry counts indicate instability

### Prediction Algorithm

```
base_failure_rate = success_failures / total_history (default: 20%)

foreach risk_factor in identified_factors:
    base_failure_rate += factor_weight[risk_factor]

failure_probability = min(base_failure_rate, 0.99)

risk_level = "low" if prob < 0.30 else
             "medium" if prob < 0.60 else
             "high"
```

### Confidence Score

Combines two signals:

- **Historical Coverage** (0-100): Based on execution history size
- **Factor Corroboration** (0-100): Number of corroborating risk factors

```
confidence = (history_coverage + factor_corroboration) / 2
```

## Risk Levels & Actions

| Level | Probability | Action | Monitoring |
|-------|-------------|--------|-----------|
| Low | <30% | Execute normally | Standard |
| Medium | 30-60% | Review factors, apply mitigations | Standard |
| High | 60%+ | **ALERT** - Manual review required | Enhanced |

## Failure Probability Output

```json
{
  "failure_probability": 0.72,
  "risk_level": "high",
  "primary_risk_factors": [
    "no_retry_configured",
    "long_timeout_risk",
    "high_dependency_chain"
  ],
  "success_rate": 0.40,
  "confidence_score": 0.62,
  "similar_failures": 3,
  "suggested_alternatives": [
    "Enable retry mechanism with exponential backoff",
    "Implement intermediate checkpoints",
    "Parallelize independent subtasks"
  ],
  "recommendation": "HIGH RISK (72% failure predicted). Execute with caution and manual monitoring."
}
```

## Suggested Alternatives

When high-risk factors are identified, the system suggests mitigations:

- **No Retry**: "Enable retry mechanism with exponential backoff"
- **Low Memory**: "Increase memory allocation to 1024MB minimum"
- **High Dependency**: "Parallelize independent subtasks"
- **High Complexity**: "Break down into smaller, focused tasks"
- **Long Timeout**: "Implement intermediate checkpoints"
- **Recurring Errors**: "Address recurring '[error_type]' errors"

## Database Schema

SQLite database at `~/.claude/task_history.db`:

```sql
CREATE TABLE task_executions (
  id INTEGER PRIMARY KEY,
  task_id TEXT,
  task_type TEXT,
  parameters TEXT,           -- JSON
  status TEXT,               -- success, failure, timeout, cancelled
  duration_seconds REAL,
  error_category TEXT,       -- error classification
  retry_count INTEGER,
  timestamp DATETIME
);

-- Indexes
CREATE INDEX idx_task_type_status ON task_executions(task_type, status);
CREATE INDEX idx_timestamp ON task_executions(timestamp);
```

## Integration Examples

### Workflow Pre-Execution Hook

```python
def execute_task(task_type, parameters):
    predictor = FailurePredictor()
    prediction = predictor.predict(task_type, parameters)
    
    if prediction.failure_probability >= 0.60:
        alert(f"HIGH RISK: {prediction.recommendation}")
        # Optional: require manual approval
        if not manual_approval():
            return {"status": "blocked", "reason": "high_risk"}
    
    # Apply mitigations if medium risk
    if prediction.risk_level == "medium":
        for suggestion in prediction.suggested_alternatives:
            apply_mitigation(suggestion)
    
    return run_task(task_type, parameters)
```

### CI/CD Pipeline Integration

```yaml
- name: Check task failure risk
  run: |
    python ml/failure-prediction.py ${{ job.name }} \
      --params '${{ toJson(job.parameters) }}' \
      --export risk-report.json
    
    if grep -q '"risk_level": "high"' risk-report.json; then
      echo "::error::High-risk task detected"
      exit 1
    fi
```

### Task Scheduler

```python
# Adjust execution strategy based on risk
def schedule_task(task_type, parameters):
    prediction = FailurePredictor().predict(task_type, parameters)
    
    strategy = {
        "low": {"retries": 1, "timeout": 300, "parallel": True},
        "medium": {"retries": 2, "timeout": 600, "parallel": False},
        "high": {"retries": 3, "timeout": 1200, "parallel": False}
    }[prediction.risk_level]
    
    return task_queue.enqueue(
        task_type, parameters,
        **strategy
    )
```

## Extending the Predictor

### Add Custom Risk Factor

Edit `_analyze_risk_factors()`:

```python
# Add domain-specific factor
if parameters.get("resource_pool") == "limited":
    risk_factors.append("constrained_resources")
```

### Add Custom Mitigation Suggestion

Edit `_generate_alternatives()`:

```python
if "constrained_resources" in risk_factors:
    suggestions.append("Request dedicated resource pool")
```

### Adjust Risk Factor Weight

Edit `_calculate_adjusted_probability()`:

```python
factor_weights = {
    "your_factor": 0.10,  # 10% probability increase
}
```

## Data Privacy & Security

- Task history stored **locally only** at `~/.claude/task_history.db`
- No data sent to external services
- Parameters logged as-is — redact sensitive data before calling predictor:

```python
# Redact secrets
safe_params = {k: v for k, v in params.items() 
               if k not in ["api_key", "password", "token"]}

prediction = predictor.predict(task_type, safe_params)
```

## Batch Processing

Predict failures for multiple tasks:

```python
tasks = [
    ("deploy", {"service": "api"}),
    ("test", {"suite": "integration"}),
    ("lint", {"strict": True}),
]

predictions = predictor.batch_predict(tasks)

for task_id, prediction in predictions.items():
    if prediction.failure_probability >= 0.60:
        alert(f"{task_id}: {prediction.recommendation}")
```

## Analysis Export

Generate summary reports:

```python
predictor.export_analysis("analysis.json")
```

Output structure:

```json
{
  "generated_at": "2025-06-22T10:30:00",
  "task_types": [
    {
      "type": "deploy",
      "total_executions": 45,
      "failures": 12,
      "failure_rate": 0.267
    },
    {
      "type": "test",
      "total_executions": 120,
      "failures": 8,
      "failure_rate": 0.067
    }
  ]
}
```

## Performance

- **Prediction time**: ~5ms (no history) to ~50ms (with large history)
- **Database size**: ~500 bytes per execution record
- **Lookback window**: 30 days for base rate, 90 days for similar failures

## Limitations

- Requires historical data for accurate predictions (defaults to 20% if none)
- Cannot predict novel failure modes not in history
- Parameters must be JSON-serializable
- Confidence score reflects data availability, not true prediction uncertainty

## Testing

Run test suite:

```bash
python ml/test_failure_prediction.py
```

Tests cover:
- Basic prediction with/without history
- High-risk alert threshold (>60%)
- Risk factor identification
- Batch prediction
- Analysis export
- Parameter similarity matching

## Architecture

```
FailurePredictor (main class)
├── Database Management
│   ├── _init_db()
│   ├── log_execution()
│   └── _get_task_history()
├── Prediction Engine
│   ├── predict()
│   ├── _calculate_base_failure_rate()
│   ├── _analyze_risk_factors()
│   └── _calculate_adjusted_probability()
├── Analysis
│   ├── _find_similar_failures()
│   ├── _parameter_similarity()
│   └── _calculate_confidence()
└── Output Generation
    ├── _generate_alternatives()
    ├── _create_recommendation()
    └── export_analysis()
```

## Future Enhancements

- Time-series analysis (temporal patterns in failures)
- Anomaly detection (unusual parameter combinations)
- Causal inference (which factors actually cause failures)
- Online learning (update predictions as new data arrives)
- Explainability scores (detailed factor contributions)

## References

- See `integration-example.py` for workflow integration patterns
- See `test_failure_prediction.py` for usage examples
