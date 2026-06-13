---
name: env-doctor
description: "Diagnose environment health: missing env vars, wrong runtime versions, broken deps, port conflicts, missing tools"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../env-doctor.md).

# Vaardigheid: Env Doctor

## Wanneer activeren
- Starten op een nieuwe machine of een verse clone en iets werkt niet
- Na het pullen van wijzigingen en het krijgen van onverwachte fouten
- Onboarding van een nieuw teamlid en het verifiëren van hun setup
- Voor een deploy of CI-run om omgevingsverschillen te detecteren
- "Het werkt op mijn machine"-debuggen

## Wanneer NIET gebruiken
- Runtime-applicatiefouten die niet gerelateerd zijn aan de omgevingssetup
- Prestatieproblemen die niet door de omgeving worden veroorzaakt
- Productie-debuggen (gebruik uw observability-stack)

## Instructies

### Wat env-doctor controleert

**1. Runtime-versies**
```bash
node --version    # vs .nvmrc or engines.node in package.json
python --version  # vs .python-version or pyproject.toml
ruby --version    # vs .ruby-version
go version        # vs go.mod
java -version     # vs .java-version or pom.xml
```

**2. Vereiste env vars**
Leest uit:
- `.env.example` — variabelen zonder standaard = vereist
- `CLAUDE.md` omgevingssectie
- README "Getting Started"-sectie
- Directe `process.env.X` / `os.environ["X"]` verwijzingen in code

**3. Geïnstalleerde dependencies**
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

**4. Bereikbare services**
```bash
# Database
pg_isready -h localhost -p 5432

# Redis
redis-cli ping

# Other services from .env DATABASE_URL, REDIS_URL, etc.
```

**5. Poortconflicten**
```bash
# Check if the dev server port is already in use
lsof -i :3000
lsof -i :8000
lsof -i :5432
```

**6. Vereiste CLI-tools**
```bash
which git gh docker docker-compose terraform kubectl aws gcloud
```

### Gebruik

Roep de vaardigheid aan en Claude voert de controles uit voor uw projecttype:

```
/env-doctor
```

Of gericht op een specifiek gebied:
```
/env-doctor --check envvars
/env-doctor --check deps
/env-doctor --check services
```

### Uitvoerformaat

Claude produceert een rapport:

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

### Snelle oplossingen die Claude suggereert

| Probleem | Voorgestelde oplossing |
|---------|------------------------|
| Ontbrekende env var | Kopiëren uit `.env.example`, verwijzen naar secret manager |
| Verkeerde Node-versie | `nvm use` of `volta install node@X` |
| node_modules ontbreekt | `npm install` |
| Python venv ontbreekt | `python -m venv .venv && pip install -e .` |
| Poort in gebruik | `kill -9 $(lsof -t -i:3000)` of poort wijzigen |
| Docker-service uitgeschakeld | `docker compose up -d [service]` |
| DB niet gemigreerd | `npm run db:migrate` / `alembic upgrade head` |

### env-doctor toevoegen aan uw project

Voeg toe aan uw `CLAUDE.md` van het project:
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

## Voorbeeld

**Gebruiker kloont een repository en voert `/env-doctor` uit**

**Verwachte uitvoer:**
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
