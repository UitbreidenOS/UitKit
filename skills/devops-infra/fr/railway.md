---
name: railway
description: "Railway deployment: Dockerfile deploys, managed Postgres/Redis, environment variables, PR preview environments, custom domains, CLI workflow"
---

> 🇫🇷 Version française. [English version](../railway.md).

# Compétence Railway

## Quand activer
- Déployer une application Node.js, Python, Go ou toute application basée sur Dockerfile vers Railway
- Configurer PostgreSQL ou Redis géré sur Railway
- Configurer les variables d'environnement et les secrets pour les services Railway
- Créer des environnements de prévisualisation qui se déploient automatiquement sur PR
- Configurer un domaine personnalisé avec SSL automatique
- Utiliser le CLI Railway pour la parité avec le développement local

## Quand NE PAS utiliser
- Infrastructure Kubernetes à grande échelle — utiliser EKS/GKE
- Applications nécessitant des instances GPU dédiées — utiliser Lambda Labs ou RunPod
- Charges de travail sensibles à la conformité nécessitant des régions spécifiques — vérifier la disponibilité des régions de Railway

## Pourquoi Railway pour le vibe coding

Railway est le chemin le plus rapide du code local au service de production en cours d'exécution. Il détecte automatiquement votre runtime, provisionne les bases de données en un clic et injecte les identifiants comme variables d'environnement. C'est pourquoi la recherche identifie Railway comme optimal pour les bases de code générées par IA — l'agent peut pousser un commit et avoir une URL en direct en moins de 2 minutes.

## Instructions

### Déploiement initial

```bash
# Installer le CLI Railway
npm install -g @railway/cli

# Connexion
railway login

# Créer un nouveau projet depuis le répertoire actuel
railway init

# Déployer
railway up

# Ouvrir le service déployé
railway open
```

### Déploiement Dockerfile (recommandé pour la production)

Railway détecte automatiquement les Dockerfiles. Gardez le vôtre minimal :

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
// railway.json — fichier de configuration Railway
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

### Ajouter des bases de données gérées

```bash
# Via CLI
railway add postgres   # ajoute le service PostgreSQL
railway add redis      # ajoute le service Redis

# Railway injecte automatiquement ces variables :
# DATABASE_URL       — chaîne de connexion PostgreSQL
# REDIS_URL          — chaîne de connexion Redis
```

Dans votre application, utilisez directement les variables injectées par Railway :

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

### Variables d'environnement

```bash
# Définir via CLI
railway variables set API_KEY=secret123
railway variables set NODE_ENV=production

# Définir depuis un fichier .env
railway variables set --kv-file .env.production

# Afficher les variables actuelles
railway variables

# Référencer la variable d'un autre service (configuration partagée)
# Dans le tableau de bord Railway : syntaxe de référence de variable
# DATABASE_URL = ${{postgres.DATABASE_URL}}
```

### Liaison de services (partager des variables entre services)

```bash
# Référencer des variables d'un autre service dans le même projet
# Dans le tableau de bord Railway → Service → Variables → Ajouter une référence
# Ou dans railway.toml :
```

```toml
# railway.toml
[variables]
DATABASE_URL = "${{Postgres.DATABASE_URL}}"
REDIS_URL = "${{Redis.REDIS_URL}}"
```

### Intégration GitHub Actions

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

### Environnements de prévisualisation PR

Railway prend en charge les environnements de prévisualisation automatiques par PR via l'intégration GitHub :

1. Tableau de bord Railway → Projet → Paramètres → GitHub → Activer les déploiements PR
2. Chaque PR obtient une URL unique : `https://my-app-pr-{number}.railway.app`
3. Supprimé automatiquement à la fermeture de la PR

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
        run: sleep 30  # Railway a besoin de temps pour déployer

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

### Domaines personnalisés et SSL

```bash
# Ajouter un domaine personnalisé via CLI
railway domain add app.mycompany.com

# Railway fournit :
# - SSL Let's Encrypt automatique
# - Enregistrement CNAME à ajouter à votre DNS
# - Renouvellement automatique
```

### Commandes CLI utiles

```bash
railway status          # état du déploiement actuel
railway logs            # diffuser les logs du déploiement actif
railway logs --tail 100 # 100 dernières lignes de logs
railway shell           # SSH dans le conteneur en cours d'exécution
railway run npm migrate # exécuter une commande dans l'environnement Railway
railway up --detach     # déployer sans attendre la fin
railway down            # arrêter le déploiement actuel
railway env             # afficher les variables d'environnement injectées
```

### Déploiement monorepo

```toml
# railway.toml — déployer un service spécifique depuis un monorepo
[build]
builder = "DOCKERFILE"
dockerfilePath = "apps/api/Dockerfile"
buildContext = "."

[deploy]
startCommand = "node apps/api/dist/main.js"
```

```bash
# Déployer uniquement le service api
railway up --service api
```

## Exemple

**Utilisateur :** Déployer une application FastAPI avec Postgres et Redis sur Railway — configurer GitHub Actions pour le déploiement automatique sur main, des environnements de prévisualisation pour les PR, et un endpoint de vérification de santé.

**Résultat attendu :**
- `Dockerfile` — python:3.12-slim, uvicorn sur `0.0.0.0:8000`
- `railway.json` — healthcheckPath `/health`, redémarrage en cas d'échec
- `app/routers/health.py` — `GET /health` retourne `{"status": "ok", "db": "connected"}`
- `.github/workflows/deploy.yml` — `railway up --detach` au push sur main
- Étapes du tableau de bord Railway : ajouter Postgres, ajouter Redis, activer les déploiements PR

---
