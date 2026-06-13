# Création de plugins Claude Code

Un plugin regroupe les compétences, les agents, les hooks, les règles et les configurations MCP en un seul package installable — une seule commande d'installation au lieu de copier manuellement les fichiers sur les projets ou les machines.

---

## Structure du plugin

Un plugin vit dans un répertoire nommé `.claude-plugin/` à la racine d'un package npm (ou chemin local). Le seul fichier requis est `plugin.json`.

```
my-plugin/
├── plugin.json
├── skills/
│   ├── my-skill.md
│   └── another-skill.md
├── agents/
│   └── my-agent.md
├── hooks/
│   └── pre-tool-call.sh
├── rules/
│   └── coding-standards.md
└── mcp-configs/
    └── my-server.json
```

Les fichiers de composants suivent le même format que les compétences, les agents, les hooks et les règles autonomes dans la spécification Claudient.

---

## Schéma `plugin.json`

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "What this plugin provides",
  "status": "published",
  "components": [
    {
      "type": "skill",
      "path": "skills/my-skill.md",
      "export": true,
      "status": "published"
    },
    {
      "type": "agent",
      "path": "agents/my-agent.md",
      "export": true,
      "status": "published"
    },
    {
      "type": "hook",
      "path": "hooks/pre-tool-call.sh",
      "export": true,
      "status": "published",
      "hookEvent": "PreToolCall"
    },
    {
      "type": "rule",
      "path": "rules/coding-standards.md",
      "export": false,
      "status": "draft"
    },
    {
      "type": "mcp-config",
      "path": "mcp-configs/my-server.json",
      "export": true,
      "status": "published"
    }
  ]
}
```

### Référence de champ

| Champ | Type | Requis | Description |
|---|---|---|---|
| `name` | string | oui | Identifiant du plugin, doit être unique sur npm |
| `version` | string | oui | Semver — `1.0.0`, `2.3.1` |
| `description` | string | oui | Une seule ligne, affichée lors de l'installation |
| `status` | `"draft"` \| `"published"` | oui | Statut de niveau supérieur ; `draft` supprime tous les exports |
| `components` | array | oui | Liste des définitions de composants |
| `components[].type` | string | oui | `skill`, `agent`, `hook`, `rule`, `mcp-config` |
| `components[].path` | string | oui | Chemin relatif à partir de la racine du plugin |
| `components[].export` | boolean | oui | `true` = visible aux utilisateurs ; `false` = utilisation interne |
| `components[].status` | `"draft"` \| `"published"` | oui | Remplacement par composant |
| `components[].hookEvent` | string | hooks uniquement | `PreToolCall`, `PostToolCall`, `Stop`, `SubagentStop`, `Notification` |

### Brouillon vs publié

- `"status": "draft"` au niveau supérieur garde tous les composants privés — l'installation réussit mais aucun composant n'est enregistré.
- `"status": "draft"` sur un composant garde ce seul composant privé alors que le reste est actif.
- Définir le niveau supérieur à `"published"` et un composant à `"draft"` est le modèle correct pour l'expédition d'un plugin avec des fonctionnalités non publiées.

---

## Installation

**À partir de npm :**
```bash
npx claudient add plugin my-plugin-package
npx claudient add plugin @org/my-plugin
```

**À partir d'un chemin local :**
```bash
npx claudient add plugin ./path/to/my-plugin
```

**À partir d'une URL (v2.1.90+) :**
```bash
claude plugin load https://example.com/plugin.zip
```

Les plugins installés par projet écrivent à `.claude/plugins/`. Les plugins installés globalement écrivent à `~/.claude/plugins/`.

---

## Étendues du plugin

| Étendue | Commande d'installation | Emplacement | Qui cela affecte |
|---|---|---|---|
| Par projet | `npx claudient add plugin <pkg> --project` | `.claude/plugins/` | Uniquement ce projet |
| Global utilisateur | `npx claudient add plugin <pkg> --global` | `~/.claude/plugins/` | Tous les projets pour cet utilisateur |

La valeur par défaut est par projet. Utilisez `--global` pour les outils personnels (vos agents préférés, compétences de productivité) et par projet pour les outils partagés en équipe.

---

## Tester un plugin localement

Utilisez un lien symbolique pour que les modifications prennent effet immédiatement sans réinstallation.

```bash
# À partir de la racine du plugin
npm link

# Dans le projet où vous voulez le tester
npm link my-plugin-package
npx claudient add plugin my-plugin-package
```

Ou utiliser le modèle `scripts/link-skills.sh` si vous maintenez un référentiel de style Claudient :

```bash
#!/bin/bash
# scripts/link-skills.sh
PLUGIN_ROOT=$(pwd)
CLAUDE_DIR="${PROJECT_DIR:-$PLUGIN_ROOT}/.claude"

mkdir -p "$CLAUDE_DIR/skills" "$CLAUDE_DIR/agents"

for skill in "$PLUGIN_ROOT/skills/"*.md; do
  ln -sf "$skill" "$CLAUDE_DIR/skills/"
done

for agent in "$PLUGIN_ROOT/agents/"*.md; do
  ln -sf "$agent" "$CLAUDE_DIR/agents/"
done

echo "Linked plugin components to $CLAUDE_DIR"
```

---

## Versioning du plugin

Suivez semver strictement :

| Changement | Augmentation de version |
|---|---|
| Nouveaux composants ajoutés, existants inchangés | Mineur (`1.1.0`) |
| Les instructions de composant existantes ont changé | Patch (`1.0.1`) |
| Composant supprimé ou renommé (casse-cou) | Majeur (`2.0.0`) |
| Type d'événement hook changé | Majeur (`2.0.0`) |

Maintenir un `CHANGELOG.md` à la racine du plugin. Les utilisateurs mettant à niveau les plugins doivent savoir ce qui a changé, surtout pour les hooks et les agents qui s'exécutent de manière autonome.

---

## Publication sur npm

```bash
# Assurez-vous que "claudient-plugin" est dans les mots-clés pour la découverte
npm publish --access public
```

`package.json` minimum pour un plugin publiable :

```json
{
  "name": "claudient-plugin-my-tool",
  "version": "1.0.0",
  "description": "What this plugin provides",
  "keywords": ["claudient-plugin", "claude-code"],
  "files": [
    "plugin.json",
    "skills/",
    "agents/",
    "hooks/",
    "rules/",
    "mcp-configs/"
  ]
}
```

Le mot-clé `claudient-plugin` rend le plugin découvrable via `npx claudient search plugins <query>`.

---

## Exemple complet `plugin.json`

```json
{
  "name": "cloudient-plugin-backend-toolkit",
  "version": "1.2.0",
  "description": "Production-ready skills and agents for Node.js backend development",
  "status": "published",
  "components": [
    {
      "type": "skill",
      "path": "skills/express-api.md",
      "export": true,
      "status": "published"
    },
    {
      "type": "skill",
      "path": "skills/drizzle-migrations.md",
      "export": true,
      "status": "published"
    },
    {
      "type": "agent",
      "path": "agents/db-specialist.md",
      "export": true,
      "status": "published"
    },
    {
      "type": "hook",
      "path": "hooks/lint-on-save.sh",
      "export": true,
      "status": "published",
      "hookEvent": "PostToolCall"
    },
    {
      "type": "rule",
      "path": "rules/no-any-typescript.md",
      "export": true,
      "status": "published"
    },
    {
      "type": "mcp-config",
      "path": "mcp-configs/postgres-mcp.json",
      "export": true,
      "status": "published"
    },
    {
      "type": "skill",
      "path": "skills/experimental-feature.md",
      "export": false,
      "status": "draft"
    }
  ]
}
```

---
