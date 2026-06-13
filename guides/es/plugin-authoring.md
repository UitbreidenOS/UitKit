# Autoría de complementos de Claude Code

Un complemento agrupa habilidades, agentes, hooks, reglas y configuraciones MCP en un único paquete instalable — un comando de instalación en lugar de copiar manualmente archivos en proyectos o máquinas.

---

## Estructura del complemento

Un complemento vive en un directorio llamado `.claude-plugin/` en la raíz de un paquete npm (o ruta local). El único archivo requerido es `plugin.json`.

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

Los archivos de componentes siguen el mismo formato que las habilidades, agentes, hooks y reglas independientes en la especificación Claudient.

---

## Esquema de `plugin.json`

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

### Referencia de campos

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `name` | string | sí | Identificador del complemento, debe ser único en npm |
| `version` | string | sí | Semver — `1.0.0`, `2.3.1` |
| `description` | string | sí | Una sola línea, mostrada durante instalación |
| `status` | `"draft"` \| `"published"` | sí | Estado de nivel superior; `draft` suprime todas las exportaciones |
| `components` | array | sí | Lista de definiciones de componentes |
| `components[].type` | string | sí | `skill`, `agent`, `hook`, `rule`, `mcp-config` |
| `components[].path` | string | sí | Ruta relativa desde raíz del complemento |
| `components[].export` | boolean | sí | `true` = visible a usuarios; `false` = uso interno |
| `components[].status` | `"draft"` \| `"published"` | sí | Anulación por componente |
| `components[].hookEvent` | string | solo hooks | `PreToolCall`, `PostToolCall`, `Stop`, `SubagentStop`, `Notification` |

### Draft vs Published

- `"status": "draft"` a nivel superior mantiene todos los componentes privados — la instalación tiene éxito pero no se registran componentes.
- `"status": "draft"` en un componente mantiene ese único componente privado mientras el resto están activos.
- Establecer nivel superior a `"published"` y un componente a `"draft"` es el patrón correcto para enviar un complemento con características no lanzadas.

---

## Instalación

**Desde npm:**
```bash
npx claudient add plugin my-plugin-package
npx claudient add plugin @org/my-plugin
```

**Desde una ruta local:**
```bash
npx claudient add plugin ./path/to/my-plugin
```

**Desde una URL (v2.1.90+):**
```bash
claude plugin load https://example.com/plugin.zip
```

Los complementos instalados por proyecto se escriben en `.claude/plugins/`. Los complementos instalados globalmente se escriben en `~/.claude/plugins/`.

---

## Alcances del complemento

| Alcance | Comando de instalación | Ubicación | A quién afecta |
|---|---|---|---|
| Por proyecto | `npx claudient add plugin <pkg> --project` | `.claude/plugins/` | Solo este proyecto |
| Usuario global | `npx claudient add plugin <pkg> --global` | `~/.claude/plugins/` | Todos los proyectos para este usuario |

El predeterminado es por proyecto. Usa `--global` para herramientas personales (tus agentes preferidos, habilidades de productividad) y por proyecto para herramientas compartidas con equipo.

---

## Prueba de un complemento localmente

Usa un symlink para que los cambios tengan efecto inmediatamente sin reinstalar.

```bash
# Desde la raíz del complemento
npm link

# En el proyecto donde quieras probarlo
npm link my-plugin-package
npx claudient add plugin my-plugin-package
```

O usa el patrón `scripts/link-skills.sh` si mantienes un repositorio estilo Claudient:

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

## Versión del complemento

Sigue semver estrictamente:

| Cambio | Bumpe de versión |
|---|---|
| Nuevos componentes agregados, existentes sin cambios | Minor (`1.1.0`) |
| Instrucciones de componente existente cambiadas | Patch (`1.0.1`) |
| Componente eliminado o renombrado (breaking) | Major (`2.0.0`) |
| Tipo de evento de hook cambiado | Major (`2.0.0`) |

Mantén un `CHANGELOG.md` en la raíz del complemento. Los usuarios que actualicen complementos necesitan saber qué cambió, especialmente para hooks y agentes que se ejecutan autónomamente.

---

## Publicación en npm

```bash
# Asegúrate de que "claudient-plugin" esté en palabras clave para descubribilidad
npm publish --access public
```

Mínimo `package.json` para un complemento publicable:

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

La palabra clave `claudient-plugin` hace que el complemento sea detectable vía `npx claudient search plugins <query>`.

---

## Ejemplo completo de `plugin.json`

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
