# Claudient × Cursor

> How to use Claudient skills, agents, rules, and CLAUDE.md examples in Cursor.

Claudient is a knowledge system built for Claude Code. Cursor, Anthropic's code editor, supports many of the same customization patterns. This guide shows how to adapt Claudient content for use in Cursor.

---

## What works natively

- **Rules** — Claudient `rules/` files map directly to Cursor's `.cursor/rules/` directory with zero adaptation.
- **System prompts** — Claudient CLAUDE.md and agent files can be used as Cursor system prompts or agent mode instructions.
- **Project context** — Claudient guides and workflows document project structure and conventions; paste relevant sections into `.cursorrules` or `.cursor/rules/`.

---

## What needs adaptation

| Claudient feature | Cursor equivalent | Notes |
|---|---|---|
| Skills (`.md` files with "When to activate") | Rules (`.mdc` files in `.cursor/rules/`) | Strip context-specific triggers; keep substance and examples |
| Agents (delegation + model guidance) | Chat custom modes or agent mode system prompts | Paste agent purpose and prompt template into Cursor's agent mode |
| Commands (command structure in CLAUDE.md) | Saved chat prompts or custom instructions | Cursor has no native "command" equivalent; use chat history or snippets |
| Hooks (event-triggered automation) | `.cursor/settings.json` automations (if supported) | Cursor's event model is narrower; adapt as `.cursor/rules/` for linting |
| CLAUDE.md examples | `.cursorrules` or `.cursor/rules/examples.mdc` | Inline examples directly into rules for context |

---

## Installation

### Adapt a Claudient Skill → Cursor Rule

Claudient skills live in `skills/` directories and follow this structure:

```
skills/
├── data-ml/
│   └── kafka.md
├── devops-infra/
│   └── docker.md
├── backend/
│   └── fastapi-crud.md
```

Each skill file has:
- **When to activate** — trigger conditions
- **When NOT to use** — anti-patterns
- **Instructions** — detailed guidance
- **Example** — concrete walkthrough

**Cursor rules** live in `.cursor/rules/` and use `.mdc` (Cursor's Markdown + inline code) format. The structure is simpler — no "when to activate" section. Instead, Cursor fires the rule based on file type, directory patterns, and user interaction.

#### Step 1: Extract skill substance

Read the skill file and extract the "Instructions" and "Example" sections:

```bash
cat skills/data-ml/kafka.md | grep -A 500 "^## Instructions" | head -n 200
```

#### Step 2: Create the `.mdc` file

Rules in `.cursor/rules/` use a conversational format. No strict schema — just clear language with code examples.

**Example: Convert `skills/data-ml/kafka.md` → `.cursor/rules/kafka.mdc`**

Original skill (abbreviated):

```markdown
# Kafka and Event Streaming

## When to activate
Designing or implementing event-driven architectures, building real-time data pipelines...

## When NOT to use
Simple task queues... (use Redis Streams or Celery instead)

## Instructions

### Topic Design
Partition count determines maximum parallelism...
```

Adapted Cursor rule (`.cursor/rules/kafka.mdc`):

```markdown
# Kafka and Event Streaming

You are advising on event-driven architectures and real-time Kafka pipelines.

## When this applies

Use this rule when:
- Designing or implementing event-driven architectures
- Building real-time data pipelines with Kafka
- Configuring producers and consumers in Python or Java
- Setting up Schema Registry with Avro schemas
- Building stateful stream processing with Kafka Streams or Faust

Do NOT apply this rule to:
- Simple task queues where ordering and replay are not required (use Redis Streams or Celery instead)
- Batch ETL jobs with no real-time requirement (use dbt-data-pipelines or Airflow)
- Pub/sub with no need for persistence (use Redis Pub/Sub or RabbitMQ for ephemeral fanout)

## Topic Design

Partition count determines maximum parallelism — one partition can be consumed by at most one consumer in a consumer group at a time:

```
partition_count = ceil(target_throughput_msg_per_sec / single_partition_throughput)
```

Single partition throughput is roughly 10–50 MB/s depending on message size and broker hardware. Err on the side of more partitions — adding partitions later is safe; removing them requires recreating the topic and migrating data.

Production replication factor is always 3: one leader, two in-sync replicas (ISRs). Never set `min.insync.replicas` below 2 in production — with `acks=all`, this ensures at least one replica confirms the write beyond the leader.

[... rest of instructions ...]

## Example: E-Commerce Order Pipeline

Design a Kafka pipeline for e-commerce order events:

1. **Topic**: `order-events` — 12 partitions, replication factor 3, `min.insync.replicas=2`, 7-day retention. Partition key = `order_id`.
2. **Avro schema**: `OrderEvent` with `order_id`, `user_id`, `total_usd`, `status` enum, `created_at` timestamp.
3. **Producer**: `acks=all`, `enable.idempotence=True`, `linger.ms=5`, `compression.type=lz4`.
4. **Consumer group** `order-processor-v2`: `enable.auto.commit=False`, manual synchronous commit after each message.
5. **Dead letter topic**: `order-events.DLT` for messages that fail after 3 retries.

[... full example code ...]
```

#### Step 3: Directory structure

Organize `.cursor/rules/` to mirror your domain structure:

```
.cursor/
├── rules/
│   ├── data-ml/
│   │   ├── kafka.mdc
│   │   ├── spark.mdc
│   │   └── dashboard-narrator.mdc
│   ├── devops-infra/
│   │   ├── docker.mdc
│   │   └── kubernetes.mdc
│   ├── backend/
│   │   ├── fastapi-crud.mdc
│   │   └── python-types.mdc
│   └── language-specific/
│       ├── python.mdc
│       ├── typescript.mdc
│       └── rust.mdc
├── settings.json
└── .cursorrules  # Optional: global rules (see next section)
```

---

### Copy Claudient Rules → Cursor Rules

Claudient's `rules/` directory contains coding style and language-specific guidelines. These map **directly and unchanged** to `.cursor/rules/`.

#### Copy command

```bash
# Recursive copy from Claudient to your project's .cursor/rules/
cp -r /path/to/Claudient/rules/* /your-project/.cursor/rules/

# Or selectively copy specific categories:
cp -r /path/to/Claudient/rules/language-specific/python.md \
  /your-project/.cursor/rules/python.mdc
```

**No translation needed** — just rename `.md` → `.mdc` and place in `.cursor/rules/`.

Example adapted rule file (`.cursor/rules/python.mdc`):

```markdown
# Python Rules

Apply to all Python files (*.py) in any project.

## Rules

1. **Type hints on all function signatures** — parameters and return types. Use `from __future__ import annotations` for forward references. No bare untyped functions in production code.

2. **`pathlib.Path` over `os.path`** — `Path("dir") / "file.txt"` is cleaner and works cross-platform.

3. **f-strings over `.format()` and `%`** — `f"Hello {name}"` everywhere.

4. **Never use mutable default arguments** — `def fn(items: list = [])` creates one list shared across all calls. Use `def fn(items: list | None = None)` and assign inside.

5. **`dataclasses` for data containers, `Pydantic` for validated external data** — if it crosses a system boundary (HTTP, file, env), use Pydantic.

[... rest of rules ...]
```

---

### Use Claudient Agents → Cursor Agent Mode or Custom System Prompts

Claudient agents define:
- **Purpose** — what domain/task the agent owns
- **Model guidance** — which Claude model to use and why
- **Tools** — which capabilities the agent should access
- **Prompt template** — how to invoke the agent

Cursor's agent mode and custom instructions support this pattern directly.

#### Option A: Agent Mode System Prompt

In Cursor's agent mode (or when you customize agent behavior), use the Claudient agent's **purpose** and **prompt template** as your system prompt.

**Example: Code Reviewer Agent**

Original Claudient agent (`.agents/core/code-reviewer.md`):

```markdown
# Code Reviewer Agent

## Purpose
Reviews a diff or set of changed files for correctness, maintainability, security issues, and adherence to project conventions — and returns structured, actionable feedback.

## Model guidance
Haiku 4.5 for small diffs; Sonnet 4.6 for multi-file changes.

## Tools
- Read
- Bash (read-only: git diff, grep)

## Prompt template
You are a code reviewer. Do not modify any files. Report only — do not fix.
...
```

**Adapted for Cursor agent mode:**

1. Open Cursor's agent settings or create a custom mode
2. Set the system prompt to:

```
You are a code reviewer. Do not modify any files. Report only — do not fix.

Review for:
1. Correctness — does it do what it claims? Edge cases not handled?
2. Security — SQL injection, XSS, unvalidated input, secret exposure?
3. Error handling — are failures handled explicitly? Can this panic/throw unexpectedly?
4. Test coverage — are the changed behaviors tested?
5. Maintainability — is this easy to understand and modify in 6 months?
6. Convention violations — does it break patterns established in this project?

Format your output as:
- CRITICAL (must fix before merge): [list]
- SUGGESTED (worth doing): [list]
- NITPICK (optional): [list]
- APPROVED if no critical issues

One comment per issue. File + line number where applicable.
```

#### Option B: Saved Chat Prompt

If Cursor doesn't support custom agent modes in your version, save the agent's prompt template as a chat snippet:

1. In Cursor chat, click **Save Prompt** or use the snippets feature
2. Name it `code-reviewer` or similar
3. Paste the prompt template
4. Reuse it: type `@code-reviewer` or open from history

---

### CLAUDE.md Examples → `.cursorrules` or `.cursor/rules/examples.mdc`

If your project has a `CLAUDE.md` file (Claudient's project instructions), extract the relevant **example projects** and **coding patterns** and add them to Cursor's rule system.

#### Option A: Global `.cursorrules` file

Create `.cursorrules` at your project root:

```
# .cursorrules (global Cursor rules)

You are working on [Project Name], a [brief description].

## Project Structure
[Paste CLAUDE.md "What This Repo Is" section]

## File Naming Conventions
[Paste CLAUDE.md conventions]

## Coding Rules
[Paste language-specific rules from CLAUDE.md or Claudient rules/]

## Example: [Example from CLAUDE.md]
[Paste concrete example]

## When to ask for help
- Before making large refactors
- When uncertain about conventions
- Before committing to a particular architecture
```

#### Option B: Dedicated `.cursor/rules/examples.mdc` file

If you prefer to keep examples in the rules directory:

```markdown
# Project Examples and Patterns

This file contains concrete examples from the project's CLAUDE.md and architecture guides.

## Example: FastAPI CRUD Agent

Use the FastAPI CRUD pattern when building REST APIs with SQLAlchemy models.

[Paste example from CLAUDE.md or skills/backend/fastapi-crud.md]

## Example: Kubernetes Deployment Workflow

When deploying to Kubernetes, follow these steps:

[Paste example from Claudient workflows/]
```

---

## Compatibility Matrix

| Claudient Content | Cursor Equivalent | Adaptation Effort | Status |
|---|---|---|---|
| `rules/*.md` | `.cursor/rules/*.mdc` | None — direct rename | ✓ Native |
| `skills/*.md` | `.cursor/rules/*.mdc` | Medium — strip triggers, keep substance | ✓ Manual |
| `agents/*.md` | Agent mode system prompt or saved chat prompt | Medium — extract purpose + prompt template | ✓ Manual |
| `CLAUDE.md` examples | `.cursorrules` or `.cursor/rules/examples.mdc` | Low — copy sections | ✓ Copy |
| `guides/*.md` | `.cursor/rules/` or project README | Low — paste into rules or reference | ✓ Reference |
| `hooks/` (automation) | `.cursor/settings.json` (if supported) or `.cursor/rules/` | High — Cursor's event model differs | ⚠ Partial |
| `prompts/` templates | Saved chat snippets or agent system prompts | Low — paste and reuse | ✓ Manual |
| Workflow `.md` files | Paste into `.cursor/rules/workflows.mdc` | Low — sequential steps translate directly | ✓ Manual |

---

## Quick Install Script

Save this as `/Users/tushar/Desktop/Claudient/compatibility/install-cursor.sh` and run in your project:

```bash
#!/usr/bin/env bash

# install-cursor.sh — Adapt Claudient content into Cursor rules
# Usage: bash install-cursor.sh /path/to/claudient-repo

CLAUDIENT_ROOT="${1:-.}"
TARGET_DIR=".cursor/rules"

# Verify Claudient directory exists
if [ ! -d "$CLAUDIENT_ROOT/rules" ]; then
    echo "Error: Claudient rules/ directory not found at $CLAUDIENT_ROOT/rules"
    echo "Usage: bash install-cursor.sh /path/to/claudient-repo"
    exit 1
fi

# Create .cursor/rules directory
mkdir -p "$TARGET_DIR"

echo "Installing Claudient rules into $TARGET_DIR..."

# Copy language-specific rules
if [ -d "$CLAUDIENT_ROOT/rules/language-specific" ]; then
    mkdir -p "$TARGET_DIR/language-specific"
    echo "  → Copying language-specific rules..."
    for file in "$CLAUDIENT_ROOT/rules/language-specific"/*.md; do
        basename=$(basename "$file" .md)
        cp "$file" "$TARGET_DIR/language-specific/${basename}.mdc"
        echo "    ✓ $basename"
    done
fi

# Copy common rules
if [ -d "$CLAUDIENT_ROOT/rules/common" ]; then
    mkdir -p "$TARGET_DIR/common"
    echo "  → Copying common rules..."
    for file in "$CLAUDIENT_ROOT/rules/common"/*.md; do
        basename=$(basename "$file" .md)
        cp "$file" "$TARGET_DIR/common/${basename}.mdc"
        echo "    ✓ $basename"
    done
fi

# Copy all skills into rules/skills/
if [ -d "$CLAUDIENT_ROOT/skills" ]; then
    mkdir -p "$TARGET_DIR/skills"
    echo "  → Copying skills as rules..."
    find "$CLAUDIENT_ROOT/skills" -name "*.md" -type f | while read file; do
        # Preserve directory structure
        relpath="${file#$CLAUDIENT_ROOT/skills/}"
        dirname=$(dirname "$relpath")
        basename=$(basename "$relpath" .md)
        
        mkdir -p "$TARGET_DIR/skills/$dirname"
        cp "$file" "$TARGET_DIR/skills/$dirname/${basename}.mdc"
        echo "    ✓ $dirname/$basename"
    done
fi

# Create sample .cursorrules if it doesn't exist
if [ ! -f ".cursorrules" ]; then
    echo "  → Creating .cursorrules template..."
    cat > ".cursorrules" << 'EOF'
# Project Cursor Rules

You are working on this project. Refer to the rules in .cursor/rules/ for:
- Language-specific conventions (language-specific/*.mdc)
- Common coding patterns (common/*.mdc)
- Domain expertise (skills/*.mdc)

When uncertain about style or approach, default to the rules in .cursor/rules/.

## When to ask
- Before major refactors
- When breaking a convention
- Before choosing between multiple patterns
EOF
    echo "    ✓ .cursorrules created"
fi

echo ""
echo "Installation complete!"
echo ""
echo "Next steps:"
echo "  1. Review .cursor/rules/ and customize for your project"
echo "  2. Edit .cursorrules to add project-specific context"
echo "  3. In Cursor, reload the rules (or restart Cursor)"
echo ""
echo "To use agent prompts from Claudient:"
echo "  - Copy an agent's purpose + prompt template to .cursor/settings.json (agent mode)"
echo "  - Or save as a chat prompt snippet in Cursor"
EOF
```

Make the script executable:

```bash
chmod +x /Users/tushar/Desktop/Claudient/compatibility/install-cursor.sh
```

**Usage:**

```bash
# In your project directory
bash /path/to/install-cursor.sh /path/to/Claudient

# Or if in the Claudient repo itself
bash compatibility/install-cursor.sh .
```

**What it does:**

1. Creates `.cursor/rules/` directory
2. Copies all Claudient `rules/` files as `.mdc` (rename `.md` → `.mdc`)
3. Copies all Claudient `skills/` files as `.mdc` in `.cursor/rules/skills/`
4. Creates a template `.cursorrules` file at project root
5. Preserves directory structure for easy navigation

**Result:**

```
.cursor/
├── rules/
│   ├── language-specific/
│   │   ├── python.mdc
│   │   ├── typescript.mdc
│   │   ├── rust.mdc
│   │   └── go.mdc
│   ├── common/
│   │   ├── coding-style.mdc
│   │   └── kubernetes.mdc
│   └── skills/
│       ├── data-ml/
│       │   ├── kafka.mdc
│       │   ├── spark.mdc
│       │   └── dashboard-narrator.mdc
│       ├── devops-infra/
│       │   └── docker.mdc
│       └── backend/
│           └── fastapi-crud.mdc
├── settings.json
└── [other Cursor config]
.cursorrules  # Global Cursor rules
```

---

## Troubleshooting

### Cursor doesn't recognize `.cursor/rules/` files

- Ensure `.mdc` file extension is used (not `.md`)
- Restart Cursor to reload rule cache
- Check that `.cursor/` directory is at your project root (same level as `.git/`)

### Agent prompts not appearing in agent mode

- Cursor's agent mode support varies by version
- As a fallback, save agent prompts as chat snippets or custom instructions
- Reference the agent's purpose + prompt template in your `.cursorrules` file

### Rules are too verbose for my project

- Selectively copy only the rules you need
- Remove "When NOT to use" sections if they don't apply
- Combine related rules into a single `.mdc` file if they're used together

### Skills reference Claudient-specific features (slash commands, hooks)

- Strip Claudient-specific references (e.g., "When to activate" → "When this applies")
- Keep the substance: instructions, examples, and anti-patterns
- Note in comments that the rule was adapted from Claudient

---

## See Also

- [Claudient Repository](https://github.com/tushar2704/Claudient) — Full source of skills, agents, and rules
- [Cursor Documentation](https://docs.cursor.com) — Official Cursor rules and customization guide
- [Claude Code Documentation](https://claude.com/claude-code) — Original Claude Code features that inspire these patterns

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**

📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
