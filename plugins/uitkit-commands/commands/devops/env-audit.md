---
description: Audit environment variable usage across the codebase for security and hygiene issues
argument-hint: "[path or file glob to scan]"
---
Audit environment variable usage in: $ARGUMENTS (default: entire project)

Scan all source files, config files, Dockerfiles, compose files, CI/CD definitions, and deployment manifests.

Report findings in these categories:

**1. Secrets at risk**
- Hardcoded credentials, tokens, API keys, or passwords in any file tracked by git
- `.env` files that are not gitignored
- Secrets interpolated directly into shell `run:` steps in CI (injection risk)
- Docker `ARG`/`ENV` instructions that bake secrets into image layers

**2. Missing variables**
- Variables referenced in code (process.env.X, os.environ["X"], os.Getenv("X"), etc.) that have no corresponding entry in `.env.example`, `docker-compose.yml`, Kubernetes Secret/ConfigMap, or documented defaults
- Required variables with no fallback that would cause a runtime panic/crash if unset

**3. Unused variables**
- Variables declared in `.env`, `.env.example`, Compose, or manifests that are never read in code

**4. Inconsistencies**
- Variable names that differ between environments (e.g., `DATABASE_URL` in compose vs `DB_URL` in k8s)
- Variables with defaults in one environment but required in another
- Duplicated declarations across multiple files with potentially different values

**5. Hygiene**
- Non-standard naming (should be `SCREAMING_SNAKE_CASE`)
- Variables that contain sensitive data but are not marked `sensitive` in Terraform or `type: kubernetes.io/Opaque` in k8s Secrets
- `.env` files committed with real values

Output format:
- Group findings by category above
- For each finding: file path + line number, severity (`critical` / `warning` / `info`), and one-line remediation
- End with a summary count per severity and a prioritized fix list (critical items first)

Do not print file contents verbatim — cite locations and quote only the relevant line.
