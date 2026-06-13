---
description: Produire un modèle de menace STRIDE pour un composant système ou l'application complète
argument-hint: "[composant, fonctionnalité ou description de diagramme]"
---
Produire un modèle de menace STRIDE pour `$ARGUMENTS`. Si aucun argument n'est donné, modéliser l'application complète en fonction de la base de code, du README et de toute documentation d'architecture trouvée dans le dépôt.

**Étape 1 — Comprendre le système**

Avant de modéliser, répondre à ces questions à partir du code et de la documentation :
- Quels sont les points d'entrée ? (endpoints HTTP, files d'attente de messages, ingestion de fichiers, CLI)
- Quels magasins de données sont utilisés et que contiennent-ils ?
- Quels services externes le système appelle-t-il ?
- Quelles sont les limites de confiance ? (exposés à Internet vs internes, utilisateur vs administrateur vs communication service-à-service)
- Quelles sont les données les plus sensibles que le système traite ?

Produire un résumé succinct du flux de données : acteurs → points d'entrée → traitement → magasins de données → services externes.

**Étape 2 — Appliquer STRIDE**

Pour chaque composant ou flux de données identifié, évaluer chaque catégorie de menace :

| Menace | Question à poser |
|---|---|
| **Usurpation d'identité** | Un attaquant peut-il usurper l'identité d'un utilisateur, service ou composant ? |
| **Falsification** | Les données peuvent-elles être modifiées en transit ou au repos sans détection ? |
| **Répudiation** | Un acteur peut-il nier avoir effectué une action en raison de journaux manquants ou d'une attribution faible ? |
| **Divulgation d'informations** | Les données sensibles peuvent-elles fuir par des erreurs, des journaux, des canaux auxiliaires ou des réponses API trop larges ? |
| **Déni de service** | Un attaquant peut-il épuiser les ressources (CPU, mémoire, connexions, limites de débit) ? |
| **Élévation de privilège** | Un acteur de faible confiance peut-il acquérir des capacités réservées aux acteurs de confiance supérieure ? |

**Étape 3 — Évaluer chaque menace**

Utiliser la notation DREAD simplifiée pour chaque découverte :
- **Dommage** : 1–3 (impact faible / moyen / élevé en cas d'exploitation)
- **Reproductibilité** : 1–3 (difficile / parfois / toujours reproductible)
- **Exploitabilité** : 1–3 (attaquant expert / modéré / sans compétence)
- Score = somme (max 9). ≥7 = Critique, 5–6 = Élevée, 3–4 = Moyenne, ≤2 = Faible

**Étape 4 — Résultat**

```
## Modèle de menace : [Composant/Système]

### Aperçu du système
[Résumé du flux de données de l'étape 1]

### Menaces

#### [Catégorie STRIDE] — [Titre de la menace]
Composant : [point d'entrée, flux de données ou magasin]
Description : ce que fait l'attaquant et ce qu'il réalise
Score DREAD : D=N R=N E=N → Total=N (Gravité)
Atténuations :
  - [contrôle existant, le cas échéant]
  - [contrôle recommandé]

### Tableau récapitulatif des risques
| # | Menace | Gravité | Atténuée ? |
```

**Étape 5 — Recommandations priorisées**

Lister les 5 atténuations principales par score de risque, avec des conseils de mise en œuvre spécifiques pour cette base de code.
