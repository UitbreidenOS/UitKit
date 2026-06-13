---
name: cicd
description: "CI/CD patterns: GitHub Actions workflows, secrets management, deployment gates, matrix builds, caching, reusable workflows, rollbacks"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../cicd.md).

# CI/CD Skill

## Wanneer activeren
- Schrijven of debuggen van GitHub Actions workflows
- Opzetten van deployment pipelines (staging → productie gates)
- Optimaliseren van CI-snelheid (caching, matrix builds, gelijktijdigheid)
- Beheren van secrets en omgevingsspecifieke configuratie
- Bouwen van herbruikbare workflow-sjablonen voor een team
- Opzetten van rollback-strategieën voor mislukte deployments

## Wanneer NIET gebruiken
- GitLab CI / CircleCI / Jenkins — andere syntaxis (concepten gelden, syntaxis verschilt)
- Infrastructuurprovisioning — gebruik de Terraform skill
- Container-orkestratie — gebruik de Kubernetes skill

## Instructies

### Standaard CI-pipeline

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
  cancel-in-progress: true  # oudere uitvoeringen op dezelfde branch annuleren

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

      - name: Afhankelijkheden installeren
        run: npm ci

      - name: Migraties uitvoeren
        run: npm run db:migrate
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/testdb

      - name: Tests uitvoeren
        run: npm test -- --coverage
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/testdb

      - name: Coverage uploaden
        uses: codecov/codecov-action@v4
        if: always()
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
```

### Matrix builds — testen op meerdere versies

```yaml
jobs:
  test:
    strategy:
      fail-fast: false    # andere versies voortzetten als één mislukt
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

### Afhankelijkheden cachen

```yaml
# Node.js
- uses: actions/setup-node@v4
  with:
    node-version: 22
    cache: npm           # cached ~/.npm op basis van package-lock.json hash

# Python
- uses: actions/setup-python@v5
  with:
    python-version: '3.12'
    cache: pip           # cached ~/.cache/pip op basis van requirements hash

# Aangepaste cache (Docker-lagen, build-artefacten)
- uses: actions/cache@v4
  with:
    path: |
      ~/.cache/turbo
      .next/cache
    key: ${{ runner.os }}-turbo-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-turbo-
```

### Deployment-pipeline met gates

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    uses: ./.github/workflows/ci.yml   # CI-workflow hergebruiken

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    environment: staging               # vereist handmatige goedkeuring indien geconfigureerd
    steps:
      - uses: actions/checkout@v4
      - name: Deployen naar staging
        run: ./scripts/deploy.sh staging
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}

  smoke-test:
    needs: deploy-staging
    runs-on: ubuntu-latest
    steps:
      - name: Smoke tests uitvoeren tegen staging
        run: |
          curl -sf https://staging.myapp.com/health || exit 1
          curl -sf https://staging.myapp.com/api/version | grep '"version"' || exit 1

  deploy-production:
    needs: smoke-test
    runs-on: ubuntu-latest
    environment: production            # vereist handmatige goedkeuring in GitHub
    steps:
      - uses: actions/checkout@v4
      - name: Deployen naar productie
        run: ./scripts/deploy.sh production
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

### Secrets en omgevingen

```yaml
# Secrets openen
steps:
  - name: Deploy
    env:
      API_KEY: ${{ secrets.API_KEY }}                      # repository secret
      DB_URL: ${{ secrets.DATABASE_URL }}                  # omgevings-secret
      APP_ENV: ${{ vars.APP_ENV }}                         # variabele (geen secret)
    run: ./deploy.sh
```

**Regels voor secret-beheer:**
- Nooit secrets loggen: gebruik `::add-mask::` voor dynamisch gegenereerde secrets
- Gebruik omgevings-secrets voor omgevingsspecifieke waarden (staging vs prod)
- Roteer secrets regelmatig — sla rotatiedatums op als commentaar in de secrets-UI
- Commit nooit secrets; gebruik `git secret` of `sops` voor versleutelde secretbestanden

```yaml
# Dynamisch een gegenereerde waarde maskeren
- name: Token ophalen
  run: |
    TOKEN=$(generate-token)
    echo "::add-mask::$TOKEN"        # maskeert TOKEN in alle volgende logs
    echo "token=$TOKEN" >> $GITHUB_OUTPUT
```

### Docker build en push

```yaml
- name: Docker Buildx instellen
  uses: docker/setup-buildx-action@v3

- name: Inloggen op registry
  uses: docker/login-action@v3
  with:
    registry: ghcr.io
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}

- name: Bouwen en pushen
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

### Herbruikbare workflows

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
# .github/workflows/deploy.yml — de herbruikbare workflow aanroepen
jobs:
  deploy-staging:
    uses: ./.github/workflows/reusable-deploy.yml
    with:
      environment: staging
      image-tag: ${{ github.sha }}
    secrets:
      FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

### Rollback-strategie

```yaml
# Handmatige rollback-workflow
name: Rollback

on:
  workflow_dispatch:
    inputs:
      commit-sha:
        description: 'Git SHA om naar terug te rollen'
        required: true

jobs:
  rollback:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ inputs.commit-sha }}

      - name: Vorige versie deployen
        run: |
          IMAGE_TAG=${{ inputs.commit-sha }}
          flyctl deploy --image ghcr.io/myapp:$IMAGE_TAG
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}

      - name: Rollback-tag aanmaken
        run: |
          git tag "rollback-$(date +%Y%m%d-%H%M%S)" ${{ inputs.commit-sha }}
          git push origin --tags
```

### Melding bij mislukking

```yaml
  - name: Slack melden bij mislukking
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

## Voorbeeld

**Gebruiker:** Een volledige CI/CD-pipeline opzetten voor een Next.js-app: testen bij PR, Docker-image bouwen, automatisch deployen naar staging, handmatige goedkeuring vereisen voor productie, met Slack-melding bij mislukking.

**Verwachte uitvoer:**
- `.github/workflows/ci.yml` — lint, typecontrole, tests met postgres-service
- `.github/workflows/deploy.yml` — image bouwen+pushen, staging deployen, smoke test, handmatig gate, prod deployen
- `.github/workflows/rollback.yml` — handmatige trigger met SHA-invoer
- GitHub-omgevingen: `staging` (automatisch), `production` (vereist goedkeuring)

---
