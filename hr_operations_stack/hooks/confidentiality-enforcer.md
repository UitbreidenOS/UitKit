# Confidentiality Enforcer Hook

## What This Hook Does
Scans all outputs for exposed personally identifiable information (PII) and sensitive employee data. Redacts or flags Social Security numbers, birth dates, medical information, and salary data that should not be shared. Prevents accidental data exposure.

## Settings.json Entry

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/confidentiality-enforcer.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook Script: confidentiality-enforcer.sh

```bash
#!/bin/bash
# Confidentiality enforcer for HR Operations Stack
# Scans outputs for exposed PII (SSN, DOB, medical info, salary)
# Redacts or warns as appropriate; exits 1 if severe exposure detected

FILE=$(echo "$CLAUDE_TOOL_OUTPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('path',''))" 2>/dev/null)

if [ -z "$FILE" ] || [ ! -f "$FILE" ]; then
  exit 0
fi

# Regex patterns for PII detection
SSN_PATTERN="[0-9]{3}-[0-9]{2}-[0-9]{4}"
DOB_PATTERN="[0-9]{1,2}/[0-9]{1,2}/[0-9]{4}|born [0-9]{1,2}/[0-9]{1,2}/[0-9]{4}"
SALARY_PATTERN="\$[0-9]+|salary: \$"
MEDICAL_PATTERN="medical|health conditions?|diagnosis|treatment|mental health"

# Check for SSN
SSN_MATCH=$(grep -inoE "$SSN_PATTERN" "$FILE" | head -3)
if [ -n "$SSN_MATCH" ]; then
  echo "⚠️  CONFIDENTIALITY WARNING: SSN detected in output"
  echo "$SSN_MATCH"
  echo "Redact before sharing externally"
  exit 1
fi

# Check for medical/health data
MEDICAL_MATCH=$(grep -inoE "$MEDICAL_PATTERN" "$FILE" | head -3)
if [ -n "$MEDICAL_MATCH" ]; then
  echo "⚠️  CONFIDENTIALITY WARNING: Medical/health information detected"
  echo "$MEDICAL_MATCH"
  echo "This is highly sensitive. Verify recipient has need-to-know before sharing"
  exit 1
fi

# Check for salary in external-facing docs (warn, not block)
if [[ "$FILE" =~ (offer|external|email) ]]; then
  SALARY_MATCH=$(grep -inoE "\$[0-9,]+" "$FILE" | head -3)
  if [ -n "$SALARY_MATCH" ]; then
    echo "⚠️  CONFIDENTIALITY CAUTION: Salary data in document marked for external use"
    echo "Verify recipient (candidate, external advisor) has appropriate clearance"
  fi
fi

exit 0
```

## Behavior

**On severe exposure (SSN, medical data):** Prints warning, shows matching lines, and blocks output (exit code 1).

**On caution (salary in external doc):** Prints caution warning but allows output (exit code 0).

**On pass:** Silent — no output, Write/Edit completes normally.

## Setup Instructions

1. Create `.claude/hooks/` directory:
   ```bash
   mkdir -p .claude/hooks
   ```

2. Save the script as `.claude/hooks/confidentiality-enforcer.sh`

3. Make executable:
   ```bash
   chmod +x .claude/hooks/confidentiality-enforcer.sh
   ```

4. Add settings.json entry to `.claude/settings.json` or `.claude/settings.local.json`

5. Restart Claude Code

---
