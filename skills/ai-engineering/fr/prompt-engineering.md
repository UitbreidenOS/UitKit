---
name: prompt-engineering
description: "Prompt engineering : techniques de prompt, few-shot learning, chain-of-thought, température, top-p, système de prompt optimal"
---

# Compétence Ingénierie des Prompts

## Quand l'activer
- Optimiser les prompts pour des sorties cohérentes
- Concevoir des chaînes de prompts (COT, réflexion)
- Tuner les paramètres LLM (température, top-p)
- Mettre en place le few-shot learning
- Déboguer les sorties incorrectes

## Instructions

```
Optimisation de prompt pour [tâche].

Tâche: [décrire ce que vous voulez que le LLM fasse]
Modèle: [GPT-4 / Claude / Gemini]
Résultats attendus: [format, style, contraintes]

Techniques:

1. Clarté et spécificité
   - Soyez explicite sur ce que vous voulez
   - Évitez l'ambiguïté

2. Few-shot examples
   - Fournir 2-5 exemples du résultat souhaité
   - Format: Exemple input → output attendu

3. Chain-of-Thought
   - "Réfléchissez étape par étape"
   - Utile pour raisonnement multi-étapes

4. Paramètres
   - Temperature: 0 (déterministe) à 1 (créatif)
   - Top-p: 0.7-0.9 (qualité vs diversité)
   - Max tokens: limiter la longueur

5. Système de prompt
   - Rôle: "Tu es un expert en..."
   - Contraintes: "N'inclure que..."
   - Format: "Répondre comme JSON"

Générer prompt optimisé et paramètres pour ma tâche.
```

---
