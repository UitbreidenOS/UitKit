---
name: env-doctor
description: "Diagnose environment health: missing env vars, wrong runtime versions, broken deps, port conflicts, missing tools"
---

> 🇩🇪 Deutsche Version. [Englische Version](../env-doctor.md).

# Skill: Env Doctor

## Wann aktivieren
- Starten auf einem neuen Rechner oder einem frischen Clone und etwas funktioniert nicht
- Nach dem Pullen von Änderungen und unerwarteten Fehlern
- Onboarding eines neuen Teammitglieds und Überprüfung ihrer Einrichtung
- Vor einem Deploy oder CI-Lauf, um Umgebungsunstimmigkeiten zu erkennen
- "Funktioniert auf meiner Maschine"-Debugging

## Wann NICHT verwenden
- Laufzeit-Anwendungsfehler, die nicht mit der Umgebungseinrichtung zusammenhängen
- Leistungsprobleme, die nicht durch die Umgebung verursacht werden
- Produktions-Debugging (verwenden Sie Ihren Observability-Stack)

## Anweisungen

### Was env-doctor prüft

**1. Runtime-Versionen**
```bash
node --version    # vs .nvmrc or engines.node in package.json
python --version  # vs .python-version or pyproject.toml
ruby --version    # vs .ruby-version
go version        # vs go.mod
java -version     # vs .java-version or pom.xml
```

**2. Erforderliche env vars**
Liest aus:
- `.env.example` — Variablen ohne Standard = erforderlich
- `CLAUDE.md` Umgebungsabschnitt
- README "Getting Started"-Abschnitt
- Direkte `process.env.X` / `os.environ["X"]` Referenzen im Code

**3. Installierte Abhängigkeiten**
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

**4. Erreichbare Dienste**
```bash
# Database
pg_isready -h localhost -p 5432

# Redis
redis-cli ping

# Other services from .env DATABASE_URL, REDIS_URL, etc.
```

**5. Port-Konflikte**
```bash
# Check if the dev server port is already in use
lsof -i :3000
lsof -i :8000
lsof -i :5432
```

**6. Erforderliche CLI-Tools**
```bash
which git gh docker docker-compose terraform kubectl aws gcloud
```

### Verwendung

Rufen Sie einfach den Skill auf und Claude führt die Prüfungen für Ihren Projekttyp durch:

```
/env-doctor
```

Oder auf einen bestimmten Bereich abzielen:
```
/env-doctor --check envvars
/env-doctor --check deps
/env-doctor --check services
```

### Ausgabeformat

Claude erstellt einen Bericht:

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

### Schnelle Korrekturen, die Claude vorschlägt

| Problem | Vorgeschlagene Korrektur |
|---------|--------------------------|
| Fehlende env var | Aus `.env.example` kopieren, auf Secret-Manager verweisen |
| Falsche Node-Version | `nvm use` oder `volta install node@X` |
| node_modules fehlen | `npm install` |
| Python venv fehlt | `python -m venv .venv && pip install -e .` |
| Port in Verwendung | `kill -9 $(lsof -t -i:3000)` oder Port ändern |
| Docker-Dienst ausgefallen | `docker compose up -d [service]` |
| DB nicht migriert | `npm run db:migrate` / `alembic upgrade head` |

### env-doctor zu Ihrem Projekt hinzufügen

Zu Ihrer `CLAUDE.md` des Projekts hinzufügen:
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

## Beispiel

**Benutzer klont ein Repository und führt `/env-doctor` aus**

**Erwartete Ausgabe:**
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
