# Security Scanner Hook

## Description

Automatic security scanning hook that runs before commits to detect common vulnerabilities, exposed credentials, and insecure dependencies. Scans for hardcoded secrets, dependency vulnerabilities, and unsafe patterns in code.

## When it fires

- Before `git commit` (pre-commit hook)
- On manual invocation via `/security-scanner` command

## Settings Configuration

Add this to `.claude/settings.json`:

```json
{
  "hooks": {
    "pre-commit": {
      "security-scanner": {
        "enabled": true,
        "script": "fullstack_developer_stack/hooks/security-scanner.sh",
        "failOnError": true,
        "timeout": 30000
      }
    }
  }
}
```

## Hook Script

Create `fullstack_developer_stack/hooks/security-scanner.sh`:

```bash
#!/bin/bash

# Security Scanner Hook
# Scans for: hardcoded secrets, credential exposure, unsafe dependencies
# Exits with status 1 if vulnerabilities found, 0 if clean

set -e

REPO_ROOT=$(git rev-parse --show-toplevel)
STAGED_FILES=$(git diff --cached --name-only)
SCAN_DIR="${1:-.}"
FAIL_COUNT=0

# Colors
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

echo "Running security scan..."

# 1. Check for hardcoded secrets and credentials
echo -e "\n${YELLOW}[1/4] Scanning for hardcoded secrets...${NC}"
SECRET_PATTERNS=(
  'password["\x27]?\s*[:=]'
  'api[_-]?key["\x27]?\s*[:=]'
  'secret["\x27]?\s*[:=]'
  'token["\x27]?\s*[:=]'
  'aws_access_key_id'
  'aws_secret_access_key'
  'private[_-]?key'
  'BEGIN RSA PRIVATE KEY'
  'BEGIN OPENSSH PRIVATE KEY'
)

for pattern in "${SECRET_PATTERNS[@]}"; do
  if git diff --cached --unified=0 | grep -iE "$pattern" > /dev/null 2>&1; then
    echo -e "${RED}✗ Hardcoded secret detected: $pattern${NC}"
    ((FAIL_COUNT++))
  fi
done

# 2. Check for .env and secrets files in staging
echo -e "${YELLOW}[2/4] Checking for sensitive files...${NC}"
SENSITIVE_FILES=('.env' '.env.local' '.env.*.local' 'secrets.yml' 'credentials.json' 'keyfile' '.aws/credentials')

for file in "${SENSITIVE_FILES[@]}"; do
  if echo "$STAGED_FILES" | grep -E "^$file$" > /dev/null 2>&1; then
    echo -e "${RED}✗ Sensitive file staged: $file${NC}"
    ((FAIL_COUNT++))
  fi
done

# 3. Node.js/npm dependency vulnerabilities
if [ -f "$REPO_ROOT/package.json" ]; then
  echo -e "${YELLOW}[3/4] Checking npm dependencies for vulnerabilities...${NC}"
  if command -v npm &> /dev/null; then
    if npm audit --audit-level=high 2>&1 | grep -i "found.*vulnerabilities" > /dev/null; then
      echo -e "${RED}✗ npm audit found high-severity vulnerabilities${NC}"
      ((FAIL_COUNT++))
    fi
  fi
fi

# 4. Python dependency vulnerabilities
if [ -f "$REPO_ROOT/requirements.txt" ] || [ -f "$REPO_ROOT/Pipfile" ]; then
  echo -e "${YELLOW}[4/4] Checking Python dependencies...${NC}"
  if command -v safety &> /dev/null; then
    if safety check --json 2>&1 | grep -q '"vulnerabilities"'; then
      echo -e "${RED}✗ Python dependencies have known vulnerabilities${NC}"
      ((FAIL_COUNT++))
    fi
  fi
fi

# Results
if [ $FAIL_COUNT -eq 0 ]; then
  echo -e "\n${GREEN}✓ Security scan passed${NC}"
  exit 0
else
  echo -e "\n${RED}✗ Security scan failed ($FAIL_COUNT issues found)${NC}"
  echo "Fix issues before committing, or use 'git commit --no-verify' to skip (not recommended)"
  exit 1
fi
```

## Installation

1. Copy the script to your repository:
   ```bash
   mkdir -p fullstack_developer_stack/hooks
   cp security-scanner.sh fullstack_developer_stack/hooks/
   chmod +x fullstack_developer_stack/hooks/security-scanner.sh
   ```

2. Update `.claude/settings.json` with the configuration above

3. Optional: Install additional scanners for enhanced detection:
   ```bash
   npm install --save-dev eslint-plugin-security
   pip install safety bandit
   ```

## What it checks

- **Hardcoded secrets**: Detects common credential patterns (API keys, passwords, tokens, AWS keys, private keys)
- **Sensitive files**: Prevents accidental staging of `.env`, `credentials.json`, etc.
- **npm vulnerabilities**: Runs `npm audit` for Node.js projects
- **Python vulnerabilities**: Uses `safety` or `bandit` for Python projects
- **Credential patterns**: Regex matching for common secret formats

## Bypass (if necessary)

To skip the security scanner for a single commit:
```bash
git commit --no-verify
```

To temporarily disable the hook, comment out the configuration in `.claude/settings.json`.

## Exit codes

- `0`: Security scan passed
- `1`: Security issues detected
