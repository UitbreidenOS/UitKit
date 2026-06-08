# Secrets Management Rules

Apply whenever code handles API keys, passwords, tokens, certificates, or credentials.

## Never do these

- Never commit secrets to version control — not even in private repos, not even temporarily
- Never hardcode secrets as string literals in source code
- Never store secrets in environment variable files (`.env`) checked into git
- Never log secrets — not on startup, not in debug output, not in error messages
- Never transmit secrets in URLs or query parameters — they end up in access logs and browser history

## Where secrets live

- Use a dedicated secrets manager in all production environments: AWS Secrets Manager, GCP Secret Manager, HashiCorp Vault, or Azure Key Vault
- Inject secrets at runtime via environment variables from the secrets manager — not via files baked into container images
- For local development: `.env` files are acceptable but must be in `.gitignore`; provide a `.env.example` with placeholder values
- CI/CD pipelines: use the platform's secrets store (GitHub Actions secrets, GitLab CI variables); never echo them in logs

## Rotation

- All secrets must have a defined rotation schedule — API keys rotate at least annually, database passwords at least quarterly
- Design services to accept a new secret without downtime: support dual-credential windows during rotation
- Automate rotation where the provider supports it; manual rotation is error-prone
- Revoke compromised credentials immediately — before investigating the scope of the leak

## Access control

- Grant least privilege: a secret is scoped to the service that needs it, not shared across services
- Use separate credentials per environment (dev, staging, production) — never share production secrets
- Audit who and what has access to each secret; review quarterly
- Service-to-service authentication: use short-lived tokens (OIDC workload identity, IAM roles) rather than static API keys where possible

## Detection

- Enable secret scanning in CI (GitHub secret scanning, GitLeaks, truffleHog) — fail the pipeline on a hit
- Scan git history when enabling this for an existing repo — assume secrets committed historically are compromised
- Set up alerts for anomalous usage of production credentials (unusual call volumes, new source IPs)

## When a secret is leaked

1. Revoke the credential immediately — do not wait for investigation
2. Audit the access logs for the credential's lifetime
3. Rotate all secrets that could have been exposed in the same breach vector
4. Remove the secret from git history using `git filter-repo`; force-push; notify all forks
