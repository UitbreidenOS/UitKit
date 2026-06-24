---
description: Generate a GitHub Actions workflow for CI, CD, or automation tasks
argument-hint: "[workflow purpose: e.g. ci, deploy-aws, release, pr-checks]"
---
Generate a GitHub Actions workflow for: $ARGUMENTS

Inspect the project to determine the language/framework, test commands, build commands, and deployment target. Tailor the workflow accordingly.

Output a single `.github/workflows/<slug>.yml` file.

Requirements:

Triggers:
- Use the minimal trigger set for the stated purpose (e.g., `push` + `pull_request` for CI; `release` for publish; `workflow_dispatch` for manual ops)
- Add `paths` filters if the repo is a monorepo
- Pin `branches` to `main`/`master` unless broader coverage is needed

Jobs and steps:
- Use `actions/checkout@v4` — always pin actions to a SHA or major version tag, never to a branch
- Cache dependencies appropriate to the stack (`actions/cache` or built-in caches in `setup-*` actions)
- Run lint, type-check, and test as separate steps with clear names
- Fail fast: `continue-on-error: false` on critical steps; set a `timeout-minutes` on each job
- For Docker builds: use `docker/build-push-action@v5` with `cache-from: type=gha` and `cache-to: type=gha,mode=max`
- For deployments: use OIDC-based auth (`permissions: id-token: write`) rather than long-lived secrets where the provider supports it

Security:
- Declare explicit `permissions` at the workflow level (default to `read-all`) and elevate per-job only as needed
- Never interpolate `${{ github.event.*.body }}` or untrusted input directly into `run:` steps — use environment variables
- Pin third-party actions to a full commit SHA with a version comment

After the workflow YAML, output:
1. Required repository secrets and variables (name + what value to set)
2. Any branch protection rules that must be configured for this workflow to be effective
3. Estimated job runtime and suggestions to reduce it if over 5 minutes
