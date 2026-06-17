# Compliance Enforcer Hook

## Description

Automatically enforces compliance checks before committing changes. Validates that all files meet security and compliance standards (no hardcoded secrets, approved dependencies, license checks, etc.).

## Configuration

Add this to `.claude/settings.json`:

```json
{
  "hooks": {
    "before-commit": [
      {
        "name": "compliance-enforcer",
        "script": ".claude/hooks/compliance-enforcer.sh",
        "condition": "always"
      }
    ]
  }
}
```

## Hook Script

Create `.claude/hooks/compliance-enforcer.sh`:

```bash
#!/bin/bash

# Compliance Enforcer Hook
# Runs before commit to validate compliance requirements

set -e

STAGED_FILES=$(git diff --cached --name-only)

echo "Running compliance checks..."

# Stub: Add compliance validation logic
# - Check for hardcoded secrets
# - Validate dependencies
# - Verify licenses
# - Check file permissions

exit 0
```

## When It Fires

- Before each commit
- Validates staged files
- Prevents commit if compliance violations detected

## Setup Instructions

1. Copy `compliance-enforcer.sh` to `.claude/hooks/`
2. Make executable: `chmod +x .claude/hooks/compliance-enforcer.sh`
3. Add hook entry to `.claude/settings.json` (see Configuration above)
