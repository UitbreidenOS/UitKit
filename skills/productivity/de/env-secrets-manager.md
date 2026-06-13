---
name: env-secrets-manager
description: "Environment variable and secrets hygiene: audit .env files for committed secrets, validate .env.example completeness, detect secret leaks in git history, and harden local dev security"
---

# Env & Secrets Manager Fertigkeit

## Wann aktivieren
- Überwachung einer Codebase auf versehentlich commitierte Geheimnisse vor der Open-Sourcing
- Validierung, dass .env.example vollständig und aktuell ist
- Überprüfung der git-Historie auf Geheimnislecks (bevor sie öffentlich sind)
- Einrichtung eines neuen Projekts mit richtiger .env-Hygiene von Anfang an
- Onboarding eines neuen Entwicklers, der lokale Geheimnisse sicher einrichten muss

## Wann NICHT verwenden
- Verwaltung von Produktionsgeheimnissen — verwenden Sie die secrets-management-Fertigkeit (Vault, AWS Secrets Manager)
- Geheimnis-Rotation — verwenden Sie die secrets-management-Fertigkeit
- CI/CD-Geheimnisinjection — verwenden Sie die cicd-Fertigkeit

## Anweisungen

### .env Datei-Audit

```
Audit this project's .env files for security issues.

Project root: [path]
Current .env files: [list — .env, .env.local, .env.production, etc.]

Audit checklist:

COMMITTED SECRET DETECTION:
Run these checks to find secrets in tracked files:
git grep -r "sk-" -- "*.env*" "*.json" "*.yml" "*.ts" "*.js" 2>/dev/null
git grep -rE "(api_key|secret|password|token)\s*=\s*['\"][^'\"]{8,}" -- ":!*.example" 2>/dev/null
git grep -rE "AKIA[A-Z0-9]{16}" .  # AWS key pattern
git grep -rE "ghp_[a-zA-Z0-9]{36}" .  # GitHub PAT

GITIGNORE CHECK:
cat .gitignore | grep -E "\.env"
# Should see: .env, .env.local, .env.*.local
# Should NOT see .env.example in .gitignore (that should be committed)

Correct .gitignore entries:
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
# Note: .env.example is intentionally NOT ignored

.env.example completeness check:
diff <(grep -o "^[A-Z_]*=" .env | sort) <(grep -o "^[A-Z_]*=" .env.example | sort)
# Any lines in the first output but not the second = missing from .env.example

FILE PERMISSION CHECK (Unix/Mac):
ls -la .env
# Should be: -rw------- (600) or -rw-r--r-- (644) — not world-writable

Output: list of findings with severity + specific fixes
```

### Geheimnisleck-Erkennung in git-Historie

```
Scan git history for secrets that may have been committed and pushed.

Repository: [current directory]
Scan depth: [full history / last 100 commits / last month]

Tools for history scanning:

OPTION 1 — gitleaks (best coverage):
brew install gitleaks  # or: docker run ghcr.io/gitleaks/gitleaks
gitleaks detect --source . --verbose
gitleaks detect --source . --log-opts="HEAD~100..HEAD"  # last 100 commits

OPTION 2 — git native (no install):
# Find all files that ever contained likely secrets
git log --all --full-history -- "*.env" "*.env.*"
# Show deleted files that had secrets
git log --all --diff-filter=D -- "*.env"

OPTION 3 — truffleHog:
pip install truffleHog
trufflehog git file://. --only-verified

What to do if secrets found in history:

1. Rotate the secret immediately (before doing anything else)
   - API key → generate new one in the provider's console
   - Password → change it
   - JWT secret → rotate and invalidate all sessions

2. Remove from history (only effective for private repos):
   git filter-branch --force --index-filter \
     'git rm --cached --ignore-unmatch path/to/file' \
     --prune-empty --tag-name-filter cat -- --all
   # Or use: git-filter-repo (better tool)
   pip install git-filter-repo
   git filter-repo --path path/to/.env --invert-paths

3. Force push (coordinate with team — rewrites history):
   git push origin --force --all
   git push origin --force --tags

4. If the repo was ever public: assume the secret is compromised regardless

Output: list of commits with detected secrets, remediation steps
```

### .env.example Vorlage

```
Generate a well-structured .env.example for [project type].

Project: [Next.js / Express / FastAPI / full-stack]
Required variables: [list or describe]

Best practices for .env.example:

# Good .env.example: every variable documented
# Format: KEY=description_or_example_value

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/myapp_dev
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE

# Authentication
JWT_SECRET=your-random-32-char-secret-here
# Generate with: openssl rand -hex 32
JWT_EXPIRES_IN=15m  # Access token expiry

# Third-party APIs
STRIPE_SECRET_KEY=sk_test_...
# Get from: https://dashboard.stripe.com/apikeys
# Use sk_test_ for development, sk_live_ for production
STRIPE_WEBHOOK_SECRET=whsec_...
# Get from: Stripe Dashboard → Webhooks → your endpoint → Signing secret

SENDGRID_API_KEY=SG....
# Get from: https://app.sendgrid.com/settings/api_keys

# Cloud storage
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=eu-west-1
AWS_S3_BUCKET=your-bucket-name

# Feature flags
FEATURE_NEW_ONBOARDING=false  # Set to true to enable new onboarding flow

# App config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development  # development | staging | production

Rules for good .env.example:
- Every variable has a comment explaining: what it does + where to get it
- Use realistic placeholder values (sk_test_... not just "key")
- Group by category with blank lines between groups
- Mark which variables are required vs. optional
- Never use real values — even for "safe" ones

Generate the .env.example for my project.
```

### Pre-Commit-Hook-Setup

```
Set up automatic secret scanning before git commits.

Prevents secrets from entering git history in the first place.

OPTION 1 — gitleaks pre-commit hook:
brew install gitleaks

# .git/hooks/pre-commit (or use pre-commit framework)
#!/bin/bash
gitleaks protect --staged --verbose
if [ $? -ne 0 ]; then
  echo "❌ Potential secrets detected. Commit blocked."
  echo "Review the findings above. If false positive, use: git commit --no-verify"
  exit 1
fi

chmod +x .git/hooks/pre-commit

OPTION 2 — pre-commit framework (team-wide):
pip install pre-commit

# .pre-commit-config.yaml
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.0
    hooks:
      - id: gitleaks

# Install for all team members:
pre-commit install

OPTION 3 — git-secrets (AWS-focused):
brew install git-secrets
git secrets --install
git secrets --register-aws  # adds AWS key patterns
git secrets --add 'sk-[a-zA-Z0-9]{20,}'  # OpenAI
git secrets --add 'ghp_[a-zA-Z0-9]{36}'  # GitHub PAT
```

## Beispiel

**Benutzer:** Wir haben gerade ein Repo open-sourced. Wie überprüfe ich, ob wir versehentlich Geheimnisse committed haben?

**Claudes Audit-Plan:**

Führen Sie diese 5 Befehle aus — sie decken 90% der häufigen Geheimnisse ab:

```bash
# 1. Check if any .env files were ever committed
git log --all --full-history -- "**/.env" "**/.env.*" | head -20

# 2. Scan for API key patterns in current files
git grep -rE "(sk-[a-zA-Z0-9]{20,}|AKIA[A-Z0-9]{16}|ghp_[a-zA-Z0-9]{36})" .

# 3. Scan for generic password patterns
git grep -rE "(password|secret|api_key)\s*=\s*['\"][^'\"]{8,}" -- ":!*.example" ":!*.test.*"

# 4. Scan full git history with gitleaks (most thorough)
docker run -v "$(pwd):/repo" ghcr.io/gitleaks/gitleaks detect --source /repo

# 5. Check for .env in git objects (even if .gitignored now)
git log --all --oneline --diff-filter=A -- "**/.env" "*.env"
```

**Wenn Sie etwas finden:**
1. Drehen Sie den Schlüssel sofort — warten Sie nicht
2. GitHub hat Ihr Repo bereits gescannt (sie benachrichtigen Anbieter wie Stripe, AWS bei Push)
3. Gehen Sie davon aus, dass der Schlüssel kompromittiert ist, wenn das Repo zu irgendeinem Zeitpunkt öffentlich war
4. Verwenden Sie git-filter-repo, um es aus der Historie zu entfernen + Force-Push

---
