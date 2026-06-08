# CI/CD Rules

Apply when writing or reviewing pipeline configuration, deployment scripts, or release processes.

## Pipeline design

- Every pipeline run must be reproducible: same inputs → same outputs, regardless of when or where it runs
- Pin action versions and base images to digests, not floating tags: `actions/checkout@v4` is acceptable; `actions/checkout@latest` is not
- Separate stages: lint → test → build → publish → deploy; never skip stages on the main branch
- Fail fast: run the cheapest, fastest checks first to give developers feedback in under 2 minutes
- Parallelise independent jobs; don't chain jobs that don't have a real dependency

## Testing gates

- `main`/`master` merges require: all tests passing, lint clean, no new security vulnerabilities
- Coverage must not drop below the configured threshold — enforce this as a pipeline gate, not a courtesy check
- Integration and end-to-end test suites run on every PR; long-running suites may run nightly if necessary
- Never merge a PR that bypasses the test pipeline except in a documented emergency with a follow-up ticket

## Secrets and environment

- Pipeline secrets live in the CI platform's secrets store — never in pipeline YAML or committed `.env` files
- Never print secrets to pipeline logs; add `::add-mask::` (GitHub Actions) or equivalent before using them
- Use separate credential sets per target environment; the staging deployer cannot touch production

## Build artefacts

- Build once, promote the same artefact through environments — never rebuild for staging vs. production
- Tag container images and build artefacts with the git commit SHA, not a mutable tag like `latest`
- Store artefacts in a versioned registry (ECR, Artifact Registry, GitHub Packages) — not as pipeline attachments
- Scan artefacts for vulnerabilities before promotion to production

## Deployment

- Use a deployment strategy that allows rollback: blue/green, canary, or rolling with a rollback step
- Smoke-test the deployment automatically before marking it successful
- Database migrations and code deployments are separate steps — deploy backwards-compatible code first, then migrate
- Deployment to production requires explicit approval or is gated on a time window — no accidental pushes

## Maintenance

- Keep pipeline configuration DRY: extract shared steps into reusable workflows or composite actions
- Every pipeline step has a name that makes the log readable without digging into the config
- Alert on pipeline failures to the team channel — don't rely on individuals checking the dashboard
- Review and update pinned versions monthly; stale tooling is a security risk
