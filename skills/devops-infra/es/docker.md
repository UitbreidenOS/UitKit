> 🇪🇸 Esta es la traducción en español. [Versión en inglés](../docker.md).

# Skill de Docker

## Cuándo activar
- Escribir u optimizar Dockerfiles para producción
- Configurar builds multi-etapa para reducir el tamaño de la imagen
- Escribir archivos Docker Compose para desarrollo local
- Depurar fallos de inicio de contenedores o problemas de caché de capas
- Configurar usuarios no-root, health checks y seguridad de imágenes
- Configurar .dockerignore para builds eficientes
- Escribir scripts de build o pipelines de CI/CD para builds de Docker

## Cuándo NO usar
- Manifiestos de Kubernetes (usar el skill de Kubernetes)
- Buildpacks (Heroku, Cloud Native Buildpacks) — sistema de build diferente
- Aprovisionamiento de máquinas virtuales (nivel de abstracción diferente)
- Builds reproducibles basados en Nix

## Instrucciones

### Estructura del Dockerfile de producción
Siempre usa builds multi-etapa para lenguajes compilados y Node.js:

```dockerfile
# Etapa 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Etapa 2: Runtime — imagen mínima
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

### Reglas de seguridad
- Nunca ejecutes como root en producción — siempre crea y cambia a un usuario no-root
- Nunca uses la etiqueta `latest` — fija a una versión o digest específico
- Prefiere imágenes base Alpine o distroless sobre Debian/Ubuntu completo
- Nunca copies archivos `.env` en la imagen — pasa los secretos como variables de entorno en tiempo de ejecución
- Escanea las imágenes con `docker scout` o Trivy antes de enviar a producción

### Optimización de caché de capas
Ordena las instrucciones del Dockerfile de menos a más frecuentemente cambiante:
1. Imagen base (cambia raramente)
2. Dependencias del sistema (`apt-get`, `apk add`)
3. Archivos del gestor de paquetes (`package.json`, `requirements.txt`)
4. Instalación de paquetes (`npm ci`, `pip install`)
5. Código de la aplicación (`COPY . .`) — cambia con más frecuencia, debe ser el último

### .dockerignore — siempre incluir
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

### Docker Compose para desarrollo local
```yaml
services:
  app:
    build:
      context: .
      target: builder          # Usa la etapa de build, no la de runtime, localmente
    volumes:
      - .:/app                 # Hot reload
      - /app/node_modules      # No sobreescribir node_modules del contenedor
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
      POSTGRES_PASSWORD: dev_password   # Solo dev — nunca producción
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

### Fallos comunes de build
- `COPY` falla silenciosamente si el origen no existe — verifica que `.dockerignore` no esté excluyendo archivos necesarios
- Caché de capas invalidada inesperadamente — verifica si un `COPY` antes de los pasos de instalación está incluyendo archivos cambiados
- Permiso denegado en tiempo de ejecución — verifica la propiedad de archivos al usar `COPY --from` con un usuario no-root

## Ejemplo

**Usuario:** Escribir un Dockerfile de producción para una aplicación Python FastAPI con build multi-etapa, usuario no-root y health check.

**Salida esperada:**
- Etapa 1 (builder): `python:3.12-slim`, instalar dependencias con `pip install --no-cache-dir`
- Etapa 2 (runtime): `python:3.12-slim`, usuario no-root, copiar solo wheels/deps del builder + código de la app
- `HEALTHCHECK` apuntando al endpoint `/healthz`
- `CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]`
- `.dockerignore` cubriendo `__pycache__`, `.env`, `.git`, `*.pyc`

---
