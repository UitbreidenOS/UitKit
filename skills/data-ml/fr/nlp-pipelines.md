# Pipelines NLP

## Quand activer
Construction de systèmes NLP de bout en bout — prétraitement de texte, fine-tuning de modèles transformer, reconnaissance d'entités nommées (NER), classification de texte, analyse de sentiment, modèles multilingues, ou service d'inférence NLP. À utiliser quand la tâche implique Hugging Face Transformers, conception de tokenisation, ou déploiement de modèles NLP en production.

## Quand ne PAS utiliser
Génération augmentée par récupération pure ou recherche d'embeds (couverts par les compétences d'ingénierie AI). Classification image/audio qui génère du texte. Ingénierie de prompt pour applications LLM chat. Traitement de texte simple basé sur regex ne nécessitant pas de modèle appris.

## Instructions

### Prétraitement de texte

Normaliser avant la tokenisation pour réduire la fragmentation du vocabulaire :

```python
import unicodedata, re

def normalize_text(text: str) -> str:
    text = unicodedata.normalize("NFC", text)
    text = re.sub(r"\s+", " ", text).strip()
    text = "".join(c for c in text if unicodedata.category(c)[0] != "C" or c == "\n")
    return text
```

Les tokenizers BPE et WordPiece gèrent les sous-mots automatiquement — ne pas faire de stemming ou lemmatisation manuel avant de passer le texte à un tokenizer transformer. Le stemming casse l'alignement des sous-mots.

### Fine-tuning avec l'API Trainer de Hugging Face

Pour la classification, utiliser `AutoModelForSequenceClassification` avec le bon `num_labels` :

```python
from transformers import (
    AutoTokenizer, AutoModelForSequenceClassification,
    TrainingArguments, Trainer, DataCollatorWithPadding,
)
from datasets import load_dataset
import evaluate, numpy as np

MODEL_ID = "xlm-roberta-base"
NUM_LABELS = 3  # positive, neutral, negative

tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_ID, num_labels=NUM_LABELS)

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
    learning_rate=2e-5,
    lr_scheduler_type="cosine",
    warmup_ratio=0.06,
    gradient_accumulation_steps=2,
    fp16=True,
    eval_strategy="epoch",
    save_strategy="epoch",
    load_best_model_at_end=True,
    metric_for_best_model="f1",
    report_to="mlflow",
)

trainer = Trainer(
    model=model, args=args,
    train_dataset=tokenized["train"],
    eval_dataset=tokenized["validation"],
    tokenizer=tokenizer,
    data_collator=DataCollatorWithPadding(tokenizer),
    compute_metrics=compute_metrics,
)
trainer.train()
```

**Planning de taux d'apprentissage** : utiliser le cosinus avec réchauffage (`warmup_ratio=0.06`). L'accumulation de gradient : quand la mémoire GPU limite la taille du batch, accumuler les gradients sur N étapes pour simuler un batch effectif plus grand.

### NER avec étiquetage BIO

BIO (Beginning / Inside / Outside) est le schéma d'étiquetage standard. Chaque token reçoit une étiquette :

```
Token:  "Apple   Inc.    announced   a    new   iPhone"
Label:  B-ORG   I-ORG   O           O    O     B-PROD
```

Utiliser `AutoModelForTokenClassification` et aligner les étiquettes aux tokens de sous-mots :

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
                label_ids.append(-100)
            elif word_id != prev_word_id:
                label_ids.append(label_seq[word_id])
            else:
                label_ids.append(-100)
            prev_word_id = word_id
        labels_out.append(label_ids)
    tokenized["labels"] = labels_out
    return tokenized
```

Utiliser `seqeval` pour l'évaluation NER — elle calcule F1 au niveau des spans, pas au niveau des tokens.

### Évaluation : macro vs micro F1

Utiliser **macro-F1** pour les datasets déséquilibrés (la plupart des tâches de classification NLP). Macro moyenne F1 par classe également indépendamment du support, donc les classes rares ne sont pas noyées par la classe majoritaire.

### Multilingue : XLM-R vs mBERT

Préférer XLM-R (`xlm-roberta-base` ou `xlm-roberta-large`) sur mBERT pour la plupart des tâches multilingues. XLM-R a été entraîné sur plus de données (100 langues), utilise SentencePiece BPE (meilleure tokenisation bas-ressources), et surpasse systématiquement mBERT.

### Export ONNX et quantization INT8

```python
from optimum.exporters.onnx import main_export

main_export(
    model_name_or_path="./checkpoints/best",
    output="./onnx",
    task="text-classification",
    opset=17,
)

from optimum.onnxruntime import ORTQuantizer
from optimum.onnxruntime.configuration import AutoQuantizationConfig

quantizer = ORTQuantizer.from_pretrained("./onnx")
qconfig = AutoQuantizationConfig.avx512_vnni(is_static=False, per_channel=False)
quantizer.quantize(save_dir="./onnx_int8", quantization_config=qconfig)
```

### Service FastAPI avec batching asynchrone

```python
from fastapi import FastAPI
from contextlib import asynccontextmanager
import onnxruntime as ort
from transformers import AutoTokenizer
import numpy as np

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.tokenizer = AutoTokenizer.from_pretrained("xlm-roberta-base")
    app.state.session = ort.InferenceSession("onnx_int8/model.onnx")
    yield

app = FastAPI(lifespan=lifespan)

@app.post("/classify")
async def classify(texts: list[str]):
    enc = app.state.tokenizer(
        texts, return_tensors="np", padding=True,
        truncation=True, max_length=512,
    )
    logits = app.state.session.run(
        ["logits"],
        {"input_ids": enc["input_ids"], "attention_mask": enc["attention_mask"]},
    )[0]
    preds = np.argmax(logits, axis=-1).tolist()
    return {"predictions": preds}
```

## Exemple

Fine-tune XLM-R pour la classification de sentiment 3-classes multilingue (positive / neutre / négative) :

1. Normaliser et tokenizer avec tokenizer `xlm-roberta-base`, tronquer à 512 tokens.
2. Entraîner avec l'API Trainer utilisant planning de LR cosinus, `warmup_ratio=0.06`, `gradient_accumulation_steps=2`, `fp16=True`, 4 epochs.
3. Évaluer sur l'ensemble de validation — reporter macro-F1 (cible ≥ 0.82) et F1 par classe. Gater CI sur macro-F1.
4. Exporter vers ONNX avec Optimum, appliquer quantization dynamique INT8.
5. Benchmark : assert latence p99 < 150ms sur un batch de 32 phrases.
6. Servir derrière FastAPI avec tokenizer et session ORT chargés une seule fois au démarrage.

Cross-lingual zéro-shot : après fine-tuning seulement sur les données anglaises, évaluer sur les ensembles de test français et allemand pour confirmer le transfert.

---
