# Task Sequence Model Integration Guide

## Overview

The Task Sequence Model integrates with dont-stop goal execution workflows to optimize task ordering, predict success, and estimate resource requirements before execution.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ Dont-Stop Goal Workflow                                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Parse Goals & Extract Tasks                             │
│     ↓                                                        │
│  2. Engineer Features (context, resources, timing)          │
│     ↓                                                        │
│  3. Predict Success & Duration (ONNX inference)            │
│     ↓                                                        │
│  4. Optimize Task Sequence (efficiency score ranking)       │
│     ↓                                                        │
│  5. Allocate Resources & Set Timeouts                       │
│     ↓                                                        │
│  6. Execute Tasks (with enhanced monitoring for high-risk)  │
│     ↓                                                        │
│  7. Log Actual Results & Update Model                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Integration Points

### 1. Pre-Execution Planning

**Location**: Goal parser → task extraction

**Input**: 
- Task list from parsed goal
- System context (CPU, memory, time of day)
- Task metadata (type, complexity, dependencies)

**Output**:
- Predicted success probability per task
- Estimated duration per task
- Risk level (low/medium/high/critical)
- Optimized execution order

**Example Code**:

```python
from ml.onnx_inference import TaskPredictionService

service = TaskPredictionService()

# After parsing goal into tasks
tasks = goal.extract_tasks()

# Get predictions for entire workflow
workflow_metrics = service.predict_workflow(tasks)

# Check if workflow is risky
if workflow_metrics['workflow_success_probability'] < 0.7:
    logger.warning(f"Low success probability: {workflow_metrics['workflow_success_probability']:.2%}")
    # Apply mitigations:
    # - Increase retry counts
    # - Add error recovery steps
    # - Allocate more resources

# Optimize execution order
optimized_tasks = service.optimize_execution(tasks)

# Sort tasks by predicted efficiency
tasks = sorted(optimized_tasks, key=lambda t: t['optimized_position'])
```

### 2. Resource Allocation

**Location**: Executor → resource provisioning

**Use**:
- Estimated duration → set task timeout
- Task type → allocate CPU/memory
- Risk level → configure retry strategy

**Example Code**:

```python
for task in optimized_tasks:
    # Set timeout based on predicted duration + buffer
    timeout = task['predicted_duration'] * 1.5 + 60  # 50% buffer + 60s minimum
    
    # Configure retries based on risk
    retries = {
        'low': 1,
        'medium': 2,
        'high': 3,
        'critical': 4,
    }.get(task['risk_level'], 2)
    
    # Set resource limits
    resources = {
        'cpu_cores': 2 if task['type'] == 'computation' else 1,
        'memory_mb': 512 if task['type'] == 'data_prep' else 256,
        'timeout_seconds': timeout,
        'max_retries': retries,
    }
    
    executor.configure_task(task['id'], resources)
```

### 3. Execution Monitoring

**Location**: Executor → task runner

**Use**:
- Predicted duration → detect anomalies if >2x prediction
- Risk level → trigger enhanced logging for high-risk tasks
- Success probability → adapt strategy if task fails

**Example Code**:

```python
def execute_with_monitoring(task, prediction):
    start_time = time.time()
    
    logger.info(f"Executing {task['id']}")
    logger.info(f"  Predicted success: {prediction['success_probability']:.2%}")
    logger.info(f"  Predicted duration: {prediction['estimated_duration_seconds']:.1f}s")
    logger.info(f"  Risk level: {prediction['risk_level']}")
    
    # Enhanced logging for high-risk tasks
    if prediction['risk_level'] in ['high', 'critical']:
        executor.enable_verbose_logging(task['id'])
    
    try:
        result = executor.run(task, timeout=prediction['timeout_seconds'])
        elapsed = time.time() - start_time
        
        # Log anomalies
        if elapsed > prediction['estimated_duration_seconds'] * 2:
            logger.warning(f"Task {task['id']} took {elapsed:.1f}s (predicted {prediction['estimated_duration_seconds']:.1f}s)")
        
        return result
        
    except TaskFailedError as e:
        logger.error(f"Task {task['id']} failed: {e}")
        # Apply mitigation for high-risk failures
        if prediction['risk_level'] == 'critical':
            trigger_manual_review(task['id'], e)
```

### 4. Post-Execution Feedback Loop

**Location**: Executor → model training

**Use**:
- Compare predicted vs actual execution
- Update model with new data
- Identify prediction errors and calibrate

**Example Code**:

```python
def log_execution_result(task, prediction, actual_result):
    """Log execution for model improvement."""
    from ml.task_sequence_model import TaskSequenceModel
    
    record = {
        'task_id': task['id'],
        'task_name': task['name'],
        'task_type': task['type'],
        'goal_type': task.get('goal_type', 'analysis'),
        'task_position': task.get('position', 0),
        'task_count': task.get('task_count', 1),
        'time_of_day': datetime.now().hour,
        'day_of_week': datetime.now().weekday(),
        'cpu_available': get_system_cpu_available(),
        'memory_available': get_system_memory_available(),
        'success': 1 if actual_result.status == 'success' else 0,
        'duration_seconds': actual_result.duration,
        'predicted_success': prediction['success_probability'],
        'predicted_duration': prediction['estimated_duration_seconds'],
    }
    
    # Store for periodic retraining
    store_execution_record(record)
    
    # Check prediction error
    if abs(record['duration_seconds'] - record['predicted_duration']) > 60:
        logger.info(f"Large duration error for {task['id']}: "
                   f"actual={record['duration_seconds']:.1f}s, "
                   f"predicted={record['predicted_duration']:.1f}s")

def retrain_model_if_needed():
    """Periodically retrain model with accumulated data."""
    records = load_execution_records(limit=1000)
    
    if len(records) >= 100:  # Retrain after 100 new executions
        df = pd.DataFrame(records)
        
        model = TaskSequenceModel()
        model.train(df)
        model.save_models()
        model.export_to_onnx()
        
        logger.info(f"Model retrained on {len(records)} records")
```

## Workflow Integration Pattern

### Step-by-Step Integration

1. **Goal Parsing Phase**
   ```python
   # Parse goal into component tasks
   tasks = goal_parser.parse(goal_text)
   
   # Get system context
   context = {
       'time_of_day': datetime.now().hour,
       'day_of_week': datetime.now().weekday(),
       'cpu_available': psutil.cpu_percent() / 100,
       'memory_available': psutil.virtual_memory().available / psutil.virtual_memory().total,
   }
   
   # Add context to tasks
   for task in tasks:
       task.update(context)
   ```

2. **Prediction Phase**
   ```python
   service = TaskPredictionService()
   
   # Get workflow metrics
   metrics = service.predict_workflow(tasks)
   
   # Assess workflow risk
   if metrics['workflow_success_probability'] < 0.7:
       # Apply risk mitigation
       tasks = apply_mitigation_steps(tasks)
   
   # Optimize order
   tasks = service.optimize_execution(tasks)
   ```

3. **Execution Phase**
   ```python
   results = []
   for task in tasks:
       # Get prediction for task
       pred = service.predict_task(task['id'], service._prepare_features(task))
       
       # Configure and execute
       config = configure_task_resources(task, pred)
       result = executor.run(task, config)
       
       # Log result
       log_execution_result(task, pred, result)
       results.append(result)
   
   # Check for failures and adapt
   if any(r.status == 'failure' for r in results):
       apply_recovery_strategy(tasks, results)
   ```

## Performance Considerations

### Inference Speed

- Single prediction: ~5-10ms (ONNX)
- Batch prediction (100 tasks): ~50-100ms
- Lightweight enough for real-time use

### Memory Usage

- Loaded ONNX models: ~50-100 MB
- Feature engineering: O(n) with n tasks

### Latency Budget

For typical workflows with 5-20 tasks:
- Feature engineering: <1ms
- Prediction: <100ms
- Optimization: <10ms
- **Total**: <200ms overhead

## Error Handling

### Missing Models

```python
try:
    service = TaskPredictionService()
except FileNotFoundError:
    logger.warning("Models not found. Running without optimization.")
    # Fallback: use default task order, no predictions
    tasks = fallback_task_order(tasks)
```

### Invalid Features

```python
try:
    prediction = service.predict_task(task_id, features)
except ValueError:
    # Feature vector has wrong shape
    logger.error(f"Invalid features for {task_id}")
    # Fallback: assume medium risk
    prediction = {
        'success_probability': 0.5,
        'estimated_duration_seconds': 60,
        'risk_level': 'medium',
    }
```

### ONNX Runtime Issues

```python
try:
    from ml.onnx_inference import TaskPredictionService
    service = TaskPredictionService()
except ImportError:
    logger.warning("onnxruntime not available. Install with: pip install onnxruntime")
    service = None
```

## Configuration

### settings.json Hook

```json
{
  "hooks": {
    "before_dont_stop_execute": {
      "command": "python ml/optimize-tasks.py",
      "args": ["${goal}", "${task_list}"],
      "timeout_ms": 5000,
      "on_error": "continue"
    },
    "after_task_execute": {
      "command": "python ml/log-execution.py",
      "args": ["${task_id}", "${result}"],
      "timeout_ms": 1000,
      "on_error": "ignore"
    }
  }
}
```

## Testing

### Unit Tests

```python
# test_task_sequence.py
import unittest
from ml.onnx_inference import TaskPredictionService

class TestTaskSequence(unittest.TestCase):
    def setUp(self):
        self.service = TaskPredictionService()
    
    def test_predict_task(self):
        task = {"name": "fetch", "type": "io", "goal_type": "analysis"}
        features = self.service._prepare_features(task)
        prediction = self.service.predict_task("test", features)
        
        self.assertIn('success_probability', prediction)
        self.assertIn('estimated_duration_seconds', prediction)
        self.assertBetween(prediction['success_probability'], 0, 1)
    
    def test_optimize_workflow(self):
        tasks = [
            {"id": "t1", "name": "setup", "type": "data_prep"},
            {"id": "t2", "name": "fetch", "type": "io"},
            {"id": "t3", "name": "parse", "type": "computation"},
        ]
        optimized = self.service.optimize_execution(tasks)
        
        self.assertEqual(len(optimized), 3)
        self.assertTrue(all('optimized_position' in t for t in optimized))
```

### Integration Tests

```python
# Run full workflow with predictions
goal = "analyze data from API and generate report"
tasks = goal_parser.parse(goal)
metrics = service.predict_workflow(tasks)
optimized = service.optimize_execution(tasks)
results = executor.run_all(optimized)

assert metrics['total_tasks'] == len(tasks)
assert all('predicted_success' in t for t in optimized)
```

## Future Enhancements

1. **Dependency Constraints** - Respect task dependencies in optimization
2. **Multi-Goal Batching** - Optimize across multiple concurrent goals
3. **Adaptive Thresholds** - Auto-adjust retry/timeout based on recent accuracy
4. **Uncertainty Quantification** - Provide confidence intervals, not point estimates
5. **Distributed Inference** - Run predictions across multiple workers
6. **Model Compression** - Quantize ONNX models for edge deployment
7. **A/B Testing** - Compare different optimization strategies

## Support

- Issues: Report in Claudient repository
- Training data: Provide execution logs as CSV with required columns
- Model updates: Retrain monthly or after 100+ new executions
