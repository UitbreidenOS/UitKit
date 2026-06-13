# Definitive SKILL.md Format Guide — Mid-2026

The complete reference for authoring Claude Code skills that auto-invoke, accept arguments, integrate with hooks, and scale across projects. This guide covers every frontmatter field, dynamic syntax, environment variables, supporting file layouts, and decision trees for when to use skills vs. commands vs. agents.

---

## What a SKILL.md File Is

A SKILL.md file is a Markdown document, placed in `.claude/skills/` or `~/.claude/skills/`, that:

1. Defines a slash command (e.g., `/fastapi-crud`)
2. Contains optional YAML frontmatter that controls auto-invocation behavior
3. Holds structured instructions for Claude to follow when the skill is active
4. Can embed dynamic content (shell commands, environment variables, argument substitution)
5. Can trigger hooks, spawn subagents, or restrict tool access

Skills are **context injections**, not prompt templates. They tell Claude what to do and when to do it. They are loaded *after* a match is made, not before.

---

## File Location and Naming

| Scope | Path | Discovery behavior |
|---|---|---|
| Project-level | `.claude/skills/<skill-name>.md` | Only within this project; does not walk up the tree |
| Personal (global) | `~/.claude/skills/<skill-name>.md` | Available in all projects; takes lowest precedence if name conflicts |
| Plugin-level | `[plugin-root]/.claude/skills/<skill-name>.md` | Available when plugin is loaded |

**Naming rules:**
- `kebab-case.md` only — no underscores, no spaces, no dots
- Match the name to the slash command: `fastapi-crud.md` → `/fastapi-crud`
- Keep it short enough to type without autocomplete friction (12–30 characters ideal)
- Avoid generic names that will collide in monorepos (use `frontend-typescript-jest.md` instead of just `jest.md`)

If two skills have the same name in different scopes, the order of precedence is:
1. `.claude/skills/` (current directory, not walking up)
2. Plugin-level skills
3. `~/.claude/skills/` (global fallback)

---

## Complete Frontmatter Reference

Frontmatter is YAML enclosed in `---` delimiters at the top of the file. It controls how the skill behaves before any content is read.

### Required Fields

#### `name`

**Type:** `string` (kebab-case)  
**Character limit:** 64 characters max  
**Example:**
```yaml
name: fastapi-crud
```

The identifier that becomes the slash command. Must be unique within the active scope (project + global + plugins).

Rules:
- Kebab-case only
- Must match the filename (without `.md`)
- Will be used as `/<name>` in Claude Code

---

#### `description`

**Type:** `string`  
**Character limit:** Part of shared 1,536-character cap (see "Character Budget" section)  
**Example:**
```yaml
description: "FastAPI endpoint authoring with Pydantic validation, async route handlers, and dependency injection. Activate for new API routes, request model definitions, or background task setup."
```

The primary signal Claude uses for auto-invocation matching. Write this as an **activation condition**, not a capability summary.

**Good:** Specific technology + specific task type + sub-tasks
```yaml
description: "Activate when building a FastAPI REST API endpoint, defining Pydantic request/response models, implementing async route handlers, or setting up dependency injection."
```

**Bad:** Generic capability statement
```yaml
description: "A skill for building FastAPI applications."
```

**Guidelines:**
- Include technology name and version if relevant
- Name 2–4 specific task types where the skill should activate
- Assume the reader is a senior developer — skip "basic" context
- Encode anti-patterns if they're common failure modes (e.g., "This skill assumes async/await patterns; for sync Flask apps, use the Flask skill instead")

---

### Optional Fields

#### `when_to_use`

**Type:** `string`  
**Character limit:** Shared 1,536-character cap with `description`  
**Example:**
```yaml
when_to_use: "Use when the user mentions FastAPI, Pydantic validation, async Python APIs, or when working in a project with main.py containing app = FastAPI(). Also activate if user is building REST endpoints in a Starlette-based framework."
```

Additional matching context beyond the description. Use for trigger conditions too verbose for `description` but that improve matching precision.

**Strategy:** Let `description` be the headline; use `when_to_use` as extended matching rules. Together, they budget to 1,536 characters.

```yaml
description: "FastAPI CRUD endpoints with Pydantic validation and async handlers."
when_to_use: "Activate when: (a) building new REST endpoints, (b) defining request/response models, (c) the user mentions FastAPI/Starlette, (d) working in a project with FastAPI already configured."
```

---

#### `paths`

**Type:** `array` of glob strings (standard Unix glob syntax)  
**Default:** None (skill is never auto-activated by file context)  
**Example:**
```yaml
paths:
  - "**/*.test.ts"
  - "**/*.spec.ts"
  - "tests/**"
  - "**/jest.config.*"
  - "**/vitest.config.*"
```

Auto-activates the skill when Claude reads or edits a file matching any listed glob pattern.

**Rules:**
- Matching is against the file path Claude is touching, not the working directory
- If the path matches, the skill activates *silently* — no slash command invocation shown to the user
- Multiple skills can activate via `paths:` simultaneously; there is no conflict resolution
- All activated skills are loaded into context
- Useful for test utilities, config helpers, schema tools that should load when files are opened

**Examples:**
```yaml
# Test file pattern
paths:
  - "**/__tests__/**"
  - "**/*.test.*"
  - "**/*.spec.*"

# Config pattern
paths:
  - "tsconfig.json"
  - "jest.config.*"
  - "vitest.config.*"

# Directory pattern
paths:
  - "migrations/**"
  - "db/schema/**"
  - "infrastructure/terraform/**"

# Language-specific
paths:
  - "**/*.go"
  - "**/*.rs"
  - "**/Makefile"
```

---

#### `effort`

**Type:** `string` — one of `"low"` | `"medium"` | `"high"` | `"xhigh"`  
**Default:** Inherits from session's current effort setting  
**Example:**
```yaml
effort: xhigh
```

Overrides the effort level whenever this skill is active. Use `xhigh` for skills involving security, architecture decisions, or any task where missing a subtle constraint has real consequences.

| Value | Appropriate for | Claude behavior |
|---|---|---|
| `"low"` | Reformatting, renaming, boilerplate, simple classification | Faster, more direct, fewer edge case considerations |
| `"medium"` | Routine feature implementation, straightforward refactors | Balanced — handles dependencies, reviews context |
| `"high"` | Complex feature work, multi-file changes, architecture | Deep analysis, considers side effects, security boundaries |
| `"xhigh"` | Security review, architecture decisions, deep debugging, subtle bugs | Maximum thoroughness, adversarial mindset, edge case focus |

**Example:** A security-audit skill should always override to `xhigh`:
```yaml
name: security-audit
effort: xhigh
```

---

#### `allowed-tools`

**Type:** `array` of strings (tool names or patterns)  
**Default:** All tools are allowed  
**Example:**
```yaml
allowed-tools:
  - "Bash"
  - "Read"
  - "Edit"
  - "mcp__ide__executeCode"
```

Restricts which tools Claude can invoke while this skill is active. By default, all tools are available; this field creates a whitelist.

**Rules:**
- Exact tool names only (case-sensitive)
- If `allowed-tools` is set, *only* those tools are available
- Common tools: `Bash`, `Read`, `Edit`, `Write`, `WebFetch`, `WebSearch`, `NotebookEdit`, `mcp__*` (MCP tools)
- If the user invokes a disallowed tool, Claude will be blocked and must use allowed tools instead

**Example — a read-only skill:**
```yaml
allowed-tools:
  - "Read"
  - "WebFetch"
  - "WebSearch"
```

This skill can read files and fetch web content, but cannot edit files or run bash commands.

**Example — a code-execution skill:**
```yaml
allowed-tools:
  - "Bash"
  - "Read"
  - "Edit"
  - "Write"
  - "mcp__ide__executeCode"
```

---

#### `shell`

**Type:** `string` — `"bash"` | `"powershell"` | `"zsh"`  
**Default:** `"bash"`  
**Example:**
```yaml
shell: powershell
```

Overrides the shell interpreter for script blocks within the skill. Use only for Windows-specific skills.

- Leave unset for macOS/Linux/cross-platform skills
- Rarely needed — most skills are shell-agnostic
- If you use shell-specific syntax (e.g., `cmd.exe` batch commands), set this to match

---

#### `disable-model-invocation`

**Type:** `boolean`  
**Default:** `false`  
**Example:**
```yaml
disable-model-invocation: true
```

When `true`, activating the skill does **not** trigger a model response. The skill content is loaded as a directive, and Claude applies it to subsequent interactions without generating an immediate reply.

**Use for:**
- Configuration-only skills (e.g., "always use TypeScript strict mode")
- Context injection without immediate action (e.g., load project conventions)
- Behavioral directives (e.g., "use gitmojis in commit messages")

**Example:**
```yaml
---
name: typescript-strict
disable-model-invocation: true
---

# TypeScript Strict Mode Configuration

Always use strict mode in this project:
- `"strict": true` in tsconfig.json
- No `any` types without explaining why
- All functions must have explicit return types
```

When the user runs `/typescript-strict`, Claude loads these rules but doesn't respond. The rules apply to all subsequent interactions in that session.

---

#### `context:fork`

**Type:** `boolean`  
**Default:** `false`  
**Example:**
```yaml
context:fork: true
```

When `true`, activating this skill spawns a forked context (separate instance of Claude within the same session). The fork:
- Has its own token limit
- Cannot access the parent's conversation history
- Can be parallelized with other tasks
- Returns results back to the parent

**Use for:**
- Long-running analysis that shouldn't consume parent's token budget
- Parallel research tasks (e.g., "research 5 competitors in parallel")
- Isolation from sensitive data (the fork operates independently)

**Example:**
```yaml
---
name: parallel-research
context:fork: true
---

# Parallel Account Research

This skill spawns 5 parallel forks to research 5 accounts simultaneously.
Each fork:
- Gets one account (company name + LinkedIn URL)
- Runs the full 5-layer research independently
- Returns findings back to parent
```

This field is rare and advanced — most skills do not use it.

---

#### `on-activate` hooks

**Type:** object with hook definitions  
**Example:**
```yaml
on-activate:
  shell: |
    echo "Setting up environment for Python development"
    python -m venv .venv
    source .venv/bin/activate
```

Runs arbitrary code when the skill activates. Can execute shell scripts, Python, or Node.js code.

**Structure:**
```yaml
on-activate:
  shell: |
    # shell commands here
  python: |
    # python code here
  node: |
    # node code here
```

See "Hooks Integration" section for full details.

---

### Character Budget

The skill listing (used for auto-invocation matching) has a hard cap:

| Field | Budget | Note |
|---|---|---|
| `description` + `when_to_use` combined | 1,536 characters | Both count toward the same limit |
| Full skill body (loaded after match) | ~15,000 characters | No practical limit; loaded only on match |

**Strategy:**
- Put dense, keyword-rich activation triggers in `description` and `when_to_use`
- Put detailed instructions, code examples, patterns in the skill body
- The body is only loaded after the match is made — it doesn't affect matching performance

**Optimal `description` length:** 150–300 characters. Longer descriptions get truncated in listings and may not match accurately.

Example of a tight 200-character description:
```yaml
description: "FastAPI CRUD endpoints with Pydantic models, async handlers, and dependency injection. Activate for new REST endpoints, validation schemas, or background task setup."
```

---

## Frontmatter Examples

### Minimal Skill (required fields only)
```yaml
---
name: poetry-python
description: "Python dependency management with Poetry. Activate when managing pyproject.toml, adding dependencies, or creating new Python projects."
---

# Poetry Python Skill
...
```

### Medium Skill (effort override + paths)
```yaml
---
name: pytest-fixtures
description: "pytest fixture authoring and test utilities. Activate when writing unit tests or defining reusable test fixtures."
when_to_use: "Use when working with test files (conftest.py, **/*.test.py, **/test_*.py) or when user mentions parametrized tests, mocking, or test utilities."
paths:
  - "**/conftest.py"
  - "**/*.test.py"
  - "**/test_*.py"
effort: medium
---

# pytest Fixtures
...
```

### Advanced Skill (context:fork + allowed-tools + on-activate)
```yaml
---
name: security-audit
description: "Security code review for auth, RBAC, secrets management, SQL injection, CSRF, XSS. Activate for security audits, permission models, or vulnerability assessment."
effort: xhigh
allowed-tools:
  - "Read"
  - "WebFetch"
  - "Bash"
context:fork: true
on-activate:
  shell: |
    echo "Loading OWASP Top 10 reference data..."
    curl -s https://owasp.org/Top10/assets/top10.json | jq . > /tmp/owasp_top10.json
---

# Security Audit Skill
...
```

---

## Skill Body Structure

Every skill **must** follow this structure in the body (after frontmatter):

```markdown
# [Skill Name]

## When to activate
[Specific trigger conditions — bullet points, one per line]

## When NOT to use
[Anti-patterns — when this skill is the wrong tool]

## Instructions
[The actual skill content — detailed steps, patterns, examples]

## Example
[At least one concrete example]
```

Do **not** add sections beyond this without a clear reason. Brevity is a feature.

---

## Section: "When to activate"

List specific, actionable trigger conditions. One bullet per trigger.

**Bad — too vague:**
```markdown
## When to activate
When working with Python APIs.
```

**Good — specific and actionable:**
```markdown
## When to activate
- Building a new FastAPI endpoint (GET, POST, PUT, DELETE)
- Adding request validation with Pydantic models
- Implementing dependency injection in FastAPI routes
- Writing async route handlers with background tasks
- Debugging 422 or 500 errors in an existing FastAPI app
```

**Anti-pattern to avoid:** Never say "When the user asks for FastAPI help" — that's too broad. Say "When the user is building a new endpoint" — specific task.

---

## Section: "When NOT to use"

Prevent Claude from applying the skill in the wrong context. This is critical.

**Example:**
```markdown
## When NOT to use
- Flask or Django projects (use their respective skills instead)
- Simple scripts that don't need an API layer
- gRPC or GraphQL APIs (different paradigms, use different skills)
- When the user has already defined their own router structure (follow their pattern)
- Existing FastAPI apps with custom conventions you don't understand (learn the convention first)
```

**Rule of thumb:** For every activation trigger, have at least one "do not use" case.

---

## Section: "Instructions"

Directive, not descriptive. Tell Claude what to *do*, not what the technology *is*.

**Bad:** "FastAPI uses Pydantic for validation."  
**Good:** "Always define a Pydantic model for request bodies. Never accept raw dicts. Validate email with `EmailStr` from pydantic."

**Guidelines:**

1. **Be directive.** Start with imperative verbs: "Always," "Never," "Use," "Implement."
2. **Encode decisions.** Resolve ambiguity. Don't say "Use appropriate error handling." Say "Raise `HTTPException` with status 422 for validation errors, 404 for not-found, 500 only for unexpected failures."
3. **Reference real capabilities.** If Claude can spawn subagents, use hooks, or integrate with tools, say so explicitly.
4. **Structure for scannability.** Use headers, bullets, and code blocks. Claude reads the whole file but applies it better when structure is clear.
5. **Include the non-obvious.** Patterns Claude already knows add noise. Encode what's easy to get wrong.

**Structure pattern:**
```markdown
## Instructions

### [Sub-topic 1: Core Concept]
[Directive explanation with rules]

### [Sub-topic 2: Implementation Pattern]
[Code example + explanation]

### [Sub-topic 3: Common Pitfalls]
[What to avoid, with alternatives]

### [Sub-topic 4: Testing Strategy]
[How to verify the work is correct]
```

---

## Section: "Example"

The example is **not optional**. It grounds the skill in reality and shows Claude the exact output quality expected.

**Structure:**
```markdown
## Example

**User:** [The actual prompt that would trigger the skill]

**Expected output:**
[Structure, not necessarily complete code]
[What quality, detail, constraints the example demonstrates]
```

**Example for FastAPI skill:**
```markdown
## Example

**User:** Add a POST endpoint to create a new user. The endpoint should accept email and password, validate the password is at least 8 characters, and reject if the email already exists.

**Expected output:**
- Pydantic model `UserCreate` with email (EmailStr) and password (str, min_length=8)
- Route at `POST /users` with dependency-injected db session
- HTTPException 409 if email exists, 400 if validation fails
- Response model `UserResponse` (never return the password)
- Test file `/tests/test_users.py` with 3 test cases (success, duplicate email, weak password)
```

---

## Dynamic Content Injection

Skills can embed dynamic content that executes at activation time and injects output into context.

### `!command` Syntax (Shell Execution)

Embed shell commands using the `!` prefix. They execute when the skill is loaded and their output is injected.

**Syntax:**
```markdown
Current branch: !git branch --show-current
Recent commits: !git log --oneline -5
Project name: !jq .name package.json
Active Python version: !python --version
```

**Rules:**
- Command executes in the current working directory
- Output is captured and injected into the skill context
- Execution happens **once** when the skill is loaded
- Output is cached for the duration of the session

**Examples:**

```markdown
## Instructions

### Current Project Context
- **Repository:** !pwd
- **Branch:** !git branch --show-current
- **Latest changes:** !git log --oneline -3
- **Project type:** !jq .name package.json || echo "Not a Node.js project"

### Environment
- **Node version:** !node --version
- **Python version:** !python3 --version
- **Active virtual env:** !echo $VIRTUAL_ENV || echo "No venv active"
```

**Use cases:**
- Inject current git state without hardcoding branch names
- Show current project metadata (package.json, pyproject.toml)
- Display environment info (Python version, Node version, venv status)
- Reduce prompt length by computing values dynamically

**Gotcha:** If the command fails (exits non-zero), the output is an error message. Handle gracefully:
```markdown
Project type: !jq .name package.json || echo "Not a Node project"
```

---

### Environment Variables

Skills can reference environment variables set in `.claude/settings.json` or the user's shell.

**Standard Claude Code environment variables:**

| Variable | Meaning | Example |
|---|---|---|
| `CLAUDE_SESSION_ID` | Unique ID for the current session | `abc123def456` |
| `CLAUDE_EFFORT` | Current effort level | `high` |
| `CLAUDE_SKILL_DIR` | Directory of the current skill | `/Users/name/.claude/skills` |
| `CLAUDE_PROJECT_ROOT` | Project root (repo root or working dir) | `/Users/name/project` |
| `CLAUDE_HOME` | User home directory | `/Users/name` |

**Custom variables:** Set in `.claude/settings.json` under `env`:
```json
{
  "env": {
    "MY_API_KEY": "secret123",
    "DEFAULT_MODEL": "claude-opus-4"
  }
}
```

**Usage in skills:**
```markdown
Your API key is set to: $MY_API_KEY
Default model for this project: $DEFAULT_MODEL
Session ID: $CLAUDE_SESSION_ID
Project: $CLAUDE_PROJECT_ROOT
```

---

## Argument Substitution

Skills can accept arguments from the slash command invocation and use them in the body.

### Syntax

**Positional arguments:**
```
/skill-name arg1 arg2 arg3
```

Access in skill body:
```markdown
$1 = arg1
$2 = arg2
$3 = arg3
$@ = all arguments as a string
$* = all arguments as an array
$ARGUMENTS = full argument string
```

**Named arguments (key=value):**
```
/skill-name --name "John Doe" --email "john@example.com"
```

Access in skill body:
```markdown
$name = "John Doe"
$email = "john@example.com"
```

### Examples

**Example 1: Positional arguments**

Skill: `/research-company`
```markdown
## Instructions

Company to research: $1
LinkedIn URL: $2
Depth: $3 (Tier 1, Tier 2, or Tier 3)

### Research Plan
1. Start with $1 company page
2. Check LinkedIn at $2
3. Depth level: $3 (affects time allocation)
```

User command:
```
/research-company "TechRetail Inc" "linkedin.com/company/techretail-inc" "Tier 1"
```

**Example 2: Named arguments**

Skill: `/code-review`
```markdown
## Instructions

### Setup
File to review: $file
Effort level: $effort
Focus areas: $focus

### Review Process
1. Read $file
2. Analyze with effort=$effort
3. Focus on: $focus
```

User command:
```
/code-review --file "src/api/routes.py" --effort "high" --focus "security,performance"
```

**Example 3: Mixed and conditional**

```markdown
## Instructions

### Target
Language: $lang (or default to $CLAUDE_SKILL_LANGUAGE env var)
File: $1
Test framework: $test_framework

### Execution
Run tests with: !npm test || pytest
Review output for: $1
```

User command:
```
/test-runner src/app.ts --lang typescript --test-framework jest
```

---

## Hooks Integration

Skills can trigger lifecycle hooks that run before or after the skill activates, or respond to specific events.

### Hook Types

| Hook | When it fires | Use for |
|---|---|---|
| `on-activate` | When skill is loaded | Setup (install deps, clone repos, set env vars) |
| `on-deactivate` | When skill is unloaded | Cleanup (remove temp files, reset config) |
| `pre-response` | Before Claude generates response | Validation, context injection |
| `post-response` | After Claude generates response | Formatting, post-processing, notifications |

### Syntax (in frontmatter)

```yaml
on-activate:
  shell: |
    echo "Skill activated"
    export MY_VAR=value
  python: |
    import json
    print("Python setup code here")
```

### Example: Data pipeline setup hook

```yaml
---
name: dbt-data-pipeline
on-activate:
  shell: |
    # Install dbt if not present
    if ! command -v dbt &> /dev/null; then
      pip install dbt-postgres dbt-snowflake
    fi
    
    # Load current dbt project info
    dbt --version
    if [ -f "dbt_project.yml" ]; then
      echo "dbt project found"
    fi
---

# dbt Data Pipeline Skill

## When to activate
...
```

---

## Supporting File Layout

Skills often require supporting files beyond the `.md` file itself.

### Recommended structure for a complex skill:

```
.claude/skills/
├── skill-name.md                 # Main skill file (with frontmatter)
├── skill-name/
│   ├── templates/
│   │   └── dossier-template.md   # Reusable output templates
│   ├── prompts/
│   │   └── research-prompt.txt   # Complex prompts stored separately
│   ├── examples/
│   │   ├── example-1.md
│   │   └── example-2.md
│   └── reference/
│       └── owasp-top-10.json     # Reference data
```

### Example: Company Intelligence skill layout

```
.claude/skills/
├── company-intelligence.md
└── company-intelligence/
    ├── templates/
    │   ├── tier-1-dossier.md     # Full Account Intelligence template
    │   ├── tier-2-brief.md       # Medium brief template
    │   └── tier-3-snapshot.md    # Quick snapshot template
    ├── prompts/
    │   ├── research-guide.md     # Tier 1 research checklist
    │   └── pain-signal-guide.md  # How to extract pain signals
    └── examples/
        └── completed-dossier.md  # Real example output
```

**Access in skill body:**
```markdown
See the Account Dossier template in `./company-intelligence/templates/tier-1-dossier.md`

Research checklist: See `./company-intelligence/prompts/research-guide.md`
```

Claude will resolve relative paths to the skill directory automatically.

---

## Skill vs. Command vs. Agent Decision Guide

**When should you use each?**

### Use a **Skill** (`/skill-name`) when:
- Task is **scoped and repeatable** — writing REST endpoints, security audits, code reviews
- You want **semantic auto-invocation** — activate based on keywords or file patterns
- Task is **instruction-based**, not code-based
- You need **argument substitution** or **hook integration**
- Task **does not require spawning long-lived subprocesses**
- The user will invoke it many times in different contexts

**Example skills:**
- `/fastapi-crud` — writing FastAPI endpoints
- `/security-audit` — code security review
- `/dbt-pipeline` — data transformation design
- `/cold-email-sequence` — sales outreach

### Use a **Command** (`!command` in shell scripts) when:
- Task is a **one-shot CLI invocation** (building, testing, deploying)
- Task is **system-level** (file operations, package management, infrastructure)
- Task **outputs to stdout/stderr**, not to the editor
- You don't need to persist state or re-invoke the same command multiple times

**Example commands:**
```bash
!npm run build
!git commit -m "message"
!terraform apply
!python -m pytest
```

### Use an **Agent** (subagent spawned by a skill) when:
- Task is **domain-specific and requires specialized knowledge** (security specialist, data analyst, DevOps engineer)
- Task needs **its own model instance** and token budget
- Task is **long-running** and shouldn't consume parent's context
- Task needs to **operate independently** and return results to parent
- You want **parallelization** (multiple agents working on 5 accounts in parallel)

**Example agents:**
- `SecurityReviewer` — dedicated security audit subagent
- `CompanyIntelligenceSpecialist` — dedicated research agent for each account
- `DataQualityEngineer` — dedicated data validation agent

**Decision tree:**

```
Is this a repeatable, instruction-based task?
├─ Yes
│  ├─ Is it domain-specific and needs its own knowledge base?
│  │  ├─ Yes → Use an Agent (subagent in .claude/agents/)
│  │  └─ No → Use a Skill (/skill-name)
│  │
│  └─ Can it be handled in one model invocation?
│     ├─ Yes → Use a Skill
│     └─ No → Use an Agent
│
└─ No (one-shot system task)
   └─ Use a Command (!bash command)
```

**Real example:**
- **Skill `/company-intelligence`** — user runs it to research one account, Claude follows 5-layer model, returns dossier
- **Agent `CompanyIntelligenceSpecialist`** — if user has 100 accounts to research, spawn 10 parallel agents, each researching 10 accounts independently
- **Command `!git log`** — one-shot: fetch recent commits and exit

---

## Five Complete SKILL.md Examples

### Example 1: Simple, Minimal Skill

**File:** `.claude/skills/poetry-python.md`

```markdown
---
name: poetry-python
description: "Python dependency management with Poetry. Activate for managing pyproject.toml, adding dependencies, version pinning, or creating new Python projects."
effort: medium
---

# Poetry — Python Dependency Management

## When to activate
- Adding or updating dependencies in a Python project
- Creating a new Python project with Poetry
- Managing version constraints in pyproject.toml
- Resolving dependency conflicts or updating lock files
- Setting up a Python virtual environment with Poetry

## When NOT to use
- pip-based projects without Poetry (use pip-requirements skill instead)
- Non-Python projects (use language-specific dependency managers)
- When Poetry is already installed and project is ready (only help when blocked)

## Instructions

### Project Setup

Always initialize a new Poetry project with a specific Python version:

```bash
poetry new my-project --name my_package
cd my-project
poetry python version "^3.10"  # Specify minimum Python version
```

For existing projects, install Poetry first:
```bash
curl -sSL https://install.python-poetry.org | python3 -
poetry install  # Create venv and install from pyproject.toml
```

### Adding Dependencies

Use `poetry add` for both main and dev dependencies:

```bash
poetry add requests django-rest-framework sqlalchemy
poetry add --group dev pytest black mypy ruff
```

Never use `pip install` directly — always use `poetry add`. Poetry manages the lock file.

### Version Constraints

Use semantic versioning in pyproject.toml:

```toml
[tool.poetry.dependencies]
python = "^3.10"           # >=3.10, <4.0
requests = "^2.28"         # >=2.28, <3.0
django = "~4.2"            # >=4.2, <5.0
sqlalchemy = "==2.0.0"     # Exact version only when required
```

Rules:
- `^` allows minor/patch updates (e.g., `^2.28.0` allows `2.30.0`, not `3.0.0`)
- `~` allows patch updates only (e.g., `~2.28` allows `2.28.5`, not `2.29.0`)
- `==` pins exact version — use sparingly
- Always pin Python with `^3.10` or higher (never `*`)

### Virtual Environment

Poetry automatically creates a venv in `.venv/` by default. Activate it:

```bash
poetry shell              # Activate the venv
source .venv/bin/activate # Alternative (macOS/Linux)
.venv\Scripts\activate    # Windows
```

### Lock File

Always commit `poetry.lock` to version control. It ensures reproducible installs:

```bash
poetry install  # Uses lock file
poetry update   # Updates dependencies *and* lock file (use sparingly)
```

After adding a dependency, Poetry updates `poetry.lock` automatically. Commit both `pyproject.toml` and `poetry.lock`.

### Resolving Conflicts

If `poetry install` fails due to conflict:

```bash
poetry lock --no-update  # Refresh lock file without updating versions
poetry install           # Try again
```

If conflict persists, relax version constraints in `pyproject.toml`:

Bad (too strict):
```toml
requests = "^2.28.0"
urllib3 = "^1.26.0"  # requests already requires urllib3; conflict
```

Good (let Poetry resolve):
```toml
requests = "^2.28"  # requests depends on urllib3; let it choose
```

## Example

**User:** Create a new FastAPI project with Poetry, pin Python to 3.11+, add fastapi, uvicorn, pydantic, and pytest for testing.

**Expected output:**
1. Run `poetry new fastapi-app --name fastapi_app`
2. Set Python version to `^3.11` in `pyproject.toml`
3. Run `poetry add fastapi uvicorn pydantic`
4. Run `poetry add --group dev pytest httpx` (httpx for testing async endpoints)
5. Create `.gitignore` with `.venv/` and `*.pyc`
6. Show project structure and instructions to activate venv
```

---

### Example 2: Skill with File-Based Auto-Activation

**File:** `.claude/skills/pytest-fixtures.md`

```markdown
---
name: pytest-fixtures
description: "pytest fixture authoring, parametrization, and advanced test utilities. Activate for writing test fixtures, mocking strategies, or parametrized test suites."
when_to_use: "Use when working with conftest.py, test files (**/*.test.py, **/test_*.py), or when user mentions fixtures, parametrization, mocking, or test utilities."
paths:
  - "**/conftest.py"
  - "**/*.test.py"
  - "**/test_*.py"
  - "**/tests/**"
effort: medium
---

# pytest Fixtures & Test Utilities

## When to activate
- Writing a reusable fixture in conftest.py
- Parametrizing tests with multiple inputs
- Setting up test databases or mocking external services
- Using fixtures to manage test state (setup/teardown)
- Debugging a test that's slow or flaky

## When NOT to use
- Simple assertions (not a fixture pattern)
- Unit tests that don't need setup/teardown (just write the test)
- Integration tests for external APIs (use VCR or Mock instead)
- Performance testing (use pytest-benchmark skill instead)

## Instructions

### Fixture Basics

A fixture is a reusable setup/teardown function. Define in conftest.py:

```python
import pytest
from app import create_app
from db import Database

@pytest.fixture
def app():
    """Create and configure app for testing."""
    app = create_app(config="test")
    yield app
    # Teardown happens after test

@pytest.fixture
def client(app):
    """Return test client, depends on app fixture."""
    return app.test_client()

@pytest.fixture
def db():
    """Provide database connection, clean up after test."""
    db = Database.connect("sqlite:///:memory:")
    db.init_schema()
    yield db
    db.close()
```

Use fixtures in tests by adding them as function arguments:

```python
def test_user_creation(db, client):
    # db and client are auto-injected
    response = client.post("/users", json={"name": "Alice"})
    assert response.status_code == 201
```

### Parametrized Tests

Use `@pytest.mark.parametrize` to run the same test with multiple inputs:

```python
@pytest.mark.parametrize("email,is_valid", [
    ("valid@example.com", True),
    ("invalid@", False),
    ("no-at-sign", False),
    ("", False),
])
def test_email_validation(email, is_valid):
    result = validate_email(email)
    assert result == is_valid
```

This runs the test 4 times (one for each parameter set).

### Fixture Scopes

Control when a fixture is created and destroyed:

```python
@pytest.fixture(scope="function")  # Default — created per test
def db(): ...

@pytest.fixture(scope="session")   # Created once per test session; reuse across all tests
def app(): ...

@pytest.fixture(scope="module")    # Created once per test module
def config(): ...
```

Use `session` for expensive setup (database connection, app initialization). Use `function` for per-test setup (test data, mocking).

### Mocking & Patching

Mock external services to avoid test dependencies:

```python
from unittest.mock import patch, MagicMock

@pytest.fixture
def mock_api():
    """Mock external API."""
    with patch("requests.get") as mock_get:
        mock_get.return_value.json.return_value = {"user": "Alice"}
        yield mock_get

def test_fetch_user(mock_api):
    result = fetch_user("alice")
    assert result["user"] == "Alice"
    mock_api.assert_called_once_with("https://api.example.com/users/alice")
```

### Fixture Dependencies

Fixtures can depend on other fixtures:

```python
@pytest.fixture
def app():
    return create_app(config="test")

@pytest.fixture
def client(app):  # Depends on app
    return app.test_client()

@pytest.fixture
def authenticated_client(client):  # Depends on client
    client.post("/login", json={"username": "admin", "password": "secret"})
    return client

def test_admin_endpoint(authenticated_client):
    response = authenticated_client.get("/admin/dashboard")
    assert response.status_code == 200
```

### Fixture Request Object

Access fixture metadata with the `request` fixture:

```python
@pytest.fixture
def log_test_name(request):
    """Log the current test name."""
    print(f"Running: {request.node.name}")
    yield
    print(f"Finished: {request.node.name}")

def test_something(log_test_name):
    assert True
```

## Example

**User:** Create fixtures for an async FastAPI app. Include fixtures for app, authenticated client, database, and a parametrized test for multiple user roles.

**Expected output:**
1. conftest.py with:
   - `app` fixture (FastAPI instance, session-scoped)
   - `client` fixture (async TestClient)
   - `authenticated_client` fixture (logs in before each test)
   - `db` fixture (in-memory SQLite)
2. Example test using fixtures:
   - Parametrized test for 3 roles (admin, user, guest)
   - Each role tests endpoint permissions
3. Instructions to run: `pytest -v tests/`
```

---

### Example 3: Advanced Skill with Arguments and Dynamic Content

**File:** `.claude/skills/company-intelligence.md`

```markdown
---
name: company-intelligence
description: "B2B account intelligence research: decision-maker mapping, recent events, tech stack gaps, pain signal extraction. Activate when researching a company for outreach, account planning, or qualification."
when_to_use: "Use when preparing for cold outreach, building an account dossier, running account-based marketing (ABM), or qualifying enterprise leads. Provide: company name + LinkedIn URL + (optional) Tier (1/2/3)."
effort: high
allowed-tools:
  - "Read"
  - "WebFetch"
  - "WebSearch"
---

# Company Intelligence — 5-Layer Research Model

## When to activate
- User provides company name + LinkedIn URL and asks to "research this account," "build a dossier," or "find decision-makers"
- Preparing for cold outreach or account-based marketing (ABM)
- Need to understand org structure, recent events, tech stack, and pain signals
- Qualifying enterprise leads before sales outreach
- Building intelligence for 1–100 accounts (Tier 1/2/3 based on volume)

## When NOT to use
- General B2B research questions not tied to a specific account (use web research instead)
- User wants to generate cold email copy (this skill feeds outreach research, doesn't write copy)
- Researching a company as a vendor evaluation or job candidate (different research model)
- User has already done research and just wants validation (use code-review or verify instead)

## Instructions

### The 5-Layer Intelligence Model

Every dossier uses these five layers, with research depth determined by Tier (1/2/3).

#### Layer 1: Org Structure (Decision-Maker Map)

**Goal:** Identify 3 roles at the company: Economic Buyer, Champion, Influencer

- **Economic Buyer** — holds budget, has P&L accountability. (CFO, VP Finance, CRO, VPE, VP Ops)
- **Champion** — uses your solution daily, has personal incentive to buy. (Team lead, IC, manager)
- **Influencer** — shapes perception, can block or accelerate. (CTO, CPO, peer leader, audit)

**Sources:**
- Company LinkedIn page (Executive section, recent hires in C-suite/VP)
- LinkedIn search: "[Company] [Title]"
- G2/Capterra: Review authors often list title/seniority
- Job postings: New hires reveal expanding functions

**Decision logic:**
- <100 headcount: Economic buyer = founder/CEO; Champion = direct team lead
- 100–1000: VP/CFO of function; Champion = manager or lead IC; Influencer = CTO or Chief
- >1000: Add Sponsor (director-level bridge to Economic Buyer)

#### Layer 2: Recent Events (Momentum Signals)

**Goal:** Find last 90 days of activity that creates urgency or context.

**Sources (priority order):**
1. Company LinkedIn (posts, hires, milestones, funding, acquisitions, office openings)
2. CEO/VP LinkedIn (activity, reposts, articles, comments)
3. Press releases (Crunchbase, company website, Medium)
4. Funding (Crunchbase, TechCrunch, VentureBeat)
5. Product launches (G2 features, newsletters, blogs)
6. Leadership changes (CEO, CRO, CTO, VP function)

**Scoring:**
- Funding (90 days) = highest urgency
- Product launch / market expansion = medium urgency
- Leadership change = medium urgency
- News/press = low urgency

#### Layer 3: Tech Stack & Gaps

**Goal:** Identify what they use, what's missing, what's breaking.

**Sources (priority order):**
1. BuiltWith (marketing tech, analytics, CRM, infrastructure, security)
2. LinkedIn job postings ("seeking [tool] expert" = current stack; "nice to have [tool]" = aspirational/gap)
3. G2 reviews (filter by company size + industry, read for pain)
4. Crunchbase (tech integrations if listed)
5. Company blog/podcast (architecture decisions)
6. SEC filings if public (software expense breakdowns)

**Decision logic:**
- They use [Tool A] + [Tool B] but *not* [Tool C] = likely gap or conscious decision
- Multiple reviews say "[Tool] is slow to integrate" = pain proxy
- Job posting: "must know [Tool]" but no usage elsewhere = new initiative
- Using [Competitor Tool] = reference objection

#### Layer 4: Pain Signals (Job Posting + Review Mining)

**Goal:** Extract implicit problems from job postings and G2 reviews.

**Job posting patterns:**
- "Seeking [role] to own/build/improve [function]" → investing in that area
- "5+ years with [hard skill]" → bottleneck today
- "Must have scale/growth/automation experience" → hitting friction
- "Streamline [X]" → current process is slow/manual
- "Migrate from [Old] to [New]" → legacy debt, vendor evaluation underway
- "Build dashboards/reporting" → no visibility today

**G2 review patterns (filter by company size + industry):**
- "Slow to implement" → sales cycle + deployment friction
- "Missing [feature]" → feature gap you could fill
- "Expensive" → cost objection, budget sensitivity
- "Poor integration with [tool]" → integration nightmare = selling point
- "Can't scale beyond X" → growth pain, acquisition opportunity

**Scoring:** Count signals. 3+ distinct across reviews + postings = strong qualification.

#### Layer 5: Social Footprint (Engagement & Thought Leadership)

**Goal:** Understand visibility and what they care about.

**Sources:**
1. CEO/VP LinkedIn (posts frequency, engagement, articles, comments)
2. Company LinkedIn (organic engagement rate, industry topics)
3. CEO Twitter/X (if active, reveals real-time priorities)
4. Company newsletter (if they publish)
5. Podcast/webinar appearances

**Scoring:**
- Active (posts 2–4x/week, engages comments) = visible, responsive to inbound
- Dormant (<1 post/month, no engagement) = less likely to see cold outreach
- Thought leadership (speaking, writing, cited expert) = credible, easier to approach

### Research Depth Tiers

All tiers use the 5-layer model; research intensity differs.

**Tier 1 — Full Dossier (20 min):**
- Find 3 decision-makers (name, title, LinkedIn activity, last post date)
- Extract 3–5 recent events (dates, links)
- List 10+ tools, identify 2–3 gaps
- Mine 5+ job postings + 8–10 G2 reviews, extract 5+ pain signals
- Profile CEO + 2 VPs (activity frequency, engagement style)
- Output: Full Account Dossier using template

**Tier 2 — Medium Brief (10 min):**
- Find 2 decision-makers (economic buyer + champion)
- Extract 2–3 recent events (most recent)
- List 5–7 key tools, 1–2 gaps
- Mine 3–4 job postings + 4–5 reviews, extract 3–4 pain signals
- CEO activity level only
- Output: 1-page abbreviated dossier

**Tier 3 — Minimum Profile (3 min):**
- Find CEO name + title
- One recent signal (funding, news, hire)
- One notable tool or gap
- One pain signal (from job or review)
- Skip social footprint
- Output: One-paragraph snapshot

### Decision Trees

**Should I research this account?**

```
Do you have company name + LinkedIn URL?
├─ Yes
│  ├─ Tier 1 account (high-value, strategic, named deal)?
│  │  └─ Yes → Invest 20 min (full dossier)
│  ├─ Tier 2 (mid-market, account list)?
│  │  └─ Yes → 10-min brief
│  └─ Tier 3 (volume or quick-qualify)?
│     └─ Yes → 3-min snapshot
└─ No → Ask for company name + LinkedIn URL first
```

**How do I find decision-makers?**

```
Start with company LinkedIn page:
├─ List C-suite/VP?
│  ├─ Yes → Note names, check individual profiles for activity
│  └─ No → <50 headcount; assume CEO is economic buyer
├─ "People" tab → Filter by title (VP Finance, VP Sales, CTO, CPO)
├─ Job postings → "Reporting to [Name]" = confirms role
└─ Google + LinkedIn search "[Company] [Role]"
```

## Example

**User:** Tier 1 research on TechRetail Inc (e-commerce platform). LinkedIn: linkedin.com/company/techretail-inc. Our product: data pipeline orchestration.

**Expected output:**
1. **Decision-Maker Map:** David Park (VP Finance, economic buyer), Alex Rodriguez (VP Data, champion), Marcus Williams (CTO, influencer) — names, titles, LinkedIn activity dates
2. **Recent Events:** Series B $25M (May 2026), hired Director of Data Engineering (May), new Data Quality Engineer role (June), CEO post about data-first strategy
3. **Tech Stack:** Snowflake, Apache Airflow, dbt (recently adopted), Looker, Segment, Salesforce. Gaps: managed orchestration, dbt governance, data quality monitoring
4. **Pain Signals (Top 3):**
   - Airflow operations overhead (3 job postings + G2 reviews) → High urgency
   - Multi-tool stack fragmentation (2 job postings + reviews) → Medium-High urgency
   - Data quality monitoring (1 new job posting + reviews) → Medium urgency
5. **Social Footprint:** CEO active (thought leader), VP Data very active (3–4 posts/week), CTO less visible
6. **Recommended hook:** Series B capital + new director hire as entry vector. Lead with "I noticed Jamie Kim (new Director of Data Engineering) was hired..."
7. **Recommended channel:** LinkedIn InMail to Alex Rodriguez (VP Data) — active, receptive, champion role
8. **Full dossier:** Use Account Dossier template (see supporting files)
```

---

### Example 4: Security-Focused Skill with Context Fork

**File:** `.claude/skills/security-audit.md`

```markdown
---
name: security-audit
description: "Security code review: authentication, RBAC, secrets management, SQL injection, CSRF, XSS, API security, cryptography. Activate for security audits, permission models, or vulnerability assessment."
effort: xhigh
allowed-tools:
  - "Read"
  - "WebFetch"
  - "Bash"
context:fork: true
---

# Security Audit Skill

## When to activate
- Conducting a security review of authentication or authorization code
- Reviewing permission models and RBAC implementations
- Auditing API endpoints for common vulnerabilities (SQL injection, CSRF, XSS)
- Assessing secrets management (API keys, database credentials)
- Reviewing cryptographic implementations
- Building compliance requirements (SOC 2, HIPAA, GDPR)

## When NOT to use
- Casual code review (use code-review skill instead)
- Performance auditing (separate concern)
- Infrastructure/DevOps security (use cloud-security skill)
- Dependency scanning for known CVEs (use dependency-audit skill)

## Instructions

### Authentication Review Checklist

**Bad patterns to flag:**
- Storing plaintext passwords (always hash with bcrypt, argon2, or scrypt)
- Storing passwords in logs or error messages
- Hardcoded credentials in code
- Password sent over HTTP (must be HTTPS only)
- No rate limiting on login endpoint (brute force vulnerability)
- Session tokens without expiration or rotation
- JWTs without signature verification

**Good patterns to verify:**
- ✓ Passwords hashed with bcrypt/argon2/scrypt (10+ rounds)
- ✓ Login endpoints rate-limited (e.g., 5 attempts per minute per IP)
- ✓ Sessions expire after 15–30 minutes of inactivity
- ✓ Credentials never logged or included in stack traces
- ✓ HTTPS enforced; HTTP redirects to HTTPS
- ✓ OAuth 2.0 or SAML for enterprise auth (not custom)

### Authorization (RBAC) Review Checklist

**Bad patterns:**
- Role checks only on frontend (always verify on backend)
- Hardcoded role names in business logic (use constants)
- No separation between authenticated and authorized (both are needed)
- "Is user admin?" checks everywhere (use middleware/decorators)
- Privilege escalation via parameter manipulation (user_id in URL)
- No audit log of who did what and when

**Good patterns:**
- ✓ Backend enforces all authorization checks (frontend is UX only)
- ✓ Role-based access control with clear permission matrix
- ✓ Authorization middleware/decorators (not scattered in business logic)
- ✓ User identity verified independently of user-submitted ID
- ✓ All privilege-changing actions logged (role changes, deletions, etc.)
- ✓ Regular audit log review (weekly or monthly)

### API Security Review Checklist

**SQL Injection:**
- ✗ String concatenation: `SELECT * FROM users WHERE id = '` + user_id + `'`
- ✓ Parameterized queries: `SELECT * FROM users WHERE id = ?` with bound params
- ✓ ORM layer (Django ORM, SQLAlchemy, Prisma) — uses parameterized queries by default

**CSRF (Cross-Site Request Forgery):**
- ✗ No CSRF token on state-changing requests (POST, PUT, DELETE)
- ✓ CSRF tokens on all forms and AJAX requests
- ✓ SameSite cookie attribute: `SameSite=Strict` or `SameSite=Lax`

**XSS (Cross-Site Scripting):**
- ✗ Rendering user input as HTML: `document.body.innerHTML = userComment`
- ✓ Escaping/sanitizing user input: `document.textContent = userComment`
- ✓ Content Security Policy (CSP) header restricting inline scripts

**API Rate Limiting:**
- ✗ No rate limiting on public endpoints (DDoS/abuse vulnerability)
- ✓ Rate limit per IP, per API key, per user (e.g., 100 req/minute)
- ✓ Return 429 (Too Many Requests) when limit exceeded

### Secrets Management Review

**Bad patterns:**
- Hardcoded secrets in source code (visible in git history forever)
- Secrets in environment variables committed to git
- Secrets in logs or error messages
- Sharing secrets across environments (dev/staging/prod use different keys)

**Good patterns:**
- ✓ Secrets in `.env` file (gitignored, never committed)
- ✓ Use secrets manager (AWS Secrets Manager, HashiCorp Vault, 1Password)
- ✓ Environment-specific secrets (dev API key ≠ prod API key)
- ✓ Secrets never logged (strip from error messages, stack traces)
- ✓ Rotate secrets regularly (e.g., monthly for API keys)

### Cryptography Review

**Key generation:**
- ✓ Use cryptographically secure random (not `random.random()`)
- ✓ For RSA, minimum 2048-bit key (4096 preferred)
- ✓ For elliptic curve, minimum P-256 (P-384 or P-521 preferred)

**Encryption at rest:**
- ✓ Database columns with sensitive data (PII, financial) use encryption
- ✓ Use AES-256-GCM (AES-256 in authenticated encryption mode)
- ✓ Never roll your own encryption (use established libraries)

**Encryption in transit:**
- ✓ HTTPS only (TLS 1.2 minimum; 1.3 preferred)
- ✓ Certificate pinning for sensitive mobile apps
- ✓ Disable weak ciphers and algorithms (no MD5, SHA1)

### Compliance Checklist

**GDPR (if users are EU residents):**
- ✓ Right to deletion (user can request data erasure)
- ✓ Data portability (user can export their data)
- ✓ Privacy policy (clear, plain language, updated)
- ✓ Consent for processing personal data

**SOC 2 Type II (if you process customer data):**
- ✓ Audit logs of all data access and changes
- ✓ Incident response plan and procedures
- ✓ Regular security assessments (annually)
- ✓ Employee training on security policies

**Payment Card Industry (PCI DSS, if handling credit cards):**
- ✓ Never store card data (use Stripe, PayPal, or tokenization)
- ✓ Encryption for card transmission
- ✓ Annual security assessment

## Example

**User:** Audit our FastAPI user authentication and permission system. We have:
- User login with email/password
- JWT tokens with 24-hour expiration
- Role-based endpoints (admin, moderator, user)
- User can view only their own profile

**Expected security audit report:**
1. **Authentication:** Verify password hashing (bcrypt?), JWT signing (strong secret?), rate limiting on login, password complexity
2. **Authorization:** Verify permission checks on all endpoints (not just frontend), no privilege escalation via user_id manipulation, audit logging for role changes
3. **API Security:** Check for SQL injection (if using raw SQL), CSRF protection, XSS protection on user inputs
4. **Secrets:** Verify JWT secret is not hardcoded, API keys are environment variables
5. **Risk rating:** High, Medium, Low
6. **Recommendations:** Top 3 security improvements (prioritized by risk)
```

---

### Example 5: Workflow Skill with Templates and Multiple Arguments

**File:** `.claude/skills/cold-email-sequence.md`

```markdown
---
name: cold-email-sequence
description: "B2B cold email campaign: prospect research, email templates, follow-up sequences, personalization hooks, CTA strategy. Activate when writing cold outreach for lead generation."
when_to_use: "Use when creating cold email campaigns, writing prospect-specific emails, designing follow-up cadences, or optimizing for reply rates. Provide: prospect name, company, pain signal (optional), existing cold email (optional)."
effort: high
allowed-tools:
  - "Read"
  - "Edit"
  - "Write"
  - "WebSearch"
  - "WebFetch"
---

# Cold Email Sequence Framework

## When to activate
- Writing cold email copy for B2B lead generation
- Building a multi-email follow-up sequence
- Personalizing emails based on prospect research
- Designing subject lines and CTAs for cold outreach
- Optimizing for reply rate (engagement metrics)

## When NOT to use
- Warm introductions or referral emails (use different framework)
- Email templates for existing customers (use customer-success skill)
- Marketing campaigns to opted-in lists (use email-marketing skill)
- Sales emails after prospect has engaged (use sales-followup skill)

## Instructions

### Cold Email Anatomy

**Structure (in order):**

1. **Subject line** (4–10 words, personalized, curiosity-driven)
2. **Greeting** (first name only if you know it; "Hey [First]" is fine)
3. **Hook** (0–2 sentences; prove you've done research; reference specific signal)
4. **Problem statement** (1 sentence; the pain you solve)
5. **Social proof** (optional; 1 sentence; customer reference or credibility)
6. **CTA** (1 sentence; specific ask with low friction)
7. **Closing** (first name + title; optional one-liner)

**Tone:** Conversational, brief, direct. No corporate fluff.

### Hook Patterns

Choose 1–2 of these patterns per email. Rotate them across the sequence.

**Pattern 1: News Hook**
```
I saw [Company] raised $[X] Series [X] last [month]. Congrats to [CEO Name]'s team.
That kind of growth usually means [implication: new pain, new priorities, new budget].
We help companies like [similar company] solve that problem by [one-sentence solution].
```

**Pattern 2: Personnel Hook**
```
I noticed [New Hire Name] just joined as [title] at [Company]. Her background in [domain] suggests you're doubling down on [area].
Typically, new leaders in that role hit [specific pain] within first 90 days.
We built [Your Solution] to solve exactly that.
```

**Pattern 3: Job Posting Hook**
```
I was looking at your open "[Job Title]" role. The fact that you're hiring for [skill] tells me you're scaling [function].
Most teams we work with are in the same boat — they're growing [function] faster than their current [tool/process] can handle.
[Your solution] reduces [specific outcome] for teams like yours.
```

**Pattern 4: Tech Stack Hook**
```
I noticed you're using [Tool A] for [function]. You're also hiring for [Tool B], which suggests you want to add [capability].
The tricky part—and where most teams get stuck—is integrating [Tool A] + [Tool B] without building a platform team.
[Your solution] syncs those two automatically.
```

**Pattern 5: Competitive Displacement**
```
I'm guessing you currently use [Competitor] for [function]. We work with companies that used to use [Competitor] before switching to [Your solution].
The main thing they cited: [specific outcome metric, e.g., "50% cost savings," "3x faster deployment"].
Worth a quick 20-min conversation to see if you'd get similar results?
```

### Subject Line Formulas

**Formula 1: Curiosity + Specificity**
```
Quick question on [specific topic from research]
```
Example: `Quick question on your Airflow deployments`

**Formula 2: Name Drop (if CEO is famous)**
```
[CEO Name] + [your solution] = ?
```
Example: `Guillermo Rauch + data quality = ?`

**Formula 3: Specific Metric**
```
[Company] + [Outcome Metric]
```
Example: `TechRetail + 50% faster pipelines`

**Formula 4: Reference Objection**
```
Re: [Job Posting Title] at [Company]
```
Example: `Re: Data Infrastructure Lead at TechRetail`

**Avoid:**
- ✗ Vague: "Hi there" or "Quick question"
- ✗ Urgent language: "URGENT", "ACTION REQUIRED"
- ✗ Too long (aim for <50 characters)

### CTA Patterns

**Low-friction CTAs (best response rate):**
- "Do you have 20 minutes next week?" (specific, easy yes/no)
- "Quick question — how are you handling [problem]?" (asks for 1 minute answer)
- "I'd love your take on [topic] — what's your approach?" (flattery + specific ask)
- "Curious if you've hit [pain signal] yet?" (problem-focused)

**Medium-friction CTAs:**
- "Would you be open to a brief call?" (vague time, less likely)
- "Let me know if you'd like to chat" (too passive)

**Avoid:**
- ✗ "Schedule a call" (link feels cold, low response)
- ✗ "Let's hop on a call" (presumes interest; too forward)
- ✗ "Reply with the best time" (requires work from prospect)

### Follow-Up Sequence (5 emails over 14 days)

**Email 1 (Day 0): News/Personnel/Job Posting Hook**
- Pattern: Hook (research-based)
- Tone: Curious, not salesy
- CTA: Low-friction question
- Length: 50–80 words

**Email 2 (Day 3): Reinforce + Add Specificity**
- Pattern: Different hook (if Email 1 didn't get response)
- Tone: Still curious; add credibility (customer reference or case study)
- CTA: Same low-friction ask
- Length: 50–80 words
- Subject: "Re: [Original subject]" or new subject line

**Email 3 (Day 7): Change Angle (Pain Signal or Feature)**
- Pattern: Shift from the research to a pain signal (different angle)
- Tone: Problem-focused
- CTA: Different CTA (ask for opinion instead of meeting)
- Length: 60–90 words
- Subject: Completely new subject (not a reply to Email 1)

**Email 4 (Day 11): Social Proof + Specificity**
- Pattern: Customer reference (if applicable)
- Tone: Less is more; lead with social proof
- CTA: Final ask; if no response, this is the last persistent attempt
- Length: 40–70 words
- Subject: Company name or specific achievement

**Email 5 (Day 14): Breakup or Soft Close (optional)**
- Pattern: Acknowledge likely no interest; offer low-friction way back in
- Tone: Respectful, not pushy
- CTA: "If things change, let me know"
- Length: 30–50 words
- Example: "Probably not the right time. If that changes and you want to explore [solution], I'm here. Good luck with [company goal]."

### Personalization Checklist

Before sending:
- ✓ Use first name (if you have it)
- ✓ Reference specific recent event (funding, hire, news, job posting)
- ✓ Mention specific pain or goal (not generic problems)
- ✓ Show you've visited company LinkedIn page (you know who works there)
- ✓ Avoid templates (no "Hi [FirstName]" merge tags visible)
- ✓ One link maximum (to case study or article; not to your website homepage)

### Metrics to Optimize

| Metric | Target | Optimization |
|---|---|---|
| Open rate | 25–40% | Subject line (curiosity, specificity) |
| Reply rate | 3–8% | Personalization (research + hook quality) |
| Meeting rate | 15–30% of replies | CTA clarity (specific, low-friction) |
| Average response time | 24–72 hours | Subject/hook alignment (timely, relevant) |

## Example

**User:** Write a 5-email cold sequence to Alex Rodriguez (VP Data at TechRetail Inc). Our product: managed data pipeline orchestration. Key pain: Airflow operational overhead (found in job postings + G2 reviews).

**Expected output:**

```
Email 1 (Day 0) — News Hook
Subject: TechRetail's Series B

Hey Alex,

Saw TechRetail just raised $25M Series B to fuel EU expansion. Congrats to Sarah and the team.

That kind of capital usually means doubling down on infrastructure — especially data pipelines. I'm guessing Airflow operations are getting more complex as you scale.

We help teams reduce Airflow overhead by 50%+ in the first 90 days. Most of our customers had the exact issue you're probably hitting now.

Curious — how are you thinking about data platform architecture post-Series B?

[Your name]


Email 2 (Day 3) — Reinforce + Personnel Hook
Subject: Re: TechRetail's Series B

Hey Alex,

Also noticed you brought on Jamie Kim as Director of Data Engineering. She has a really strong background in platform scaling — if her past role is any indication, Airflow optimization is probably top-of-mind for her.

Most teams we work with aren't even aware that 50% of their Airflow time goes to operations (deployments, debugging, monitoring) rather than data work. Jamie will probably identify that fast.

Figured you should know: there's a better way. Happy to show you in 20 minutes if that's interesting.

[Your name]


Email 3 (Day 7) — Pain Signal Focus
Subject: Data pipeline operations

Hey Alex,

Your job posting for "Data Infrastructure Lead" caught my eye. The fact that you're explicitly looking to "reduce operational overhead" tells me Airflow deployments are slower than your growth allows.

Your review on G2 from a Sr. Data Engineer actually mentions "2+ hour deployments" — that's painful. And that's exactly what we built our platform to solve.

How much of your team's time is actually spent on data work vs. keeping Airflow running?

[Your name]


Email 4 (Day 11) — Social Proof
Subject: TechRetail + [Customer Company]

Hey Alex,

[Customer Company] (another e-commerce platform ~your size) switched to our orchestration platform last quarter. After 90 days, they'd cut Airflow ops overhead by 60% and reduced Snowflake costs by 25%.

If you're seeing similar pain, I'd share their case study. Worth 20 minutes?

[Your name]


Email 5 (Day 14) — Soft Close
Subject: (No subject, or: One more thing)

Hey Alex,

Probably not the best time. If that changes and data pipeline operations becomes a bottleneck, I'm here.

Good luck with the EU expansion.

[Your name]
```

---

---

## Advanced Topics

### Monorepo Discovery Rules

Skills **do not** walk up the directory tree. This is the most common source of confusion when migrating from CLAUDE.md patterns.

| Feature | Walks up? | Discovery |
|---|---|---|
| `CLAUDE.md` | Yes | Walks from current file to repo root |
| `.claude/rules/` | No | Uses file path matching in rules |
| `.claude/skills/` | No | Only skills in nearest `.claude/skills/` are active |
| `~/.claude/skills/` | Always | Global skills, always available |

**In a monorepo:**
- Global skills (`~/.claude/skills/`) available everywhere
- Root `.claude/skills/` available only from repo root
- Workspace-level `.claude/skills/` needed for workspace-specific skills

### Skill Discovery Priority

If two skills have the same name:

1. `.claude/skills/` (project-level)
2. Workspace `.claude/skills/` (if in monorepo)
3. Plugin-level skills
4. `~/.claude/skills/` (global)

---

## Troubleshooting

**Skill not activating with `/skill-name`:**
- Check filename matches skill name exactly (`my-skill.md` → `/my-skill`)
- Verify YAML frontmatter is valid (test on yamllint.com)
- Check `name` field in frontmatter

**Skill activating when it shouldn't:**
- Review "When to activate" — too broad?
- Check `when_to_use` for false positives
- Narrow the description with more specific keywords

**Skill not activating via `paths:` glob:**
- Verify glob syntax (e.g., `**/*.test.ts` requires `**` for subdirs)
- Check file path matches exactly (case-sensitive on macOS/Linux)
- Test glob with `find` command to debug

**Argument substitution not working:**
- Use `$1`, `$2`, etc. for positional arguments (not `$args[0]`)
- Use `$name` for named arguments (key=value syntax)
- Verify arguments are provided by user (e.g., `/skill arg1 arg2`)

**`!command` not injecting output:**
- Verify command is valid and works in terminal
- Check permissions (readable directories, executable binaries)
- If command fails, output is the error message; handle gracefully

---

## Migration Guide: CLAUDE.md → SKILL.md

If you're moving from CLAUDE.md-based skills to .claude/skills/ files:

**Old pattern (CLAUDE.md):**
```markdown
## Skill: fastapi-crud

When: User is writing FastAPI endpoints
How: Follow these patterns...
```

**New pattern (.claude/skills/fastapi-crud.md):**
```yaml
---
name: fastapi-crud
description: "FastAPI endpoint authoring... Activate when building new REST endpoints..."
---

# FastAPI CRUD

## When to activate
- Building new FastAPI endpoints...

## When NOT to use
...
```

**Key differences:**
- Separate file per skill (not all in one CLAUDE.md)
- Frontmatter for activation metadata
- Slash command (`/fastapi-crud`) instead of documentation reference
- Can use `paths:` for file-based auto-activation
- `!command` and `$1`/`$2` for dynamic injection

---


📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
