# Facturation et Tarification — Plans Claude, Crédits Agent SDK et Gestion des Coûts

Une référence pratique pour comprendre les niveaux d'abonnement de Claude, la répartition de facturation du 15 juin, les tarifs des jetons API et les stratégies d'optimisation des coûts.

---

## Aperçu des Plans

| Plan | Prix Mensuel | Limites Interactives | Crédits Agent SDK |
|---|---|---|---|
| **Pro** | 20 $/mois | Standard | 20 $/mois |
| **Max 5×** | 100 $/mois | 5× standard | 100 $/mois |
| **Max 20×** | 200 $/mois | 20× standard | 200 $/mois |
| **Team** | Par utilisateur | Pool partagé | Facturation API séparée |
| **Enterprise** | Par utilisateur | Négociée | Facturation API séparée |

Les comptes **Team et Enterprise** utilisent une tarification par utilisateur avec facturation API aux tarifs des jetons — il n'y a pas de pool de crédits Agent SDK fixe. Toute consommation de jetons est mesurée directement par rapport à l'API.

---

## Le Changement de Facturation du 15 Juin 2026

> **Ce changement affecte tous les abonnés Pro et Max.** Les utilisateurs de clés API (pas d'abonnement) ne sont pas affectés — ils ont toujours été facturés par jeton.

Avant le 15 juin 2026 : `claude -p` (mode impression), les sessions Agent SDK et les sessions Managed Agent tiraient tous du même pool que les sessions de chat Claude interactives et les sessions Claude Code en ligne de commande.

Après le 15 juin 2026 : **Deux pools séparés.**

### Pool 1 — Pool Interactif
Couvre :
- Sessions de chat Claude.ai
- Sessions Claude Code en ligne de commande (`claude` dans votre terminal, mode interactif)

### Pool 2 — Pool de Crédits Agent SDK
Couvre :
- `claude -p` (mode impression / non-interactif)
- Sessions Agent SDK (appels API programmatiques)
- Sessions Managed Agent (agents hébergés dans le cloud via `client.beta.sessions`)

### Ce que Cela Signifie en Pratique

- Vous pouvez exécuter des scripts `claude -p`, des pipelines et l'automatisation tout le mois sans toucher à vos limites de chat interactif.
- Les crédits Agent SDK ne se **reportent pas** d'un mois à l'autre. Les crédits inutilisés expirent à la fin de la période de facturation.
- Si vous atteignez la limite de crédit Agent SDK, les appels suivants retournent un `429` avec `X-Limit-Pool: agent_sdk` dans l'en-tête de réponse. L'utilisation interactive n'est pas affectée.
- Utilisateurs de clé API : aucun changement. Facturés par jeton comme toujours — aucun pool, aucun report.

### Surveillance de l'Utilisation

```bash
# Dans Claude Code — affiche la répartition par catégorie
/usage
```

La sortie `/usage` affiche maintenant deux lignes : `interactive` et `agent_sdk`, chacune avec les jetons utilisés et l'allocation restante. Vérifiez ceci avant d'exécuter des travaux batch volumineux pour confirmer que vous avez suffisamment de crédits Agent SDK.

La page d'utilisation Claude.ai (Paramètres → Utilisation) suit également les limites mensuelles par pool avec une barre de progression pour chacun.

---

## Tarification API (Utilisateurs de Clés API)

Facturés par jeton. Aucun abonnement requis. Tarifs à partir de juin 2026 :

### Tarifs d'Entrée / Sortie

| Modèle | Entrée (par 1M jetons) | Sortie (par 1M jetons) |
|---|---|---|
| Claude Opus 4.7 | 5,00 $ | 25,00 $ |
| Claude Sonnet 4.6 | 3,00 $ | 15,00 $ |
| Claude Haiku 4.5 | 0,25 $ | 1,25 $ |

### Tarifs du Cache de Prompt

| Opération de cache | Multiplicateur sur le prix d'entrée |
|---|---|
| Lecture du cache | 0,1× (réduction de 90 %) |
| Écriture du cache | 1,25× (25 % de prime sur la première écriture) |

La mise en cache est bénéfique chaque fois que vous vous attendez à plus de 1 lecture par écriture. Aux tarifs Opus 4.7 : un contexte de 100K jetons coûte 0,50 $ pour écrire dans le cache et 0,05 $ par lecture de cache. Seuil de rentabilité à 1,25 lecture ; chaque lecture après cela économise 0,45 $.

### API Batch

L'API Batch traite les demandes de manière asynchrone et retourne les résultats dans les 24 heures. Réduction : **50 % de réduction** sur les tarifs standard pour les jetons d'entrée et de sortie. Utilisez-le pour :
- Travaux de classification
- Traitement en masse de documents
- Pipelines d'analyse pendant la nuit
- Toute charge de travail où la latence n'est pas une contrainte

---

## Stratégies d'Optimisation des Coûts

### 1. Utilisez Haiku pour les Tâches Mécaniques

Haiku 4.5 est environ 12× moins cher qu'Opus 4.7 sur les jetons d'entrée. Pour les tâches qui ne nécessitent pas de raisonnement — classification, résumé, remplissage de modèles, traduction, extraction à partir de données structurées — Haiku produit des résultats équivalents à une fraction du coût.

Règle générale : si vous pouviez écrire une expression régulière pour cela, Haiku le gère. Si la tâche nécessite un raisonnement multi-étapes ou un jugement, utilisez Sonnet ou Opus.

### 2. Mise en Cache de Prompt pour les Contextes Volumineux Répétés

N'importe quel bloc de contexte qui se répète entre les appels — les invites système, les grands codebases, les documents de référence, les schémas d'outils — doit être mis en cache. À un tarif de lecture de cache de 0,1×, une invite système de 200K jetons coûte 1,00 $ pour écrire une fois et 0,10 $ par lecture par la suite.

Les écritures de cache sont explicites : utilisez le marqueur `cache_control: {"type": "ephemeral"}` sur le bloc de contenu. Le contenu mis en cache a un TTL de 5 minutes qui se réinitialise à chaque lecture.

### 3. API Batch pour les Charges de Travail Non Sensibles au Temps

Si un pipeline peut tolérer une latence allant jusqu'à 24 heures, acheminez-le via l'API Batch. Réduction de 50 % sur tous les modèles. À grande échelle, cela réduit de moitié vos dépenses d'API sur les travaux asynchrones.

### 4. Contrôle de la Longueur de Sortie

Les jetons de sortie coûtent 5× plus chers que les jetons d'entrée au même tarif. Demandez au modèle d'être concis lorsque vous n'avez besoin que de sorties structurées ou de réponses courtes. Ajoutez à votre invite système :

```
Répondez uniquement à ce qui a été demandé. N'ajoutez pas d'explications, de mises en garde ou de résumés sauf s'ils sont explicitement demandés.
```

Pour les tâches d'extraction : demandez une sortie JSON uniquement sans prose environnante.

### 5. Chargement Différé des Outils

Lister 50+ outils dans une invite système peut ajouter 10K–20K jetons de contexte par appel. Le modèle de chargement d'outils différés de Claude Code charge les schémas d'outils uniquement lorsque Claude les demande, réduisant le contexte de démarrage jusqu'à 85% pour les grands catalogues d'outils.

Voir `guides/token-cost-reduction.md` pour le modèle d'implémentation du chargement différé.

### 6. Utilisez les Crédits Agent SDK Avant les Clés API pour les Scripts

Si vous avez un abonnement Max, votre pool de crédits Agent SDK est prépayé. Exécuter des scripts `claude -p` par rapport à votre abonnement ne coûte rien d'extra jusqu'à ce que le pool de crédits soit épuisé. Revenez à la facturation directe par clé API uniquement lorsque votre pool de crédits est épuisé ou pour les charges de travail qui dépassent la limite de crédit.

---

## Surveillance

| Outil | Ce qu'il montre |
|---|---|
| `/usage` dans Claude Code | Utilisation des jetons de la session actuelle par catégorie (interactive / agent_sdk) |
| Claude.ai → Paramètres → Utilisation | Limites mensuelles, barres de progression par pool |
| `hooks/post-tool-use/cost-tracker.sh` | Journalisation des coûts par session via le hook PostToolUse |

Pour les utilisateurs de clés API, la Console Anthropic (console.anthropic.com) fournit l'utilisation des jetons par jour ventilée par modèle et un graphique de dépenses pour la période de facturation.

---
