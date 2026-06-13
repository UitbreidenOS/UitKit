# MLOps

## Cuándo activar
Configuración de tuberías ML end-to-end, despliegue o servicio de modelos entrenados, configuración de experiment tracking con MLflow o Weights & Biases, construcción de registros de modelos con flujos de trabajo de promoción staging-to-production, implementación de monitoreo de drift, escritura de tuberías CI/CD para cargas de trabajo ML, o gestión de versionado de datos con DVC.

## Cuándo NO usar
Scripting Python general no relacionado con flujos de trabajo ML. Construcción de tuberías de ingeniería de datos sin modelo involucrado. Exploración ad hoc en notebooks sin target de despliegue.

## Instrucciones

### Experiment Tracking con MLflow

Habilitar autologging en la parte superior del script de entrenamiento — captura parámetros, métricas, y artefacto del modelo automáticamente:

```python
import mlflow
import mlflow.sklearn

mlflow.set_experiment("fraud-detection-v2")

with mlflow.start_run():
    mlflow.autolog()
    model.fit(X_train, y_train)

    mlflow.log_metric("val_f1_macro", f1_score(y_val, preds, average="macro"))
    mlflow.log_artifact("reports/confusion_matrix.png")
```

Registrar el modelo con una firma para que el registro enforce forma de entrada:

```python
from mlflow.models.signature import infer_signature

signature = infer_signature(X_train, model.predict(X_train))
mlflow.sklearn.log_model(model, "model", signature=signature)
```

### Model Registry: Promoción Staging → Production

Registrar el modelo de una ejecución y moverlo a través de etapas:

```python
client = mlflow.MlflowClient()
result = mlflow.register_model(
    f"runs:/{run_id}/model",
    "fraud-detector"
)

client.transition_model_version_stage(
    name="fraud-detector",
    version=result.version,
    stage="Staging"
)

client.transition_model_version_stage(
    name="fraud-detector",
    version=result.version,
    stage="Production",
    archive_existing_versions=True
)
```

### Puertas de Evaluación

Puerta de promoción en umbrales duros antes de tocar el registro:

```python
ACCURACY_THRESHOLD = 0.92
BIAS_MAX_DISPARITY = 0.05
LATENCY_P99_MS = 200

assert accuracy >= ACCURACY_THRESHOLD
assert max_demographic_disparity <= BIAS_MAX_DISPARITY

# Latency gate con modelo ONNX exportado
import time, numpy as np
latencies = []
for _ in range(200):
    t0 = time.perf_counter()
    ort_session.run(None, {"input": sample_batch})
    latencies.append((time.perf_counter() - t0) * 1000)
assert np.percentile(latencies, 99) < LATENCY_P99_MS
```

### Exportación ONNX para Servicio

```python
import torch.onnx

torch.onnx.export(
    model,
    dummy_input,
    "model.onnx",
    input_names=["input"],
    output_names=["output"],
    opset_version=17,
)

# Cuantización INT8
from onnxruntime.quantization import quantize_dynamic, QuantType
quantize_dynamic("model.onnx", "model_int8.onnx", weight_type=QuantType.QInt8)
```

### Servicio de Modelos con FastAPI

Cargar el modelo una sola vez al inicio, no en cada solicitud:

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

### Detección de Drift

Drift de distribución de entrada vía test KS — ejecutar diariamente contra ventana de referencia:

```python
from scipy.stats import ks_2samp

DRIFT_THRESHOLD = 0.05

for feature in numeric_features:
    stat, p_value = ks_2samp(reference[feature], current[feature])
    if p_value < DRIFT_THRESHOLD:
        alert(f"Input drift detected on {feature}: p={p_value:.4f}")
```

Concept drift vía decaimiento de rendimiento — si accuracy rolling cae 3+ puntos por debajo de baseline, retrigger entrenamiento.

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
        run: python train.py --sample-fraction 0.1
      - name: Evaluate and gate
        run: python evaluate.py --fail-below-threshold
      - name: Promote to Staging
        if: github.ref == 'refs/heads/main'
        run: python promote.py --stage Staging
```

## Ejemplo

Configurar MLflow tracking para modelo de clasificación binaria con flujo de trabajo de promoción staging-to-production gated en accuracy y p99 latencia:

1. Envolver entrenamiento en `mlflow.start_run()` con `autolog()` y log de métrica custom.
2. Exportar a ONNX y ejecutar benchmark de latencia (200 samples, assert p99 < 200ms).
3. Llamar `transition_model_version_stage` a `Staging` desde CI evaluate step.
4. En gate pass, transicionar a `Production` con `archive_existing_versions=True`.

---
