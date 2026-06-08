# Claudient × Gemini Code Assist

> How to use Claudient content with Gemini Code Assist and the Gemini CLI.

## What works natively

Gemini Code Assist integrates with Gemini's API and supports context files and chat-based interactions. While Gemini does not have direct equivalents to Claude Code's `/slash-commands` or hooks system, Claudient's content is highly portable:

- **Markdown skill prompts** — Use as chat input or embed in project context
- **Rules and guidelines** — Convert to system instructions or GEMINI.md sections
- **Agent definitions** — Adapt as system prompts or delegation patterns
- **Examples and workflows** — Copy verbatim; no tool-specific syntax to strip
- **CLAUDE.md instructions** — Rewrite with Gemini-specific references instead of Claude Code

---

## What needs adaptation

| Claudient element | Gemini approach | Complexity |
|---|---|---|
| **Skills (slash-command `.md` files)** | Convert to GEMINI.md prompts or chat templates | Low |
| **Commands (CLI definitions)** | Use with `gemini` CLI via `--context` or direct chat | Low |
| **Rules (always-follow guidelines)** | Add to GEMINI.md `guidelines` section or system prompt | Low |
| **Agents (subagent spawning)** | Use Gemini's API for multi-turn delegation or system prompts | Medium |
| **Hooks (event-triggered automation)** | Not supported; use pre-commit or CI/CD instead | N/A |
| **CLAUDE.md project context** | Create GEMINI.md with equivalent structure | Low |
| **Personas (system role prompts)** | Copy to system prompt; adapt references | Low |

---

## Installation

### Skills → Gemini project instructions / GEMINI.md

Gemini uses **GEMINI.md** (or `gemini.md`) as a project context file, similar to CLAUDE.md. The structure mirrors Claude Code's project instructions but targets Gemini-specific features.

#### How to convert a Claudient skill to GEMINI.md

**Step 1: Extract the skill's core instructions**

Take a Claudient skill file like `skills/backend/fastapi-crud.md`:

```markdown
# FastAPI CRUD

## When to activate
Building REST APIs with FastAPI, implementing CRUD endpoints, database layer integration, or request/response validation.

## When NOT to use
GraphQL APIs (use graphql-schema-design.md instead). WebSocket real-time features (use fastapi-websockets.md). Simple static file serving (use nginx or CDN).

## Instructions

### Route Organization
Group related routes in routers:
```python
from fastapi import APIRouter
router = APIRouter(prefix="/api/users", tags=["users"])

@router.get("/{user_id}")
async def get_user(user_id: int):
    return await db.users.find_one({"id": user_id})
```

### Pydantic Models
Define request/response schemas explicitly:
```python
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    age: int = Field(..., ge=0, le=150)

class UserResponse(UserCreate):
    id: int
    created_at: datetime
```

## Example
Creating a `/api/posts` endpoint with validation...
```
```

**Step 2: Create a GEMINI.md entry** with the extracted instructions:

```markdown
## FastAPI CRUD Endpoints

When working on REST APIs with FastAPI, follow these patterns:

### Route Organization
Group related routes in routers (see skill for full code example).

### Pydantic Models
- Define request/response schemas explicitly using Pydantic
- Use Field() for constraints: `Field(..., ge=0, le=150)`
- Separate Create (input) from Response (output) models

### Implementation Pattern
1. Define route in APIRouter
2. Validate input with Pydantic model
3. Execute database query
4. Return response model

For full details, refer to the Claudient skill: `skills/backend/fastapi-crud.md`.
```

#### Example: Full GEMINI.md structure

Create `/project/GEMINI.md`:

```markdown
# GEMINI.md — Gemini Code Assist Configuration

This file governs how Gemini Code Assist should behave in this project.

---

## Project Context

- **Framework**: FastAPI + SQLAlchemy + PostgreSQL
- **Python version**: 3.11+
- **Code style**: Black, isort, Ruff for linting
- **Testing**: pytest with fixtures

---

## Guidelines

All code must follow these rules:

1. **Type hints everywhere** — Use `from __future__ import annotations`. No bare `Any` types.
2. **Pydantic for schemas** — Request/response models inherit from `BaseModel`.
3. **Async by default** — All I/O operations are `async def`.
4. **Error handling** — Use `HTTPException(status_code=..., detail=...)` for API errors.
5. **Database queries** — Use SQLAlchemy ORM; no raw SQL.

---

## Patterns

### FastAPI CRUD Endpoints
- Group routes in APIRouter with prefix and tags
- Separate Create/Update/Response Pydantic models
- Use dependency injection for database session
- Return 201 for POST, 200 for GET/PUT, 204 for DELETE

### Error Responses
- Always include `detail` field in HTTPException
- Use appropriate HTTP status codes (400, 404, 409, 500)
- Log errors with context (user_id, resource_id, timestamp)

---

## Import Gemini Skills

To use Claudient skills in this project:
1. Identify the skill in `Claudient/skills/backend/fastapi-crud.md`
2. Extract the Instructions section
3. Paste as a comment block above your code
4. Reference the pattern while implementing

See Claudient repository: https://github.com/user/claudient
```

---

### Commands → Gemini CLI prompts

Claudient's **commands** directory contains `.md` files that define reusable prompts for specific tasks. These are easily adapted for Gemini CLI.

#### Convert a command to Gemini CLI usage

**Original Claudient command**: `commands/refactor-unsafe-patterns.md`

```markdown
# Refactor Unsafe Patterns

## When to use
Legacy code with known anti-patterns: tight coupling, global state, manual memory management, missing error handling.

## Prompt

You are a code refactoring specialist. Analyze the provided code for:
1. Tight coupling (dependencies on concrete types instead of interfaces)
2. Global state (mutable module-level variables)
3. Missing null checks (unvalidated user input)
4. Error handling gaps (uncaught exceptions)
5. Resource leaks (unclosed files, sockets, database connections)

Suggest specific refactorings with before/after code examples. Prioritize by impact.
```

**Use with Gemini CLI:**

```bash
# Copy the command prompt
cat Claudient/commands/refactor-unsafe-patterns.md

# Pass to Gemini as context
gemini --context "Claudient/commands/refactor-unsafe-patterns.md" \
       --message "Refactor this file: src/legacy_parser.py"

# Or pipe directly
cat src/legacy_parser.py | gemini --context "Claudient/commands/refactor-unsafe-patterns.md" \
                                    --message "What anti-patterns do you see?"
```

#### Advanced: Integrate into a Gemini workflow

Create a shell script `scripts/gemini-refactor.sh`:

```bash
#!/bin/bash
# Usage: ./scripts/gemini-refactor.sh <file>

if [ -z "$1" ]; then
  echo "Usage: $0 <file>"
  exit 1
fi

REFACTOR_PROMPT=$(cat Claudient/commands/refactor-unsafe-patterns.md | sed -n '/^## Prompt/,$p' | tail -n +2)

gemini --context "$1" \
       --system-prompt "$REFACTOR_PROMPT" \
       --message "Refactor this code according to the guidelines above."
```

---

### Rules → GEMINI.md guidelines section

Claudient's **rules** are always-follow guidelines that should be converted to a GEMINI.md `Guidelines` section.

#### Convert rules for Gemini

**Original Claudient rule**: `rules/language-specific/python.md`

```markdown
# Python Rules

## Apply to
All Python files (`*.py`) in any project.

## Rules

1. **Type hints everywhere** — Use `from __future__ import annotations` for forward references. No bare `Any`.
2. **Docstrings for public APIs** — Every class, function, and module has a docstring ("""...""").
3. **Context managers for resources** — `with open(file) as f:` not manual close.
4. **Never use mutable defaults** — `def func(items: list = None):` then `items = items or []`.
5. **Exception specificity** — Catch `ValueError`, `KeyError`, or `FileNotFoundError`, not bare `Exception`.
```

**Add to GEMINI.md:**

```markdown
## Python Guidelines

Apply these rules to all Python code:

1. **Type hints required** — All functions and variables must have type annotations. Use `from __future__ import annotations` for forward references. Never use bare `Any`.

2. **Docstrings for all public APIs** — Classes, functions, and modules must have `"""docstring"""` comments. Use Google-style format:
   ```python
   def calculate_price(items: list[Item], tax_rate: float) -> float:
       """Calculate total price with tax.
       
       Args:
           items: List of items to price.
           tax_rate: Tax rate as decimal (e.g., 0.08 for 8%).
       
       Returns:
           Total price including tax.
       """
   ```

3. **Context managers for resources** — Always use `with` statements for file I/O, database connections, and locks. Never manually call `close()`.

4. **No mutable defaults** — Avoid `def func(items: list = [])`. Use `def func(items: list | None = None)` then `items = items or []`.

5. **Specific exception handling** — Catch concrete exceptions (`ValueError`, `KeyError`, `FileNotFoundError`), never bare `Exception`.

6. **Import organization** — Group imports: standard library, third-party, local. One module per line.

---

For full rules, refer to Claudient: `rules/language-specific/python.md`
```

---

### CLAUDE.md examples → GEMINI.md

If you have a CLAUDE.md in an existing project, convert it to GEMINI.md by:

1. **Keep the structure intact** — Project Context, Guidelines, Patterns, Tools
2. **Replace Claude Code references** — Change `/slash-command` to chat prompts, `@agent` to system prompts
3. **Adapt tool usage** — Replace Claude Code-specific tools with Gemini API equivalents
4. **Keep examples** — Concrete code examples are tool-agnostic

#### Example conversion

**Original CLAUDE.md:**

```markdown
# CLAUDE.md

## What This Repo Is
A GraphQL server with subscription support.

## Workflow
1. Run `/graphql-schema-design` to plan the schema
2. Delegate to `@backend-specialist` for resolver implementation
3. Use `/test-graphql` to validate queries
4. Hook `post-test` runs `npm run build && npm run deploy`
```

**Converted GEMINI.md:**

```markdown
# GEMINI.md

## Project Overview
A GraphQL server with subscription support using Apollo Server 4.

## Development Workflow

1. **Schema Design** — Use the GraphQL schema design pattern (see Patterns below)
2. **Resolver Implementation** — Implement resolvers following the patterns in this file
3. **Testing** — Validate queries and mutations using the test pattern
4. **Deployment** — Build and deploy via `npm run build && npm run deploy`

## Patterns

### GraphQL Schema Design
- Use SDL (Schema Definition Language) in `.graphql` files
- Organize types by domain (User, Post, Comment, etc.)
- Use interfaces for shared fields: `interface Node { id: ID! }`
- Extend types cautiously; prefer composition over extension

### Resolver Implementation
- Resolvers receive `(parent, args, context, info)` as arguments
- Use context for shared resources (database, cache, auth)
- Return promises; Apollo handles resolution
- Batch queries to avoid N+1 problems

### Testing
- Test resolvers independently with mock data
- Test subscription lifecycle (subscribe, update, unsubscribe)
- Validate schema compliance with graphql-core
```

---

## Compatibility matrix

| Claudient content | Gemini equivalent | Adaptation effort | Notes |
|---|---|---|---|
| **Skills** (.md files) | GEMINI.md patterns section or chat prompts | Low | Copy instructions verbatim; remove Claude Code tool references |
| **Commands** (CLI prompts) | `gemini` CLI with `--context` or direct chat | Low | Use skill's "Prompt" section; pipe input via stdin |
| **Agents** (subagent definitions) | System prompts or multi-turn delegation | Medium | Adapt as Gemini system instructions; use API for spawning |
| **Rules** (always-follow guidelines) | GEMINI.md guidelines section | Low | Reformat as 1-3 sentence rules; add code examples where helpful |
| **Hooks** (event automation) | CI/CD or pre-commit hooks | N/A | Not supported by Gemini; use external tools |
| **CLAUDE.md** (project context) | GEMINI.md (create new file) | Low | Adapt references; keep structure and examples |
| **Personas** (system roles) | System prompt field in Gemini API calls | Low | Copy verbatim; strip Claude Code-specific instructions |
| **Examples** (code samples) | Use as-is in chat or documentation | None | Completely portable; no adaptation needed |
| **Workflows** (multi-step guides) | Chat conversation scripts or documentation | Low | Convert to step-by-step instructions for chat |
| **Prompts** (reusable templates) | Chat input templates or GEMINI.md sections | Low | Use as system prompt or context insertion |

---

## Quick start: Using Claudient skills in Gemini

### 1. Create GEMINI.md in your project

```bash
cp /path/to/Claudient/compatibility/gemini.md /your/project/GEMINI.md
# Edit to add your project-specific guidelines
```

### 2. Extract a skill and use it in chat

```bash
# Extract the FastAPI CRUD skill
cat /path/to/Claudient/skills/backend/fastapi-crud.md | grep -A 100 "## Instructions" > /tmp/fastapi-pattern.txt

# Use in Gemini chat or CLI
gemini --context /tmp/fastapi-pattern.txt \
       --message "Implement a CRUD endpoint for users"
```

### 3. Use commands with Gemini CLI

```bash
# List available Claudient commands
ls /path/to/Claudient/commands/

# Run a command
gemini --context "Claudient/commands/refactor-unsafe-patterns.md" \
       --file "src/old_parser.py"
```

### 4. Reference rules in chat

When asking Gemini to write code, include rules as context:

```
I need to write Python code for [task]. Follow these rules:
- Type hints everywhere
- Docstrings for all public APIs
- Context managers for resources
- No mutable defaults

(Paste rules from GEMINI.md here)

Here's my starting code:
```

---

## Troubleshooting

### "I'm seeing Claude Code syntax in the adapted skill"

Remove or replace these patterns:

| Claude Code syntax | Gemini alternative |
|---|---|
| `@agent-name` (delegation) | Reference agent role in system prompt; handle via API calls |
| `/slash-command` (command invocation) | Use as chat message or context |
| `--flag` (command flags) | Include as natural language in prompt |
| `settings.json` (configuration) | Use Gemini API parameters or environment variables |
| `hooks:` (event automation) | Use pre-commit or CI/CD hooks |
| `/verify` or `/test` | Embed verification logic in the prompt |

### "My adapted skill doesn't produce the same output"

1. Compare the original Instructions section to your chat prompt
2. Add context: "You are a [role]. Your task is to [goal]. Follow these patterns: [skill content]"
3. Provide concrete examples of the desired output
4. Test with a simple case first

### "I need agent-like behavior in Gemini"

Use Gemini's function calling or multi-turn API:

```python
from anthropic import Anthropic

client = Anthropic()

def run_agent(system_prompt: str, task: str):
    """Simulate agent delegation using Gemini's multi-turn API."""
    messages = [
        {"role": "user", "content": task}
    ]
    
    response = client.messages.create(
        model="claude-3-5-sonnet-20241022",  # Use Claude API via Anthropic SDK
        max_tokens=2048,
        system=system_prompt,
        messages=messages
    )
    
    return response.content[0].text

# Example
prompt = """You are a backend specialist. Your role is to:
1. Review API design
2. Suggest database schema improvements
3. Validate error handling
When responding, be specific and actionable."""

result = run_agent(prompt, "Review my user endpoint implementation")
```

---

## Key differences: Gemini vs. Claude Code

| Feature | Claude Code | Gemini |
|---|---|---|
| **Skill invocation** | `/skill-name` slash command | Chat prompt or CLI context |
| **Agent spawning** | `@agent-name` delegation syntax | API function calling or system prompt |
| **Project context** | CLAUDE.md (auto-loaded) | GEMINI.md (manual reference) |
| **Rules** | Hooks + settings.json | GEMINI.md guidelines + system prompt |
| **Chat history** | Persistent per conversation | Per-message in API; session in UI |
| **Tool ecosystem** | 100+ MCP tools, hooks, output styles | Gemini API + function calling |

---

## Resources

- **Gemini Code Assist**: https://ai.google.dev/gemini-code-assist
- **Gemini CLI Documentation**: https://ai.google.dev/cli
- **Claudient Repository**: https://github.com/user/claudient
- **Adaptation Patterns**: See `compatibility/README.md` for cross-harness guidance

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**

📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
