# MLOps

## Wann aktivieren
Setup von ML Pipelines End-to-End, Deployment oder Serving von trainierten Models, Konfigurierung von Experiment Tracking mit MLflow oder Weights & Biases, Aufbau von Model Registries mit Staging-to-Production Promotion Workflows, Implementierung von Drift Monitoring, Schreiben von CI/CD Pipelines für ML Workloads oder Verwaltung von Data Versioning mit DVC.

## Wann NICHT verwenden
Allgemeine Python Scripting nicht verwandt mit ML Workflows. Aufbau von Data Engineering Pipelines ohne ein Model involviert (verwenden Sie `dbt-data-pipelines.md` oder `spark.md`). Ad hoc Notebook Exploration ohne Deployment Target. Frontend oder API Arbeit, die zufällig einen Model Endpoint konsumiert.

## Anweisungen

### Experiment Tracking mit MLflow

Aktivieren Sie Autologging am Anfang des Training Scripts — es captured Parameter, Metriken und das Model Artifact automatisch:

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

Loggen Sie das Model mit einer Signature, damit die Registry Input Shape erzwingt:

```python
from mlflow.models.signature import infer_signature

signature = infer_signature(X_train, model.predict(X_train))
mlflow.sklearn.log_model(model, "model", signature=signature)
```

### Model Registry: Staging → Production Promotion

Registrieren Sie ein Run's Model und bewegen Sie es durch Stages:

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

Gate Promotion auf Hard Thresholds, bevor Sie die Registry berühren:

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

### ONNX Export für Serving (2-4x Speedup)

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

### Model Serving mit FastAPI

Laden Sie das Model einmal beim Startup, nicht auf jedem Request:

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

Input Distribution Drift via KS Test — täglich gegen Referenzfenster ausführen:

```python
from scipy.stats import ks_2samp

DRIFT_THRESHOLD = 0.05

for feature in numeric_features:
    stat, p_value = ks_2samp(reference[feature], current[feature])
    if p_value < DRIFT_THRESHOLD:
        alert(f"Input drift detected on {feature}: p={p_value:.4f}")
```

Concept Drift via Performance Decay — wenn Rolling Accuracy 3+ Punkte unter Baseline fällt, retrigger Training.

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

Verwenden Sie Docker Multi-Stage Builds für ML Images — Build Stage installiert Heavy Deps, Final Stage kopiert nur das Virtualenv:

```dockerfile
FROM python:3.12-slim AS builder
RUN pip install --prefix=/install -r requirements.txt

FROM python:3.12-slim
COPY --from=builder /install /usr/local
COPY src/ /app/src/
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
```

## Beispiel

Setup MLflow Tracking für ein Binary Classification Model mit Staging-to-Production Promotion Workflow gated auf Accuracy und p99 Latency, triggered von GitHub Actions CI auf Merge zu Main.

1. Wrapper Training in `mlflow.start_run()` mit `autolog()` und Log eine Custom `val_f1_macro` Metrik.
2. Export zu ONNX und Run das Latency Benchmark (200 Samples, assert p99 < 200ms).
3. Rufen Sie `transition_model_version_stage` zu `Staging` von dem CI Evaluate Step auf.
4. Auf Gate Pass, Transition zu `Production` mit `archive_existing_versions=True`.
5. Der `ml-pipeline` GitHub Actions Job schlägt schnell fehl, wenn entweder das Accuracy oder Latency Gate nicht erfüllt ist — blockiert den Merge vom Promoting eines Degraded Model.

---
