---
name: railway
description: "Railway deployment: Dockerfile deploys, managed Postgres/Redis, environment variables, PR preview environments, custom domains, CLI workflow"
---

> 🇩🇪 Deutsche Version. [Englische Version](../railway.md).

# Railway Skill

## Wann aktivieren
- Deployment einer Node.js-, Python-, Go- oder Dockerfile-basierten App auf Railway
- Einrichten von verwaltetem PostgreSQL oder Redis auf Railway
- Konfiguration von Umgebungsvariablen und Secrets für Railway-Services
- Erstellen von Preview-Umgebungen, die automatisch bei PRs deployen
- Einrichten einer benutzerdefinierten Domain mit automatischem SSL
- Verwendung der Railway CLI für lokale Entwicklungsparität

## Wann NICHT verwenden
- Groß angelegte Kubernetes-basierte Infrastruktur — EKS/GKE verwenden
- Apps, die dedizierte GPU-Instanzen benötigen — Lambda Labs oder RunPod verwenden
- Compliance-sensible Workloads, die bestimmte Regionen erfordern — Verfügbarkeit von Railway-Regionen prüfen

## Warum Railway für Vibe Coding

Railway ist der schnellste Weg vom lokalen Code zum laufenden Produktionsservice. Es erkennt Ihre Runtime automatisch, provisioniert Datenbanken per Klick und injiziert Zugangsdaten als Umgebungsvariablen. Deshalb identifiziert die Forschung Railway als optimal für KI-generierte Codebasen — der Agent kann einen Commit pushen und hat in unter 2 Minuten eine Live-URL.

## Anweisungen

### Erstmaliges Deployment

```bash
# Railway CLI installieren
npm install -g @railway/cli

# Anmelden
railway login

# Neues Projekt aus aktuellem Verzeichnis erstellen
railway init

# Deployen
railway up

# Den deployen Service öffnen
railway open
```

### Dockerfile-Deployment (für Produktion empfohlen)

Railway erkennt Dockerfiles automatisch. Halten Sie Ihres minimal:

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
// railway.json — Railway-Konfigurationsdatei
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

### Verwaltete Datenbanken hinzufügen

```bash
# Via CLI
railway add postgres   # fügt PostgreSQL-Service hinzu
railway add redis      # fügt Redis-Service hinzu

# Railway injiziert automatisch diese Variablen:
# DATABASE_URL       — PostgreSQL-Verbindungsstring
# REDIS_URL          — Redis-Verbindungsstring
```

Verwenden Sie in Ihrer App direkt die von Railway injizierten Variablen:

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

### Umgebungsvariablen

```bash
# Über CLI setzen
railway variables set API_KEY=secret123
railway variables set NODE_ENV=production

# Aus .env-Datei setzen
railway variables set --kv-file .env.production

# Aktuelle Variablen anzeigen
railway variables

# Variable eines anderen Services referenzieren (geteilte Konfiguration)
# Im Railway-Dashboard: Variable-Referenz-Syntax
# DATABASE_URL = ${{postgres.DATABASE_URL}}
```

### Service-Verknüpfung (Variablen zwischen Services teilen)

```bash
# Variablen von einem anderen Service im selben Projekt referenzieren
# Im Railway-Dashboard → Service → Variables → Referenz hinzufügen
# Oder in railway.toml:
```

```toml
# railway.toml
[variables]
DATABASE_URL = "${{Postgres.DATABASE_URL}}"
REDIS_URL = "${{Redis.REDIS_URL}}"
```

### GitHub Actions-Integration

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

### PR-Preview-Umgebungen

Railway unterstützt automatische Preview-Umgebungen pro PR über die GitHub-Integration:

1. Railway-Dashboard → Projekt → Einstellungen → GitHub → PR-Deployments aktivieren
2. Jede PR erhält eine eindeutige URL: `https://my-app-pr-{number}.railway.app`
3. Wird automatisch gelöscht, wenn die PR geschlossen wird

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
        run: sleep 30  # Railway braucht Zeit zum Deployen

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

### Benutzerdefinierte Domains und SSL

```bash
# Benutzerdefinierte Domain via CLI hinzufügen
railway domain add app.mycompany.com

# Railway bietet:
# - Automatisches Let's Encrypt SSL
# - CNAME-Eintrag zum Hinzufügen zu Ihrem DNS
# - Automatische Verlängerung
```

### Nützliche CLI-Befehle

```bash
railway status          # aktueller Deployment-Status
railway logs            # Logs vom aktiven Deployment streamen
railway logs --tail 100 # letzte 100 Log-Zeilen
railway shell           # SSH in laufenden Container
railway run npm migrate # Befehl in Railway-Umgebung ausführen
railway up --detach     # deployen ohne auf Abschluss zu warten
railway down            # aktuelles Deployment stoppen
railway env             # injizierte Umgebungsvariablen anzeigen
```

### Monorepo-Deployment

```toml
# railway.toml — einen spezifischen Service aus einem Monorepo deployen
[build]
builder = "DOCKERFILE"
dockerfilePath = "apps/api/Dockerfile"
buildContext = "."

[deploy]
startCommand = "node apps/api/dist/main.js"
```

```bash
# Nur den api-Service deployen
railway up --service api
```

## Beispiel

**Benutzer:** Eine FastAPI-App mit Postgres und Redis auf Railway deployen — GitHub Actions für automatisches Deployment auf main, Preview-Umgebungen für PRs und einen Health-Check-Endpunkt einrichten.

**Erwartete Ausgabe:**
- `Dockerfile` — python:3.12-slim, uvicorn auf `0.0.0.0:8000`
- `railway.json` — healthcheckPath `/health`, Neustart bei Fehler
- `app/routers/health.py` — `GET /health` gibt `{"status": "ok", "db": "connected"}` zurück
- `.github/workflows/deploy.yml` — `railway up --detach` bei Push auf main
- Railway-Dashboard-Schritte: Postgres hinzufügen, Redis hinzufügen, PR-Deployments aktivieren

---
