# Guide d'orchestration des agents

Comment déléguer, paralléliser et spécialiser le travail avec le système de sous-agents de Claude Code.

---

## Ce que sont les sous-agents

Un sous-agent est une instance Claude séparée lancée par la session parente pour gérer une tâche spécifique et délimitée. Il obtient :
- Une fenêtre de contexte fraîche (pas d'historique de session)
- Un sous-ensemble d'outils spécifique (si configuré)
- Une sélection de modèle (peut différer du parent)
- Un prompt que vous écrivez explicitement

Les sous-agents ne sont pas magiques — ce sont des outils spécifiques pour des problèmes spécifiques.

---

## Quand utiliser un sous-agent

Utilisez un sous-agent quand la tâche a des **entrées claires** et des **sorties claires** et est **indépendante de l'état de session actuel**.

**Bons candidats :**
- Réviser 10 fichiers pour des problèmes de sécurité
- Effectuer une recherche spécifique dans le code pour localiser un pattern
- Générer du code standard pour un nouveau module selon une spécification
- Analyser un fichier journal et retourner un résumé

**Mauvais candidats :**
- Tâches nécessitant le contexte complet de la session
- Tâches nécessitant des échanges — les sous-agents sont en une seule passe
- Tâches où le coût de lancement dépasse le travail lui-même

---

## 1. Pattern de délégation

La session parente identifie une tâche délimitée et la confie au sous-agent.

**Règle clé :** Le prompt du sous-agent doit être autonome. Il n'a pas accès à ce que la session parente a fait. Briefez-le comme un collègue qui vient d'entrer dans la pièce.

**Ce qu'il faut inclure dans le prompt du sous-agent :**
- Ce que vous essayez d'accomplir et pourquoi
- Les fichiers ou répertoires spécifiques à examiner
- Le format de résultat souhaité
- Les contraintes ou décisions déjà prises

---

## 2. Pattern de parallélisation

Plusieurs sous-agents s'exécutant simultanément sur des tâches indépendantes.

**Quand paralléliser :**
- La même opération doit être appliquée à de nombreux fichiers/modules
- Deux tâches genuinement indépendantes doivent toutes deux être complétées
- Des tâches de recherche couvrant différentes zones simultanément

**Utiliser git worktrees pour des modifications de code parallèles :**
```bash
git worktree add ../feature-branch-a feature-a
git worktree add ../feature-branch-b feature-b
```

**Anti-patterns de parallélisation :**
- Paralléliser des tâches qui partagent l'état (conflit d'écriture)
- Tâches parallèles où l'une dépend de la sortie de l'autre

---

## 3. Pattern de spécialisation (cavecrew)

Adaptez le modèle et les outils du sous-agent à la nature de la tâche. Inspiré du pattern **cavecrew** (source : [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman)) — économise ~60% de tokens par rapport à l'utilisation d'Opus pour chaque sous-agent.

| Rôle | Modèle | Outils | Utiliser quand |
|---|---|---|---|
| Investigateur | Haiku 4.5 | Read, Bash (grep/find seulement) | Localiser des choses dans le code — lecture seule, rapide |
| Constructeur | Sonnet 4.6 | Read, Edit, Write, Bash | Modifications chirurgicales 1–2 fichiers |
| Réviseur | Haiku 4.5 | Read | Réviser un diff ou un ensemble de fichiers |
| Orchestrateur | Opus 4.7 | Tous | Coordination multi-étapes complexe, décisions d'architecture |

---

## 4. Pattern de transfert de contexte

Quand une session a accumulé un contexte significatif et que vous devez transférer le travail à un nouvel agent.

**Structure du prompt de transfert :**
```
## Context
[Ce que fait ce projet, brièvement]
[Sur quoi nous travaillions]
[Décisions prises pendant cette session]

## Files modified
[Liste avec la raison de chaque modification]

## Current state
[Ce qui est fait, pas fait, ce qui bloque]

## Your task
[Tâche spécifique et délimitée pour le nouvel agent]

## Constraints
[Décisions prises qui ne doivent pas être remises en question]
```

---

## 5. Dépendances fortes vs faibles

**Dépendance forte :** La tâche échoue explicitement sans la configuration en amont.
- Signalez cela explicitement : "Cette compétence nécessite une configuration — exécutez `/setup` d'abord."

**Dépendance faible :** La tâche fonctionne mais produit une sortie de moindre qualité sans la configuration.
- Ne bloquez pas. Dégradez gracieusement et notez l'écart.

---

## 6. Contrôle de portée pour les sous-agents

Chaque sous-agent doit avoir une limite de portée explicite.

**À inclure dans chaque prompt de sous-agent :**
```
## Scope
- Read: yes
- Write/Edit: [fichiers spécifiques seulement OU non]
- Shell commands: [commandes spécifiques autorisées OU aucune]
- Network: [oui/non]

## Do not
- Do not modify files outside [directory]
- Do not make git commits
- Do not install packages
```

---

## 7. Retourner les résultats des sous-agents

**Préférez les fichiers pour :**
- Listes de résultats sur lesquelles le parent va itérer
- Code généré que le parent va réviser
- Rapports référencés plusieurs fois

**Préférez les messages de retour pour :**
- Réponses oui/non simples
- Données structurées courtes
- Rapports de statut

---

## Référence rapide

| Objectif | Pattern |
|---|---|
| Tâche délimitée et autonome | Délégation |
| Même tâche sur plusieurs fichiers | Parallélisation |
| Recherche/localisation lecture seule | Investigateur (Haiku) |
| Modification de code chirurgicale | Constructeur (Sonnet) |
| Révision de diff/fichier | Réviseur (Haiku) |
| Coordination multi-étapes complexe | Orchestrateur (Opus) |
| Transfert de session | Pattern de transfert de contexte |
| Grande sortie de sous-agent | Écrire dans un fichier, le parent le lit |
| Résultat structuré court | Message de retour |

---

## Travaillez avec nous
