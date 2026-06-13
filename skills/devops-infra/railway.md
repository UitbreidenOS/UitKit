---
name: railway
description: "Railway deployment: Dockerfile deploys, managed Postgres/Redis, environment variables, PR preview environments, custom domains, CLI workflow"
updated: 2026-06-13
---

# Railway Skill

## When to activate
- Deploying a Node.js, Python, Go, or any Dockerfile-based app to Railway
- Setting up managed PostgreSQL or Redis on Railway
- Configuring environment variables and secrets for Railway services
- Creating preview environments that deploy automatically on PR
- Setting up a custom domain with automatic SSL
- Using the Railway CLI for local development parity

## When NOT to use
- Large-scale Kubernetes-based infrastructure — use EKS/GKE
- Apps requiring dedicated GPU instances — use Lambda Labs or RunPod
- Compliance-sensitive workloads requiring specific regions — check Railway's region availability

## Why Railway for vibe coding

Railway is the fastest path from local code to running production service. It detects your runtime automatically, provisions databases in one click, and injects credentials as environment variables. This is why the research identifies Railway as optimal for AI-generated codebases — the agent can push a commit and have a live URL in under 2 minutes.

## Instructions

### Initial deployment

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create a new project from current directory
railway init

# Deploy
railway up

# Open the deployed service
railway open
```

### Dockerfile deployment (recommended for production)

Railway auto-detects Dockerfiles. Keep yours minimal:

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
// railway.json — Railway config file
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

### Adding managed databases

```bash
# Via CLI
railway add postgres   # adds PostgreSQL service
railway add redis      # adds Redis service

# Railway auto-injects these variables:
# DATABASE_URL       — PostgreSQL connection string
# REDIS_URL          — Redis connection string
```

In your app, use Railway's injected variables directly:

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

### Environment variables

```bash
# Set via CLI
railway variables set API_KEY=secret123
railway variables set NODE_ENV=production

# Set from .env file
railway variables set --kv-file .env.production

# View current variables
railway variables

# Reference another service's variable (shared config)
# In Railway dashboard: variable reference syntax
# DATABASE_URL = ${{postgres.DATABASE_URL}}
```

### Service linking (share variables between services)

```bash
# Reference variables from another service in the same project
# In Railway dashboard → Service → Variables → Add Reference
# Or in railway.toml:
```

```toml
# railway.toml
[variables]
DATABASE_URL = "${{Postgres.DATABASE_URL}}"
REDIS_URL = "${{Redis.REDIS_URL}}"
```

### GitHub Actions integration

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

### PR Preview environments

Railway supports automatic preview environments per PR via GitHub integration:

1. Railway dashboard → Project → Settings → GitHub → Enable PR Deployments
2. Each PR gets a unique URL: `https://my-app-pr-{number}.railway.app`
3. Automatically deleted when PR is closed

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
        run: sleep 30  # Railway needs time to deploy

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

### Custom domains and SSL

```bash
# Add custom domain via CLI
railway domain add app.mycompany.com

# Railway provides:
# - Automatic Let's Encrypt SSL
# - CNAME record to add to your DNS
# - Auto-renewal
```

### Useful CLI commands

```bash
railway status          # current deployment status
railway logs            # stream logs from active deployment
railway logs --tail 100 # last 100 log lines
railway shell           # SSH into running container
railway run npm migrate # run a command in the Railway environment
railway up --detach     # deploy without waiting for completion
railway down            # stop the current deployment
railway env             # show injected environment variables
```

### Monorepo deployment

```toml
# railway.toml — deploy a specific service from a monorepo
[build]
builder = "DOCKERFILE"
dockerfilePath = "apps/api/Dockerfile"
buildContext = "."

[deploy]
startCommand = "node apps/api/dist/main.js"
```

```bash
# Deploy only the api service
railway up --service api
```

## Example

**User:** Deploy a FastAPI app with Postgres and Redis to Railway — set up GitHub Actions for auto-deploy on main, preview environments for PRs, and a health check endpoint.

**Expected output:**
- `Dockerfile` — python:3.12-slim, uvicorn on `0.0.0.0:8000`
- `railway.json` — healthcheckPath `/health`, restart on failure
- `app/routers/health.py` — `GET /health` returns `{"status": "ok", "db": "connected"}`
- `.github/workflows/deploy.yml` — `railway up --detach` on push to main
- Railway dashboard steps: add Postgres, add Redis, enable PR deployments

---
