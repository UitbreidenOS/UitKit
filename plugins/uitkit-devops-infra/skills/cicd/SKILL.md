---
name: "cicd"
description: "CI/CD patterns: GitHub Actions workflows, secrets management, deployment gates, matrix builds, caching, reusable workflows, rollbacks"
---

# CI/CD Skill

## When to activate
- Writing or debugging GitHub Actions workflows
- Setting up deployment pipelines (staging → production gates)
- Optimising CI speed (caching, matrix builds, concurrency)
- Managing secrets and environment-specific configuration
- Building reusable workflow templates for a team
- Setting up rollback strategies for failed deployments

## When NOT to use
- GitLab CI / CircleCI / Jenkins — different syntax (concepts apply, syntax differs)
- Infrastructure provisioning — use the Terraform skill
- Container orchestration — use the Kubernetes skill

## Instructions

### Standard CI pipeline

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
  cancel-in-progress: true  # cancel older runs on same branch

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

      - name: Install dependencies
        run: npm ci

      - name: Run migrations
        run: npm run db:migrate
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/testdb

      - name: Run tests
        run: npm test -- --coverage
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/testdb

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        if: always()
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
```

### Matrix builds — test across multiple versions

```yaml
jobs:
  test:
    strategy:
      fail-fast: false    # continue other versions if one fails
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

### Dependency caching

```yaml
# Node.js
- uses: actions/setup-node@v4
  with:
    node-version: 22
    cache: npm           # caches ~/.npm based on package-lock.json hash

# Python
- uses: actions/setup-python@v5
  with:
    python-version: '3.12'
    cache: pip           # caches ~/.cache/pip based on requirements hash

# Custom cache (Docker layers, build artifacts)
- uses: actions/cache@v4
  with:
    path: |
      ~/.cache/turbo
      .next/cache
    key: ${{ runner.os }}-turbo-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-turbo-
```

### Deployment pipeline with gates

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    uses: ./.github/workflows/ci.yml   # reuse CI workflow

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    environment: staging               # requires manual approval if configured
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to staging
        run: ./scripts/deploy.sh staging
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}

  smoke-test:
    needs: deploy-staging
    runs-on: ubuntu-latest
    steps:
      - name: Run smoke tests against staging
        run: |
          curl -sf https://staging.myapp.com/health || exit 1
          curl -sf https://staging.myapp.com/api/version | grep '"version"' || exit 1

  deploy-production:
    needs: smoke-test
    runs-on: ubuntu-latest
    environment: production            # requires manual approval in GitHub
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to production
        run: ./scripts/deploy.sh production
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

### Secrets and environments

```yaml
# Access secrets
steps:
  - name: Deploy
    env:
      API_KEY: ${{ secrets.API_KEY }}                      # repo secret
      DB_URL: ${{ secrets.DATABASE_URL }}                  # environment secret
      APP_ENV: ${{ vars.APP_ENV }}                         # variable (not secret)
    run: ./deploy.sh
```

**Secret management rules:**
- Never log secrets: add `::add-mask::` to dynamically generated secrets
- Use environment secrets for environment-specific values (staging vs prod)
- Rotate secrets regularly — store rotation dates as comments in the secrets UI
- Never commit secrets; use `git secret` or `sops` for encrypted secret files

```yaml
# Dynamically mask a generated value
- name: Get token
  run: |
    TOKEN=$(generate-token)
    echo "::add-mask::$TOKEN"        # masks TOKEN in all future logs
    echo "token=$TOKEN" >> $GITHUB_OUTPUT
```

### Docker build and push

```yaml
- name: Set up Docker Buildx
  uses: docker/setup-buildx-action@v3

- name: Log in to registry
  uses: docker/login-action@v3
  with:
    registry: ghcr.io
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}

- name: Build and push
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

### Reusable workflows

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
# .github/workflows/deploy.yml — call the reusable workflow
jobs:
  deploy-staging:
    uses: ./.github/workflows/reusable-deploy.yml
    with:
      environment: staging
      image-tag: ${{ github.sha }}
    secrets:
      FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

### Rollback strategy

```yaml
# Manual rollback workflow
name: Rollback

on:
  workflow_dispatch:
    inputs:
      commit-sha:
        description: 'Git SHA to roll back to'
        required: true

jobs:
  rollback:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ inputs.commit-sha }}

      - name: Deploy previous version
        run: |
          IMAGE_TAG=${{ inputs.commit-sha }}
          flyctl deploy --image ghcr.io/myapp:$IMAGE_TAG
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}

      - name: Create rollback tag
        run: |
          git tag "rollback-$(date +%Y%m%d-%H%M%S)" ${{ inputs.commit-sha }}
          git push origin --tags
```

### Notification on failure

```yaml
  - name: Notify Slack on failure
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

## Example

**User:** Set up a full CI/CD pipeline for a Next.js app: test on PR, build Docker image, deploy to staging automatically, require manual approval for production, with Slack notification on failure.

**Expected output:**
- `.github/workflows/ci.yml` — lint, type-check, test with postgres service
- `.github/workflows/deploy.yml` — build+push image, deploy staging, smoke test, manual gate, deploy prod
- `.github/workflows/rollback.yml` — manual trigger with SHA input
- GitHub environments: `staging` (auto), `production` (requires approval)

---
