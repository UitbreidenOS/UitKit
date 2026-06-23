# Task Sequence Model - Quick Start

Train XGBoost models on task execution history, export to ONNX, and use for real-time task optimization.

## Installation

```bash
pip install -r ml/requirements.txt
```

## Train Model (5 minutes)

```bash
python ml/task-sequence-model.py
```

This generates:
- `ml/models/success_model.json` - Success prediction (XGBoost)
- `ml/models/duration_model.json` - Duration prediction (XGBoost)
- `ml/models/success_model.onnx` - Success model (ONNX)
- `ml/models/duration_model.onnx` - Duration model (ONNX)
- `ml/models/label_encoders.pkl` - Feature encoders
- `ml/models/metadata.json` - Training metadata

## Use in Code

### Basic Prediction

```python
from ml.onnx_inference import TaskPredictionService
import numpy as np

service = TaskPredictionService()

# Predict single task
task = {
    "id": "fetch_data",
    "name": "fetch",
    "type": "io",
    "goal_type": "integration",
    "position": 1,
    "task_count": 5,
    "time_of_day": 14,
    "day_of_week": 2,
    "cpu_available": 0.7,
    "memory_available": 0.8,
}

features = service._prepare_features(task)
prediction = service.predict_task(task["id"], features)

print(f"Success: {prediction['success_probability']:.2%}")
print(f"Duration: {prediction['estimated_duration_seconds']:.1f}s")
print(f"Risk: {prediction['risk_level']}")
```

### Optimize Task Order

```python
# Predict and optimize entire workflow
tasks = [
    {"id": "t1", "name": "setup", "type": "data_prep", "goal_type": "analysis"},
    {"id": "t2", "name": "fetch", "type": "io", "goal_type": "analysis"},
    {"id": "t3", "name": "parse", "type": "computation", "goal_type": "analysis"},
]

optimized = service.optimize_execution(tasks)

for task in optimized:
    print(f"{task['optimized_position']}. {task['id']}: "
          f"{task['predicted_success']:.2%} success, "
          f"{task['predicted_duration']:.1f}s, "
          f"{task['risk_level']} risk")
```

### Workflow Metrics

```python
# Get overall workflow prediction
metrics = service.predict_workflow(tasks)

print(f"Total tasks: {metrics['total_tasks']}")
print(f"Workflow success: {metrics['workflow_success_probability']:.2%}")
print(f"Total duration: {metrics['total_estimated_duration']:.1f}s")
print(f"Average per task: {metrics['average_task_duration']:.1f}s")
```

## Examples

Run full example with training and inference:

```bash
python ml/example-task-sequence.py
```

This demonstrates:
1. Training from synthetic data
2. ONNX inference
3. Task prediction service
4. Workflow optimization

## Model Features

**Input Features (9):**
- task_position: Position in sequence (0-indexed)
- task_count: Total tasks in workflow
- time_of_day: Hour of execution (0-23)
- day_of_week: Day of week (0=Mon, 6=Sun)
- cpu_available: CPU availability (0.0-1.0)
- memory_available: Memory availability (0.0-1.0)
- task_name_encoded: Encoded task name
- task_type_encoded: Encoded task type
- goal_type_encoded: Encoded goal type

**Output Predictions:**
- Success probability: 0.0-1.0
- Estimated duration: seconds

## Architecture

```
TaskSequenceModel (Training)
├─ Generate/load data
├─ Engineer features (9D vectors)
├─ Train XGBoost classifer (success)
├─ Train XGBoost regressor (duration)
├─ Save native models (.json)
└─ Export to ONNX format

ONNXTaskPredictor (Inference)
├─ Load ONNX models
├─ Load encoders + scaler
└─ Predict: success_prob, duration

TaskPredictionService (API)
├─ Batch predict
├─ Rank by efficiency (success/duration)
├─ Assess risk level
└─ Optimize task order
```

## Integration Points

### Pre-Execution
```python
# Optimize task order before execution
optimized = service.optimize_execution(tasks)
```

### Resource Allocation
```python
# Set timeout based on prediction
timeout = prediction['estimated_duration_seconds'] * 1.5

# Configure retries by risk
retries = {'low': 1, 'medium': 2, 'high': 3, 'critical': 4}
```

### Monitoring
```python
# Enhanced logging for high-risk tasks
if prediction['risk_level'] in ['high', 'critical']:
    enable_verbose_logging()
```

### Feedback Loop
```python
# Log actual results for model improvement
log_execution_result(task, prediction, actual_result)

# Retrain after 100+ executions
if execution_count > 100:
    retrain_model()
```

## Performance

- Single prediction: ~5-10ms
- Batch (100 tasks): ~50-100ms
- ONNX inference: No Python ML dependencies needed

## Troubleshooting

### Models not found
```python
# Run training first
python ml/task-sequence-model.py
```

### onnxruntime not installed
```bash
pip install onnxruntime
```

### Feature encoding error
Ensure task dict has required keys: `name`, `type`, `goal_type`

## Next Steps

1. Train on real execution data for better accuracy
2. Set up post-execution logging
3. Retrain monthly or after 100 new executions
4. Integrate with dont-stop goal workflow
5. Monitor prediction vs actual performance

## Documentation

- `README.md` - Full API reference
- `INTEGRATION.md` - Detailed integration guide
- `example-task-sequence.py` - Working examples
