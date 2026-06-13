# Authoring Claude Code Plugins

A plugin bundles skills, agents, hooks, rules, and MCP configs into a single installable package — one install command instead of manually copying files across projects or machines.

---

## Plugin Structure

A plugin lives in a directory named `.claude-plugin/` at the root of an npm package (or local path). The only required file is `plugin.json`.

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

Component files follow the same format as standalone skills, agents, hooks, and rules in the Claudient spec.

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

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | yes | Plugin identifier, must be unique on npm |
| `version` | string | yes | Semver — `1.0.0`, `2.3.1` |
| `description` | string | yes | Single line, shown during install |
| `status` | `"draft"` \| `"published"` | yes | Top-level status; `draft` suppresses all exports |
| `components` | array | yes | List of component definitions |
| `components[].type` | string | yes | `skill`, `agent`, `hook`, `rule`, `mcp-config` |
| `components[].path` | string | yes | Relative path from plugin root |
| `components[].export` | boolean | yes | `true` = visible to users; `false` = internal use |
| `components[].status` | `"draft"` \| `"published"` | yes | Per-component override |
| `components[].hookEvent` | string | hooks only | `PreToolCall`, `PostToolCall`, `Stop`, `SubagentStop`, `Notification` |

### Draft vs Published

- `"status": "draft"` at the top level keeps all components private — install succeeds but no components are registered.
- `"status": "draft"` on a component keeps that single component private while the rest are active.
- Setting top-level to `"published"` and a component to `"draft"` is the correct pattern for shipping a plugin with unreleased features.

---

## Installation

**From npm:**
```bash
npx claudient add plugin my-plugin-package
npx claudient add plugin @org/my-plugin
```

**From a local path:**
```bash
npx claudient add plugin ./path/to/my-plugin
```

**From a URL (v2.1.90+):**
```bash
claude plugin load https://example.com/plugin.zip
```

Plugins installed per-project write to `.claude/plugins/`. Plugins installed globally write to `~/.claude/plugins/`.

---

## Plugin Scopes

| Scope | Install command | Location | Who it affects |
|---|---|---|---|
| Per-project | `npx claudient add plugin <pkg> --project` | `.claude/plugins/` | Only this project |
| User-global | `npx claudient add plugin <pkg> --global` | `~/.claude/plugins/` | All projects for this user |

Default is per-project. Use `--global` for personal tooling (your preferred agents, productivity skills) and per-project for team-shared tooling.

---

## Testing a Plugin Locally

Use a symlink so edits take effect immediately without reinstalling.

```bash
# From the plugin root
npm link

# In the project where you want to test it
npm link my-plugin-package
npx claudient add plugin my-plugin-package
```

Or use the `scripts/link-skills.sh` pattern if you maintain a Claudient-style repo:

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

Follow semver strictly:

| Change | Version bump |
|---|---|
| New components added, existing unchanged | Minor (`1.1.0`) |
| Existing component instructions changed | Patch (`1.0.1`) |
| Component removed or renamed (breaking) | Major (`2.0.0`) |
| Hook event type changed | Major (`2.0.0`) |

Maintain a `CHANGELOG.md` at the plugin root. Users upgrading plugins need to know what changed, especially for hooks and agents that run autonomously.

---

## Publishing to npm

```bash
# Ensure "claudient-plugin" is in keywords for discoverability
npm publish --access public
```

Minimum `package.json` for a publishable plugin:

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

The `claudient-plugin` keyword makes the plugin discoverable via `npx claudient search plugins <query>`.

---

## Full `plugin.json` Example

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
