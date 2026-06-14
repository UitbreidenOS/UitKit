---
name: modal
description: Build serverless AI pipelines with Modal for cloud-based compute and inference
updated: 2026-06-13
---

# Modal

## When to activate
- User is deploying ML/AI workloads to Modal (modal.com)
- Code imports `modal` or references `@app.function`, `@app.cls`, `Stub`, `App`
- User needs serverless GPU compute for inference, fine-tuning, or batch ML jobs
- User asks about cold starts, GPU selection, model weight caching, or streaming inference on Modal
- User is building a web endpoint or scheduled job backed by GPU compute

## When NOT to use
- User is deploying to a different serverless GPU platform (RunPod, Lambda Labs, Replicate, Banana)
- Task is CPU-only and has no ML workload — use standard serverless (Lambda, Cloud Run)
- User already has a managed inference endpoint (OpenAI, Anthropic, Together) and just needs an API call
- The question is about ML model architecture, not infrastructure

## Instructions

### App and Image setup

Modal's entry point is an `App` (formerly `Stub`). Every deployed function belongs to one.

```python
import modal

app = modal.App("my-inference-app")

# Build a custom image — do this once, it is cached layer by layer
image = (
    modal.Image.debian_slim(python_version="3.11")
    .pip_install(["torch", "transformers", "accelerate", "vllm"])
    .env({"HF_HUB_ENABLE_HF_TRANSFER": "1"})
)
```

Build heavy dependencies into the image, not at function startup. Each `.pip_install()` call is a separate Docker layer and is cached independently.

### GPU selection

| GPU | VRAM | Use when |
|-----|------|----------|
| T4 | 16 GB | Dev/testing, small models (≤7B at fp16), cost-sensitive |
| A10G | 24 GB | Production inference, 7–13B models, best price/performance |
| A100-40GB | 40 GB | 13–30B models, fine-tuning ≤13B, batch throughput |
| A100-80GB | 80 GB | 30–70B models, full fine-tuning of 13B+ |
| H100 | 80 GB | Maximum throughput, largest models, multi-node training |

```python
@app.function(gpu="A10G", image=image)
def run_inference(prompt: str) -> str:
    ...

# Request a specific count
@app.function(gpu=modal.gpu.A100(count=2))
def multi_gpu_job():
    ...
```

### Cold start optimization

Cold starts on GPU instances are dominated by model weight loading, not container spin-up.

```python
# keep_warm holds N containers alive — eliminates cold starts, billed continuously
@app.function(gpu="A10G", keep_warm=1, image=image)
def fast_inference(prompt: str) -> str:
    ...

# container_idle_timeout keeps a container alive N seconds after last request
# Good middle ground: reduces cold starts without keep_warm cost
@app.function(gpu="A10G", container_idle_timeout=300, image=image)
def balanced_inference(prompt: str) -> str:
    ...
```

Use `@app.cls` with `@modal.enter()` to load models once per container lifecycle:

```python
@app.cls(gpu="A10G", image=image, container_idle_timeout=300)
class InferenceModel:
    @modal.enter()
    def load(self):
        from transformers import pipeline
        self.pipe = pipeline("text-generation", model="mistralai/Mistral-7B-v0.1")

    @modal.method()
    def generate(self, prompt: str) -> str:
        return self.pipe(prompt, max_new_tokens=256)[0]["generated_text"]
```

### Volumes for model weights

Never download model weights at function runtime — store them in a Modal Volume.

```python
model_volume = modal.Volume.from_name("model-weights", create_if_missing=True)

@app.function(
    gpu="A10G",
    image=image,
    volumes={"/models": model_volume},
)
def download_model():
    from huggingface_hub import snapshot_download
    snapshot_download("mistralai/Mistral-7B-v0.1", local_dir="/models/mistral-7b")
    model_volume.commit()  # persist writes

@app.function(gpu="A10G", image=image, volumes={"/models": model_volume})
def inference(prompt: str) -> str:
    from transformers import pipeline
    pipe = pipeline("text-generation", model="/models/mistral-7b")
    return pipe(prompt)[0]["generated_text"]
```

### Secrets management

```python
# Create secret in Modal dashboard, reference by name
hf_secret = modal.Secret.from_name("huggingface-token")

@app.function(gpu="A10G", image=image, secrets=[hf_secret])
def download_gated_model():
    import os
    token = os.environ["HF_TOKEN"]  # key set in Modal secret
    ...
```

### Scheduled functions

```python
from modal import Period

@app.function(schedule=Period(hours=6))
def refresh_embeddings():
    # Runs every 6 hours — no cron syntax needed
    ...

# Cron syntax is also supported
@app.function(schedule=modal.Cron("0 2 * * *"))
def nightly_batch():
    ...
```

### Web endpoints

```python
@app.function(gpu="A10G", image=image, allow_concurrent_inputs=10)
@modal.web_endpoint(method="POST")
def serve(request: dict) -> dict:
    result = model.generate(request["prompt"])
    return {"text": result}
```

`allow_concurrent_inputs` lets one container handle N simultaneous requests — critical for throughput on long-running inference. Without it, each request gets its own container.

For full ASGI apps:

```python
@app.function(gpu="A10G", image=image)
@modal.asgi_app()
def fastapi_app():
    from api import app as fastapi_app  # your FastAPI app
    return fastapi_app
```

### Mounting local code

```python
local_mount = modal.Mount.from_local_dir(
    "./src",
    remote_path="/root/src",
)

@app.function(mounts=[local_mount], image=image)
def run_local_code():
    import sys
    sys.path.insert(0, "/root/src")
    from my_module import process
    process()
```

### Streaming inference

Use `yield` to stream tokens back to the caller:

```python
@app.function(gpu="A10G", image=image)
def stream_tokens(prompt: str):
    from vllm import LLM, SamplingParams
    llm = LLM(model="/models/mistral-7b")
    params = SamplingParams(temperature=0.7, max_tokens=512)
    for output in llm.generate([prompt], params, use_tqdm=False):
        for token in output.outputs[0].text:
            yield token

# Caller iterates the generator
for chunk in stream_tokens.remote_gen("Tell me about GPUs"):
    print(chunk, end="", flush=True)
```

### Fine-tuning pattern

```python
@app.function(
    gpu=modal.gpu.A100(memory=80),
    image=image,
    volumes={"/models": model_volume, "/checkpoints": checkpoint_volume},
    timeout=3600 * 8,  # 8-hour max for long training runs
)
def finetune(config: dict):
    from transformers import Trainer, TrainingArguments
    # ... load dataset, model, run Trainer
    trainer.train()
    trainer.save_model("/checkpoints/finetuned")
    checkpoint_volume.commit()
```

Set `timeout` explicitly for long jobs — the default is 300 seconds.

### Cost model

- Billed per second of GPU time — no idle cost when containers are stopped
- Free tier: $30/month of compute credit
- A10G: ~$1.10/hr; A100-40GB: ~$3.00/hr; H100: ~$7.00/hr (approximate, check modal.com/pricing)
- `keep_warm=1` on an A10G costs ~$26/day — only use for latency-critical prod endpoints
- Prefer `container_idle_timeout` (pay only when traffic exists) over `keep_warm` for most workloads

## Example

Deploying a vLLM inference endpoint on Modal with streaming and web API:

```python
import modal

app = modal.App("vllm-endpoint")

model_volume = modal.Volume.from_name("vllm-weights", create_if_missing=True)
hf_secret = modal.Secret.from_name("huggingface-token")

image = (
    modal.Image.debian_slim(python_version="3.11")
    .pip_install(["vllm==0.4.0", "huggingface_hub[hf_transfer]", "fastapi"])
    .env({"HF_HUB_ENABLE_HF_TRANSFER": "1"})
)

MODEL_ID = "mistralai/Mistral-7B-Instruct-v0.2"
MODEL_DIR = "/models/mistral-7b-instruct"


@app.function(
    image=image,
    gpu="A10G",
    volumes={"/models": model_volume},
    secrets=[hf_secret],
)
def download_weights():
    from huggingface_hub import snapshot_download
    import os
    snapshot_download(
        MODEL_ID,
        local_dir=MODEL_DIR,
        token=os.environ["HF_TOKEN"],
    )
    model_volume.commit()


@app.cls(
    gpu="A10G",
    image=image,
    volumes={"/models": model_volume},
    container_idle_timeout=300,
    allow_concurrent_inputs=8,
)
class VLLMEndpoint:
    @modal.enter()
    def load(self):
        from vllm import LLM, SamplingParams
        self.llm = LLM(model=MODEL_DIR, max_model_len=4096)
        self.sampling_params = SamplingParams(temperature=0.7, max_tokens=512)

    @modal.method()
    def generate(self, prompt: str) -> str:
        outputs = self.llm.generate([prompt], self.sampling_params)
        return outputs[0].outputs[0].text

    @modal.web_endpoint(method="POST")
    def api(self, request: dict) -> dict:
        return {"text": self.generate(request["prompt"])}


# Deploy: modal deploy modal_app.py
# One-off download: modal run modal_app.py::download_weights
```

Run `modal deploy modal_app.py` to publish the endpoint. Modal returns a stable HTTPS URL for the web endpoint.
