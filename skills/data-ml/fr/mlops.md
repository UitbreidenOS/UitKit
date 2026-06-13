# MLOps

## Quand activer
Configuration de pipelines ML end-to-end, déploiement ou service de modèles entraînés, configuration du suivi d'expériences avec MLflow ou Weights & Biases, construction de registres de modèles avec workflows de promotion staging-vers-production, implémentation de surveillance de dérive, rédaction de pipelines CI/CD pour charges de travail ML, ou gestion du versioning de données avec DVC.

## Quand ne PAS utiliser
Scripting Python général sans rapport avec les workflows ML. Construction de pipelines d'ingénierie de données sans modèle (utiliser `dbt-data-pipelines.md` ou `spark.md`). Exploration de notebook ad hoc sans cible de déploiement. Frontend ou travail API qui consomme simplement un endpoint de modèle.

## Instructions

### Suivi d'expériences avec MLflow

Activer autologging en haut du script d'entraînement — il capture les paramètres, les métriques, et l'artefact du modèle automatiquement :

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

Enregistrer le modèle avec une signature pour que le registre applique la forme d'entrée :

```python
from mlflow.models.signature import infer_signature

signature = infer_signature(X_train, model.predict(X_train))
mlflow.sklearn.log_model(model, "model", signature=signature)
```

### Registre de modèles : promotion Staging → Production

Enregistrer le modèle d'une exécution et le déplacer entre les étapes :

```python
client = mlflow.MlflowClient()
result = mlflow.register_model(f"runs:/{run_id}/model", "fraud-detector")

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

### Portails d'évaluation

Portail de promotion sur seuils durs avant de toucher le registre :

```python
ACCURACY_THRESHOLD = 0.92
BIAS_MAX_DISPARITY = 0.05
LATENCY_P99_MS = 200

assert accuracy >= ACCURACY_THRESHOLD, f"Accuracy below threshold"
assert max_demographic_disparity <= BIAS_MAX_DISPARITY, "Bias check failed"

import time, numpy as np
latencies = []
for _ in range(200):
    t0 = time.perf_counter()
    ort_session.run(None, {"input": sample_batch})
    latencies.append((time.perf_counter() - t0) * 1000)
assert np.percentile(latencies, 99) < LATENCY_P99_MS, "p99 latency gate failed"
```

### Export ONNX pour service (accélération 2-4x)

```python
import torch.onnx

torch.onnx.export(
    model,
    dummy_input,
    "model.onnx",
    input_names=["input"],
    output_names=["output"],
    dynamic_axes={"input": {0: "batch_size"}},
    opset_version=17,
)

# Quantization INT8
from onnxruntime.quantization import quantize_dynamic, QuantType
quantize_dynamic("model.onnx", "model_int8.onnx", weight_type=QuantType.QInt8)
```

### Service de modèle avec FastAPI

Charger le modèle une fois au démarrage, pas à chaque demande :

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

### Détection de dérive

Dérive de distribution d'entrée via test KS — exécuter quotidiennement sur une fenêtre de référence :

```python
from scipy.stats import ks_2samp

DRIFT_THRESHOLD = 0.05

for feature in numeric_features:
    stat, p_value = ks_2samp(reference[feature], current[feature])
    if p_value < DRIFT_THRESHOLD:
        alert(f"Input drift detected on {feature}: p={p_value:.4f}")
```

Dérive de concept via dégradation des performances — si la précision roulante baisse 3+ points sous la ligne de base, redéclencher l'entraînement.

### Versioning de données DVC

```bash
dvc init
dvc remote add -d s3remote s3://my-bucket/dvc-cache

# Track dataset
dvc add data/train.parquet
git add data/train.parquet.dvc .gitignore
git commit -m "track training dataset v1"

# Reproduce pipeline
dvc repro
```

### Pipeline ML CI GitHub Actions

```yaml
name: ML CI
on: [push]
jobs:
  ml-pipeline:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Train on sample
        run: python train.py --sample-fraction 0.1 --run-name ci-${{ github.sha }}
      - name: Evaluate and gate
        run: python evaluate.py --fail-below-threshold
      - name: Promote to Staging
        if: github.ref == 'refs/heads/main'
        run: python promote.py --stage Staging
```

Utilisez les builds multi-étapes Docker — l'étape de construction installe les dépendances lourdes, l'étape finale copie seulement le virtualenv :

```dockerfile
FROM python:3.12-slim AS builder
RUN pip install --prefix=/install -r requirements.txt

FROM python:3.12-slim
COPY --from=builder /install /usr/local
COPY src/ /app/src/
CMD ["uvicorn", "app.main:app"]
```

## Exemple

Configuration de MLflow tracking pour un modèle de classification binaire avec workflow de promotion staging-vers-production gaté sur la précision et la latence p99, déclenché à partir de GitHub Actions CI sur merge vers main.

1. Envelopper l'entraînement dans `mlflow.start_run()` avec `autolog()` et enregistrer une métrique `val_f1_macro` personnalisée.
2. Exporter vers ONNX et exécuter le benchmark de latence (200 samples, assert p99 < 200ms).
3. Appeler `transition_model_version_stage` pour `Staging` à partir de l'étape d'évaluation CI.
4. Sur passage du portail, transitionner vers `Production` avec `archive_existing_versions=True`.
5. Le job GitHub Actions `ml-pipeline` échoue rapidement si l'un des portails de précision ou de latence n'est pas respecté — bloquant la fusion de promouvoir un modèle dégradé.

---
