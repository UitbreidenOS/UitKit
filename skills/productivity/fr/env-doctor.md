---
name: env-doctor
description: "Diagnose environment health: missing env vars, wrong runtime versions, broken deps, port conflicts, missing tools"
---

> 🇫🇷 Version française. [English version](../env-doctor.md).

# Compétence : Env Doctor

## Quand activer
- Démarrage sur une nouvelle machine ou un clone récent et quelque chose ne fonctionne pas
- Après avoir tiré des modifications et obtenu des erreurs inattendues
- Intégration d'un nouveau membre de l'équipe et vérification de sa configuration
- Avant un déploiement ou une exécution CI pour détecter les inadéquations d'environnement
- Débogage de type "ça marche sur ma machine"

## Quand NE PAS utiliser
- Erreurs d'application à l'exécution non liées à la configuration de l'environnement
- Problèmes de performance qui ne sont pas causés par l'environnement
- Débogage en production (utilisez votre stack d'observabilité)

## Instructions

### Ce que env-doctor vérifie

**1. Versions des runtimes**
```bash
node --version    # vs .nvmrc or engines.node in package.json
python --version  # vs .python-version or pyproject.toml
ruby --version    # vs .ruby-version
go version        # vs go.mod
java -version     # vs .java-version or pom.xml
```

**2. Variables d'environnement requises**
Lit à partir de :
- `.env.example` — variables sans valeur par défaut = requises
- Section environnement de `CLAUDE.md`
- Section "Getting Started" du README
- Références directes `process.env.X` / `os.environ["X"]` dans le code

**3. Dépendances installées**
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

**4. Services accessibles**
```bash
# Database
pg_isready -h localhost -p 5432

# Redis
redis-cli ping

# Other services from .env DATABASE_URL, REDIS_URL, etc.
```

**5. Conflits de ports**
```bash
# Check if the dev server port is already in use
lsof -i :3000
lsof -i :8000
lsof -i :5432
```

**6. Outils CLI requis**
```bash
which git gh docker docker-compose terraform kubectl aws gcloud
```

### Utilisation

Invoquez simplement la compétence et Claude exécutera les vérifications pour votre type de projet :

```
/env-doctor
```

Ou ciblez une zone spécifique :
```
/env-doctor --check envvars
/env-doctor --check deps
/env-doctor --check services
```

### Format de sortie

Claude produit un rapport :

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

### Corrections rapides suggérées par Claude

| Problème | Correction suggérée |
|---------|---------------------|
| Variable d'environnement manquante | Copier depuis `.env.example`, pointer vers le gestionnaire de secrets |
| Mauvaise version de Node | `nvm use` ou `volta install node@X` |
| node_modules manquants | `npm install` |
| Python venv manquant | `python -m venv .venv && pip install -e .` |
| Port en cours d'utilisation | `kill -9 $(lsof -t -i:3000)` ou changer de port |
| Service Docker arrêté | `docker compose up -d [service]` |
| DB non migrée | `npm run db:migrate` / `alembic upgrade head` |

### Ajouter env-doctor à votre projet

Ajoutez à votre `CLAUDE.md` de projet :
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

## Exemple

**L'utilisateur clone un dépôt et exécute `/env-doctor`**

**Résultat attendu :**
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
