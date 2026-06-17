# /build-cicd-pipeline

## When to activate

Use this command when designing a continuous integration and continuous deployment pipeline for a service. Covers stages, testing, build, deployment strategies, rollback, and cost optimization.

## When NOT to use

For operational troubleshooting (use runbooks). For fixing existing pipelines, use specific platform documentation (GitHub Actions, GitLab CI, etc.).

## Instructions

When you invoke this command, follow this workflow:

### 1. Understand Current State (5 minutes)

Ask the user:
- **Current CI/CD platform:** GitHub Actions, GitLab CI, Jenkins, other?
- **Current deployment process:** Manual, semi-automated, fully automated?
- **Testing coverage:** Unit tests, integration tests, E2E tests?
- **Deployment frequency:** Once per quarter? Weekly? Daily?
- **Target:** How often should they deploy?
- **Rollback capability:** Can they rollback in < 5 minutes?
- **Approval process:** Who approves production deployments?

### 2. Design Stage Sequence (20 minutes)

Create pipeline with these stages:

**Fast feedback (< 10 min):**
- Lint & format
- Unit tests
- Type checking
- Dependency scanning

**Medium speed (10-30 min):**
- Build artifact
- SAST security scan
- Build container image

**Slow (30+ min, only on main branch):**
- Integration tests
- Deploy to staging
- Smoke tests in staging

**Production (requires approval):**
- Manual approval gate
- Deploy to production (rolling/canary/blue-green)
- Monitor metrics during rollout
- Automatic rollback on error rate spike

### 3. Choose Deployment Strategy

Based on risk and traffic, recommend:

- **Rolling** — Safe for stateless services, zero downtime (default)
- **Blue-green** — For critical services, instant rollback
- **Canary** — For high-risk changes, gradual validation
- **Recreate** — Only for off-peak maintenance windows

### 4. Define Approval Gates

Configure:
- Automatic gates (tests must pass, coverage stable, security scan clean)
- Manual gates (approval required from oncall/manager before production)
- Timeout (4-hour approval window)
- Notifications (Slack/email when waiting for approval)

### 5. Configure Rollback

Plan for:
- Automatic triggers (error rate > X%, latency > Y, pod crashes)
- Manual rollback command
- Verification (health checks after rollback)
- Communication (post to incident channel)

### 6. Document Pipeline

Provide:
- Stage diagram (flow from commit to production)
- Config file (for their platform)
- Approval process
- Rollback procedure
- Monitoring/alerting during deployment

## Example Invocation

**User:** "We're on GitHub Actions, deploying Node.js API to Kubernetes. Currently deploying weekly, manually. Want daily/on-demand deployment with automatic rollback."

**You should:**

1. Design pipeline with 8 stages: lint → test → build → push image → deploy staging → smoke tests → approval → deploy production
2. Recommend rolling deployment (stateless Node.js)
3. Auto-rollback if error rate > 2% for > 2 minutes
4. Approval gate: 30-min timeout, approval required from on-call engineer
5. Provide complete GitHub Actions YAML config
6. Document approval process and rollback commands
7. Explain how to adjust thresholds based on experience

## Success Criteria

A well-designed CI/CD pipeline:

1. **Fast feedback** — Developers know test results in < 10 minutes
2. **Reliable** — Tests are not flaky, pipeline doesn't fail randomly
3. **Gated** — Can't deploy to production without passing tests and approval
4. **Reversible** — Can rollback to previous version in < 5 minutes
5. **Monitored** — Metrics tracked: deployment frequency, time to deploy, failure rate
6. **Documented** — Team knows approval process, rollback procedure, how to adjust
7. **Low friction** — Developers don't avoid deployments because process is painful

---
