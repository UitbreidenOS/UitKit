# Compliance Check Hook

## Purpose

Intercepts content generation and flags legally risky claims before publication. Blocks unsupported assertions, competitor disparagement, misleading claims, and unverified data. Prevents brand and legal risk exposure.

## Settings.json Entry

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          { "type": "command", "command": "bash .claude/hooks/compliance-check.sh" }
        ]
      }
    ]
  }
}
```

## Hook Script (compliance-check.sh)

```bash
#!/bin/bash
# Reads the tool output from CLAUDE_TOOL_OUTPUT (content just written)
# Scans for legal/compliance risks
# Exit 1 blocks execution on critical violations; 0 allows with warnings

CONTENT="$CLAUDE_TOOL_OUTPUT"
CRITICAL_VIOLATIONS=0

# Check for competitor disparagement
if echo "$CONTENT" | grep -qi "competitor.*worse\|inferior\|cheaper than\|better than.*competitor\|we're the only\|no one else"; then
  echo "🚨 COMPLIANCE BLOCK: Competitor disparagement detected. Don't attack competitors directly." >&2
  CRITICAL_VIOLATIONS=$((CRITICAL_VIOLATIONS + 1))
fi

# Check for unsupported superlatives
if echo "$CONTENT" | grep -qi "the best\|the only\|proven to\|guaranteed\|always\|never"; then
  echo "⚠️  COMPLIANCE RISK: Unsupported superlative found. Verify with data before using." >&2
fi

# Check for unattributed claims
if echo "$CONTENT" | grep -qi "studies show\|research proves\|data shows" && ! echo "$CONTENT" | grep -qi "according to\|from\|published in\|source:"; then
  echo "⚠️  COMPLIANCE RISK: Claim made without source attribution. Add citation." >&2
fi

# Check for misleading language patterns
if echo "$CONTENT" | grep -qi "may help\|could assist\|supposedly\|alleged"; then
  echo "⚠️  COMPLIANCE RISK: Qualifying language detected. Strengthen or remove unclear claims." >&2
fi

# Check for medical/legal/financial claims if applicable
if echo "$CONTENT" | grep -qi "cure\|treat\|diagnose\|legal advice\|investment opportunity\|guaranteed returns"; then
  echo "🚨 COMPLIANCE BLOCK: Restricted claim type detected. Consult legal before publishing." >&2
  CRITICAL_VIOLATIONS=$((CRITICAL_VIOLATIONS + 1))
fi

# Exit with error if critical violations found
if [ $CRITICAL_VIOLATIONS -gt 0 ]; then
  echo "🚨 COMPLIANCE CHECK FAILED: $CRITICAL_VIOLATIONS critical violation(s). Content blocked." >&2
  exit 1
else
  echo "✓ COMPLIANCE CHECK: No critical violations. Warnings may apply." >&2
  exit 0
fi
```

## Behavior

- **On critical violations:** Exit code 1 blocks the Write tool. Content is not committed.
- **On warnings:** Exit code 0 allows tool to proceed. Warnings are logged but don't block.
- **Critical violations block:**
  - Competitor disparagement
  - Medical, legal, financial claims without proper caveats
  - False assertions

## Setup

1. Save script as `.claude/hooks/compliance-check.sh` and `chmod +x`
2. Add settings.json entry under `PostToolUse` hooks for `Write` tool
3. When content is written, hook scans for compliance issues

## Example Output

```
🚨 COMPLIANCE BLOCK: Competitor disparagement detected. Don't attack competitors directly.
🚨 COMPLIANCE CHECK FAILED: 1 critical violation(s). Content blocked.
```

---

## What Triggers Blocks

- Phrases like "we're better than [competitor]"
- "Our solution is the only one that..."
- Direct attacks on competitor products
- Medical/legal/financial claims without source

## What Triggers Warnings

- Unsupported claims ("the best," "proven," "guaranteed")
- Statistics without source attribution
- Unclear qualifying language ("may help," "could")

---
