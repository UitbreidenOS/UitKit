# Authoring Claude Code Plugins

Ein Plugin bündelt Skills, Agents, Hooks, Regeln und MCP-Konfigurationen in ein einziges installiertes Paket — ein Install-Befehl statt manuelles Kopieren von Dateien über Projekte oder Maschinen.

---

## Plugin-Struktur

Ein Plugin lebt in einem Verzeichnis namens `.claude-plugin/` an der Root eines npm-Pakets (oder lokaler Pfad). Die einzige erforderliche Datei ist `plugin.json`.

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

Component-Dateien folgen dem gleichen Format wie standalone Skills, Agents, Hooks und Regeln in der Claudient-Spezifikation.

---

## `plugin.json` Schema

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

### Field Reference

| Feld | Typ | Erforderlich | Beschreibung |
|---|---|---|---|
| `name` | string | ja | Plugin Identifier, muss einzigartig auf npm sein |
| `version` | string | ja | Semver — `1.0.0`, `2.3.1` |
| `description` | string | ja | Single Line, wird während Installation angezeigt |
| `status` | `"draft"` \| `"published"` | ja | Top-Level Status; `draft` unterdrückt alle Exports |
| `components` | array | ja | Liste von Component-Definitionen |
| `components[].type` | string | ja | `skill`, `agent`, `hook`, `rule`, `mcp-config` |
| `components[].path` | string | ja | Relativer Pfad vom Plugin-Root |
| `components[].export` | boolean | ja | `true` = sichtbar für Benutzer; `false` = interne Nutzung |
| `components[].status` | `"draft"` \| `"published"` | ja | Per-Component Override |
| `components[].hookEvent` | string | nur Hooks | `PreToolCall`, `PostToolCall`, `Stop`, `SubagentStop`, `Notification` |

### Draft vs Published

- `"status": "draft"` auf Top-Level hält alle Components privat — Installation erfolgreich aber keine Components registriert.
- `"status": "draft"` auf einer Component hält diese einzelne Component privat, während die Rest aktiv sind.
- Top-Level auf `"published"` setzen und eine Component auf `"draft"` ist das richtige Pattern für Versand eines Plugins mit unreleased Features.

---

## Installation

**Von npm:**
```bash
npx claudient add plugin my-plugin-package
npx claudient add plugin @org/my-plugin
```

**Von einem lokalen Pfad:**
```bash
npx claudient add plugin ./path/to/my-plugin
```

**Von einer URL (v2.1.90+):**
```bash
claude plugin load https://example.com/plugin.zip
```

Plugins, die pro-Projekt installiert werden, schreiben zu `.claude/plugins/`. Plugins, die global installiert werden, schreiben zu `~/.claude/plugins/`.

---

## Plugin Scopes

| Scope | Install-Befehl | Location | Wer beeinflusst |
|---|---|---|---|
| Per-Projekt | `npx claudient add plugin <pkg> --project` | `.claude/plugins/` | Nur dieses Projekt |
| User-Global | `npx claudient add plugin <pkg> --global` | `~/.claude/plugins/` | Alle Projekte für diesen Benutzer |

Standard ist per-Projekt. Verwenden Sie `--global` für persönliche Tooling (Ihre bevorzugten Agents, Produktivitäts-Skills) und per-Projekt für Team-gemeinsame Tooling.

---

## Plugin lokal testen

Verwenden Sie ein Symlink, damit Edits ohne Neuinstallation sofort wirksam werden.

```bash
# Von der Plugin-Root
npm link

# Im Projekt, wo Sie es testen möchten
npm link my-plugin-package
npx claudient add plugin my-plugin-package
```

Oder verwenden Sie das `scripts/link-skills.sh` Pattern, wenn Sie ein Claudient-Style Repo unterhalten:

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

## Plugin Versioning

Folgen Sie Semver streng:

| Änderung | Version Bump |
|---|---|
| Neue Components hinzugefügt, existierende unverändert | Minor (`1.1.0`) |
| Existierende Component-Instruktionen geändert | Patch (`1.0.1`) |
| Component entfernt oder umbenannt (Breaking) | Major (`2.0.0`) |
| Hook Event-Typ geändert | Major (`2.0.0`) |

Unterhalten Sie eine `CHANGELOG.md` an der Plugin-Root. Benutzer, die Plugins upgraden, müssen wissen, was sich geändert hat, besonders für Hooks und Agents, die autonom laufen.

---

## Publishing zu npm

```bash
# Stellen Sie sicher, dass "claudient-plugin" in Keywords für Entdeckbarkeit ist
npm publish --access public
```

Minimum `package.json` für ein publishbares Plugin:

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

Das `claudient-plugin` Keyword macht das Plugin auffindbar via `npx claudient search plugins <query>`.

---

## Voll `plugin.json` Beispiel

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
