# Architecture Validator Hook

## What This Hook Does

Scans architecture documents and design specs for completeness gaps. Fires after Claude writes any design or architecture file. Validates that key sections are present (overview, components, data model, APIs, deployment, scalability, security, monitoring, DR, roadmap) and warns if critical sections are missing.

## Settings.json Entry

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/architecture-validator.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook Script: architecture-validator.sh

```bash
#!/bin/bash
# Architecture validator for Solutions Architect Stack
# Checks design documents for completeness
# Exit 1 if critical sections missing, otherwise pass silently

FILE=$(echo "$CLAUDE_TOOL_OUTPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('path',''))" 2>/dev/null)

if [ -z "$FILE" ] || [ ! -f "$FILE" ]; then
  exit 0
fi

# Only check files in designs/, architecture, or blueprint patterns
if ! grep -q "design\|architecture\|blueprint" <<< "$FILE"; then
  exit 0
fi

# Check for critical sections
REQUIRED_SECTIONS=("overview\|diagram" "components" "data\|schema" "api\|contract" "deployment\|topology" "scalab\|bottleneck" "security\|compliance" "monitor\|observab" "disaster recovery\|dr" "roadmap\|timeline")

MISSING=()

for section in "${REQUIRED_SECTIONS[@]}"; do
  if ! grep -iq "$section" "$FILE"; then
    MISSING+=("$section")
  fi
done

if [ ${#MISSING[@]} -gt 0 ]; then
  echo "⚠️  ARCHITECTURE GAPS: Missing key sections in $FILE"
  echo ""
  for missing in "${MISSING[@]}"; do
    echo "  ☐ Missing or vague: $missing"
  done
  echo ""
  echo "This document may not be complete. Consider adding: ${MISSING[*]}"
  echo ""
  echo "Note: This is a warning, not a block. You can proceed, but review is recommended."
  exit 0  # Warning only, don't block
fi
```

## Behavior

**On gaps detected:** Prints warning header with filename, lists missing sections, and recommends review. Does NOT block the write (exit code 0 — informational only).

**On pass:** Silent — no output, Write completes normally.

## Setup Instructions

1. Create `.claude/hooks/` directory in your project root (if it doesn't exist):
   ```bash
   mkdir -p .claude/hooks
   ```

2. Save the script above as `.claude/hooks/architecture-validator.sh`

3. Make the script executable:
   ```bash
   chmod +x .claude/hooks/architecture-validator.sh
   ```

4. Add the settings.json entry above to `.claude/settings.json` (or `.claude/settings.local.json` for local-only enforcement)

5. Restart Claude Code for the hook to take effect

## Notes

This is a **warning-only** hook — it doesn't block output, just alerts you to gaps. Design documents are allowed to evolve iteratively, but completeness is recommended before sharing with customers or handing off to development.
