---
name: model-tiering
description: "Aiguiller et catégoriser automatiquement les prompts des développeurs entre Opus, Sonnet et Haiku selon les caractéristiques de la tâche"
updated: 2026-06-23
---

# Compétence de Catégorisation Automatique des Modèles

## Quand l'activer

- Optimiser les coûts en jetons lors de l'exécution d'un agent de codage multi-étapes.
- Allouer dynamiquement les poids des modèles lors de grands cycles de refactorisation.
- Résoudre des tâches de planification complexes avant de générer le code d'implémentation.
- Déclencher des configurations de secours lorsque les tâches de raisonnement complexe échouent sur de plus petits modèles.

## Quand NE PAS l'utiliser

- Chats interactifs rapides où le changement de modèle ajoute une latence perceptible.
- Surcharges explicites du modèle par le développeur (ex. `--model sonnet`).

## Instructions

Pour aiguiller les tâches de manière dynamique, classez les requêtes des développeurs dans l'un des trois niveaux suivants :

### 1. Niveau Raisonnement (Opus / Modèle de réflexion)
- **Portée** : Changements architecturaux majeurs, audits de sécurité, conceptions d'algorithmes complexes, préoccupations transversales.
- **Critères** : Risque structurel élevé, nécessite un raisonnement sur de larges fenêtres de contexte.

### 2. Niveau Planification (Sonnet)
- **Portée** : API de niveau intermédiaire, refactorisation de fonctions locales, conceptions de mise en page et création de tâches d'implémentation étape par étape.
- **Critères** : Complexité moyenne, suit les modèles d'architecture existants.

### 3. Niveau Codage (Haiku)
- **Portée** : Écriture de code standard, documentation, tests unitaires simples, modifications de scripts.
- **Critères** : Modifications d'un seul fichier, faible complexité architecturale, modèles de code répétables.
