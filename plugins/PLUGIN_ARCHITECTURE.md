# Plugin Architecture Specification

## Overview

The Claudient plugin system is a modular framework for organizing and distributing skills, agents, rules, and other Claude Code knowledge components. Plugins serve as self-contained, versionable units that can be installed, enabled, disabled, and uninstalled independently while managing dependencies and lifecycle events.

---

## Plugin Manifest Format (plugin.json)

Every plugin must include a `plugin.json` manifest file in its `.claude-plugin/` directory.

### Manifest Schema

```json
{
  "$schema": "https://json.schemastore.org/claude-code-plugin-manifest.json",
  "name": "plugin-id",
  "displayName": "Human-Readable Plugin Name",
  "version": "1.0.0",
  "description": "Short description of plugin purpose and contents",
  "author": {
    "name": "Author Name",
    "email": "email@example.com",
    "url": "https://example.com"
  },
  "homepage": "https://github.com/path/to/repo",
  "repository": "https://github.com/path/to/repo",
  "license": "CC-BY-SA-4.0 | MIT | Apache-2.0",
  "keywords": ["keyword1", "keyword2"],
  "engines": {
    "claude-code": ">=1.0.0"
  },
  "dependencies": {
    "other-plugin": "^1.0.0"
  },
  "devDependencies": {
    "build-plugin": "^1.0.0"
  },
  "activationEvents": ["onLoad", "onCommand:skillId"],
  "skills": [
    "./skills/",
    {
      "path": "./skills/custom/",
      "namespace": "custom"
    }
  ],
  "agents": ["./agents/"],
  "hooks": ["./hooks/"],
  "rules": ["./rules/"],
  "mcp": {
    "servers": ["./mcp/servers.json"]
  },
  "config": {
    "required": ["apiKey"],
    "schema": {
      "apiKey": {
        "type": "string",
        "title": "API Key",
        "description": "Required API key for service"
      },
      "debug": {
        "type": "boolean",
        "title": "Debug Mode",
        "default": false
      }
    }
  },
  "commands": [
    {
      "id": "plugin.action",
      "title": "Plugin Action",
      "category": "Plugin",
      "when": "plugin.ready"
    }
  ],
  "contributes": {
    "settings": {
      "plugin.setting": {
        "type": "boolean",
        "default": true,
        "description": "Example setting"
      }
    }
  }
}
```

### Manifest Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Plugin identifier (kebab-case, lowercase). Used in CLI commands and configuration. |
| `displayName` | string | Yes | Human-readable plugin name shown in UI/marketplace. |
| `version` | string | Yes | Semantic version (MAJOR.MINOR.PATCH). Must increase with each release. |
| `description` | string | Yes | Brief description (<200 chars) of plugin purpose and key features. |
| `author` | object | Yes | Author metadata: `name`, `email` (optional), `url` (optional). |
| `homepage` | string | No | Project homepage URL. |
| `repository` | string | No | Git repository URL (GitHub, GitLab, etc.). |
| `license` | string | Yes | SPDX license identifier. Default: `CC-BY-SA-4.0`. |
| `keywords` | array | No | Search keywords (3-10) for plugin discovery. |
| `engines` | object | No | Platform requirements: `claude-code` (min version required). |
| `dependencies` | object | No | Other plugins required by this plugin. Version constraints apply. |
| `devDependencies` | object | No | Plugins needed only for development/testing. |
| `activationEvents` | array | No | When plugin should activate. See [Activation Events](#activation-events). |
| `skills` | array | No | Paths to skill directories or inline definitions. |
| `agents` | array | No | Paths to agent directories. |
| `hooks` | array | No | Paths to hook definitions. |
| `rules` | array | No | Paths to rules directories. |
| `mcp` | object | No | MCP server configurations. |
| `config` | object | No | Plugin configuration schema and requirements. |
| `commands` | array | No | Custom CLI commands provided by plugin. |
| `contributes` | object | No | VSCode-style contributions (settings, themes, etc.). |

### Directory Structure

```
my-plugin/
├── .claude-plugin/
│   ├── plugin.json           # Plugin manifest (required)
│   └── marketplace.json      # Marketplace metadata (optional)
├── skills/
│   ├── feature-one.md
│   └── category/
│       └── feature-two.md
├── agents/
│   └── specialist.md
├── hooks/
│   └── lifecycle-hook.sh
├── rules/
│   └── coding-standards.md
├── mcp/
│   └── servers.json
├── README.md
└── CHANGELOG.md
```

---

## Activation Events

Plugins specify `activationEvents` to control when they load and become available. Lazy-loading improves startup performance.

### Event Types

| Event | Trigger | Example |
|-------|---------|---------|
| `onLoad` | Plugin loads immediately on Claude Code startup. | Performance-critical plugins. |
| `onCommand:skillId` | When user invokes a slash command. | `/fastapi` activates FastAPI plugin. |
| `onCommand:agent:id` | When agent is spawned. | Specialist agents load only when needed. |
| `onLanguage:lang` | When file with language is opened. | `onLanguage:typescript` → TypeScript plugin. |
| `onStartupFinished` | After all `onLoad` plugins finish. | Secondary setup tasks. |
| `onConfigChange:section` | When config section is modified. | Custom behavior on user settings changes. |
| `onFileExists:pattern` | When file matching glob pattern exists. | Monorepo detection, package.json existence. |

### Example

```json
{
  "activationEvents": [
    "onLoad",
    "onCommand:react",
    "onCommand:vue",
    "onLanguage:typescript",
    "onFileExists:package.json"
  ]
}
```

---

## Dependency Resolution

Plugins can depend on other plugins. The system enforces a dependency graph at install/enable time.

### Version Constraints

Dependencies use npm-style semantic versioning:

```json
{
  "dependencies": {
    "claudient-backend": "^1.0.0",
    "claudient-database": "~1.5.0",
    "other-plugin": "1.2.3"
  }
}
```

| Constraint | Meaning |
|-----------|---------|
| `1.2.3` | Exact version. |
| `^1.2.3` | >=1.2.3, <2.0.0 (compatible with current major). |
| `~1.2.3` | >=1.2.3, <1.3.0 (compatible with current major.minor). |
| `*` or `latest` | Latest available version. |
| `>=1.2.0 <2.0.0` | Range constraint. |

### Dependency Validation

When a plugin is installed or enabled:

1. **Resolve Graph** — Determine all transitive dependencies.
2. **Validate Versions** — Ensure no conflicting version constraints.
3. **Check Engines** — Verify Claude Code version compatibility.
4. **Warn on Conflicts** — Alert if multiple plugins require incompatible versions of same dependency.

### Circular Dependencies

Circular dependencies are **forbidden** and trigger an error during validation.

---

## Plugin Lifecycle

Plugins move through states: `uninstalled` → `installed` → `enabled` → `disabled` → `uninstalled`.

### States

```
┌─────────────────────────────────────────────────────────────┐
│                      UNINSTALLED                             │
└────────────────────┬────────────────────────────────────────┘
                     │ npm install plugin
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                      INSTALLED                               │
│   (plugin.json loaded, metadata available, not activated)   │
└────────────┬──────────────────────────────────────────┬─────┘
             │ enable                    │ uninstall
             │                           │
             ▼                           ▼
┌──────────────────────────┐   ┌──────────────────────────────┐
│       ENABLED            │   │    UNINSTALLED               │
│ (active, hooked)         │   │ (removed from disk/registry) │
│                          │   └──────────────────────────────┘
└──────────┬───────────────┘
           │ disable
           ▼
┌──────────────────────────┐
│      DISABLED            │
│ (not active, retained)   │
└──────────────────────────┘
```

### Installation

```bash
claude install @claudient/backend
# or
claude install ./plugins/my-plugin
```

**On Install:**
1. Download/copy plugin files.
2. Validate `plugin.json` schema.
3. Resolve and check dependencies.
4. Execute `onInstall` hooks if defined.
5. Register plugin metadata in local registry.
6. Plugin state → `installed` (disabled by default).

### Enablement

```bash
claude enable @claudient/backend
```

**On Enable:**
1. Verify dependencies are installed and enabled.
2. Validate configuration requirements.
3. Execute `onEnable` hooks.
4. Load skills, agents, rules, MCP configs.
5. Register activation event listeners.
6. Execute `onStartup` hooks.
7. Plugin state → `enabled`.

### Disablement

```bash
claude disable @claudient/backend
```

**On Disable:**
1. Execute `onDisable` hooks.
2. Unload skills, agents, rules, MCP configs.
3. Remove activation event listeners.
4. Clear from active registry.
5. Retain on disk for re-enabling.
6. Plugin state → `disabled`.

### Uninstallation

```bash
claude uninstall @claudient/backend
```

**On Uninstall:**
1. If enabled, disable first (run `onDisable` hooks).
2. Execute `onUninstall` hooks.
3. Delete plugin directory and all files.
4. Remove from local registry.
5. Plugin state → `uninstalled`.

---

## Hooks System

Hooks are lifecycle events that plugins can define to run custom code at specific stages.

### Hook Types

Hooks are defined in `.claude-plugin/hooks/` as shell scripts (`.sh`) or Python (`.py`).

#### Installation Hooks

**`onInstall`** — Runs after plugin files are copied, before dependencies are resolved.
```bash
# .claude-plugin/hooks/on-install.sh
#!/bin/bash
echo "Installing $(cat plugin.json | jq -r '.name')"
```

**`onPostInstall`** — Runs after successful installation, before enabling.
```bash
# Download external resources, validate setup
```

#### Enablement Hooks

**`onEnable`** — Runs before plugin is activated.
```bash
# Prepare runtime environment, validate configs
```

**`onStartup`** — Runs after plugin is fully loaded.
```bash
# Initialize connections, warm up caches
```

#### Disablement Hooks

**`onDisable`** — Runs when plugin is disabled (before unloading).
```bash
# Clean up connections, save state
```

#### Uninstallation Hooks

**`onUninstall`** — Runs before plugin files are deleted.
```bash
# Archive settings, cleanup external data
```

### Hook Definition in Manifest

```json
{
  "hooks": {
    "onInstall": "./hooks/install.sh",
    "onPostInstall": "./hooks/post-install.py",
    "onEnable": "./hooks/enable.sh",
    "onStartup": "./hooks/startup.sh",
    "onDisable": "./hooks/disable.sh",
    "onUninstall": "./hooks/uninstall.sh"
  }
}
```

### Hook Environment Variables

Hooks receive these variables:

| Variable | Value | Example |
|----------|-------|---------|
| `PLUGIN_NAME` | Plugin identifier | `claudient-backend` |
| `PLUGIN_VERSION` | Plugin version | `1.10.1` |
| `PLUGIN_ROOT` | Plugin directory path | `/path/to/plugins/claudient-backend` |
| `CLAUDE_CODE_VERSION` | Claude Code version | `1.5.0` |
| `CLAUDE_CONFIG_DIR` | Config directory | `~/.claude` |

### Hook Exit Codes

- `0` — Success; continue with next step.
- Non-zero — Failure; abort operation and rollback.

---

## Configuration Schema

Plugins can define required and optional configuration.

### Config Definition

```json
{
  "config": {
    "required": ["apiKey"],
    "schema": {
      "apiKey": {
        "type": "string",
        "title": "API Key",
        "description": "Service API key for authentication",
        "pattern": "^sk-[a-zA-Z0-9]{20,}$"
      },
      "endpoint": {
        "type": "string",
        "title": "API Endpoint",
        "default": "https://api.example.com",
        "description": "Custom endpoint URL"
      },
      "retryCount": {
        "type": "integer",
        "title": "Retry Attempts",
        "default": 3,
        "minimum": 0,
        "maximum": 10
      },
      "debug": {
        "type": "boolean",
        "title": "Debug Mode",
        "default": false
      }
    }
  }
}
```

### Configuration Validation

When a plugin is enabled:
1. Read values from `.claude/settings.json` (plugin section).
2. Check all `required` fields are present.
3. Validate against schema types and patterns.
4. Apply defaults for missing optional fields.
5. If validation fails, prevent enablement and show error.

### User Configuration

Users set plugin config in `.claude/settings.json`:

```json
{
  "plugins": {
    "claudient-backend": {
      "enabled": true,
      "apiKey": "sk-1234567890abcdef",
      "endpoint": "https://custom.example.com",
      "debug": false
    }
  }
}
```

---

## Content Registry

When enabled, plugins register their contents in the local plugin registry.

### Registry Entry Format

```json
{
  "pluginId": "claudient-backend",
  "pluginVersion": "1.10.1",
  "status": "enabled",
  "loadedAt": "2024-06-22T10:30:00Z",
  "contents": {
    "skills": [
      {
        "id": "backend/nodejs/nextjs",
        "file": "skills/backend/nodejs/nextjs.md",
        "namespace": "default"
      }
    ],
    "agents": [
      {
        "id": "roles/senior-backend",
        "file": "agents/roles/senior-backend.md"
      }
    ],
    "hooks": [
      {
        "event": "onStartupFinished",
        "path": "hooks/startup.sh"
      }
    ],
    "rules": [
      {
        "id": "common/coding-style",
        "file": "rules/common/coding-style.md"
      }
    ]
  }
}
```

### Namespace Resolution

Skills can be namespaced to avoid collisions:

```json
{
  "skills": [
    {
      "path": "./skills/",
      "namespace": "default"
    },
    {
      "path": "./skills/advanced/",
      "namespace": "advanced"
    }
  ]
}
```

Users invoke namespaced skills as `/advanced:skill-name`.

---

## Marketplace Metadata

The root `.claude-plugin/marketplace.json` catalogs all plugins for distribution.

### Marketplace Schema

```json
{
  "$schema": "https://code.claude.com/schema/marketplace.json",
  "name": "claudient",
  "description": "...",
  "owner": {
    "name": "tushar2704",
    "email": "email@example.com"
  },
  "metadata": {
    "pluginRoot": "./plugins",
    "registryUrl": "https://plugins.claudient.io",
    "cdnUrl": "https://cdn.claudient.io/plugins"
  },
  "plugins": [
    {
      "name": "claudient-backend",
      "source": "./plugins/claudient-backend",
      "description": "41 framework-specific skills covering Python, Node.js, Go, Rust, ...",
      "category": "backend",
      "version": "1.10.1",
      "author": {
        "name": "tushar2704"
      },
      "tags": ["python", "nodejs", "fullstack"],
      "stats": {
        "downloads": 5000,
        "rating": 4.8
      }
    }
  ]
}
```

---

## Error Handling

### Dependency Conflicts

```
ERROR: Dependency conflict detected
  - plugin-a requires: plugin-b@^1.0.0
  - plugin-c requires: plugin-b@^2.0.0
Solution: Update plugin-c or uninstall plugin-a
```

### Missing Dependencies

```
ERROR: Cannot enable plugin-a
  - Missing: plugin-b@^1.5.0
Action: Run 'claude install @scope/plugin-b'
```

### Version Incompatibility

```
ERROR: Plugin requires Claude Code >=1.2.0
  - Installed: 1.1.5
Action: Update Claude Code or downgrade plugin
```

### Configuration Validation Failure

```
ERROR: Plugin configuration invalid
  - Missing required field: apiKey
  - Invalid field: retryCount (expected integer, got string)
Action: Update ~/.claude/settings.json and re-enable plugin
```

### Hook Execution Failure

```
ERROR: onEnable hook failed for plugin-a (exit code 1)
  - Hook: ./hooks/enable.sh
  - Message: Connection to service refused
Action: Review hook logs and fix underlying issue
```

---

## Best Practices

### Plugin Design

1. **Single Responsibility** — Each plugin should have a cohesive purpose (e.g., backend frameworks, not "everything").
2. **Minimal Dependencies** — Depend only on plugins truly required; avoid circular dependencies.
3. **Clear Naming** — Use descriptive plugin names (`claudient-backend`, not `cbnd` or `plugin-1`).
4. **Semantic Versioning** — Strictly follow MAJOR.MINOR.PATCH versioning.
5. **Namespace Skills** — Group related skills under namespaces to avoid CLI collisions.

### Configuration

1. **Provide Defaults** — Most config should be optional with sensible defaults.
2. **Document Requirements** — Clearly state which fields are required and why.
3. **Validate Early** — Fail at enable time, not at runtime.
4. **Support Environment Variables** — Allow overrides via env vars for CI/CD.

### Hooks

1. **Keep Hooks Lightweight** — Avoid long-running operations in hooks.
2. **Handle Failures Gracefully** — Use try-catch and meaningful error messages.
3. **Clean Up Idempotently** — onUninstall hooks should safely run even if partial state exists.
4. **Log Clearly** — Output progress and errors to stderr/stdout for debugging.

### Documentation

1. **README** — Include plugin purpose, installation, config, and usage examples.
2. **CHANGELOG** — Document version history and breaking changes.
3. **Skill Descriptions** — Each skill should have clear "When to activate" and "When NOT to use" sections.
4. **API Docs** — Document any custom commands or hooks provided.

---

## Example Plugin

### Plugin Structure

```
my-ai-plugin/
├── .claude-plugin/
│   ├── plugin.json
│   └── hooks/
│       ├── on-enable.sh
│       └── on-disable.sh
├── skills/
│   ├── openai-integration.md
│   └── prompt-engineering.md
├── agents/
│   └── ai-specialist.md
├── README.md
└── CHANGELOG.md
```

### plugin.json

```json
{
  "$schema": "https://json.schemastore.org/claude-code-plugin-manifest.json",
  "name": "my-ai-plugin",
  "displayName": "My AI Plugin",
  "version": "1.0.0",
  "description": "Advanced AI/ML capabilities with OpenAI integration and prompt engineering.",
  "author": {
    "name": "Jane Doe",
    "email": "jane@example.com"
  },
  "license": "MIT",
  "keywords": ["openai", "llm", "prompt-engineering"],
  "engines": {
    "claude-code": ">=1.0.0"
  },
  "dependencies": {
    "claudient-ai-engineering": "^1.0.0"
  },
  "activationEvents": [
    "onCommand:openai",
    "onLanguage:markdown"
  ],
  "skills": ["./skills/"],
  "agents": ["./agents/"],
  "hooks": {
    "onEnable": "./hooks/on-enable.sh",
    "onDisable": "./hooks/on-disable.sh"
  },
  "config": {
    "required": ["openaiApiKey"],
    "schema": {
      "openaiApiKey": {
        "type": "string",
        "title": "OpenAI API Key",
        "description": "API key for OpenAI service"
      },
      "model": {
        "type": "string",
        "title": "Default Model",
        "default": "gpt-4",
        "enum": ["gpt-4", "gpt-3.5-turbo"]
      }
    }
  }
}
```

### hooks/on-enable.sh

```bash
#!/bin/bash
set -e

PLUGIN_NAME="${PLUGIN_NAME:-my-ai-plugin}"
PLUGIN_VERSION="${PLUGIN_VERSION:-1.0.0}"

echo "Enabling $PLUGIN_NAME v$PLUGIN_VERSION"

# Validate API key is set
if [ -z "$OPENAI_API_KEY" ] && ! grep -q "openaiApiKey" "$CLAUDE_CONFIG_DIR/settings.json" 2>/dev/null; then
  echo "ERROR: OpenAI API key not configured"
  exit 1
fi

echo "✓ Configuration validated"
exit 0
```

---

## CLI Commands

### Plugin Management

```bash
# Install plugin
claude install @scope/plugin-name
claude install ./path/to/local/plugin

# List plugins
claude plugins list
claude plugins list --enabled

# Enable/disable
claude enable @scope/plugin-name
claude disable @scope/plugin-name

# Uninstall
claude uninstall @scope/plugin-name

# Show details
claude plugins info @scope/plugin-name

# Validate manifest
claude plugins validate ./plugins/my-plugin

# Update all
claude plugins update --all
```

---

## Version Compatibility Matrix

| Claude Code | Plugin SDK | Breaking Changes |
|-------------|-----------|-----------------|
| 1.0.x | 1.0.x | N/A (initial) |
| 1.1.x | 1.1.x | Added config schema support |
| 1.2.x | 1.2.x | Namespace resolution changes |
| 2.0.x | 2.0.x | Full manifest redesign |

---

## References

- [Claude Code Marketplace](https://marketplace.claudecode.io)
- [JSON Schema Store](https://json.schemastore.org)
- [Semantic Versioning](https://semver.org)
- [npm Dependency Versioning](https://docs.npmjs.com/cli/v6/using-npm/semver)
