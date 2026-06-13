# MLOps

## Wanneer activeren
Instellen van ML pipelines end-to-end, deployen of serveren van trained models, configureren van experiment tracking met MLflow of Weights & Biases, bouwen van model registries met staging-to-production promotion workflows, implementeren van drift monitoring, schrijven van CI/CD pipelines voor ML workloads, of beheren van data versioning met DVC.

## Wanneer NIET gebruiken
Algemene Python scripting unrelated aan ML workflows. Data engineering pipelines zonder model involved. Ad hoc notebook exploration zonder deployment target.

## Instructies

### Experiment Tracking with MLflow

Enable autologging aan top van training script — het captured parameters, metrics, en model artifact automatisch:

```python
import mlflow
import mlflow.sklearn

mlflow.set_experiment("fraud-detection-v2")

with mlflow.start_run():
    mlflow.autolog()
    model.fit(X_train, y_train)

    # Custom metrics op top van autolog
    mlflow.log_metric("val_f1_macro", f1_score(y_val, preds, average="macro"))
    mlflow.log_artifact("reports/confusion_matrix.png")
```

Log model met signature zodat registry input shape enforceert:

```python
from mlflow.models.signature import infer_signature

signature = infer_signature(X_train, model.predict(X_train))
mlflow.sklearn.log_model(model, "model", signature=signature)
```

### Model Registry: Staging → Production Promotion

Register run's model en move het door stages:

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

Gate promotion op hard thresholds voordat registry touch:

```python
ACCURACY_THRESHOLD = 0.92
BIAS_MAX_DISPARITY = 0.05
LATENCY_P99_MS = 200

assert accuracy >= ACCURACY_THRESHOLD, f"Accuracy {accuracy} below threshold"
assert max_demographic_disparity <= BIAS_MAX_DISPARITY, "Bias check failed"
```

### ONNX Export for Serving

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

### Drift Detection

Input distribution drift via KS test:

```python
from scipy.stats import ks_2samp

DRIFT_THRESHOLD = 0.05

for feature in numeric_features:
    stat, p_value = ks_2samp(reference[feature], current[feature])
    if p_value < DRIFT_THRESHOLD:
        alert(f"Input drift detected on {feature}: p={p_value:.4f}")
```

---
