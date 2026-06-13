# Authoring Claude Code Plugins (Mid-2026)

Claude Code plugins extend Claude's capabilities through organized collections of skills, agents, hooks, MCP configurations, and automation. This guide covers the full lifecycle of building, testing, and shipping production plugins.

## Plugin Architecture Overview

A Claude Code plugin is a self-contained, distributable knowledge package. At minimum, it contains:

```
my-plugin/
├── plugin.json              # Plugin metadata and manifest
├── skills/
│   └── my-skill.md          # Skill definitions
├── agents/
│   └── my-agent.md          # Agent definitions
├── commands/                # (Optional) Custom CLI commands
│   └── my-command.md
├── hooks/                   # (Optional) Event-triggered automations
│   └── my-hook.md
│   └── my-hook.sh
├── bin/                     # (Optional) Executable scripts
│   └── my-tool
├── output-styles/           # (Optional) Custom output formatters
│   └── my-format.css
├── .mcp.json                # (Optional) MCP server configurations
└── README.md                # Plugin documentation
```

Multi-plugin repositories use a `marketplace.json` at the root to organize and distribute multiple plugins:

```
monorepo/
├── .claude-plugin/
│   ├── marketplace.json     # Multi-plugin registry
├── plugins/
│   ├── plugin-one/
│   │   └── plugin.json
│   └── plugin-two/
│       └── plugin.json
└── package.json
```

---

## Directory Structure — Detailed Breakdown

### `plugin.json` — Core Plugin Manifest

The `plugin.json` file is the single source of truth for your plugin. Every field is indexed and searchable by Claude Code's plugin system.

**Minimal example:**

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "A single-line description of what this plugin does.",
  "skills": [],
  "agents": [],
  "hooks": []
}
```

**Full-featured example:**

```json
{
  "name": "code-quality",
  "version": "2.3.1",
  "description": "Automated code quality, linting, testing, and refactoring for 15+ languages.",
  "author": {
    "name": "Your Name",
    "email": "you@example.com",
    "url": "https://example.com"
  },
  "license": "MIT",
  "homepage": "https://github.com/you/code-quality",
  "repository": {
    "type": "git",
    "url": "https://github.com/you/code-quality.git"
  },
  "keywords": ["linting", "testing", "refactoring", "code-quality"],
  "icon": "https://example.com/icon.png",
  "banner": "https://example.com/banner.png",
  "skills": [
    {
      "id": "linting/eslint-fixer",
      "name": "ESLint Fixer",
      "file": "skills/linting/eslint-fixer.md",
      "status": "active",
      "description": "Automatically fix ESLint violations"
    },
    {
      "id": "testing/jest-suite",
      "name": "Jest Suite Builder",
      "file": "skills/testing/jest-suite.md",
      "status": "active",
      "description": "Generate Jest test suites with full coverage"
    }
  ],
  "agents": [
    {
      "id": "refactoring-specialist",
      "name": "Refactoring Specialist",
      "file": "agents/refactoring-specialist.md",
      "status": "active",
      "description": "Delegate large refactoring tasks"
    }
  ],
  "hooks": [
    {
      "id": "pre-commit-quality-check",
      "file": "hooks/pre-commit-quality-check.md",
      "type": "command",
      "trigger": "PreTool",
      "status": "active"
    }
  ],
  "mcpServers": [
    {
      "id": "pylint-mcp",
      "command": "python",
      "args": ["-m", "pylint_mcp"],
      "env": {
        "PYLINT_CONFIG": ".pylintrc"
      }
    }
  ],
  "userConfig": {
    "properties": {
      "defaultLanguage": {
        "type": "string",
        "default": "javascript",
        "description": "Default language for code quality checks",
        "enum": ["javascript", "python", "rust", "go", "java"]
      },
      "strictMode": {
        "type": "boolean",
        "default": true,
        "description": "Enable strict linting rules"
      },
      "autoFix": {
        "type": "boolean",
        "default": false,
        "description": "Automatically fix violations without confirmation"
      }
    }
  },
  "channels": {
    "beta": {
      "version": "2.4.0-beta.1",
      "publishedAt": "2026-06-01T10:00:00Z",
      "previewText": "New: Python ruff support, 10% faster linting"
    },
    "stable": {
      "version": "2.3.1",
      "publishedAt": "2026-05-15T14:30:00Z"
    }
  },
  "dependencies": {
    "eslint": ">=8.0.0",
    "jest": ">=29.0.0"
  },
  "minClaudeVersion": "2.0.0",
  "tags": ["code-quality", "testing", "linting", "refactoring"],
  "premium": false
}
```

**Field definitions:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | string | Yes | Unique identifier (kebab-case). Used in marketplace and URL. |
| `version` | string | Yes | Semantic versioning (MAJOR.MINOR.PATCH). Must increment on every release. |
| `description` | string | Yes | One-line summary shown in marketplace listing. |
| `author` | object | No | Name, email, and URL of the plugin creator. |
| `license` | string | No | SPDX license identifier (MIT, Apache-2.0, ISC, etc.). |
| `homepage` | string | No | URL to the plugin's main website or repo. |
| `repository` | object | No | Git repository info; enables "View source" links. |
| `keywords` | array | No | Search tags for marketplace discoverability. Max 10. |
| `icon` | string | No | 128x128 PNG/SVG URL shown in plugin listings. |
| `banner` | string | No | 1200x630 PNG/SVG for marketplace hero section. |
| `skills` | array | Yes | List of all skills provided by this plugin. |
| `agents` | array | No | List of all agents provided by this plugin. |
| `hooks` | array | No | List of all hooks provided by this plugin. |
| `mcpServers` | array | No | MCP server configurations bundled with this plugin. |
| `userConfig` | object | No | JSON Schema defining plugin configuration options. |
| `channels` | object | No | Version channels (stable, beta, alpha) with descriptions. |
| `dependencies` | object | No | External tool versions required (eslint, npm, etc.). |
| `minClaudeVersion` | string | No | Minimum Claude Code version for compatibility. |
| `tags` | array | No | High-level categories (backend, devops, testing). |
| `premium` | boolean | No | If true, this plugin requires a paid Claude Code tier. |

**`userConfig` schema:** Define plugin configuration options that users can customize via `/config` or settings.json. Uses JSON Schema draft 7.

```json
"userConfig": {
  "properties": {
    "enableAutofixOnSave": {
      "type": "boolean",
      "default": false,
      "description": "Automatically apply linting fixes when files are saved"
    },
    "customRulesPath": {
      "type": "string",
      "description": "Path to custom ESLint rules",
      "pattern": "^\\./.*\\.js$"
    },
    "coverageThreshold": {
      "type": "number",
      "minimum": 0,
      "maximum": 100,
      "default": 80,
      "description": "Minimum code coverage percentage required"
    }
  },
  "required": ["coverageThreshold"]
}
```

**`channels` object:** Manage multiple release channels (stable, beta, alpha) with independent versions.

```json
"channels": {
  "stable": {
    "version": "1.2.0",
    "publishedAt": "2026-04-20T09:00:00Z",
    "description": "Production-ready release"
  },
  "beta": {
    "version": "1.3.0-beta.1",
    "publishedAt": "2026-06-05T15:30:00Z",
    "previewText": "New: Python 3.12 support, 15% faster tests"
  }
}
```

### `skills/` Directory Structure

Skills are reusable prompts that extend Claude's behavior. Each skill is a single `.md` file following the standard format.

**File organization by domain:**

```
skills/
├── linting/
│   ├── eslint-fixer.md
│   ├── pylint-fixer.md
│   └── clippy-fixer.md
├── testing/
│   ├── jest-suite.md
│   ├── pytest-generator.md
│   └── go-bench.md
└── refactoring/
    ├── extract-function.md
    └── rename-variables.md
```

**Skill file format (required):**

```markdown
# Skill Name

## When to activate
Describe the exact trigger conditions — be specific. Not: "when you need to lint code." But: "when the user runs /eslint-fix and there are ESLint violations in the current project."

## When NOT to use
Anti-patterns and situations where this skill is wrong:
- Do not use if the codebase has no ESLint config
- Do not use for TypeScript files without tsconfig.json
- Do not use if the user explicitly wants to disable autofix

## Instructions
The actual skill content. Provide concrete patterns, step-by-step instructions, and decision trees.

Format:
- Use numbered lists for sequential steps
- Use bullet points for rules or options
- Include code examples where applicable
- Reference related tools and skills

## Example
Provide at least one concrete, runnable example showing the skill in action.
```

**Concrete skill example:**

```markdown
# ESLint Fixer

## When to activate
When `/eslint-fix` is invoked and the current project contains a `.eslintrc.json` or `.eslintrc.js` file with violations in the codebase.

## When NOT to use
- If the project has no eslint configuration
- If the user explicitly requested "show me violations, don't fix"
- If the codebase is TypeScript and tsconfig.json is missing

## Instructions

### Step 1: Identify configuration
```bash
find . -name ".eslintrc*" -o -name "eslint.config.js" | head -1
```

### Step 2: Run ESLint with output format
```bash
npx eslint . --format json --max-warnings 0
```

### Step 3: Parse violations by type
- Syntax errors: must fix, non-negotiable
- Unused variables: safe to fix automatically
- Naming conventions: safe to fix if consistent
- Security issues (no-eval, etc.): must fix

### Step 4: Apply fixes with --fix flag
```bash
npx eslint . --fix
```

### Step 5: Run test suite
Verify that fixes don't break tests:
```bash
npm test
```

### Step 6: Summary
Output:
- Number of files fixed
- Violations remaining (if --max-warnings exceeded)
- Any manual actions required

## Example

User: `/eslint-fix`

Output:
```
Running ESLint fixes...
✓ src/App.jsx (12 fixes: unused imports, spacing)
✓ src/utils/helpers.js (3 fixes: naming conventions)
⚠ src/api/client.js (1 violation remains: complexity too high)

6 files fixed. 1 file requires manual review.
```
```

### `agents/` Directory Structure

Agents are specialized subagents that handle complex, domain-specific tasks. Each agent is an `.md` file with YAML frontmatter.

**File organization:**

```
agents/
├── refactoring-specialist.md
├── performance-auditor.md
└── security-reviewer.md
```

**Agent file format (required):**

```markdown
---
name: agent-id
description: One-line description for plugin listings
model: sonnet  # or haiku, opus
---

# Agent Name

## Purpose
One sentence: what domain or task this agent owns.

## Model guidance
Which model (Haiku/Sonnet/Opus) and why. Include reasoning about token costs vs. quality tradeoffs.

## Tools
Explicit tool subset. Not all tools available to Claude — list only what this agent needs:
- Read, Edit, Write (filesystem)
- Bash, WebSearch (external)
- Specific MCP servers if applicable

## When to delegate here
Trigger conditions. When should Claude spawn this agent?

## Example use case
Concrete example showing the agent in action.
```

**Concrete agent example:**

```markdown
---
name: refactoring-specialist
description: Delegate large refactoring tasks requiring connected reasoning across modules
model: sonnet
---

# Refactoring Specialist

## Purpose
Execute large, connected refactoring tasks that span multiple files and require understanding of data flow, dependencies, and module boundaries.

## Model guidance
Sonnet — refactoring requires high-quality reasoning about trade-offs (performance vs. maintainability, readability vs. performance). Token cost is acceptable for tasks that save humans hours of manual work. Haiku is insufficient; Opus is overkill.

## Tools
Read, Edit, Write, Bash, WebSearch

## When to delegate here
- User requests: "refactor the authentication module to support OAuth2 and passkeys"
- Task spans 5+ files with interdependencies
- Requires impact analysis (what breaks if we change this?)
- Large batch operations on naming, structure, or pattern

## Example use case

User: "Refactor UserController to extract authentication concerns into a separate middleware layer. Update all routes to use it."

Agent:
1. Maps the UserController class and its 12 route methods
2. Identifies authentication patterns (JWT validation, role checks, rate limits)
3. Extracts into new AuthMiddleware class
4. Updates all 12 routes to use middleware
5. Runs tests to verify no breakage
6. Reports refactoring summary and any manual review items
```

### `commands/` Directory Structure

Commands are custom prompts/workflows triggered via `/command-name` in Claude Code. Store them as `.md` files in domain subdirectories.

**File organization:**

```
commands/
├── refactor/
│   ├── extract-function.md
│   ├── consolidate-classes.md
│   └── naming-convention.md
├── testing/
│   ├── generate-tests.md
│   └── coverage-report.md
└── analysis/
    └── complexity-audit.md
```

**Command file format:**

```markdown
---
description: One-line description shown in /help
argument-hint: "[arg1] [arg2] [arg3]"
---

The command prompt itself. Use $ARGUMENTS to reference user input.

Rules:
- List specific constraints
- Mention what NOT to do
- Define output format

Output:
1. Item 1
2. Item 2
3. Item 3
```

**Concrete command example:**

```markdown
---
description: Generate Jest tests for the specified file with full coverage
argument-hint: "[file-path] [optional: coverage-target]"
---

Generate a comprehensive Jest test suite for: $ARGUMENTS

Rules:
- Analyze the file to identify all exported functions, classes, and edge cases
- Generate tests covering: happy paths, error cases, boundary values, async behavior
- Use mocking for external dependencies (API calls, file I/O, timers)
- Target minimum 80% coverage unless specified otherwise
- Use descriptive test names: describe what the test verifies, not just "test 1"
- Include setup/teardown in beforeEach/afterEach, not inline
- Group related tests in describe() blocks

Output:
1. Test file (.test.js or .test.ts) with all test cases
2. Summary: number of test cases, coverage estimate, any limitations
3. Commands to run: `npm test -- --coverage [file]`

If $ARGUMENTS is empty, ask for the file path and desired coverage target.
```

### `hooks/` Directory Structure

Hooks are event-triggered automations. Each hook consists of an `.md` file (documentation) and a `.sh` or `.py` script (implementation).

**File organization:**

```
hooks/
├── pre-commit-quality-check.md
├── pre-commit-quality-check.sh
├── post-test-failure.md
├── post-test-failure.sh
├── daily-coverage-report.md
└── daily-coverage-report.sh
```

**Hook file format:**

```markdown
# Hook: Hook Name (Event)

Brief description of what the hook does.

## What it does
- Lists behavior
- One point per bullet

## settings.json entry

```json
{
  "hooks": {
    "EventName": [
      {
        "type": "command",
        "command": "bash ~/.claude/hooks/hook-name.sh"
      }
    ]
  }
}
```

## Hook script: hook-name.sh

Bash implementation. Must be executable.

## Setup

Installation instructions.

## Verification

How to verify the hook is working.
```

**Concrete hook example (pre-commit quality check):**

```markdown
# Hook: Pre-Commit Quality Check

Runs ESLint, Jest, and Prettier before committing code. Blocks commits with failing lints or test failures.

## What it does
- Runs ESLint on staged JavaScript/TypeScript files
- Runs Jest on affected test files
- Checks Prettier formatting
- Blocks commit if any check fails
- Outputs a summary report

## settings.json entry

```json
{
  "hooks": {
    "PreCommit": [
      {
        "type": "command",
        "command": "bash ~/.claude/hooks/pre-commit-quality-check.sh"
      }
    ]
  }
}
```

## Hook script: pre-commit-quality-check.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

# Get staged files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(js|ts|jsx|tsx)$' || true)

if [[ -z "$STAGED_FILES" ]]; then
  exit 0
fi

echo "🔍 Running pre-commit quality checks..."

# ESLint
if ! npx eslint $STAGED_FILES; then
  echo "❌ ESLint failed. Fix violations and try again."
  exit 1
fi

# Jest
if ! npx jest --passWithNoTests --onlyChanged; then
  echo "❌ Tests failed. Fix failing tests and try again."
  exit 1
fi

# Prettier
if ! npx prettier --check $STAGED_FILES; then
  echo "❌ Formatting issues. Run: npx prettier --write $STAGED_FILES"
  exit 1
fi

echo "✅ All checks passed!"
exit 0
```

## Setup

```bash
mkdir -p ~/.claude/hooks
cp pre-commit-quality-check.sh ~/.claude/hooks/pre-commit-quality-check.sh
chmod +x ~/.claude/hooks/pre-commit-quality-check.sh
```

Then add the settings.json entry above.

## Verification

```bash
# Create a new JS file with a linting violation
echo "const x = 1" > test.js
git add test.js

# Try to commit
git commit -m "test"
# Output: ❌ ESLint failed...

# Fix and retry
npx eslint --fix test.js
git add test.js
git commit -m "test"
# Output: ✅ All checks passed!
```
```

### `.mcp.json` — MCP Server Configuration

MCP servers extend Claude's capabilities with custom tools and resources. Define them in `.mcp.json` or bundled in `plugin.json`.

**Standalone `.mcp.json` example:**

```json
{
  "mcpServers": {
    "eslint-mcp": {
      "command": "node",
      "args": ["./bin/eslint-mcp.js"],
      "env": {
        "ESLINT_CONFIG": ".eslintrc.json"
      }
    },
    "jest-mcp": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/jest-mcp"],
      "cwd": "/path/to/project"
    },
    "prettier-mcp": {
      "command": "bash",
      "args": ["./bin/prettier-mcp.sh"],
      "timeout": 30000
    }
  }
}
```

**Field definitions:**

| Field | Type | Notes |
|-------|------|-------|
| `command` | string | Executable name (node, python, bash, npx, etc.). |
| `args` | array | Arguments passed to the command. |
| `env` | object | Environment variables for the MCP server. |
| `cwd` | string | Working directory for the server process. |
| `timeout` | number | Max milliseconds before the server is killed. Default 30000. |
| `disabled` | boolean | If true, this server won't be started. |

### `output-styles/` Directory (Optional)

Custom CSS for formatting command output in Claude Code's UI. Each `.css` file defines a styling profile.

```
output-styles/
├── code-quality.css
└── test-summary.css
```

**Example: code-quality.css**

```css
.code-quality-header {
  font-weight: bold;
  color: #0066cc;
  margin-bottom: 10px;
}

.code-quality-pass {
  color: #28a745;
}

.code-quality-fail {
  color: #dc3545;
}

.code-quality-metric {
  display: inline-block;
  margin-right: 20px;
}

.code-quality-file-list {
  margin: 10px 0;
  padding-left: 20px;
}
```

### `bin/` Directory (Optional)

Executable scripts bundled with the plugin. Register them in `plugin.json` if they should be available as commands.

```
bin/
├── eslint-mcp.js
├── jest-report.py
└── prettier-mcp.sh
```

**Example: bin/jest-report.py**

```python
#!/usr/bin/env python3
"""MCP server for Jest test reporting."""

import json
import subprocess
import sys

def get_test_results(cwd="."):
    """Run Jest and return JSON results."""
    try:
        result = subprocess.run(
            ["npx", "jest", "--json", "--outputFile=/tmp/jest-results.json"],
            cwd=cwd,
            capture_output=True
        )
        with open("/tmp/jest-results.json") as f:
            return json.load(f)
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    results = get_test_results()
    print(json.dumps(results, indent=2))
```

---

## Environment Variables — The 3 Plugin Env Vars

Claude Code sets three environment variables when a plugin is loaded. Use them in scripts and MCP servers.

### 1. `CLAUDE_PLUGIN_ROOT`

Absolute path to the plugin's root directory.

```bash
#!/bin/bash
# In a hook script
PLUGIN_ROOT="$CLAUDE_PLUGIN_ROOT"
SKILL_FILE="$PLUGIN_ROOT/skills/linting/eslint-fixer.md"
cat "$SKILL_FILE"
```

### 2. `CLAUDE_PLUGIN_DATA`

Absolute path to a plugin-specific data directory. Used for persistent state, caches, logs.

```bash
#!/bin/bash
# Store plugin state
STATE_FILE="$CLAUDE_PLUGIN_DATA/state.json"
echo '{"lastRun": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"}' > "$STATE_FILE"
```

### 3. `CLAUDE_PROJECT_DIR`

Absolute path to the user's current project directory (where they're working).

```bash
#!/bin/bash
# Run linting in the user's project
cd "$CLAUDE_PROJECT_DIR"
npx eslint .
```

**Usage in MCP servers:**

```json
{
  "mcpServers": {
    "project-analyzer": {
      "command": "python",
      "args": ["./bin/project-analyzer.py"],
      "env": {
        "PLUGIN_ROOT": "${CLAUDE_PLUGIN_ROOT}",
        "PROJECT_DIR": "${CLAUDE_PROJECT_DIR}",
        "PLUGIN_DATA": "${CLAUDE_PLUGIN_DATA}"
      }
    }
  }
}
```

---

## Version Strategy — Semantic Versioning + Channels

### Semantic Versioning (MAJOR.MINOR.PATCH)

- **MAJOR** (2.0.0): Breaking changes to plugin behavior, removed skills, incompatible agents
- **MINOR** (2.1.0): New skills, agents, or hooks added; backward compatible
- **PATCH** (2.0.1): Bug fixes, documentation updates, minor improvements

### Release Channels

Maintain multiple channels in `plugin.json`:

```json
"channels": {
  "stable": {
    "version": "2.0.0",
    "publishedAt": "2026-04-01T00:00:00Z",
    "description": "Production-ready. Recommended for all users."
  },
  "beta": {
    "version": "2.1.0-beta.1",
    "publishedAt": "2026-05-15T12:00:00Z",
    "previewText": "New: Python support, 20% faster linting"
  },
  "alpha": {
    "version": "2.2.0-alpha.1",
    "publishedAt": "2026-06-01T18:00:00Z",
    "previewText": "Experimental: WebAssembly-based linting (10x faster)"
  }
}
```

**Channel strategy:**

1. **Stable**: Latest production release. User default.
2. **Beta**: Feature-complete, undergoing testing. Early adopters and feedback.
3. **Alpha**: Early-stage experimentation. Breaking changes expected.

---

## `marketplace.json` — Multi-Plugin Repository

For repositories hosting multiple plugins, create a `.claude-plugin/marketplace.json` file that indexes all plugins.

**Example marketplace.json:**

```json
{
  "$schema": "https://code.claude.com/schema/marketplace.json",
  "name": "my-organization",
  "description": "A collection of 5 specialized Claude Code plugins.",
  "owner": {
    "name": "My Organization",
    "email": "contact@example.com"
  },
  "metadata": {
    "pluginRoot": "./plugins",
    "buildCommand": "npm run build-plugins"
  },
  "plugins": [
    {
      "name": "code-quality",
      "source": "./plugins/code-quality",
      "description": "Linting, testing, and refactoring across 15+ languages.",
      "category": "quality-assurance",
      "version": "2.0.0",
      "author": {
        "name": "Alice",
        "email": "alice@example.com"
      },
      "icon": "https://example.com/icons/code-quality.png",
      "tags": ["linting", "testing", "refactoring"]
    },
    {
      "name": "security-auditor",
      "source": "./plugins/security-auditor",
      "description": "SAST, dependency scanning, secrets detection.",
      "category": "security",
      "version": "1.5.0",
      "author": {
        "name": "Bob",
        "email": "bob@example.com"
      }
    }
  ]
}
```

**Build and distribute:**

```bash
# Build all plugins into distributable packages
npm run build-plugins

# This command should:
# 1. Validate each plugin.json
# 2. Verify all referenced files exist
# 3. Run tests in each plugin
# 4. Generate checksums for integrity
# 5. Output to ./dist/plugins/
```

---

## Testing Plugins — `claude plugin validate`

Claude Code includes a plugin validation command:

```bash
claude plugin validate --strict
```

**What it checks:**

- [ ] `plugin.json` is valid JSON
- [ ] All required fields are present (name, version, description)
- [ ] Version follows semantic versioning
- [ ] All skills exist and follow format
- [ ] All agents exist and follow format
- [ ] All hooks have corresponding scripts
- [ ] MCP server commands are executable or found in PATH
- [ ] No duplicate skill/agent/hook IDs
- [ ] `userConfig` is valid JSON Schema
- [ ] File paths are relative and don't escape plugin root
- [ ] No external dependencies without version constraints

**Run with flags:**

```bash
# Strict mode: fail on warnings, not just errors
claude plugin validate --strict

# Validate before publishing
claude plugin validate --strict --check-marketplace-compatibility

# Output machine-readable results
claude plugin validate --format json
```

**Output example:**

```
✓ plugin.json is valid
✓ Name: code-quality (kebab-case)
✓ Version: 2.0.0 (semantic versioning)
✓ 12 skills found (all valid)
✓ 3 agents found (all valid)
✓ 5 hooks found (all scripts present)
✓ 2 MCP servers configured
✓ No duplicate IDs
⚠ Warning: ESLint v8.0.0 not installed (optional, not required)
⚠ Warning: userConfig schema has no 'required' array

Validation: PASS (2 warnings)
```

**Fix common validation errors:**

```bash
# Error: "version 1.0 is not semantic versioning"
# Fix: Change to "1.0.0"

# Error: "skill linting/eslint-fixer.md not found"
# Fix: Create the file or update path in plugin.json

# Error: "hook script pre-commit-check.sh not executable"
# Fix: chmod +x hooks/pre-commit-check.sh

# Error: "MCP server command 'eslint-mcp' not found"
# Fix: Add to PATH or update command path in .mcp.json
```

---

## Worked Example: Code Quality Plugin (Complete)

Build a production-ready plugin with 3 skills, 2 agents, 1 hook, and 1 MCP server.

### Step 1: Initialize Plugin Structure

```bash
mkdir -p code-quality-plugin
cd code-quality-plugin

# Create directory structure
mkdir -p skills/{linting,testing,refactoring}
mkdir -p agents
mkdir -p hooks
mkdir -p bin
mkdir -p .mcp.json
```

### Step 2: Create `plugin.json`

```json
{
  "name": "code-quality",
  "version": "1.0.0",
  "description": "Automated linting, testing, and refactoring for JavaScript/TypeScript projects.",
  "author": {
    "name": "Alice Developer",
    "email": "alice@example.com"
  },
  "license": "MIT",
  "keywords": ["linting", "testing", "javascript", "typescript"],
  "skills": [
    {
      "id": "linting/eslint-fixer",
      "name": "ESLint Fixer",
      "file": "skills/linting/eslint-fixer.md",
      "status": "active",
      "description": "Automatically fix ESLint violations"
    },
    {
      "id": "testing/jest-suite",
      "name": "Jest Suite Builder",
      "file": "skills/testing/jest-suite.md",
      "status": "active",
      "description": "Generate Jest test suites with full coverage"
    },
    {
      "id": "refactoring/extract-function",
      "name": "Extract Function",
      "file": "skills/refactoring/extract-function.md",
      "status": "active",
      "description": "Refactor code by extracting functions"
    }
  ],
  "agents": [
    {
      "id": "refactoring-specialist",
      "name": "Refactoring Specialist",
      "file": "agents/refactoring-specialist.md",
      "status": "active"
    },
    {
      "id": "test-architect",
      "name": "Test Architect",
      "file": "agents/test-architect.md",
      "status": "active"
    }
  ],
  "hooks": [
    {
      "id": "pre-commit-checks",
      "file": "hooks/pre-commit-checks.md",
      "type": "command",
      "trigger": "PreCommit"
    }
  ],
  "mcpServers": [
    {
      "id": "eslint-diagnostics",
      "command": "node",
      "args": ["./bin/eslint-mcp.js"],
      "env": {
        "ESLINT_CONFIG": ".eslintrc.json"
      }
    }
  ],
  "userConfig": {
    "properties": {
      "autoFix": {
        "type": "boolean",
        "default": false,
        "description": "Automatically fix violations without user confirmation"
      },
      "coverageThreshold": {
        "type": "number",
        "minimum": 0,
        "maximum": 100,
        "default": 80,
        "description": "Minimum code coverage percentage"
      }
    }
  },
  "channels": {
    "stable": {
      "version": "1.0.0",
      "publishedAt": "2026-06-01T10:00:00Z"
    }
  }
}
```

### Step 3: Create Skills

**skills/linting/eslint-fixer.md:**

```markdown
# ESLint Fixer

## When to activate
When the user runs `/eslint-fix` and the current project has ESLint configured with violations.

## When NOT to use
- If no `.eslintrc` config exists
- If the user explicitly wants to review violations manually

## Instructions

### Identify violations
```bash
npx eslint . --format json > violations.json
```

### Fix automatically
```bash
npx eslint . --fix
```

### Verify tests still pass
```bash
npm test
```

## Example
User: `/eslint-fix`
Output: ✓ Fixed 47 violations in 8 files
```

**skills/testing/jest-suite.md:**

```markdown
# Jest Suite Builder

## When to activate
When the user requests test generation for a specific file or module.

## When NOT to use
- If the project doesn't use Jest
- If the file has no functions or exports

## Instructions

### Analyze exports
Identify all functions, classes, and hooks exported from the file.

### Generate test cases
For each export:
- Happy path test
- Error case test
- Edge case test

### Add mocks
Mock all external dependencies (API calls, timers, async operations).

### Run tests
```bash
npm test -- [file]
```

## Example
User: `/jest-suite src/utils/auth.js`
Output: Generated 24 test cases covering 92% of code
```

**skills/refactoring/extract-function.md:**

```markdown
# Extract Function

## When to activate
When the user identifies a code block to extract into a separate function.

## When NOT to use
- If the block is already a function
- If extracting would create a function with >5 parameters

## Instructions

### Identify scope
Find all variables used within the block (parameters, return values).

### Create function signature
Define parameters and return type based on variable usage.

### Update call sites
Replace original block with function call.

### Test
Verify behavior hasn't changed.

## Example
User: `/extract-function src/api.js lines 45-62`
Output: Extracted into new function `validateAndFetch()` with 3 parameters, 1 return value
```

### Step 4: Create Agents

**agents/refactoring-specialist.md:**

```markdown
---
name: refactoring-specialist
description: Execute large-scale refactoring tasks
model: sonnet
---

# Refactoring Specialist

## Purpose
Execute large-scale refactoring tasks spanning multiple files with impact analysis.

## Model guidance
Sonnet — refactoring requires understanding of dependencies and data flow.

## Tools
Read, Edit, Write, Bash

## When to delegate here
- Task spans 5+ files
- Requires impact analysis
- Complex dependency resolution

## Example use case
User: "Refactor authentication from custom JWT to OAuth2 across all 12 routes."

Agent:
1. Maps all 12 routes and their current auth logic
2. Designs OAuth2 integration points
3. Updates each route
4. Runs full test suite
5. Reports any breaking changes
```

**agents/test-architect.md:**

```markdown
---
name: test-architect
description: Design and implement comprehensive test strategies
model: sonnet
---

# Test Architect

## Purpose
Design comprehensive test strategies and implement test suites with full coverage.

## Model guidance
Sonnet — test design requires understanding of edge cases, mocking strategies, and integration patterns.

## Tools
Read, Edit, Write, Bash

## When to delegate here
- Designing test strategy for a new module
- Implementing integration tests
- Setting up coverage reporting

## Example use case
User: "Create comprehensive tests for our payment processing module with edge cases."

Agent:
1. Analyzes payment module API
2. Identifies 25 test cases (happy paths, errors, edge cases)
3. Implements Jest test suite with mocks
4. Sets up coverage reporting
5. Reports: 95% coverage achieved
```

### Step 5: Create Hook

**hooks/pre-commit-checks.md:**

```markdown
# Hook: Pre-Commit Checks

Runs linting, tests, and formatting checks before committing.

## What it does
- Runs ESLint on staged files
- Runs affected Jest tests
- Checks Prettier formatting
- Blocks commit if any check fails

## settings.json entry

```json
{
  "hooks": {
    "PreCommit": [
      {
        "type": "command",
        "command": "bash ~/.claude/hooks/pre-commit-checks.sh"
      }
    ]
  }
}
```

## Hook script: pre-commit-checks.sh

```bash
#!/usr/bin/env bash
set -e

STAGED=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(js|ts|jsx|tsx)$' || true)

if [[ -z "$STAGED" ]]; then
  exit 0
fi

echo "🔍 Running pre-commit checks on $(($(echo "$STAGED" | wc -l))) files..."

npx eslint $STAGED || {
  echo "❌ ESLint failed"
  exit 1
}

npx jest --onlyChanged || {
  echo "❌ Tests failed"
  exit 1
}

npx prettier --check $STAGED || {
  echo "❌ Prettier check failed. Run: prettier --write $STAGED"
  exit 1
}

echo "✅ All checks passed!"
```

## Setup

```bash
mkdir -p ~/.claude/hooks
cp pre-commit-checks.sh ~/.claude/hooks/pre-commit-checks.sh
chmod +x ~/.claude/hooks/pre-commit-checks.sh
```
```

### Step 6: Create MCP Server

**bin/eslint-mcp.js:**

```javascript
#!/usr/bin/env node
/**
 * ESLint MCP Server
 * Provides ESLint diagnostics as an MCP tool
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execPromise = promisify(exec);
const projectDir = process.env.CLAUDE_PROJECT_DIR || '.';

async function getLintErrors() {
  try {
    const { stdout } = await execPromise(
      `npx eslint . --format json`,
      { cwd: projectDir }
    );
    return JSON.parse(stdout);
  } catch (e) {
    // ESLint returns exit code 1 if there are violations
    return JSON.parse(e.stdout || '[]');
  }
}

async function fixErrors() {
  try {
    await execPromise(
      `npx eslint . --fix`,
      { cwd: projectDir }
    );
    return { success: true, message: 'Errors fixed' };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// MCP tool interface
const tools = {
  get_lint_errors: getLintErrors,
  fix_lint_errors: fixErrors
};

// Simple tool dispatcher
async function handleRequest(toolName, args) {
  if (toolName in tools) {
    return await tools[toolName](args);
  }
  throw new Error(`Unknown tool: ${toolName}`);
}

// Listen for requests on stdin
let buffer = '';
process.stdin.setEncoding('utf8');

process.stdin.on('data', async (chunk) => {
  buffer += chunk;
  
  try {
    const lines = buffer.split('\n');
    buffer = lines.pop();
    
    for (const line of lines) {
      if (!line.trim()) continue;
      
      const { tool, args } = JSON.parse(line);
      const result = await handleRequest(tool, args);
      console.log(JSON.stringify({ success: true, result }));
    }
  } catch (e) {
    console.log(JSON.stringify({ success: false, error: e.message }));
  }
});
```

**Make executable:**

```bash
chmod +x bin/eslint-mcp.js
```

### Step 7: Validate Plugin

```bash
cd code-quality-plugin
claude plugin validate --strict
```

**Expected output:**

```
✓ plugin.json is valid JSON
✓ name: code-quality (kebab-case)
✓ version: 1.0.0 (semantic versioning)
✓ 3 skills found and valid
✓ 2 agents found and valid
✓ 1 hook found with script present
✓ 1 MCP server configured
✓ No duplicate IDs
✓ userConfig schema valid

Validation: PASS
Ready to publish!
```

### Step 8: Test Locally

```bash
# Install in a test project
cd test-project
claude plugin install /path/to/code-quality-plugin

# Test skills
/eslint-fix
/jest-suite src/index.js
/extract-function src/utils.js lines 10-25

# Test hook
git add .
git commit -m "test"  # Should run pre-commit checks

# Test MCP server
# (Verify via Claude Code's tool discovery)
```

### Step 9: Publish

```bash
# Tag release
git tag v1.0.0

# Build for distribution
npm run build  # (if applicable)

# Publish to marketplace
claude plugin publish --channel stable
```

---

## Best Practices

### Plugin Design

1. **Single responsibility**: Each plugin should own one domain (testing, security, devops, etc.)
2. **Skill granularity**: 3-8 skills per plugin. Larger plugins fragment context.
3. **Agent scope**: Use agents for tasks requiring 20+ minutes of reasoning
4. **Hook restraint**: Only automate when the action is safe and correct 95%+ of the time

### Version Management

1. Increment version in `plugin.json` before every release
2. Use semantic versioning strictly
3. Maintain stable + beta channels
4. Document breaking changes in release notes

### Documentation

1. Every skill needs "When to activate" and "When NOT to use" sections
2. Every agent needs concrete example use cases
3. Every hook needs setup instructions and verification steps
4. Include command examples that users can copy-paste

### Testing

1. Run `claude plugin validate --strict` before publishing
2. Test all skills in a fresh project
3. Verify hooks don't fire unexpectedly
4. Check MCP server error handling

### Performance

1. Keep hook scripts fast (<2 seconds)
2. Cache results in `$CLAUDE_PLUGIN_DATA` when possible
3. Don't spawn multiple processes in hooks
4. Use Bash for simple scripts; Python for complex logic

---

## Troubleshooting

### Plugin Won't Load

**Problem**: `claude plugin install` fails

**Solutions**:
1. Run `claude plugin validate --strict` to find errors
2. Check that all file paths are relative
3. Verify JSON syntax in `plugin.json`
4. Ensure skill/agent files follow required format

### Skills Aren't Appearing

**Problem**: Skills defined in `plugin.json` don't show up in `/`

**Solutions**:
1. Verify skill file exists at path specified in `plugin.json`
2. Check skill file has required sections: "When to activate", "Instructions", "Example"
3. Reload Claude Code: `claude reload`
4. Clear cache: `rm -rf ~/.claude/cache`

### Hook Not Firing

**Problem**: Hook script doesn't run at expected event

**Solutions**:
1. Verify hook entry in `settings.json` matches event name exactly
2. Check that script is executable: `chmod +x hook.sh`
3. Check script has shebang: `#!/usr/bin/env bash`
4. Test script manually: `bash hook.sh < test-input.json`

### MCP Server Won't Connect

**Problem**: MCP server errors or doesn't respond

**Solutions**:
1. Test command exists: `which eslint-mcp` or `node ./bin/eslint-mcp.js`
2. Check environment variables are set: `echo $CLAUDE_PLUGIN_ROOT`
3. Verify timeout isn't too short: increase `"timeout": 60000`
4. Check stderr: run command directly to see errors

---

## Additional Resources

- Claude Code official documentation: https://code.claude.com/docs
- Plugin schema reference: https://code.claude.com/schema/plugin.json
- MCP specification: https://modelcontextprotocol.io/
- GitHub examples: Search "claude-code-plugin" on GitHub

---


📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
