---
name: cicd
description: "CI/CD patterns: GitHub Actions workflows, secrets management, deployment gates, matrix builds, caching, reusable workflows, rollbacks"
---

> 🇩🇪 Deutsche Version. [Englische Version](../cicd.md).

# CI/CD Skill

## Wann aktivieren
- Schreiben oder Debuggen von GitHub Actions Workflows
- Einrichten von Deployment-Pipelines (Staging → Produktions-Gates)
- Optimierung der CI-Geschwindigkeit (Caching, Matrix-Builds, Parallelität)
- Verwaltung von Secrets und umgebungsspezifischer Konfiguration
- Erstellen wiederverwendbarer Workflow-Vorlagen für ein Team
- Einrichten von Rollback-Strategien für fehlgeschlagene Deployments

## Wann NICHT verwenden
- GitLab CI / CircleCI / Jenkins — andere Syntax (Konzepte gelten, Syntax unterscheidet sich)
- Infrastruktur-Provisionierung — Terraform Skill verwenden
- Container-Orchestrierung — Kubernetes Skill verwenden

## Anweisungen

### Standard CI-Pipeline

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
  cancel-in-progress: true  # ältere Ausführungen auf demselben Branch abbrechen

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

      - name: Abhängigkeiten installieren
        run: npm ci

      - name: Migrationen ausführen
        run: npm run db:migrate
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/testdb

      - name: Tests ausführen
        run: npm test -- --coverage
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/testdb

      - name: Coverage hochladen
        uses: codecov/codecov-action@v4
        if: always()
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
```

### Matrix-Builds — über mehrere Versionen testen

```yaml
jobs:
  test:
    strategy:
      fail-fast: false    # andere Versionen fortsetzen, wenn eine fehlschlägt
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

### Abhängigkeits-Caching

```yaml
# Node.js
- uses: actions/setup-node@v4
  with:
    node-version: 22
    cache: npm           # cached ~/.npm basierend auf package-lock.json Hash

# Python
- uses: actions/setup-python@v5
  with:
    python-version: '3.12'
    cache: pip           # cached ~/.cache/pip basierend auf Requirements-Hash

# Benutzerdefinierter Cache (Docker-Layer, Build-Artefakte)
- uses: actions/cache@v4
  with:
    path: |
      ~/.cache/turbo
      .next/cache
    key: ${{ runner.os }}-turbo-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-turbo-
```

### Deployment-Pipeline mit Gates

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    uses: ./.github/workflows/ci.yml   # CI-Workflow wiederverwenden

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    environment: staging               # erfordert manuelle Genehmigung, wenn konfiguriert
    steps:
      - uses: actions/checkout@v4
      - name: In Staging deployen
        run: ./scripts/deploy.sh staging
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}

  smoke-test:
    needs: deploy-staging
    runs-on: ubuntu-latest
    steps:
      - name: Smoke-Tests gegen Staging ausführen
        run: |
          curl -sf https://staging.myapp.com/health || exit 1
          curl -sf https://staging.myapp.com/api/version | grep '"version"' || exit 1

  deploy-production:
    needs: smoke-test
    runs-on: ubuntu-latest
    environment: production            # erfordert manuelle Genehmigung in GitHub
    steps:
      - uses: actions/checkout@v4
      - name: In Produktion deployen
        run: ./scripts/deploy.sh production
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

### Secrets und Umgebungen

```yaml
# Auf Secrets zugreifen
steps:
  - name: Deploy
    env:
      API_KEY: ${{ secrets.API_KEY }}                      # Repository-Secret
      DB_URL: ${{ secrets.DATABASE_URL }}                  # Umgebungs-Secret
      APP_ENV: ${{ vars.APP_ENV }}                         # Variable (kein Secret)
    run: ./deploy.sh
```

**Regeln zur Secret-Verwaltung:**
- Secrets niemals in Logs schreiben: `::add-mask::` für dynamisch generierte Secrets verwenden
- Umgebungs-Secrets für umgebungsspezifische Werte verwenden (Staging vs. Prod)
- Secrets regelmäßig rotieren — Rotationsdaten als Kommentare in der Secrets-UI speichern
- Secrets niemals committen; `git secret` oder `sops` für verschlüsselte Secret-Dateien verwenden

```yaml
# Dynamisch einen generierten Wert maskieren
- name: Token abrufen
  run: |
    TOKEN=$(generate-token)
    echo "::add-mask::$TOKEN"        # maskiert TOKEN in allen zukünftigen Logs
    echo "token=$TOKEN" >> $GITHUB_OUTPUT
```

### Docker Build und Push

```yaml
- name: Docker Buildx einrichten
  uses: docker/setup-buildx-action@v3

- name: Am Registry anmelden
  uses: docker/login-action@v3
  with:
    registry: ghcr.io
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}

- name: Bauen und pushen
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

### Wiederverwendbare Workflows

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
# .github/workflows/deploy.yml — den wiederverwendbaren Workflow aufrufen
jobs:
  deploy-staging:
    uses: ./.github/workflows/reusable-deploy.yml
    with:
      environment: staging
      image-tag: ${{ github.sha }}
    secrets:
      FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

### Rollback-Strategie

```yaml
# Manueller Rollback-Workflow
name: Rollback

on:
  workflow_dispatch:
    inputs:
      commit-sha:
        description: 'Git-SHA, zu dem zurückgekehrt werden soll'
        required: true

jobs:
  rollback:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ inputs.commit-sha }}

      - name: Vorherige Version deployen
        run: |
          IMAGE_TAG=${{ inputs.commit-sha }}
          flyctl deploy --image ghcr.io/myapp:$IMAGE_TAG
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}

      - name: Rollback-Tag erstellen
        run: |
          git tag "rollback-$(date +%Y%m%d-%H%M%S)" ${{ inputs.commit-sha }}
          git push origin --tags
```

### Benachrichtigung bei Fehler

```yaml
  - name: Slack bei Fehler benachrichtigen
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

## Beispiel

**Benutzer:** Eine vollständige CI/CD-Pipeline für eine Next.js-App einrichten: auf PR testen, Docker-Image bauen, automatisch in Staging deployen, manuelle Genehmigung für Produktion erfordern, mit Slack-Benachrichtigung bei Fehler.

**Erwartete Ausgabe:**
- `.github/workflows/ci.yml` — Lint, Typenprüfung, Tests mit Postgres-Service
- `.github/workflows/deploy.yml` — Image bauen+pushen, Staging deployen, Smoke-Test, manuelles Gate, Prod deployen
- `.github/workflows/rollback.yml` — manueller Trigger mit SHA-Eingabe
- GitHub-Umgebungen: `staging` (automatisch), `production` (erfordert Genehmigung)

---
