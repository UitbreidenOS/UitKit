> 🇫🇷 This is the French translation. [English version](../docker.md).

# Compétence Docker

## Quand activer
- Rédiger ou optimiser des Dockerfiles pour la production
- Configurer des builds multi-étapes pour réduire la taille des images
- Rédiger des fichiers Docker Compose pour le développement local
- Déboguer des échecs de démarrage de conteneurs ou des problèmes de cache de couches
- Configurer des utilisateurs non-root, des health checks et la sécurité des images
- Configurer .dockerignore pour des builds efficaces
- Rédiger des scripts de build ou des pipelines CI/CD de build Docker

## Quand NE PAS utiliser
- Manifests Kubernetes (utiliser la compétence Kubernetes)
- Buildpacks (Heroku, Cloud Native Buildpacks) — système de build différent
- Provisionnement de machines virtuelles (niveau d'abstraction différent)
- Builds reproductibles basés sur Nix

## Instructions

### Structure du Dockerfile de production
Toujours utiliser des builds multi-étapes pour les langages compilés et Node.js :

```dockerfile
# Étape 1 : Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Étape 2 : Runtime — image minimale
FROM node:20-alpine AS runtime
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
USER appuser
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:8080/healthz || exit 1
CMD ["node", "server.js"]
```

### Règles de sécurité
- Ne jamais s'exécuter en tant que root en production — toujours créer et basculer vers un utilisateur non-root
- Ne jamais utiliser le tag `latest` — épingler à une version spécifique ou un digest
- Préférer les images de base Alpine ou distroless plutôt que Debian/Ubuntu complet
- Ne jamais copier des fichiers `.env` dans l'image — passer les secrets comme variables d'environnement à l'exécution
- Scanner les images avec `docker scout` ou Trivy avant de pousser en production

### Optimisation du cache de couches
Ordonner les instructions Dockerfile du moins au plus fréquemment modifié :
1. Image de base (change rarement)
2. Dépendances système (`apt-get`, `apk add`)
3. Fichiers du gestionnaire de paquets (`package.json`, `requirements.txt`)
4. Installation des paquets (`npm ci`, `pip install`)
5. Code applicatif (`COPY . .`) — change le plus souvent, doit être en dernier

### .dockerignore — toujours inclure
```
node_modules/
.git/
.env
.env.*
*.md
Dockerfile*
docker-compose*
.dockerignore
coverage/
.nyc_output/
__pycache__/
*.pyc
.pytest_cache/
```

### Docker Compose pour le développement local
```yaml
services:
  app:
    build:
      context: .
      target: builder          # Utiliser l'étape de build, pas l'étape runtime en local
    volumes:
      - .:/app                 # Hot reload
      - /app/node_modules      # Ne pas écraser les node_modules du conteneur
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=development
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: dev_password   # Dev uniquement — jamais en production
      POSTGRES_DB: appdb
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d appdb"]
      interval: 5s
      timeout: 5s
      retries: 5
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Échecs de build courants
- `COPY` échoue silencieusement si la source n'existe pas — vérifier que `.dockerignore` n'exclut pas les fichiers nécessaires
- Cache de couche invalidé de façon inattendue — vérifier si un `COPY` avant les étapes d'installation récupère des fichiers modifiés
- Permission refusée à l'exécution — vérifier la propriété des fichiers lors de l'utilisation de `COPY --from` avec un utilisateur non-root

## Exemple

**Utilisateur :** Rédiger un Dockerfile de production pour une application Python FastAPI avec build multi-étapes, utilisateur non-root et health check.

**Sortie attendue :**
- Étape 1 (builder) : `python:3.12-slim`, installer les dépendances avec `pip install --no-cache-dir`
- Étape 2 (runtime) : `python:3.12-slim`, utilisateur non-root, copier uniquement les wheels/deps depuis le builder + code applicatif
- `HEALTHCHECK` ciblant l'endpoint `/healthz`
- `CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]`
- `.dockerignore` couvrant `__pycache__`, `.env`, `.git`, `*.pyc`

---
