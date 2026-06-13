---
name: mlflow
description: "MLflow experiment tracking, model registry, artifact logging, model serving, multi-run comparison, sklearn/PyTorch integration"
updated: 2026-06-13
---

# MLflow Skill

## When to activate
- Tracking machine learning experiments (parameters, metrics, artifacts)
- Logging models to the MLflow Model Registry
- Comparing runs across hyperparameter sweeps
- Serving a registered model as a REST endpoint
- Setting up MLflow Tracking Server with PostgreSQL backend and S3 artifact store
- Integrating MLflow with scikit-learn, PyTorch, TensorFlow, or XGBoost autolog
- Implementing model lifecycle management (staging, production, archiving)

## When NOT to use
- Feature store operations — use Feast or Tecton directly
- Data pipeline orchestration — use Airflow, Dagster, or Prefect
- Real-time model inference at scale — use Triton, BentoML, or Ray Serve
- Experiment tracking without ML models — use Weights & Biases or Neptune

## Instructions

### Project structure
```
ml_project/
├── mlflow_setup.py              # Tracking server config + artifact store
├── experiments/
│   ├── train.py                 # Training script with MLflow logging
│   ├── evaluate.py              # Evaluation with metric logging
│   └── hyperparameter_sweep.py  # Multi-run experiments
├── models/
│   └── model.py                 # Model class with mlflow.pyfunc wrapper
├── serving/
│   └── serve.py                 # Model serving setup
└── requirements.txt
```

### Setting up MLflow tracking
```python
import mlflow
import mlflow.sklearn
from mlflow.tracking import MlflowClient

# Local tracking (dev)
mlflow.set_tracking_uri("sqlite:///mlflow.db")

# Remote tracking server
mlflow.set_tracking_uri("http://mlflow-server:5000")

# With S3 artifact store
mlflow.set_tracking_uri("http://mlflow-server:5000")
# Artifacts auto-route to S3 via server config

client = MlflowClient()
```

### Experiment and run lifecycle
```python
import mlflow
import mlflow.sklearn
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, f1_score

# Create or get experiment
experiment = mlflow.set_experiment("fraud-detection-v2")

with mlflow.start_run(run_name="rf-baseline") as run:
    # Log hyperparameters
    params = {"n_estimators": 100, "max_depth": 5, "min_samples_split": 10}
    mlflow.log_params(params)

    # Train
    model = RandomForestClassifier(**params)
    model.fit(X_train, y_train)

    # Log metrics
    preds = model.predict(X_test)
    mlflow.log_metrics({
        "accuracy": accuracy_score(y_test, preds),
        "f1": f1_score(y_test, preds, average="weighted"),
    })

    # Log model — auto-generates MLmodel file, conda.yaml, requirements.txt
    mlflow.sklearn.log_model(
        sk_model=model,
        artifact_path="model",
        registered_model_name="fraud-detector",
        input_example=X_train[:5],
        signature=mlflow.models.infer_signature(X_train, preds),
    )

    # Log artifacts
    mlflow.log_artifact("reports/confusion_matrix.png")
    mlflow.log_dict({"feature_importance": dict(zip(feature_names, model.feature_importances_.tolist()))}, "feature_importance.json")

    print(f"Run ID: {run.info.run_id}")
```

### Autolog — zero-code tracking
```python
# scikit-learn: logs params, metrics, model, and feature importance
mlflow.sklearn.autolog()

# PyTorch Lightning: logs epoch metrics, model checkpoints
mlflow.pytorch.autolog()

# XGBoost: logs booster params + eval metrics per round
mlflow.xgboost.autolog()

# Disable specific auto-logged items
mlflow.sklearn.autolog(log_models=False, log_input_examples=False)
```

### Model Registry lifecycle
```python
client = MlflowClient()

# Transition model version to Staging
client.transition_model_version_stage(
    name="fraud-detector",
    version=3,
    stage="Staging",
    archive_existing_versions=False,
)

# Promote to Production after validation
client.transition_model_version_stage(
    name="fraud-detector",
    version=3,
    stage="Production",
    archive_existing_versions=True,  # Archive old Production version
)

# Add description and tags
client.update_model_version(
    name="fraud-detector",
    version=3,
    description="Trained on 2026-Q1 data. F1=0.94 on holdout.",
)
client.set_model_version_tag("fraud-detector", 3, "validated_by", "alice@company.com")
```

### Loading and serving registered models
```python
# Load by stage — always gets current Production
model = mlflow.sklearn.load_model("models:/fraud-detector/Production")

# Load specific version
model = mlflow.sklearn.load_model("models:/fraud-detector/3")

# Serve as REST endpoint (CLI)
# mlflow models serve -m "models:/fraud-detector/Production" -p 5001

# Programmatic inference via REST
import requests
response = requests.post(
    "http://localhost:5001/invocations",
    json={"dataframe_split": {"columns": feature_names, "data": X_test[:5].tolist()}},
)
predictions = response.json()["predictions"]
```

### Hyperparameter search with nested runs
```python
import optuna
import mlflow

def objective(trial):
    params = {
        "n_estimators": trial.suggest_int("n_estimators", 50, 300),
        "max_depth": trial.suggest_int("max_depth", 3, 10),
        "learning_rate": trial.suggest_float("learning_rate", 1e-4, 0.3, log=True),
    }

    with mlflow.start_run(nested=True, run_name=f"trial-{trial.number}"):
        mlflow.log_params(params)
        model = train_model(params)
        f1 = evaluate_model(model)
        mlflow.log_metric("f1", f1)
        return f1

with mlflow.start_run(run_name="optuna-sweep"):
    mlflow.log_param("n_trials", 50)
    study = optuna.create_study(direction="maximize")
    study.optimize(objective, n_trials=50)
    mlflow.log_metric("best_f1", study.best_value)
    mlflow.log_params(study.best_params)
```

### Custom pyfunc model (non-standard frameworks)
```python
class FeatureEngineeringModel(mlflow.pyfunc.PythonModel):
    def load_context(self, context):
        import pickle
        with open(context.artifacts["preprocessor"], "rb") as f:
            self.preprocessor = pickle.load(f)
        self.model = mlflow.sklearn.load_model(context.artifacts["model"])

    def predict(self, context, model_input):
        features = self.preprocessor.transform(model_input)
        return self.model.predict(features)

# Log
mlflow.pyfunc.log_model(
    artifact_path="pipeline",
    python_model=FeatureEngineeringModel(),
    artifacts={
        "preprocessor": "preprocessor.pkl",
        "model": mlflow.get_artifact_uri("model"),
    },
    registered_model_name="fraud-detector-pipeline",
)
```

### Tracking server with PostgreSQL + S3 (production setup)
```bash
# Install
pip install mlflow[extras] psycopg2-binary boto3

# Start server
mlflow server \
  --backend-store-uri postgresql://user:pass@postgres:5432/mlflow \
  --default-artifact-root s3://your-bucket/mlflow-artifacts \
  --host 0.0.0.0 \
  --port 5000
```

## Example

**User:** Train a RandomForest classifier for churn prediction, log all hyperparameters and metrics to MLflow, register the best model, and promote it to Production if F1 > 0.85.

**Expected output:**
- `train.py` — `with mlflow.start_run()` block logging params, metrics, model with signature
- `register.py` — uses `MlflowClient` to check F1, transition to Staging then Production if threshold met
- `serve.py` — loads `models:/churn-predictor/Production` and wraps it in a FastAPI endpoint
- Experiment name: `churn-prediction`, registered model: `churn-predictor`

---
