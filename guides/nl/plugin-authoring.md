# Claude Code Plugins ontwerpen

Een plugin bundelt skills, agents, hooks, rules en MCP configs in een enkel installeerbaar pakket — één installatieopdracht in plaats van handmatig bestanden over projecten of machines te kopiëren.

---

## Plugin-structuur

Een plugin leeft in een directory met de naam `.claude-plugin/` in de root van een npm-pakket (of lokaal pad). Het enige vereiste bestand is `plugin.json`.

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

Component files volgen dezelfde indeling als standalone skills, agents, hooks en rules in de Claudient spec.

---

## `plugin.json`-schema

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

### Veldverwijzing

| Veld | Type | Vereist | Beschrijving |
|---|---|---|---|
| `name` | string | ja | Plugin-ID, moet uniek zijn op npm |
| `version` | string | ja | Semver — `1.0.0`, `2.3.1` |
| `description` | string | ja | Één regel, weergegeven tijdens installatie |
| `status` | `"draft"` \| `"published"` | ja | Top-level status; `draft` onderdrukt alle exports |
| `components` | array | ja | Lijst van componentdefinities |
| `components[].type` | string | ja | `skill`, `agent`, `hook`, `rule`, `mcp-config` |
| `components[].path` | string | ja | Relatief pad van plugin root |
| `components[].export` | boolean | ja | `true` = zichtbaar voor gebruikers; `false` = intern gebruik |
| `components[].status` | `"draft"` \| `"published"` | ja | Per-component override |
| `components[].hookEvent` | string | hooks alleen | `PreToolCall`, `PostToolCall`, `Stop`, `SubagentStop`, `Notification` |

### Concept versus Gepubliceerd

- `"status": "draft"` op het top-niveau houdt alle componenten private — installatie slaagt maar geen componenten worden geregistreerd.
- `"status": "draft"` op een component houdt die enkele component private terwijl de rest actief is.
- Top-level instellen op `"published"` en een component op `"draft"` is het correcte patroon voor het verzenden van een plugin met niet-vrijgegeven functies.

---

## Installatie

**Van npm:**
```bash
npx claudient add plugin my-plugin-package
npx claudient add plugin @org/my-plugin
```

**Van een lokaal pad:**
```bash
npx claudient add plugin ./path/to/my-plugin
```

**Van een URL (v2.1.90+):**
```bash
claude plugin load https://example.com/plugin.zip
```

Plugins geïnstalleerd per-project schrijven naar `.claude/plugins/`. Plugins geïnstalleerd globaal schrijven naar `~/.claude/plugins/`.

---

## Plugin-bereiken

| Bereik | Installatieopdracht | Locatie | Wie dit beïnvloedt |
|---|---|---|---|
| Per-project | `npx claudient add plugin <pkg> --project` | `.claude/plugins/` | Alleen dit project |
| User-global | `npx claudient add plugin <pkg> --global` | `~/.claude/plugins/` | Alle projecten voor deze gebruiker |

Standaard is per-project. Gebruik `--global` voor persoonlijk gereedschap (uw voorkeur agents, productiviteitsvaardigheden) en per-project voor teamgedeeld gereedschap.

---

## Een Plugin lokaal testen

Gebruik een symlink zodat bewerkingen onmiddellijk effect hebben zonder opnieuw in te stellen.

```bash
# From the plugin root
npm link

# In the project where you want to test it
npm link my-plugin-package
npx claudient add plugin my-plugin-package
```

Of gebruik het `scripts/link-skills.sh`-patroon als u een Claudient-stijl repo onderhoudt:

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

## Plugin-versiering

Volg semver strikt:

| Wijziging | Versie bump |
|---|---|
| Nieuwe componenten toegevoegd, bestaande ongewijzigd | Minor (`1.1.0`) |
| Bestaande componentinstructies gewijzigd | Patch (`1.0.1`) |
| Component verwijderd of hernoemd (breaking) | Major (`2.0.0`) |
| Hook event type gewijzigd | Major (`2.0.0`) |

Onderhoud een `CHANGELOG.md` in de plugin root. Gebruikers die plugins upgraden moeten weten wat er veranderde, vooral voor hooks en agents die autonoom werken.

---

## Publiceren naar npm

```bash
# Ensure "claudient-plugin" is in keywords for discoverability
npm publish --access public
```

Minimum `package.json` voor een publiceerbare plugin:

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

Het `claudient-plugin` trefwoord maakt de plugin ontdekt via `npx claudient search plugins <query>`.

---

## Volledig `plugin.json`-voorbeeld

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
