> 🇪🇸 Esta es la traducción en español. [Versión en inglés](../github-actions.md).

# Skill de GitHub Actions

## Cuándo activar
- Escribir pipelines de CI/CD para test, lint, build y deploy
- Configurar builds en matrix para múltiples SO o versiones de lenguaje
- Configurar reglas de protección de entornos y puertas de despliegue
- Escribir workflows reutilizables o acciones compuestas
- Configurar build y push de Docker a un registro de contenedores
- Configurar autenticación OIDC a proveedores cloud (sin secretos de larga duración)
- Depurar workflows fallidos o entender errores de sintaxis de workflow
- Configurar caché para dependencias (npm, pip, módulos de Go)

## Cuándo NO usar
- GitLab CI, CircleCI, Jenkins — sistemas de pipeline diferentes
- Automatización de desarrollo local (usar Makefile o scripts)
- Cron jobs que no están vinculados a un repositorio (usar cloud scheduler)

## Instrucciones

### Estructura del archivo de workflow
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

# Permisos explícitos — nunca usar write-all por defecto
permissions:
  contents: read
  pull-requests: write    # Solo si es necesario (p.ej., publicar comentarios)

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm test
```

### Permisos — siempre explícitos
Nunca uses `permissions: write-all` por defecto. Siempre declara los permisos mínimos requeridos:
```yaml
permissions:
  contents: read          # Leer el repo
  packages: write         # Push a GitHub Container Registry
  id-token: write         # OIDC para autenticación cloud
  pull-requests: write    # Comentar en PRs
```

### Secretos — OIDC sobre credenciales de larga duración
Usa OIDC (OpenID Connect) para autenticación cloud — sin secretos almacenados:

```yaml
# AWS OIDC — no se necesita AWS_ACCESS_KEY_ID
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: arn:aws:iam::123456789:role/github-actions-role
    aws-region: eu-west-1

# GCP OIDC
- name: Authenticate to GCP
  uses: google-github-actions/auth@v2
  with:
    workload_identity_provider: projects/123/locations/global/workloadIdentityPools/pool/providers/github
    service_account: deploy@project.iam.gserviceaccount.com
```

### Caché de dependencias
Siempre cachea las dependencias para reducir el tiempo de build:
```yaml
# Node.js
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'          # Caché integrado — no se necesita paso de caché manual

# Python
- uses: actions/setup-python@v5
  with:
    python-version: '3.12'
    cache: 'pip'

# Go
- uses: actions/setup-go@v5
  with:
    go-version: '1.22'
    cache: true
```

### Puertas de entorno para despliegues de producción
```yaml
jobs:
  deploy-production:
    environment: production    # Referencia al Entorno de GitHub con reglas de protección
    needs: [test, build]
    runs-on: ubuntu-latest
    steps:
      - name: Deploy
        run: ./scripts/deploy.sh
```

Configura las reglas de protección de entornos en los ajustes de GitHub:
- Revisores requeridos para despliegues de producción
- Temporizador de espera entre staging y producción
- Restringir a ramas específicas (solo `main`)

### Builds en matrix
```yaml
jobs:
  test:
    strategy:
      matrix:
        node-version: [18, 20, 22]
        os: [ubuntu-latest, windows-latest]
      fail-fast: false    # No cancelar todo ante el primer fallo
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
```

### Workflows reutilizables
```yaml
# .github/workflows/deploy.yml — reutilizable
on:
  workflow_call:
    inputs:
      environment:
        required: true
        type: string
    secrets:
      deploy-token:
        required: true

# Llamador
jobs:
  deploy:
    uses: ./.github/workflows/deploy.yml
    with:
      environment: production
    secrets:
      deploy-token: ${{ secrets.DEPLOY_TOKEN }}
```

### Fallos comunes
- `actions/checkout@v4` faltante — siempre debe ser el primer paso
- Los secretos no son accesibles en forks — usa `pull_request_target` con cuidado (riesgo de seguridad)
- La caché no se utiliza — la clave debe coincidir exactamente; usa `restore-keys` como alternativa
- OIDC falla — verifica que la política de confianza en el proveedor cloud permita el repositorio y la rama

## Ejemplo

**Usuario:** Escribir un pipeline de CI/CD para una aplicación Node.js: ejecutar tests en PRs, construir y enviar imagen Docker al hacer merge en main, desplegar a producción con una puerta de aprobación manual.

**Salida esperada:**
- Triggers `on: push/pull_request`
- Job `test`: checkout, setup-node con caché, `npm ci`, `npm test`
- Job `build` (en push a main, necesita test): build + push de Docker a GHCR usando OIDC
- Job `deploy`: `environment: production` (requiere aprobación), llama al script de deploy
- Bloque `permissions:` explícito — mínimo requerido
- Sin secretos hardcodeados — OIDC para autenticación del registro

---
