# Claudient × Codex CLI

> How to use Claudient content with OpenAI Codex CLI (codex command-line tool).

Codex CLI is a lightweight command-line interface to Claude and other LLMs, with support for persistent instruction sets via `AGENTS.md`. This guide shows how to migrate Claudient's 380+ skills, 182 agents, and 100+ rules into Codex CLI's workflow.

---

## What works natively

Codex CLI is a text-first, prompt-driven interface. These Claudient patterns translate directly:

- **Markdown skill content** — Instructions, code examples, and prompts work as-is
- **Plain-text rules** — Guidelines and best practices require no adaptation
- **Agent descriptions** — Purpose, tools, and use cases become AGENTS.md entries
- **Examples and case studies** — All narrative content is portable
- **Code snippets** — All TypeScript, Python, shell, and language-specific patterns work unchanged

---

## What needs adaptation

Codex CLI has different invocation patterns than Claude Code. You'll need to adapt:

- **Slash command syntax** — `/code-review` → `codex review` (custom command) or embedded in `AGENTS.md`
- **Interactive flows** — Codex CLI is stateless; hooks and session persistence require manual chaining
- **Subagent delegation** — Claude Code's `@agent-name` syntax → explicit agent selection via `codex --agent architect`
- **File watching and hooks** — Pre-commit and post-action automations must be shell scripts that invoke `codex` commands

---

## Installation

### Prerequisites

```bash
# Install Codex CLI
npm install -g codex-cli

# Verify installation
codex --version

# Set your API key
export OPENAI_API_KEY=sk-...
```

### Project setup

Create a `.codex/` directory in your project root:

```bash
mkdir -p .codex
touch .codex/AGENTS.md
touch .codex/config.json
```

---

## Skills → Codex instructions / AGENTS.md

Codex CLI uses `AGENTS.md` for persistent instructions. Each agent definition becomes a reusable instruction set you can invoke via `codex --agent <name>`.

### Anatomy of a Codex agent in AGENTS.md

```markdown
# Agent: Skill Name

## Activation
When the user needs to [specific task], use this agent.

## Context and constraints
- Do not [anti-patterns]
- Always [requirements]

## Instructions
[Extracted from Claudient skill's Instructions section]

## Examples
[Concrete examples from Claudient skill]

---
```

### Example: Converting "browser" skill to Codex agent

**Original Claudient skill** (`skills/automation/browser.md`):
```markdown
# Browser Skill

## When to activate
- Automating workflows that require a real browser
- Writing end-to-end tests
- Scraping JS-rendered content

## When NOT to use
- APIs that return JSON
- Simple static HTML scraping
- Performance-critical scrapers at scale

## Instructions
[Setup code, Playwright examples, authentication patterns]

## Example
Scrape product listings from an e-commerce site...
```

**Adapted for Codex as AGENTS.md entry**:
```markdown
# Agent: Browser Automation

## Activation
When automating a workflow that requires a real browser (login flows, SPAs, JS-rendered content), screenshots, or PDFs.

## Do not use for
- APIs that return JSON — use fetch/requests directly
- Simple static HTML scraping — cheerio or BeautifulSoup is faster
- Performance-critical scrapers at scale — Playwright is slow for thousands of pages
- When a site's API is available and documented

## Instructions

### Setup
```bash
npm install playwright
npx playwright install chromium
```

### Basic page interaction (TypeScript)
[Copy the TypeScript example verbatim from the skill]

### Authentication — persist sessions
[Copy the session persistence example]

### Web scraping (JS-rendered content)
[Copy the scraping example]

### Screenshot and PDF
[Copy the screenshot example]

### Handling anti-bot measures
[Copy the anti-bot handling]

### Python equivalent
[Copy the Python equivalent]

## Example use case

**Scenario:** Scrape product listings from an e-commerce site that requires login and uses JavaScript.

**Expected output:**
- `scripts/scrape-products.ts`
- `storageState: 'session.json'` for auth persistence
- Pagination loop with `waitForLoadState('networkidle')`
- Results written to `products.json`

---
```

### Using the agent in Codex CLI

Once the agent is defined in `.codex/AGENTS.md`, invoke it:

```bash
# Interactive prompt (Codex loads Browser Automation agent context)
codex --agent "Browser Automation" \
  "Write a script to scrape product listings from amazon.com"

# Pipe into file
codex --agent "Browser Automation" \
  "Generate a Playwright test for checkout flow" > tests/checkout.spec.ts

# With custom config
codex --agent "Browser Automation" --model gpt-4 \
  "Refactor this Playwright script for performance"
```

---

## Commands → Codex prompts

Codex CLI supports saved prompts (similar to Claude Code's slash commands). Store frequently used prompts in `.codex/prompts/`:

### Directory structure
```
.codex/
├── AGENTS.md
├── config.json
└── prompts/
    ├── code-review.md
    ├── refactor.md
    ├── test-generation.md
    └── architecture-review.md
```

### Example: code-review.md

Extract the code-review skill and save it as a reusable prompt:

```markdown
# Prompt: Code Review

## What this does
Review a code diff for correctness bugs, simplification opportunities, and efficiency improvements.

## How to use
```bash
codex < diff.patch --prompt code-review --effort high
# or
cat modified-file.ts | codex --prompt code-review
```

## Prompt template

You are an expert code reviewer. Analyze the provided diff or file for:

### Correctness bugs
- Logic errors, edge cases, type mismatches
- Unhandled exceptions, null/undefined risks
- Off-by-one errors, boundary conditions

### Reuse and simplification
- Duplicate code that should be extracted
- Overly complex logic that can be simplified
- Unnecessary abstractions or design patterns

### Efficiency
- Algorithmic inefficiencies (O(n²) where O(n) exists)
- Memory leaks or resource exhaustion
- Bottlenecks (DB queries, network calls, loops)

For each finding:
1. Cite the specific line(s)
2. Explain the problem
3. Provide a concrete fix with code

---
```

### Using custom prompts in Codex

```bash
# Load a prompt from file
codex --prompt code-review "Review this function" < function.ts

# Combine with an agent
codex --agent "Architect" --prompt code-review < changes.diff

# List available prompts
codex --list-prompts
```

---

## Rules → AGENTS.md sections

Claudient's rules are always-follow guidelines. In Codex CLI, add them to the agent's **Context and constraints** section or as a dedicated "Rules" agent.

### Example: Adding API Design rules to an agent

**From Claudient** (`rules/common/api-design.md`):
```markdown
# API Design Rules

## URL and method conventions
- Resources are nouns, never verbs
- Use plural nouns for collections
- HTTP methods are semantic (GET, POST, PATCH, DELETE)

## Status codes
- 200: Successful GET, PATCH, DELETE
- 201: Successful POST
- 400: Client sent invalid data
...
```

**Add to AGENTS.md as context for the Backend Agent:**
```markdown
# Agent: Backend API Developer

## Context
You are building REST APIs. Always follow these rules:

### URL and method conventions
- Resources are nouns, never verbs: `/users` not `/getUsers`
- Use plural nouns for collections: `/users` not `/user`
- Nested resources for ownership: `/users/:id/orders` not `/user-orders?userId=`
- HTTP methods are semantic:
  - GET — read, idempotent
  - POST — create, not idempotent
  - PUT — full replacement
  - PATCH — partial update
  - DELETE — remove

### Status codes
| Code | When |
|------|------|
| 200 | Successful GET, PATCH, DELETE |
| 201 | Successful POST |
| 204 | Successful action with no body |
| 400 | Invalid client data |
| 401 | Not authenticated |
| 403 | Authenticated but not authorized |
| 404 | Resource not found |

[Include full rules section from Claudient]

## Instructions
[API design patterns]

---
```

### Standalone Rules agent

Create a Rules agent for consultation:

```bash
codex --agent "Rules Checker" \
  "What are the API design rules for this endpoint?"
```

---

## CLAUDE.md examples → AGENTS.md

Project-specific instructions from `CLAUDE.md` become agent context in Codex. Extract the relevant sections and embed them:

### Example: Translating a CLAUDE.md skill requirement

**Original CLAUDE.md** (from a project):
```markdown
## Skill File Format

Every file in `skills/` must follow this structure:

# Skill Name
## When to activate
## When NOT to use
## Instructions
## Example
```

**Adapted for Codex agent**:
```markdown
# Agent: Skill Author (for Claudient)

## Context
You are writing a skill file for the Claudient knowledge system.

## File format (REQUIRED)
Every skill must follow this structure:

```markdown
# Skill Name

## When to activate
[Specific trigger conditions — be precise, not generic]

## When NOT to use
[Anti-patterns — when this skill is the wrong tool]

## Instructions
[The actual skill content — patterns, prompts, steps]

## Example
[At least one concrete example showing the skill in use]
```

Do not add sections beyond this structure without a clear reason.

## Writing guidelines
- Write for a senior developer audience — no hand-holding
- Every claim must be accurate as of the file's last-updated date
- No placeholder content — omit rather than write "coming soon"
- Reference real Claude Code features (skills, hooks, agents, MCP)
- Keep examples concrete and runnable

## Example use case
User: "Create a FastAPI CRUD skill for Claudient."

Expected output:
- File: `skills/backend/fastapi-crud.md`
- Sections: When to activate, When NOT to use, Instructions, Example
- All code examples runnable and tested
- Links to related skills and agents

---
```

---

## Compatibility matrix

| Claudient content | Codex CLI equivalent | Effort | Notes |
|---|---|---|---|
| **Skills** (markdown prompts) | AGENTS.md entries | Low | Extract Instructions section, add activation context |
| **Commands** (slash definitions) | `--agent` + `--prompt` flags | Low | Convert to reusable prompts in `.codex/prompts/` |
| **Rules** (guidelines) | Agent **Context and constraints** sections | Low | Embed rules verbatim in relevant agents |
| **Agents** (subagent YAML/MD) | AGENTS.md definitions | Low | Convert Purpose, Tools, When to delegate into agent entry |
| **CLAUDE.md examples** | Agent system prompts | Medium | Strip Claude Code references, generalize to LLM patterns |
| **Personas** (system prompts) | Custom agents | Medium | Create agents for each persona; reuse as `--agent` |
| **Code snippets** | Inline examples in agents | None | Copy verbatim from Claudient |
| **Hooks** (event-driven) | Shell scripts + git hooks | High | Implement as bash/sh scripts that call `codex` |
| **Plugin marketplace** | Custom prompt library | N/A | Not supported in Codex CLI |

---

## Workflow example: Adapt Claudient to Codex CLI

### Step 1: Create .codex structure
```bash
mkdir -p .codex/prompts
touch .codex/AGENTS.md .codex/config.json
```

### Step 2: Pick a Claudient skill to adapt
Choose `skills/backend/python/fastapi-crud.md`:
```bash
cat /path/to/claudient/skills/backend/python/fastapi-crud.md
```

### Step 3: Extract and adapt

**Copy to .codex/AGENTS.md**:
```markdown
# Agent: FastAPI CRUD

## Activation
When building a FastAPI application with basic CRUD operations for a resource.

## Do not use for
- GraphQL APIs
- Microservices without clear resource boundaries
- Authentication/authorization flows (use dedicated Auth agent)

## Instructions
[Paste Instructions section from skill]

## Examples
[Paste Example section from skill]
```

### Step 4: Test in Codex CLI
```bash
codex --agent "FastAPI CRUD" \
  "Create a CRUD endpoint for User resource with validation"
```

### Step 5: Refine and iterate
```bash
# Combine with rules
codex --agent "FastAPI CRUD" --agent "API Design Rules" \
  "Build a paginated GET endpoint"

# Save as custom prompt
cat > .codex/prompts/fastapi-users.md << 'EOF'
# Prompt: FastAPI Users CRUD

Generate a complete FastAPI CRUD service for a User resource including:
- Database model (SQLAlchemy)
- Pydantic schemas (request/response)
- CRUD operations (create, read, update, delete)
- Error handling and validation
EOF

# Use the custom prompt
codex --prompt fastapi-users
```

---

## Best practices for Codex CLI + Claudient

1. **Organize by domain**: Create separate AGENTS.md files per domain (backend, frontend, devops) or keep one master file with clear sections.
   ```bash
   .codex/
   ├── AGENTS.md                 # Primary agents
   ├── agents-backend.md         # Backend-specific
   ├── agents-frontend.md        # Frontend-specific
   └── prompts/                  # Reusable prompts
   ```

2. **Prefix agent names**: Use clear naming for easy discovery:
   ```markdown
   # Agent: Backend — FastAPI CRUD
   # Agent: Backend — Database Migration
   # Agent: Frontend — React Components
   # Agent: DevOps — K8s Deployment
   ```

3. **Reference Claudient**: Link to the source skill in comments:
   ```markdown
   # Agent: Browser Automation
   > Source: https://github.com/uitbreiden/claudient/tree/main/skills/automation/browser.md
   ```

4. **Version your agents**: Tag with dates or Claudient versions:
   ```markdown
   # Agent: Code Review (Claudient v1.10.0, 2026-06)
   ```

5. **Chain agents with scripts**: Use shell scripts to invoke multiple agents in sequence:
   ```bash
   #!/bin/bash
   # scripts/review-and-fix.sh
   # 1. Review code with high effort
   codex --agent "Code Review" --effort high < $1 > review.txt
   
   # 2. Fix issues with Backend agent
   codex --agent "Backend" < review.txt > fixes.patch
   ```

6. **Test agent output locally**: Always verify adapted agents produce expected results:
   ```bash
   codex --agent "FastAPI CRUD" "Create a basic endpoint" > test-output.ts
   # Review test-output.ts before adding to codebase
   ```

---

## Limitations and workarounds

| Limitation | Workaround |
|---|---|
| **No file watching** | Create git hooks that invoke `codex` commands (pre-commit, post-merge) |
| **No session persistence** | Pass context via `--context` flag or pipe files: `cat context.md \| codex --agent Architect` |
| **No interactive slash commands** | Use `--agent` + `--prompt` to simulate slash command behavior |
| **No subagent spawning within agent** | Chain agents via shell scripts (see example above) |
| **No plugin marketplace** | Maintain custom prompt library in `.codex/prompts/` + version control |

---

## Migration checklist

- [ ] Install Codex CLI: `npm install -g codex-cli`
- [ ] Create `.codex/` directory structure
- [ ] Extract 5-10 key Claudient skills → AGENTS.md
- [ ] Test each adapted agent with 2-3 example prompts
- [ ] Create shell scripts for common workflows
- [ ] Document custom agents in `.codex/README.md`
- [ ] Share AGENTS.md with team via version control
- [ ] Archive original Claudient skill references in comments
- [ ] Set up git hooks to invoke Codex on pre-commit (optional)

---

## Further reading

- **Codex CLI documentation**: https://openai.com/blog/codex (see CLI section)
- **OpenAI API reference**: https://platform.openai.com/docs/api-reference
- **Claudient repository**: https://github.com/uitbreiden/claudient
- **AGENTS.md specification**: [See Codex documentation for agent format]

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
