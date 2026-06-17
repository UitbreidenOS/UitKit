# Experiment Tracker Hook

## Purpose

Automatically track and log ML/AI experiments, model training runs, hyperparameter configurations, and results during development workflows.

## settings.json Configuration

```json
{
  "hooks": {
    "onCommandComplete": {
      "experiment-tracker": {
        "shell": "bash",
        "script": "mlai_engineer_stack/hooks/experiment-tracker.sh",
        "filter": {
          "command": ["train", "fit", "evaluate", "mlflow", "wandb"]
        }
      }
    }
  }
}
```

## Hook Behavior

This hook fires after experiment-related commands complete (training runs, model evaluation, hyperparameter tuning). It:

1. Captures experiment metadata (model, dataset, hyperparameters, metrics)
2. Logs results to a central experiment registry
3. Optionally integrates with MLflow, Weights & Biases, or similar tracking systems
4. Generates a summary report of the experiment run

## Implementation

Hook script: `mlai_engineer_stack/hooks/experiment-tracker.sh`

Status: Stub — structure defined, implementation pending
