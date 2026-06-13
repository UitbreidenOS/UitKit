---
name: llm-eval
description: "Évaluation LLM : métriques automatisées, tests A/B, évaluation humaine, benchmarks, suivi de qualité"
---

# Compétence Évaluation LLM

## Quand l'activer
- Mesurer la qualité des sorties LLM
- Comparer les modèles et les prompts
- Mettre en place le benchmarking continu
- Évaluer les changements avant production
- Détecter la dégradation de qualité

## Instructions

```
Cadre d'évaluation pour [application LLM].

Tâche: [classification / génération de texte / Q&A / etc.]
Métrique clé: [précision / BLEU / ROUGE / satisfaction utilisateur]

Métriques automatisées:
- Exact Match: réponse ==  attendu
- Similitude sémantique: cosinus embedding
- BLEU/ROUGE: chevauchement n-gramme (génération)
- Longueur, tok /tokens: vérifier format

Tests A/B:
- Diviser traffic 50/50
- Comparer taux d'erreur, latence, satisfaction
- Minimum 100-1000 samples

Évaluation humaine:
- 5-10 raters indépendants
- Échelle 1-5: qualité, pertinence, style
- Accord inter-rater: Kappa Cohen > 0.7

Mise en place du suivi continu avec dashboards.
```

---
