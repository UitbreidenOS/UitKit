---
name: github-actions
description: "GitHub Actions workflows, job matrices, caching, secrets, reusable workflows, deployment environments"
updated: 2026-06-13
---

# GitHub Actions Skill

## When to activate
- Writing CI/CD pipelines for test, lint, build, and deploy
- Setting up matrix builds across multiple OS or language versions
- Configuring environment protection rules and deployment gates
- Writing reusable workflows or composite actions
- Setting up Docker build and push to a container registry
- Configuring OIDC authentication to cloud providers (no long-lived secrets)
- Debugging failing workflows or understanding workflow syntax errors
- Setting up caching for dependencies (npm, pip, Go modules)

## When NOT to use
- GitLab CI, CircleCI, Jenkins — different pipeline systems
- Local development automation (use Makefile or scripts)
- Cron jobs that aren't tied to a repository (use cloud scheduler)

## Instructions

### Workflow file structure
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

# Explicit permissions — never use default write-all
permissions:
  contents: read
  pull-requests: write    # Only if needed (e.g., posting comments)

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

### Permissions — always explicit
Never use the default `permissions: write-all`. Always declare minimum required permissions:
```yaml
permissions:
  contents: read          # Read repo
  packages: write         # Push to GitHub Container Registry
  id-token: write         # OIDC for cloud auth
  pull-requests: write    # Comment on PRs
```

### Secrets — OIDC over long-lived credentials
Use OIDC (OpenID Connect) for cloud authentication — no stored secrets:

```yaml
# AWS OIDC — no AWS_ACCESS_KEY_ID needed
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

### Dependency caching
Always cache dependencies to cut build time:
```yaml
# Node.js
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'          # Built-in cache — no manual cache step needed

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

### Environment gates for production deployments
```yaml
jobs:
  deploy-production:
    environment: production    # References GitHub Environment with protection rules
    needs: [test, build]
    runs-on: ubuntu-latest
    steps:
      - name: Deploy
        run: ./scripts/deploy.sh
```

Set up Environment protection rules in GitHub Settings:
- Required reviewers for production deployments
- Wait timer between staging and production
- Restrict to specific branches (`main` only)

### Matrix builds
```yaml
jobs:
  test:
    strategy:
      matrix:
        node-version: [18, 20, 22]
        os: [ubuntu-latest, windows-latest]
      fail-fast: false    # Don't cancel all on first failure
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
```

### Reusable workflows
```yaml
# .github/workflows/deploy.yml — reusable
on:
  workflow_call:
    inputs:
      environment:
        required: true
        type: string
    secrets:
      deploy-token:
        required: true

# Caller
jobs:
  deploy:
    uses: ./.github/workflows/deploy.yml
    with:
      environment: production
    secrets:
      deploy-token: ${{ secrets.DEPLOY_TOKEN }}
```

### Common failures
- `actions/checkout@v4` missing — always the first step
- Secrets not accessible in forks — use `pull_request_target` carefully (security risk)
- Cache not hit — key must match exactly; use `restore-keys` for fallback
- OIDC fails — check trust policy on the cloud provider side allows the repo and branch

## Example

**User:** Write a CI/CD pipeline for a Node.js app: run tests on PRs, build and push Docker image on merge to main, deploy to production with a manual approval gate.

**Expected output:**
- `on: push/pull_request` triggers
- `test` job: checkout, setup-node with cache, `npm ci`, `npm test`
- `build` job (on push to main, needs test): Docker build + push to GHCR using OIDC
- `deploy` job: `environment: production` (requires approval), calls deploy script
- Explicit `permissions:` block — minimum required
- No hardcoded secrets — OIDC for registry auth

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities. Building CI/CD for AI products or cloud deployments? [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
