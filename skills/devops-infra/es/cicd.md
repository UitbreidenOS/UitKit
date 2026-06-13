---
name: cicd
description: "CI/CD patterns: GitHub Actions workflows, secrets management, deployment gates, matrix builds, caching, reusable workflows, rollbacks"
---

> 🇪🇸 Versión en español. [Versión en inglés](../cicd.md).

# Skill CI/CD

## Cuándo activar
- Escribir o depurar workflows de GitHub Actions
- Configurar pipelines de despliegue (compuertas staging → producción)
- Optimizar la velocidad de CI (caching, matrix builds, concurrencia)
- Gestionar secrets y configuración específica por entorno
- Crear plantillas de workflows reutilizables para un equipo
- Configurar estrategias de rollback para despliegues fallidos

## Cuándo NO usar
- GitLab CI / CircleCI / Jenkins — sintaxis diferente (los conceptos aplican, la sintaxis difiere)
- Aprovisionamiento de infraestructura — usar el skill de Terraform
- Orquestación de contenedores — usar el skill de Kubernetes

## Instrucciones

### Pipeline CI estándar

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true  # cancelar ejecuciones anteriores en la misma rama

jobs:
  test:
    name: Test
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_DB: testdb
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 5s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Instalar dependencias
        run: npm ci

      - name: Ejecutar migraciones
        run: npm run db:migrate
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/testdb

      - name: Ejecutar tests
        run: npm test -- --coverage
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/testdb

      - name: Subir cobertura
        uses: codecov/codecov-action@v4
        if: always()
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
```

### Matrix builds — probar en múltiples versiones

```yaml
jobs:
  test:
    strategy:
      fail-fast: false    # continuar con otras versiones si una falla
      matrix:
        node: [20, 22]
        os: [ubuntu-latest, macos-latest]
    runs-on: ${{ matrix.os }}
    name: Test on Node ${{ matrix.node }} / ${{ matrix.os }}
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
```

### Caching de dependencias

```yaml
# Node.js
- uses: actions/setup-node@v4
  with:
    node-version: 22
    cache: npm           # cachea ~/.npm basado en el hash de package-lock.json

# Python
- uses: actions/setup-python@v5
  with:
    python-version: '3.12'
    cache: pip           # cachea ~/.cache/pip basado en el hash de requirements

# Cache personalizado (capas Docker, artefactos de build)
- uses: actions/cache@v4
  with:
    path: |
      ~/.cache/turbo
      .next/cache
    key: ${{ runner.os }}-turbo-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-turbo-
```

### Pipeline de despliegue con compuertas

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    uses: ./.github/workflows/ci.yml   # reutilizar el workflow CI

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    environment: staging               # requiere aprobación manual si está configurado
    steps:
      - uses: actions/checkout@v4
      - name: Desplegar en staging
        run: ./scripts/deploy.sh staging
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}

  smoke-test:
    needs: deploy-staging
    runs-on: ubuntu-latest
    steps:
      - name: Ejecutar smoke tests contra staging
        run: |
          curl -sf https://staging.myapp.com/health || exit 1
          curl -sf https://staging.myapp.com/api/version | grep '"version"' || exit 1

  deploy-production:
    needs: smoke-test
    runs-on: ubuntu-latest
    environment: production            # requiere aprobación manual en GitHub
    steps:
      - uses: actions/checkout@v4
      - name: Desplegar en producción
        run: ./scripts/deploy.sh production
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

### Secrets y entornos

```yaml
# Acceder a secrets
steps:
  - name: Deploy
    env:
      API_KEY: ${{ secrets.API_KEY }}                      # secret del repositorio
      DB_URL: ${{ secrets.DATABASE_URL }}                  # secret de entorno
      APP_ENV: ${{ vars.APP_ENV }}                         # variable (no secret)
    run: ./deploy.sh
```

**Reglas de gestión de secrets:**
- Nunca registrar secrets en logs: usar `::add-mask::` para secrets generados dinámicamente
- Usar secrets de entorno para valores específicos por entorno (staging vs prod)
- Rotar secrets regularmente — almacenar fechas de rotación como comentarios en la UI de secrets
- Nunca hacer commit de secrets; usar `git secret` o `sops` para archivos de secrets cifrados

```yaml
# Enmascarar dinámicamente un valor generado
- name: Obtener token
  run: |
    TOKEN=$(generate-token)
    echo "::add-mask::$TOKEN"        # enmascara TOKEN en todos los logs posteriores
    echo "token=$TOKEN" >> $GITHUB_OUTPUT
```

### Build y push de Docker

```yaml
- name: Configurar Docker Buildx
  uses: docker/setup-buildx-action@v3

- name: Iniciar sesión en el registro
  uses: docker/login-action@v3
  with:
    registry: ghcr.io
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}

- name: Build y push
  uses: docker/build-push-action@v6
  with:
    context: .
    push: ${{ github.ref == 'refs/heads/main' }}
    tags: |
      ghcr.io/${{ github.repository }}:latest
      ghcr.io/${{ github.repository }}:${{ github.sha }}
    cache-from: type=gha
    cache-to: type=gha,mode=max
```

### Workflows reutilizables

```yaml
# .github/workflows/reusable-deploy.yml
name: Reusable Deploy

on:
  workflow_call:
    inputs:
      environment:
        required: true
        type: string
      image-tag:
        required: true
        type: string
    secrets:
      FLY_API_TOKEN:
        required: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: ${{ inputs.environment }}
    steps:
      - name: Deploy ${{ inputs.image-tag }} to ${{ inputs.environment }}
        run: flyctl deploy --image ghcr.io/myapp:${{ inputs.image-tag }}
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

```yaml
# .github/workflows/deploy.yml — llamar al workflow reutilizable
jobs:
  deploy-staging:
    uses: ./.github/workflows/reusable-deploy.yml
    with:
      environment: staging
      image-tag: ${{ github.sha }}
    secrets:
      FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

### Estrategia de rollback

```yaml
# Workflow de rollback manual
name: Rollback

on:
  workflow_dispatch:
    inputs:
      commit-sha:
        description: 'SHA de Git al que volver'
        required: true

jobs:
  rollback:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ inputs.commit-sha }}

      - name: Desplegar versión anterior
        run: |
          IMAGE_TAG=${{ inputs.commit-sha }}
          flyctl deploy --image ghcr.io/myapp:$IMAGE_TAG
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}

      - name: Crear etiqueta de rollback
        run: |
          git tag "rollback-$(date +%Y%m%d-%H%M%S)" ${{ inputs.commit-sha }}
          git push origin --tags
```

### Notificación en caso de fallo

```yaml
  - name: Notificar a Slack en caso de fallo
    if: failure()
    uses: slackapi/slack-github-action@v1
    with:
      payload: |
        {
          "text": "❌ Deploy failed on ${{ github.ref_name }} by ${{ github.actor }}",
          "blocks": [{
            "type": "section",
            "text": { "type": "mrkdwn",
              "text": "❌ *Deploy failed*\nBranch: `${{ github.ref_name }}`\nActor: ${{ github.actor }}\n<${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}|View logs>"
            }
          }]
        }
    env:
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

## Ejemplo

**Usuario:** Configurar un pipeline CI/CD completo para una app Next.js: probar en PR, construir imagen Docker, desplegar en staging automáticamente, requerir aprobación manual para producción, con notificación de Slack en caso de fallo.

**Resultado esperado:**
- `.github/workflows/ci.yml` — lint, verificación de tipos, tests con servicio postgres
- `.github/workflows/deploy.yml` — build+push de imagen, despliegue staging, smoke test, compuerta manual, despliegue prod
- `.github/workflows/rollback.yml` — trigger manual con entrada de SHA
- Entornos de GitHub: `staging` (automático), `production` (requiere aprobación)

---
