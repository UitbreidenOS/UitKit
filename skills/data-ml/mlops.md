---
name: mlops
updated: 2026-06-13
---

# MLOps

## When to activate
Setting up ML pipelines end-to-end, deploying or serving trained models, configuring experiment tracking with MLflow or Weights & Biases, building model registries with staging-to-production promotion workflows, implementing drift monitoring, writing CI/CD pipelines for ML workloads, or managing data versioning with DVC.

## When NOT to use
General Python scripting unrelated to ML workflows. Building data engineering pipelines without a model involved (use `dbt-data-pipelines.md` or `spark.md`). Ad hoc notebook exploration without a deployment target. Frontend or API work that happens to consume a model endpoint.

## Instructions

### Experiment Tracking with MLflow

Enable autologging at the top of the training script — it captures parameters, metrics, and the model artifact automatically:

```python
import mlflow
import mlflow.sklearn  # or mlflow.pytorch, mlflow.tensorflow

mlflow.set_experiment("fraud-detection-v2")

with mlflow.start_run():
    mlflow.autolog()
    model.fit(X_train, y_train)

    # Custom metrics on top of autolog
    mlflow.log_metric("val_f1_macro", f1_score(y_val, preds, average="macro"))
    mlflow.log_artifact("reports/confusion_matrix.png")
```

Log the model with a signature so the registry enforces input shape:

```python
from mlflow.models.signature import infer_signature

signature = infer_signature(X_train, model.predict(X_train))
mlflow.sklearn.log_model(model, "model", signature=signature)
```

### Model Registry: Staging → Production Promotion

Register a run's model and move it through stages:

```python
client = mlflow.MlflowClient()
result = mlflow.register_model(
    f"runs:/{run_id}/model",
    "fraud-detector"
)
# Transition to Staging for evaluation
client.transition_model_version_stage(
    name="fraud-detector",
    version=result.version,
    stage="Staging"
)
# After gate passes, promote to Production
client.transition_model_version_stage(
    name="fraud-detector",
    version=result.version,
    stage="Production",
    archive_existing_versions=True
)
```

### Evaluation Gates

Gate promotion on hard thresholds before touching the registry:

```python
ACCURACY_THRESHOLD = 0.92
BIAS_MAX_DISPARITY = 0.05
LATENCY_P99_MS = 200

assert accuracy >= ACCURACY_THRESHOLD, f"Accuracy {accuracy} below threshold"
assert max_demographic_disparity <= BIAS_MAX_DISPARITY, "Bias check failed"

# Latency gate — benchmark with ONNX exported model
import time, numpy as np
latencies = []
for _ in range(200):
    t0 = time.perf_counter()
    ort_session.run(None, {"input": sample_batch})
    latencies.append((time.perf_counter() - t0) * 1000)
assert np.percentile(latencies, 99) < LATENCY_P99_MS, "p99 latency gate failed"
```

### ONNX Export for Serving (2-4x speedup)

```python
import torch.onnx

torch.onnx.export(
    model,
    dummy_input,
    "model.onnx",
    input_names=["input"],
    output_names=["output"],
    dynamic_axes={"input": {0: "batch_size"}, "output": {0: "batch_size"}},
    opset_version=17,
)

# INT8 quantization — halves model size, 2x faster on CPU
from onnxruntime.quantization import quantize_dynamic, QuantType
quantize_dynamic("model.onnx", "model_int8.onnx", weight_type=QuantType.QInt8)
```

### Model Serving with FastAPI

Load the model once at startup, not on every request:

```python
from fastapi import FastAPI
from contextlib import asynccontextmanager
import onnxruntime as ort

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.session = ort.InferenceSession("model_int8.onnx")
    yield

app = FastAPI(lifespan=lifespan)

@app.post("/predict")
async def predict(payload: PredictRequest):
    inputs = preprocess(payload)
    outputs = app.state.session.run(None, {"input": inputs})
    return {"prediction": outputs[0].tolist()}
```

### Drift Detection

Input distribution drift via KS test — run daily against a reference window:

```python
from scipy.stats import ks_2samp

DRIFT_THRESHOLD = 0.05

for feature in numeric_features:
    stat, p_value = ks_2samp(reference[feature], current[feature])
    if p_value < DRIFT_THRESHOLD:
        alert(f"Input drift detected on {feature}: p={p_value:.4f}")
```

Concept drift via performance decay — if rolling accuracy drops 3+ points below baseline, retrigger training.

### DVC Data Versioning

```bash
dvc init
dvc remote add -d s3remote s3://my-bucket/dvc-cache

# Track dataset
dvc add data/train.parquet
git add data/train.parquet.dvc .gitignore
git commit -m "track training dataset v1"

# Reproduce pipeline
dvc repro   # runs dvc.yaml stages only if inputs changed
```

### GitHub Actions ML CI Pipeline

```yaml
name: ML CI
on: [push]
jobs:
  ml-pipeline:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Lint
        run: ruff check .
      - name: Unit tests
        run: pytest tests/unit
      - name: Train on sample
        run: python train.py --sample-fraction 0.1 --run-name ci-${{ github.sha }}
      - name: Evaluate and gate
        run: python evaluate.py --fail-below-threshold
      - name: Promote to Staging
        if: github.ref == 'refs/heads/main'
        run: python promote.py --stage Staging
```

Use Docker multi-stage builds for ML images — build stage installs heavy deps, final stage copies only the virtualenv:

```dockerfile
FROM python:3.12-slim AS builder
RUN pip install --prefix=/install -r requirements.txt

FROM python:3.12-slim
COPY --from=builder /install /usr/local
COPY src/ /app/src/
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
```

## Example

Set up MLflow tracking for a binary classification model with a staging-to-production promotion workflow gated on accuracy and p99 latency, triggered from GitHub Actions CI on merge to main.

1. Wrap training in `mlflow.start_run()` with `autolog()` and log a custom `val_f1_macro` metric.
2. Export to ONNX and run the latency benchmark (200 samples, assert p99 < 200ms).
3. Call `transition_model_version_stage` to `Staging` from the CI evaluate step.
4. On gate pass, transition to `Production` with `archive_existing_versions=True`.
5. The `ml-pipeline` GitHub Actions job fails fast if either the accuracy or latency gate is not met — blocking the merge from promoting a degraded model.

---
