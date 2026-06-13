---
name: railway
description: "Railway deployment: Dockerfile deploys, managed Postgres/Redis, environment variables, PR preview environments, custom domains, CLI workflow"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../railway.md).

# Railway Vaardigheid

## Wanneer activeren
- Een Node.js-, Python-, Go- of Dockerfile-gebaseerde app deployen naar Railway
- Beheerde PostgreSQL of Redis instellen op Railway
- Omgevingsvariabelen en secrets configureren voor Railway-services
- Preview-omgevingen aanmaken die automatisch deployen bij een PR
- Een aangepast domein instellen met automatisch SSL
- De Railway CLI gebruiken voor pariteit met lokale ontwikkeling

## Wanneer NIET gebruiken
- Grootschalige Kubernetes-gebaseerde infrastructuur — gebruik EKS/GKE
- Apps die dedicated GPU-instanties vereisen — gebruik Lambda Labs of RunPod
- Compliance-gevoelige workloads die specifieke regio's vereisen — controleer de beschikbaarheid van Railway-regio's

## Waarom Railway voor vibe coding

Railway is het snelste pad van lokale code naar een draaiende productieservice. Het detecteert uw runtime automatisch, provisioneert databases met één klik en injecteert inloggegevens als omgevingsvariabelen. Daarom identificeert het onderzoek Railway als optimaal voor AI-gegenereerde codebases — de agent kan een commit pushen en heeft in minder dan 2 minuten een live URL.

## Instructies

### Eerste deployment

```bash
# Railway CLI installeren
npm install -g @railway/cli

# Aanmelden
railway login

# Een nieuw project aanmaken vanuit de huidige map
railway init

# Deployen
railway up

# De gedeployde service openen
railway open
```

### Dockerfile-deployment (aanbevolen voor productie)

Railway detecteert Dockerfiles automatisch. Houd de uwe minimaal:

```dockerfile
# Dockerfile — Next.js
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
```

```dockerfile
# Dockerfile — FastAPI
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```json
// railway.json — Railway-configuratiebestand
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "./Dockerfile"
  },
  "deploy": {
    "startCommand": "node server.js",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 30,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
```

### Beheerde databases toevoegen

```bash
# Via CLI
railway add postgres   # voegt PostgreSQL-service toe
railway add redis      # voegt Redis-service toe

# Railway injecteert automatisch deze variabelen:
# DATABASE_URL       — PostgreSQL-verbindingsstring
# REDIS_URL          — Redis-verbindingsstring
```

Gebruik in uw app de door Railway geïnjecteerde variabelen direct:

```python
# Python
import os
DATABASE_URL = os.environ["DATABASE_URL"]
REDIS_URL = os.environ.get("REDIS_URL", "redis://localhost:6379")
```

```typescript
// TypeScript
const db = drizzle(neon(process.env.DATABASE_URL!))
const redis = new Redis(process.env.REDIS_URL!)
```

### Omgevingsvariabelen

```bash
# Instellen via CLI
railway variables set API_KEY=secret123
railway variables set NODE_ENV=production

# Instellen vanuit .env-bestand
railway variables set --kv-file .env.production

# Huidige variabelen bekijken
railway variables

# Verwijzen naar de variabele van een andere service (gedeelde configuratie)
# In Railway-dashboard: variabeleverwijzingssyntax
# DATABASE_URL = ${{postgres.DATABASE_URL}}
```

### Service-koppeling (variabelen delen tussen services)

```bash
# Verwijzen naar variabelen van een andere service in hetzelfde project
# In Railway-dashboard → Service → Variables → Verwijzing toevoegen
# Of in railway.toml:
```

```toml
# railway.toml
[variables]
DATABASE_URL = "${{Postgres.DATABASE_URL}}"
REDIS_URL = "${{Redis.REDIS_URL}}"
```

### GitHub Actions-integratie

```yaml
# .github/workflows/deploy.yml
name: Deploy to Railway

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Railway CLI
        run: npm install -g @railway/cli

      - name: Deploy
        run: railway up --service my-app --detach
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

### PR-preview-omgevingen

Railway ondersteunt automatische preview-omgevingen per PR via GitHub-integratie:

1. Railway-dashboard → Project → Instellingen → GitHub → PR-deployments inschakelen
2. Elke PR krijgt een unieke URL: `https://my-app-pr-{number}.railway.app`
3. Automatisch verwijderd wanneer de PR wordt gesloten

```yaml
# .github/workflows/comment-preview-url.yml
name: Comment Preview URL

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  comment:
    runs-on: ubuntu-latest
    steps:
      - name: Wait for Railway deployment
        run: sleep 30  # Railway heeft tijd nodig om te deployen

      - name: Comment PR URL
        uses: actions/github-script@v7
        with:
          script: |
            const prNumber = context.payload.pull_request.number
            const url = `https://my-app-pr-${prNumber}.railway.app`
            await github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: prNumber,
              body: `🚀 Preview deployed: ${url}`,
            })
```

### Aangepaste domeinen en SSL

```bash
# Aangepast domein toevoegen via CLI
railway domain add app.mycompany.com

# Railway biedt:
# - Automatisch Let's Encrypt SSL
# - CNAME-record om aan uw DNS toe te voegen
# - Automatische verlenging
```

### Handige CLI-opdrachten

```bash
railway status          # huidige deploymentstatus
railway logs            # logs streamen van actieve deployment
railway logs --tail 100 # laatste 100 logregels
railway shell           # SSH in draaiende container
railway run npm migrate # opdracht uitvoeren in Railway-omgeving
railway up --detach     # deployen zonder te wachten op voltooiing
railway down            # huidige deployment stoppen
railway env             # geïnjecteerde omgevingsvariabelen tonen
```

### Monorepo-deployment

```toml
# railway.toml — een specifieke service deployen vanuit een monorepo
[build]
builder = "DOCKERFILE"
dockerfilePath = "apps/api/Dockerfile"
buildContext = "."

[deploy]
startCommand = "node apps/api/dist/main.js"
```

```bash
# Alleen de api-service deployen
railway up --service api
```

## Voorbeeld

**Gebruiker:** Een FastAPI-app met Postgres en Redis deployen naar Railway — GitHub Actions instellen voor automatisch deployen op main, preview-omgevingen voor PR's, en een health check-endpoint.

**Verwachte uitvoer:**
- `Dockerfile` — python:3.12-slim, uvicorn op `0.0.0.0:8000`
- `railway.json` — healthcheckPath `/health`, herstart bij fout
- `app/routers/health.py` — `GET /health` geeft `{"status": "ok", "db": "connected"}` terug
- `.github/workflows/deploy.yml` — `railway up --detach` bij push naar main
- Stappen in Railway-dashboard: Postgres toevoegen, Redis toevoegen, PR-deployments inschakelen

---
