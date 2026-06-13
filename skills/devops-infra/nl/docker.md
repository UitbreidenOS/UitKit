> 🇳🇱 Dit is de Nederlandse vertaling. [Engelse versie](../docker.md).

# Docker Skill

## Wanneer te activeren
- Dockerfiles schrijven of optimaliseren voor productie
- Multi-stage builds instellen om de image-grootte te verkleinen
- Docker Compose-bestanden schrijven voor lokale ontwikkeling
- Container-opstartfouten of layer cache-problemen debuggen
- Niet-root gebruikers, health checks en image-beveiliging configureren
- .dockerignore instellen voor efficiënte builds
- Build-scripts of CI/CD Docker build-pipelines schrijven

## Wanneer NIET te gebruiken
- Kubernetes-manifests (gebruik de Kubernetes skill)
- Buildpacks (Heroku, Cloud Native Buildpacks) — ander build-systeem
- Virtual machine-inrichting (ander abstractieniveau)
- Op Nix gebaseerde reproduceerbare builds

## Instructies

### Productie Dockerfile-structuur
Gebruik altijd multi-stage builds voor gecompileerde talen en Node.js:

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Runtime — minimale image
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

### Beveiligingsregels
- Draai nooit als root in productie — maak altijd een niet-root gebruiker aan en schakel er naar over
- Gebruik nooit de `latest`-tag — pin op een specifieke versie of digest
- Geef de voorkeur aan Alpine- of distroless-basisimages boven volledige Debian/Ubuntu
- Kopieer nooit `.env`-bestanden in de image — geef secrets door als runtime-omgevingsvariabelen
- Scan images met `docker scout` of Trivy voordat ze naar productie worden gepusht

### Optimalisatie van layer-caching
Orden Dockerfile-instructies van minst-naar-meest frequent wisselend:
1. Basisimage (verandert zelden)
2. Systeemafhankelijkheden (`apt-get`, `apk add`)
3. Pakketbeheerderbestanden (`package.json`, `requirements.txt`)
4. Pakketinstallatie (`npm ci`, `pip install`)
5. Applicatiecode (`COPY . .`) — verandert het vaakst, moet als laatste staan

### .dockerignore — altijd opnemen
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

### Docker Compose voor lokale ontwikkeling
```yaml
services:
  app:
    build:
      context: .
      target: builder          # Gebruik build stage, niet runtime stage lokaal
    volumes:
      - .:/app                 # Hot reload
      - /app/node_modules      # Overschrijf container node_modules niet
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
      POSTGRES_PASSWORD: dev_password   # Alleen dev — nooit productie
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

### Veelvoorkomende build-fouten
- `COPY` mislukt stilletjes als de bron niet bestaat — controleer of `.dockerignore` benodigde bestanden niet uitsluit
- Layer-cache onverwacht ongeldig — controleer of een `COPY` vóór installatiestappen gewijzigde bestanden meeneemt
- Toegang geweigerd tijdens runtime — controleer bestandseigendom bij gebruik van `COPY --from` met een niet-root gebruiker

## Voorbeeld

**Gebruiker:** Schrijf een productie-Dockerfile voor een Python FastAPI-app met multi-stage build, niet-root gebruiker en health check.

**Verwachte output:**
- Stage 1 (builder): `python:3.12-slim`, afhankelijkheden installeren met `pip install --no-cache-dir`
- Stage 2 (runtime): `python:3.12-slim`, niet-root gebruiker, alleen wheels/deps van builder + app-code kopiëren
- `HEALTHCHECK` die het `/healthz`-endpoint raakt
- `CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]`
- `.dockerignore` die `__pycache__`, `.env`, `.git`, `*.pyc` afdekt

---
