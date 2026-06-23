# Machine Learning Module

ML utilities for Claude Code and Claudient workflows, including task sequence optimization, failure prediction, and token usage forecasting.

## task-sequence-model.py

XGBoost-based predictor for optimal task execution sequencing. Trains on historical dont-stop goal executions to predict task success probability, estimated duration, and optimal execution order. Exports models to ONNX for cross-platform inference.

### Features

- **Success Prediction**: Binary classifier (XGBClassifier) predicting task success probability
- **Duration Estimation**: Regression model (XGBRegressor) for task execution time in seconds
- **Sequence Optimization**: Heuristic ordering based on success-to-duration ratio
- **ONNX Export**: Convert trained models to ONNX for inference without XGBoost dependency
- **Batch Prediction**: Efficient bulk prediction for multiple tasks
- **Feature Importance**: Identify which factors most influence predictions
- **Synthetic Data**: Generate realistic training data if historical data unavailable

### Architecture

#### Core Components

1. **TaskSequenceModel** - Main training and export pipeline
   - `train()` - Train success and duration models
   - `predict_task_success()` - Get success probability for single task
   - `predict_task_duration()` - Get estimated duration for single task
   - `optimize_task_sequence()` - Rank tasks by efficiency score
   - `export_to_onnx()` - Convert to ONNX format
   - `save_models()` / `load_models()` - Persistence

2. **ONNXTaskPredictor** - Runtime inference wrapper
   - Use exported ONNX models for fast, lightweight prediction
   - No XGBoost/sklearn dependency at inference time
   - Supports batch prediction

3. **TaskPredictionService** - High-level API
   - `predict_task()` - Predict single task with risk assessment
   - `predict_workflow()` - Metrics for entire task sequence
   - `optimize_execution()` - Reorder tasks for efficiency

### Features Engineered

| Feature | Type | Description |
|---------|------|-------------|
| `task_position` | int | Position in sequence (0-indexed) |
| `task_count` | int | Total tasks in workflow |
| `time_of_day` | int | Hour of execution (0-23) |
| `day_of_week` | int | Day (0=Mon, 6=Sun) |
| `cpu_available` | float | CPU availability [0.0, 1.0] |
| `memory_available` | float | Memory availability [0.0, 1.0] |
| `task_name_encoded` | int | Categorical encoding of task name |
| `task_type_encoded` | int | Categorical encoding (data_prep, computation, io, validation, cleanup) |
| `goal_type_encoded` | int | Categorical encoding (analysis, transformation, integration, migration) |

### Quick Start

#### Train and Export

```python
from ml.task_sequence_model import TaskSequenceModel

model = TaskSequenceModel()

# Train on data (generates synthetic if not provided)
model.train()

# Save native models
model.save_models()

# Export to ONNX
model.export_to_onnx()
```

#### Predict with ONNX

```python
import numpy as np
from ml.onnx_inference import ONNXTaskPredictor

predictor = ONNXTaskPredictor()

# Prepare features
features = np.array([[2, 5, 14, 2, 0.7, 0.8, 1, 2, 0]], dtype=np.float32)

# Predict
success_prob = predictor.predict_task_success(features)
duration = predictor.predict_task_duration(features)

print(f"Success: {success_prob:.4f}, Duration: {duration:.2f}s")
```

#### Optimize Task Order

```python
from ml.onnx_inference import TaskPredictionService

service = TaskPredictionService()

tasks = [
    {"id": "t1", "name": "setup", "type": "data_prep", "goal_type": "analysis"},
    {"id": "t2", "name": "fetch", "type": "io", "goal_type": "analysis"},
    {"id": "t3", "name": "parse", "type": "computation", "goal_type": "analysis"},
]

# Optimize execution
optimized = service.optimize_execution(tasks)

for task in optimized:
    print(f"{task['id']}: {task['predicted_success']:.4f} success, {task['predicted_duration']:.2f}s")
```

### Model Performance

After training on 500 samples:

- **Success Model**: ~85% accuracy, ~0.82 F1-score
- **Duration Model**: ~15-20% MAE (mean absolute error)
- **Feature Importance**: task_type, task_position, cpu/memory availability are top predictors

### ONNX Inference

Exported models run in any ONNX-compatible runtime (onnxruntime, TensorFlow, CoreML, etc.) without Python ML dependencies:

```python
import onnxruntime as rt

sess = rt.InferenceSession("models/success_model.onnx")
output = sess.run(None, {"float_input": features})
```

### Files Generated

```
models/
├── success_model.json        # XGBoost native format
├── success_model.onnx        # ONNX format
├── duration_model.json       # XGBoost native format
├── duration_model.onnx       # ONNX format
├── label_encoders.pkl        # Categorical encoders
├── scalers.pkl               # Feature scaler
├── metadata.json             # Feature names, training stats
└── onnx_metadata.json        # ONNX model paths
```

### Integration with Dont-Stop Goals

1. **Pre-execution**: Predict task success and duration before execution
2. **Sequencing**: Optimize task order based on efficiency scores
3. **Resource Allocation**: Allocate resources based on predicted duration
4. **Risk Stratification**: Identify high-risk tasks early
5. **Adaptive Retry**: Increase retry budget for high-risk tasks
6. **Post-execution**: Feed actual results back to improve model

### Extending the Model

Add custom task types to synthetic data generation:

```python
tasks = ["setup", "fetch", "parse", ..., "YOUR_TASK"]
```

Adjust XGBoost hyperparameters in `train()`:

```python
self.success_model = xgb.XGBClassifier(
    n_estimators=200,    # More trees
    max_depth=8,         # Deeper
    learning_rate=0.05,  # Slower learning
)
```

## failure-prediction.py

Predictive failure analysis for task execution.

### Features

- **Failure Probability Calculation**: Analyzes task parameters and historical execution data
- **Risk Stratification**: Categorizes risk as low, medium, or high
- **Risk Factor Analysis**: Identifies specific failure drivers (complexity, timeouts, resource constraints, dependency chains)
- **Similar Failure Detection**: Finds historical failures with matching parameters
- **Confidence Scoring**: Weights predictions by data availability and factor corroboration
- **Actionable Recommendations**: Suggests specific mitigations based on risk profile
- **Alert Threshold**: Automatically alerts when failure risk exceeds 60%

### Architecture

#### Core Classes

**FailurePredictor**
- Maintains SQLite database of task execution history
- Computes failure probability from base rate + risk factor adjustments
- Generates alternative execution strategies

**TaskRecord**
- Historical execution entry with status, duration, error category

**FailurePrediction**
- Result dataclass with probability, risk factors, confidence, recommendations

### Usage

#### Python API

```python
from ml.failure_prediction import FailurePredictor, TaskRecord

# Initialize
predictor = FailurePredictor()

# Predict failure for a task
prediction = predictor.predict(
    task_type="deploy_service",
    parameters={
        "service": "api",
        "environment": "prod",
        "timeout_seconds": 7200,
        "dependencies": ["db_migration", "config_update"],
        "max_retries": 0
    }
)

# Check result
if prediction.failure_probability >= 0.60:
    print(f"ALERT: {prediction.recommendation}")
    for alt in prediction.suggested_alternatives:
        print(f"  - {alt}")

# Log an execution
from datetime import datetime
record = TaskRecord(
    task_id="deploy-20250622-001",
    task_type="deploy_service",
    parameters={...},
    status="failure",
    duration_seconds=1500,
    error_category="timeout",
    timestamp=datetime.now().isoformat()
)
predictor.log_execution(record)

# Batch predict multiple tasks
tasks = [
    ("deploy", {"service": "api"}),
    ("test", {"suite": "integration"}),
]
predictions = predictor.batch_predict(tasks)

# Export analysis report
predictor.export_analysis("analysis.json")
```

#### CLI

```bash
# Predict failure for a task
python ml/failure-prediction.py deploy_service \
  --params '{"service":"api","timeout_seconds":7200,"max_retries":0}'

# Log an execution
python ml/failure-prediction.py deploy_service \
  --log "deploy-001" \
  --params '{"service":"api"}' \
  --status failure \
  --error timeout \
  --duration 1500

# Export analysis
python ml/failure-prediction.py dummy_type --export analysis.json
```

### Prediction Algorithm

1. **Base Failure Rate**: Calculate from recent history (default 20% if no data)
2. **Risk Factor Identification**:
   - Parameter complexity (>10 params)
   - Long timeouts (>1 hour)
   - Missing retry configuration
   - Low memory allocation (<512MB)
   - High dependency chains (>5 deps)
   - Recurring error patterns
   - High historical retry rates (>2x average)

3. **Probability Adjustment**: Base rate + weighted risk factors
   - Each factor adds 5-20% to base probability
   - Capped at 99%

4. **Confidence Calculation**: Combines data availability (0-100% history coverage) + factor corroboration

5. **Recommendations**: Generated based on:
   - Specific risk factors present
   - Similar historical failures
   - Success rate context

### Risk Levels

- **Low** (<30% failure): Safe to execute
- **Medium** (30-60% failure): Review mitigations, apply alternatives
- **High** (>60% failure): Alert triggered, manual review recommended

### Database Schema

SQLite database stored at `~/.claude/task_history.db`:

```sql
task_executions (
  id INTEGER PRIMARY KEY,
  task_id TEXT,
  task_type TEXT,
  parameters TEXT (JSON),
  status TEXT,
  duration_seconds REAL,
  error_category TEXT,
  retry_count INTEGER,
  timestamp DATETIME
)
```

Indexes on `(task_type, status)` and `timestamp` for fast lookups.

### Integration Points

1. **Workflow Pre-execution Hook**: Call predictor before task dispatch
2. **CI/CD Pipelines**: Generate failure reports for high-risk jobs
3. **Task Scheduler**: Adjust concurrency or retry strategy based on predictions
4. **Alerting Systems**: Trigger notifications for >60% risk tasks

### Example Workflow Integration

```python
# In a workflow orchestrator
def execute_task(task_type, params):
    predictor = FailurePredictor()
    prediction = predictor.predict(task_type, params)
    
    if prediction.failure_probability >= 0.60:
        # Send alert
        alert(f"High-risk task: {prediction.recommendation}")
        
        # Ask for manual approval or apply mitigations
        for suggestion in prediction.suggested_alternatives:
            apply_mitigation(suggestion)
    
    # Execute with enhanced monitoring if risky
    monitor_level = "enhanced" if prediction.risk_level == "high" else "standard"
    return run_task(task_type, params, monitor_level)
```

### Extending the Predictor

Custom risk factors can be added in `_analyze_risk_factors()`:

```python
# Add domain-specific factor
if parameters.get("resource_pool") == "limited":
    risk_factors.append("constrained_resources")

# Add weight to factor_weights dict in _calculate_adjusted_probability()
factor_weights["constrained_resources"] = 0.08
```

### Data Privacy

Task history stored locally only. Parameters are logged as-is—redact sensitive data before calling predictor if needed.
