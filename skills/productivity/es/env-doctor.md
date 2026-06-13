---
name: env-doctor
description: "Diagnose environment health: missing env vars, wrong runtime versions, broken deps, port conflicts, missing tools"
---

> 🇪🇸 Versión en español. [Versión en inglés](../env-doctor.md).

# Habilidad: Env Doctor

## Cuándo activar
- Empezando en una nueva máquina o un clone reciente y algo no funciona
- Después de hacer pull de cambios y obtener errores inesperados
- Incorporando a un nuevo miembro del equipo y verificando su configuración
- Antes de un deploy o ejecución de CI para detectar discrepancias de entorno
- Depuración de tipo "funciona en mi máquina"

## Cuándo NO usar
- Errores de aplicación en tiempo de ejecución no relacionados con la configuración del entorno
- Problemas de rendimiento que no son causados por el entorno
- Depuración en producción (use su stack de observabilidad)

## Instrucciones

### Qué verifica env-doctor

**1. Versiones de runtime**
```bash
node --version    # vs .nvmrc or engines.node in package.json
python --version  # vs .python-version or pyproject.toml
ruby --version    # vs .ruby-version
go version        # vs go.mod
java -version     # vs .java-version or pom.xml
```

**2. Variables de entorno requeridas**
Lee desde:
- `.env.example` — variables sin valor por defecto = requeridas
- Sección de entorno de `CLAUDE.md`
- Sección "Getting Started" del README
- Referencias directas `process.env.X` / `os.environ["X"]` en el código

**3. Dependencias instaladas**
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

**4. Servicios accesibles**
```bash
# Database
pg_isready -h localhost -p 5432

# Redis
redis-cli ping

# Other services from .env DATABASE_URL, REDIS_URL, etc.
```

**5. Conflictos de puertos**
```bash
# Check if the dev server port is already in use
lsof -i :3000
lsof -i :8000
lsof -i :5432
```

**6. Herramientas CLI requeridas**
```bash
which git gh docker docker-compose terraform kubectl aws gcloud
```

### Uso

Simplemente invoque la habilidad y Claude ejecutará las verificaciones para su tipo de proyecto:

```
/env-doctor
```

O apunte a un área específica:
```
/env-doctor --check envvars
/env-doctor --check deps
/env-doctor --check services
```

### Formato de salida

Claude produce un informe:

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

### Correcciones rápidas que sugiere Claude

| Problema | Corrección sugerida |
|---------|---------------------|
| Variable de entorno faltante | Copiar desde `.env.example`, apuntar al gestor de secretos |
| Versión incorrecta de Node | `nvm use` o `volta install node@X` |
| node_modules faltante | `npm install` |
| Python venv faltante | `python -m venv .venv && pip install -e .` |
| Puerto en uso | `kill -9 $(lsof -t -i:3000)` o cambiar puerto |
| Servicio Docker detenido | `docker compose up -d [service]` |
| DB no migrada | `npm run db:migrate` / `alembic upgrade head` |

### Añadir env-doctor a su proyecto

Agregue a su `CLAUDE.md` del proyecto:
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

## Ejemplo

**El usuario clona un repositorio y ejecuta `/env-doctor`**

**Salida esperada:**
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
