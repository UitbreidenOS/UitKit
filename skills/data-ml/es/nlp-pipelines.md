# Tuberías NLP

## Cuándo activar
Construcción de tuberías de procesamiento de lenguaje natural (NLP), tokenización y embeddings, extracción de información, clasificación de documentos, análisis de sentimiento, o construcción de aplicaciones basadas en transformers como búsqueda semántica o generación de texto.

## Cuándo NO usar
Análisis de datos general sin componentes NLP. Aplicaciones de chat genéricas que no requieren procesamiento lingüístico sofisticado.

## Instrucciones

### Tokenización y Embeddings

Usar `transformers` library para carga de modelos y tokenización:

```python
from transformers import AutoTokenizer, AutoModel
import torch

model_name = "sentence-transformers/all-MiniLM-L6-v2"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModel.from_pretrained(model_name)

text = "This is a sample text"
tokens = tokenizer(text, return_tensors="pt")
embeddings = model(**tokens)
```

### Clasificación de Documentos

```python
from transformers import pipeline

classifier = pipeline("zero-shot-classification", 
    model="facebook/bart-large-mnli")

result = classifier(
    "This product is amazing!",
    ["positive", "negative", "neutral"]
)
```

### Extracción de Información

```python
from transformers import pipeline

ner = pipeline("ner", model="dbmdz/bert-base-german-cased")
results = ner("Mi nombre es Wolfgang y vivo en Berlín")
```

---
