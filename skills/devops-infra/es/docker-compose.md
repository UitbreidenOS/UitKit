---
name: docker-compose
description: "Docker Compose for local dev: multi-service stacks, volumes, networking, health checks, env vars, production-like local environments"
---

> 🇪🇸 Versión en español. [Versión en inglés](../docker-compose.md).

# Habilidad Docker Compose

## Cuándo activar
- Configurar un entorno de desarrollo local con múltiples servicios (app + BD + Redis + etc.)
- Escribir o depurar un `docker-compose.yml` o `compose.yaml`
- Hacer que los servicios locales coincidan con producción (misma versión de BD, mismas variables de entorno)
- Agregar health checks, orden `depends_on` o montajes de volúmenes
- Ejecutar pruebas de integración contra servicios reales en local

## Cuándo NO usar
- Despliegues en producción — usar Kubernetes, ECS o Fly.io
- Apps de un solo contenedor — usar `docker run` directamente
- Contenedores de servicios en pipelines CI/CD — usar definiciones de servicios CI nativas

## Instrucciones

### Archivo compose estándar para stack de desarrollo

```yaml
# compose.yaml (Docker Compose v2 — nombre de archivo preferido)
name: myapp

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
      target: dev                    # usar un stage dev con hot reload
    ports:
      - "3000:3000"
    volumes:
      - .:/app                       # montar source para hot reload
      - /app/node_modules            # excluir node_modules del montaje
    environment:
      NODE_ENV: development
      DATABASE_URL: postgresql://postgres:postgres@db:5432/myapp
      REDIS_URL: redis://redis:6379
    depends_on:
      db:
        condition: service_healthy   # esperar a que la BD esté lista
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
      - "5432:5432"                  # exponer para acceso del cliente BD
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql  # inicializar en el primer arranque
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
    command: redis-server --appendonly yes  # persistir datos

  mailpit:                           # captura de correo local (no se envían correos reales)
    image: axllent/mailpit
    ports:
      - "8025:8025"                  # interfaz web
      - "1025:1025"                  # SMTP
    environment:
      SMTP_AUTH_ACCEPT_ANY: true

volumes:
  postgres_data:
  redis_data:
```

### Comandos

```bash
# Iniciar todos los servicios (en segundo plano)
docker compose up -d

# Iniciar con logs
docker compose up

# Reconstruir imágenes e iniciar
docker compose up -d --build

# Detener todos los servicios (conservar volúmenes)
docker compose stop

# Detener y eliminar contenedores + redes
docker compose down

# Detener y eliminar todo incluyendo volúmenes
docker compose down -v

# Ver logs
docker compose logs -f              # todos los servicios
docker compose logs -f app          # servicio específico

# Ejecutar un comando dentro de un contenedor en ejecución
docker compose exec app bash
docker compose exec db psql -U postgres myapp

# Ejecutar un comando puntual (nuevo contenedor)
docker compose run --rm app npm run migrate

# Escalar un servicio
docker compose up -d --scale worker=3
```

### Gestión de variables de entorno

```yaml
# compose.yaml — varias formas de pasar variables de entorno
services:
  app:
    # Opción 1: en línea (malo para secrets)
    environment:
      NODE_ENV: development

    # Opción 2: desde archivo .env (por defecto: .env en la raíz del proyecto)
    env_file:
      - .env
      - .env.local          # sobreescribe .env

    # Opción 3: referenciar variables de entorno del host
    environment:
      API_KEY: ${API_KEY}   # lee del entorno del shell
```

```bash
# .env (versionado — valores por defecto no secretos)
DATABASE_URL=postgresql://postgres:postgres@db:5432/myapp
REDIS_URL=redis://redis:6379
NODE_ENV=development

# .env.local (ignorado por git — secrets y sobreescrituras personales)
API_KEY=sk-real-key
STRIPE_SECRET_KEY=sk_test_xxx
```

### Redes entre servicios

Los servicios en el mismo proyecto Compose se comunican usando **nombres de servicio como nombres de host**:

```yaml
services:
  app:
    environment:
      # Usar el nombre de servicio 'db', no 'localhost'
      DATABASE_URL: postgresql://postgres:postgres@db:5432/myapp
      #                                                  ^^
  db:
    image: postgres:16-alpine
```

```yaml
# Red personalizada para aislamiento
services:
  frontend:
    networks: [public, internal]

  api:
    networks: [internal]

  db:
    networks: [internal]     # no accesible directamente desde el frontend

networks:
  public:
  internal:
    internal: true           # sin acceso externo
```

### Dockerfile multi-stage para paridad dev/prod

```dockerfile
# Dockerfile
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./

# Stage de desarrollo — incluye devDependencies, hot reload
FROM base AS dev
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]

# Stage de build
FROM base AS build
RUN npm ci
COPY . .
RUN npm run build

# Stage de producción — imagen mínima
FROM node:22-alpine AS prod
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

```yaml
# compose.yaml — usar stage dev en local
services:
  app:
    build:
      context: .
      target: dev

# compose.prod.yaml — usar stage prod
services:
  app:
    build:
      context: .
      target: prod
```

### Health checks y orden de inicio

```yaml
services:
  app:
    depends_on:
      db:
        condition: service_healthy     # esperar health check de la BD
      migrate:
        condition: service_completed_successfully  # esperar migraciones

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
    restart: "no"           # ejecutar una vez y salir
```

### Patrones útiles

**Servicios opcionales por perfil:**
```yaml
services:
  app:
    image: myapp

  pgadmin:
    image: dpage/pgadmin4
    profiles: [tools]        # solo inicia con: docker compose --profile tools up
    ports:
      - "5050:80"
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@example.com
      PGADMIN_DEFAULT_PASSWORD: admin
```

**Bind mount para archivos de configuración:**
```yaml
services:
  nginx:
    image: nginx:alpine
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro  # :ro = solo lectura
    ports:
      - "80:80"
```

**Ejecutar migraciones de BD al iniciar:**
```yaml
services:
  app:
    command: >
      sh -c "npm run migrate && npm run dev"
    depends_on:
      db:
        condition: service_healthy
```

## Ejemplo

**Usuario:** Configurar un entorno de desarrollo local para una app FastAPI con PostgreSQL, Redis, worker Celery y un frontend React — todo coincidiendo con la configuración de producción.

**Salida esperada:**
```yaml
services:
  api:        # FastAPI con uvicorn --reload
  worker:     # Worker Celery (misma imagen que api, distinto comando)
  frontend:   # React con servidor de desarrollo vite
  db:         # postgres:16, healthcheck, volume
  redis:      # redis:7, appendonly
  flower:     # UI de monitoreo Celery, perfil: tools
```

---
