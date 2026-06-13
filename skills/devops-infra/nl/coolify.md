---
name: coolify
description: "Coolify self-hosted PaaS: deploy apps and databases on your own server, Docker/Git-based deploys, preview environments, wildcard SSL, free alternative to Heroku/Railway"
---

# Coolify Skill

## Wanneer activeren
- Een PaaS zelf hosten op een VPS (Hetzner, DigitalOcean, Vultr) met Coolify
- Docker Compose, Dockerfile of Git-gebaseerde apps implementeren zonder Kubernetes
- Beheerde PostgreSQL, Redis of MongoDB instellen op uw eigen infrastructuur
- Preview-deployments maken van Git-branches of PR's
- Migreren van Heroku, Render of Railway naar een zelf-gehoste oplossing
- Wildcard SSL met Let's Encrypt configureren op een aangepast domein

## Wanneer NIET gebruiken
- Beheerde cloud waar u de server niet controleert (gebruik Railway/Vercel/Fly.io)
- Teams die SOC2-conformiteit van de hostingprovider nodig hebben
- Workloads die automatisch schalen vereisen buiten verticaal schalen

## Waarom Coolify voor vibe-codering

Coolify is de open-source Heroku. U bezit de infrastructuur, betaalt alleen voor de VPS (~$6/maand op Hetzner), en krijgt een volledige PaaS-ervaring: databases met één klik, automatische SSL, Git-implementaties, preview-omgevingen en een webdashboard. Het elimineert implementatiewrijving zonder vendor lock-in — ideaal voor AI-gegenereerde codebases die snel productiehosting nodig hebben.

## Instructies

### Installatie op een VPS

```bash
# SSH into your server (Ubuntu 22.04+ recommended)
ssh root@your-server-ip

# Install Coolify (one-liner)
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash

# Coolify dashboard runs on port 8000
# Access: http://your-server-ip:8000
# Set up your admin account on first visit
```

**Aanbevolen VPS-specs:**
- Minimum: 2 vCPU, 4GB RAM (Hetzner CX22 ~$5/maand)
- Production: 4 vCPU, 8GB RAM (Hetzner CX32 ~$10/maand)

### Een app implementeren

**Vanuit een Git-repository:**
1. Dashboard → New Resource → Application
2. Connect GitHub/GitLab repo
3. Select branch (e.g. `main`)
4. Coolify auto-detects: Dockerfile, Nixpacks (Node.js, Python, Ruby, Go)
5. Set environment variables
6. Deploy

**Vanuit een Dockerfile:**
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

### Beheerde databases

1. Dashboard → New Resource → Database
2. Select: PostgreSQL 16, Redis 7, MySQL, MongoDB, etc.
3. Coolify provisions op uw server met:
   - Persistent volume
   - Internal connection string (within your network)
   - Optional: expose on external port with credentials

```bash
# Internal connection (app on same Coolify instance)
DATABASE_URL=postgresql://postgres:password@coolify-db:5432/myapp

# These are injected as environment variables to linked services automatically
```

### Omgevingsvariabelen

```bash
# Set in Coolify dashboard → Application → Environment Variables
DATABASE_URL=postgresql://postgres:secret@coolify-db-uuid:5432/myapp
REDIS_URL=redis://:secret@coolify-redis-uuid:6379
JWT_SECRET=your-secret-here
NODE_ENV=production

# Link database: Application → Environment → Add from Database
# Coolify injects DATABASE_URL automatically from linked database
```

### Preview-deployments (PR-omgevingen)

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

### Aangepaste domeinen en SSL

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

### Implementatie-webhooks (trigger deploys van CI)

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

### Gezondheidscontroles

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

### Back-up en herstel

```bash
# Coolify dashboard → Database → Backups
# Configure: S3-compatible storage (AWS S3, Cloudflare R2, MinIO)
# Schedule: daily backups, retain 7 days

# Restore from backup:
# Dashboard → Database → Backups → Select backup → Restore
```

### Coolify versus Railway

| Feature | Coolify | Railway |
|---------|---------|---------|
| Cost | VPS cost (~$6-10/mo) | Usage-based (~$5-20/mo) |
| Control | Full server access | Managed |
| Setup time | 10 minutes | 2 minutes |
| Scaling | Vertical (manual) | Automatic |
| Best for | Cost-sensitive, high control | Speed, simplicity |

## Voorbeeld

**Gebruiker:** Een Next.js + PostgreSQL-app zelf hosten op een Hetzner VPS met Coolify met preview-implementaties voor PR's en automatische SSL.

**Verwachte output:**
- `Dockerfile` — Next.js standalone build
- `coolify.yaml` — preview deployments enabled
- `app/health/route.ts` — health check endpoint
- GitHub Actions workflow triggering Coolify webhook on main push
- Stap voor stap: install Coolify → add GitHub repo → link PostgreSQL → configure domain → enable previews

---
