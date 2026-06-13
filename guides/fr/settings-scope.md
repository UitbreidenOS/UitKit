# Référence de Portée des Paramètres — Global vs Projet

Tout dans Claude Code existe soit à la portée **globale** (`~/.claude/`) soit à la portée **projet** (`.claude/`). Certaines fonctionnalités sont globales uniquement. Ce guide est la référence faisant autorité pour savoir où les choses vivent et comment elles interagissent.

---

## Vue d'ensemble de la Portée

| Fonctionnalité | Global (`~/.claude/`) | Projet (`.claude/`) | Notes |
|---|---|---|---|
| `CLAUDE.md` | `~/.claude/CLAUDE.md` | `CLAUDE.md` (racine du repo) | Les deux sont chargés ; concaténés au démarrage |
| `settings.json` | `~/.claude/settings.json` | `.claude/settings.json` | Fusionnés ; le projet remplace le global |
| `settings.local.json` | `~/.claude/settings.local.json` | `.claude/settings.local.json` | Remplacements personnels ; gitignorés |
| Compétences | `~/.claude/skills/` | `.claude/skills/` | Les deux actifs simultanément |
| Agents | `~/.claude/agents/` | `.claude/agents/` | Les deux actifs simultanément |
| Hooks | `~/.claude/settings.json` | `.claude/settings.json` | Les deux se déclenchent ; les tableaux sont concaténés |
| Règles | `~/.claude/rules/` | `.claude/rules/` | Les deux actifs ; appariés par frontmatter `paths:` |
| Serveurs MCP | `~/.claude.json` | `.claude/mcp.json` | Fusionnés au démarrage |
| Tâches | `~/.claude/tasks/` | — | Global uniquement |
| Équipes d'agents | `~/.claude/teams/` | — | Global uniquement |
| Keybindings | `~/.claude/keybindings.json` | — | Global uniquement |
| Fichiers mémoire | `~/.claude/memory/` | — | Global uniquement |
| Credentials / tokens | `~/.claude/` | — | Global uniquement ; ne jamais committer |

---

## `settings.local.json`

Les deux portées supportent une variante `.local.json` pour les remplacements personnels :

- `~/.claude/settings.local.json` — remplacements globaux personnels (jamais committés)
- `.claude/settings.local.json` — remplacements projet personnels (gitignorés par défaut)

Utilisez `.local.json` pour remplacer les paramètres validés en équipe sans toucher à la configuration partagée. Cas d'usage courants : désactiver un hook pendant le débogage, définir un `ANTHROPIC_BASE_URL` personnel, remplacer le modèle par défaut.

L'ordre de chargement dans chaque portée est :

1. `settings.json` (base)
2. `settings.local.json` (remplacements de base)

---

## Comportement de Fusion

Lorsque la même clé existe à la fois au niveau global et au niveau projet :

| Type de clé | Comportement |
|---|---|
| Scalaire (`model`, `effort`, flags de chaîne) | Le projet gagne — la valeur globale est ignorée |
| Tableaux (`hooks`, `tools`, `permissions`) | Concaténés — les deux valeurs sont actives |
| Objets imbriqués | Fusionnés récursivement ; les clés projet gagnent en cas de conflit |

**Critique :** les tableaux de hooks sont concaténés, pas remplacés. Si vous définissez un hook `Stop` global et un hook `Stop` dans le projet, **les deux se déclenchent**. C'est souvent le comportement prévu (les hooks globaux gèrent l'audit ; les hooks projet gèrent la validation spécifique au projet), mais cela peut causer une exécution dupliquée si le même hook est défini dans les deux portées par accident.

---

## Ordre de Chargement de CLAUDE.md

Tous les éléments suivants sont chargés et concaténés dans le contexte au démarrage de la session :

1. `~/.claude/CLAUDE.md` — instructions utilisateur globales
2. `CLAUDE.md` à la racine du repo — instructions projet
3. Fichiers `CLAUDE.md` dans les répertoires parents entre le fichier actuel et la racine du repo (remontée)
4. Fichiers `.claude/rules/*.md` dont le frontmatter `paths:` correspond au fichier actuel

Les entrées ultérieures ne remplacent pas les antérieures — tout le contenu est actif simultanément. Si les entrées entrent en conflit, le contenu au niveau du projet a une précédence pratique car il apparaît plus tard dans le prompt concaténé, mais il n'existe pas de mécanisme de remplacement explicite entre les fichiers CLAUDE.md.

**Budget de jetons :** Le contenu CLAUDE.md combiné compte contre la fenêtre de contexte. Si toutes les sources dépassent le budget, les sources plus anciennes ou de priorité inférieure sont coupées. Gardez CLAUDE.md global concis — il se charge pour chaque projet.

---

## Disposition du Répertoire de Portée Projet

Une portée projet bien structurée ressemble à :

```
.claude/
  settings.json         # committer — configuration d'équipe
  settings.local.json   # gitignorés — remplacements personnels
  mcp.json              # committer — serveurs MCP projet
  skills/
    feature-name.md     # commandes slash spécifiques au projet
  agents/
    specialist.md       # sous-agents spécifiques au projet
  rules/
    style.md            # règles toujours actives (pas de paths: = toujours actif)
    tests.md            # paths: ["**/*.test.ts"] = activation automatique
  hooks/
    validate.sh         # scripts hook (référencés depuis settings.json)
  memory/               # mémoire de session (gitignorée)
```

---

## Disposition du Répertoire de Portée Globale

```
~/.claude/
  CLAUDE.md             # instructions globales, chargées pour chaque projet
  settings.json         # paramètres globaux par défaut
  settings.local.json   # remplacements globaux personnels
  skills/               # compétences actives dans chaque projet
  agents/               # agents disponibles dans chaque projet
  rules/                # règles actives dans chaque projet
  tasks/                # listes de tâches entre sessions
  teams/                # définitions d'équipes d'agents
  keybindings.json      # remappage de clés
  memory/               # mémoire persistante entre projets
```

---

## Pièges Courants

**Committer les fichiers `.local.json`.** Ils sont gitignorés par défaut, mais si vous les ajoutez de force vous exposez les clés API personnelles ou les remplacements de point de terminaison à l'équipe. Ajoutez explicitement `settings.local.json` à `.gitignore` s'il n'est pas déjà couvert.

**Définir le même hook dans les deux portées.** Le hook se déclenche deux fois. C'est particulièrement perturbant pour les hooks qui écrivent des journaux d'audit — vous obtenez des entrées dupliquées. Auditez une fois globalement ; validez par projet.

**Mettre tout dans le CLAUDE.md global.** CLAUDE.md global se charge pour chaque projet. L'encombrer avec des instructions spécifiques au projet gaspille des jetons sur les sessions sans rapport. Mettez les instructions spécifiques au projet dans le `CLAUDE.md` du projet.

**En supposant que les compétences remontent l'arborescence.** Elles ne le font pas. Les fichiers CLAUDE.md remontent ; les compétences ne le font pas. Une compétence dans `/workspace/project/.claude/skills/` n'est pas visible quand Claude travaille dans `/workspace/project/packages/api/`. Chaque sous-paquet a besoin de son propre `.claude/skills/` pour les compétences spécifiques à un paquet.

---
