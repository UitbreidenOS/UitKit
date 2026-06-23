# Architectures de Mélange d'Experts (MoE) dans Claudient

Ce document présente les architectures permettant d'aiguiller les requêtes sur plusieurs modèles afin d'optimiser la génération de code, le raisonnement et les coûts.

---

## 1. Architecture 1 : Routage basé sur la complexité (Dispatch catégorisé)

### Fonctionnement
Le système adapte dynamiquement le raisonnement en fonction des heuristiques d'entrée (ex. ajouts de lignes, fichiers impactés, drapeaux de sécurité).

---

## 2. Architecture 2 : Routage par domaine d'expertise (Dispatch par rôle)

### Fonctionnement
Les requêtes sont analysées pour identifier des mots-clés, des langages et des répertoires techniques afin de les aiguiller vers des modèles/instructions système hautement spécialisés.

---

## 3. Architecture 3 : Essaim consensuel multi-agents (Débat de routage)

### Fonctionnement
Pour les décisions à enjeux élevés, un agent superviseur coordonne un débat entre deux agents experts contradictoires, synthétisant les résultats avant l'exécution.
