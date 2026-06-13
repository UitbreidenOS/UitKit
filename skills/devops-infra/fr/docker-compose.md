---
name: docker-compose
description: "Docker Compose for local dev: multi-service stacks, volumes, networking, health checks, env vars, production-like local environments"
---

> 🇫🇷 Version française. [English version](../docker-compose.md).

# Compétence Docker Compose

## Quand l'activer
- Mettre en place un environnement de développement local avec plusieurs services (app + BDD + Redis + etc.)
- Écrire ou déboguer un fichier `docker-compose.yml` ou `compose.yaml`
- Faire correspondre les services locaux à la production (même version de BDD, mêmes variables d'environnement)
- Ajouter des health checks, un ordre `depends_on`, ou des montages de volumes
- Exécuter des tests d'intégration contre de vrais services en local

## Quand NE PAS utiliser
- Déploiements en production — utiliser Kubernetes, ECS ou Fly.io
- Applications à conteneur unique — utiliser `docker run` directement
- Conteneurs de services en pipeline CI/CD — utiliser les définitions de services CI natives

## Instructions

### Fichier compose standard pour la stack de développement

```yaml
# compose.yaml (Docker Compose v2 — nom de fichier préféré)
name: myapp

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
      target: dev                    # utiliser un stage dev avec rechargement à chaud
    ports:
      - "3000:3000"
    volumes:
      - .:/app                       # monter le source pour le rechargement à chaud
      - /app/node_modules            # exclure node_modules du montage
    environment:
      NODE_ENV: development
      DATABASE_URL: postgresql://postgres:postgres@db:5432/myapp
      REDIS_URL: redis://redis:6379
    depends_on:
      db:
        condition: service_healthy   # attendre que la BDD soit prête
      redis:
        condition: service_started
    develop:
      watch:                         # Docker Compose Watch (v2.22+)
        - action: sync
          path: ./src
          target: /app/src

  db:
    image: postgres:16-alpine
    ports:
      - "5432:5432"                  # exposer pour l'accès client BDD
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql  # initialiser au premier démarrage
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d myapp"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes  # persister les données

  mailpit:                           # capture d'e-mails locale (aucun vrai e-mail envoyé)
    image: axllent/mailpit
    ports:
      - "8025:8025"                  # interface web
      - "1025:1025"                  # SMTP
    environment:
      SMTP_AUTH_ACCEPT_ANY: true

volumes:
  postgres_data:
  redis_data:
```

### Commandes

```bash
# Démarrer tous les services (en arrière-plan)
docker compose up -d

# Démarrer avec les logs
docker compose up

# Reconstruire les images et démarrer
docker compose up -d --build

# Arrêter tous les services (conserver les volumes)
docker compose stop

# Arrêter et supprimer les conteneurs + réseaux
docker compose down

# Arrêter et tout supprimer, volumes inclus
docker compose down -v

# Afficher les logs
docker compose logs -f              # tous les services
docker compose logs -f app          # service spécifique

# Exécuter une commande dans un conteneur en cours d'exécution
docker compose exec app bash
docker compose exec db psql -U postgres myapp

# Exécuter une commande ponctuelle (nouveau conteneur)
docker compose run --rm app npm run migrate

# Mettre à l'échelle un service
docker compose up -d --scale worker=3
```

### Gestion des variables d'environnement

```yaml
# compose.yaml — plusieurs façons de passer des variables d'environnement
services:
  app:
    # Option 1 : en ligne (déconseillé pour les secrets)
    environment:
      NODE_ENV: development

    # Option 2 : depuis un fichier .env (par défaut : .env à la racine du projet)
    env_file:
      - .env
      - .env.local          # remplace .env

    # Option 3 : référencer les variables d'environnement de l'hôte
    environment:
      API_KEY: ${API_KEY}   # lit depuis l'environnement shell
```

```bash
# .env (versionné — valeurs par défaut non secrètes)
DATABASE_URL=postgresql://postgres:postgres@db:5432/myapp
REDIS_URL=redis://redis:6379
NODE_ENV=development

# .env.local (ignoré par git — secrets et surcharges personnelles)
API_KEY=sk-real-key
STRIPE_SECRET_KEY=sk_test_xxx
```

### Réseau entre services

Les services d'un même projet Compose communiquent en utilisant **les noms de service comme noms d'hôte** :

```yaml
services:
  app:
    environment:
      # Utiliser le nom de service 'db', pas 'localhost'
      DATABASE_URL: postgresql://postgres:postgres@db:5432/myapp
      #                                                  ^^
  db:
    image: postgres:16-alpine
```

```yaml
# Réseau personnalisé pour l'isolation
services:
  frontend:
    networks: [public, internal]

  api:
    networks: [internal]

  db:
    networks: [internal]     # non accessible directement depuis le frontend

networks:
  public:
  internal:
    internal: true           # pas d'accès externe
```

### Dockerfile multi-stage pour la parité dev/prod

```dockerfile
# Dockerfile
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./

# Stage développement — inclut devDependencies, rechargement à chaud
FROM base AS dev
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]

# Stage de build
FROM base AS build
RUN npm ci
COPY . .
RUN npm run build

# Stage production — image minimale
FROM node:22-alpine AS prod
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

```yaml
# compose.yaml — utiliser le stage dev en local
services:
  app:
    build:
      context: .
      target: dev

# compose.prod.yaml — utiliser le stage prod
services:
  app:
    build:
      context: .
      target: prod
```

### Health checks et ordre de démarrage

```yaml
services:
  app:
    depends_on:
      db:
        condition: service_healthy     # attendre le health check de la BDD
      migrate:
        condition: service_completed_successfully  # attendre les migrations

  db:
    image: postgres:16-alpine
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 3s
      retries: 10
      start_period: 10s

  migrate:
    build: .
    command: npm run migrate
    depends_on:
      db:
        condition: service_healthy
    restart: "no"           # exécuter une seule fois puis quitter
```

### Patterns utiles

**Services optionnels par profil :**
```yaml
services:
  app:
    image: myapp

  pgadmin:
    image: dpage/pgadmin4
    profiles: [tools]        # démarre uniquement avec : docker compose --profile tools up
    ports:
      - "5050:80"
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@example.com
      PGADMIN_DEFAULT_PASSWORD: admin
```

**Montage de fichiers de configuration :**
```yaml
services:
  nginx:
    image: nginx:alpine
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro  # :ro = lecture seule
    ports:
      - "80:80"
```

**Exécuter les migrations BDD au démarrage :**
```yaml
services:
  app:
    command: >
      sh -c "npm run migrate && npm run dev"
    depends_on:
      db:
        condition: service_healthy
```

## Exemple

**Utilisateur :** Mettre en place un environnement de développement local pour une application FastAPI avec PostgreSQL, Redis, un worker Celery, et un frontend React — le tout correspondant à la configuration de production.

**Sortie attendue :**
```yaml
services:
  api:        # FastAPI avec uvicorn --reload
  worker:     # Worker Celery (même image que api, commande différente)
  frontend:   # React avec le serveur de développement vite
  db:         # postgres:16, healthcheck, volume
  redis:      # redis:7, appendonly
  flower:     # Interface de surveillance Celery, profil : tools
```

---
