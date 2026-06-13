# NLP Pipelines

## Wann aktivieren
Aufbau von NLP Systemen End-to-End — Text Preprocessing, Fine-Tuning von Transformer Models, Named Entity Recognition (NER), Text Classification, Sentiment Analysis, Multilingual Models oder Serving von NLP Inference. Verwenden Sie dies, wenn die Aufgabe Hugging Face Transformers, Tokenization Design, BIO Tagging oder Deployment von NLP Models zu Production umfasst.

## Wann NICHT verwenden
Pure Retrieval-Augmented Generation oder Embedding Search (die werden in AI Engineering Skills abgedeckt). Image/Audio Classification, die zufällig Text ausgibt. Prompt Engineering für LLM Chat Anwendungen. Einfache Regex-basierte Text Processing, die kein gelernt Model erfordert.

## Anweisungen

### Text Preprocessing

Normalisieren Sie vor dem Tokenisieren, um Vocabulary Fragmentation zu reduzieren:

```python
import unicodedata
import re

def normalize_text(text: str) -> str:
    # NFC normalization handles accented chars, lookalike unicode
    text = unicodedata.normalize("NFC", text)
    # Collapse whitespace variants
    text = re.sub(r"\s+", " ", text).strip()
    # Remove control characters (keep newlines for document structure)
    text = "".join(c for c in text if unicodedata.category(c)[0] != "C" or c == "\n")
    return text
```

BPE und WordPiece Tokenizer (verwendet von RoBERTa und BERT jeweils) handhaben Subwords automatisch — stemmen oder lemmatisieren Sie nicht manuell vor dem Übergeben von Text an einen Transformer Tokenizer. Stemming bricht Subword Alignment.

### Fine-Tuning mit Hugging Face Trainer API

Für Classification verwenden Sie `AutoModelForSequenceClassification` mit der korrekten `num_labels`:

```python
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    TrainingArguments,
    Trainer,
    DataCollatorWithPadding,
)
from datasets import load_dataset
import evaluate
import numpy as np

MODEL_ID = "xlm-roberta-base"
NUM_LABELS = 3  # positive, neutral, negative

tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
model = AutoModelForSequenceClassification.from_pretrained(
    MODEL_ID, num_labels=NUM_LABELS
)

def tokenize(batch):
    return tokenizer(batch["text"], truncation=True, max_length=512)

dataset = load_dataset("csv", data_files={"train": "train.csv", "validation": "val.csv"})
tokenized = dataset.map(tokenize, batched=True)

f1_metric = evaluate.load("f1")

def compute_metrics(eval_pred):
    logits, labels = eval_pred
    preds = np.argmax(logits, axis=-1)
    return f1_metric.compute(predictions=preds, references=labels, average="macro")

args = TrainingArguments(
    output_dir="./checkpoints",
    num_train_epochs=4,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=32,
    learning_rate=2e-5,
    lr_scheduler_type="cosine",
    warmup_ratio=0.06,
    gradient_accumulation_steps=2,   # effective batch = 32
    fp16=True,
    eval_strategy="epoch",
    save_strategy="epoch",
    load_best_model_at_end=True,
    metric_for_best_model="f1",
    report_to="mlflow",
)

trainer = Trainer(
    model=model,
    args=args,
    train_dataset=tokenized["train"],
    eval_dataset=tokenized["validation"],
    tokenizer=tokenizer,
    data_collator=DataCollatorWithPadding(tokenizer),
    compute_metrics=compute_metrics,
)
trainer.train()
```

**Learning Rate Schedule**: verwenden Sie Cosine mit Warmup (`warmup_ratio=0.06`). Linear Warmup verhindert Early Loss Spikes von großen initialen Gradienten auf dem Freshly Initialized Classification Head.

**Gradient Accumulation**: wenn GPU Memory Batch Size limitiert, akkumulieren Sie Gradienten über N Steps, um eine größere Effective Batch zu simulieren. Größeres Effective Batch stabiliert normalerweise Fine-Tuning.

### NER mit BIO Tagging

BIO (Beginning / Inside / Outside) ist das Standard Tagging Scheme. Jedes Token bekommt ein Label:

```
Token:  "Apple   Inc.    announced   a    new   iPhone"
Label:  B-ORG   I-ORG   O           O    O     B-PROD
```

Verwenden Sie `AutoModelForTokenClassification` und richten Sie Labels an Subword Tokens aus (nur label das erste Subword von jedem Word):

```python
from transformers import AutoModelForTokenClassification

label2id = {"O": 0, "B-ORG": 1, "I-ORG": 2, "B-PER": 3, "I-PER": 4, "B-LOC": 5, "I-LOC": 6}

def align_labels(examples):
    tokenized = tokenizer(examples["tokens"], truncation=True,
                          is_split_into_words=True, max_length=512)
    labels_out = []
    for i, label_seq in enumerate(examples["ner_tags"]):
        word_ids = tokenized.word_ids(batch_index=i)
        prev_word_id = None
        label_ids = []
        for word_id in word_ids:
            if word_id is None:
                label_ids.append(-100)  # special tokens ignored in loss
            elif word_id != prev_word_id:
                label_ids.append(label_seq[word_id])
            else:
                label_ids.append(-100)  # subword continuation — ignore
            prev_word_id = word_id
        labels_out.append(label_ids)
    tokenized["labels"] = labels_out
    return tokenized
```

Verwenden Sie `seqeval` für NER Evaluation — es berechnet Span-Level F1, nicht Token-Level:

```python
seqeval = evaluate.load("seqeval")

def compute_ner_metrics(eval_pred):
    logits, labels = eval_pred
    preds = np.argmax(logits, axis=-1)
    true_labels = [[id2label[l] for l in label_row if l != -100]
                   for label_row in labels]
    true_preds = [[id2label[p] for p, l in zip(pred_row, label_row) if l != -100]
                  for pred_row, label_row in zip(preds, labels)]
    return seqeval.compute(predictions=true_preds, references=true_labels)
```

### Evaluation: Macro vs Micro F1

Verwenden Sie **Macro-F1** für imbalanced Datasets (die meisten NLP Classification Aufgaben). Macro mittelt F1 pro Class gleich unabhängig von Support, daher sind seltene Classes nicht von der Majority Class ertränkt. Micro-F1 wird von der größten Class dominiert und ist irreführend, wenn Class Distribution schief ist.

```python
# Macro — equal weight per class
f1_macro = f1_score(y_true, y_pred, average="macro")

# Micro — global TP/FP/FN, dominated by frequent classes
f1_micro = f1_score(y_true, y_pred, average="micro")
```

Berichten Sie beide in Model Cards; gaten Sie CI auf Macro-F1.

### Multilingual: XLM-R vs mBERT

Bevorzugen Sie XLM-R (`xlm-roberta-base` oder `xlm-roberta-large`) über mBERT für die meisten Multilingual Tasks. XLM-R wurde auf mehr Daten trainiert (100 Sprachen, Common Crawl), verwendet SentencePiece BPE (bessere Low-Resource Tokenization) und übertrifft konsistent mBERT auf XNLI, NER und QA Benchmarks. Verwenden Sie mBERT nur, wenn Sie einen bestehenden Checkpoint oder strikte Size Constraints haben.

Zero-Shot Cross-Lingual Transfer: Fine-Tune nur auf English, evaluieren Sie auf Target Languages. Funktioniert angemessen gut für Classification und NER mit XLM-R, oft 80% von Supervised Performance auf nahe verwandten Sprachen überschreitend.

### ONNX Export und INT8 Quantization

```python
from optimum.exporters.onnx import main_export

# Export with Optimum (handles dynamic axes, pooling, classification head)
main_export(
    model_name_or_path="./checkpoints/best",
    output="./onnx",
    task="text-classification",
    opset=17,
)

# INT8 quantization — halves model size, ~2x faster on CPU
from optimum.onnxruntime import ORTQuantizer
from optimum.onnxruntime.configuration import AutoQuantizationConfig

quantizer = ORTQuantizer.from_pretrained("./onnx")
qconfig = AutoQuantizationConfig.avx512_vnni(is_static=False, per_channel=False)
quantizer.quantize(save_dir="./onnx_int8", quantization_config=qconfig)
```

### FastAPI Serving mit Async Batching

Laden Sie Tokenizer und ONNX Session beim Startup; verwenden Sie eine Queue zum Batch Concurrent Requests:

```python
from fastapi import FastAPI
from contextlib import asynccontextmanager
import onnxruntime as ort
from transformers import AutoTokenizer
import asyncio, numpy as np

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.tokenizer = AutoTokenizer.from_pretrained("xlm-roberta-base")
    app.state.session = ort.InferenceSession(
        "onnx_int8/model.onnx",
        providers=["CPUExecutionProvider"],
    )
    yield

app = FastAPI(lifespan=lifespan)

@app.post("/classify")
async def classify(texts: list[str]):
    enc = app.state.tokenizer(
        texts,
        return_tensors="np",
        padding=True,
        truncation=True,
        max_length=512,
    )
    logits = app.state.session.run(
        ["logits"],
        {"input_ids": enc["input_ids"], "attention_mask": enc["attention_mask"]},
    )[0]
    preds = np.argmax(logits, axis=-1).tolist()
    return {"predictions": preds}
```

## Beispiel

Fine-Tune XLM-R für 3-Class Multilingual Sentiment Classification (Positive / Neutral / Negative):

1. Normalisieren und Tokenisieren mit `xlm-roberta-base` Tokenizer, Truncate auf 512 Tokens.
2. Train mit Trainer API mit Cosine LR Schedule, `warmup_ratio=0.06`, `gradient_accumulation_steps=2`, `fp16=True`, 4 Epochs.
3. Evaluieren auf Validation Set — Berichten Sie Macro-F1 (Target ≥ 0.82) und Per-Class F1. Gate CI auf Macro-F1.
4. Export zu ONNX mit Optimum, anwenden Sie INT8 Dynamic Quantization.
5. Benchmark: assert p99 Latency < 150ms auf einem Batch von 32 Sätzen.
6. Serve hinter FastAPI mit Tokenizer und ORT Session geladen einmal beim Startup.

Zero-Shot Cross-Lingual: nach Fine-Tuning nur auf English Daten, evaluieren Sie auf Französisch und Deutsch Test Sets, um Transfer zu bestätigen (XLM-R retains typischerweise 85%+ von English F1 auf nah verwandten Europäischen Sprachen).

---
