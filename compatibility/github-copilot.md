# Claudient × GitHub Copilot

> How to use Claudient content with GitHub Copilot custom instructions and VS Code settings.

GitHub Copilot integrates with VS Code and GitHub, offering two primary configuration points for custom instructions: repository-level `.github/copilot-instructions.md` and user-level settings in `github.copilot.chat.codeGeneration.instructions`. Claudient content adapts seamlessly to both.

---

## What works natively

GitHub Copilot supports:

- **Markdown-based instructions** — Skills and rules map directly to `.github/copilot-instructions.md`
- **Structured prompts** — Claudient's "When to activate" / "When NOT to use" / "Instructions" / "Example" pattern translates cleanly
- **Project context** — CLAUDE.md examples can be embedded in repository instructions
- **Code generation guidance** — Copilot's code generation mode respects custom instructions

---

## What needs adaptation

GitHub Copilot does NOT support:

- **Slash commands** (`/code-review`, `/simplify`) — Copilot uses natural language prompting instead
- **Subagents** — No delegation or agent spawning; all work happens in the main chat
- **Hooks** — No event-driven automation (pre-commit, post-test)
- **Plugin marketplace** — No plugin system like Claude Code
- **MCP servers** — Limited to VS Code's built-in MCP support

The adaptation pattern: Convert slash-command invocations to natural language prompts in chat.

---

## Installation

### Skills → .github/copilot-instructions.md

GitHub Copilot uses `.github/copilot-instructions.md` for repository-level custom instructions. This file is read by Copilot when you chat in VS Code or GitHub.

**Step 1: Create the file**

```bash
mkdir -p .github
touch .github/copilot-instructions.md
```

**Step 2: Adapt Claudient skills**

For each skill you want to enable in Copilot, create a section with this structure:

```markdown
## Skill Name

**When to use:** [Concrete trigger conditions]

**When NOT to use:** [Anti-patterns]

### Instructions
[Copy Instructions section verbatim from the skill]

### Example
[Copy the Example section — but omit the slash command syntax]
```

**Step 3: Example — Adapting the Docker skill**

Original Claudient skill (from `skills/devops-infra/docker.md`):

```markdown
# Docker Skill

## When to activate
- Writing or optimizing Dockerfiles for production
- Setting up multi-stage builds to reduce image size
- ...

## When NOT to use
- Kubernetes manifests
- Buildpacks
- ...

## Instructions
[Multi-stage build patterns, security rules, etc.]

## Example
User: Write a production Dockerfile for a Python FastAPI app...
```

Adapted for `.github/copilot-instructions.md`:

```markdown
## Docker Best Practices

**When to use:**
- Writing or optimizing Dockerfiles for production
- Setting up multi-stage builds to reduce image size
- Debugging container startup failures or layer cache issues
- Configuring non-root users, health checks, and image security
- Writing .dockerignore for efficient builds

**When NOT to use:**
- Kubernetes manifests (use k8s-specific guidance instead)
- Buildpacks (Heroku, Cloud Native Buildpacks — different build system)
- Virtual machine provisioning
- Nix-based reproducible builds

### Instructions

#### Production Dockerfile structure
Always use multi-stage builds for compiled languages and Node.js:

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Runtime — minimal image
FROM node:20-alpine AS runtime
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
USER appuser
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:8080/healthz || exit 1
CMD ["node", "server.js"]
```

#### Security rules
- Never run as root in production — always create and switch to a non-root user
- Never use `latest` tag — pin to a specific version or digest
- Prefer Alpine or distroless base images over full Debian/Ubuntu
- Never copy `.env` files into the image — pass secrets as runtime env vars
- Scan images with `docker scout` or Trivy before pushing to production

#### Layer caching optimization
Order Dockerfile instructions from least-to-most frequently changing:
1. Base image (changes rarely)
2. System dependencies (`apt-get`, `apk add`)
3. Package manager files (`package.json`, `requirements.txt`)
4. Package install (`npm ci`, `pip install`)
5. Application code (`COPY . .`) — changes most often, must be last

#### .dockerignore — always include
```
node_modules/
.git/
.env
.env.*
*.md
Dockerfile*
docker-compose*
.dockerignore
coverage/
.nyc_output/
__pycache__/
*.pyc
.pytest_cache/
```

### Example

**Request:** "Generate a production Dockerfile for a Python FastAPI app with multi-stage build, non-root user, and health check."

**Expected output:**
- Stage 1 (builder): `python:3.12-slim`, install dependencies with `pip install --no-cache-dir`
- Stage 2 (runtime): `python:3.12-slim`, non-root user, copy only wheels/deps from builder + app code
- `HEALTHCHECK` hitting `/healthz` endpoint
- `CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]`
- `.dockerignore` covering `__pycache__`, `.env`, `.git`, `*.pyc`
```

---

### Rules → copilot-instructions.md sections

Claudient's rules are design principles and always-follow guidelines. These adapt directly to Copilot instructions with minimal change.

**Example — Adapting Git Rules**

Original rule file (`rules/common/git.md`):

```markdown
# Git Rules

## Commit messages
- Format: `type: short description` (imperative mood, ≤ 72 chars)
- Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `perf`
- Examples: `feat: add webhook signature verification`, `fix: handle null user in auth middleware`
...

## Branches
- Feature branches: `feat/short-description`
...

## What never to commit
- `.env` files or any file containing secrets
...
```

Adapted for `.github/copilot-instructions.md`:

```markdown
## Git & Commit Guidelines

Always follow these rules when proposing commits and branch strategies:

### Commit messages
- Format: `type: short description` (imperative mood, ≤ 72 chars)
- Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `perf`
- Examples: `feat: add webhook signature verification`, `fix: handle null user in auth middleware`
- No generic messages: "update", "changes", "fix bug", "wip" are not acceptable
- Body (optional): explain WHY, not what. The diff shows what.

### Branches
- Feature branches: `feat/short-description`
- Bug fixes: `fix/short-description`
- Never commit directly to `main` or `master`
- Delete branches after merge

### What never to commit
- `.env` files or any file containing secrets
- `node_modules/`, `__pycache__/`, build artifacts
- Personal editor settings (`.idea/`, `.vscode/settings.json`)
- Files > 10MB (use git-lfs or external storage)
- Generated files that can be reproduced from source
```

---

### CLAUDE.md examples → copilot-instructions.md

If your project has a `CLAUDE.md`, extract the project-context sections and add them to `.github/copilot-instructions.md`.

**Example:**

Original `CLAUDE.md`:

```markdown
## Project Structure

This is a Next.js monorepo with three main packages:
- `packages/web` — React frontend
- `packages/api` — Express backend
- `packages/sdk` — Reusable TypeScript SDK

## Code style
- Use TypeScript everywhere — no JavaScript files
- Format with Prettier (auto-runs on commit)
- Linting: ESLint with @vercel/style-guide
```

Adapted for `.github/copilot-instructions.md`:

```markdown
## Project Context

This is a Next.js monorepo with three main packages:
- `packages/web` — React frontend
- `packages/api` — Express backend
- `packages/sdk` — Reusable TypeScript SDK

### Code style
- Use TypeScript everywhere — no JavaScript files
- Format with Prettier (auto-runs on commit)
- Linting: ESLint with @vercel/style-guide
```

---

### VS Code Copilot settings

For user-level instructions that apply across all repositories, configure VS Code's settings.json with `github.copilot.chat.codeGeneration.instructions`.

**Location:** Open VS Code settings (Cmd/Ctrl + ,), search for `github.copilot.chat.codeGeneration.instructions`, and paste your custom instructions.

**Example — Adding a code generation rule:**

```json
{
  "github.copilot.chat.codeGeneration.instructions": [
    {
      "text": "Always use TypeScript with strict mode enabled. Avoid `any` types; use generics instead."
    },
    {
      "text": "For React components, use functional components with hooks. Class components are discouraged."
    },
    {
      "text": "Write tests alongside code. Every new function should have at least one test case."
    }
  ]
}
```

These settings apply to Copilot's inline completions and chat code generation.

---

### Workflow: Enabling a Claudient skill in your project

1. **Pick a skill** — Browse `skills/` and select one relevant to your project (e.g., `skills/backend/fastapi.md` for API work)
2. **Copy the Instructions section** — Extract the core guidance (recipes, patterns, best practices)
3. **Add to `.github/copilot-instructions.md`** — Create a new section under "## Skill Name" with the adapted instructions
4. **Test in Copilot chat** — Open VS Code, press Ctrl+I (or Cmd+I on Mac), and ask Copilot to apply that guidance: *"Write a FastAPI endpoint that follows our best practices"*
5. **Refine as needed** — If Copilot doesn't follow the instructions perfectly, add more specific examples or constraints

---

## Compatibility matrix

| Claudient content | GitHub Copilot equivalent | Effort |
|---|---|---|
| Skills (Markdown prompts) | `.github/copilot-instructions.md` sections | Low — direct copy + minimal formatting |
| Commands (slash syntax) | Natural language in chat | Low — convert `/command` to "When you see X, apply Y" |
| Rules (always-follow guidelines) | `.github/copilot-instructions.md` sections | Low — direct copy |
| Agents (subagent definitions) | System prompts or agent roles | Medium — reframe as chat instructions |
| CLAUDE.md project context | `.github/copilot-instructions.md` project section | Low — extract and embed |
| Personas (system prompts) | `github.copilot.chat.codeGeneration.instructions` | Low — adapt as user-level instructions |
| Hooks (event-driven) | GitHub Actions + Copilot prompts | High — manual GitHub Actions workflows |
| Plugin marketplace | N/A | N/A — Copilot has no plugins |
| MCP servers | VS Code's MCP support | Medium — configure in settings.json |

---

## Limitations & workarounds

### No slash-command invocation
Copilot doesn't support slash commands like `/code-review`. Workaround: Use natural language in chat.

❌ **Doesn't work:** Type `/code-review --effort high` in Copilot

✅ **Workaround:** Type "Review this diff for bugs and opportunities to simplify. Focus on correctness issues, code reuse, and performance."

### No subagent delegation
Copilot can't spawn specialized agents. Workaround: Write explicit role prompts in your instructions.

❌ **Doesn't work:** Request a specific subagent like `@db-specialist`

✅ **Workaround:** Add role guidance to `.github/copilot-instructions.md`: *"When discussing database schema design, apply expert-level patterns for indexing, normalization, and query optimization."*

### No hook automation
Copilot doesn't automate tasks on git events. Workaround: Use GitHub Actions.

❌ **Doesn't work:** Configure a post-commit hook in Copilot settings

✅ **Workaround:** Create a `.github/workflows/` file with GitHub Actions that run on `push` or `pull_request` events.

---

## Quick-start template: .github/copilot-instructions.md

Start with this template and add skills from Claudient:

```markdown
# GitHub Copilot Instructions

This file guides Copilot's code generation and chat behavior in this repository.

## Project context

[Describe your project, tech stack, and key modules]

## Code style & standards

- Language: [TypeScript/Python/Go/etc.]
- Formatting: [Prettier/Black/gofmt/etc.]
- Linting: [ESLint/Pylint/golangci-lint/etc.]
- Testing: [Jest/pytest/Go test/etc.]

## Always follow

- Write type-safe code — avoid `any` types
- Add tests for new functions
- Use meaningful variable names
- Keep functions under 30 lines
- Document public APIs

## Docker Best Practices

[Copy from Claudient skills/devops-infra/docker.md]

## [Additional skills as needed]

[Copy from Claudient skills/]
```

---

## Advanced: Creating a shared copilot-instructions repository

For teams using Claudient, create a central repository of adapted instructions:

```
copilot-instructions-shared/
├── backend.md        # API, database, caching patterns
├── frontend.md       # React, Next.js, styling patterns
├── devops.md         # Docker, Kubernetes, CI/CD
├── testing.md        # Jest, pytest, test structure
└── security.md       # Auth, secrets, OWASP patterns
```

Share this repository as a git submodule or template, then each project's `.github/copilot-instructions.md` includes:

```markdown
# GitHub Copilot Instructions

[Core project context]

## Included guidelines

See `docs/copilot-instructions/` for additional patterns:
- Backend best practices (API design, database patterns)
- Frontend patterns (React, Next.js, styling)
- DevOps guidelines (Docker, Kubernetes, CI/CD)
- Testing strategies (Jest, pytest, test structure)
- Security guidelines (auth, secrets, OWASP)
```

---

## See also

- [Claudient compatibility matrix](README.md) — Full support across all tools
- [Cursor adapter](cursor.md) — Similar approach for Cursor's `.cursorrules`
- [Windsurf adapter](windsurf.md) — Cascade workflows for agent-like behavior
- [Claudient skills library](../skills/) — 380+ skills to adapt

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**

📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
