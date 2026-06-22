---
name: github-actions-workflow
description: "GitHub Actions CI/CD: Automated feature validation on commit, benchmarking, report generation, and release deployments"
updated: 2026-06-22
---

# GitHub Actions Workflow Skill

## When to activate
- Setting up continuous integration (CI) on every commit or pull request
- Auto-validating features, running tests, linting, and type checks
- Configuring benchmark suites and performance monitoring
- Generating build artifacts and test/coverage reports
- Automating deployments on release tags or merge to main
- Caching dependencies and build outputs for faster workflows
- Setting up matrix builds (multi-version, multi-platform testing)
- Configuring secrets and environment variables for deployment

## When NOT to use
- Complex multi-service orchestration — use ArgoCD or workflow orchestration tools
- Local development setup — use make, npm scripts, or tox
- CD-only without CI — ArgoCD is better for GitOps post-build
- Non-GitHub repositories — use GitLab CI, CircleCI, or Jenkins

## Instructions

### Basic workflow structure

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up [runtime]
        uses: actions/setup-[runtime]@v[x]
        with:
          [runtime-version]: '[version]'
      
      - name: Install dependencies
        run: [install command]
      
      - name: Run linter
        run: [lint command]
      
      - name: Run type check
        run: [type-check command]
      
      - name: Run tests
        run: [test command]
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
          fail_ci_if_error: true
```

### Feature validation on commit

```yaml
# .github/workflows/validate-features.yml
name: Validate Features

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
    types: [opened, synchronize, reopened]

jobs:
  validate-features:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Validate feature structure
        run: npm run validate:features
      
      - name: Check feature documentation
        run: npm run check:feature-docs
      
      - name: Verify feature types
        run: npm run check:feature-types
      
      - name: Run feature tests
        run: npm run test:features
      
      - name: Report results
        if: always()
        run: |
          echo "Feature validation complete"
          exit ${{ job.status == 'success' && 0 || 1 }}
```

### Benchmark suite workflow

```yaml
# .github/workflows/benchmarks.yml
name: Benchmarks

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 2 * * *'  # daily at 2 AM UTC

jobs:
  benchmark:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run benchmarks
        run: npm run benchmark
      
      - name: Store benchmark results
        uses: benchmark-action/github-action-benchmark@v1
        with:
          name: Performance Benchmarks
          tool: 'customBiggerIsBetter'
          output-file-path: benchmark-results.json
          github-token: ${{ secrets.GITHUB_TOKEN }}
          auto-push: true
          alert-threshold: '110%'
          comment-on-alert: true
          fail-on-alert: true
      
      - name: Compare with baseline
        if: github.event_name == 'pull_request'
        run: |
          npm run benchmark:compare \
            --baseline=main \
            --current=HEAD
      
      - name: Upload benchmark report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: benchmark-report
          path: benchmark-results.json
          retention-days: 30
```

### Report generation workflow

```yaml
# .github/workflows/generate-reports.yml
name: Generate Reports

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  reports:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # full history for analysis
      
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests with coverage
        run: npm run test -- --coverage
      
      - name: Generate coverage report
        run: npm run report:coverage
      
      - name: Generate test report
        run: npm run report:tests
      
      - name: Generate code quality report
        run: npm run report:quality
      
      - name: Generate dependency audit
        run: npm audit --json > audit-report.json || true
      
      - name: Upload all reports
        uses: actions/upload-artifact@v4
        with:
          name: reports
          path: |
            coverage/
            reports/
            audit-report.json
          retention-days: 30
      
      - name: Comment PR with report summary
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const coverage = JSON.parse(fs.readFileSync('./coverage/coverage-summary.json', 'utf8'));
            const comment = `
            ## Test Report Summary
            - **Coverage**: ${coverage.total.lines.pct}% lines
            - **Branch Coverage**: ${coverage.total.branches.pct}%
            - **Function Coverage**: ${coverage.total.functions.pct}%
            - **Statement Coverage**: ${coverage.total.statements.pct}%
            
            [Full Report](https://github.com/${{ github.repository }}/actions/runs/${{ github.run_id }})
            `;
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            });
```

### Release and deployment workflow

```yaml
# .github/workflows/release.yml
name: Release & Deploy

on:
  push:
    tags:
      - 'v[0-9]+.[0-9]+.[0-9]+'

jobs:
  release:
    runs-on: ubuntu-latest
    outputs:
      version: ${{ steps.version.outputs.version }}
      upload_url: ${{ steps.create_release.outputs.upload_url }}
    steps:
      - uses: actions/checkout@v4
      
      - name: Extract version
        id: version
        run: echo "version=${GITHUB_REF#refs/tags/v}" >> $GITHUB_OUTPUT
      
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run full test suite
        run: npm run test -- --coverage
      
      - name: Build release artifacts
        run: npm run build
      
      - name: Create GitHub Release
        id: create_release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ steps.version.outputs.version }}
          draft: false
          prerelease: false
      
      - name: Upload release artifacts
        uses: actions/upload-release-asset@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          upload_url: ${{ steps.create_release.outputs.upload_url }}
          asset_path: ./dist/package.zip
          asset_name: release-${{ steps.version.outputs.version }}.zip
          asset_content_type: application/zip

  deploy-staging:
    needs: release
    runs-on: ubuntu-latest
    if: startsWith(github.ref, 'refs/tags/v')
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to staging
        run: |
          curl -X POST ${{ secrets.STAGING_DEPLOY_WEBHOOK }} \
            -H 'Content-Type: application/json' \
            -d '{"version": "${{ needs.release.outputs.version }}"}'
      
      - name: Verify staging deployment
        run: |
          npm run test:e2e:staging
      
      - name: Notify Slack
        uses: slackapi/slack-github-action@v1.24.0
        with:
          webhook-url: ${{ secrets.SLACK_WEBHOOK }}
          payload: |
            {
              "text": "Staging deployment successful",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "✅ Version ${{ needs.release.outputs.version }} deployed to staging"
                  }
                }
              ]
            }

  deploy-production:
    needs: [release, deploy-staging]
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to production
        run: |
          curl -X POST ${{ secrets.PROD_DEPLOY_WEBHOOK }} \
            -H 'Content-Type: application/json' \
            -d '{"version": "${{ needs.release.outputs.version }}"}'
      
      - name: Verify production deployment
        run: |
          npm run test:e2e:production
      
      - name: Notify deployment
        uses: slackapi/slack-github-action@v1.24.0
        with:
          webhook-url: ${{ secrets.SLACK_WEBHOOK }}
          payload: |
            {
              "text": "Production deployment complete",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "🚀 Version ${{ needs.release.outputs.version }} is live in production"
                  }
                }
              ]
            }
```

### Matrix builds (multi-version testing)

```yaml
# .github/workflows/matrix-test.yml
name: Matrix Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
        node-version: [18.x, 20.x, 22.x]
        exclude:
          # Skip Windows for older Node versions
          - os: windows-latest
            node-version: 18.x
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          flags: ${{ matrix.os }}-node-${{ matrix.node-version }}
```

### Caching and optimization

```yaml
# .github/workflows/optimized-build.yml
name: Optimized Build

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Cache build artifacts
        uses: actions/cache@v4
        with:
          path: |
            dist/
            .next/
            build/
          key: ${{ runner.os }}-build-${{ github.sha }}
          restore-keys: |
            ${{ runner.os }}-build-
      
      - name: Build project
        run: npm run build
      
      - name: Cache test results
        uses: actions/cache@v4
        with:
          path: .test-cache
          key: ${{ runner.os }}-test-${{ github.sha }}
          restore-keys: |
            ${{ runner.os }}-test-
      
      - name: Run tests
        run: npm run test
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build
          path: dist/
          retention-days: 7
```

### Secrets and environment variables

```yaml
# .github/workflows/deploy-with-secrets.yml
name: Deploy with Environment

on:
  push:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    environment:
      name: production
      url: https://example.com
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Docker
        uses: docker/setup-buildx-action@v3
      
      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Build and push image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max
      
      - name: Deploy to production
        env:
          API_KEY: ${{ secrets.PROD_API_KEY }}
          DB_HOST: ${{ secrets.PROD_DB_HOST }}
          DB_USER: ${{ secrets.PROD_DB_USER }}
          DB_PASS: ${{ secrets.PROD_DB_PASS }}
        run: |
          npm run deploy:prod
```

## Example

**User:** We need a CI/CD pipeline that validates code, runs benchmarks on every commit, generates test reports for PRs, and auto-deploys to staging/prod on version tags.

**Claude's setup:**

**Step 1 — Create feature validation workflow (.github/workflows/validate-features.yml):**
```yaml
name: Validate Features
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run validate:features
      - run: npm run test:features
```

**Step 2 — Create benchmarks workflow (.github/workflows/benchmarks.yml):**
```yaml
name: Benchmarks
on:
  push:
    branches: [main]

jobs:
  benchmark:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run benchmark
      - uses: benchmark-action/github-action-benchmark@v1
        with:
          name: Performance Benchmarks
          tool: 'customBiggerIsBetter'
          output-file-path: benchmark-results.json
          github-token: ${{ secrets.GITHUB_TOKEN }}
          auto-push: true
```

**Step 3 — Create release workflow (.github/workflows/release.yml):**
```yaml
name: Release & Deploy
on:
  push:
    tags:
      - 'v[0-9]+.[0-9]+.[0-9]+'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci && npm run build
      - uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
  
  deploy-staging:
    needs: release
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: curl -X POST ${{ secrets.STAGING_DEPLOY_WEBHOOK }} -d "version=${{ github.ref }}"
```

**Step 4 — Add workflows to GitHub:**
```bash
git add .github/workflows/
git commit -m "chore: add CI/CD workflows (validate, benchmark, release)"
git push origin main
```

Workflows now auto-run on every commit and tag. Navigate to Actions tab in GitHub to view logs and reports.

---
