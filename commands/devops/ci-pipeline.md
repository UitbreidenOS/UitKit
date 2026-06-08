---
description: Generate a CI pipeline configuration for the current project
argument-hint: "[platform: github|gitlab|circleci|bitbucket] [optional: extra steps]"
---
Generate a complete CI pipeline configuration for the platform specified in $ARGUMENTS. If no platform is given, default to GitHub Actions. If $ARGUMENTS includes extra steps (e.g., `deploy`, `notify`, `sonar`), include those stages.

Steps:
1. Detect the project's language, runtime, and test framework by inspecting package manifests and config files.
2. Design a pipeline with these stages in order:
   - **Lint** — run the project's linter (ESLint, Flake8, golangci-lint, Clippy, etc.) and fail fast on errors.
   - **Test** — run the full test suite with coverage reporting. Cache dependencies between runs.
   - **Build** — compile or bundle the application. Produce a versioned artifact.
   - **Security scan** — run a dependency vulnerability scan (npm audit, pip-audit, govulncheck, Trivy for images, etc.).
   - **Docker build** — build and push the image to a registry (parameterized via secrets/env vars). Tag with the commit SHA and branch name.
   - **Deploy** (if requested in $ARGUMENTS) — add a deploy stage gated on the target branch (e.g., `main`).
3. Apply platform-specific best practices:
   - GitHub Actions: use `actions/cache`, matrix strategy for multi-version tests if applicable, OIDC-based cloud auth instead of long-lived credentials.
   - GitLab CI: use `cache`, `artifacts`, `rules` instead of `only/except`, OIDC where supported.
   - CircleCI: use orbs for Docker and language setup.
   - Bitbucket: use `caches`, `artifacts`, and Bitbucket Pipelines service containers.
4. Parameterize all registry URLs, image names, and deploy targets as environment variables or CI secrets — never hardcode them.
5. Add a `pull_request` (or equivalent) trigger that runs lint, test, and security scan but skips push and deploy.
6. After the config, list all secrets/variables that must be configured in the CI platform's settings.
