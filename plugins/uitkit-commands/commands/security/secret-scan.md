---
description: Scan the codebase for secrets, credentials, and sensitive values committed or hardcoded
argument-hint: "[path or git-ref]"
---
Scan `$ARGUMENTS` (default: entire repo including git history) for secrets, credentials, and sensitive values that must not appear in source control or deployed artifacts.

**Phase 1 — Pattern scan (source files)**

Search all non-binary files for:
- API keys and tokens: patterns like `sk-`, `ghp_`, `xoxb-`, `AKIA`, `AIza`, UUIDs used as secrets
- Private keys: PEM headers (`-----BEGIN * PRIVATE KEY-----`), SSH private key blocks
- Passwords: variables named `password`, `passwd`, `pwd`, `secret`, `token`, `api_key` assigned string literals
- Connection strings: DSNs with embedded credentials (`postgres://user:pass@host`)
- JWT secrets: hardcoded signing keys
- OAuth secrets: `client_secret` literals
- Cloud provider credentials: AWS, GCP, Azure, Terraform, Kubernetes service account tokens
- Webhook URLs with embedded tokens (Slack, Discord, GitHub)
- `.env` file contents accidentally committed

**Phase 2 — Git history scan** (if inside a git repo)

Run: `git log --all --full-history -- '*.env' '*.pem' '*.key' '*.p12' '*.pfx'`
Check recent commits for accidental secret commits that may have been "deleted" but remain in history.

**Phase 3 — Config and infrastructure files**

Examine: `docker-compose.yml`, Kubernetes manifests, Helm values, CI/CD configs (`.github/`, `.circleci/`, `.travis.yml`, `Jenkinsfile`) for hardcoded env values.

**Phase 4 — Triage each finding**

For every hit:
- File path and line number
- Secret type (e.g., AWS Access Key, GitHub PAT)
- Whether it appears to be real or a placeholder/example (flag as LIVE or EXAMPLE)
- Whether it appears in git history (flag as HISTORY if so)

**Output format**:
```
## Secret Scan Results

### LIVE Secrets (rotate immediately)
[file:line] [type] — masked preview: sk-...xxxx

### EXAMPLE / Placeholder (verify)
[file:line] [type] — context: ...

### History Leaks
[commit] [file] [type] — note: still accessible via git

### Remediation
1. Rotate all LIVE secrets before doing anything else.
2. Use git-filter-repo or BFG to purge history leaks.
3. Add detected patterns to .gitignore and pre-commit hooks.
```

Never print the full secret value — always mask to last 4 characters.
