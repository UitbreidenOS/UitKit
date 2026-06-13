# NLP Pipelines

## Wanneer activeren
Bouwen van NLP systems end to end — text preprocessing, fine-tuning transformer models, named entity recognition (NER), text classification, sentiment analysis, multilingual models, of serveren van NLP inference. Gebruik dit wanneer taak Hugging Face Transformers, tokenization design, BIO tagging, of deployen van NLP models naar production betreffen.

## Wanneer NIET gebruiken
Pure retrieval-augmented generation of embedding search. Image/audio classification dat text output doet. Prompt engineering voor LLM chat applicaties. Eenvoudige regex-based text processing zonder learned model.

## Instructies

### Text Preprocessing

Normaliseer voordat tokenizing om vocabulary fragmentation te reduceren:

```python
import unicodedata
import re

def normalize_text(text: str) -> str:
    # NFC normalization handles accented chars, lookalike unicode
    text = unicodedata.normalize("NFC", text)
    # Collapse whitespace variants
    text = re.sub(r"\s+", " ", text).strip()
    # Remove control characters
    text = "".join(c for c in text if unicodedata.category(c)[0] != "C" or c == "\n")
    return text
```

BPE en WordPiece tokenizers (gebruikt door RoBERTa en BERT) handelen subwords automatisch — niet manually stem of lemmatize voordat text naar transformer tokenizer pass. Stemming breaks subword alignment.

### Fine-Tuning with Hugging Face Trainer API

Voor classification, gebruik `AutoModelForSequenceClassification` met correct `num_labels`:

```python
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    TrainingArguments,
    Trainer,
    DataCollatorWithPadding,
)

MODEL_ID = "xlm-roberta-base"
NUM_LABELS = 3  # positive, neutral, negative

tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
model = AutoModelForSequenceClassification.from_pretrained(
    MODEL_ID, num_labels=NUM_LABELS
)

def tokenize(batch):
    return tokenizer(batch["text"], truncation=True, max_length=512)

args = TrainingArguments(
    output_dir="./checkpoints",
    num_train_epochs=4,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=32,
    learning_rate=2e-5,
    lr_scheduler_type="cosine",
    warmup_ratio=0.06,
    gradient_accumulation_steps=2,
    fp16=True,
    eval_strategy="epoch",
    save_strategy="epoch",
    load_best_model_at_end=True,
    metric_for_best_model="f1",
)

trainer = Trainer(
    model=model,
    args=args,
    train_dataset=tokenized["train"],
    eval_dataset=tokenized["validation"],
    tokenizer=tokenizer,
    data_collator=DataCollatorWithPadding(tokenizer),
)
trainer.train()
```

### NER with BIO Tagging

BIO (Beginning / Inside / Outside) is standard tagging scheme. Elke token krijgt één label. Gebruik `AutoModelForTokenClassification`.

### Evaluation: Macro vs Micro F1

Gebruik **macro-F1** voor imbalanced datasets (meeste NLP classification tasks). Macro averages F1 per class equally ongeacht support. Micro-F1 wordt dominated door largest class.

### Multilingual: XLM-R vs mBERT

Prefer XLM-R (`xlm-roberta-base` or `xlm-roberta-large`) over mBERT voor meeste multilingual taken. XLM-R was trained op meer data, gebruikt SentencePiece BPE.

---
