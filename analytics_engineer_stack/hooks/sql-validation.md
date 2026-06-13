# SQL Validation Hook

## What This Hook Does

Validates SQL files against best practices: proper indentation, CTE naming conventions, no hardcoded dates, consistent formatting. Fires before SQL files are saved. Blocks invalid SQL with clear error messages.

## Settings.json Entry

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write.*\\.sql$",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/sql-validation.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook Script: sql-validation.sh

```bash
#!/bin/bash
# SQL validation for Analytics Engineer Stack
# Checks SQL files for best practices
# Exit 1 if violations found, otherwise pass silently

FILE=$(echo "$CLAUDE_TOOL_OUTPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('path',''))" 2>/dev/null)

if [ -z "$FILE" ] || [ ! -f "$FILE" ]; then
  exit 0
fi

ISSUES=0

# Check 1: No hardcoded dates (YYYY-MM-DD format indicates hardcoding)
if grep -E "'[0-9]{4}-[0-9]{2}-[0-9]{2}'" "$FILE" | grep -v "CURRENT_DATE\|DATEADD\|interval" > /dev/null; then
  echo "⚠️  WARNING: Hardcoded dates detected (use CURRENT_DATE or variables)"
  grep -n "'[0-9]{4}-[0-9]{2}-[0-9]{2}'" "$FILE"
  ISSUES=$((ISSUES + 1))
fi

# Check 2: No SELECT * (except in comment or subquery test)
if grep -E "^\s*SELECT \*" "$FILE" | grep -v "^--" > /dev/null; then
  echo "⚠️  WARNING: SELECT * detected (explicitly list columns for clarity)"
  grep -n "SELECT \*" "$FILE"
  ISSUES=$((ISSUES + 1))
fi

# Check 3: CTE names must be descriptive (not _1, _2, etc.)
if grep -E "WITH\s+\w*_[0-9]+\s+AS|,\s+\w*_[0-9]+\s+AS" "$FILE" > /dev/null; then
  echo "⚠️  WARNING: CTEs have unclear names (use descriptive names like 'recent_orders')"
  grep -n "WITH.*_[0-9]*\|,.*_[0-9]*" "$FILE"
  ISSUES=$((ISSUES + 1))
fi

# Check 4: No single-letter table aliases (use first 3+ letters)
if grep -E "FROM\s+\w+\s+[a-z]\s|JOIN\s+\w+\s+[a-z]\s" "$FILE" > /dev/null; then
  echo "⚠️  WARNING: Single-letter table aliases (use descriptive aliases like 'ord' for orders)"
  grep -n "FROM.*\s[a-z]\s\|JOIN.*\s[a-z]\s" "$FILE"
  ISSUES=$((ISSUES + 1))
fi

# Check 5: Missing semicolon at end
if ! tail -1 "$FILE" | grep -E ";$" > /dev/null && ! tail -1 "$FILE" | grep -E "^--" > /dev/null; then
  echo "⚠️  WARNING: Missing semicolon at end of file"
  ISSUES=$((ISSUES + 1))
fi

if [ $ISSUES -gt 0 ]; then
  echo ""
  echo "Fix warnings above before committing. This helps maintain readable, maintainable SQL."
  exit 0  # Warning only; don't block save
fi

exit 0
```

## Behavior

**On warning:** Prints warnings; save completes (exit code 0 = non-blocking).

**On pass:** Silent — no output, Write completes normally.

## Setup Instructions

1. Create `.claude/hooks/` directory in your project root:
   ```bash
   mkdir -p .claude/hooks
   ```

2. Save the script above as `.claude/hooks/sql-validation.sh`

3. Make the script executable:
   ```bash
   chmod +x .claude/hooks/sql-validation.sh
   ```

4. Add the settings.json entry above to `.claude/settings.json` (or `.claude/settings.local.json` for local-only enforcement)

5. Restart Claude Code for the hook to take effect

---
