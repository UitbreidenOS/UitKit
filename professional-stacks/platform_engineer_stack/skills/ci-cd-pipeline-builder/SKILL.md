# CI/CD Pipeline Builder

## When to activate

When designing continuous integration and continuous deployment pipelines, setting up automated testing, configuring deployment gates, planning rollout strategies, or optimizing pipeline performance. Use when building pipelines from scratch or improving existing ones.

## When NOT to use

For one-off deployments or manual operations. For operational issues like recovering from failed deployments, use runbook skills. This is for designing the pipeline itself.

## Instructions

### 1. Define Pipeline Stages

Structure the workflow from code to production:

**Typical Stage Sequence:**

1. **Trigger** — What events start the pipeline?
   - Push to main branch
   - Pull request opened
   - Manual trigger
   - Scheduled (e.g., nightly builds)

2. **Lint & Format** — Enforce code quality
   - Run linters (eslint, flake8, golangci-lint)
   - Check formatting (prettier, black, gofmt)
   - Type checking (TypeScript, mypy, Go)
   - Cost: ~2-5 minutes, should be fast

3. **Unit Tests** — Fast feedback loop
   - Run all unit tests
   - Target: > 80% code coverage
   - Cost: ~5-15 minutes, parallelized by test suite
   - Fail fast on test failures

4. **Build** — Compile and package
   - Compile source code
   - Run build tests
   - Create artifact (binary, JAR, wheel)
   - Cost: ~5-15 minutes

5. **Security Scanning** — Vulnerability detection
   - Static analysis: SAST (SonarQube, Semgrep)
   - Dependency scanning (Snyk, Dependabot)
   - Container scanning (Trivy, Grype)
   - Cost: ~5-10 minutes, can block on critical issues

6. **Build Container Image** — Create deployable artifact
   - Build Docker image
   - Tag with commit SHA, branch, version
   - Push to registry
   - Cost: ~10-20 minutes

7. **Integration Tests** — Test with real services
   - Spin up test database, cache, message queue
   - Run integration test suite
   - Teardown test infrastructure
   - Cost: ~15-30 minutes
   - Usually only on main branch (PR too expensive)

8. **Deploy to Staging** — Production-like environment
   - Deploy image to staging Kubernetes cluster
   - Run smoke tests
   - Cost: ~5-10 minutes

9. **Approval Gate** — Human review before production
   - Require approval from oncall or team lead
   - Show diff vs production
   - 4-hour timeout (don't approve old builds)

10. **Deploy to Production** — Release to users
    - Execute deployment (rolling, blue-green, or canary)
    - Monitor metrics during rollout
    - Automatic rollback if error rate spikes
    - Cost: ~5-15 minutes

11. **Smoke Tests & Monitoring** — Verify production health
    - Run basic functionality tests
    - Check error rates and latency
    - Alert if anomalies detected

### 2. Configure Deployment Strategies

Choose how to roll out changes:

**Rolling Deployment (minimize downtime):**
```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 1          # Create 1 extra pod
    maxUnavailable: 0    # Never remove a pod
```
- Pros: Zero downtime, gradual rollout
- Cons: Database migrations must be backwards compatible
- Use for: Most services with stateless architecture
- Time: ~5-10 minutes for full rollout

**Blue-Green Deployment (instant switch):**
```yaml
# Maintain two complete sets: blue (current) and green (new)
# Route all traffic to blue
# Deploy green with new version
# Switch traffic to green (instant)
# Keep blue as immediate rollback
```
- Pros: Instant switch, easy rollback
- Cons: Requires 2x infrastructure, database migrations tricky
- Use for: Critical services where instant rollback matters
- Time: ~15-20 minutes (including parallel testing)

**Canary Deployment (gradual validation):**
```yaml
# Deploy to 10% of pods first
# Monitor error rate, latency for 15 minutes
# If healthy, increase to 25%, then 50%, then 100%
# Automatic rollback if metrics degrade
```
- Pros: Catch issues before affecting all users
- Cons: Complex monitoring, slower rollout
- Use for: High-risk changes, new features with uncertainty
- Time: ~45-60 minutes (staged increases)

**Recreate (downtime expected):**
```yaml
# Delete all pods
# Create new pods with new version
# Acceptable only during maintenance windows
```
- Use for: Batch jobs, scheduled maintenance, database migrations
- Time: ~5-15 minutes (including startup time)

### 3. Configure Approval Gates

Control when changes reach production:

**Automatic Approvals:**
- Lint/test/build must pass (gates)
- Security scan must find no critical issues
- Code coverage must not decrease
- Performance benchmark must not regress > 5%

**Manual Approvals:**
- Require approval from: oncall, engineering manager, or security team
- Timeout: 4 hours (don't approve changes that are days old)
- Must view change diff before approving
- Log who approved and when

**Example approval rule:**
```
IF all tests pass AND security scan passes AND code coverage stable
  THEN auto-approve for staging deployment
ELSE
  REQUIRE manual approval from oncall engineer
```

### 4. Handle Rollbacks

Plan for when deployments fail:

**Automatic Rollback Triggers:**
- Error rate > 5% for > 2 minutes
- p99 latency > 2x baseline for > 2 minutes
- Pod crash loop (restart rate > 5/min)
- Database connection pool exhausted
- Liveness probe failures > 30%

**Manual Rollback:**
```bash
# Command to instantly revert to previous version
kubectl set image deployment/api api=api:previous-version
```

**Rollback Validation:**
- Verify error rate returns to normal
- Check that data wasn't corrupted by buggy code
- Post to incident channel with details

### 5. Artifact Management

Store and manage build artifacts:

**Container Registry:**
- Push images tagged with: SHA commit, git branch, version
- Keep recent 20 versions for quick rollback
- Delete old images after 30 days
- Scan for vulnerabilities on push

**Example tagging:**
```
registry.io/api:abc123def456        # Commit SHA
registry.io/api:main                # Branch tag (mutable)
registry.io/api:v1.2.3              # Release version (immutable)
registry.io/api:latest              # Latest from main (mutable)
```

**Build Artifacts:**
- Store checksums in version control
- Pin to exact versions (no floating `:latest`)
- Keep build logs for 90 days
- Store release notes in git tags

### 6. Complete Pipeline Example

**GitHub Actions Example:**

```yaml
name: Deploy API Service

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  REGISTRY: myregistry.azurecr.io
  IMAGE_NAME: api-service

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run lint
      - run: npm run format:check
      
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test:coverage
      - name: Check coverage
        run: |
          COVERAGE=$(npm run test:coverage:report | grep -oP 'Total: \K[0-9]+')
          if [ $COVERAGE -lt 80 ]; then exit 1; fi
      
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Snyk scan
        run: npx snyk test --fail-on=all
      - name: SAST scan
        run: npx semgrep --config=p/security-audit
        
  build:
    needs: [lint, test, security]
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v3
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      - name: Log in to registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ secrets.REGISTRY_USERNAME }}
          password: ${{ secrets.REGISTRY_PASSWORD }}
      - name: Build and push image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: ${{ github.event_name == 'push' }}
          tags: |
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.ref_name }}
            ${{ github.ref == 'refs/heads/main' && format('{0}/{1}:latest', env.REGISTRY, env.IMAGE_NAME) || '' }}
          cache-from: type=registry,ref=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:buildcache
          cache-to: type=registry,ref=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:buildcache,mode=max
          
  deploy-staging:
    needs: build
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to staging
        run: |
          kubectl set image deployment/api-service \
            api=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }} \
            --namespace=staging
      - name: Wait for rollout
        run: kubectl rollout status deployment/api-service -n staging --timeout=5m
      - name: Run smoke tests
        run: npm run test:smoke:staging
        
  approve:
    needs: deploy-staging
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    environment: production
    runs-on: ubuntu-latest
    steps:
      - name: Wait for approval
        run: echo "Waiting for manual approval to production..."
        
  deploy-production:
    needs: approve
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to production (canary: 20%)
        run: |
          kubectl patch deployment api-service -n production --type json \
            -p='[{"op":"replace","path":"/spec/replicas","value":10}]'
          kubectl set image deployment/api-service \
            api=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }} \
            --namespace=production
      - name: Monitor canary deployment
        run: |
          for i in {1..15}; do
            ERROR_RATE=$(kubectl logs -n production -l app=api-service --tail=1000 | \
              grep -c "ERROR" || true)
            if [ $ERROR_RATE -gt 100 ]; then
              echo "High error rate detected, rolling back..."
              kubectl rollout undo deployment/api-service -n production
              exit 1
            fi
            sleep 60
          done
      - name: Complete rollout to 100%
        run: kubectl rollout status deployment/api-service -n production --timeout=10m
      - name: Verify production metrics
        run: npm run test:smoke:production
```

## Best Practices

1. **Fail fast** — Lint first (2 min), then unit tests (5 min), then expensive tests
2. **Parallelize** — Run independent jobs (test, lint, security) in parallel
3. **Immutable artifacts** — Build once, test many times, deploy same artifact
4. **Tag intelligently** — Commit SHA for immutability, branch for convenience
5. **Notify on failure** — Slack/email when pipeline fails, include logs
6. **Lock down production** — Manual approval required for all production deployments
7. **Automatic rollback** — If error rate spikes, automatically revert to previous version
8. **Test rollbacks** — Quarterly, practice rolling back. Document the procedure.
9. **Monitor pipeline** — Track: build time, test time, deployment frequency, failure rate
10. **Keep it DRY** — Use shared workflows/actions to avoid duplicating pipeline logic

---
