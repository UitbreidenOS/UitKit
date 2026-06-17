# Finding Logger Hook

## Purpose
Automatically log security findings and analysis results to a structured findings file during security review workflows.

## When It Fires
After security analysis completes or when findings are ready for export.

## settings.json Configuration

```json
{
  "hooks": {
    "after_security_review": {
      "script": "hooks/finding-logger.sh",
      "enabled": true
    }
  }
}
```

## Hook Script

```bash
#!/bin/bash
# finding-logger.sh — Log security findings to findings registry

# Setup instructions:
# 1. Copy this script to hooks/finding-logger.sh
# 2. Make executable: chmod +x hooks/finding-logger.sh
# 3. Add hook entry to settings.json under hooks.after_security_review

FINDINGS_DIR="${PROJECT_ROOT}/.findings"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
FINDINGS_LOG="${FINDINGS_DIR}/findings-${TIMESTAMP}.json"

# Create findings directory if needed
mkdir -p "${FINDINGS_DIR}"

# Log finding data
# Stub: implement finding capture and structured logging
echo "Finding logger initialized at ${TIMESTAMP}"
```

## Behavior

This hook:
- Captures security findings from review output
- Stores findings in a timestamped log file
- Maintains a structured registry for historical tracking
- Enables cross-reference of findings across review cycles

## Status
Stub — pending implementation details and finding schema definition.
