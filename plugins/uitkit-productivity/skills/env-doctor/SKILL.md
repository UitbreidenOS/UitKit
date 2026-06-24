---
name: "env-doctor"
description: "Diagnose environment health: missing env vars, wrong runtime versions, broken deps, port conflicts, missing tools"
---

# Env Doctor Skill

## When to activate
- Starting on a new machine or fresh clone and something isn't working
- After pulling changes and getting unexpected errors
- Onboarding a new team member and verifying their setup
- Before a deploy or CI run to catch environment mismatches
- "It works on my machine" debugging

## When NOT to use
- Runtime application errors unrelated to environment setup
- Performance issues that aren't environment-caused
- Production debugging (use your observability stack)

## Instructions

### What env-doctor checks

**1. Runtime versions**
```bash
node --version    # vs .nvmrc or engines.node in package.json
python --version  # vs .python-version or pyproject.toml
ruby --version    # vs .ruby-version
go version        # vs go.mod
java -version     # vs .java-version or pom.xml
```

**2. Required env vars**
Reads from:
- `.env.example` — vars with no default = required
- `CLAUDE.md` environment section
- README "Getting Started" section
- Direct `process.env.X` / `os.environ["X"]` references in code

**3. Dependencies installed**
```bash
# Node
node_modules/ exists? package-lock.json matches package.json?

# Python
.venv/ exists? pip freeze matches requirements.txt / pyproject.toml?

# Ruby
bundle check

# Go
go mod verify
```

**4. Services reachable**
```bash
# Database
pg_isready -h localhost -p 5432

# Redis
redis-cli ping

# Other services from .env DATABASE_URL, REDIS_URL, etc.
```

**5. Port conflicts**
```bash
# Check if the dev server port is already in use
lsof -i :3000
lsof -i :8000
lsof -i :5432
```

**6. Required CLI tools**
```bash
which git gh docker docker-compose terraform kubectl aws gcloud
```

### Usage

Just invoke the skill and Claude will run the checks for your project type:

```
/env-doctor
```

Or target a specific area:
```
/env-doctor --check envvars
/env-doctor --check deps
/env-doctor --check services
```

### Output format

Claude produces a report:

```
🏥 Environment Health Report
════════════════════════════

✅ Node.js: 22.16.0 (required: >=18, matches .nvmrc)
✅ npm: 10.8.0

⚠️  Missing env vars (2):
   - STRIPE_WEBHOOK_SECRET — required for billing to work locally
     Set it: copy from 1Password > Dev Secrets > Stripe
   - OPENAI_API_KEY — required for AI features
     Set it: https://platform.openai.com/api-keys

❌ Services not reachable (1):
   - PostgreSQL on localhost:5432 — connection refused
     Fix: docker compose up -d db

✅ Dependencies: node_modules present, lockfile matches
✅ No port conflicts on :3000

Summary: 1 blocker, 2 warnings
Run `docker compose up -d db` to fix the blocker.
```

### Quick fixes Claude suggests

| Issue | Suggested fix |
|-------|---------------|
| Missing env var | Copy from `.env.example`, point to secret manager |
| Wrong Node version | `nvm use` or `volta install node@X` |
| node_modules missing | `npm install` |
| Python venv missing | `python -m venv .venv && pip install -e .` |
| Port in use | `kill -9 $(lsof -t -i:3000)` or change port |
| Docker service down | `docker compose up -d [service]` |
| DB not migrated | `npm run db:migrate` / `alembic upgrade head` |

### Adding env-doctor to your project

Add to your project's `CLAUDE.md`:
```markdown
## Environment Setup
Required env vars (all must be set for local dev):
- DATABASE_URL — PostgreSQL connection string
- REDIS_URL — Redis connection string
- STRIPE_SECRET_KEY — Stripe API key (use test key locally)
- JWT_SECRET — 32+ char random string

Dev services (via Docker Compose):
- PostgreSQL: localhost:5432
- Redis: localhost:6379

Start services: `docker compose up -d`
Check health: `/env-doctor`
```

## Example

**User clones a repo and runs `/env-doctor`**

**Expected output:**
```
🏥 Environment Health Report
════════════════════════════

✅ Node.js 22.16.0 (matches .nvmrc: 22)
✅ npm 10.8.0
✅ node_modules installed, package-lock.json in sync

⚠️  Missing env vars (1):
   - ANTHROPIC_API_KEY
     Not in .env — copy from .env.example and fill in your key
     Get one: https://console.anthropic.com/

❌ PostgreSQL not reachable on localhost:5432
   Fix: docker compose up -d db
   (or set DATABASE_URL to point to your existing Postgres instance)

✅ Redis reachable on localhost:6379
✅ No port conflicts on :3000, :3001

─────────────────────────────
1 blocker | 1 warning
Next step: docker compose up -d db
```

---
