---
name: railway
description: "Railway deployment: Dockerfile deploys, managed Postgres/Redis, environment variables, PR preview environments, custom domains, CLI workflow"
---

> 🇪🇸 Versión en español. [Versión en inglés](../railway.md).

# Habilidad Railway

## Cuándo activar
- Desplegar una app de Node.js, Python, Go o cualquier app basada en Dockerfile en Railway
- Configurar PostgreSQL o Redis gestionado en Railway
- Configurar variables de entorno y secretos para servicios de Railway
- Crear entornos de vista previa que se despliegan automáticamente en una PR
- Configurar un dominio personalizado con SSL automático
- Usar el CLI de Railway para paridad con el desarrollo local

## Cuándo NO usar
- Infraestructura basada en Kubernetes a gran escala — usar EKS/GKE
- Apps que requieren instancias GPU dedicadas — usar Lambda Labs o RunPod
- Cargas de trabajo sensibles al cumplimiento normativo que requieren regiones específicas — verificar la disponibilidad de regiones de Railway

## Por qué Railway para vibe coding

Railway es el camino más rápido del código local al servicio de producción en ejecución. Detecta tu runtime automáticamente, provisiona bases de datos con un clic e inyecta credenciales como variables de entorno. Por eso la investigación identifica Railway como óptimo para bases de código generadas por IA — el agente puede empujar un commit y tener una URL en vivo en menos de 2 minutos.

## Instrucciones

### Despliegue inicial

```bash
# Instalar el CLI de Railway
npm install -g @railway/cli

# Iniciar sesión
railway login

# Crear un nuevo proyecto desde el directorio actual
railway init

# Desplegar
railway up

# Abrir el servicio desplegado
railway open
```

### Despliegue con Dockerfile (recomendado para producción)

Railway detecta los Dockerfiles automáticamente. Mantén el tuyo minimal:

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
// railway.json — archivo de configuración de Railway
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

### Añadir bases de datos gestionadas

```bash
# Via CLI
railway add postgres   # añade el servicio PostgreSQL
railway add redis      # añade el servicio Redis

# Railway inyecta automáticamente estas variables:
# DATABASE_URL       — cadena de conexión PostgreSQL
# REDIS_URL          — cadena de conexión Redis
```

En tu app, usa directamente las variables inyectadas por Railway:

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

### Variables de entorno

```bash
# Establecer via CLI
railway variables set API_KEY=secret123
railway variables set NODE_ENV=production

# Establecer desde archivo .env
railway variables set --kv-file .env.production

# Ver variables actuales
railway variables

# Referenciar la variable de otro servicio (configuración compartida)
# En el panel de Railway: sintaxis de referencia de variable
# DATABASE_URL = ${{postgres.DATABASE_URL}}
```

### Vinculación de servicios (compartir variables entre servicios)

```bash
# Referenciar variables de otro servicio en el mismo proyecto
# En el panel de Railway → Servicio → Variables → Añadir referencia
# O en railway.toml:
```

```toml
# railway.toml
[variables]
DATABASE_URL = "${{Postgres.DATABASE_URL}}"
REDIS_URL = "${{Redis.REDIS_URL}}"
```

### Integración con GitHub Actions

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

### Entornos de vista previa de PR

Railway admite entornos de vista previa automáticos por PR mediante la integración con GitHub:

1. Panel de Railway → Proyecto → Configuración → GitHub → Activar despliegues de PR
2. Cada PR obtiene una URL única: `https://my-app-pr-{number}.railway.app`
3. Se elimina automáticamente cuando se cierra la PR

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
        run: sleep 30  # Railway necesita tiempo para desplegar

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

### Dominios personalizados y SSL

```bash
# Añadir dominio personalizado via CLI
railway domain add app.mycompany.com

# Railway proporciona:
# - SSL automático de Let's Encrypt
# - Registro CNAME para añadir a tu DNS
# - Renovación automática
```

### Comandos CLI útiles

```bash
railway status          # estado del despliegue actual
railway logs            # transmitir logs del despliegue activo
railway logs --tail 100 # últimas 100 líneas de logs
railway shell           # SSH en el contenedor en ejecución
railway run npm migrate # ejecutar un comando en el entorno de Railway
railway up --detach     # desplegar sin esperar a que termine
railway down            # detener el despliegue actual
railway env             # mostrar las variables de entorno inyectadas
```

### Despliegue en monorepo

```toml
# railway.toml — desplegar un servicio específico desde un monorepo
[build]
builder = "DOCKERFILE"
dockerfilePath = "apps/api/Dockerfile"
buildContext = "."

[deploy]
startCommand = "node apps/api/dist/main.js"
```

```bash
# Desplegar solo el servicio api
railway up --service api
```

## Ejemplo

**Usuario:** Desplegar una app FastAPI con Postgres y Redis en Railway — configurar GitHub Actions para despliegue automático en main, entornos de vista previa para PRs y un endpoint de health check.

**Resultado esperado:**
- `Dockerfile` — python:3.12-slim, uvicorn en `0.0.0.0:8000`
- `railway.json` — healthcheckPath `/health`, reinicio en caso de fallo
- `app/routers/health.py` — `GET /health` devuelve `{"status": "ok", "db": "connected"}`
- `.github/workflows/deploy.yml` — `railway up --detach` al push en main
- Pasos en el panel de Railway: añadir Postgres, añadir Redis, activar despliegues de PR

---
