# Claude Batch

## Quand activer
Traitement de gros volumes de prompts (10 ou plus), charges de travail non sensibles au temps, ou quand l'utilisateur souhaite réduire les coûts API pour les opérations en masse comme le traitement de documents, les évaluations, ou l'annotation de datasets.

## Quand ne PAS utiliser
- Les applications en temps réel ou sensibles à la latence — le traitement par batch prend jusqu'à 24 heures
- Les workflows où chaque résultat doit alimenter la demande suivante — utiliser le streaming synchrone à la place
- Moins de 10 demandes — le surcoût API synchrone est négligeable à cette échelle

## Instructions

### Aperçu de l'API Batch
- Soumettre jusqu'à 10 000 demandes par batch
- Remise de 50% par rapport à l'API Messages synchrone
- Le traitement se complète dans les 24 heures (généralement beaucoup plus rapide pour les petits batches)
- Les résultats livrés sous forme de flux JSONL quand le traitement se termine
- Les demandes individuelles échouées n'échouent pas le batch

### Format de demande
Chaque élément du batch a :
- `custom_id` : votre identifiant — utilisé pour faire correspondre les résultats aux entrées
- `params` : paramètres standard de l'API Messages (model, max_tokens, messages, system, tools, etc.)

```python
import anthropic

client = anthropic.Anthropic()

requests = [
    {
        "custom_id": f"doc-{i}",
        "params": {
            "model": "claude-opus-4-5",
            "max_tokens": 1024,
            "messages": [
                {"role": "user", "content": f"Summarize this document: {doc}"}
            ],
        },
    }
    for i, doc in enumerate(documents)
]
```

### Soumettre un Batch
```python
batch = client.messages.batches.create(requests=requests)
print(batch.id)           # msgbatch_...
print(batch.processing_status)  # "in_progress"
```

### Interrogation pour achèvement
```python
import time

def wait_for_batch(batch_id: str) -> anthropic.MessageBatch:
    while True:
        batch = client.messages.batches.retrieve(batch_id)
        if batch.processing_status == "ended":
            return batch
        print(f"Status: {batch.processing_status} — waiting 30s")
        time.sleep(30)

batch = wait_for_batch(batch.id)
print(f"Request counts: {batch.request_counts}")
# RequestCounts(canceled=0, errored=1, expired=0, processing=0, succeeded=199)
```

### Récupération des résultats
```python
# Results stream as JSONL — iterate without loading all into memory
for result in client.messages.batches.results(batch.id):
    if result.result.type == "succeeded":
        message = result.result.message
        print(f"{result.custom_id}: {message.content[0].text[:100]}")
    elif result.result.type == "errored":
        error = result.result.error
        print(f"{result.custom_id}: ERROR {error.type} — {error.message}")
    elif result.result.type == "expired":
        print(f"{result.custom_id}: EXPIRED — resubmit")
```

### Types de résultats
| Type | Sens | Action |
|---|---|---|
| `succeeded` | Completion normale | Utiliser `result.message` |
| `errored` | Erreur au niveau API (params invalides, politique de contenu) | Logger et ignorer ou réessayer |
| `expired` | Fenêtre de 24 heures écoulée avant traitement | Renvoyer la demande |

### Annulation d'un Batch
```python
client.messages.batches.cancel(batch.id)
# Already-completed requests are not rolled back — partial results may exist
```

### Limites de taux
- 10 000 demandes par batch
- 100 batches simultanés (en cours à la fois)
- Les limites de taux des batches sont séparées des limites de taux API synchrone — soumettre des batches ne compte pas dans votre quota synchrone

### Cas d'utilisation et dimensionnement

| Cas d'utilisation | Taille de batch typique | Délai estimé |
|---|---|---|
| Document summarization | 100–5 000 | Minutes–heures |
| Eval run over test set | 500–10 000 | Heures |
| Dataset annotation | 1 000–10 000 | Heures |
| Bulk content generation | 50–2 000 | Minutes–heures |

### Modèle de production : Queue + Batch
Pour les charges de travail à haut volume en cours, combinez une file d'attente de jobs avec l'API batch :
1. Mettre en file d'attente les éléments au fur et à mesure qu'ils arrivent
2. Tous les N minutes (ou quand la queue atteint 500+), vider la queue dans un batch
3. Stocker le mappage `batch_id` → `custom_id[]` dans une base de données
4. Interroger le statut du batch sur un cron, écrire les résultats dans la DB quand `processing_status == "ended"`
5. Exposer les résultats via une API aux consommateurs en aval

## Exemple

Annotation de 2 000 tickets de support client avec sentiment et catégorie :

```python
tickets = load_tickets_from_db()  # 2,000 rows

requests = [
    {
        "custom_id": str(ticket["id"]),
        "params": {
            "model": "claude-haiku-4-5",
            "max_tokens": 64,
            "system": "Respond with JSON only: {\"sentiment\": \"positive|neutral|negative\", \"category\": \"billing|technical|general\"}",
            "messages": [{"role": "user", "content": ticket["text"]}],
        },
    }
    for ticket in tickets
]

batch = client.messages.batches.create(requests=requests)
batch = wait_for_batch(batch.id)

results = {}
for result in client.messages.batches.results(batch.id):
    if result.result.type == "succeeded":
        import json
        data = json.loads(result.result.message.content[0].text)
        results[result.custom_id] = data

save_annotations_to_db(results)
# Total cost: ~50% less than running 2,000 synchronous calls
```

---
