# Token Usage Forecaster Integration Guide

## Quick Start

### Import and Initialize
```python
from ml.token_usage_forecaster import TokenForecaster, TaskType, ComplexityLevel

# Create forecaster with budget
forecaster = TokenForecaster(budget_tokens=1_000_000)
```

### Estimate Token Costs
```python
# Single task
estimate = forecaster.estimate_single_task(
    task_type=TaskType.CODE_GENERATION,
    complexity=ComplexityLevel.MEDIUM,
    file_count=5,
    codebase_size_kb=500
)
print(f"Estimated tokens: {estimate.total_tokens}")
print(f"Breakdown: {estimate.breakdown}")
```

### Check Budget Constraints
```python
alert = forecaster.check_budget(
    tokens_needed=50_000,
    tokens_used=30_000,
    threshold_warning=0.75,
    threshold_critical=0.90
)

if alert:
    if alert.alert_type == "exceeded":
        # Stop execution - budget exceeded
        raise BudgetError(alert.message)
    elif alert.alert_type == "critical":
        # Log warning, consider reducing scope
        log.warning(alert.message)
    elif alert.alert_type == "warning":
        # Log notice, proceed with monitoring
        log.info(alert.message)
```

## Integration with Workflows

### Pre-Execution Gate
```python
def should_execute_task(task_type, complexity, remaining_budget):
    """Gate task execution based on budget."""
    forecaster = TokenForecaster(remaining_budget)
    
    estimate = forecaster.estimate_single_task(task_type, complexity)
    alert = forecaster.check_budget(estimate.total_tokens)
    
    return alert is None or alert.alert_type != "exceeded"
```

### Multi-Agent Coordination
```python
def orchestrate_agents(agents, total_budget):
    """Distribute budget across multiple agents."""
    forecaster = TokenForecaster(total_budget)
    allocations = {}
    tokens_remaining = total_budget
    
    for agent_name, tasks in agents.items():
        total, ests, summary = forecaster.forecast_multi_task(tasks)
        
        if total > tokens_remaining:
            # Reduce task scope or skip agent
            log.warning(f"Agent {agent_name} exceeded budget")
            allocations[agent_name] = None
        else:
            allocations[agent_name] = total
            tokens_remaining -= total
    
    return allocations
```

### Historical Tracking Hook
```python
def track_task_execution(task_type, input_tokens, output_tokens, complexity):
    """Record actual usage for calibration."""
    forecaster = load_forecaster_state()
    
    forecaster.record_actual_usage(
        task_type=task_type,
        input_tokens=input_tokens,
        output_tokens=output_tokens,
        complexity=complexity,
        metadata={
            "timestamp": now(),
            "success": True,
            "duration_seconds": elapsed_time()
        }
    )
    
    save_forecaster_state(forecaster)
```

### Accuracy Monitoring
```python
def weekly_calibration_check():
    """Check forecast accuracy and adjust if needed."""
    forecaster = load_forecaster_state()
    accuracy = forecaster.accuracy_vs_forecast()
    
    for task_type, metrics in accuracy.items():
        error = metrics.get("error_percent", 0)
        
        if error > 25:  # Threshold for recalibration
            log.warning(
                f"Task type {task_type} has {error}% error. "
                "Consider recalibrating BASE_COSTS."
            )
            suggest_recalibration(task_type, metrics)
```

## Configuration Patterns

### Conservative Budget Planning
```python
# Add extra contingency for uncertainty
total, ests, summary = forecaster.forecast_multi_task(
    tasks,
    contingency_percent=30  # 30% buffer instead of 15%
)
```

### Aggressive Cost Optimization
```python
# Reduce complexity when approaching budget limit
task_list = [...]
for task_type, complexity, kwargs in task_list:
    est_high = forecaster.estimate_single_task(task_type, ComplexityLevel.HIGH, **kwargs)
    
    if (tokens_used + est_high.total_tokens) > budget:
        # Downgrade complexity
        est_med = forecaster.estimate_single_task(task_type, ComplexityLevel.MEDIUM, **kwargs)
        if (tokens_used + est_med.total_tokens) <= budget:
            est = est_med
        else:
            skip_task()
    else:
        est = est_high
    
    tokens_used += est.total_tokens
```

### Real-Time Budget Adjustment
```python
def adaptive_workflow(initial_tasks, budget):
    """Dynamically adjust workflow based on actual usage."""
    forecaster = TokenForecaster(budget)
    tokens_used = 0
    executed_tasks = []
    skipped_tasks = []
    
    for task in initial_tasks:
        est = forecaster.estimate_single_task(task.type, task.complexity)
        
        if tokens_used + est.total_tokens <= budget:
            result = execute_task(task)
            tokens_used += result.actual_tokens
            executed_tasks.append(task)
            
            # Record for calibration
            forecaster.record_actual_usage(
                task.type,
                result.input_tokens,
                result.output_tokens,
                task.complexity
            )
        else:
            skipped_tasks.append(task)
    
    return executed_tasks, skipped_tasks
```

## Monitoring and Alerting

### Budget Health Dashboard
```python
def generate_budget_report(forecaster):
    """Generate current budget status."""
    return {
        "total_budget": forecaster.budget_tokens,
        "tokens_used": sum(r["total_tokens"] for r in forecaster.token_history),
        "tokens_remaining": forecaster.budget_tokens - sum(...),
        "percentage_used": (tokens_used / budget) * 100,
        "task_count": len(forecaster.token_history),
        "avg_per_task": tokens_used / len(forecaster.token_history) if forecaster.token_history else 0,
        "accuracy": forecaster.accuracy_vs_forecast(),
    }
```

### Export for Analysis
```python
def export_metrics(forecaster, filepath):
    """Export forecast data for analysis."""
    report = forecaster.export_forecast_report(filepath)
    
    # Generate summary statistics
    summary = {
        "report_path": filepath,
        "history_size": len(forecaster.token_history),
        "forecasts_made": len(forecaster.forecasts),
        "accuracy_available": "error" not in forecaster.accuracy_vs_forecast(),
    }
    
    return summary
```

## Recalibration Workflow

### Step 1: Collect Baseline Data
Run tasks for 2 weeks and collect 20-30 samples per task type.

```python
# Each task execution
forecaster.record_actual_usage(
    task_type=detected_type,
    input_tokens=api_response.usage.prompt_tokens,
    output_tokens=api_response.usage.completion_tokens,
    complexity=estimated_complexity
)
```

### Step 2: Analyze Accuracy
```python
accuracy = forecaster.accuracy_vs_forecast()

# Identify high-error task types
high_errors = {
    t: m for t, m in accuracy.items()
    if m.get("error_percent", 0) > 20
}

for task_type, metrics in high_errors.items():
    print(f"{task_type}: forecast={metrics['forecast']}, actual={metrics['avg_actual']}")
```

### Step 3: Adjust Weights
Update BASE_COSTS or OUTPUT_RATIOS in token-usage-forecaster.py:

```python
# If code_generation actual average is higher than forecast
BASE_COSTS[TaskType.CODE_GENERATION] = 1500  # was 1200
OUTPUT_RATIOS[TaskType.CODE_GENERATION] = 1.8  # was 1.5
```

### Step 4: Validate
Run tests again to verify improvements:
```python
python3 ml/test_token_forecaster.py
```

## Performance Tips

1. **Batch Calculations**: Forecast multiple workflows at once
   ```python
   workflows = [workflow1, workflow2, workflow3]
   for workflow in workflows:
       total, _, _ = forecaster.forecast_multi_task(workflow)
   ```

2. **Cache Estimates**: Store frequently-used estimates
   ```python
   estimate_cache = {}
   key = (task_type, complexity, file_count)
   if key not in estimate_cache:
       estimate_cache[key] = forecaster.estimate_single_task(...)
   ```

3. **Lazy Loading**: Load forecaster only when needed
   ```python
   _forecaster = None
   def get_forecaster():
       global _forecaster
       if _forecaster is None:
           _forecaster = load_forecaster_state()
       return _forecaster
   ```

## Troubleshooting

### Forecasts Too Conservative
- Reduce contingency_percent (default 15%)
- Lower complexity levels in estimation
- Check if historical data shows overestimation

### Forecasts Too Aggressive  
- Increase contingency_percent
- Check accuracy_vs_forecast() output
- Review for specific task types with high actual costs

### Budget Alerts Not Firing
- Verify thresholds are set correctly (default 0.75 warning, 0.90 critical)
- Ensure check_budget() is called before execution
- Check that tokens_used is being tracked accurately

## Reference

**Files:**
- `ml/token-usage-forecaster.py` - Main module
- `ml/test_token_forecaster.py` - Test suite (11 tests)
- `ml/example-token-forecasting.py` - Example scenarios
- `ml/README.md` - API documentation

**Key Classes:**
- TokenForecaster - Main engine
- TaskType - 11 task categories
- ComplexityLevel - 5-level scale
- TokenEstimate - Forecast result
- BudgetAlert - Alert notification
