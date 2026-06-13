---
name: llm-eval
description: "LLM-evaluatie: automatische metrieken, A/B-tests, mens-evaluatie, benchmarks, kwaliteits-tracking"
---

# Vaardigheid LLM Evaluatie

## Wanneer activeren
- Kwaliteit van LLM-outputs meten
- Modellen en prompts vergelijken
- Continu benchmarking instellen
- Wijzigingen vóór production evalueren
- Kwaliteitsdegradatie detecteren

## Instructies

```
Evaluatie-framework voor [LLM-applicatie].

Taak: [classificatie / tekstgeneratie / Q&A / etc.]
Belangrijkste metrieken: [nauwkeurigheid / BLEU / ROUGE / tevredenheid]

Automatische metrieken:
- Exact Match: output == verwacht
- Semantische gelijkenis: cosinus embedding
- BLEU/ROUGE: n-gram overlap (generatie)
- Lengte, tokens: format controleren

A/B-tests:
- Traffic 50/50 splitsen
- Vergelijk foutfrequentie, latency, tevredenheid
- Minstens 100-1000 samples

Mens-evaluatie:
- 5-10 onafhankelijke raters
- Schaal 1-5: kwaliteit, relevantie, stijl
- Inter-rater agreement: Cohen Kappa > 0.7

Continu tracking met dashboards instellen.
```

---
