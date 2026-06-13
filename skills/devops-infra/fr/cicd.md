---
name: cicd
description: "CI/CD patterns: GitHub Actions workflows, secrets management, deployment gates, matrix builds, caching, reusable workflows, rollbacks"
---

> 🇫🇷 Version française. [English version](../cicd.md).

# Compétence CI/CD

## Quand activer
- Écriture ou débogage de workflows GitHub Actions
- Mise en place de pipelines de déploiement (portails staging → production)
- Optimisation de la vitesse CI (mise en cache, matrix builds, concurrence)
- Gestion des secrets et de la configuration spécifique à l'environnement
- Création de modèles de workflows réutilisables pour une équipe
- Mise en place de stratégies de rollback pour les déploiements échoués

## Quand NE PAS utiliser
- GitLab CI / CircleCI / Jenkins — syntaxe différente (les concepts s'appliquent, la syntaxe diffère)
- Provisionnement d'infrastructure — utiliser la compétence Terraform
- Orchestration de conteneurs — utiliser la compétence Kubernetes

## Instructions

### Pipeline CI standard

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
  cancel-in-progress: true  # annuler les anciennes exécutions sur la même branche

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

      - name: Installer les dépendances
        run: npm ci

      - name: Exécuter les migrations
        run: npm run db:migrate
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/testdb

      - name: Exécuter les tests
        run: npm test -- --coverage
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/testdb

      - name: Téléverser la couverture
        uses: codecov/codecov-action@v4
        if: always()
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
```

### Matrix builds — tester sur plusieurs versions

```yaml
jobs:
  test:
    strategy:
      fail-fast: false    # continuer les autres versions si l'une échoue
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

### Mise en cache des dépendances

```yaml
# Node.js
- uses: actions/setup-node@v4
  with:
    node-version: 22
    cache: npm           # met en cache ~/.npm basé sur le hash de package-lock.json

# Python
- uses: actions/setup-python@v5
  with:
    python-version: '3.12'
    cache: pip           # met en cache ~/.cache/pip basé sur le hash des requirements

# Cache personnalisé (couches Docker, artefacts de build)
- uses: actions/cache@v4
  with:
    path: |
      ~/.cache/turbo
      .next/cache
    key: ${{ runner.os }}-turbo-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-turbo-
```

### Pipeline de déploiement avec portails

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    uses: ./.github/workflows/ci.yml   # réutiliser le workflow CI

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    environment: staging               # nécessite une approbation manuelle si configuré
    steps:
      - uses: actions/checkout@v4
      - name: Déployer en staging
        run: ./scripts/deploy.sh staging
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}

  smoke-test:
    needs: deploy-staging
    runs-on: ubuntu-latest
    steps:
      - name: Exécuter les smoke tests sur staging
        run: |
          curl -sf https://staging.myapp.com/health || exit 1
          curl -sf https://staging.myapp.com/api/version | grep '"version"' || exit 1

  deploy-production:
    needs: smoke-test
    runs-on: ubuntu-latest
    environment: production            # nécessite une approbation manuelle dans GitHub
    steps:
      - uses: actions/checkout@v4
      - name: Déployer en production
        run: ./scripts/deploy.sh production
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

### Secrets et environnements

```yaml
# Accéder aux secrets
steps:
  - name: Deploy
    env:
      API_KEY: ${{ secrets.API_KEY }}                      # secret du dépôt
      DB_URL: ${{ secrets.DATABASE_URL }}                  # secret d'environnement
      APP_ENV: ${{ vars.APP_ENV }}                         # variable (pas un secret)
    run: ./deploy.sh
```

**Règles de gestion des secrets :**
- Ne jamais consigner les secrets dans les logs : utiliser `::add-mask::` pour les secrets générés dynamiquement
- Utiliser les secrets d'environnement pour les valeurs spécifiques à l'environnement (staging vs prod)
- Faire tourner les secrets régulièrement — stocker les dates de rotation en commentaires dans l'interface des secrets
- Ne jamais committer les secrets ; utiliser `git secret` ou `sops` pour les fichiers de secrets chiffrés

```yaml
# Masquer dynamiquement une valeur générée
- name: Obtenir le token
  run: |
    TOKEN=$(generate-token)
    echo "::add-mask::$TOKEN"        # masque TOKEN dans tous les logs suivants
    echo "token=$TOKEN" >> $GITHUB_OUTPUT
```

### Build et push Docker

```yaml
- name: Configurer Docker Buildx
  uses: docker/setup-buildx-action@v3

- name: Se connecter au registre
  uses: docker/login-action@v3
  with:
    registry: ghcr.io
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}

- name: Build et push
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

### Workflows réutilisables

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
# .github/workflows/deploy.yml — appeler le workflow réutilisable
jobs:
  deploy-staging:
    uses: ./.github/workflows/reusable-deploy.yml
    with:
      environment: staging
      image-tag: ${{ github.sha }}
    secrets:
      FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

### Stratégie de rollback

```yaml
# Workflow de rollback manuel
name: Rollback

on:
  workflow_dispatch:
    inputs:
      commit-sha:
        description: 'SHA Git vers lequel revenir'
        required: true

jobs:
  rollback:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ inputs.commit-sha }}

      - name: Déployer la version précédente
        run: |
          IMAGE_TAG=${{ inputs.commit-sha }}
          flyctl deploy --image ghcr.io/myapp:$IMAGE_TAG
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}

      - name: Créer un tag de rollback
        run: |
          git tag "rollback-$(date +%Y%m%d-%H%M%S)" ${{ inputs.commit-sha }}
          git push origin --tags
```

### Notification en cas d'échec

```yaml
  - name: Notifier Slack en cas d'échec
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

## Exemple

**Utilisateur :** Mettre en place un pipeline CI/CD complet pour une application Next.js : tester sur les PR, construire une image Docker, déployer en staging automatiquement, exiger une approbation manuelle pour la production, avec une notification Slack en cas d'échec.

**Résultat attendu :**
- `.github/workflows/ci.yml` — lint, vérification de types, tests avec service postgres
- `.github/workflows/deploy.yml` — build+push de l'image, déploiement staging, smoke test, portail manuel, déploiement prod
- `.github/workflows/rollback.yml` — déclenchement manuel avec saisie de SHA
- Environnements GitHub : `staging` (automatique), `production` (nécessite une approbation)

---
