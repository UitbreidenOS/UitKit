---
name: model-router
updated: 2026-06-23
---

# Model Router — Routage Mixture of Experts

## When to activate

- L'utilisateur demande quel modèle Claude utiliser pour une tâche ("Dois-je utiliser Opus ou Haiku ?")
- Optimiser les coûts en acheminant vers le tier de modèle le plus économique et capable
- Construire un flux de travail multi-agent et assigner des tiers de modèle aux sous-tâches
- L'utilisateur mentionne "MoE", "model routing", "tier selection", "optimisation des coûts", "sélection intelligente de modèles"
- Déboguer un flux de travail où le mauvais modèle a été sélectionné pour une tâche
- Comprendre les limites de capacité de Haiku/Sonnet/Opus et quand basculer entre eux
- La session a des contraintes de budget de tokens et nécessite un routage dynamique

## When NOT to use

- Le modèle est déjà explicitement spécifié par l'utilisateur (aucun routage requis)
- Conversation interactive unique et courte où la surcharge dépasse le bénéfice
- La tâche est clairement uniquement Opus (examen d'architecture de sécurité, modélisation des menaces) — ignorer le routage
- La qualité est la seule préoccupation et le coût est illimité — par défaut Opus
- L'utilisateur pose des questions générales sur les capacités de Claude (pas de routage spécifique aux tâches)

## Instructions

### Routing Mode 1: Tier Router (Task Classification)

Analyse le texte de la tâche pour les signaux de complexité — mots clés, nombre de mots, indices de domaine.

**Logique d'affectation de tier:**
- **Tier Opus** activé par mots clés: architect, architecture, security, threat, exploit, vulnerability, design system, reasoning, planning, explore, critique, ambiguous, tradeoff, evaluate options, decide, strategy, complex decision, deep dive, analysis
- **Tier Haiku** activé par mots clés: format, lint, rename, translate, classify, extract, boilerplate, generate stub, template, sort, list, summarize short, count, convert, reformat, cleanup, validation, parsing, simple task
- **Tier Sonnet** est le repli par défaut pour le travail à usage général (codage, refactorisation, rédaction, orchestration)

**Notation de confiance**: Confiance plus élevée (0.7+) lorsque plusieurs mots clés correspondent. Confiance plus faible (0.4) lorsque la description de la tâche est vague ou très brève.

**Quand utiliser**: Sélection de tier rapide et automatique quand vous avez besoin d'acheminer immédiatement sans raisonnement complexe.

### Routing Mode 2: Cascade Escalator (Progressive Refinement)

Commence par le modèle capable le moins cher, monte les tiers seulement si la confiance est insuffisante.

**Flux:**
1. La classification initiale produit un tier + score de confiance
2. Si confiance < seuil (par défaut 0.65), monter un tier (Haiku → Sonnet → Opus)
3. Arrêter à Opus ou quand le seuil de confiance est atteint
4. Les escalades max par défaut à 2 (empêche l'escalade incontrôlée)

**Quand utiliser**: Limites de tâches incertaines où vous préfériez commencer à bas coût et monter au besoin. Équilibre coût et sécurité.

**Configuration:**
- `--confidence-threshold`: Reclassifier au tier supérieur si en dessous (par défaut 0.65)
- Escalades max limitées à 2

### Routing Mode 3: Parallel Expert Panel (Multi-Model Voting)

Exécute le même prompt de tâche sur les 3 tiers de modèle simultanément, agrège les résultats par vote.

**Stratégies de vote:**
- **Majority**: Le tier choisi par la plupart des experts gagne (p. ex. 2/3 votes pour Sonnet)
- **Confidence-weighted**: Noter chaque tier par confiance moyenne; tier avec confiance la plus élevée gagne
- **Synthesis**: Retourner les 3 résultats à un modèle arbitre externe (Sonnet) pour synthétiser le consensus

**Quand utiliser**: Décisions critiques (conceptions de sécurité, choix d'architecture) où vous voulez un consensus des diverses forces du modèle. Coûte 3x plus cher en tokens en amont mais réduit le risque d'escalade/de réessai.

### Routing Mode 4: Domain Expert Router (Path-Based Routing)

Achemine en fonction des chemins de fichier et du domaine de la tâche, sans inspecter profondément le texte de la tâche.

**Règles de domaine** (vérifiées dans l'ordre de priorité):
| Schéma de chemin | Domaine | Tier | Raisonnement |
|---|---|---|---|
| `security/`, `auth`, `credentials`, `secrets`, `cors` | Sécurité | **Opus** | Enjeux élevés, adjacente à exploit |
| `architecture/`, `.yaml`, `.yml`, `.tf` | Infra/Architecture | **Opus** | Décisions de conception système |
| `data/`, `ml/`, `.py` | Data/ML | **Sonnet** | Complexe mais pas architectural |
| `.ts`, `.tsx`, `.js`, `.jsx` | Code source | **Sonnet** | Travail de codage, raisonnement équilibré |
| `.md`, `.txt` | Documentation | **Haiku** | Formatage de texte uniquement |
| (aucun chemins fourni) | Task classification | Per Tier Router | Retombe à l'analyse des mots clés |

**Quand utiliser**: Codebases avec structure de domaine claire. Routage automatique avec surcharge zéro d'inspection. Idéal pour les pipelines de haut volume.

### Routing Mode 5: Budget Governor (Token Ratio Thresholds)

Achemine dynamiquement en fonction du budget de tokens restant en pourcentage du budget de session total.

**Seuils:**
- Si `remaining / total < 15%`: Force Haiku (mode conservation; préserver les tokens pour les tâches critiques)
- Si `remaining / total >= 50%` ET la tâche est classée comme Opus: Utiliser Opus (budget permissif)
- Sinon: Utiliser la classification du Tier Router

**Seuils de ratio de budget:**
- Moins de 15%: "budget critique" → Haiku seulement
- 15–50%: "budget modéré" → Sonnet ou Haiku
- 50%+: "budget sain" → Tout tier autorisé

**Quand utiliser**: Sessions longues avec limites de tokens fixes. Assure que vous ne vous retrouverez pas sans tokens au milieu de la session via dégradation automatique de la complexité sous pression budgétaire.

**Configuration:**
- `totalBudget`: Budget de tokens de session (par défaut 100000)
- `opusThreshold`: Utiliser Opus seulement si >= 50% restant (par défaut 0.5)
- `haikuThreshold`: Force Haiku si < 15% restant (par défaut 0.15)

### Using the CLI

**Classifier une tâche:**
```bash
claudient moe classify "Format the JSON output"
# → Tier: HAIKU, Confidence: 85%, Reasoning: 2 haiku keywords detected
```

**Afficher le chemin d'escalade:**
```bash
claudient moe cascade "Design a distributed system" --confidence-threshold=0.7
# → Original Tier: SONNET, Escalations: 1, Final Tier: OPUS
```

**Obtenir le vote du panel d'experts:**
```bash
claudient moe panel "Review this code" --strategy=majority
# Affiche les opinions Haiku, Sonnet, Opus + consensus de vote
```

**Router par domaine de fichier:**
```bash
claudient moe domain "src/security/auth.ts,src/security/jwt.ts" "security audit"
# → Domain: security, Routed Tier: OPUS
```

**Routage conscient du budget:**
```bash
claudient moe budget "write unit tests" --remaining 25000 --total 100000
# → Budget Ratio: 25%, Routed Tier: SONNET
```

**Statut du système:**
```bash
claudient moe status
# Imprime les modes de routage actifs, seuils, coûts de tier
```

### Programmatic Usage

```javascript
import MoeRouter, { classifyTask, routeByDomain, budgetGovernedRouter } from './lib/moe-router.js';

// Tier Router
const result = classifyTask('Design a microservices architecture');
console.log(result.tier, result.confidence);  // claude-opus-4-7, 0.85

// Domain Router
const domainRoute = routeByDomain(['src/security/auth.ts'], 'refactor');
console.log(domainRoute.tier);  // claude-opus-4-7

// Budget Governor
const governor = budgetGovernedRouter({ totalBudget: 50000 });
const budgetRoute = governor.route('write tests', 7500);  // 15% remaining
console.log(budgetRoute.tier);  // claude-haiku-4-5 (forced)
```

## Example

**Scénario**: La tâche est "Refactor the authentication module in `src/security/auth.ts`". La session a 60 000 tokens restants sur 100 000 au total.

**Tier Router analyse:** Le mot clé "refactor" suggère Sonnet → confiance 0.62

**Domain Router vérifie:** Le chemin du fichier contient "security/" → candidat Opus → confiance élevée

**Budget Governor voit:** 60% du budget restant >= seuil 50% → Opus autorisé

**Décision:** Le signal de domaine remplace le signal de tier. Les fichiers de sécurité s'acheminent toujours vers Opus pour un maximum de contrôle.

**Sélection finale:** `claude-opus-4-7`

**Commande CLI:**
```bash
claudient moe domain "src/security/auth.ts" "Refactor the authentication module"
# → Detected Domain: security
# → Routed Tier: OPUS
# → Reasoning: security-sensitive file detected
```

**Impact budgétaire:** Avec 60% du budget restant, cette tâche Opus est acceptable. Si le budget avait été 12% restant, Budget Governor aurait forcé Haiku malgré le domaine de sécurité (mode conservation).

---

## Tier Reference

| Modèle | Coût | Vitesse | Raisonnement | Quand utiliser |
|---|---|---|---|---|
| **Haiku** | 1x | Plus rapide | Raisonnement limité | Formatage, classification, création de modèles, boilerplate, extraction simple |
| **Sonnet** | 12x | Rapide | Bon raisonnement | Codage général, refactorisation, documentation, orchestration, examens |
| **Opus** | 300x | Modéré | Raisonnement profond | Architecture, sécurité, décisions ambigus, modélisation des menaces, planification complexe |

**Remarque de coût**: Choisir Haiku au lieu d'Opus économise ~300x sur les tokens pour les tâches simples. Cascade Escalator empêche de surpayer pour le travail facile tout en protégeant contre la sous-spécification des problèmes difficiles.
