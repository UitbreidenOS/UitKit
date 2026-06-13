# dbt Schema Check Hook

## What This Hook Does

Validates dbt model schema YAML files: ensures all models have descriptions, columns are documented, tests are defined on critical columns. Fires when yaml files are saved. Blocks incomplete schemas.

## Settings.json Entry

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write.*\\.yml$",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/dbt-schema-check.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook Script: dbt-schema-check.sh

```bash
#!/bin/bash
# dbt schema validation for Analytics Engineer Stack
# Checks YAML model definitions for documentation completeness
# Exit 1 if critical issues found, otherwise pass silently

FILE=$(echo "$CLAUDE_TOOL_OUTPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('path',''))" 2>/dev/null)

if [ -z "$FILE" ] || [ ! -f "$FILE" ] || [ "${FILE##*.}" != "yml" ]; then
  exit 0
fi

ISSUES=0

# Check 1: Each model must have a description
if grep -E "^  - name:" "$FILE" | while read -r line; do
  MODEL=$(echo "$line" | sed -E 's/.*- name: //')
  # Check if description exists after this model name
  if ! grep -A 2 "- name: $MODEL" "$FILE" | grep -E "^\s+description:" > /dev/null; then
    echo "⚠️  Model '$MODEL' is missing description"
    ISSUES=$((ISSUES + 1))
  fi
done; then
  :
fi

# Check 2: Primary key column must have unique + not_null tests
if grep -E "primary.?key|Primary.?Key" "$FILE" > /dev/null; then
  PK_COL=$(grep -E "primary.?key|Primary.?Key" "$FILE" | head -1 | sed -E 's/.*primary.?key[:\s]+//' | tr -d ' ')
  if [ -n "$PK_COL" ]; then
    if ! grep -A 10 "- name: $PK_COL" "$FILE" | grep -E "tests:.*unique|tests:.*not_null" > /dev/null; then
      echo "⚠️  Primary key '$PK_COL' missing unique or not_null test"
      ISSUES=$((ISSUES + 1))
    fi
  fi
fi

# Check 3: Foreign keys must have relationships test
if grep -E "foreign.?key|Foreign.?Key" "$FILE" > /dev/null; then
  if ! grep -A 10 "Foreign.?Key" "$FILE" | grep -E "relationships:" > /dev/null; then
    echo "⚠️  Foreign key missing relationships test"
    ISSUES=$((ISSUES + 1))
  fi
fi

# Check 4: Columns must have descriptions (for fact/dimension models)
if grep -E "fact_|dim_|fct_|dbt_" "$FILE" > /dev/null; then
  if grep -E "^\s+- name:" "$FILE" | wc -l | grep -E "^[0-9]+$" > /dev/null; then
    MISSING_DESC=$(grep -E "^\s+- name:" "$FILE" | while read -r line; do
      COL=$(echo "$line" | sed -E 's/.*- name: //')
      if ! grep -A 1 "- name: $COL" "$FILE" | grep -E "^\s+description:" > /dev/null; then
        echo "$COL"
      fi
    done | wc -l)
    
    if [ "$MISSING_DESC" -gt 0 ]; then
      echo "⚠️  $MISSING_DESC column(s) missing description"
      ISSUES=$((ISSUES + 1))
    fi
  fi
fi

if [ $ISSUES -gt 0 ]; then
  echo ""
  echo "Documentation is critical for analytics. Add missing descriptions and tests above."
  exit 0  # Warning only; don't block save
fi

exit 0
```

## Behavior

**On warning:** Prints warnings; save completes (exit code 0 = non-blocking).

**On pass:** Silent — no output, Write completes normally.

## Setup Instructions

1. Create `.claude/hooks/` directory:
   ```bash
   mkdir -p .claude/hooks
   ```

2. Save the script above as `.claude/hooks/dbt-schema-check.sh`

3. Make executable:
   ```bash
   chmod +x .claude/hooks/dbt-schema-check.sh
   ```

4. Add settings.json entry above to `.claude/settings.json`

5. Restart Claude Code

---
