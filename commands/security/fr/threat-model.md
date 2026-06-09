---
description: Produire un modèle de menace STRIDE pour un composant système ou l'application complète
argument-hint: "[component, feature, or diagram description]"
---
Produire un modèle de menace STRIDE pour `$ARGUMENTS`. Si aucun argument n'est fourni, modéliser l'application complète en fonction de la base de code, du README et de toute documentation d'architecture trouvée dans le dépôt.

**Étape 1 — Comprendre le système**

Avant de modéliser, répondez à ces questions à partir du code et de la documentation :
- Quels sont les points d'entrée ? (points de terminaison HTTP, files d'attente de messages, ingestion de fichiers, CLI)
- Quels magasins de données sont utilisés et que contiennent-ils ?
- Quels services externes le système appelle-t-il ?
- Quelles sont les limites de confiance ? (accessible sur Internet par rapport à interne, utilisateur par rapport à administrateur par rapport à service-to-service)
- Quelles sont les données les plus sensibles que le système traite ?

Produire un résumé bref du flux de données : acteurs → points d'entrée → traitement → magasins de données → services externes.

**Étape 2 — Appliquer STRIDE**

Pour chaque composant ou flux de données identifié, évaluez chaque catégorie de menace :

| Menace | Question à poser |
|---|---|
| **Spoofing** | Un attaquant peut-il usurper l'identité d'un utilisateur, d'un service ou d'un composant ? |
| **Tampering** | Les données peuvent-elles être modifiées en transit ou au repos sans détection ? |
| **Repudiation** | Un acteur peut-il nier avoir effectué une action en raison de journaux manquants ou d'une attribution faible ? |
| **Information Disclosure** | Les données sensibles peuvent-elles fuir par le biais d'erreurs, de journaux, de canaux auxiliaires ou de réponses d'API trop larges ? |
| **Denial of Service** | Un attaquant peut-il épuiser les ressources (CPU, mémoire, connexions, limites de débit) ? |
| **Elevation of Privilege** | Un acteur de confiance inférieure peut-il acquérir des capacités réservées aux acteurs de confiance supérieure ? |

**Étape 3 — Évaluer chaque menace**

Utilisez le scoring DREAD-lite pour chaque résultat :
- **Damage**: 1–3 (impact faible / moyen / élevé en cas d'exploitation)
- **Reproducibility**: 1–3 (difficile / parfois / toujours reproductible)
- **Exploitability**: 1–3 (attaquant expert / modéré / non spécialisé)
- Score = somme (max 9). ≥7 = Critique, 5–6 = Élevé, 3–4 = Moyen, ≤2 = Faible

**Étape 4 — Résultat**

```
## Threat Model: [Component/System]

### System Overview
[Data flow summary from Step 1]

### Threats

#### [STRIDE category] — [Threat title]
Component: [entry point, data flow, or store]
Description: what the attacker does and achieves
DREAD score: D=N R=N E=N → Total=N (Severity)
Mitigations:
  - [current control, if any]
  - [recommended control]

### Risk Summary Table
| # | Threat | Severity | Mitigated? |
```

**Étape 5 — Recommandations prioritaires**

Énumérez les 5 meilleures atténuations par score de risque, avec des conseils de mise en œuvre spécifiques pour cette base de code.
