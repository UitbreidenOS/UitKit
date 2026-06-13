> 🇳🇱 Dit is de Nederlandse vertaling. [Engelse versie](../github-actions.md).

# GitHub Actions Skill

## Wanneer te activeren
- CI/CD-pipelines schrijven voor testen, linting, bouwen en deployen
- Matrix-builds instellen voor meerdere besturingssystemen of taalversies
- Omgevingsbeschermingsregels en deployment-gates configureren
- Herbruikbare workflows of composite actions schrijven
- Docker build instellen en naar een containerregister pushen
- OIDC-authenticatie naar cloudproviders configureren (geen langlevende secrets)
- Falende workflows debuggen of workflowsyntaxfouten begrijpen
- Caching instellen voor afhankelijkheden (npm, pip, Go modules)

## Wanneer NIET te gebruiken
- GitLab CI, CircleCI, Jenkins — andere pipeline-systemen
- Lokale ontwikkelingsautomatisering (gebruik Makefile of scripts)
- Cron-jobs die niet aan een repository zijn gekoppeld (gebruik cloud scheduler)

## Instructies

### Workflow-bestandsstructuur
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

# Expliciete rechten — gebruik nooit de standaard write-all
permissions:
  contents: read
  pull-requests: write    # Alleen als nodig (bijv. voor het plaatsen van opmerkingen)

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

### Rechten — altijd expliciet
Gebruik nooit de standaard `permissions: write-all`. Declareer altijd minimaal vereiste rechten:
```yaml
permissions:
  contents: read          # Repository lezen
  packages: write         # Pushen naar GitHub Container Registry
  id-token: write         # OIDC voor cloud-authenticatie
  pull-requests: write    # Opmerkingen op PR's plaatsen
```

### Secrets — OIDC boven langlevende credentials
Gebruik OIDC (OpenID Connect) voor cloud-authenticatie — geen opgeslagen secrets:

```yaml
# AWS OIDC — geen AWS_ACCESS_KEY_ID nodig
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

### Afhankelijkheidscaching
Cache altijd afhankelijkheden om bouwtijd te verkorten:
```yaml
# Node.js
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'          # Ingebouwde cache — geen handmatige cache-stap nodig

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

### Omgevingsgates voor productie-deployments
```yaml
jobs:
  deploy-production:
    environment: production    # Verwijst naar GitHub Environment met beschermingsregels
    needs: [test, build]
    runs-on: ubuntu-latest
    steps:
      - name: Deploy
        run: ./scripts/deploy.sh
```

Stel omgevingsbeschermingsregels in via GitHub-instellingen:
- Vereiste reviewers voor productie-deployments
- Wachttimer tussen staging en productie
- Beperken tot specifieke branches (alleen `main`)

### Matrix-builds
```yaml
jobs:
  test:
    strategy:
      matrix:
        node-version: [18, 20, 22]
        os: [ubuntu-latest, windows-latest]
      fail-fast: false    # Niet alles annuleren bij eerste fout
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
```

### Herbruikbare workflows
```yaml
# .github/workflows/deploy.yml — herbruikbaar
on:
  workflow_call:
    inputs:
      environment:
        required: true
        type: string
    secrets:
      deploy-token:
        required: true

# Aanroeper
jobs:
  deploy:
    uses: ./.github/workflows/deploy.yml
    with:
      environment: production
    secrets:
      deploy-token: ${{ secrets.DEPLOY_TOKEN }}
```

### Veelvoorkomende fouten
- `actions/checkout@v4` ontbreekt — altijd de eerste stap
- Secrets niet toegankelijk in forks — gebruik `pull_request_target` voorzichtig (beveiligingsrisico)
- Cache niet getroffen — sleutel moet exact overeenkomen; gebruik `restore-keys` als fallback
- OIDC mislukt — controleer vertrouwensbeleid aan de cloudprovider-kant dat de repo en branch toestaat

## Voorbeeld

**Gebruiker:** Schrijf een CI/CD-pipeline voor een Node.js-app: voer tests uit op PR's, bouw en push Docker image bij merge naar main, deploy naar productie met een handmatige goedkeuringsgate.

**Verwachte output:**
- `on: push/pull_request`-triggers
- `test`-job: checkout, setup-node met cache, `npm ci`, `npm test`
- `build`-job (bij push naar main, heeft test nodig): Docker build + push naar GHCR via OIDC
- `deploy`-job: `environment: production` (vereist goedkeuring), roept deploy-script aan
- Expliciet `permissions:`-blok — minimaal vereist
- Geen hardcoded secrets — OIDC voor registry-authenticatie

---
