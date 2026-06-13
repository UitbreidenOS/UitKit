---
name: llm-eval
description: "LLM-Evaluation: automatische Metriken, A/B-Tests, Mensch-Evaluation, Benchmarks, Qualitäts-Tracking"
---

# Fähigkeit LLM Evaluation

## Wann aktivieren
- Qualität von LLM-Outputs messen
- Modelle und Prompts vergleichen
- Kontinuierliches Benchmarking einrichten
- Änderungen vor Production evaluieren
- Qualitätsdegradation erkennen

## Anweisungen

```
Evaluierungs-Framework für [LLM-Anwendung].

Aufgabe: [Klassifizierung / Textgeneration / Q&A / etc.]
Schlüsselmetrik: [Genauigkeit / BLEU / ROUGE / Zufriedenheit]

Automatisierte Metriken:
- Exact Match: Output == Erwartung
- Semantische Ähnlichkeit: Cosinus Embedding
- BLEU/ROUGE: n-gram Überlappung (Generation)
- Länge, Tokens: Format überprüfen

A/B-Tests:
- Traffic 50/50 aufteilen
- Vergleiche Fehlerrate, Latenz, Zufriedenheit
- Mindestens 100-1000 Samples

Mensch-Evaluation:
- 5-10 unabhängige Rater
- Skala 1-5: Qualität, Relevanz, Stil
- Inter-Rater-Zustimmung: Cohen Kappa > 0.7

Kontinuierliches Tracking mit Dashboards einrichten.
```

---
