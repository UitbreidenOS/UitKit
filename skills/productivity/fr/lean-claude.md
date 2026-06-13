---
name: lean-claude
description: "Activate token-efficient mode: caveman output, right model selection, MCP discipline, compaction strategy, cavecrew agents — all in one"
---

> 🇫🇷 Version française. [English version](../lean-claude.md).

# Compétence Lean Claude

## Quand activer
- Au démarrage de toute session où le coût ou la vitesse est important
- Lors de longues sessions où le contexte commence à être surchargé
- Lors de l'exécution de plusieurs agents en parallèle ou de charges de travail par lots
- En travaillant avec un budget de tokens serré
- Avant une tâche complexe en plusieurs étapes qui va consommer beaucoup de contexte

## Quand NE PAS utiliser
- Rédaction de documentation externe — la brièveté peut nuire à la clarté
- Décisions de sécurité, actions irréversibles ou séquences en plusieurs étapes où une mauvaise lecture d'un fragment cause des dommages
- Intégration d'un nouveau membre d'équipe dans une base de code

## Instructions

Collez ce prompt d'activation au début de toute session pour activer toutes les optimisations lean en une seule fois :

```
Activate lean mode for this session:

OUTPUT: caveman full — drop articles, use fragments, short synonyms.
Auto-revert to full prose for: security warnings, irreversible actions,
multi-step sequences where fragment ambiguity is risky.

MODEL: use Haiku 4.5 for any task where output is constrained and verifiable
(linting, formatting, simple renames, single-function edits, classification).
Stay on Sonnet 4.6 for multi-file reasoning. Only escalate to Opus for deep
architectural decisions or complex security analysis.

CONTEXT: do not read full files when a line range will do. Prefer targeted
reads over whole-file reads. Tell me before reading any file >500 lines.

AGENTS: for repetitive or isolated tasks, spawn a Haiku subagent rather than
doing the work in the main session. Each subagent gets a fresh context window.
```

---

### 1. Sélection du modèle — le levier le plus puissant

| Tâche | Modèle | Économies |
|-------|--------|-----------|
| Linting, formatage, renommages simples | Haiku 4.5 | ~60 % vs Sonnet |
| Modifications de fonctions simples, génération de code répétitif | Haiku 4.5 | ~60 % |
| Modifications multi-fichiers, débogage, revue de code | Sonnet 4.6 | référence |
| Décisions d'architecture, analyse de sécurité | Opus 4.7 | — (ça vaut le coût) |
| Classification, routage, extraction à grande échelle | Haiku 4.5 | ~60 % |

**Règle :** Par défaut, utilisez Sonnet 4.6. Passez à Haiku lorsque la sortie est contrainte et vérifiable. N'escaladez vers Opus que lorsque vous avez vraiment besoin d'un raisonnement approfondi.

---

### 2. Compression de sortie caveman

Indique à Claude de répondre dans un style de prose fragmentée et concise. Mesuré à environ 65 % de réduction des tokens de sortie avec 100 % de précision technique maintenue.

**Niveaux de compression :**

| Niveau | Règle | Exemple |
|--------|-------|---------|
| `lite` | Supprimer le remplissage, garder des phrases complètes | "The function handles edge cases." |
| `full` (par défaut) | Supprimer les articles, fragments acceptés | "func handles edge cases" |
| `ultra` | Abréger, supprimer les conjonctions, flèches | "fn→edge cases handled" |

**Activer :** ajoutez `caveman full` à votre prompt de session (déjà inclus dans le prompt d'activation ci-dessus).

**Compressez vos fichiers mémoire** — les fichiers que Claude relit à chaque session deviennent des tokens d'entrée :
```
/caveman-compress .claude/memory/project-context.md
```
~46 % d'économies sur les tokens d'entrée par session sur les fichiers compressés. Implémentation complète : [github.com/JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman)

---

### 3. Discipline MCP — 30 000 tokens avant de taper un mot

Chaque serveur MCP activé charge toutes ses définitions d'outils dans le contexte au démarrage de la session. 10 serveurs MCP ≈ 80 outils ≈ **30 000 tokens consommés avant de taper un mot**.

**Auditez vos MCP actifs :**
```bash
# Check what's enabled
cat ~/.claude/settings.json | grep -A2 mcpServers
cat .claude/settings.json | grep -A2 mcpServers 2>/dev/null
```

**Désactivez tout serveur que vous n'utiliserez pas dans cette session.** Désactiver 5 serveurs MCP inutilisés économise ~15 000 tokens — plus que la plupart des fichiers CLAUDE.md en consomment.

---

### 4. Gestion du contexte

**CLAUDE.md :**
- Gardez le CLAUDE.md du projet sous 300 lignes
- Supprimez les règles qui ne s'appliquent plus
- Ne jamais dupliquer les règles de niveau utilisateur dans le CLAUDE.md du projet

**Lectures de fichiers :**
- Demandez des plages de lignes spécifiques : "read auth.py lines 45–90" et non "read auth.py"
- Évitez de lire le même grand fichier deux fois
- Utilisez des sous-agents pour les tâches nécessitant la lecture de nombreux fichiers non nécessaires à la session principale

**Compaction — déclenchez-la tôt, pas à 95 % :**
```
/compact
```
Compactez avant de passer à une nouvelle tâche majeure, après une longue session de débogage, ou avant de commencer un travail nécessitant la lecture de nombreux grands fichiers. N'attendez pas la compaction automatique.

---

### 5. Cavecrew — agents bon marché pour tâches bon marché

Lancez des sous-agents basés sur Haiku pour des tâches délimitées plutôt que de brûler le contexte Sonnet :

| Rôle | Modèle | Utiliser pour |
|------|--------|---------------|
| Investigateur | Haiku 4.5 | Localiser des fichiers, grep dans la base de code, tâches en lecture seule |
| Constructeur | Sonnet 4.6 | Modifications chirurgicales de 1 à 3 fichiers |
| Réviseur | Haiku 4.5 | Réviser un diff ou un fichier pour identifier des problèmes |
| Orchestrateur | Opus 4.7 | Coordination complexe en plusieurs étapes uniquement |

**~60 % d'économies sur les tokens** vs l'utilisation de Sonnet pour chaque sous-agent. Utilisez Haiku pour tout ce où la tâche est contrainte et la sortie vérifiable.

---

### 6. Efficacité des prompts

| Au lieu de | Utilisez |
|-----------|----------|
| "Fix the authentication" | "Fix JWT expiry check in auth/middleware.py:45 — not rejecting expired tokens" |
| Cinq "add a test for X" séparés | "Add tests for all five functions in utils.py" |
| "Explain this codebase" | "Explain how auth flows from login to session creation, max 3 paragraphs" |
| Longues allers-retours | Regroupez les tâches liées dans un seul prompt |

Prompts vagues → exploration → plus d'appels d'outils → plus de contexte consommé.
Prompts spécifiques → réponses ciblées → moins de tokens.

---

### 7. Suivi des coûts de session

Utilisez le hook `cost-tracker` pour voir l'utilisation des tokens par appel d'outil :
```bash
npx claudient add hooks
# Then add hooks/lifecycle/cost-tracker.sh to .claude/settings.json
```

Vous donne un journal en continu des tokens d'entrée/sortie + coût estimé par session. Utilisez-le pour identifier quelles tâches consomment le plus — puis optimisez celles-ci en premier.

---

## Carte de référence rapide

| Situation | Action |
|-----------|--------|
| Démarrage de toute session | Collez le prompt d'activation ci-dessus |
| Modification simple, lint, formatage | Passez à Haiku 4.5 |
| Les fichiers mémoire sont volumineux | Exécutez caveman-compress dessus |
| Le contexte ralentit | `/compact` maintenant, n'attendez pas |
| MCP inutilisés activés | Désactivez-les dans settings.json |
| Tâche répétitive sur plusieurs fichiers | Sous-agent Haiku, pas la session principale |
| Requête vague, longue réponse | Réécrivez en prompt spécifique et délimité |
| Décision d'architecture / sécurité | Escaladez vers Opus — ça vaut le coût |

---
