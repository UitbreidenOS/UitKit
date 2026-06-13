# Référence des frontmatters d'agent

Chaque fichier d'agent Claude Code commence par un bloc de frontmatter YAML. Ce bloc contrôle l'identité, le routage, la sélection du modèle, le comportement d'exécution, l'accès aux outils et l'affichage. Cette référence couvre tous les champs supportés avec les types, les valeurs par défaut et les conseils d'utilisation.

---

## Champs obligatoires

### `name`

**Type:** `string` (kebab-case)
**Obligatoire:** Oui

L'identifiant utilisé pour générer cet agent par programme. Doit être unique sur tous les fichiers d'agent du projet.

```yaml
name: security-auditor
```

Utilisé dans:
```python
Agent(subagent_type="security-auditor", prompt="...")
```

Gardez les noms courts, descriptifs et tiretés. Évitez les numéros de version ou les suffixes d'environnement dans le nom — utilisez plutôt des fichiers séparés.

---

### `description`

**Type:** `string`
**Obligatoire:** Oui
**Longueur maximale recommandée:** 200 caractères

Description d'une seule ligne du domaine et du but de l'agent. Utilisée par le routeur de Claude pour les décisions de délégation automatique — c'est le signal principal qui détermine quand cet agent est sélectionné.

```yaml
description: "Audite le code pour les vulnérabilités du Top 10 OWASP, l'exposition de secrets et les risques d'injection. Activez pour les examens de sécurité avant tout PR."
```

Écrivez ceci comme si vous expliquiez à Claude quand déléguer ici. Les conditions de déclenchement spécifiques surpassent les descriptions génériques de capacité. Mauvais: `"Un agent de sécurité."` Bon: `"Activez lors de l'examen du code d'authentification, des points de terminaison API, ou avant la fusion de tout PR qui touche les secrets, les sessions ou la gestion des entrées utilisateur."`

---

## Champs de modèle

### `model`

**Type:** `string` — l'un de `"haiku"`, `"sonnet"`, `"opus"`
**Valeur par défaut:** Hérite du modèle actif de la session parente

Remplace le modèle utilisé pour la fenêtre de contexte de cet agent. N'affecte pas la session parente.

```yaml
model: opus
```

| Valeur | Quand l'utiliser |
|-------|-------------|
| `"haiku"` | Tâches mécaniques: reformatage, renommage, classification simple, génération de boilerplate. Réduction de coût ~60% par rapport à Sonnet. |
| `"sonnet"` | Travail de développement standard. Bon équilibre entre vitesse et raisonnement. |
| `"opus"` | Raisonnement complexe: analyse de sécurité, décisions architecturales, exigences ambiguës, refactorialisations multi-fichiers avec des contraintes subtiles. |

N'utilisez jamais `"haiku"` pour les tâches nécessitant du jugement — analyse de sécurité, décisions architecturales, ou quoi que ce soit où une mauvaise réponse a des conséquences en aval.

---

## Champs d'exécution

### `background`

**Type:** `boolean`
**Valeur par défaut:** `false`

Quand `true`, l'agent s'exécute toujours comme une tâche de fond non-bloquante. La session parente continue immédiatement sans attendre la fin de l'agent.

```yaml
background: true
```

Utilisez quand:
- La sortie de l'agent n'est pas nécessaire avant la prochaine étape du parent
- Vous parallélisez plusieurs agents spécialisés
- La tâche est l'observabilité/journalisation (logs d'audit, écritures de métriques) plutôt que la prise de décision

Évitez quand:
- Le parent a besoin des résultats de l'agent pour déterminer sa prochaine action
- L'agent écrit des fichiers que le parent lira immédiatement

---

### `isolation`

**Type:** `string` — `"worktree"` ou absent
**Valeur par défaut:** Aucune (l'agent s'exécute dans le répertoire de travail actuel)

Quand défini à `"worktree"`, Claude Code crée une arborescence git temporaire pour l'agent. L'agent fonctionne sur une copie isolée du référentiel. Si l'agent n'apporte aucune modification, l'arborescence est nettoyée automatiquement à la fin.

```yaml
isolation: worktree
```

Utilisez quand:
- L'agent va faire des modifications exploratoires qui ne doivent pas affecter l'arborescence de travail sauf si elles sont explicitement fusionnées
- Plusieurs agents s'exécutent en parallèle et ne doivent pas entrer en conflit sur les mêmes fichiers
- Vous voulez un chemin de restauration propre si les modifications de l'agent ne sont pas satisfaisantes

**Mise en garde:** Nécessite un référentiel git. Dans les répertoires non-git, la création de l'arborescence échoue silencieusement et l'agent s'exécute contre la copie de travail.

---

## Champs de prompt

### `initialPrompt`

**Type:** `string`
**Valeur par défaut:** Aucune

Une chaîne soumise automatiquement comme premier tour utilisateur quand l'agent s'exécute comme une session autonome (pas comme sous-agent). N'a aucun effet quand l'agent est généré via `Agent(subagent_type="...")`.

```yaml
initialPrompt: "Vous démarrez une session d'audit de sécurité. Commencez par lister tous les fichiers dans /src/auth/ et identifiez les points d'entrée qui acceptent les entrées externes."
```

Utilisez pour les agents qui servent de points d'entrée de projet ou d'assistants interactifs que les utilisateurs lancent directement plutôt que par l'intermédiaire d'un orchestrateur parent.

---

## Champs d'affichage

### `color`

**Type:** `string` — nom de couleur CSS ou valeur hex
**Valeur par défaut:** Aucune (utilise la valeur par défaut du terminal)

Définit la couleur d'affichage pour la sortie de cet agent dans la CLI. Purement cosmétique — n'a aucun effet sur le comportement.

```yaml
color: "#ff4444"
```

Utile lors de l'exécution de plusieurs agents en parallèle et vous avez besoin de distinguer visuellement leurs flux de sortie. Accepte les noms de couleur CSS standard (`"red"`, `"dodgerblue"`) ou les chaînes hex (`"#ff4444"`).

---

## Champs de hook

### `hooks`

**Type:** `object`
**Valeur par défaut:** Aucune

Définit des hooks limités exclusivement à cet agent. Même structure que les hooks au niveau de la session dans `settings.json`. Les hooks définis ici ne se déclenchent que quand cet agent est actif — ils n'affectent pas la session parente ou les autres agents.

```yaml
hooks:
  Stop:
    - type: command
      command: echo "Security audit complete" | tee -a .claude/audit.log
  PostToolUse:
    - matcher: "Write|Edit"
      hooks:
        - type: command
          command: "${CLAUDE_PROJECT_DIR}/.claude/hooks/validate-changes.sh"
```

Tous les événements de hook standard sont supportés: `SessionStart`, `PreToolUse`, `PostToolUse`, `PreCompact`, `PostCompact`, `Stop`, `Notification`.

Utilisez pour:
- Journaliser la fin de l'agent dans les fichiers d'audit
- Valider les fichiers que l'agent écrit avant que la session parente les lise
- Envoyer des notifications quand un agent longue durée se termine

---

## Champs de restriction d'outils

### `tools`

**Type:** `array` de `string`
**Valeur par défaut:** Tous les outils disponibles (hérite des permissions de session)

Restreint l'agent uniquement aux outils listés. Tout appel d'outil non dans cette liste est bloqué.

```yaml
tools:
  - Read
  - Grep
  - Glob
  - Bash
```

La restriction d'outils est un mécanisme de sécurité et de focus. Un agent de recherche en lecture seule ne doit pas avoir Write ou Edit. Un agent de formatage n'a pas besoin de WebSearch.

**Mise en garde importante:** Les restrictions d'outils s'appliquent aux appels propres de cet agent. Elles n'empêchent pas l'agent d'ordonner à un sous-agent qu'il génère d'utiliser des outils non restreints. Si vous restreignez un agent pour des raisons de sécurité, restreignez également ses sous-sous-agents séparément.

Ensemble en lecture seule courant: `["Read", "Grep", "Glob"]`
Ensemble d'analyse courant: `["Read", "Grep", "Glob", "Bash"]`
Ensemble de développement complet: `["Read", "Write", "Edit", "Bash", "Grep", "Glob"]`

---

## Champs d'effort

### `effort`

**Type:** `string` — l'un de `"low"`, `"medium"`, `"high"`, `"xhigh"`
**Valeur par défaut:** Hérite du paramètre d'effort de la session parente

Définit le niveau d'effort par défaut pour la fenêtre de contexte de cet agent. Remplace la valeur par défaut de la session pour cet agent uniquement.

```yaml
effort: xhigh
```

| Valeur | Quand l'utiliser |
|-------|-------------|
| `"low"` | Formateurs simples, classificateurs, transformations mécaniques |
| `"medium"` | Tâches de développement routinières, refactorialisations directes |
| `"high"` | Implémentation de fonctionnalités complexes, modifications multi-fichiers |
| `"xhigh"` | Décisions architecturales, audits de sécurité, débogage de problèmes profonds, quoi que ce soit où manquer un détail a des conséquences réelles |

Le niveau d'effort affecte le temps que le modèle "réfléchit" avant de répondre. Effort plus élevé = plus de tokens, plus de latence, sortie plus approfondie. Utilisez `"low"` pour les agents mécaniques sensibles aux coûts et `"xhigh"` quand la complétude est plus importante que la vitesse.

---

## Exemple complet

Un agent entièrement annoté combinant plusieurs champs:

```yaml
---
name: security-auditor
description: "Audite le code pour les vulnérabilités du Top 10 OWASP, l'exposition de secrets et les risques d'injection. Activez pour les examens de sécurité avant tout PR."
model: opus
background: false
isolation: worktree
effort: xhigh
tools:
  - Read
  - Grep
  - Glob
  - Bash
hooks:
  Stop:
    - type: command
      command: echo "Security audit complete" | tee -a .claude/audit.log
color: "#ff4444"
---

# Security Auditor

## Purpose
Performs a structured security review against OWASP Top 10, secret exposure patterns,
and injection risk surfaces. Runs in an isolated worktree so exploratory file reads
do not affect the working tree.

## Instructions
...
```

---

## Tableau de compatibilité des champs

| Champ | Utilisation en sous-agent | Session autonome | Remarques |
|-------|-------------|-------------------|-------|
| `name` | Obligatoire | Obligatoire | Utilisé dans `Agent(subagent_type="name")` |
| `description` | Obligatoire | Obligatoire | Signal de routage primaire |
| `model` | Oui | Oui | Remplace le modèle parent pour ce contexte |
| `background` | Oui | Non | Significatif uniquement quand généré comme sous-agent |
| `isolation` | Oui | Oui | Nécessite un référentiel git |
| `initialPrompt` | Non | Oui | Se déclenche uniquement dans les sessions autonomes |
| `color` | Oui | Oui | Cosmétique uniquement |
| `hooks` | Oui | Oui | Limité à la session de cet agent uniquement |
| `tools` | Oui | Oui | Liste blanche; bloque tous les outils non listés |
| `effort` | Oui | Oui | Remplace l'effort de la session pour ce contexte |

---

## Mises en garde

**`isolation: "worktree"` nécessite git.** Dans un répertoire non-git, la création de l'arborescence échoue silencieusement et l'agent s'exécute contre la copie de travail sans isolation. Vérifiez que votre projet est un référentiel git avant de compter sur ce champ pour la sécurité.

**Les agents `background: true` sont du type "fire-and-forget" du point de vue du parent.** Le parent continue immédiatement. Si vous avez besoin de la sortie de l'agent pour prendre une décision, n'utilisez pas `background: true`. Utilisez-le uniquement pour les tâches où le résultat est consommé de manière asynchrone (logs, notifications, effets secondaires).

**`model: "haiku"` est une optimisation des coûts, pas une dégradation de capacité pour les tâches simples.** Pour le travail mécanique — reformatage, renommage simple, génération de boilerplate — Haiku fonctionne de manière équivalente à Sonnet à un coût ~60% inférieur. N'utilisez pas Haiku pour l'analyse de sécurité, les décisions architecturales, ou toute tâche où les erreurs subtiles se composent. La différence de coût ne vaut pas le risque de qualité.

**Les restrictions d'outils ne sont pas un sandbox.** Elles bloquent les appels d'outils directs de l'agent. Un agent ordonné de générer des sous-sous-agents peut transmettre l'accès aux outils non restreints à ces sous-agents sauf si vous les restreignez également. Pour les limites de sécurité véritables, restreignez chaque couche de l'arborescence d'agent séparément.

**`description` est le champ le plus important après `name`.** Le routeur l'utilise pour décider quand déléguer ici. Une description vague ou générique cause un routage incorrect — soit l'agent se déclenche quand il ne devrait pas, soit il n'est jamais sélectionné. Écrivez la description comme une condition de déclenchement explicite, pas un résumé de capacité.

---
