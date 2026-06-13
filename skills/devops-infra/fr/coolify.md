---
name: coolify
description: "Coolify PaaS auto-hébergé : déployer des applications et des bases de données sur votre propre serveur, déploiements basés sur Docker/Git, environnements d'aperçu, SSL wildcard, alternative gratuite à Heroku/Railway"
---

# Coolify Skill

## Quand activer
- Auto-héberger un PaaS sur un VPS (Hetzner, DigitalOcean, Vultr) en utilisant Coolify
- Déployer Docker Compose, Dockerfile ou des applications basées sur Git sans Kubernetes
- Configurer PostgreSQL, Redis ou MongoDB gérés sur votre propre infrastructure
- Créer des déploiements d'aperçu à partir de branches Git ou de PR
- Migrer depuis Heroku, Render ou Railway vers une solution auto-hébergée
- Configurer SSL wildcard avec Let's Encrypt sur un domaine personnalisé

## Quand ne PAS utiliser
- Cloud géré où vous ne contrôlez pas le serveur (utiliser Railway/Vercel/Fly.io)
- Équipes qui ont besoin de conformité SOC2 du fournisseur d'hébergement
- Charges de travail nécessitant une mise à l'échelle automatique au-delà de la mise à l'échelle verticale

## Pourquoi Coolify pour la programmation vibe

Coolify est le Heroku open-source. Vous possédez l'infrastructure, ne payez que pour le VPS (~$6/mois sur Hetzner) et obtenez une expérience PaaS complète : bases de données en un clic, SSL automatique, déploiements Git, environnements d'aperçu et un tableau de bord Web. Il élimine les frictions de déploiement sans verrou-in de fournisseur — ce qui le rend idéal pour les bases de code générées par IA qui ont besoin d'un hébergement de production rapide.

## Instructions

### Installation sur un VPS

```bash
# SSH into your server (Ubuntu 22.04+ recommended)
ssh root@your-server-ip

# Install Coolify (one-liner)
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash

# Coolify dashboard runs on port 8000
# Access: http://your-server-ip:8000
# Set up your admin account on first visit
```

**Spécifications VPS recommandées:**
- Minimum: 2 vCPU, 4GB RAM (Hetzner CX22 ~$5/mois)
- Production: 4 vCPU, 8GB RAM (Hetzner CX32 ~$10/mois)

### Déployer une application

**À partir d'un référentiel Git:**
1. Dashboard → New Resource → Application
2. Connecter le référentiel GitHub/GitLab
3. Sélectionner la branche (p.ex. `main`)
4. Coolify détecte automatiquement : Dockerfile, Nixpacks (Node.js, Python, Ruby, Go)
5. Définir les variables d'environnement
6. Déployer

**À partir d'un Dockerfile:**
```dockerfile
# Coolify lit cela automatiquement à partir de la racine de votre référentiel
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
# docker-compose.yml — Coolify déploie cela en tant que pile
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

### Bases de données gérées

1. Dashboard → New Resource → Database
2. Sélectionner : PostgreSQL 16, Redis 7, MySQL, MongoDB, etc.
3. Coolify provisionne sur votre serveur avec :
   - Volume persistant
   - Chaîne de connexion interne (dans votre réseau)
   - Optionnel : exposer sur le port externe avec les identifiants

```bash
# Internal connection (app on same Coolify instance)
DATABASE_URL=postgresql://postgres:password@coolify-db:5432/myapp

# These are injected as environment variables to linked services automatically
```

### Variables d'environnement

```bash
# Set in Coolify dashboard → Application → Environment Variables
DATABASE_URL=postgresql://postgres:secret@coolify-db-uuid:5432/myapp
REDIS_URL=redis://:secret@coolify-redis-uuid:6379
JWT_SECRET=your-secret-here
NODE_ENV=production

# Link database: Application → Environment → Add from Database
# Coolify injects DATABASE_URL automatically from linked database
```

### Déploiements d'aperçu (environnements PR)

1. Application → Source → Enable Preview Deployments
2. Chaque PR/branche obtient son propre déploiement
3. Domaine wildcard : `*.myapp.coolify.my-server.com`
4. Nettoyage automatique quand la branche/PR est fermée

```yaml
# coolify.yaml — optional configuration file in repo root
preview:
  enabled: true
  domain: preview.myapp.com
  database:
    cloneFromProduction: true   # clone prod DB for each preview
```

### Domaines personnalisés et SSL

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

### Webhooks de déploiement (déclencher des déploiements depuis CI)

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

### Vérifications de santé

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

### Sauvegarde et restauration

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
| Cost | Coût du VPS (~$6-10/mo) | Basé sur l'utilisation (~$5-20/mo) |
| Control | Accès serveur complet | Géré |
| Setup time | 10 minutes | 2 minutes |
| Scaling | Vertical (manual) | Automatique |
| Best for | Sensible au coût, contrôle élevé | Vitesse, simplicité |

## Exemple

**User:** Auto-héberger une application Next.js + PostgreSQL sur un VPS Hetzner en utilisant Coolify avec des déploiements d'aperçu pour les PR et SSL automatique.

**Expected output:**
- `Dockerfile` — Next.js standalone build
- `coolify.yaml` — preview deployments enabled
- `app/health/route.ts` — health check endpoint
- Workflow GitHub Actions déclenchant le webhook Coolify au push principal
- Étape par étape : installer Coolify → ajouter le référentiel GitHub → lier PostgreSQL → configurer le domaine → activer les aperçus

---
