---
name: coolify
description: "Coolify self-hosted PaaS: deploy apps and databases on your own server, Docker/Git-based deploys, preview environments, wildcard SSL, free alternative to Heroku/Railway"
updated: 2026-06-13
---

# Coolify Skill

## When to activate
- Self-hosting a PaaS on a VPS (Hetzner, DigitalOcean, Vultr) using Coolify
- Deploying Docker Compose, Dockerfile, or Git-based apps without Kubernetes
- Setting up managed PostgreSQL, Redis, or MongoDB on your own infrastructure
- Creating preview deployments from Git branches or PRs
- Migrating from Heroku, Render, or Railway to a self-hosted solution
- Configuring wildcard SSL with Let's Encrypt on a custom domain

## When NOT to use
- Managed cloud where you don't control the server (use Railway/Vercel/Fly.io)
- Teams that need SOC2 compliance from the hosting provider
- Workloads requiring auto-scaling beyond vertical scaling

## Why Coolify for vibe coding

Coolify is the open-source Heroku. You own the infrastructure, pay only for the VPS (~$6/month on Hetzner), and get a full PaaS experience: one-click databases, automatic SSL, Git deployments, preview environments, and a web dashboard. It eliminates deployment friction without vendor lock-in — making it ideal for AI-generated codebases that need production hosting fast.

## Instructions

### Installation on a VPS

```bash
# SSH into your server (Ubuntu 22.04+ recommended)
ssh root@your-server-ip

# Install Coolify (one-liner)
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash

# Coolify dashboard runs on port 8000
# Access: http://your-server-ip:8000
# Set up your admin account on first visit
```

**Recommended VPS specs:**
- Minimum: 2 vCPU, 4GB RAM (Hetzner CX22 ~$5/month)
- Production: 4 vCPU, 8GB RAM (Hetzner CX32 ~$10/month)

### Deploying an app

**From a Git repository:**
1. Dashboard → New Resource → Application
2. Connect GitHub/GitLab repo
3. Select branch (e.g. `main`)
4. Coolify auto-detects: Dockerfile, Nixpacks (Node.js, Python, Ruby, Go)
5. Set environment variables
6. Deploy

**From a Dockerfile:**
```dockerfile
# Coolify reads this automatically from your repo root
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

**Docker Compose:**
```yaml
# docker-compose.yml — Coolify deploys this as a stack
version: '3.8'
services:
  app:
    build: .
    environment:
      DATABASE_URL: ${DATABASE_URL}
    ports:
      - "3000:3000"
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      retries: 5

volumes:
  postgres_data:
```

### Managed databases

1. Dashboard → New Resource → Database
2. Select: PostgreSQL 16, Redis 7, MySQL, MongoDB, etc.
3. Coolify provisions on your server with:
   - Persistent volume
   - Internal connection string (within your network)
   - Optional: expose on external port with credentials

```bash
# Internal connection (app on same Coolify instance)
DATABASE_URL=postgresql://postgres:password@coolify-db:5432/myapp

# These are injected as environment variables to linked services automatically
```

### Environment variables

```bash
# Set in Coolify dashboard → Application → Environment Variables
DATABASE_URL=postgresql://postgres:secret@coolify-db-uuid:5432/myapp
REDIS_URL=redis://:secret@coolify-redis-uuid:6379
JWT_SECRET=your-secret-here
NODE_ENV=production

# Link database: Application → Environment → Add from Database
# Coolify injects DATABASE_URL automatically from linked database
```

### Preview deployments (PR environments)

1. Application → Source → Enable Preview Deployments
2. Each PR/branch gets its own deployment
3. Wildcard domain: `*.myapp.coolify.my-server.com`
4. Auto-cleanup when branch/PR is closed

```yaml
# coolify.yaml — optional configuration file in repo root
preview:
  enabled: true
  domain: preview.myapp.com
  database:
    cloneFromProduction: true   # clone prod DB for each preview
```

### Custom domains and SSL

```bash
# In Coolify dashboard → Application → Domains
# Add: myapp.com, www.myapp.com

# Coolify automatically:
# 1. Issues Let's Encrypt SSL certificate
# 2. Sets up Traefik reverse proxy
# 3. Redirects HTTP → HTTPS
# 4. Auto-renews certificates

# For wildcard SSL (preview environments):
# Settings → SSL → Wildcard → *.myapp.com
# Requires DNS challenge (Cloudflare API token)
```

### Deployment webhooks (trigger deploys from CI)

```bash
# Get deploy webhook URL from Coolify dashboard → Application → Deploy Webhook

# Trigger from GitHub Actions
curl -X POST "${{ secrets.COOLIFY_WEBHOOK_URL }}" \
  -H "Authorization: Bearer ${{ secrets.COOLIFY_TOKEN }}"
```

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Coolify deploy
        run: |
          curl -X POST "$COOLIFY_WEBHOOK" \
            -H "Authorization: Bearer $COOLIFY_TOKEN"
        env:
          COOLIFY_WEBHOOK: ${{ secrets.COOLIFY_WEBHOOK_URL }}
          COOLIFY_TOKEN: ${{ secrets.COOLIFY_TOKEN }}
```

### Health checks

```yaml
# In Coolify dashboard → Application → Health Check
# Or in docker-compose.yml:
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 30s
```

```typescript
// app/health/route.ts — required for Coolify health checks
export async function GET() {
  try {
    await db.execute('SELECT 1')  // verify DB connection
    return Response.json({ status: 'ok', db: 'connected' })
  } catch {
    return Response.json({ status: 'error', db: 'disconnected' }, { status: 503 })
  }
}
```

### Backup and restore

```bash
# Coolify dashboard → Database → Backups
# Configure: S3-compatible storage (AWS S3, Cloudflare R2, MinIO)
# Schedule: daily backups, retain 7 days

# Restore from backup:
# Dashboard → Database → Backups → Select backup → Restore
```

### Coolify vs Railway

| Feature | Coolify | Railway |
|---------|---------|---------|
| Cost | VPS cost (~$6-10/mo) | Usage-based (~$5-20/mo) |
| Control | Full server access | Managed |
| Setup time | 10 minutes | 2 minutes |
| Scaling | Vertical (manual) | Automatic |
| Best for | Cost-sensitive, high control | Speed, simplicity |

## Example

**User:** Self-host a Next.js + PostgreSQL app on a Hetzner VPS using Coolify with preview deployments for PRs and automatic SSL.

**Expected output:**
- `Dockerfile` — Next.js standalone build
- `coolify.yaml` — preview deployments enabled
- `app/health/route.ts` — health check endpoint
- GitHub Actions workflow triggering Coolify webhook on main push
- Step-by-step: install Coolify → add GitHub repo → link PostgreSQL → configure domain → enable previews

---
