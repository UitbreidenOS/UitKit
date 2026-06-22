# ML Directory - Token Management & Forecasting

## Overview

The `ml/` directory contains machine learning utilities for Claude Code operations, with a focus on token usage prediction and budget management.

## Token Usage Forecaster (`token-usage-forecaster.py`)

Predict token consumption based on goal complexity and task types. Automatically alerts when token budget is insufficient.

### Features

- **Task-based estimation**: 11 task types with empirically-derived base costs
- **Complexity multipliers**: Scale estimates from minimal (0.5x) to critical (2.5x)
- **Multi-task forecasting**: Combine predictions for sequences of tasks
- **Contingency buffer**: Add automatic overhead for unexpected costs
- **Budget alerts**: Three-tier alert system (warning, critical, exceeded)
- **Historical tracking**: Record actual usage and compare against forecasts
- **Accuracy analysis**: Learn model calibration over time
- **JSON export**: Generate shareable forecast reports

### Task Types

```
CODE_REVIEW, CODE_GENERATION, DOCUMENTATION, ANALYSIS, TESTING,
DEBUGGING, REFACTORING, RESEARCH, SUMMARIZATION, TRANSLATION, CUSTOM
```

### Complexity Levels

```
MINIMAL (0.5x)  →  LOW (0.8x)  →  MEDIUM (1.2x)  →  HIGH (1.8x)  →  CRITICAL (2.5x)
```

### Quick Start

```python
from token_usage_forecaster import TokenForecaster, TaskType, ComplexityLevel

# Initialize with budget
forecaster = TokenForecaster(budget_tokens=1_000_000)

# Estimate single task
estimate = forecaster.estimate_single_task(
    task_type=TaskType.CODE_GENERATION,
    complexity=ComplexityLevel.MEDIUM,
    file_count=5,
    codebase_size_kb=500
)
print(f"Tokens: {estimate.total_tokens}")

# Multi-task forecast
tasks = [
    (TaskType.CODE_REVIEW, ComplexityLevel.MEDIUM, {"file_count": 3}),
    (TaskType.REFACTORING, ComplexityLevel.HIGH, {"file_count": 8}),
]
total, estimates, summary = forecaster.forecast_multi_task(tasks, contingency_percent=20)

# Check budget constraints
alert = forecaster.check_budget(tokens_needed=50_000, tokens_used=40_000)
if alert:
    print(f"Alert: {alert.message}")

# Record actual usage for calibration
forecaster.record_actual_usage(
    task_type=TaskType.CODE_GENERATION,
    input_tokens=1050,
    output_tokens=1200,
    complexity=ComplexityLevel.MEDIUM
)

# Generate report
forecaster.export_forecast_report("/path/to/report.json")
```

### API Reference

#### `TokenForecaster`

**Constructor:**
- `__init__(budget_tokens: int = 1_000_000)` - Initialize with available token budget

**Core Methods:**
- `estimate_single_task(task_type, complexity, file_count, codebase_size_kb, custom_input_tokens)` → `TokenEstimate`
- `forecast_multi_task(tasks, contingency_percent)` → `(total_tokens, estimates_list, summary_dict)`
- `check_budget(tokens_needed, tokens_used, threshold_warning, threshold_critical)` → `Optional[BudgetAlert]`
- `record_actual_usage(task_type, input_tokens, output_tokens, complexity, metadata)` → `None`
- `accuracy_vs_forecast()` → `Dict` - Compare predictions vs actuals
- `export_forecast_report(filepath)` → `str` - Generate JSON report

#### `TokenEstimate` (dataclass)

- `base_tokens`: Unadjusted cost for task type
- `prompt_overhead`: System message and framing tokens
- `response_tokens`: Expected output tokens
- `total_tokens`: Sum of all token costs
- `confidence`: 0.0-1.0 reliability estimate
- `breakdown`: Dict with detailed cost components

#### `BudgetAlert` (dataclass)

- `alert_type`: "warning", "critical", or "exceeded"
- `current_tokens`: Projected total usage
- `budget_tokens`: Available budget
- `remaining_tokens`: Surplus or deficit
- `percentage_used`: Budget consumption %
- `message`: Human-readable alert text

### Base Token Costs (Empirical)

| Task Type | Base Cost |
|-----------|-----------|
| Code Review | 800 |
| Code Generation | 1,200 |
| Documentation | 600 |
| Analysis | 1,000 |
| Testing | 900 |
| Debugging | 1,400 |
| Refactoring | 1,100 |
| Research | 1,500 |
| Summarization | 400 |
| Translation | 800 |
| Custom | 1,000 |

### Output Token Ratios

Expected output / input ratio varies by task. Code generation is more verbose (1.5x), while summarization is concise (0.3x).

### Scaling Factors

- **File count**: Logarithmic scale (~150 tokens per log2 increment)
- **Codebase size**: ~10% increase per 1000 KB
- **Complexity**: Linear multiplier (0.5x to 2.5x)
- **Contingency**: Automatic buffer (default 15%)

### Example Report Output

```json
{
  "generated_at": "2026-06-22T10:30:45.123456",
  "budget_tokens": 1000000,
  "forecasts_count": 5,
  "history_records": 12,
  "accuracy_analysis": {
    "code_generation": {
      "avg_actual": 2850,
      "forecast": 1200,
      "error_percent": 137.5,
      "samples": 3
    }
  },
  "history_summary": {
    "total_tokens_recorded": 45230,
    "avg_tokens_per_task": 3769
  }
}
```

### Integration with Claude Code Workflows

Use TokenForecaster in workflows to:
1. Gate task execution on budget availability
2. Adjust task complexity dynamically based on remaining tokens
3. Aggregate forecasts across multi-agent workflows
4. Generate pre-execution cost estimates for user approval
5. Post-mortem analysis of token efficiency

### Calibration

The model improves over time by comparing forecasts vs actuals. After ~20-30 real tasks per category, accuracy stabilizes to ±20% for most task types.

To recalibrate: call `accuracy_vs_forecast()` and adjust weights in `BASE_COSTS` and `OUTPUT_RATIOS` dicts.
