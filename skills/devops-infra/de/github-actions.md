> 🇩🇪 Dies ist die deutsche Übersetzung. [Englische Version](../github-actions.md).

# GitHub Actions Skill

## Wann aktivieren
- CI/CD-Pipelines für Tests, Linting, Build und Deployment schreiben
- Matrix-Builds über mehrere Betriebssysteme oder Sprachversionen einrichten
- Umgebungsschutzregeln und Deployment-Gates konfigurieren
- Wiederverwendbare Workflows oder zusammengesetzte Actions schreiben
- Docker-Build und Push zu einer Container-Registry einrichten
- OIDC-Authentifizierung bei Cloud-Providern konfigurieren (keine langlebigen Secrets)
- Fehlschlagende Workflows debuggen oder Workflow-Syntaxfehler verstehen
- Caching für Abhängigkeiten einrichten (npm, pip, Go-Module)

## Wann NICHT verwenden
- GitLab CI, CircleCI, Jenkins — andere Pipeline-Systeme
- Lokale Entwicklungsautomatisierung (Makefile oder Skripte verwenden)
- Cron-Jobs, die nicht an ein Repository gebunden sind (Cloud-Scheduler verwenden)

## Anweisungen

### Workflow-Dateistruktur
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

# Explizite Berechtigungen — niemals Standard write-all verwenden
permissions:
  contents: read
  pull-requests: write    # Nur wenn benötigt (z.B. Kommentare posten)

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

### Berechtigungen — immer explizit
Niemals `permissions: write-all` als Standard verwenden. Immer Mindestberechtigungen deklarieren:
```yaml
permissions:
  contents: read          # Repository lesen
  packages: write         # In GitHub Container Registry pushen
  id-token: write         # OIDC für Cloud-Auth
  pull-requests: write    # Kommentare zu PRs
```

### Secrets — OIDC über langlebige Anmeldedaten
OIDC (OpenID Connect) für Cloud-Authentifizierung verwenden — keine gespeicherten Secrets:

```yaml
# AWS OIDC — kein AWS_ACCESS_KEY_ID erforderlich
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

### Abhängigkeits-Caching
Abhängigkeiten immer cachen, um die Build-Zeit zu verkürzen:
```yaml
# Node.js
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'          # Eingebautes Caching — kein manueller Cache-Schritt erforderlich

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

### Umgebungs-Gates für Produktions-Deployments
```yaml
jobs:
  deploy-production:
    environment: production    # Referenziert GitHub Environment mit Schutzregeln
    needs: [test, build]
    runs-on: ubuntu-latest
    steps:
      - name: Deploy
        run: ./scripts/deploy.sh
```

Umgebungsschutzregeln in den GitHub-Einstellungen einrichten:
- Erforderliche Reviewer für Produktions-Deployments
- Wartezeit zwischen Staging und Produktion
- Auf spezifische Branches beschränken (nur `main`)

### Matrix-Builds
```yaml
jobs:
  test:
    strategy:
      matrix:
        node-version: [18, 20, 22]
        os: [ubuntu-latest, windows-latest]
      fail-fast: false    # Nicht alle bei erstem Fehler abbrechen
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
```

### Wiederverwendbare Workflows
```yaml
# .github/workflows/deploy.yml — wiederverwendbar
on:
  workflow_call:
    inputs:
      environment:
        required: true
        type: string
    secrets:
      deploy-token:
        required: true

# Aufrufer
jobs:
  deploy:
    uses: ./.github/workflows/deploy.yml
    with:
      environment: production
    secrets:
      deploy-token: ${{ secrets.DEPLOY_TOKEN }}
```

### Häufige Fehler
- `actions/checkout@v4` fehlt — immer als erster Schritt
- Secrets nicht zugänglich in Forks — `pull_request_target` vorsichtig verwenden (Sicherheitsrisiko)
- Cache nicht getroffen — Schlüssel muss exakt übereinstimmen; `restore-keys` als Fallback verwenden
- OIDC schlägt fehl — Trust Policy beim Cloud-Provider prüfen, ob das Repository und der Branch erlaubt sind

## Beispiel

**Benutzer:** Eine CI/CD-Pipeline für eine Node.js-App schreiben: Tests bei PRs ausführen, Docker-Image beim Merge zu main bauen und pushen, mit einem manuellen Genehmigungsgate in der Produktion deployen.

**Erwartete Ausgabe:**
- `on: push/pull_request`-Trigger
- `test`-Job: checkout, setup-node mit Cache, `npm ci`, `npm test`
- `build`-Job (beim Push zu main, benötigt test): Docker-Build + Push zu GHCR mit OIDC
- `deploy`-Job: `environment: production` (erfordert Genehmigung), ruft Deploy-Skript auf
- Expliziter `permissions:`-Block — Mindestanforderungen
- Keine hartcodierten Secrets — OIDC für Registry-Auth

---
