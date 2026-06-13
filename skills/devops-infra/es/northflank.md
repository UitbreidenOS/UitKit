> 🇪🇸 Versión en español. [Versión en inglés](../northflank.md).

---
name: northflank
description: "Northflank: managed databases, secret injection, preview environments per PR, multi-service deployment — optimal for agent-generated codebases"
---

# Northflank Skill

## When to activate
- Deploying multi-service applications (app + worker + DB + Redis) on Northflank
- Setting up automatic preview environments triggered by pull requests
- Managing secrets and environment variables across services
- Deploying from a Docker image or directly from a Git repository
- Needing managed databases (PostgreSQL, Redis, MongoDB) without Kubernetes overhead

## When NOT to use
- Simple single-service apps — Railway or Fly.io is faster to set up
- Budget-constrained solo projects — Northflank targets teams/startups
- Workloads requiring specific cloud provider regions not covered by Northflank

## Why Northflank for vibe coding

The research identifies Northflank as "the optimal full-stack deployment platform for agent-generated codebases." Three reasons:
1. **Preview environments per PR** — the AI pushes a commit, Northflank deploys a live URL, Claude pings the endpoint to verify before merging
2. **Secret injection** — database credentials are injected automatically into services without copy-pasting
3. **Multi-service orchestration** — run app + worker + scheduler in one project with shared secrets

## Instructions

### Project structure

```
Northflank Project
├── Services
│   ├── api          (Node.js / Python web service)
│   ├── worker       (background job processor)
│   └── scheduler    (cron jobs)
├── Add-ons (managed databases)
│   ├── postgres     (PostgreSQL 16)
│   └── redis        (Redis 7)
└── Secret Groups
    └── app-secrets  (shared across all services)
```

### Deploying from Git (combined service)

```json
// northflank.json — configuration file in your repo
{
  "apiVersion": "v1",
  "spec": {
    "kind": "CombinedService",
    "spec": {
      "name": "api",
      "billing": {
        "deploymentPlan": "nf-compute-20"
      },
      "deployment": {
        "instances": 1,
        "storage": {
          "ephemeralStorage": { "storageSize": 1024 }
        },
        "docker": {
          "configType": "default"
        }
      },
      "ports": [
        {
          "name": "http",
          "internalPort": 3000,
          "public": true,
          "protocol": "HTTP"
        }
      ],
      "buildSettings": {
        "dockerfile": {
          "buildContext": "/",
          "dockerfilePath": "/Dockerfile"
        }
      },
      "healthChecks": [
        {
          "protocol": "HTTP",
          "path": "/health",
          "port": 3000,
          "initialDelaySeconds": 30,
          "periodSeconds": 10
        }
      ]
    }
  }
}
```

### Managed databases and secret injection

```bash
# Northflank CLI
npm install -g northflank

# Login
northflank login

# Create a project
northflank create project --name my-saas

# Add managed PostgreSQL (credentials auto-injected as secrets)
northflank create addon --name postgres \
  --type postgresql \
  --version 16 \
  --billing nf-compute-20

# Add managed Redis
northflank create addon --name redis \
  --type redis \
  --version 7

# Create a secret group and link the addon credentials
northflank create secret-group --name app-secrets

# Add addon connection string to secret group
northflank link addon-to-secret-group \
  --addon postgres \
  --secret-group app-secrets
```

After linking, `DATABASE_URL` is automatically available in all services that reference `app-secrets` — no copy-pasting credentials.

### GitHub Actions — deploy on push + PR preview

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # Production deploy on main
      - name: Deploy to production
        if: github.ref == 'refs/heads/main'
        uses: northflank/deploy-to-northflank@v1
        with:
          northflank-api-key: ${{ secrets.NORTHFLANK_API_KEY }}
          project-id: ${{ vars.NORTHFLANK_PROJECT_ID }}
          service-id: api
          image-path: ghcr.io/${{ github.repository }}:${{ github.sha }}

      # Preview deploy on PR
      - name: Create preview environment
        if: github.event_name == 'pull_request'
        uses: northflank/preview-environments-action@v1
        with:
          northflank-api-key: ${{ secrets.NORTHFLANK_API_KEY }}
          project-id: ${{ vars.NORTHFLANK_PROJECT_ID }}
          ref: ${{ github.head_ref }}

      - name: Comment preview URL
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            await github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.payload.pull_request.number,
              body: `🚀 Preview deployed: https://api--pr-${context.payload.pull_request.number}.northflank.app`
            })
```

### Multi-service with worker

```yaml
# northflank-stack.yml — declarative multi-service stack
services:
  api:
    image: ghcr.io/myorg/myapp:latest
    port: 3000
    instances: 2
    secretGroups:
      - app-secrets
    healthCheck:
      path: /health
      initialDelay: 30

  worker:
    image: ghcr.io/myorg/myapp:latest
    command: node worker.js
    instances: 1
    secretGroups:
      - app-secrets
    # No port — workers don't serve HTTP

  scheduler:
    image: ghcr.io/myorg/myapp:latest
    schedule: "0 * * * *"   # cron: every hour
    command: node cron.js
    secretGroups:
      - app-secrets
```

### Environment variables and secrets

```bash
# Add a secret to a secret group
northflank create secret \
  --secret-group app-secrets \
  --name STRIPE_SECRET_KEY \
  --value sk_live_xxx

# Override per service (e.g. different log level in worker)
northflank update service worker \
  --env LOG_LEVEL=debug

# List all secrets in a group (values redacted)
northflank list secrets --secret-group app-secrets
```

### Rollback

```bash
# List recent deployments
northflank list deployments --service api

# Roll back to a specific deployment
northflank rollback deployment \
  --service api \
  --deployment-id dep_abc123

# Or roll back to a specific image tag
northflank update service api \
  --image ghcr.io/myorg/myapp:previous-sha
```

### Northflank vs Railway

| Feature | Northflank | Railway |
|---------|-----------|---------|
| Multi-service | Native support | Separate services |
| Preview environments | First-class PR integration | Supported |
| Managed databases | PostgreSQL, Redis, MySQL, MongoDB | PostgreSQL, Redis, MySQL |
| Secret injection | Automatic from add-ons | Env var linking |
| Pricing | Team-focused ($20+/mo) | Pay-as-you-go ($5+/mo) |
| Best for | Teams, multi-service SaaS | Solo devs, rapid prototyping |

## Example

**User:** Deploy a Next.js app with a Celery worker, managed PostgreSQL and Redis on Northflank, with automatic preview deployments for every PR and production deploy on merge to main.

**Expected output:**
- `northflank.json` — combined service config for Next.js
- `northflank-worker.json` — worker service config (same image, different command)
- `.github/workflows/deploy.yml` — production deploy on main, preview on PR, URL comment
- GitHub secret requirements: `NORTHFLANK_API_KEY`, `NORTHFLANK_PROJECT_ID`
- Step-by-step: create project → add postgres → add redis → link to secret group → deploy

---
