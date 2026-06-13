---
name: docker
description: "Dockerfile best practices, multi-stage builds, Compose services, networking, volumes, build caching"
updated: 2026-06-13
---

# Docker Skill

## When to activate
- Writing or optimizing Dockerfiles for production
- Setting up multi-stage builds to reduce image size
- Writing Docker Compose files for local development
- Debugging container startup failures or layer cache issues
- Configuring non-root users, health checks, and image security
- Setting up .dockerignore for efficient builds
- Writing build scripts or CI/CD Docker build pipelines

## When NOT to use
- Kubernetes manifests (use the Kubernetes skill)
- Buildpacks (Heroku, Cloud Native Buildpacks) — different build system
- Virtual machine provisioning (different abstraction level)
- Nix-based reproducible builds

## Instructions

### Production Dockerfile structure
Always use multi-stage builds for compiled languages and Node.js:

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Runtime — minimal image
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

### Security rules
- Never run as root in production — always create and switch to a non-root user
- Never use `latest` tag — pin to a specific version or digest
- Prefer Alpine or distroless base images over full Debian/Ubuntu
- Never copy `.env` files into the image — pass secrets as runtime env vars
- Scan images with `docker scout` or Trivy before pushing to production

### Layer caching optimization
Order Dockerfile instructions from least-to-most frequently changing:
1. Base image (changes rarely)
2. System dependencies (`apt-get`, `apk add`)
3. Package manager files (`package.json`, `requirements.txt`)
4. Package install (`npm ci`, `pip install`)
5. Application code (`COPY . .`) — changes most often, must be last

### .dockerignore — always include
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

### Docker Compose for local development
```yaml
services:
  app:
    build:
      context: .
      target: builder          # Use build stage, not runtime stage locally
    volumes:
      - .:/app                 # Hot reload
      - /app/node_modules      # Don't overwrite container node_modules
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
      POSTGRES_PASSWORD: dev_password   # Dev only — never production
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

### Common build failures
- `COPY` fails silently if source doesn't exist — check `.dockerignore` isn't excluding needed files
- Layer cache invalidated unexpectedly — check if a `COPY` before install steps is pulling in changed files
- Permission denied at runtime — check file ownership when using `COPY --from` with a non-root user

## Example

**User:** Write a production Dockerfile for a Python FastAPI app with multi-stage build, non-root user, and health check.

**Expected output:**
- Stage 1 (builder): `python:3.12-slim`, install dependencies with `pip install --no-cache-dir`
- Stage 2 (runtime): `python:3.12-slim`, non-root user, copy only wheels/deps from builder + app code
- `HEALTHCHECK` hitting `/healthz` endpoint
- `CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]`
- `.dockerignore` covering `__pycache__`, `.env`, `.git`, `*.pyc`

---
